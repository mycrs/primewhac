/**
 * Prerender edilen sayfalar için statik JSON-LD schema üretimi.
 * React/Helmet runtime schema'sını bozmaz; build sonrası ilk HTML'e enjekte edilir.
 */
import { prerenderSeoByRoute } from './prerenderSeo.js';
import { defaultFaqData } from './data/defaultFaqData.js';
import { defaultFaqDataDESections } from './data/prerenderFaqDefaultsDE.js';
import {
  CONTENT_ALIASES,
  DEVICE_FAQ_DE,
  DEVICE_FAQ_TR,
  DEVICE_LABELS,
  INSTALLATION_DEVICE_HOWTO_STEPS,
} from './data/installationDeviceHowToSteps.js';
import { SITE_URL } from './constants/siteUrl.js';
import {
  organizationSchema,
  webPageSchema,
  breadcrumbSchema,
  homePageSchemas,
  homePageSchemasDE,
  packagesPageSchemas,
  packagesPageSchemasDE,
  faqPageSchemas,
  blogListPageSchemas,
  channelsPageSchemas,
  resellerPageSchemas,
} from './utils/seoSchema.js';
import { buildCustomerReviewsJsonLd, buildReviewsFaqJsonLd } from './utils/customerReviewsSchema.js';
import { sanitizeJsonLdSchema } from './utils/jsonLdSanitize.js';

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'QruzeTV',
  inLanguage: ['tr-TR', 'de-DE'],
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const PACKAGES_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '12 Aylık Premium ile 12 Aylık Paket arasındaki fark nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '12 Aylık Paket geniş VOD (film & dizi) arşivi sunarken, 12 Aylık Premium Paket üstün canlı yayın performansı ve öncelikli teknik destek içerir. Her ikisi de 4K/UHD kalite ve 10.000+ kanal sunar.',
      },
    },
    {
      '@type': 'Question',
      name: 'İade hakkım var mı?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet. Satın alma işleminden sonraki ilk 24 saat içinde koşulsuz iade hakkınız bulunmaktadır.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kaç cihazda aynı anda kullanabilirim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standart paketler 1 cihazda, Avrupa Çift Kullanıcı paketi ise 2 cihazda eş zamanlı kullanımı destekler.',
      },
    },
    {
      '@type': 'Question',
      name: "Avrupa'dan (Almanya, Hollanda, Avusturya) kullanabilir miyim?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet. QruzeTV Avrupa paketleri Almanya, Hollanda ve Avusturya dahil tüm Avrupa ülkelerinden kullanılabilir. EUR ile ödeme yapılabilir.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kredi kartı, banka transferi ve çeşitli dijital ödeme yöntemleri kabul edilmektedir. Avrupa müşterileri için SEPA banka transferi de mevcuttur.',
      },
    },
  ],
};

const INSTALLATION_HUB_FAQ_TR = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'IPTV kurulumu nasıl yapılır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cihazınıza uygun IPTV oynatıcı uygulamasını (Tivimate, 000 Player, IPTV Smarters, VLC vb.) indirin. M3U linki veya Xtream Codes bilgilerinizi uygulamaya girin. Kanallar otomatik yüklenecektir.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hangi cihazlarda IPTV izlenebilir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Android TV, Fire TV Stick, iPhone, iPad, Android telefon, Windows PC, Mac, Samsung/LG Smart TV ve tabletlerde IPTV izlenebilir. Her cihaz için uygun uygulama mevcuttur.',
      },
    },
    {
      '@type': 'Question',
      name: 'IPTV için internet hızı ne olmalı?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "HD yayın için minimum 16 Mbps, 4K yayın için 25 Mbps ve üzeri internet hızı önerilir. Ethernet bağlantısı Wi-Fi'den daha stabil sonuç verir.",
      },
    },
    {
      '@type': 'Question',
      name: 'M3U ve Xtream Codes nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'M3U, IPTV kanal listesini içeren bir link formatıdır. Xtream Codes ise sunucu adresi, kullanıcı adı ve şifre ile erişim sağlayan API formatıdır. Her ikisi de QruzeTV abonelerine sunulur.',
      },
    },
  ],
};

const SETUP_HUB_FAQ_DE = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wie richtet man IPTV ein?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Laden Sie die passende IPTV-App (Tivimate, 000 Player, IPTV Smarters, VLC) herunter. Geben Sie Ihren M3U-Link oder Xtream-Codes-Daten ein. Die Kanäle werden automatisch geladen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Auf welchen Geräten funktioniert IPTV?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'IPTV funktioniert auf Android TV, Fire TV Stick, iPhone, iPad, Android-Smartphone, Windows PC, Mac, Samsung/LG Smart TV und Tablets.',
      },
    },
  ],
};

function metaFromRoute(route) {
  const seo = prerenderSeoByRoute[route];
  if (!seo) return { title: '', description: '' };
  return { title: seo.title, description: seo.description };
}

function flattenSchemas(schemas) {
  const flat = [];
  for (const item of schemas) {
    if (!item) continue;
    if (Array.isArray(item)) flat.push(...flattenSchemas(item));
    else flat.push(item);
  }
  return flat.map((s) => sanitizeJsonLdSchema(s)).filter(Boolean);
}

function faqPageSchemasDE(metadata, sections) {
  const mainEntity = (sections || []).flatMap((section) =>
    (section?.items || []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  );

  const faqSchema =
    mainEntity.length > 0
      ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity }
      : null;

  return [
    organizationSchema,
    webPageSchema({
      name: metadata?.title,
      description: metadata?.description || '',
      url: `${SITE_URL}/de/sss`,
      lang: 'de',
    }),
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Häufige Fragen', path: '/de/sss' },
    ]),
    faqSchema,
  ].filter(Boolean);
}

function aboutPageSchemas(metadata, path, lang) {
  return [
    breadcrumbSchema(
      lang === 'de'
        ? [
            { name: 'Startseite', path: '/de' },
            { name: 'Über uns', path: '/de/uber-uns' },
          ]
        : [
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Hakkımızda', path: '/hakkimizda' },
          ],
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}${path}`,
      inLanguage: lang === 'de' ? 'de-DE' : 'tr-TR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    organizationSchema,
  ];
}

function installationHubSchemasTr(metadata) {
  const articleDate = new Date().toISOString().split('T')[0];
  return [
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Kurulum', path: '/kurulum' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'IPTV Nasıl Kurulur?',
      description: 'Tüm cihazlar için adım adım IPTV kurulumu',
      step: [
        { '@type': 'HowToStep', name: 'Uygulama İndirme', text: 'Cihazınıza uygun IPTV oynatıcı uygulamasını indirin.' },
        { '@type': 'HowToStep', name: 'Abonelik Bilgilerini Girme', text: 'Kullanıcı adı, şifre ve URL bilgilerinizi uygulamaya girin.' },
        { '@type': 'HowToStep', name: 'İzlemeye Başlama', text: 'Kanalların yüklenmesini bekleyin ve izlemeye başlayın.' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'IPTV Kurulum Rehberi - Adım Adım Talimatlar ve Sorun Giderme',
      author: { '@type': 'Organization', name: 'QruzeTV' },
      datePublished: '2026-01-01',
      dateModified: articleDate,
      url: `${SITE_URL}/kurulum`,
      image: `${SITE_URL}/default-og-image.jpg`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/kurulum` },
      publisher: {
        '@type': 'Organization',
        name: 'QruzeTV',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/default-og-image.jpg` },
      },
    },
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/kurulum`,
    }),
    INSTALLATION_HUB_FAQ_TR,
  ];
}

function setupHubSchemasDe(metadata) {
  return [
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Einrichtung', path: '/de/einrichtung' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/de/einrichtung`,
      lang: 'de',
    }),
    SETUP_HUB_FAQ_DE,
  ];
}

function devicePageSchemas(route, slug, isDe) {
  const lang = isDe ? 'de' : 'tr';
  const labels = DEVICE_LABELS[slug] || { tr: slug, de: slug };
  const contentSlug = CONTENT_ALIASES[slug] || slug;
  const stepSource = INSTALLATION_DEVICE_HOWTO_STEPS[contentSlug]?.[lang] || [];
  const basePath = isDe ? '/de/einrichtung' : '/kurulum';
  const metadata = metaFromRoute(route);

  const faqMap = isDe ? DEVICE_FAQ_DE : DEVICE_FAQ_TR;
  const faqItems = faqMap[slug] || faqMap[contentSlug] || [];
  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }
      : null;

  const howToName = isDe ? `${labels.de} IPTV Einrichtung` : `${labels.tr} IPTV Kurulumu`;

  const steps = stepSource.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.name,
    text: step.text,
  }));

  const schemas = [
    breadcrumbSchema([
      isDe ? { name: 'Startseite', path: '/de' } : { name: 'Ana Sayfa', path: '/' },
      isDe ? { name: 'Einrichtung', path: '/de/einrichtung' } : { name: 'Kurulum', path: '/kurulum' },
      { name: isDe ? labels.de : labels.tr, path: `${basePath}/${slug}` },
    ]),
  ];

  if (steps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howToName,
      description: metadata.description,
      step: steps,
    });
  }

  if (faqSchema) schemas.push(faqSchema);

  return schemas;
}

function blogDeListSchemas(metadata) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/de/blog`,
    },
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Blog', path: '/de/blog' },
    ]),
  ];
}

function testPageSchemas(metadata, { route = '/test', lang = 'tr' } = {}) {
  const isDe = lang === 'de';
  const pageUrl = `${SITE_URL}${route}`;
  return [
    breadcrumbSchema(
      isDe
        ? [
            { name: 'Startseite', path: '/de' },
            { name: 'Kostenloser Test', path: '/de/test' },
          ]
        : [
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Ücretsiz Test', path: '/test' },
          ],
    ),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: pageUrl,
      lang: isDe ? 'de' : 'tr',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: isDe ? 'QruzeTV IPTV Testzugang' : 'QruzeTV IPTV Test Hesabı',
      serviceType: isDe ? 'IPTV Testanfrage' : 'IPTV Trial Request',
      description: isDe
        ? 'IPTV-Testzugang: Gerät und App auswählen, Kontaktdaten senden und Support-Antwort erhalten.'
        : 'IPTV test hesabı talep süreci: cihaz ve uygulama seçimi, iletişim bilgilerinin gönderilmesi ve destek ekibinin yanıtı.',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: [
        { '@type': 'Country', name: 'Türkiye' },
        { '@type': 'Country', name: 'Deutschland' },
      ],
      url: pageUrl,
    },
  ];
}

function m3uConverterSchemas(metadata, path) {
  return [
    breadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'M3U Oluştur', path: '/m3u-converter' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}${path}`,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}${path}`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web browser',
      browserRequirements: 'Requires JavaScript',
    },
  ];
}

function reviewsPageSchemas(route, lang) {
  const pageUrl = `${SITE_URL}${route}`;
  const customer = buildCustomerReviewsJsonLd({ reviews: [], pageUrl, lang });
  const blocks = Array.isArray(customer) ? customer : [customer];
  return [
    breadcrumbSchema(
      lang === 'de'
        ? [
            { name: 'Startseite', path: '/de' },
            { name: 'Bewertungen', path: '/de/bewertungen' },
          ]
        : [
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Müşteri Yorumları', path: '/yorumlar' },
          ],
    ),
    ...blocks,
    buildReviewsFaqJsonLd({ pageUrl, lang }),
  ];
}

function termsPageSchemas(metadata) {
  return [
    breadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Nutzungsbedingungen', path: '/de/terms' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/de/terms`,
      lang: 'de',
    }),
  ];
}

const DEVICE_SLUGS = [
  'android-tv',
  'ios',
  'android-phone',
  'windows',
  'mac',
  'smart-tv',
  'samsung-tv',
  'lg-tv',
  'tablet',
];

/**
 * @param {string} route
 * @returns {object[]}
 */
export function getPrerenderJsonLdSchemas(route) {
  const metadata = metaFromRoute(route);
  let schemas = [];

  switch (route) {
    case '/':
      schemas = [webSiteSchema, ...homePageSchemas(metadata, null)];
      break;
    case '/de':
      schemas = [webSiteSchema, ...homePageSchemasDE(metadata, null)];
      break;
    case '/paketler':
      schemas = [
        ...packagesPageSchemas(metadata),
        breadcrumbSchema([
          { name: 'Ana Sayfa', path: '/' },
          { name: 'Paketler', path: '/paketler' },
        ]),
        PACKAGES_FAQ_SCHEMA,
      ];
      break;
    case '/de/pakete':
      schemas = [
        ...packagesPageSchemasDE(metadata),
        breadcrumbSchema([
          { name: 'Startseite', path: '/de' },
          { name: 'Pakete', path: '/de/pakete' },
        ]),
      ];
      break;
    case '/kurulum':
      schemas = installationHubSchemasTr(metadata);
      break;
    case '/de/einrichtung':
      schemas = setupHubSchemasDe(metadata);
      break;
    case '/sss':
      schemas = faqPageSchemas(metadata, defaultFaqData.sections);
      break;
    case '/de/sss':
      schemas = faqPageSchemasDE(metadata, defaultFaqDataDESections);
      break;
    case '/blog':
      schemas = blogListPageSchemas(metadata, []);
      break;
    case '/de/blog':
      schemas = blogDeListSchemas(metadata);
      break;
    case '/yorumlar':
      schemas = reviewsPageSchemas(route, 'tr');
      break;
    case '/de/bewertungen':
      schemas = reviewsPageSchemas(route, 'de');
      break;
    case '/test':
      schemas = testPageSchemas(metadata);
      break;
    case '/de/test':
      schemas = testPageSchemas(metadata, { route: '/de/test', lang: 'de' });
      break;
    case '/sitemap':
      schemas = [
        breadcrumbSchema([
          { name: 'Ana Sayfa', path: '/' },
          { name: 'Site Haritası', path: '/sitemap' },
        ]),
        webPageSchema({
          name: metadata.title,
          description: metadata.description,
          url: `${SITE_URL}/sitemap`,
        }),
      ];
      break;
    case '/m3u-converter':
      schemas = m3uConverterSchemas(metadata, '/m3u-converter');
      break;
    case '/hakkimizda':
      schemas = aboutPageSchemas(metadata, '/hakkimizda', 'tr');
      break;
    case '/de/uber-uns':
      schemas = aboutPageSchemas(metadata, '/de/uber-uns', 'de');
      break;
    case '/de/terms':
      schemas = termsPageSchemas(metadata);
      break;
    case '/channels':
      schemas = channelsPageSchemas(metadata);
      break;
    case '/reseller':
      schemas = resellerPageSchemas(metadata);
      break;
    default:
      if (route.startsWith('/kurulum/')) {
        const slug = route.replace('/kurulum/', '');
        if (DEVICE_SLUGS.includes(slug)) schemas = devicePageSchemas(route, slug, false);
      } else if (route.startsWith('/de/einrichtung/')) {
        const slug = route.replace('/de/einrichtung/', '');
        if (DEVICE_SLUGS.includes(slug)) schemas = devicePageSchemas(route, slug, true);
      }
      break;
  }

  return flattenSchemas(schemas);
}

/**
 * @param {object[]} schemas
 * @returns {string}
 */
export function renderJsonLdScriptsHtml(schemas) {
  const cleaned = flattenSchemas(schemas);
  if (!cleaned.length) return '';
  return cleaned
    .map(
      (schema) =>
        `    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`,
    )
    .join('\n');
}
