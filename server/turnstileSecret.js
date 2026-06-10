/** Cloudflare Turnstile test secret — NODE_ENV !== 'production' iken siteverify ile test site key eşleşir */
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

export function getTurnstileSecretForVerify() {
  if (process.env.NODE_ENV !== 'production') {
    return TURNSTILE_TEST_SECRET;
  }
  return process.env.TURNSTILE_SECRET_KEY || '';
}

/**
 * POST https://challenges.cloudflare.com/turnstile/v0/siteverify
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function verifyTurnstileWithCloudflare(token) {
  const trimmed = typeof token === 'string' ? token.trim() : '';
  if (trimmed.length < 8) {
    return { ok: false, error: 'Geçersiz token' };
  }
  const secret = getTurnstileSecretForVerify();
  if (!secret) {
    return { ok: false, error: 'TURNSTILE_SECRET_KEY yapılandırılmamış' };
  }
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', trimmed);
  const cf = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  let data = {};
  try {
    data = await cf.json();
  } catch {
    return { ok: false, error: 'Doğrulama yanıtı okunamadı' };
  }
  if (data.success === true) {
    return { ok: true };
  }
  const codes = Array.isArray(data['error-codes']) ? data['error-codes'].join(', ') : '';
  return { ok: false, error: codes || 'Turnstile doğrulaması başarısız' };
}
