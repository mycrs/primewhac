/**
 * Smart TV kurulum — uygulama bazlı sayfa yapılandırması.
 * Hub: /kurulum/smart-tv
 * Uygulama sayfaları: smart-tv-0-player, smart-tv-smarters-pro
 */

export const SMART_TV_HUB_SLUG = 'smart-tv';

export const LEGACY_SMART_TV_REDIRECTS = {
  'samsung-tv': 'smart-tv-0-player',
  'lg-tv': 'smart-tv-0-player',
};

export const SMART_TV_APPS = [
  {
    slug: 'smart-tv-0-player',
    appId: '0-player',
    name: '0 Player',
    nameDe: '0 Player',
    pageName: { tr: 'Smart TV — 0 Player', de: 'Smart TV — 0 Player' },
    tagline: {
      tr: 'Zero Player · Samsung & LG için premium oynatıcı',
      de: 'Zero Player · Premium-Player für Samsung & LG',
    },
    taglineDe: 'Zero Player · Premium-Player für Samsung & LG',
    logo: '/0player-logo.png',
    officialUrl: 'https://0player.com/',
    dbKey: 'smart_tv_config',
    contentSlug: 'smart-tv-0-player',
    color: 'from-amber-500 to-yellow-600',
    colorLight: 'text-amber-400',
    bg: 'bg-amber-500/10',
    showcaseType: 'zero-player',
    storeVariant: 'generic',
    platforms: { tr: 'Samsung Tizen & LG webOS', de: 'Samsung Tizen & LG webOS' },
    faq: {
      tr: [
        { q: '0 Player nedir?', a: '0 Player (Zero Player), Samsung Tizen ve LG webOS için premium IPTV oynatıcıdır. Resmi site: 0player.com' },
        { q: 'M3U mü Xtream Codes mu?', a: 'Her ikisi de desteklenir. Müşteri panelinizde hangi bilgi varsa onu girin.' },
        { q: 'Philips/Sony\'de var mı?', a: '0 Player Samsung ve LG için optimize edilmiştir. Android TV cihazlarda Tivimate kullanın.' },
      ],
      de: [
        { q: 'Was ist 0 Player?', a: '0 Player (Zero Player) ist ein Premium-Media-Player für Samsung Tizen und LG webOS. Offizielle Seite: 0player.com' },
        { q: 'M3U oder Xtream Codes?', a: 'Beides wird unterstützt. Nutzen Sie die Daten aus Ihrem Kundenpanel.' },
        { q: 'Philips/Sony unterstützt?', a: '0 Player ist für Samsung/LG optimiert. Auf Android-TV-Geräten Tivimate nutzen.' },
      ],
    },
  },
  {
    slug: 'smart-tv-smarters-pro',
    appId: 'smarters-pro',
    name: 'IPTV Smarters Pro',
    nameDe: 'IPTV Smarters Pro',
    pageName: { tr: 'Smart TV — IPTV Smarters Pro', de: 'Smart TV — IPTV Smarters Pro' },
    tagline: {
      tr: 'Samsung & LG mağazasında popüler IPTV uygulaması',
      de: 'Beliebte IPTV-App im Samsung- und LG-Store',
    },
    logo: '/iptv-smarters-pro-icon.svg',
    logoWide: '/iptv-smarters-pro-logo.svg',
    officialUrl: 'https://www.iptvsmarters.com/',
    dbKey: 'smart_tv_config',
    contentSlug: 'smart-tv-smarters-pro',
    color: 'from-violet-500 to-purple-600',
    colorLight: 'text-violet-400',
    bg: 'bg-violet-500/10',
    showcaseType: 'smarters-pro',
    storeVariant: 'generic',
    platforms: { tr: 'Samsung Tizen & LG webOS', de: 'Samsung Tizen & LG webOS' },
    faq: {
      tr: [
        { q: 'IPTV Smarters Pro ücretsiz mi?', a: 'Evet, temel sürüm ücretsizdir. Premium sürüm isteğe bağlı ek özellikler sunar.' },
        { q: 'Xtream Codes destekler mi?', a: 'Evet. Login with Xtream Codes API seçeneği ile sunucu, kullanıcı adı ve şifre girin.' },
        { q: 'Samsung ve LG\'de nasıl bulurum?', a: 'Samsung Apps veya LG Content Store\'da "IPTV Smarters Pro" arayıp yükleyin.' },
      ],
      de: [
        { q: 'Ist IPTV Smarters Pro kostenlos?', a: 'Ja, die Basisversion ist kostenlos. Premium ist optional.' },
        { q: 'Unterstützt es Xtream Codes?', a: 'Ja. Wählen Sie Login with Xtream Codes API und geben Sie Server, Benutzer und Passwort ein.' },
        { q: 'Wo finde ich die App?', a: 'Im Samsung Apps oder LG Content Store nach „IPTV Smarters Pro“ suchen.' },
      ],
    },
  },
];

export function getSmartTvAppBySlug(slug) {
  return SMART_TV_APPS.find((a) => a.slug === slug) ?? null;
}

export function isSmartTvAppSlug(slug) {
  return SMART_TV_APPS.some((a) => a.slug === slug);
}

export function buildSmartTvAppDevices() {
  return Object.fromEntries(
    SMART_TV_APPS.map((app) => [
      app.slug,
      {
        key: app.dbKey,
        name: app.pageName.tr,
        nameDe: app.pageName.de,
        appId: app.appId,
        logo: app.logo,
        defaultAppName: app.name,
        color: app.color,
        colorLight: app.colorLight,
        bg: app.bg,
      },
    ])
  );
}
