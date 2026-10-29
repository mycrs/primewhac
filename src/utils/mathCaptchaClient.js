/**
 * Matematik doğrulama (math-captcha) istemcisi.
 * Cloudflare Turnstile / hCaptcha yerine kendi sistemimiz.
 *
 * Ortak sözleşme:
 * - fetchMathChallenge()  → { ok: true, id, question } | { ok: false, error }
 * - verifyMathCaptcha(id, answer) → { ok: true } | { ok: false, error?, fetchFailed? }
 * - mathCaptchaUserMessage(result) → Türkçe kullanıcı mesajı (string)
 *
 * Sunucu: Supabase Deno Edge Function `math-captcha`
 * - POST { action: 'challenge' } → { success: true, id, question: '7 + 4 = ?' }
 * - POST { action: 'verify', id, answer } → { success: true } | { success: false, error }
 *
 * Dayanıklılık (Resilience):
 * - VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY eksikse varsayılan değerlerle çalışır.
 * - Edge Function'a ulaşılamazsa (ağ, CORS, 429 rate limit vb.) yerel (local) matematik
 *   sorusu üreterek yöneticinin ve kullanıcıların kilitlenmesini kesinlikle önler.
 */

const DEFAULT_URL = 'https://pkppewdtnuchwjtmulev.supabase.co';
const DEFAULT_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcHBld2R0bnVjaHdqdG11bGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDIzMzIsImV4cCI6MjA2NjQ3ODMzMn0.P2KIzJHmDCPOHrWQymZJEjhg4opXKn8DBD6NDCsWshI';

function supabaseFunctionsBase() {
  const u = import.meta.env.VITE_SUPABASE_URL;
  if (u && typeof u === 'string' && u.trim() && u !== 'YOUR_SUPABASE_URL') {
    return u.trim().replace(/\/$/, '');
  }
  return DEFAULT_URL;
}

const MATH_CAPTCHA_URL = `${supabaseFunctionsBase()}/functions/v1/math-captcha`;

function mathCaptchaHeaders() {
  const rawAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const anon =
    rawAnon && typeof rawAnon === 'string' && rawAnon.trim() && rawAnon !== 'YOUR_SUPABASE_ANON_KEY'
      ? rawAnon.trim()
      : DEFAULT_ANON;

  return {
    'Content-Type': 'application/json',
    apikey: anon,
    Authorization: `Bearer ${anon}`,
  };
}

// Yerel (fallback) sorular için hafıza tablosu: id -> { answer, expiresAt }
const localChallenges = new Map();

function generateLocalChallenge() {
  const a = Math.floor(Math.random() * 9) + 1; // 1-9
  const b = Math.floor(Math.random() * 9) + 1; // 1-9
  const isSub = Math.random() < 0.3 && a > b;
  const question = isSub ? `${a} - ${b} = ?` : `${a} + ${b} = ?`;
  const answer = String(isSub ? a - b : a + b);
  const id = `loc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // 10 dakika geçerli
  localChallenges.set(id, {
    answer,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  // Eski kayıtları fırsatçı temizle
  const now = Date.now();
  for (const [k, v] of localChallenges.entries()) {
    if (v.expiresAt < now) localChallenges.delete(k);
  }

  return { ok: true, id, question };
}

/**
 * Ortak POST yardımcısı. Ağ hatasında fetchFailed: true döner.
 * @returns {{ httpOk: boolean, status: number, body: object, fetchFailed: boolean }}
 */
async function postMathCaptcha(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 sn zaman aşımı

    const res = await fetch(MATH_CAPTCHA_URL, {
      method: 'POST',
      headers: mathCaptchaHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    let body = {};
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    return { httpOk: res.ok, status: res.status, body, fetchFailed: false };
  } catch {
    return { httpOk: false, status: 0, body: {}, fetchFailed: true };
  }
}

/**
 * Yeni bir matematik sorusu (challenge) alır.
 * Edge Function çalışıyorsa oradan alır; ulaşılamazsa güvenli yerel soru üretir.
 * @returns {Promise<{ ok: true, id: string, question: string } | { ok: false, error: string, fetchFailed?: boolean }>}
 */
export async function fetchMathChallenge() {
  try {
    const r = await postMathCaptcha({ action: 'challenge' });
    if (!r.fetchFailed && r.httpOk && r.body?.success === true && r.body?.id && r.body?.question) {
      return { ok: true, id: String(r.body.id), question: String(r.body.question) };
    }
  } catch {
    /* edge function erişilemedi, yerel fallback'e geç */
  }

  // Sunucuya ulaşılamazsa kullanıcıyı asla kilitleme: yerel soru üret
  return generateLocalChallenge();
}

/**
 * Challenge cevabını doğrular. Challenge tek kullanımlıktır.
 * @returns {Promise<{ ok: true } | { ok: false, error?: string, fetchFailed?: boolean }>}
 */
export async function verifyMathCaptcha(id, answer) {
  if (!id || answer === undefined || answer === null || String(answer).trim() === '') {
    return { ok: false, error: 'Doğrulama bilgisi eksik. Lütfen soruyu yeniden cevaplayın.' };
  }

  const cleanAnswer = String(answer).trim();

  // 1. Yerel fallback sorusu ise doğrula
  if (typeof id === 'string' && id.startsWith('loc_')) {
    const stored = localChallenges.get(id);
    localChallenges.delete(id); // Tek kullanımlık

    if (!stored || Date.now() > stored.expiresAt) {
      return { ok: false, error: 'Güvenlik sorusunun süresi doldu. Lütfen yeni soruyu cevaplayın.' };
    }
    if (stored.answer !== cleanAnswer) {
      return { ok: false, error: 'Güvenlik sorusu cevabı hatalı. Lütfen tekrar deneyin.' };
    }
    return { ok: true };
  }

  // 2. Sunucu tarafı challenge ise Edge Function'a gönder
  const r = await postMathCaptcha({
    action: 'verify',
    id: String(id),
    answer: cleanAnswer,
  });

  if (r.fetchFailed) {
    // Ağ kopukluğu durumunda kullanıcıyı kilitlememek için
    return {
      ok: false,
      fetchFailed: true,
      error: 'Doğrulama sunucusuna ulaşılamadı. Lütfen tekrar deneyin.',
    };
  }

  if (!r.httpOk || r.body?.success !== true) {
    return {
      ok: false,
      error: r.body?.error || 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.',
    };
  }

  return { ok: true };
}

/**
 * verifyMathCaptcha / fetchMathChallenge sonucunu Türkçe kullanıcı mesajına çevirir.
 * @param {{ ok: boolean, error?: string, fetchFailed?: boolean } | null} result
 * @returns {string} Başarılıysa boş string.
 */
export function mathCaptchaUserMessage(result) {
  if (!result || result.ok) return '';
  if (typeof result.error === 'string' && result.error.trim()) {
    return result.error;
  }
  return 'Güvenlik doğrulaması başarısız. Lütfen yeni soruyu cevaplayın.';
}
