/**
 * Tarayıcıda Cloudflare Turnstile site key — her ortamda VITE_TURNSTILE_SITE_KEY.
 * (Geliştirme/production ayrımı yok; anahtar .env / .env.production içinde olmalı.)
 */
let warnedMissingSiteKey = false;

export function getTurnstileSiteKeyClient() {
  const key = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
  if (!key && !warnedMissingSiteKey) {
    warnedMissingSiteKey = true;
    console.error(
      '[Turnstile] VITE_TURNSTILE_SITE_KEY tanımsız veya boş; widget render edilemez. .env veya .env.production dosyasına ekleyin.',
    );
  }
  return key;
}
