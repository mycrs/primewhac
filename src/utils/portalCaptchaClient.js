const VERIFY_URL = '/api/portal/verify-captcha';

function supabaseFunctionsBase() {
  const u = import.meta.env.VITE_SUPABASE_URL;
  if (u && typeof u === 'string') return u.replace(/\/$/, '');
  return 'https://pkppewdtnuchwjtmulev.supabase.co';
}

const VERIFY_TURNSTILE_URL = `${supabaseFunctionsBase()}/functions/v1/verify-turnstile`;

/**
 * Cloudflare Turnstile — sunucu siteverify.
 * @returns {{ ok: boolean, status: number, body: object, fetchFailed?: boolean }}
 */
export async function verifyTurnstileWithServer(token) {
  try {
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const res = await fetch(VERIFY_TURNSTILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(anon ? { Authorization: `Bearer ${anon}`, apikey: anon } : {}),
      },
      body: JSON.stringify({ token }),
    });
    let body = {};
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    return {
      ok: res.ok && body.success === true,
      status: res.status,
      body,
      fetchFailed: false,
    };
  } catch {
    return { ok: false, status: 0, body: {}, fetchFailed: true };
  }
}

export function turnstileVerifyUserMessage(result) {
  if (!result || result.ok) return '';
  if (result.fetchFailed) {
    return 'Doğrulama sunucusuna ulaşılamadı. Supabase Edge Function (verify-turnstile) veya ağ bağlantısını kontrol edin.';
  }
  if (result.status === 503 && result.body?.error) {
    return 'Sunucuda Turnstile secret yapılandırması eksik (production: TURNSTILE_SECRET_KEY).';
  }
  if (result.status === 400) {
    return result.body?.error || 'Güvenlik doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.';
  }
  return 'Güvenlik doğrulaması başarısız.';
}

/**
 * Müşteri portalı — yalnızca hCaptcha (secret sunucuda).
 */
export async function verifyCaptchaWithServer({ hcaptchaResponse }) {
  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hcaptchaResponse: hcaptchaResponse || undefined,
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok && body.ok === true, status: res.status, body };
}

export async function fetchPortalClientIp() {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 2800);
    const r = await fetch('https://api.ipify.org?format=json', { signal: c.signal });
    clearTimeout(t);
    const j = await r.json();
    return j?.ip ? String(j.ip) : null;
  } catch {
    return null;
  }
}
