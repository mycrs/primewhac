import {
  INDEXNOW_HOST,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  INDEXNOW_SITE_ORIGIN,
} from '@/constants/indexNow';

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const ALLOWED_HOSTS = new Set(['streamtr.eu', 'www.streamtr.eu', 'qruzetv.com', 'www.qruzetv.com']);

function normalizeToAbsoluteUrls(pathsOrUrls) {
  const out = [];
  for (const raw of pathsOrUrls) {
    if (!raw || typeof raw !== 'string') continue;
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith('http://') || t.startsWith('https://')) {
      try {
        const u = new URL(t);
        if (!ALLOWED_HOSTS.has(u.hostname.toLowerCase())) continue;
        out.push(`${INDEXNOW_SITE_ORIGIN}${u.pathname}${u.search}`);
      } catch {
        continue;
      }
      continue;
    }
    const path = t.startsWith('/') ? t : `/${t}`;
    out.push(`${INDEXNOW_SITE_ORIGIN}${path}`);
  }
  return [...new Set(out)];
}

/**
 * Notify IndexNow (Bing, etc.) about URL updates. Fire-and-forget safe; logs warnings on failure.
 * @param {string[]} urlList - Paths (e.g. /blog/foo) or full https://streamtr.eu/... URLs
 * @returns {Promise<{ ok?: boolean, skipped?: boolean, status?: number }>}
 */
export async function pingIndexNow(urlList) {
  const urlListNorm = normalizeToAbsoluteUrls(urlList);
  if (!urlListNorm.length || !INDEXNOW_KEY) {
    return { skipped: true };
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: urlListNorm,
      }),
    });

    if (!res.ok && res.status !== 202) {
      const text = await res.text().catch(() => '');
      console.warn('[IndexNow]', res.status, text);
    }

    return { ok: res.ok || res.status === 202, status: res.status };
  } catch (err) {
    console.warn('[IndexNow] request failed:', err?.message || err);
    return { ok: false };
  }
}

/** TR + DE blog post URLs for a slug */
export function pingIndexNowBlogSlug(slug) {
  if (!slug || typeof slug !== 'string') return Promise.resolve({ skipped: true });
  const s = slug.replace(/^\/+|\/+$/g, '');
  return pingIndexNow([`/blog/${s}`, `/de/blog/${s}`]);
}
