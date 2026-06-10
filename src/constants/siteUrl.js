/**
 * Tek kaynak: kök site URL’si. Üretimde `.env` içinde `VITE_SITE_URL` tanımlayın.
 * Vite bundle’da import.meta.env; Node betiklerinde (sitemap vb.) process.env okunur.
 */
const DEFAULT_SITE_URL = 'https://streamtr.eu';

function trimBase(s) {
  if (!s || typeof s !== 'string') return '';
  const t = s.trim();
  if (!t) return '';
  return t.replace(/\/+$/, '');
}

function fromVite() {
  if (typeof import.meta === 'undefined' || !import.meta.env) return '';
  return trimBase(import.meta.env.VITE_SITE_URL);
}

function fromNode() {
  const p = typeof globalThis !== 'undefined' && globalThis.process ? globalThis.process : null;
  if (!p?.env) return '';
  return trimBase(p.env.VITE_SITE_URL);
}

export const SITE_URL = fromVite() || fromNode() || DEFAULT_SITE_URL;

/** Örn. meta açıklamada parantez içi domain (https:// olmadan) */
export const SITE_HOST = (() => {
  try {
    const u = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`;
    return new URL(u).hostname;
  } catch {
    return 'streamtr.eu';
  }
})();
