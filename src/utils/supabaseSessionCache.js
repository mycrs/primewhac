/** Public Supabase yanıtları için sessionStorage önbelleği (sekme oturumu, 5 dk TTL) */

const DEFAULT_TTL_MS = 5 * 60 * 1000;

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {number} [ttlMs]
 * @returns {unknown | null}
 */
export function readSessionCache(key, ttlMs = DEFAULT_TTL_MS) {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = safeParse(raw);
    if (!parsed || typeof parsed.ts !== 'number') return null;
    if (Date.now() - parsed.ts > ttlMs) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {unknown} data
 */
export function writeSessionCache(key, data) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* quota / private mode */
  }
}

/** @param {string} key */
export function removeSessionCacheKey(key) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const SESSION_CACHE_TTL_MS = DEFAULT_TTL_MS;
