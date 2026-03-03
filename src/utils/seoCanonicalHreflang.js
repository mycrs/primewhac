/**
 * TR / DE sayfa eşlemesi: canonical ve hreflang link'leri için.
 * Her path için karşı dildeki URL üretilir; duplicate content ve dil seçimi için kullanılır.
 */
const TR_TO_DE = {
  '/': '/de',
  '/paketler': '/de/paketler',
  '/packages': '/de/paketler',
  '/hakkimizda': '/de/uber-uns',
  '/about': '/de/uber-uns',
  '/kurulum': '/de/einrichtung',
  '/installation': '/de/einrichtung',
  '/sss': '/de/sss',
  '/faq': '/de/sss',
  '/blog': '/de/blog',
  '/reseller': '/de/reseller',
  '/bayilik': '/de/reseller',
  '/sartlar': '/de/terms',
  '/terms': '/de/terms',
  '/gizlilik': '/de/privacy',
  '/privacy': '/de/privacy',
  '/ne-izlesem': '/de/was-soll-ich-schauen',
  '/what-to-watch': '/de/was-soll-ich-schauen',
  '/guide/iptv-kurulum-rehberi': '/de/guide/iptv-kurulum-rehberi',
  '/channels': '/de/kanale',
  '/m3u-converter': '/de/m3u-olustur',
  '/test': '/de/test',
  '/mac-programi': '/de/spielplan',
  '/spor-gundemi': '/de/spielplan',
};

const DE_TO_TR = {
  '/de': '/',
  '/de/paketler': '/paketler',
  '/de/pakete': '/paketler',
  '/de/uber-uns': '/hakkimizda',
  '/de/einrichtung': '/kurulum',
  '/de/kurulum': '/kurulum',
  '/de/sss': '/sss',
  '/de/blog': '/blog',
  '/de/reseller': '/reseller',
  '/de/terms': '/sartlar',
  '/de/privacy': '/gizlilik',
  '/de/was-soll-ich-schauen': '/ne-izlesem',
  '/de/guide/iptv-kurulum-rehberi': '/guide/iptv-kurulum-rehberi',
  '/de/kanale': '/channels',
  '/de/m3u-olustur': '/m3u-converter',
  '/de/test': '/test',
  '/de/spielplan': '/mac-programi',
};

/**
 * Pathname'i normalize et (sondaki slash yok, query/hash yok).
 */
function normalizePath(pathname) {
  if (!pathname || typeof pathname !== 'string') return '/';
  const p = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return p;
}

/**
 * Blog veya dinamik segment içeren path için TR/DE karşılığını bul.
 * Örn: /blog/my-post -> /de/blog/my-post, /de/blog/my-post -> /blog/my-post
 */
function getAlternateForDynamicPath(path, isDe) {
  const normalized = normalizePath(path);
  if (isDe) {
    const match = normalized.match(/^\/de\/blog\/(.+)$/);
    if (match) return `/blog/${match[1]}`;
    const matchW = normalized.match(/^\/de\/was-soll-ich-schauen\/(.+)$/);
    if (matchW) return `/ne-izlesem/${matchW[1]}`;
    const matchS = normalized.match(/^\/de\/spielplan\/(.+)$/);
    if (matchS) return `/mac-programi/${matchS[1]}`;
  } else {
    const match = normalized.match(/^\/blog\/(.+)$/);
    if (match) return `/de/blog/${match[1]}`;
    const matchW = normalized.match(/^\/ne-izlesem\/(.+)$/);
    if (matchW) return `/de/was-soll-ich-schauen/${matchW[1]}`;
    const matchW2 = normalized.match(/^\/what-to-watch\/(.+)$/);
    if (matchW2) return `/de/was-soll-ich-schauen/${matchW2[1]}`;
    const matchM = normalized.match(/^\/mac-programi\/(.+)$/);
    if (matchM) return `/de/spielplan/${matchM[1]}`;
    const matchS = normalized.match(/^\/spor-gundemi\/(.+)$/);
    if (matchS) return `/de/spielplan/${matchS[1]}`;
  }
  return null;
}

/**
 * Verilen pathname ve baseUrl için canonical URL ile TR/DE hreflang link'lerini döndürür.
 * @param {string} pathname - location.pathname
 * @param {string} baseUrl - site kök URL (örn. https://primewatch.tv)
 * @returns {{ canonicalUrl: string, hreflangTr: string, hreflangDe: string, xDefaultUrl: string, lang: 'tr'|'de' }}
 */
export function getCanonicalAndHreflang(pathname, baseUrl = 'https://primewatch.tv') {
  const base = baseUrl.replace(/\/+$/, '');
  const path = normalizePath(pathname);
  const isDe = path.startsWith('/de');

  let canonicalPath = path;
  let trUrl = base + (path === '/de' ? '/' : path.replace(/^\/de/, '') || '/');
  let deUrl = base + (path === '/' ? '/de' : `/de${path}`);

  if (isDe) {
    canonicalPath = path;
    const trAlternate = DE_TO_TR[path] ?? getAlternateForDynamicPath(path, true);
    trUrl = trAlternate != null ? base + trAlternate : base + '/';
    deUrl = base + path;
  } else {
    const deAlternate = TR_TO_DE[path] ?? getAlternateForDynamicPath(path, false);
    deUrl = deAlternate != null ? base + deAlternate : base + '/de';
    trUrl = base + path;
  }

  const canonicalUrl = base + canonicalPath;
  const hreflangTr = trUrl;
  const hreflangDe = deUrl;
  const xDefaultUrl = isDe ? trUrl : trUrl;

  return {
    canonicalUrl,
    hreflangTr,
    hreflangDe,
    xDefaultUrl,
    lang: isDe ? 'de' : 'tr',
  };
}
