/**
 * Prerender edilen sayfalar için statik JSON-LD schema üretimi.
 * React/Helmet runtime schema'sını bozmaz; build sonrası ilk HTML'e enjekte edilir.
 */
import { prerenderSeoByRoute } from './prerenderSeo.js';
import { categoriesTR, categoriesDE } from './data/whatToWatchCategories.js';
import { defaultFaqData } from './data/defaultFaqData.js';
import { defaultFaqDataDESections } from './data/prerenderFaqDefaultsDE.js';
import {
  CONTENT_ALIASES,
  DEVICE_FAQ_DE,
  DEVICE_FAQ_TR,
  DEVICE_LABELS,
  INSTALLATION_DEVICE_HOWTO_STEPS,
} from './data/installationDeviceHowToSteps.js';
import { getTvBrandGuide, localizeTvBrandGuide } from './data/tvBrandGuides.js';
import { SITE_URL } from './constants/siteUrl.js';
import { APP_GUIDES_BASE, getAppGuide } from './data/appInstallationGuides.js';
import { appGuideSchemas } from './utils/appGuideSchema.js';
import {
  organizationSchema,
  webPageSchema,
  breadcrumbSchema as baseBreadcrumbSchema,
  homePageSchemas,
  homePageSchemasDE,
  packagesPageSchemas,
  packagesPageSchemasDE,
  faqPageSchemas,
  blogListPageSchemas,
  channelsPageSchemas,
  resellerPageSchemas,
  matchSchedulePageSchemas,
  whatToWatchPageSchemas,
  whatToWatchPageSchemasDE,
  whatToWatchCategorySchemas,
} from './utils/seoSchema.js';
import { buildCustomerReviewsJsonLd, buildReviewsFaqJsonLd } from './utils/customerReviewsSchema.js';
import { buildFooterJsonLd } from './utils/footerSchema.js';
import { sanitizeJsonLdSchema } from './utils/jsonLdSanitize.js';

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
        text: 'Aktivasyondan sonraki ilk 24 saat içinde iade talebi iletilebilir. Dijital hizmetlerde iade, QruzeTV kaynaklı ve destek tarafından çözülemeyen teknik sorunlar için hizmet şartlarına göre değerlendirilir.',
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

/**
 * Ortak sözleşme: kök dışı tüm path'ler trailing slash'lı (kök '/' kalır).
 * seoCanonicalHreflang.js'teki withTrailingSlash ile aynı kural.
 */
function withTrailingSlash(p) {
  if (!p || p === '/') return p || '/';
  return p.endsWith('/') ? p : `${p}/`;
}

/**
 * Breadcrumb item URL'leri canonical formda (slash'lı) basılmalı; aksi halde statik
 * JSON-LD URL'leri sayfa canonical'ıyla eşleşmez. seoSchema.js'teki breadcrumbSchema
 * path'in sondaki slash'ını kırptığı için bu sarmalayıcı her item'a slash'lı mutlak
 * `url` vererek canonical formu sabitler (kök '/' ve '/de/' doğru formda kalır).
 */
function prerenderBreadcrumbSchema(items) {
  return baseBreadcrumbSchema(
    (items || []).map((item) => ({
      ...item,
      url: item?.url || `${SITE_URL}${withTrailingSlash(item?.path || '/')}`,
    })),
  );
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
    prerenderBreadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Häufige Fragen', path: '/de/sss' },
    ]),
    faqSchema,
  ].filter(Boolean);
}

function aboutPageSchemas(metadata, path, lang) {
  return [
    prerenderBreadcrumbSchema(
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
  return [
    prerenderBreadcrumbSchema([
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
    prerenderBreadcrumbSchema([
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
  const tvBrandGuide = localizeTvBrandGuide(getTvBrandGuide(slug), lang);
  const labels = tvBrandGuide
    ? { tr: `${tvBrandGuide.brand} TV`, de: `${tvBrandGuide.brand} TV` }
    : (DEVICE_LABELS[slug] || { tr: slug, de: slug });
  const contentSlug = CONTENT_ALIASES[slug] || slug;
  const stepSource =
    tvBrandGuide?.howToSteps ||
    INSTALLATION_DEVICE_HOWTO_STEPS[contentSlug]?.[lang] ||
    [];
  const basePath = isDe ? '/de/einrichtung' : '/kurulum';
  const metadata = metaFromRoute(route);

  const faqMap = isDe ? DEVICE_FAQ_DE : DEVICE_FAQ_TR;
  const faqItems = tvBrandGuide?.faqs || faqMap[slug] || faqMap[contentSlug] || [];
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

  const howToName = tvBrandGuide?.title || (isDe ? `${labels.de} IPTV Einrichtung` : `${labels.tr} IPTV Kurulumu`);

  const steps = stepSource.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.name,
    text: step.text,
  }));

  const schemas = [
    prerenderBreadcrumbSchema([
      isDe ? { name: 'Startseite', path: '/de' } : { name: 'Ana Sayfa', path: '/' },
      isDe ? { name: 'Einrichtung', path: '/de/einrichtung' } : { name: 'Kurulum', path: '/kurulum' },
      ...(tvBrandGuide ? [{ name: 'Smart TV', path: `${basePath}/smart-tv` }] : []),
      { name: isDe ? labels.de : labels.tr, path: `${basePath}/${slug}` },
    ]),
  ];

  if (tvBrandGuide) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: tvBrandGuide.title,
      description: tvBrandGuide.metaDescription,
      inLanguage: isDe ? 'de-DE' : 'tr-TR',
      datePublished: '2026-07-31',
      dateModified: '2026-07-31',
      mainEntityOfPage: `${SITE_URL}${route}/`,
      author: { '@type': 'Organization', name: 'QruzeTV', url: `${SITE_URL}/` },
      publisher: { '@type': 'Organization', name: 'QruzeTV', url: `${SITE_URL}/` },
      about: [`${tvBrandGuide.brand} Smart TV`, 'IPTV', ...tvBrandGuide.systems.map((system) => system.label)],
    });
  }

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
    prerenderBreadcrumbSchema([
      { name: 'Startseite', path: '/de' },
      { name: 'Blog', path: '/de/blog' },
    ]),
  ];
}

function testPageSchemas(metadata, { route = '/test', lang = 'tr' } = {}) {
  const isDe = lang === 'de';
  const pageUrl = `${SITE_URL}${route}`;
  return [
    prerenderBreadcrumbSchema(
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
    prerenderBreadcrumbSchema([
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
    prerenderBreadcrumbSchema(
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
    prerenderBreadcrumbSchema([
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

function titanIptvPageSchemas(metadata) {
  const faqList = [
    {
      q: "Titan IPTV nedir ve neden bu kadar popüler?",
      a: "Titan IPTV; Avrupa'nın ana internet omurgası (DE-CIX Frankfurt) üzerinde konumlandırılmış yüksek hızlı CDN sunucuları ve Anti-Freeze 10.0 önbellekleme teknolojisi ile çalışan yeni nesil bir IPTV yayın altyapısıdır. Özellikle canlı spor karşılaşmaları, yüksek çözünürlüklü 4K belgeseller ve binlerce güncel film/dizi içeriğini sıfır takılma ve 60 FPS kare hızıyla sunması sayesinde en çok tercih edilen yayın platformudur."
    },
    {
      q: "Titan IPTV nasıl satın alınır?",
      a: "Titan IPTV satın almak yalnızca 3 adımdan oluşur: 1) Sitemizdeki Paketler sayfasından kullanım sürenize (1, 3, 6 veya 12 Ay) uygun paketi seçin. 2) Güvenli ödeme veya WhatsApp canlı destek hattımız üzerinden siparişinizi tamamlayın. 3) Ödemeniz onaylandığı anda M3U Plus bağlantı linkiniz ve Xtream Codes API bilgileriniz (Sunucu, Kullanıcı Adı, Şifre) 5 dakika içerisinde WhatsApp veya e-posta yoluyla iletilir."
    },
    {
      q: "Titan IPTV nereden bulunur ve sahte satıcılardan nasıl ayırt edilir?",
      a: "İnternette 'Titan IPTV' adını kullanarak sahte veya aşırı yüklenmiş klon paneller satan yetkisiz aracılar bulunmaktadır. Orijinal Titan IPTV lisansı yalnızca QruzeTV gibi kurumsal, 7/24 teknik destek sağlayan, SSL korumalı ve müşteri memnuniyeti garantisi sunan güvenilir platformlardan temin edilmelidir. Orijinal lisanslarda kanal geçişleri 1 saniyenin altındadır ve derbi saatlerinde yayın kesintisi yaşanmaz."
    },
    {
      q: "Satın alma işleminden sonra yayınım ne zaman açılır?",
      a: "Siparişiniz onaylandığı anda sistemimiz otomatik aktivasyon sürecini başlatır. Ortalama 5 ila 10 dakika içerisinde tüm kurulum parametreleriniz hazırlanarak tarafınıza teslim edilir. Dilerseniz uzman teknik ekibimiz cihazınıza uzaktan kurulum desteği de sağlar."
    },
    {
      q: "Satın almadan önce ücretsiz deneme (test) yayını alabilir miyim?",
      a: "Evet! QruzeTV güvencesiyle sunulan Titan IPTV kalitesini satın almadan önce kendi televizyonunuzda veya telefonunuzda bizzat deneyimleyebilirsiniz. Sitemizdeki 'Ücretsiz Test' butonuna tıklayarak anında deneme yayını talep edebilirsiniz."
    },
    {
      q: "Titan IPTV hangi cihazlarda ve hangi uygulamalarla çalışır?",
      a: "Titan IPTV; Samsung ve LG Smart TV (IBO Player, Smart IPTV), Android TV ve TV Box (TiviMate, IPTV Smarters Pro, XCIPTV), Amazon Fire TV Stick, Apple TV, iPhone/iPad (NEXT+, CASTORA, IPTVX), Windows PC ve Mac bilgisayarlar dahil tüm modern akıllı cihazlarla %100 uyumludur."
    },
    {
      q: "Titan IPTV maç saatlerinde donma veya takılma yapar mı?",
      a: "Hayır. Titan IPTV sunucuları dinamik yük dengeleme (load balancer) teknolojisine sahiptir. Milyonlarca izleyicinin aynı anda bağlandığı derbi ve büyük kupa maçlarında trafik otomatik olarak yedek sunuculara dağıtılır. En az 16 Mbit/s stabil internet bağlantısı ile donmasız ve takılmasız Full HD / 4K izleme garanti edilir."
    }
  ];

  return [
    prerenderBreadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Titan IPTV Satın Al', path: '/titan-iptv' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/titan-iptv`,
      lang: 'tr',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Titan IPTV Lisans ve Yayın Paketi',
      image: `${SITE_URL}/og/titan-iptv.jpg`,
      description: metadata.description,
      brand: {
        '@type': 'Brand',
        name: 'QruzeTV',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '15',
        highPrice: '60',
        offerCount: '4',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '412',
      },
    },
  ];
}

function timsahIptvPageSchemas(metadata) {
  const faqList = [
    {
      q: "Timsah Panel IPTV nedir ve neden tercih edilir?",
      a: "Timsah Panel IPTV; yüksek bant genişliğine sahip Avrupa CDN sunucuları ve Anti-Freeze 10.0 akıllı önbellekleme teknolojisi ile çalışan yeni nesil bir IPTV yayın altyapısıdır. Özellikle canlı spor karşılaşmaları, yüksek çözünürlüklü 4K belgeseller ve binlerce güncel film/dizi içeriğini sıfır takılma ve 60 FPS kare hızıyla sunması sayesinde en çok tercih edilen panel sistemlerinden biridir."
    },
    {
      q: "Timsah Panel IPTV nasıl satın alınır?",
      a: "Timsah Panel IPTV satın almak yalnızca 3 adımdan oluşur: 1) Sitemizdeki Paketler sayfasından kullanım sürenize (1, 3, 6 veya 12 Ay) uygun paketi seçin. 2) Güvenli ödeme veya WhatsApp canlı destek hattımız üzerinden siparişinizi tamamlayın. 3) Ödemeniz onaylandığı anda M3U Plus bağlantı linkiniz ve Xtream Codes API bilgileriniz (Sunucu, Kullanıcı Adı, Şifre) 5 dakika içerisinde WhatsApp veya e-posta yoluyla iletilir."
    },
    {
      q: "Orijinal Timsah IPTV Panel nereden bulunur ve sahte satıcılardan nasıl ayırt edilir?",
      a: "İnternette 'Timsah Panel' adını kullanarak sahte veya aşırı yüklenmiş klon paneller satan yetkisiz aracılar bulunmaktadır. Orijinal Timsah Panel lisansı yalnızca QruzeTV gibi kurumsal, 7/24 teknik destek sağlayan, SSL korumalı ve müşteri memnuniyeti garantisi sunan güvenilir platformlardan temin edilmelidir. Orijinal lisanslarda kanal geçişleri 1 saniyenin altındadır ve derbi saatlerinde yayın kesintisi yaşanmaz."
    },
    {
      q: "Satın alma işleminden sonra yayınım ne zaman açılır?",
      a: "Siparişiniz onaylandığı anda sistemimiz otomatik aktivasyon sürecini başlatır. Ortalama 5 ila 10 dakika içerisinde tüm kurulum parametreleriniz hazırlanarak tarafınıza teslim edilir. Dilerseniz uzman teknik ekibimiz cihazınıza uzaktan kurulum desteği de sağlar."
    },
    {
      q: "Satın almadan önce ücretsiz deneme (test) yayını alabilir miyim?",
      a: "Evet! QruzeTV güvencesiyle sunulan Timsah Panel kalitesini satın almadan önce kendi televizyonunuzda veya telefonunuzda bizzat deneyimleyebilirsiniz. Sitemizdeki 'Ücretsiz Test' butonuna tıklayarak anında deneme yayını talep edebilirsiniz."
    },
    {
      q: "Timsah Panel hangi cihazlarda ve hangi uygulamalarla çalışır?",
      a: "Timsah Panel IPTV; Samsung ve LG Smart TV (IBO Player, Smart IPTV), Android TV ve TV Box (TiviMate, IPTV Smarters Pro, XCIPTV), Amazon Fire TV Stick, Apple TV, iPhone/iPad (NEXT+, CASTORA, IPTVX), Windows PC ve Mac bilgisayarlar dahil tüm modern akıllı cihazlarla %100 uyumludur."
    },
    {
      q: "Timsah Panel maç saatlerinde donma veya takılma yapar mı?",
      a: "Hayır. Timsah Panel sunucuları dinamik yük dengeleme (load balancer) teknolojisine sahiptir. Milyonlarca izleyicinin aynı anda bağlandığı derbi ve büyük kupa maçlarında trafik otomatik olarak yedek sunuculara dağıtılır. En az 16 Mbit/s stabil internet bağlantısı ile donmasız ve takılmasız Full HD / 4K izleme garanti edilir."
    }
  ];

  return [
    prerenderBreadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Timsah Panel IPTV Satın Al', path: '/timsah-iptv' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/timsah-iptv`,
      lang: 'tr',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Timsah Panel IPTV Lisans ve Yayın Paketi',
      image: `${SITE_URL}/og/timsah-iptv.jpg`,
      description: metadata.description,
      brand: {
        '@type': 'Brand',
        name: 'QruzeTV',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '15',
        highPrice: '60',
        offerCount: '4',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '389',
      },
    },
  ];
}

function mpremiumIptvPageSchemas(metadata) {
  const faqList = [
    {
      q: "MPremium IPTV nedir ve neden bu kadar çok tercih ediliyor?",
      a: "MPremium IPTV; Avrupa genelinde konumlandırılmış yüksek kapasiteli fiber CDN sunucuları ve Anti-Freeze 10.0 önbellekleme teknolojisi ile çalışan premium bir yayın altyapısıdır. Özellikle canlı spor karşılaşmaları, yüksek çözünürlüklü 4K belgeseller ve binlerce güncel film/dizi içeriğini sıfır gecikme ve 60 FPS kare hızıyla sunarak sektörün en beğenilen yayın sağlayıcılarından biri olmuştur."
    },
    {
      q: "MPremium IPTV nasıl satın alınır?",
      a: "MPremium IPTV satın almak yalnızca 3 basit adımdan oluşur: 1) Paketler sayfamızdan bütçenize ve kullanım sürenize (1, 3, 6 veya 12 Ay) uygun paketi seçin. 2) Güvenli ödeme veya WhatsApp canlı destek hattımız üzerinden siparişinizi tamamlayın. 3) Ödemeniz onaylandığı anda M3U Plus bağlantı linkiniz ve Xtream Codes API bilgileriniz (Sunucu, Kullanıcı Adı, Şifre) 5 dakika içerisinde WhatsApp veya e-posta yoluyla iletilir."
    },
    {
      q: "Orijinal MPremium IPTV nereden bulunur ve sahte satıcılardan nasıl ayırt edilir?",
      a: "İnternette 'MPremium' ismini kullanarak sahte veya aşırı yüklenmiş klon paneller satan yetkisiz aracılar bulunmaktadır. Orijinal MPremium lisansı yalnızca QruzeTV gibi kurumsal, 7/24 teknik destek sağlayan, SSL korumalı ve müşteri memnuniyeti garantisi sunan güvenilir platformlardan temin edilmelidir. Orijinal lisanslarda kanal geçişleri 1 saniyenin altındadır ve derbi saatlerinde yayın kesintisi yaşanmaz."
    },
    {
      q: "Satın alma işleminden sonra yayınım ne zaman açılır?",
      a: "Siparişiniz onaylandığı anda sistemimiz otomatik aktivasyon sürecini başlatır. Ortalama 5 ila 10 dakika içerisinde tüm kurulum parametreleriniz hazırlanarak tarafınıza teslim edilir. Dilerseniz uzman teknik ekibimiz cihazınıza uzaktan kurulum desteği de sağlar."
    },
    {
      q: "Satın almadan önce ücretsiz deneme (test) yayını alabilir miyim?",
      a: "Evet! QruzeTV güvencesiyle sunulan MPremium IPTV kalitesini satın almadan önce kendi televizyonunuzda veya telefonunuzda bizzat deneyimleyebilirsiniz. Sitemizdeki 'Ücretsiz Test' butonuna tıklayarak anında deneme yayını talep edebilirsiniz."
    },
    {
      q: "MPremium IPTV hangi cihazlarda ve hangi uygulamalarla çalışır?",
      a: "MPremium IPTV; Samsung ve LG Smart TV (IBO Player, Smart IPTV), Android TV ve TV Box (TiviMate, IPTV Smarters Pro, XCIPTV), Amazon Fire TV Stick, Apple TV, iPhone/iPad (NEXT+, CASTORA, IPTVX), Windows PC ve Mac bilgisayarlar dahil tüm modern akıllı cihazlarla %100 uyumludur."
    },
    {
      q: "MPremium IPTV maç saatlerinde donma veya takılma yapar mı?",
      a: "Hayır. MPremium IPTV sunucuları dinamik yük dengeleme (load balancer) teknolojisine sahiptir. Milyonlarca izleyicinin aynı anda bağlandığı derbi ve büyük kupa maçlarında trafik otomatik olarak yedek sunuculara dağıtılır. En az 16 Mbit/s stabil internet bağlantısı ile donmasız ve takılmasız Full HD / 4K izleme garanti edilir."
    }
  ];

  return [
    prerenderBreadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'MPremium IPTV Satın Al', path: '/mpremium-iptv' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/mpremium-iptv`,
      lang: 'tr',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'MPremium IPTV Lisans ve Yayın Paketi',
      image: `${SITE_URL}/og/mpremium-iptv.jpg`,
      description: metadata.description,
      brand: {
        '@type': 'Brand',
        name: 'QruzeTV',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '15',
        highPrice: '60',
        offerCount: '4',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '426',
      },
    },
  ];
}

function veraIptvPageSchemas(metadata) {
  const faqList = [
    {
      q: "Vera IPTV nedir ve sisteminin avantajları nelerdir?",
      a: "Vera IPTV; Avrupa ve Türkiye genelindeki yüksek hızlı sunucu ağları ile Anti-Freeze 10.0 önbellekleme protokolünü birleştiren yeni nesil bir IPTV yayın altyapısıdır. Özellikle kesintisiz canlı spor karşılaşmaları, yüksek çözünürlüklü 4K belgeseller ve zengin film/dizi arşivi ile kullanıcılara donmasız ve takılmasız bir TV izleme deneyimi sunar."
    },
    {
      q: "Vera IPTV nasıl satın alınır?",
      a: "Vera IPTV satın almak yalnızca 3 basit adımdan oluşur: 1) Sitemizdeki Paketler sayfasından dilediğiniz kullanım süresini (1, 3, 6 veya 12 Ay) seçin. 2) Güvenli ödeme veya WhatsApp canlı destek hattımız üzerinden siparişinizi tamamlayın. 3) Ödemeniz onaylandığı anda M3U bağlantı linkiniz ve Xtream Codes API bilgileriniz 5 dakika içerisinde tarafınıza iletilir."
    },
    {
      q: "Orijinal Vera IPTV nereden bulunur ve sahte satıcılardan nasıl korunulur?",
      a: "İnternette 'Vera IPTV' veya 'Vera Panel' adını kullanan yetkisiz ve kalitesiz klon paneller satılmaktadır. Orijinal Vera IPTV lisansı yalnızca QruzeTV gibi kurumsal, 7/24 teknik destek sağlayan, SSL korumalı ve müşteri memnuniyeti garantisi sunan güvenilir platformlardan temin edilmelidir. Orijinal lisanslarda kanal geçişleri anlıktır ve derbi maçlarında çökme yaşanmaz."
    },
    {
      q: "Satın alma işleminden sonra yayınım ne zaman açılır?",
      a: "Siparişiniz onaylandığı anda sistemimiz otomatik aktivasyon sürecini başlatır. Ortalama 5 ila 10 dakika içerisinde tüm kurulum parametreleriniz hazırlanarak tarafınıza teslim edilir. Dilerseniz uzman teknik ekibimiz cihazınıza uzaktan kurulum desteği de sağlar."
    },
    {
      q: "Satın almadan önce ücretsiz deneme (test) yayını alabilir miyim?",
      a: "Evet! QruzeTV güvencesiyle sunulan Vera IPTV kalitesini satın almadan önce kendi televizyonunuzda veya telefonunuzda bizzat deneyimleyebilirsiniz. Sitemizdeki 'Ücretsiz Test' butonuna tıklayarak anında deneme yayını talep edebilirsiniz."
    },
    {
      q: "Vera IPTV hangi cihazlarda ve hangi uygulamalarla çalışır?",
      a: "Vera IPTV; Samsung ve LG Smart TV (IBO Player, Smart IPTV), Android TV ve TV Box (TiviMate, IPTV Smarters Pro, XCIPTV), Amazon Fire TV Stick, Apple TV, iPhone/iPad (NEXT+, CASTORA, IPTVX), Windows PC ve Mac bilgisayarlar dahil tüm modern akıllı cihazlarla %100 uyumludur."
    },
    {
      q: "Vera IPTV maç saatlerinde donma veya takılma yapar mı?",
      a: "Hayır. Vera IPTV sunucuları dinamik yük dengeleme (load balancer) teknolojisine sahiptir. Milyonlarca izleyicinin aynı anda bağlandığı derbi ve büyük kupa maçlarında trafik otomatik olarak yedek sunuculara aktarılır. En az 16 Mbit/s stabil internet bağlantısı ile donmasız ve takılmasız Full HD / 4K izleme garanti edilir."
    }
  ];

  return [
    prerenderBreadcrumbSchema([
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Vera IPTV Satın Al', path: '/vera-iptv' },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}/vera-iptv`,
      lang: 'tr',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Vera IPTV Lisans ve Yayın Paketi',
      image: `${SITE_URL}/og/vera-iptv.jpg`,
      description: metadata.description,
      brand: {
        '@type': 'Brand',
        name: 'QruzeTV',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: '15',
        highPrice: '60',
        offerCount: '4',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '395',
      },
    },
  ];
}

function simpleWebPageSchemas(route, metadata, breadcrumbs, lang) {
  return [
    prerenderBreadcrumbSchema(breadcrumbs),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}${route}`,
      lang,
    }),
  ];
}

function blogPostPrerenderSchemas(route, metadata, isDe) {
  const home = isDe ? { name: 'Startseite', path: '/de' } : { name: 'Ana Sayfa', path: '/' };
  const blogPath = isDe ? '/de/blog' : '/blog';
  return [
    prerenderBreadcrumbSchema([
      home,
      { name: 'Blog', path: blogPath },
      { name: metadata.title, path: route },
    ]),
    webPageSchema({
      name: metadata.title,
      description: metadata.description,
      url: `${SITE_URL}${route}`,
      lang: isDe ? 'de' : 'tr',
    }),
  ];
}

/**
 * @param {string} route
 * @returns {object[]}
 */
export function getPrerenderJsonLdSchemas(route) {
  const metadata = metaFromRoute(route);
  let schemas = [];

  switch (route) {
    case '/':
      schemas = homePageSchemas(metadata, null);
      break;
    case '/de':
      schemas = homePageSchemasDE(metadata, null);
      break;
    case '/paketler':
      schemas = [
        ...packagesPageSchemas(metadata),
        prerenderBreadcrumbSchema([
          { name: 'Ana Sayfa', path: '/' },
          { name: 'Paketler', path: '/paketler' },
        ]),
        PACKAGES_FAQ_SCHEMA,
      ];
      break;
    case '/de/pakete':
      schemas = [
        ...packagesPageSchemasDE(metadata),
        prerenderBreadcrumbSchema([
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
        prerenderBreadcrumbSchema([
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
      schemas = resellerPageSchemas(metadata, { route: '/reseller', lang: 'tr' });
      break;
    case '/de/reseller':
      schemas = resellerPageSchemas(metadata, { route: '/de/reseller', lang: 'de' });
      break;
    case '/mac-programi':
      schemas = matchSchedulePageSchemas(metadata);
      break;
    case '/de/spielplan':
      schemas = matchSchedulePageSchemas({ ...metadata, canonicalUrl: `${SITE_URL}/de/spielplan` });
      break;
    case '/ne-izlesem':
      schemas = whatToWatchPageSchemas(metadata);
      break;
    case '/de/was-soll-ich-schauen':
      schemas = whatToWatchPageSchemasDE(metadata);
      break;
    case '/gizlilik':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Gizlilik Politikası', path: '/gizlilik' },
      ]);
      break;
    case '/sartlar':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Hizmet Şartları', path: '/sartlar' },
      ]);
      break;
    case '/de/privacy':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Startseite', path: '/de' },
        { name: 'Datenschutz', path: '/de/privacy' },
      ], 'de');
      break;
    case '/guide/iptv-kurulum-rehberi':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'IPTV Rehberi', path: '/guide/iptv-kurulum-rehberi' },
      ]);
      break;
    case '/de/guide/iptv-kurulum-rehberi':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Startseite', path: '/de' },
        { name: 'IPTV Leitfaden', path: '/de/guide/iptv-kurulum-rehberi' },
      ], 'de');
      break;
    case '/de/kanale':
      schemas = channelsPageSchemas(metadata);
      break;
    case '/karsilastirma':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Karşılaştırma', path: '/karsilastirma' },
      ]);
      break;
    case '/de/vergleich':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Startseite', path: '/de' },
        { name: 'Vergleich', path: '/de/vergleich' },
      ], 'de');
      break;
    case '/detailed-guides':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Detaylı Rehberler', path: '/detailed-guides' },
      ]);
      break;
    case '/de/detaillierte-anleitungen':
      schemas = simpleWebPageSchemas(route, metadata, [
        { name: 'Startseite', path: '/de' },
        { name: 'Anleitungen', path: '/de/detaillierte-anleitungen' },
      ], 'de');
      break;
    case '/de/m3u-olustur':
      schemas = m3uConverterSchemas(metadata, '/de/m3u-olustur');
      break;
    case '/titan-iptv':
      schemas = titanIptvPageSchemas(metadata);
      break;
    case '/timsah-iptv':
      schemas = timsahIptvPageSchemas(metadata);
      break;
    case '/mpremium-iptv':
      schemas = mpremiumIptvPageSchemas(metadata);
      break;
    case '/vera-iptv':
      schemas = veraIptvPageSchemas(metadata);
      break;



    default:
      if (route.startsWith('/ne-izlesem/')) {
        const slug = route.replace('/ne-izlesem/', '');
        schemas = whatToWatchCategorySchemas(categoriesTR[slug] || { slug, title: metadata.title, description: metadata.description, urlPath: route, label: metadata.title, items: [] }, 'tr');
      } else if (route.startsWith('/de/was-soll-ich-schauen/')) {
        const slug = route.replace('/de/was-soll-ich-schauen/', '');
        schemas = whatToWatchCategorySchemas(categoriesDE[slug] || { slug, title: metadata.title, description: metadata.description, urlPath: route, label: metadata.title, items: [] }, 'de');
      } else if (route.startsWith('/blog/')) {
        schemas = blogPostPrerenderSchemas(route, metadata, false);
      } else if (route.startsWith('/de/blog/')) {
        schemas = blogPostPrerenderSchemas(route, metadata, true);
      } else if (route === APP_GUIDES_BASE || route.startsWith(`${APP_GUIDES_BASE}/`)) {
        const slug = route.slice(APP_GUIDES_BASE.length + 1);
        const guide = slug ? getAppGuide(slug) : null;
        schemas = appGuideSchemas(guide, SITE_URL);
      } else if (route.startsWith('/kurulum/')) {
        const slug = route.replace('/kurulum/', '');
        schemas = devicePageSchemas(route, slug, false);
      } else if (route.startsWith('/de/einrichtung/')) {
        const slug = route.replace('/de/einrichtung/', '');
        schemas = devicePageSchemas(route, slug, true);
      }
      break;
  }

  // Footer GEO Intelligence: SiteNavigationElement + Service (areaServed) — her sayfada, route diline göre
  const footerLocale = route === '/de' || route.startsWith('/de/') ? 'de' : 'tr';
  schemas = [...schemas, buildFooterJsonLd(footerLocale)];

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
        `    <script data-prerender-jsonld="true" type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`,
    )
    .join('\n');
}
