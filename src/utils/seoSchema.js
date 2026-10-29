/**
 * Ortak SEO structured data (schema.org) şemaları.
 * Google'ın sayfayı daha iyi anlaması ve meta description'ı önceliklendirmesi için.
 */

import { SITE_URL } from '../constants/siteUrl.js';
import { SITE_GEO, getSiteGeoForLang } from '../constants/siteGeo.js';
import { homeGeoFaqSchema } from '../data/homeGeoContent.js';

const ALL_AREA_SERVED = [
  ...SITE_GEO.tr.areaServedSchema,
  ...SITE_GEO.de.areaServedSchema.filter(
    (c) => !SITE_GEO.tr.areaServedSchema.some((t) => t.name === c.name),
  ),
];

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'QruzeTV',
  alternateName: 'Qruze TV',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description: 'QruzeTV; Türkçe ve Almanca IPTV paketleri, cihaz kurulum rehberleri, ücretsiz test ve kullanıcı desteği sunar.',
  // telephone alanı bilerek yok: numara statik çıktıda (HTML/JSON-LD) görünürse
  // spam botları kaynak koddan hasat ediyor. İletişim e-posta + site üzerinden.
  email: 'info@qruzetv.com',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'info@qruzetv.com',
    url: `${SITE_URL}/`,
    availableLanguage: ['Turkish', 'German', 'English'],
    areaServed: ['TR', 'DE', 'AT', 'NL', 'CH'],
  },
  areaServed: ALL_AREA_SERVED,
  knowsAbout: [
    'IPTV device setup',
    'Smart TV streaming',
    'M3U playlists',
    'Turkish television channels',
  ],
};

export const organizationSchemaDE = {
  ...organizationSchema,
  description: 'QruzeTV bietet IPTV-Pakete, Geräte-Anleitungen, einen kostenlosen Test und deutsch-türkischen Support für Nutzer in Deutschland und Europa.',
  contactPoint: {
    ...organizationSchema.contactPoint,
    url: `${SITE_URL}/de/`,
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'QruzeTV',
  alternateName: 'Qruze TV',
  inLanguage: ['tr-TR', 'de-DE'],
  publisher: { '@id': `${SITE_URL}/#organization` },
};

/**
 * WebPage schema - sayfa türünü ve açıklamasını netleştirir.
 * Google snippet için meta description ile uyumlu tutulmalı.
 */
export function webPageSchema({ name, description, url, lang }) {
  const resolvedLang = lang ?? (() => {
    if (!url || typeof url !== 'string') return 'tr';
    try {
      const pathname = url.startsWith('http') ? new URL(url).pathname : url;
      return pathname === '/de' || pathname.startsWith('/de/') ? 'de' : 'tr';
    } catch {
      return 'tr';
    }
  })();
  const geo = getSiteGeoForLang(resolvedLang);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description: (description || '').substring(0, 160),
    url: url || SITE_URL,
    inLanguage: geo.contentLanguage,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/**
 * Video rehberleri için VideoObject schema (SEO)
 * Zorunlu alanlar: @context, @type, name, description, thumbnailUrl, uploadDate, contentUrl veya embedUrl
 */
export function videoGuidesSchema(videos) {
  if (!videos) return [];
  const items = [];
  // Kaynak dosyaların ilk yayın tarihi. Her build'de "bugün" yazmak sahte tazelik
  // sinyali üretir; admin verisinde gerçek tarih varsa onu kullanırız.
  const uploadDate =
    videos.upload_date ||
    videos.uploadDate ||
    '2025-11-28T00:00:00+03:00';
  const addVideo = (url, name, description) => {
    if (!url || typeof url !== 'string') return;
    const u = url.trim();
    const isYt = /youtube\.com|youtu\.be/.test(u);
    const desc = (description || name || '').trim() || name;
    if (isYt) {
      const m = u.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
      if (m) items.push({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: name || 'Video',
        description: desc,
        thumbnailUrl: `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`,
        uploadDate,
        embedUrl: `https://www.youtube.com/embed/${m[1]}`,
      });
    } else if (u.startsWith('/')) {
      items.push({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: name || 'Video',
        description: desc,
        thumbnailUrl: `${SITE_URL}/default-og-image.jpg`,
        uploadDate,
        contentUrl: `${SITE_URL}${u}`,
      });
    }
  };
  addVideo(videos.iptv_nedir_youtube || videos.iptv_nedir, 'IPTV Nedir?', 'IPTV teknolojisi ve nasıl çalıştığını anlatan rehber.');
  addVideo(videos.icerik_bilgisi_youtube || videos.icerik_bilgisi, 'İçerik Bilgisi', 'Kanal ve VOD içerikleri hakkında detaylı bilgi.');
  return items;
}

/**
 * Ana sayfa için Organization + WebPage + VideoObject (varsa).
 * Ana sayfada görünür breadcrumb olmadığı için BreadcrumbList üretilmez.
 */
export function homePageSchemas(metadata, videos) {
  const schemas = [
    organizationSchema,
    websiteSchema,
    webPageSchema({
      name: metadata?.title || "Premium IPTV Satın Al | Kesintisiz 4K IPTV",
      description: metadata?.description || "Türkiye'nin en iyi Premium IPTV hizmeti. Kesintisiz 4K kalite, anında teslimat.",
      url: SITE_URL,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#premium-features`,
      name: 'QruzeTV Premium IPTV Özellikleri',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: '4K Ultra HD Yayın',
            description: 'Gerçek sinema kalitesinde, cam gibi net ve akıcı IPTV görüntü deneyimi.',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Anti-Freeze Altyapı',
            description: 'Yoğun saatlerde ve maç yayınlarında kesintisiz IPTV deneyimi için optimize edilmiş yayın altyapısı.',
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Geniş VOD Arşivi',
            description: 'Güncel dizi, film, belgesel ve eğlence içeriklerinden oluşan geniş IPTV VOD arşivi.',
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Service',
            name: '7/24 Kesintisiz Destek',
            description: 'Kurulum, cihaz uyumu ve teknik destek için uzman ekipten hızlı yardım.',
          },
        },
      ],
    },
    homeGeoFaqSchema(),
  ];
  const videoSchemas = videoGuidesSchema(videos);
  if (videoSchemas?.length) schemas.push(...videoSchemas);
  return schemas;
}

/**
 * Paketler sayfası için Organization + WebPage + Service
 */
export function packagesPageSchemas(metadata) {
  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || "Premium IPTV Paketleri",
      description: metadata?.description || "Premium IPTV paketleri ile kesintisiz yayın deneyimi. Uygun fiyatlı paketler, 4K kalitesi, 7/24 destek.",
      url: `${SITE_URL}/paketler/`,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/paketler/#service`,
      name: 'QruzeTV IPTV Abonelik Hizmeti',
      serviceType: 'IPTV Streaming Subscription',
      description:
        'QruzeTV IPTV aboneliği: 10.000+ kanal, 4K UHD kalite, VOD arşivi, canlı spor. Türkiye ve Avrupa paketleri.',
      provider: {
        '@id': `${SITE_URL}/#organization`,
      },
      areaServed: [
        { '@type': 'Country', name: 'Türkiye' },
        { '@type': 'Country', name: 'Deutschland' },
        { '@type': 'Country', name: 'Österreich' },
        { '@type': 'Country', name: 'Niederlande' },
      ],
    },
  ];
}

/**
 * Breadcrumb schema - sayfa hiyerarşisi için
 */
function withTrailingSlashPath(p) {
  if (!p || p === '/') return '/';
  return p.endsWith('/') ? p : `${p}/`;
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url || `${SITE_URL}${withTrailingSlashPath(item.path || '/')}`,
    })),
  };
}

function buildIsoDateTime(date, time) {
  const safeDate = typeof date === 'string' ? date.trim() : '';
  const safeTime = typeof time === 'string' && time.trim() ? time.trim() : '20:00';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(safeDate)) return undefined;
  const normalizedTime = /^\d{2}:\d{2}$/.test(safeTime) ? `${safeTime}:00` : safeTime;
  return `${safeDate}T${normalizedTime}+03:00`;
}

/**
 * Match detail pages are interpreted by Google as Event pages.
 * Keep the Event fields explicit so GSC does not flag missing performer/offers/image/url.
 */
export function matchSportsEventSchema({ match, url, locale = 'tr' }) {
  if (!match?.home || !match?.away || !url) return null;

  const isDe = locale === 'de';
  const leagueName = match.league?.name || (isDe ? 'Fußball' : 'Futbol');
  const countryName = match.league?.country || (isDe ? 'Europa' : 'Avrupa');
  const eventName = `${match.home} vs ${match.away} - ${leagueName}`;
  const packagesUrl = `${SITE_URL}${isDe ? '/de/pakete/' : '/paketler/'}`;
  const startDate = buildIsoDateTime(match.date, match.time);

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    '@id': `${url}#sports-event`,
    name: eventName,
    description: isDe
      ? `${eventName}: Datum, Uhrzeit und Senderinformationen für das Spiel. Mit QruzeTV IPTV Sportkanäle in 4K verfolgen.`
      : `${eventName}: maç tarihi, saati ve yayın bilgileri. QruzeTV IPTV ile spor kanallarını 4K kalitede takip edin.`,
    url,
    image: [
      `${SITE_URL}/default-og-image.jpg`,
      `${SITE_URL}/logo.png`,
    ],
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      name: isDe ? 'QruzeTV Spielinfo' : 'QruzeTV maç bilgisi',
      url,
    },
    performer: [
      {
        '@type': 'SportsTeam',
        name: match.home,
        sport: 'Football',
      },
      {
        '@type': 'SportsTeam',
        name: match.away,
        sport: 'Football',
      },
    ],
    organizer: {
      '@id': `${SITE_URL}/#organization`,
    },
    superEvent: {
      '@type': 'SportsEvent',
      name: leagueName,
      location: {
        '@type': 'Place',
        name: countryName,
      },
    },
    offers: {
      '@type': 'Offer',
      name: isDe ? 'QruzeTV IPTV Sportzugang' : 'QruzeTV IPTV spor erişimi',
      description: isDe
        ? 'IPTV-Abo mit Sportkanälen, 4K-Streaming und 24/7 Support.'
        : 'Spor kanalları, 4K yayın ve 7/24 destek içeren IPTV aboneliği.',
      url: packagesUrl,
      price: isDe ? '45' : '750',
      priceCurrency: isDe ? 'EUR' : 'TRY',
      availability: 'https://schema.org/InStock',
      validFrom: startDate || `${new Date().getFullYear()}-01-01T00:00:00+03:00`,
      seller: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  };
}

/**
 * Kanallar sayfası için Organization + WebPage + Breadcrumb (TR)
 */
export function channelsPageSchemas(metadata) {
  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || "Canlı IPTV Kanalları",
      description: metadata?.description || "En iyi IPTV servisi ile donmayan IPTV kanallarını keşfedin. Kaliteli spor kanalları, belgeseller ve HD yayınlar.",
      url: `${SITE_URL}/channels/`,
    }),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Kanallar', path: '/channels' },
    ]),
  ];
}

/**
 * Kanallar sayfası için Organization + WebPage + Breadcrumb (DE)
 */
export function channelsPageSchemasDE(metadata) {
  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || "IPTV Kanäle Deutschland",
      description: metadata?.description || "Entdecken Sie IPTV Kanäle für Deutschland und Europa.",
      url: `${SITE_URL}/de/kanale/`,
    }),
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Kanäle', path: '/de/kanale' },
    ]),
  ];
}

/**
 * SSS (/sss) sayfası için Organization + WebPage + BreadcrumbList + FAQPage.
 * FAQPage yalnızca en az 1 soru varsa eklenir (boş mainEntity spam riski).
 */
export function faqPageSchemas(metadata, sections) {
  const mainEntity = (sections || []).flatMap((section) =>
    (section?.items || []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    }))
  );

  const faqSchema =
    mainEntity.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity,
        }
      : null;

  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || 'Sıkça Sorulan Sorular — IPTV Rehberi | QruzeTV',
      description: metadata?.description || '',
      url: `${SITE_URL}/sss/`,
    }),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Sıkça Sorulan Sorular', path: '/sss' },
    ]),
    faqSchema,
  ].filter(Boolean);
}

/**
 * Maç Programı (/mac-programi) sayfası için Organization + WebPage + BreadcrumbList.
 * Dinamik Event / SportsEvent schema'ları gerekirse page tarafında eklenir.
 */
export function matchSchedulePageSchemas(metadata) {
  return [
    organizationSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/mac-programi/#webpage`,
      url: `${SITE_URL}/mac-programi/`,
      name: metadata?.title || 'Maç Programı — Günlük Fikstür ve Saatler | QruzeTV',
      description: metadata?.description || '',
      inLanguage: 'tr-TR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Maç Programı', path: '/mac-programi' },
    ]),
  ];
}

/**
 * Blog listesi sayfası için Organization + WebPage + Blog + Breadcrumb
 */
const blogFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'IPTV blog yazıları nerede?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'QruzeTV blog sayfasında IPTV kurulum rehberleri, ipuçları, kanal listeleri ve teknik içerikler bulunur. /blog adresinden erişebilirsiniz.',
      },
    },
    {
      '@type': 'Question',
      name: 'IPTV kurulum rehberi nasıl bulunur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Blog sayfamızda cihaza özel kurulum rehberleri yayınlanır. Ayrıca /kurulum sayfasından Android TV, iOS, Smart TV gibi cihazlar için adım adım talimatlara ulaşabilirsiniz.',
      },
    },
  ],
};

export function blogListPageSchemas(metadata, posts = []) {
  const base = [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || "Premium IPTV Blog - Blog & Rehberler",
      description: metadata?.description || "IPTV dünyasından en güncel haberler, ipuçları ve teknik rehberler.",
      url: `${SITE_URL}/blog/`,
    }),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
    blogFaqSchema,
  ];
  if (posts.length > 0) {
    const blogPost = posts
      .slice(0, 10)
      .filter((post) => post?.title && String(post.title).trim())
      .map((post) => {
        const urlPath = post.slug || post.id;
        const node = {
          '@type': 'BlogPosting',
          headline: String(post.title).trim(),
          author: { '@type': 'Person', name: (post.author && String(post.author).trim()) || 'QruzeTV' },
          url: `${SITE_URL}/blog/${urlPath}/`,
        };
        if (post.published_at) node.datePublished = post.published_at;
        const mod = post.updated_at || post.published_at;
        if (mod) node.dateModified = mod;
        return node;
      });
    if (blogPost.length > 0) {
      base.push({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog & Rehberler',
        description: metadata?.description || "En son yazılarımız, ipuçları ve rehberler.",
        url: `${SITE_URL}/blog/`,
        blogPost,
      });
    }
  }
  return base;
}

/**
 * Ne İzlesem detay sayfası için Movie veya TVSeries schema
 */
export function whatToWatchDetailSchema(content) {
  const { title, name, overview, poster_path, vote_average, release_date, first_air_date, type } = content;
  const displayTitle = (title || name || '').trim() || 'Film / dizi';
  const year = (release_date || first_air_date)?.substring(0, 4);
  const schemaType = type === 'tv' ? 'TVSeries' : 'Movie';
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : null;

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: displayTitle,
    description: (overview || '').substring(0, 200),
    ...(imageUrl && { image: imageUrl }),
    ...(vote_average && { aggregateRating: { '@type': 'AggregateRating', ratingValue: vote_average.toFixed(1), bestRating: 10, ratingCount: content.vote_count || 100 } }),
    ...(year && { datePublished: year }),
    publisher: { '@type': 'Organization', name: 'QruzeTV' },
  };
}

/**
 * Ne İzlesem ana sayfası için WebPage + ItemList
 */
export function whatToWatchPageSchemas(metadata) {
  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || "Ne İzlesem? Film ve Dizi Önerileri",
      description: metadata?.description || "Türkiye'nin en kapsamlı film ve dizi önerisi platformu. IMDb puanları, oyuncu bilgileri ve detaylı açıklamalarla binlerce içerik.",
      url: `${SITE_URL}/ne-izlesem/`,
    }),
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Ne İzlesem', path: '/ne-izlesem' },
    ]),
  ];
}

export function whatToWatchPageSchemasDE(metadata) {
  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || "Was soll ich schauen? Filme und Serien",
      description: metadata?.description || "Filme und Serien entdecken, bewerten und für den nächsten IPTV-Abend auswählen.",
      url: `${SITE_URL}/de/was-soll-ich-schauen/`,
    }),
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Was soll ich schauen', path: '/de/was-soll-ich-schauen' },
    ]),
  ];
}

/**
 * "Ne İzlesem" kategori sayfaları (aksiyon, netflix, korku vb.) için schema seti.
 * WebPage + BreadcrumbList + ItemList + (varsa) FAQPage kombinasyonu döner.
 *
 * @param {Object} category - whatToWatchCategories.js formatında kategori objesi
 * @param {'tr' | 'de'} lang
 */
export function whatToWatchCategorySchemas(category, lang = 'tr') {
  if (!category) return [];

  const isDe = lang === 'de';
  const categoryUrl = `${SITE_URL}${category.urlPath}`;
  const breadcrumbs = isDe
    ? [
        { name: 'Startseite', path: '/de' },
        { name: 'Was soll ich schauen', path: '/de/was-soll-ich-schauen' },
        { name: category.label, path: category.urlPath },
      ]
    : [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Ne İzlesem', path: '/ne-izlesem' },
        { name: category.label, path: category.urlPath },
      ];

  const items = Array.isArray(category.items) ? category.items : [];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.title || category.label,
    description: (category.description || '').substring(0, 160),
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: items.map((item, i) => {
      /**
       * Detay sayfası TMDB numeric id bekliyor (/ne-izlesem/:imdbID param adına rağmen TMDB ID'dir).
       * URL üretimi tmdbId üzerinden yapılır; yoksa kategori URL'ine fallback.
       * imdbId Schema.org `identifier` olarak taşınır.
       */
      const detailBase = isDe ? '/de/was-soll-ich-schauen' : '/ne-izlesem';
      const itemUrl = item.tmdbId
        ? `${SITE_URL}${detailBase}/${item.tmdbId}`
        : categoryUrl;
      const node = {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': item.type === 'tv' ? 'TVSeries' : 'Movie',
          name: item.title,
          url: itemUrl,
        },
      };
      if (item.imdbId) node.item.identifier = `imdb:${item.imdbId}`;
      if (item.year) node.item.datePublished = String(item.year);
      if (Array.isArray(item.genres) && item.genres.length) node.item.genre = item.genres;
      if (typeof item.rating === 'number' && item.rating > 0) {
        node.item.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: item.rating,
          bestRating: 10,
          ratingCount: 1000,
        };
      }
      if (item.description) node.item.description = item.description.substring(0, 250);
      return node;
    }),
  };

  return [
    organizationSchema,
    webPageSchema({
      name: category.title,
      description: category.description,
      url: categoryUrl,
    }),
    breadcrumbSchema(breadcrumbs),
    itemListSchema,
  ];
}

/**
 * Bayilik sayfası için Organization + WebPage + Breadcrumb
 */
export function resellerPageSchemas(metadata, { route = '/reseller/', lang = 'tr' } = {}) {
  const isDe = lang === 'de';
  const home = isDe ? { name: 'Startseite', path: '/de' } : { name: 'Ana Sayfa', path: '/' };
  const pageLabel = isDe ? 'Wiederverkäufer' : 'Bayilik';
  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title || (isDe ? 'Wiederverkäufer-Programm' : 'IPTV Bayilik Paneli'),
      description: metadata?.description || (isDe
        ? 'Starten Sie Ihr eigenes Geschäft mit unserem Wiederverkäufer-Programm.'
        : 'IPTV bayilik programımızla kendi işinizi kurun. En gelişmiş kontrol paneli ve yüksek kazanç oranları.'),
      url: `${SITE_URL}${route}`,
      lang: isDe ? 'de' : 'tr',
    }),
    breadcrumbSchema([
      home,
      { name: pageLabel, path: route },
    ]),
  ];
}

/**
 * DE ana sayfası için schema (Almanca metadata ile). Görünür breadcrumb olmadığı
 * için ana sayfada BreadcrumbList kullanılmaz.
 */
export function homePageSchemasDE(metadata, videos) {
  const schemas = [
    organizationSchemaDE,
    websiteSchema,
    webPageSchema({
      name: metadata?.title || "Premium IPTV Deutschland",
      description: metadata?.description || "Entdecken Sie Premium IPTV in Deutschland. Stabile 4K IPTV ohne Unterbrechung.",
      url: `${SITE_URL}/de/`,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${SITE_URL}/de/#premium-features`,
      name: 'QruzeTV Premium IPTV Funktionen',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: '4K Ultra HD Streaming',
            description: 'Klares und flüssiges IPTV Streaming in Kinoqualität.',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Anti-Freeze Technologie',
            description: 'Optimierte Streaming-Infrastruktur für stabile IPTV Übertragung auch zur Stoßzeit.',
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Riesiges VOD-Archiv',
            description: 'Große IPTV VOD-Bibliothek mit aktuellen Serien, Filmen und Dokumentationen.',
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Service',
            name: '24/7 Premium Support',
            description: 'Schnelle Hilfe bei Einrichtung, Gerätekompatibilität und technischen Fragen.',
          },
        },
      ],
    },
  ];
  const videoSchemas = videoGuidesSchema(videos);
  if (videoSchemas?.length) schemas.push(...videoSchemas);
  return schemas;
}

export function packagesPageSchemasDE(metadata) {
  return [
    organizationSchemaDE,
    webPageSchema({
      name: metadata?.title || "Premium IPTV Deutschland Pakete",
      description: metadata?.description || "IPTV-Pakete für Deutschland und Europa vergleichen und vor dem Kauf kostenlos testen.",
      url: `${SITE_URL}/de/pakete/`,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SITE_URL}/de/pakete/#service`,
      name: 'QruzeTV IPTV Abonnement',
      serviceType: 'IPTV Streaming Subscription',
      description:
        'QruzeTV IPTV Abo: 10.000+ Kanäle, 4K UHD Qualität, VOD-Bibliothek, Live-Sport. Pakete für Deutschland, Österreich und die Niederlande.',
      provider: {
        '@id': `${SITE_URL}/#organization`,
      },
      areaServed: [
        { '@type': 'Country', name: 'Deutschland' },
        { '@type': 'Country', name: 'Österreich' },
        { '@type': 'Country', name: 'Niederlande' },
      ],
    },
  ];
}
