/**
 * Müşteri yorumları JSON-LD — @graph (WebPage + Product).
 * Review: yalnızca @type, author, reviewRating, reviewBody; datePublished varsa eklenir.
 * Product: aggregateRating, review[]; offers (Offer + hasMerchantReturnPolicy + shippingDetails).
 */
import { SITE_URL } from '../constants/siteUrl.js';

const REVIEWED_APP_NAME = 'QruzeTV IPTV';
const LOGO_URL = `${SITE_URL}/logo.png`;

/**
 * Yorumlar sayfasındaki Product, paket sayfasına yönlendiren bir özet ürün kartıdır.
 * price:'0' geçersiz; priceSpecification ile aralık belirtilir.
 * Dil parametresine göre TR veya DE offer döner.
 */
function buildProductOffer(lang) {
  const isDe = lang === 'de';
  return {
    '@type': 'AggregateOffer',
    url: isDe ? `${SITE_URL}/de/pakete/` : `${SITE_URL}/paketler/`,
    lowPrice: isDe ? '45' : '750',
    highPrice: isDe ? '185' : '1900',
    priceCurrency: isDe ? 'EUR' : 'TRY',
    offerCount: isDe ? '4' : '4',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-12-31',
    seller: { '@type': 'Organization', name: 'QruzeTV', url: `${SITE_URL}` },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      name: isDe ? 'QruzeTV Digital Subscription Return Policy' : 'QruzeTV Dijital Abonelik İade Politikası',
      applicableCountry: isDe ? ['DE', 'AT', 'CH', 'NL'] : 'TR',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 1,
      returnFees: 'https://schema.org/FreeReturn',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: isDe ? 'EUR' : 'TRY' },
      shippingDestination: isDe
        ? [
            { '@type': 'DefinedRegion', addressCountry: 'DE' },
            { '@type': 'DefinedRegion', addressCountry: 'AT' },
            { '@type': 'DefinedRegion', addressCountry: 'CH' },
            { '@type': 'DefinedRegion', addressCountry: 'NL' },
          ]
        : { '@type': 'DefinedRegion', addressCountry: 'TR' },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
      },
    },
  };
}

function serviceDescription(lang) {
  return lang === 'de'
    ? 'Premium IPTV mit Live-TV, Mediathek und Kundensupport.'
    : 'Premium IPTV: canlı TV, VOD ve müşteri desteği.';
}

function buildReviewNode(r) {
  const ratingNum = Math.min(5, Math.max(1, Number(r.rating)));
  const authorName = String(r.author_display_name || '').trim();
  const body = String(r.body || '').trim().substring(0, 5000);
  const rawDate = r.created_at || r.moderated_at;
  const datePublished =
    rawDate && String(rawDate).includes('T') ? String(rawDate).split('T')[0] : undefined;

  const node = {
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: authorName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: ratingNum,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: body,
  };
  if (datePublished) node.datePublished = datePublished;
  return node;
}

/**
 * @returns {object|object[]} Yorum yok: [WebPage]. Yorum var: tek @graph nesnesi (WebPage + Product).
 */
export function buildCustomerReviewsJsonLd({ reviews, pageUrl, lang = 'tr' }) {
  const approved = (reviews || []).filter((r) => {
    const stars = Number(r?.rating);
    const bodyOk = String(r?.body || '').trim().length > 0;
    const authorOk = String(r?.author_display_name || '').trim().length > 0;
    return stars >= 1 && stars <= 5 && bodyOk && authorOk;
  });

  const webPageNode = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: lang === 'de' ? 'Kundenbewertungen | QruzeTV' : 'Müşteri Yorumları | QruzeTV',
    inLanguage: lang === 'de' ? 'de-DE' : 'tr-TR',
    isPartOf: { '@type': 'WebSite', name: 'QruzeTV', url: SITE_URL },
  };

  if (approved.length === 0) {
    return [
      {
        '@context': 'https://schema.org',
        ...webPageNode,
      },
    ];
  }

  const sum = approved.reduce((acc, r) => acc + Number(r.rating), 0);
  const avg = Math.round((sum / approved.length) * 10) / 10;
  const reviewEntities = approved.map((r) => buildReviewNode(r));
  const itemId = `${pageUrl}#qruxehd-iptv`;

  const productNode = {
    '@type': 'Product',
    '@id': itemId,
    name: REVIEWED_APP_NAME,
    description: serviceDescription(lang),
    image: LOGO_URL,
    brand: {
      '@type': 'Brand',
      name: 'QruzeTV',
    },
    url: SITE_URL,
    offers: buildProductOffer(lang),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: approved.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviewEntities,
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...webPageNode,
        mainEntity: { '@id': itemId },
      },
      productNode,
    ],
  };
}

/**
 * Sayfada görünen SSS ile birebir eşleşen FAQPage şeması.
 */
export function buildReviewsFaqJsonLd({ pageUrl, lang = 'tr' }) {
  const isDe = lang === 'de';
  const mainEntity = isDe
    ? [
        {
          '@type': 'Question',
          name: 'Sind die Bewertungen auf dieser Seite echte Kundenmeinungen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ja. Alle angezeigten Bewertungen stammen von eingereichten Formularen und werden manuell von QruzeTV geprüft, bevor sie veröffentlicht werden. Es gibt keine automatische Veröffentlichung.',
          },
        },
        {
          '@type': 'Question',
          name: 'Warum erscheint meine Bewertung nicht sofort?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Zur Qualitätssicherung und Einhaltung der Richtlinien werden Bewertungen vor der Veröffentlichung moderiert. Nach Prüfung erscheinen freigegebene Bewertungen auf dieser Seite.',
          },
        },
        {
          '@type': 'Question',
          name: 'Welche Angaben muss ich bei der Bewertung machen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Neben Anzeigename und Sternebewertung geben Sie bitte die Laufzeit Ihres gekauften Pakets (in Monaten) und an, seit wie vielen Monaten Sie den Dienst nutzen. Der Text soll Ihre eigene Erfahrung ehrlich beschreiben.',
          },
        },
        {
          '@type': 'Question',
          name: 'Gibt es Anreize oder Zahlungen für positive Bewertungen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nein. QruzeTV bietet keine Vergütung oder Gegenleistung für Bewertungen. Bewertungen sollen freiwillig und authentisch sein.',
          },
        },
      ]
    : [
        {
          '@type': 'Question',
          name: 'Bu sayfadaki yorumlar gerçek müşteri görüşü mü?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Evet. Listelenen tüm yorumlar müşterilerimizin form ile gönderdiği metinlerden oluşur; QruzeTV tarafından yayından önce manuel olarak kontrol edilir ve onaylanır. Otomatik yayın yoktur.',
          },
        },
        {
          '@type': 'Question',
          name: 'Yorumum neden hemen görünmüyor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kalite ve kurallara uyum için yorumlar moderasyondan geçer. Uygun bulunan yorumlar onaylandıktan sonra bu sayfada yayınır.',
          },
        },
        {
          '@type': 'Question',
          name: 'Yorum bırakırken hangi bilgileri vermeliyim?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Görünen adınız, yıldız puanınız, satın aldığınız paket süresi (kaç aylık) ve hizmeti kaç aydır kullandığınız kullanıcıların bağlamı anlamasına yardımcı olur. Metin kısmında kendi deneyiminizi dürüstçe yazın.',
          },
        },
        {
          '@type': 'Question',
          name: 'Olumlu yorum karşılığı ödül veya ücret veriliyor mu?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hayır. QruzeTV, yorum karşılığı ücret, indirim veya başka bir menfaat sunmaz. Yorumlar gönüllü ve gerçek deneyime dayanmalıdır.',
          },
        },
      ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
    url: pageUrl,
    inLanguage: isDe ? 'de-DE' : 'tr-TR',
  };
}
