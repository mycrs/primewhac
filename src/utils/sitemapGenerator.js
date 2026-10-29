import { supabase } from '../lib/customSupabaseClient.js';
import { SITE_URL as DEFAULT_SITEMAP_BASE } from '../constants/siteUrl.js';
import { EXCLUDED_PATTERNS as DEFAULT_EXCLUDED_PATTERNS } from '../sitemapExcludedPatterns.js';
import { getSitemapHreflangAlternates } from './seoCanonicalHreflang.js';
import {
  pathnameShouldNoindex,
  plainTextLengthFromHtml,
  MIN_CONTENT_THRESHOLD,
} from './seoNoindexPaths.js';
import {
  fetchBuildSeoExtras,
  kurulumSitemapEntriesFromSlugs,
} from './seoRouteRegistry.js';
import { TV_BRAND_GUIDE_SLUGS } from '../data/tvBrandGuides.js';
import { isBrandRiskBlogSlug } from '../constants/brandRiskBlogSlugs.js';

const baseUrlNorm = (baseUrl) => (baseUrl || '').replace(/\/+$/, '');

function pathnameFromLoc(loc) {
  if (!loc) return '/';
  const s = String(loc);
  if (s.startsWith('http')) {
    try {
      return new URL(s).pathname.replace(/\/+$/, '') || '/';
    } catch {
      return '/';
    }
  }
  return (s.startsWith('/') ? s : `/${s}`).replace(/\/+$/, '') || '/';
}

function absoluteLoc(loc, base) {
  const s = String(loc);
  if (s.startsWith('http')) {
    try {
      const u = new URL(s);
      const path = u.pathname.replace(/\/+$/, '') || '/';
      // Canonical form: kök dışı tüm path'ler sonda slash taşır
      return `${u.origin}${path === '/' ? '/' : `${path}/`}`;
    } catch {
      return null;
    }
  }
  const p = (s.startsWith('/') ? s : `/${s}`).replace(/\/+$/, '') || '/';
  return `${base}${p === '/' ? '/' : `${p}/`}`;
}

function escapeXmlAttr(val) {
  return String(val).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function formatUrlEntry(full, lastmod, base) {
  const pathForAlt = pathnameFromLoc(full);
  const alt = getSitemapHreflangAlternates(pathForAlt, base);
  const hrefBlock = alt
    ? `\n    <xhtml:link rel="alternate" hreflang="tr" href="${escapeXmlAttr(alt.tr)}"/>\n    <xhtml:link rel="alternate" hreflang="de" href="${escapeXmlAttr(alt.de)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXmlAttr(alt.xDefault)}"/>`
    : '';
  const lastmodBlock = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXmlAttr(full)}</loc>${hrefBlock}${lastmodBlock}\n  </url>`;
}

/**
 * @param {string} pathname path veya tam URL path kısmı
 * @param {string[]} patterns örn. ['/admin', '/film']
 */
export function pathMatchesExcludedPatterns(pathname, patterns) {
  if (!patterns?.length) return false;
  let norm = pathname || '/';
  if (norm.startsWith('http')) {
    try {
      norm = new URL(norm).pathname;
    } catch {
      return false;
    }
  }
  norm = norm.replace(/\/+$/, '') || '/';
  for (const pat of patterns) {
    const pref = (pat || '').replace(/\/+$/, '') || '/';
    if (norm === pref) return true;
    if (norm.startsWith(`${pref}/`)) return true;
  }
  return false;
}

/**
 * @param {string} [baseUrl]
 * @param {{ excludedPatterns?: string[] }} [options]
 */
export const generateSitemapXml = async (baseUrl = DEFAULT_SITEMAP_BASE, options = {}) => {
  const excludedPatterns = options.excludedPatterns ?? DEFAULT_EXCLUDED_PATTERNS;
  const base = baseUrlNorm(baseUrl);
  const seen = new Set();

  // SADECE canonical, indexlenebilir URL'ler (takvim / TMDB / arama / admin yok)
  const staticRoutes = [
    { loc: '/', changefreq: 'daily' },
    { loc: '/paketler', changefreq: 'weekly' },
    { loc: '/channels', changefreq: 'weekly' },
    { loc: '/m3u-converter', changefreq: 'monthly' },
    { loc: '/ne-izlesem', changefreq: 'daily' },
    { loc: '/ne-izlesem/aksiyon-filmleri', changefreq: 'weekly' },
    { loc: '/ne-izlesem/populer-yabanci-diziler', changefreq: 'weekly' },
    { loc: '/ne-izlesem/korku-filmleri', changefreq: 'weekly' },
    { loc: '/ne-izlesem/romantik-filmler', changefreq: 'weekly' },
    { loc: '/ne-izlesem/turk-dizileri', changefreq: 'weekly' },
    { loc: '/ne-izlesem/imdb-yuksek-filmler', changefreq: 'weekly' },
    { loc: '/mac-programi', changefreq: 'daily' },
    { loc: '/kurulum', changefreq: 'weekly' },
    { loc: '/kurulum/android-tv', changefreq: 'weekly' },
    { loc: '/kurulum/ios', changefreq: 'weekly' },
    { loc: '/kurulum/ios-next-plus', changefreq: 'weekly' },
    { loc: '/kurulum/ios-castora', changefreq: 'weekly' },
    { loc: '/kurulum/ios-9xtream', changefreq: 'weekly' },
    { loc: '/kurulum/android-phone', changefreq: 'weekly' },
    { loc: '/kurulum/android-phone-xc', changefreq: 'weekly' },
    { loc: '/kurulum/android-phone-ibo', changefreq: 'weekly' },
    { loc: '/kurulum/windows', changefreq: 'weekly' },
    { loc: '/kurulum/windows-ibo-player', changefreq: 'weekly' },
    { loc: '/kurulum/windows-abc', changefreq: 'weekly' },
    { loc: '/kurulum/windows-vs-player', changefreq: 'weekly' },
    { loc: '/kurulum/mac', changefreq: 'weekly' },
    { loc: '/kurulum/mac-next-plus', changefreq: 'weekly' },
    { loc: '/kurulum/mac-castora', changefreq: 'weekly' },
    { loc: '/kurulum/smart-tv', changefreq: 'weekly' },
    ...TV_BRAND_GUIDE_SLUGS.map((slug) => ({ loc: `/kurulum/${slug}`, changefreq: 'weekly' })),
    { loc: '/kurulum/smart-tv-0-player', changefreq: 'weekly' },
    { loc: '/kurulum/smart-tv-smarters-pro', changefreq: 'weekly' },
    { loc: '/kurulum/tablet', changefreq: 'weekly' },
    { loc: '/kurulum/tablet-ibo-player', changefreq: 'weekly' },
    { loc: '/kurulum/tablet-abc', changefreq: 'weekly' },
    { loc: '/kurulum/tablet-vs-player', changefreq: 'weekly' },
    { loc: '/karsilastirma', changefreq: 'weekly' },
    { loc: '/detailed-guides', changefreq: 'monthly' },
    { loc: '/yorumlar', changefreq: 'weekly' },
    { loc: '/blog', changefreq: 'daily' },
    { loc: '/reseller', changefreq: 'monthly' },
    { loc: '/sss', changefreq: 'monthly' },
    { loc: '/hakkimizda', changefreq: 'monthly' },
    { loc: '/sartlar', changefreq: 'yearly' },
    { loc: '/gizlilik', changefreq: 'yearly' },
    { loc: '/iletisim', changefreq: 'monthly' },
    { loc: '/sitemap', changefreq: 'monthly' },
    { loc: '/guide/iptv-kurulum-rehberi', changefreq: 'monthly' },
    { loc: '/test', changefreq: 'monthly' },
    { loc: '/almanyada-turk-kanallari', changefreq: 'monthly' },
    { loc: '/de', changefreq: 'daily' },
    { loc: '/de/pakete', changefreq: 'weekly' },
    { loc: '/de/einrichtung', changefreq: 'weekly' },
    { loc: '/de/einrichtung/android-tv', changefreq: 'weekly' },
    { loc: '/de/einrichtung/ios', changefreq: 'weekly' },
    { loc: '/de/einrichtung/ios-next-plus', changefreq: 'weekly' },
    { loc: '/de/einrichtung/ios-castora', changefreq: 'weekly' },
    { loc: '/de/einrichtung/ios-9xtream', changefreq: 'weekly' },
    { loc: '/de/einrichtung/android-phone', changefreq: 'weekly' },
    { loc: '/de/einrichtung/android-phone-xc', changefreq: 'weekly' },
    { loc: '/de/einrichtung/android-phone-ibo', changefreq: 'weekly' },
    { loc: '/de/einrichtung/windows', changefreq: 'weekly' },
    { loc: '/de/einrichtung/windows-ibo-player', changefreq: 'weekly' },
    { loc: '/de/einrichtung/windows-abc', changefreq: 'weekly' },
    { loc: '/de/einrichtung/windows-vs-player', changefreq: 'weekly' },
    { loc: '/de/einrichtung/mac', changefreq: 'weekly' },
    { loc: '/de/einrichtung/mac-next-plus', changefreq: 'weekly' },
    { loc: '/de/einrichtung/mac-castora', changefreq: 'weekly' },
    { loc: '/de/einrichtung/smart-tv', changefreq: 'weekly' },
    ...TV_BRAND_GUIDE_SLUGS.map((slug) => ({ loc: `/de/einrichtung/${slug}`, changefreq: 'weekly' })),
    { loc: '/de/einrichtung/smart-tv-0-player', changefreq: 'weekly' },
    { loc: '/de/einrichtung/smart-tv-smarters-pro', changefreq: 'weekly' },
    { loc: '/de/einrichtung/tablet', changefreq: 'weekly' },
    { loc: '/de/einrichtung/tablet-ibo-player', changefreq: 'weekly' },
    { loc: '/de/einrichtung/tablet-abc', changefreq: 'weekly' },
    { loc: '/de/einrichtung/tablet-vs-player', changefreq: 'weekly' },
    { loc: '/de/bewertungen', changefreq: 'weekly' },
    { loc: '/de/blog', changefreq: 'daily' },
    { loc: '/de/reseller', changefreq: 'monthly' },
    { loc: '/de/uber-uns', changefreq: 'monthly' },
    { loc: '/de/terms', changefreq: 'yearly' },
    { loc: '/de/privacy', changefreq: 'yearly' },
    { loc: '/de/was-soll-ich-schauen', changefreq: 'daily' },
    { loc: '/de/was-soll-ich-schauen/beste-action-filme', changefreq: 'weekly' },
    { loc: '/de/was-soll-ich-schauen/beliebte-auslaendische-serien', changefreq: 'weekly' },
    { loc: '/de/was-soll-ich-schauen/horrorfilme', changefreq: 'weekly' },
    { loc: '/de/was-soll-ich-schauen/romantische-filme', changefreq: 'weekly' },
    { loc: '/de/spielplan', changefreq: 'daily' },
    { loc: '/de/kanale', changefreq: 'weekly' },
    { loc: '/de/sss', changefreq: 'monthly' },
    { loc: '/de/m3u-olustur', changefreq: 'monthly' },
    { loc: '/de/guide/iptv-kurulum-rehberi', changefreq: 'monthly' },
    { loc: '/de/test', changefreq: 'monthly' },
    { loc: '/de/vergleich', changefreq: 'weekly' },
    { loc: '/de/detaillierte-anleitungen', changefreq: 'monthly' },
    { loc: '/de/tuerkische-sender-in-deutschland', changefreq: 'monthly' },
  ];

  const tryAppendUrl = (loc, lastmod = null, { forceIndex = false } = {}) => {
    const pathCheck = pathnameFromLoc(loc);
    if (!forceIndex && pathnameShouldNoindex(pathCheck)) return null;
    if (pathMatchesExcludedPatterns(pathCheck, excludedPatterns)) return null;
    const full = absoluteLoc(loc, base);
    if (!full || seen.has(full)) return null;
    seen.add(full);
    return formatUrlEntry(full, lastmod, base);
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  staticRoutes.forEach((route) => {
    const line = tryAppendUrl(route.loc);
    if (line) xml += `\n${line}`;
  });

  try {
    const { extraKurulumSlugs } = await fetchBuildSeoExtras();
    kurulumSitemapEntriesFromSlugs(extraKurulumSlugs).forEach((route) => {
      const line = tryAppendUrl(route.loc);
      if (line) xml += `\n${line}`;
    });
  } catch (err) {
    console.error('Sitemap generation exception (dynamic kurulum):', err);
  }

  // Yayındaki blog yazıları — tablo: blog_posts (Supabase)
  try {
    let queryResult = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at, published_at, content, title_de, content_de')
      .not('published_at', 'is', null);

    if (queryResult.error?.message?.includes('column')) {
      queryResult = await supabase
        .from('blog_posts')
        .select('slug, updated_at, created_at, published_at, content')
        .not('published_at', 'is', null);
    }

    const { data: posts, error } = queryResult;

    if (!error && posts?.length) {
      posts.forEach((post) => {
        if (!post.slug) return;
        // Telif/marka riski nedeniyle yayından kaldırılanlar: DB henüz temizlenmemiş
        // olsa bile sitemap'e girmesin.
        if (isBrandRiskBlogSlug(post.slug)) return;
        if (plainTextLengthFromHtml(post.content) < MIN_CONTENT_THRESHOLD) return;
        let lastModDate = null;
        const u = post.updated_at ? new Date(post.updated_at).getTime() : 0;
        const p = post.published_at ? new Date(post.published_at).getTime() : 0;
        const c = post.created_at ? new Date(post.created_at).getTime() : 0;
        const best = Math.max(u, p, c);
        if (best > 0) {
          lastModDate = new Date(best).toISOString().split('T')[0];
        }

        const trPath = `/blog/${post.slug}`;
        const lineTr = tryAppendUrl(trPath, lastModDate);
        if (lineTr) xml += `\n${lineTr}`;
        const hasGermanTranslation =
          typeof post.title_de === 'string' && post.title_de.trim().length > 0 &&
          plainTextLengthFromHtml(post.content_de) >= MIN_CONTENT_THRESHOLD;
        if (hasGermanTranslation) {
          const lineDe = tryAppendUrl(`/de/blog/${post.slug}`, lastModDate, { forceIndex: true });
          if (lineDe) xml += `\n${lineDe}`;
        }
      });
    }
  } catch (err) {
    console.error('Sitemap generation exception (Blog Posts):', err);
  }

  const blockedEntryPaths = new Set([
    '/packages', '/about', '/installation', '/faq', '/bayilik', '/kanallar',
    '/privacy', '/terms', '/what-to-watch', '/instructions',
    '/spor-gundemi',
    '/karsilastir', '/detayli-kurulum',
    '/gizlilik-politikasi', '/kullanim-sartlari',
    '/sitemap', '/bing-verification', '/admin', '/admin-login', '/yonetim', '/yonetim/giris',
    '/de/packages', '/de/paketler', '/de/kurulum', '/de/iptv',
    '/de/karsilastir', '/de/detayli-kurulum',
    '/blog/[slug]', '/de/blog/[slug]',
    '/blog-kategorileri', '/de/blog-kategorien',
    '/video-rehberleri', '/de/video-anleitungen',
    '/urun-detay', '/de/produkt-details',
    '/galeri', '/de/galerie',
    '/referans', '/de/referenzen',
  ]);

  const isBlockedUrl = (p) => {
    const norm = p.replace(/\/+$/, '') || '/';
    if (blockedEntryPaths.has(norm)) return true;
    if (pathMatchesExcludedPatterns(norm, excludedPatterns)) return true;
    if (pathnameShouldNoindex(norm)) return true;
    if (norm.includes('[') || norm.includes(']')) return true;
    return false;
  };

  try {
    const { data: entries, error } = await supabase
      .from('sitemap_entries')
      .select('url, last_modified, changefreq, priority')
      .eq('published', true);
    if (!error && entries?.length) {
      entries.forEach((entry) => {
        const rawPath = entry.url.startsWith('http')
          ? new URL(entry.url).pathname.replace(/\/+$/, '')
          : (`/${entry.url.replace(/^[\s/]+/, '')}`).replace(/\/+$/, '') || '/';
        if (isBlockedUrl(rawPath)) return;
        const fullUrl = absoluteLoc(rawPath, base);
        if (!fullUrl || seen.has(fullUrl)) return;
        seen.add(fullUrl);
        const lastmod = entry.last_modified
          ? new Date(entry.last_modified).toISOString().split('T')[0]
          : null;
        xml += `\n${formatUrlEntry(fullUrl, lastmod, base)}`;
      });
    }
  } catch (err) {
    console.error('Sitemap generation exception (sitemap_entries):', err);
  }

  xml += '\n</urlset>';
  return xml;
};

export const downloadSitemap = async () => {
  try {
    const xml = await generateSitemapXml();
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return true;
  } catch (error) {
    console.error('Failed to download sitemap:', error);
    return false;
  }
};
