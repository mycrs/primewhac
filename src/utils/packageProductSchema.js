/**
 * /paketler — Product ItemList JSON-LD (aktif paketler, cineverse.pro).
 */
import { SITE_URL } from '../constants/siteUrl.js';
import { merchantOfferExtras, SCHEMA_PRICE_VALID_UNTIL } from './schemaMerchantOffer.js';

const LOGO_URL = `${SITE_URL}/logo.png`;

export function flattenPackagesData(packagesData) {
  if (!packagesData) return [];
  if (Array.isArray(packagesData)) return packagesData;
  return [...(packagesData.turkiye || []), ...(packagesData.avrupa || [])];
}

function resolveRegion(pkg) {
  const r = String(pkg?.region || '').toUpperCase();
  if (r === 'EU' || r === 'AVRUPA') return 'EU';
  return 'TR';
}

function resolveCurrencyIso(pkg) {
  const sym = String(pkg?.currency || '').trim();
  if (sym === '€' || sym.toUpperCase() === 'EUR') return 'EUR';
  const region = resolveRegion(pkg);
  return region === 'EU' ? 'EUR' : 'TRY';
}

function parsePriceNumber(pkg) {
  const raw = pkg?.price;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) return raw;
  if (typeof raw === 'string') {
    const n = parseFloat(raw.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function buildProductName(pkg, locale) {
  const base = String(pkg?.name || pkg?.duration || 'IPTV Paketi').trim();
  const tier = String(pkg?.tier || '').toLowerCase() === 'premium' ? ' Premium' : '';
  if (locale === 'de') return `QruzeTV IPTV ${base}${tier}`;
  return `QruzeTV ${base}${tier} IPTV Paketi`;
}

function buildProductDescription(pkg, locale) {
  const custom = String(pkg?.card_description || '').trim();
  if (custom) return custom.substring(0, 500);
  if (locale === 'de') {
    return 'Premium IPTV Abo: 4K/UHD, Live-TV, VOD und Support.';
  }
  return 'QruzeTV premium IPTV aboneliği: 4K/UHD, binlerce kanal, VOD ve 7/24 destek.';
}

function buildSingleProduct(pkg, pageUrl, locale, reviewMeta) {
  const price = parsePriceNumber(pkg);
  if (!price) return null;

  const region = resolveRegion(pkg);
  const country = region === 'EU' ? 'EU' : 'TR';
  const sku = String(pkg?.id || `${region}-${pkg?.name || 'pkg'}`).replace(/\s+/g, '-');

  const product = {
    '@type': 'Product',
    '@id': `${pageUrl}#product-${sku}`,
    name: buildProductName(pkg, locale),
    description: buildProductDescription(pkg, locale),
    image: [LOGO_URL],
    sku,
    brand: { '@type': 'Brand', name: 'QruzeTV' },
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      price: String(price),
      priceCurrency: resolveCurrencyIso(pkg),
      availability: 'https://schema.org/InStock',
      priceValidUntil: SCHEMA_PRICE_VALID_UNTIL,
      ...merchantOfferExtras(country),
    },
  };

  if (reviewMeta?.aggregateRating) {
    product.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewMeta.aggregateRating.ratingValue,
      reviewCount: reviewMeta.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (Array.isArray(reviewMeta?.reviews) && reviewMeta.reviews.length > 0) {
    product.review = reviewMeta.reviews.slice(0, 5).map((r) => {
      const node = {
        '@type': 'Review',
        author: { '@type': 'Person', name: String(r.author_display_name || '').trim() },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: Math.min(5, Math.max(1, Number(r.rating))),
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: String(r.body || '').trim().substring(0, 500),
      };
      const rawDate = r.created_at || r.moderated_at;
      if (rawDate && String(rawDate).includes('T')) {
        node.datePublished = String(rawDate).split('T')[0];
      }
      return node;
    });
  }

  return product;
}

export function buildPackagesProductJsonLd(packagesData, { pageUrl, locale = 'tr', reviewMeta } = {}) {
  const url = pageUrl || `${SITE_URL}/paketler`;
  const packages = flattenPackagesData(packagesData).filter((p) => p && p.enabled !== false);
  const products = packages.map((p) => buildSingleProduct(p, url, locale, reviewMeta)).filter(Boolean);
  if (products.length === 0) return [];

  return [{
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#product-list`,
    name: locale === 'de' ? 'QruzeTV IPTV Pakete' : 'QruzeTV IPTV Paketleri',
    url,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: product,
    })),
  }];
}
