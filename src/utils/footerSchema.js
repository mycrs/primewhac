/**
 * Footer JSON-LD — SiteNavigationElement + Service @graph.
 * footerGeoIntelligence.js verisiyle birebir eşleşir; footer'da görünen her bölge,
 * şehir ve link schema'da da yer alır (tutarlılık = güven sinyali).
 */
import { SITE_URL } from '../constants/siteUrl.js';
import {
  COVERAGE_MATRIX,
  COVERAGE_COUNTRY,
  TOPIC_CLUSTERS,
} from '../data/footerGeoIntelligence.js';

function buildAreaServed(locale) {
  const matrix = COVERAGE_MATRIX[locale] || COVERAGE_MATRIX.tr;
  const countryMap = COVERAGE_COUNTRY[locale] || COVERAGE_COUNTRY.tr;

  const countries = new Set();
  const cities = [];

  matrix.forEach(({ region, cities: regionCities }) => {
    const code = countryMap[region] || countryMap.default;
    countries.add(code);
    regionCities.forEach((name) => {
      cities.push({
        '@type': 'City',
        name,
        containedInPlace: { '@type': 'Country', name: code },
      });
    });
  });

  return [
    ...[...countries].map((code) => ({ '@type': 'Country', name: code })),
    ...cities,
  ];
}

function buildNavigationElements(locale) {
  const clusters = TOPIC_CLUSTERS[locale] || TOPIC_CLUSTERS.tr;
  return clusters.flatMap((cluster) =>
    cluster.links.map((link) => ({
      '@type': 'SiteNavigationElement',
      name: link.label,
      url: `${SITE_URL}${link.to}`,
    })),
  );
}

/**
 * Footer'a gömülecek tek @graph nesnesi döner.
 * @param {'tr'|'de'} locale
 */
export function buildFooterJsonLd(locale = 'tr') {
  const isDe = locale === 'de';
  const navElements = buildNavigationElements(locale);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#footer-navigation-${locale}`,
        name: isDe ? 'QruzeTV Footer-Navigation' : 'QruzeTV Alt Menü Navigasyonu',
        itemListElement: navElements.map((el, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: el,
        })),
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/#iptv-service-${locale}`,
        serviceType: 'IPTV Streaming Service',
        name: 'QruzeTV Premium IPTV',
        description: isDe
          ? 'Premium IPTV-Streaming mit Live-TV, Filmen und Serien in 4K/UHD für die DACH-Region und die Niederlande.'
          : 'Türkiye genelinde ve Avrupa\'da 4K/UHD canlı TV, film ve dizi sunan premium IPTV yayın hizmeti.',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: buildAreaServed(locale),
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: isDe ? `${SITE_URL}/de/pakete` : `${SITE_URL}/paketler`,
          availableLanguage: isDe ? ['German', 'Turkish'] : ['Turkish', 'German'],
        },
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
    ],
  };
}
