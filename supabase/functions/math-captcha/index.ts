/**
 * Matematik tabanlı bot doğrulaması (math-captcha) — Cloudflare Turnstile / hCaptcha yerine.
 *
 * Aksiyonlar (POST, JSON):
 *   { action: 'challenge' }                    → { success: true, id, question: '7 + 4 = ?' }
 *   { action: 'verify', id, answer }           → { success: true } | { success: false, error }
 *
 * Kurallar:
 *   - Cevap DB'de yalnızca SHA-256 hash (trim + lowercase normalize) olarak tutulur.
 *   - Her challenge tek kullanımlık, 10 dakika geçerli, en fazla 3 deneme.
 *   - IP başına saatte en fazla 20 challenge üretilebilir.
 *   - Süresi geçmiş veya 1 günden eski kayıtlar fırsatçı olarak silinir.
 *
 * Tablo kurulumu: supabase/math_captcha_setup.sql (public.captcha_challenges)
 * Secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (Supabase Edge Functions'ta otomatik tanımlı)
 */
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.30.0';

const ALLOWED_ORIGINS = new Set([
  'https://cineverse.pro',
  'https://www.cineverse.pro',
  'https://qruzetv.com',
  'https://www.qruzetv.com',
  'https://satinaliptv.sbs',
  'https://www.satinaliptv.sbs',
  'https://streamtr.eu',
  'https://www.streamtr.eu',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const CHALLENGE_TTL_MS = 10 * 60 * 1000; // 10 dakika
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_PER_HOUR = 20;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get('Origin') ?? '';
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : 'https://satinaliptv.sbs';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
  };
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return 'unknown';
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase();
}

/** 1-10 arası iki sayı; toplama ağırlıklı, bazen çıkarma (sonuç her zaman pozitif). */
function generateChallenge(): { question: string; answer: number } {
  const a = 1 + Math.floor(Math.random() * 10);
  const b = 1 + Math.floor(Math.random() * 10);
  const useSubtraction = Math.random() < 0.25;
  if (useSubtraction && a !== b) {
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    return { question: `${big} - ${small} = ?`, answer: big - small };
  }
  return { question: `${a} + ${b} = ?`, answer: a + b };
}

/** Süresi geçmiş / 1 günden eski kayıtları fırsatçı temizle. Hata sessizce yutulur. */
async function cleanupOldChallenges(supabase: SupabaseClient): Promise<void> {
  try {
    const nowIso = new Date().toISOString();
    const dayAgoIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('captcha_challenges')
      .delete()
      .or(`expires_at.lt.${nowIso},created_at.lt.${dayAgoIso}`);
  } catch (e) {
    console.warn('[math-captcha] temizlik hatası:', e instanceof Error ? e.message : String(e));
  }
}

type VerifyResult = { success: true } | { success: false; error: string; status: number };

async function verifyChallenge(
  supabase: SupabaseClient,
  id: string,
  answerRaw: string,
): Promise<VerifyResult> {
  const { data: row, error } = await supabase
    .from('captcha_challenges')
    .select('id, answer_hash, expires_at, attempts, used')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[math-captcha] verify select:', error.message);
    return { success: false, error: 'Doğrulama sırasında sunucu hatası', status: 500 };
  }
  if (!row) {
    return {
      success: false,
      error: 'Doğrulama oturumu bulunamadı. Sayfayı yenileyip tekrar deneyin.',
      status: 400,
    };
  }
  if (row.used) {
    return { success: false, error: 'Bu doğrulama kodu zaten kullanıldı. Yeni soru alın.', status: 400 };
  }
  if (new Date(row.expires_at as string).getTime() <= Date.now()) {
    return { success: false, error: 'Doğrulama kodunun süresi doldu. Yeni soru alın.', status: 400 };
  }
  const attempts = Number(row.attempts) || 0;
  if (attempts >= MAX_ATTEMPTS) {
    return { success: false, error: 'Deneme hakkınız doldu. Yeni soru alın.', status: 400 };
  }

  const hash = await sha256Hex(normalizeAnswer(answerRaw));
  if (hash !== row.answer_hash) {
    const newAttempts = attempts + 1;
    await supabase.from('captcha_challenges').update({ attempts: newAttempts }).eq('id', id);
    const left = MAX_ATTEMPTS - newAttempts;
    if (left <= 0) {
      return {
        success: false,
        error: 'Doğrulama kodu hatalı, deneme hakkınız doldu. Yeni soru alın.',
        status: 400,
      };
    }
    return { success: false, error: `Doğrulama kodu hatalı, kalan deneme: ${left}`, status: 400 };
  }

  await supabase.from('captcha_challenges').update({ used: true }).eq('id', id);
  return { success: true };
}

Deno.serve(async (req: Request) => {
  const headers = { ...corsHeaders(req), 'Content-Type': 'application/json' };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ success: false, error: 'Geçersiz JSON gövdesi' }, { status: 400, headers });
  }

  const action = typeof body?.action === 'string' ? body.action.trim() : '';
  if (action !== 'challenge' && action !== 'verify') {
    return Response.json({ success: false, error: 'Geçersiz işlem' }, { status: 400, headers });
  }

  const url = Deno.env.get('SUPABASE_URL')?.trim() ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim() ?? '';
  if (!url || !serviceKey) {
    return Response.json(
      { success: false, error: 'Sunucu yapılandırması: Supabase service role gerekli (Edge secrets)' },
      { status: 503, headers },
    );
  }

  const supabase = createClient(url, serviceKey);
  await cleanupOldChallenges(supabase);

  if (action === 'challenge') {
    const ip = clientIp(req);

    // IP başına saatte en fazla 20 challenge
    const hourAgoIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from('captcha_challenges')
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', hourAgoIso);
    if (countErr) {
      console.error('[math-captcha] rate limit count:', countErr.message);
      return Response.json(
        { success: false, error: 'Doğrulama sırasında sunucu hatası' },
        { status: 500, headers },
      );
    }
    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return Response.json(
        { success: false, error: 'Çok fazla doğrulama isteği. Lütfen bir süre sonra tekrar deneyin.' },
        { status: 429, headers },
      );
    }

    const { question, answer } = generateChallenge();
    const answerHash = await sha256Hex(normalizeAnswer(String(answer)));
    const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();

    const { data: inserted, error: insErr } = await supabase
      .from('captcha_challenges')
      .insert({ answer_hash: answerHash, ip, expires_at: expiresAt })
      .select('id')
      .single();

    if (insErr || !inserted?.id) {
      console.error('[math-captcha] insert:', insErr?.message);
      return Response.json(
        { success: false, error: 'Doğrulama sorusu oluşturulamadı' },
        { status: 500, headers },
      );
    }

    return Response.json({ success: true, id: inserted.id, question }, { headers });
  }

  // action === 'verify'
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!UUID_RE.test(id)) {
    return Response.json({ success: false, error: 'Geçersiz doğrulama oturumu' }, { status: 400, headers });
  }

  let answer: string;
  if (typeof body.answer === 'string') {
    answer = body.answer;
  } else if (typeof body.answer === 'number' && Number.isFinite(body.answer)) {
    answer = String(body.answer);
  } else {
    return Response.json({ success: false, error: 'Geçersiz cevap' }, { status: 400, headers });
  }
  if (!answer.trim()) {
    return Response.json({ success: false, error: 'Cevap boş olamaz' }, { status: 400, headers });
  }

  const result = await verifyChallenge(supabase, id, answer);
  if (!result.success) {
    return Response.json({ success: false, error: result.error }, { status: result.status, headers });
  }
  return Response.json({ success: true }, { headers });
});
