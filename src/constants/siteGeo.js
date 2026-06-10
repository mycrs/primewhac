/**
 * Coğrafi / dil hedefleme — hreflang ile uyumlu (TR kök /, DE /de).
 * Google birincil sinyal: hreflang + html lang + og:locale + schema areaServed.
 */

export const SITE_GEO = {
  tr: {
    lang: 'tr',
    htmlLang: 'tr',
    contentLanguage: 'tr-TR',
    ogLocale: 'tr_TR',
    ogLocaleAlternate: 'de_DE',
    geoRegion: 'TR',
    geoPlacename: 'Türkiye',
    areaServedCountries: ['TR'],
    areaServedSchema: [{ '@type': 'Country', name: 'Türkiye' }],
    audienceDescription: 'Türkiye ve Türkçe konuşan izleyiciler',
  },
  de: {
    lang: 'de',
    htmlLang: 'de',
    contentLanguage: 'de-DE',
    ogLocale: 'de_DE',
    ogLocaleAlternate: 'tr_TR',
    geoRegion: 'DE',
    geoPlacename: 'Deutschland',
    areaServedCountries: ['DE', 'AT', 'CH', 'NL'],
    areaServedSchema: [
      { '@type': 'Country', name: 'Deutschland' },
      { '@type': 'Country', name: 'Österreich' },
      { '@type': 'Country', name: 'Schweiz' },
      { '@type': 'Country', name: 'Niederlande' },
    ],
    audienceDescription: 'Deutschland, Österreich, Schweiz und Europa',
  },
};

/** @param {'tr'|'de'|string} lang */
export function getSiteGeoForLang(lang) {
  return lang === 'de' ? SITE_GEO.de : SITE_GEO.tr;
}

/** Prerender (vite.config) için düz HTML meta satırları */
export function geoHeadMetaHtml(lang) {
  const geo = getSiteGeoForLang(lang);
  const placename = geo.geoPlacename.replace(/"/g, '&quot;');
  return [
    `<meta name="geo.region" content="${geo.geoRegion}">`,
    `<meta name="geo.placename" content="${placename}">`,
    `<meta http-equiv="content-language" content="${geo.contentLanguage}">`,
  ].join('\n    ');
}
