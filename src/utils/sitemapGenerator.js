import { supabase } from '@/lib/customSupabaseClient';
import { makeMatchSlug } from './matchSlug';

const baseUrlNorm = (baseUrl) => (baseUrl || '').replace(/\/+$/, '');

export const generateSitemapXml = async (baseUrl = "https://primewatch.tv") => {
  const base = baseUrlNorm(baseUrl);
  const currentDate = new Date().toISOString().split('T')[0];
  const seen = new Set();

  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/paketler', priority: '0.9', changefreq: 'weekly' },
    { loc: '/kurulum', priority: '0.9', changefreq: 'weekly' },
    { loc: '/karsilastirma', priority: '0.9', changefreq: 'weekly' },
    { loc: '/ne-izlesem', priority: '0.9', changefreq: 'daily' },
    { loc: '/mac-programi', priority: '0.9', changefreq: 'daily' },
    { loc: '/detailed-guides', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog', priority: '0.9', changefreq: 'daily' },
    { loc: '/reseller', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sss', priority: '0.8', changefreq: 'monthly' },
    { loc: '/hakkimizda', priority: '0.7', changefreq: 'monthly' },
    { loc: '/sartlar', priority: '0.6', changefreq: 'yearly' },
    { loc: '/gizlilik', priority: '0.6', changefreq: 'yearly' },
    { loc: '/sitemap', priority: '0.5', changefreq: 'monthly' },
    { loc: '/de', priority: '1.0', changefreq: 'daily' },
    { loc: '/de/paketler', priority: '0.9', changefreq: 'weekly' },
    { loc: '/de/einrichtung', priority: '0.9', changefreq: 'weekly' },
    { loc: '/de/sss', priority: '0.8', changefreq: 'monthly' },
    { loc: '/de/blog', priority: '0.9', changefreq: 'daily' },
    { loc: '/de/reseller', priority: '0.8', changefreq: 'monthly' },
    { loc: '/de/uber-uns', priority: '0.7', changefreq: 'monthly' },
    { loc: '/de/terms', priority: '0.6', changefreq: 'yearly' },
    { loc: '/de/privacy', priority: '0.6', changefreq: 'yearly' },
    { loc: '/de/test', priority: '0.8', changefreq: 'monthly' },
    { loc: '/de/was-soll-ich-schauen', priority: '0.9', changefreq: 'daily' },
    { loc: '/de/m3u-olustur', priority: '0.7', changefreq: 'monthly' },
    { loc: '/de/kanale', priority: '0.8', changefreq: 'weekly' },
    { loc: '/de/spielplan', priority: '0.9', changefreq: 'daily' },
    { loc: '/de/guide/iptv-kurulum-rehberi', priority: '0.8', changefreq: 'monthly' },
  ];

  const appendUrl = (loc, lastmod = currentDate, changefreq = 'monthly', priority = '0.8') => {
    const full = loc.startsWith('http') ? loc : `${base}${loc.startsWith('/') ? loc : '/' + loc}`;
    if (seen.has(full)) return;
    seen.add(full);
    return `  <url>\n    <loc>${full}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  staticRoutes.forEach(route => {
    const line = appendUrl(route.loc, currentDate, route.changefreq, route.priority);
    if (line) xml += '\n' + line;
  });

  // Yalnızca yayındaki blog yazıları (published_at dolu olanlar)
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .not('published_at', 'is', null);
    if (!error && posts && posts.length > 0) {
      posts.forEach(post => {
        let lastModDate = currentDate;
        if (post.updated_at) lastModDate = new Date(post.updated_at).toISOString().split('T')[0];
        else if (post.published_at) lastModDate = new Date(post.published_at).toISOString().split('T')[0];
        const line = appendUrl(`/blog/${post.slug}`, lastModDate, 'monthly', '0.8');
        if (line) xml += '\n' + line;
        const lineDe = appendUrl(`/de/blog/${post.slug}`, lastModDate, 'monthly', '0.8');
        if (lineDe) xml += '\n' + lineDe;
      });
    }
  } catch (err) {
    console.error('Sitemap generation exception (Blog Posts):', err);
  }

  // Maç detay sayfaları (fixtures'tan - bugünden 7 gün)
  try {
    const LEAGUES = ['super-lig-2025', 'epl-2024', 'la-liga-2025', 'champions-league-2025', 'bundesliga-2025', 'serie-a-2025'];
    const fixtureBase = 'https://fixturedownload.com/feed/json';
    const dates = [];
    for (let i = 0; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    const matchSlugs = new Set();
    await Promise.all(LEAGUES.map(async (leagueSlug) => {
      try {
        const res = await fetch(`${fixtureBase}/${leagueSlug}`);
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.matches || []);
        list.forEach((m) => {
          const matchDate = (m.DateUtc || m.date || '').toString().split(' ')[0].split('T')[0];
          if (!dates.includes(matchDate)) return;
          const home = (m.HomeTeam || m.team1 || m.homeTeam?.name || '-').toString();
          const away = (m.AwayTeam || m.team2 || m.awayTeam?.name || '-').toString();
          const slug = makeMatchSlug(home, away, matchDate);
          if (slug) matchSlugs.add(slug);
        });
      } catch (_) {}
    }));
    matchSlugs.forEach((slug) => {
      const line = appendUrl(`/mac-programi/${slug}`, currentDate, 'daily', '0.8');
      if (line) xml += '\n' + line;
      const lineDe = appendUrl(`/de/spielplan/${slug}`, currentDate, 'daily', '0.8');
      if (lineDe) xml += '\n' + lineDe;
    });
  } catch (err) {
    console.warn('Sitemap match URLs:', err?.message);
  }

  // Admin panelden eklenen sitemap_entries (published); çakışan URL'ler atlanır
  try {
    const { data: entries, error } = await supabase
      .from('sitemap_entries')
      .select('url, last_modified, changefreq, priority')
      .eq('published', true);
    if (!error && entries && entries.length > 0) {
      entries.forEach(entry => {
        const fullUrl = entry.url.startsWith('http') ? entry.url : `${base}${entry.url.startsWith('/') ? entry.url : '/' + entry.url}`;
        if (seen.has(fullUrl)) return;
        seen.add(fullUrl);
        const lastmod = entry.last_modified ? new Date(entry.last_modified).toISOString().split('T')[0] : currentDate;
        xml += `\n  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${entry.changefreq || 'monthly'}</changefreq>\n    <priority>${entry.priority ?? '0.8'}</priority>\n  </url>`;
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
