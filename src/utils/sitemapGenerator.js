import { supabase } from '../lib/customSupabaseClient.js';
import { SITE_URL as DEFAULT_SITEMAP_BASE } from '../constants/siteUrl.js';
import { EXCLUDED_PATTERNS as DEFAULT_EXCLUDED_PATTERNS } from '../sitemapExcludedPatterns.js';
import { getSitemapHreflangAlternates } from './seoCanonicalHreflang.js';
import {
  pathnameShouldNoindex,
  plainTextLengthFromHtml,
  MIN_CONTENT_THRESHOLD,
} from './seoNoindexPaths.js';

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
      return `${u.origin}${path}`;
    } catch {
      return null;
    }
  }
  const p = (s.startsWith('/') ? s : `/${s}`).replace(/\/+$/, '') || '/';
  return `${base}${p}`;
}

function escapeXmlAttr(val) {
  return String(val).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function formatUrlEntry(full, lastmod, changefreq, priority, base) {
  const pathForAlt = pathnameFromLoc(full);
  const alt = getSitemapHreflangAlternates(pathForAlt, base);
  const hrefBlock = alt
    ? `\n    <xhtml:link rel="alternate" hreflang="tr" href="${escapeXmlAttr(alt.tr)}"/>\n    <xhtml:link rel="alternate" hreflang="de" href="${escapeXmlAttr(alt.de)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXmlAttr(alt.xDefault)}"/>`
    : '';
  return `  <url>\n    <loc>${escapeXmlAttr(full)}</loc>${hrefBlock}\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
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
  const currentDate = new Date().toISOString().split('T')[0];
  const seen = new Set();

  const STATIC_PRIORITY = '1.0';
  const BLOG_PRIORITY = '0.8';

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
    { loc: '/kurulum/android-phone', changefreq: 'weekly' },
    { loc: '/kurulum/windows', changefreq: 'weekly' },
    { loc: '/kurulum/mac', changefreq: 'weekly' },
    { loc: '/kurulum/smart-tv', changefreq: 'weekly' },
    { loc: '/kurulum/samsung-tv', changefreq: 'weekly' },
    { loc: '/kurulum/lg-tv', changefreq: 'weekly' },
    { loc: '/kurulum/tablet', changefreq: 'weekly' },
    { loc: '/karsilastirma', changefreq: 'weekly' },
    { loc: '/detailed-guides', changefreq: 'monthly' },
    { loc: '/yorumlar', changefreq: 'weekly' },
    { loc: '/blog', changefreq: 'daily' },
    { loc: '/reseller', changefreq: 'monthly' },
    { loc: '/sss', changefreq: 'monthly' },
    { loc: '/hakkimizda', changefreq: 'monthly' },
    { loc: '/sartlar', changefreq: 'yearly' },
    { loc: '/gizlilik', changefreq: 'yearly' },
    { loc: '/guide/iptv-kurulum-rehberi', changefreq: 'monthly' },
    { loc: '/test', changefreq: 'monthly' },
    { loc: '/musteri-kayit', changefreq: 'monthly' },
    { loc: '/de', changefreq: 'daily' },
    { loc: '/de/pakete', changefreq: 'weekly' },
    { loc: '/de/einrichtung', changefreq: 'weekly' },
    { loc: '/de/einrichtung/android-tv', changefreq: 'weekly' },
    { loc: '/de/einrichtung/ios', changefreq: 'weekly' },
    { loc: '/de/einrichtung/android-phone', changefreq: 'weekly' },
    { loc: '/de/einrichtung/windows', changefreq: 'weekly' },
    { loc: '/de/einrichtung/mac', changefreq: 'weekly' },
    { loc: '/de/einrichtung/smart-tv', changefreq: 'weekly' },
    { loc: '/de/einrichtung/samsung-tv', changefreq: 'weekly' },
    { loc: '/de/einrichtung/lg-tv', changefreq: 'weekly' },
    { loc: '/de/einrichtung/tablet', changefreq: 'weekly' },
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
  ];

  const tryAppendUrl = (loc, lastmod = currentDate, changefreq = 'monthly', priority = STATIC_PRIORITY) => {
    const pathCheck = pathnameFromLoc(loc);
    if (pathMatchesExcludedPatterns(pathCheck, excludedPatterns)) return null;
    const full = absoluteLoc(loc, base);
    if (!full || seen.has(full)) return null;
    seen.add(full);
    return formatUrlEntry(full, lastmod, changefreq, priority, base);
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  staticRoutes.forEach((route) => {
    const line = tryAppendUrl(route.loc, currentDate, route.changefreq, STATIC_PRIORITY);
    if (line) xml += `\n${line}`;
  });

  // Yayındaki blog yazıları — tablo: blog_posts (Supabase)
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at, published_at, content')
      .not('published_at', 'is', null);

    if (!error && posts?.length) {
      posts.forEach((post) => {
        if (!post.slug) return;
        if (plainTextLengthFromHtml(post.content) < MIN_CONTENT_THRESHOLD) return;
        let lastModDate = currentDate;
        const u = post.updated_at ? new Date(post.updated_at).getTime() : 0;
        const p = post.published_at ? new Date(post.published_at).getTime() : 0;
        const c = post.created_at ? new Date(post.created_at).getTime() : 0;
        const best = Math.max(u, p, c);
        if (best > 0) {
          lastModDate = new Date(best).toISOString().split('T')[0];
        }

        const trPath = `/blog/${post.slug}`;
        const dePath = `/de/blog/${post.slug}`;
        const lineTr = tryAppendUrl(trPath, lastModDate, 'weekly', BLOG_PRIORITY);
        if (lineTr) xml += `\n${lineTr}`;
        const lineDe = tryAppendUrl(dePath, lastModDate, 'weekly', BLOG_PRIORITY);
        if (lineDe) xml += `\n${lineDe}`;
      });
    }
  } catch (err) {
    console.error('Sitemap generation exception (Blog Posts):', err);
  }

  const blockedEntryPaths = new Set([
    '/packages', '/about', '/installation', '/faq', '/bayilik', '/kanallar',
    '/privacy', '/terms', '/what-to-watch', '/instructions',
    '/spor-gundemi',
    '/karsilastir', '/detayli-kurulum', '/iletisim',
    '/gizlilik-politikasi', '/kullanim-sartlari',
    '/sitemap', '/bing-verification', '/admin', '/admin-login', '/yonetim', '/yonetim/giris',
    '/de/packages', '/de/paketler', '/de/kurulum', '/de/iptv',
    '/de/karsilastir', '/de/detayli-kurulum', '/de/iletisim',
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
          : currentDate;
        const pr = entry.priority != null ? String(entry.priority) : STATIC_PRIORITY;
        xml += `\n${formatUrlEntry(fullUrl, lastmod, entry.changefreq || 'monthly', pr, base)}`;
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
