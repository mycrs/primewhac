/**
 * TR / DE sayfa eşlemesi: canonical ve hreflang link'leri için.
 * Her path için karşı dildeki URL üretilir; duplicate content ve dil seçimi için kullanılır.
 */

import { SITE_URL as DEFAULT_SITE_URL } from '../constants/siteUrl.js';
const TR_TO_DE = {
  '/': '/de',
  '/paketler': '/de/pakete',
  '/hakkimizda': '/de/uber-uns',
  '/kurulum': '/de/einrichtung',
  '/sss': '/de/sss',
  '/blog': '/de/blog',
  '/reseller': '/de/reseller',
  '/sartlar': '/de/terms',
  '/gizlilik': '/de/privacy',
  '/ne-izlesem': '/de/was-soll-ich-schauen',
  '/ne-izlesem/aksiyon-filmleri': '/de/was-soll-ich-schauen/beste-action-filme',
  '/ne-izlesem/populer-yabanci-diziler': '/de/was-soll-ich-schauen/beliebte-auslaendische-serien',
  '/ne-izlesem/korku-filmleri': '/de/was-soll-ich-schauen/horrorfilme',
  '/ne-izlesem/romantik-filmler': '/de/was-soll-ich-schauen/romantische-filme',
  '/guide/iptv-kurulum-rehberi': '/de/guide/iptv-kurulum-rehberi',
  '/channels': '/de/kanale',
  '/m3u-converter': '/de/m3u-olustur',
  '/test': '/de/test',
  '/mac-programi': '/de/spielplan',
  '/yorumlar': '/de/bewertungen',
  '/karsilastirma': '/de/vergleich',
  '/detailed-guides': '/de/detaillierte-anleitungen',
  '/almanyada-turk-kanallari': '/de/tuerkische-sender-in-deutschland',
};

const DE_TO_TR = {
  '/de': '/',
  '/de/pakete': '/paketler',
  '/de/paketler': '/paketler',
  '/de/packages': '/paketler',
  '/de/uber-uns': '/hakkimizda',
  '/de/einrichtung': '/kurulum',
  '/de/kurulum': '/kurulum',
  '/de/sss': '/sss',
  '/de/blog': '/blog',
  '/de/reseller': '/reseller',
  '/de/terms': '/sartlar',
  '/de/privacy': '/gizlilik',
  '/de/was-soll-ich-schauen': '/ne-izlesem',
  '/de/was-soll-ich-schauen/beste-action-filme': '/ne-izlesem/aksiyon-filmleri',
  '/de/was-soll-ich-schauen/beliebte-auslaendische-serien': '/ne-izlesem/populer-yabanci-diziler',
  '/de/was-soll-ich-schauen/horrorfilme': '/ne-izlesem/korku-filmleri',
  '/de/was-soll-ich-schauen/romantische-filme': '/ne-izlesem/romantik-filmler',
  '/de/guide/iptv-kurulum-rehberi': '/guide/iptv-kurulum-rehberi',
  '/de/kanale': '/channels',
  '/de/m3u-olustur': '/m3u-converter',
  '/de/test': '/test',
  '/de/spielplan': '/mac-programi',
  '/de/bewertungen': '/yorumlar',
  '/de/vergleich': '/karsilastirma',
  '/de/karsilastir': '/karsilastirma',
  '/de/detaillierte-anleitungen': '/detailed-guides',
  '/de/detayli-kurulum': '/detailed-guides',
  '/de/tuerkische-sender-in-deutschland': '/almanyada-turk-kanallari',
};

const PREFERRED_CANONICALS = {
  '/packages': '/paketler',
  '/about': '/hakkimizda',
  '/installation': '/kurulum',
  '/instructions': '/kurulum',
  '/faq': '/sss',
  '/bayilik': '/reseller',
  '/privacy': '/gizlilik',
  '/terms': '/sartlar',
  '/contact': '/iletisim',
  '/what-to-watch': '/ne-izlesem',
  '/spor-gundemi': '/mac-programi',
  '/de/packages': '/de/pakete',
  '/de/paketler': '/de/pakete',
  '/de/kurulum': '/de/einrichtung',
};

/**
 * Pathname'i normalize et (query/hash yok; kök dışı tüm path'ler sonda slash TAŞIR).
 * Sunucu slash'siz URL'leri slash'lıya 301'lediği için canonical form slash'lıdır.
 */
function normalizePath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/';
  const stripped = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return stripped === '/' ? '/' : `${stripped}/`;
}

/**
 * Eşleme tabloları ve regex karşılaştırmaları slash'siz anahtarla çalışır.
 */
function keyOf(path) {
  const p = typeof path === 'string' ? path : '/';
  return p.replace(/\/+$/, '') || '/';
}

/**
 * Slash'siz iç anahtarı canonical (slash'lı) path'e çevirir; kök '/' olarak kalır.
 */
function withTrailingSlash(pathKey) {
  return pathKey === '/' ? '/' : `${pathKey}/`;
}

/**
 * "Ne İzlesem" kategori slugları — sadece TR'de var, DE karşılığı yok.
 * hreflang="de" link'i üretilmemeli (aksi halde Google'a kırık bir DE URL verilir).
 */
const TR_WHAT_TO_WATCH_CATEGORY_NO_DE = new Set(['turk-dizileri', 'imdb-yuksek-filmler']);

/**
 * Blog veya dinamik segment içeren path için TR/DE karşılığını bul.
 * Örn: /blog/my-post -> /de/blog/my-post, /de/blog/my-post -> /blog/my-post
 */
function getAlternateForDynamicPath(path, isDe) {
  const normalized = keyOf(normalizePath(path));
  if (isDe) {
    const match = normalized.match(/^\/de\/blog\/(.+)$/);
    if (match) return `/blog/${match[1]}`;
    const matchW = normalized.match(/^\/de\/was-soll-ich-schauen\/(.+)$/);
    if (matchW) return `/ne-izlesem/${matchW[1]}`;
    const matchS = normalized.match(/^\/de\/spielplan\/(.+)$/);
    if (matchS) return `/mac-programi/${matchS[1]}`;
    const matchE = normalized.match(/^\/de\/einrichtung\/(.+)$/);
    if (matchE) return `/kurulum/${matchE[1]}`;
  } else {
    const match = normalized.match(/^\/blog\/(.+)$/);
    if (match) return `/de/blog/${match[1]}`;
    const matchW = normalized.match(/^\/ne-izlesem\/(.+)$/);
    if (matchW) {
      if (TR_WHAT_TO_WATCH_CATEGORY_NO_DE.has(matchW[1])) return null;
      return `/de/was-soll-ich-schauen/${matchW[1]}`;
    }
    const matchW2 = normalized.match(/^\/what-to-watch\/(.+)$/);
    if (matchW2) return `/de/was-soll-ich-schauen/${matchW2[1]}`;
    const matchM = normalized.match(/^\/mac-programi\/(.+)$/);
    if (matchM) return `/de/spielplan/${matchM[1]}`;
    const matchS = normalized.match(/^\/spor-gundemi\/(.+)$/);
    if (matchS) return `/de/spielplan/${matchS[1]}`;
    const matchK = normalized.match(/^\/kurulum\/(.+)$/);
    if (matchK) return `/de/einrichtung/${matchK[1]}`;
    const matchI = normalized.match(/^\/installation\/(.+)$/);
    if (matchI) return `/de/einrichtung/${matchI[1]}`;
  }
  return null;
}

function getPreferredPath(path) {
  const normalized = keyOf(normalizePath(path));

  if (PREFERRED_CANONICALS[normalized]) {
    return PREFERRED_CANONICALS[normalized];
  }

  const trWhatToWatchDetail = normalized.match(/^\/what-to-watch\/(.+)$/);
  if (trWhatToWatchDetail) return `/ne-izlesem/${trWhatToWatchDetail[1]}`;

  return normalized;
}

/**
 * Verilen pathname ve baseUrl için canonical URL ile TR/DE/x-default hreflang link'lerini döndürür.
 * Tüm üretilen URL'ler canonical forma uyar: kök dışı path'ler sonda slash taşır.
 * x-default her zaman sayfanın TR (slash'lı) karşılığıdır.
 * @param {string} pathname - location.pathname
 * @param {string} baseUrl - site kök URL (örn. https://cineverse.pro)
 * @returns {{ canonicalUrl: string, hreflangTr: string, hreflangDe: string|null, hreflangXDefault: string, lang: 'tr'|'de' }}
 */
export function getCanonicalAndHreflang(pathname, baseUrl = DEFAULT_SITE_URL) {
  const base = baseUrl.replace(/\/+$/, '');
  const path = keyOf(normalizePath(pathname));
  const canonicalPath = getPreferredPath(path);
  const isDe = canonicalPath === '/de' || canonicalPath.startsWith('/de/');

  let trUrl;
  let deUrl;

  if (isDe) {
    const trAlternate = DE_TO_TR[canonicalPath] ?? getAlternateForDynamicPath(canonicalPath, true);
    trUrl = trAlternate != null ? base + withTrailingSlash(trAlternate) : `${base}/`;
    deUrl = base + withTrailingSlash(canonicalPath);
  } else {
    const deAlternate = TR_TO_DE[canonicalPath] ?? getAlternateForDynamicPath(canonicalPath, false);
    // Only set a DE hreflang if a real DE equivalent exists - don't falsely point to /de homepage
    deUrl = deAlternate != null ? base + withTrailingSlash(deAlternate) : null;
    trUrl = base + withTrailingSlash(canonicalPath);
  }

  const canonicalUrl = base + withTrailingSlash(canonicalPath);
  const hreflangTr = trUrl;
  const hreflangDe = deUrl;
  const hreflangXDefault = hreflangTr;

  return {
    canonicalUrl,
    hreflangTr,
    hreflangDe,
    hreflangXDefault,
    lang: isDe ? 'de' : 'tr',
  };
}

/**
 * Sitemap xhtml:link satırları için. Karşı dil yoksa veya DE sayfa yanlışlıkla
 * yalnızca ana sayfaya eşlenmişse null döner.
 * @returns {{ tr: string, de: string, xDefault: string } | null}
 */
export function getSitemapHreflangAlternates(pathname, baseUrl = DEFAULT_SITE_URL) {
  const base = baseUrl.replace(/\/+$/, '');
  const path = getPreferredPath(keyOf(normalizePath(pathname)));
  // Blog detaylarında yalnızca gerçekten çevrilmiş yazılar alternate olabilir.
  // Sitemap üreticisi çeviri alanlarını sayfa bazında doğrulamadığı için yanlış
  // hreflang ilişkisi kurmak yerine detay URL'lerinde alternate yayımlamaz.
  if (/^\/(?:de\/)?blog\/[^/]+$/.test(path)) return null;
  const { hreflangTr, hreflangDe } = getCanonicalAndHreflang(pathname, baseUrl);
  if (!hreflangTr || !hreflangDe) return null;
  const isDe = path === '/de' || path.startsWith('/de/');
  if (isDe && path !== '/de') {
    const trAlternate = DE_TO_TR[path] ?? getAlternateForDynamicPath(path, true);
    if (trAlternate == null && hreflangTr === `${base}/`) return null;
  }
  return { tr: hreflangTr, de: hreflangDe, xDefault: hreflangTr };
}
