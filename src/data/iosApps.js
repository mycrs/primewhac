/**
 * iOS kurulum — uygulama bazlı sayfa yapılandırması.
 * Hub: /kurulum/ios
 * Uygulama sayfaları: ios-next-plus, ios-castora, ios-9xtream
 */

export const IOS_HUB_SLUG = 'ios';

export const IOS_APPS = [
  {
    slug: 'ios-next-plus',
    appId: 'next-plus',
    name: 'NEXT+',
    nameDe: 'NEXT+',
    pageName: { tr: 'iOS — NEXT+', de: 'iOS — NEXT+' },
    tagline: {
      tr: 'Premium IPTV oynatıcı · iPhone, iPad & Apple TV',
      de: 'Premium IPTV-Player · iPhone, iPad & Apple TV',
    },
    logo: null,
    logoInitials: 'N+',
    officialUrl: 'https://apps.apple.com/us/app/next/id6443335504',
    dbKey: 'ios_config',
    contentSlug: 'ios-next-plus',
    color: 'from-slate-400 to-slate-600',
    colorLight: 'text-slate-200',
    bg: 'bg-slate-500/10',
    theme: 'apple',
    platforms: { tr: 'iPhone, iPad & Apple TV', de: 'iPhone, iPad & Apple TV' },
    faq: {
      tr: [
        { q: 'NEXT+ ücretsiz mi?', a: 'Evet, temel sürüm ücretsizdir. Premium isteğe bağlı in-app satın almadır.' },
        { q: 'Apple TV\'de çalışır mı?', a: 'Evet, tvOS App Store\'dan indirilebilir. iPhone, iPad ve Apple TV\'de aynı Apple ID ile kullanılabilir.' },
        { q: 'M3U ve Xtream destekler mi?', a: 'Evet. M3U/M3U8 playlist ve Xtream Codes ile giriş yapabilirsiniz.' },
      ],
      de: [
        { q: 'Ist NEXT+ kostenlos?', a: 'Ja, die Basisversion ist kostenlos. Premium ist optional per In-App-Kauf.' },
        { q: 'Läuft auf Apple TV?', a: 'Ja, im tvOS App Store. Nutzbar auf iPhone, iPad und Apple TV mit derselben Apple ID.' },
        { q: 'M3U und Xtream?', a: 'Ja. Unterstützt M3U/M3U8-Playlists und Xtream Codes.' },
      ],
    },
  },
  {
    slug: 'ios-castora',
    appId: 'castora',
    name: 'CASTORA',
    nameDe: 'CASTORA',
    pageName: { tr: 'iOS — CASTORA', de: 'iOS — CASTORA' },
    tagline: {
      tr: 'Modern medya oynatıcı · M3U & Xtream Codes',
      de: 'Moderner Media-Player · M3U & Xtream Codes',
    },
    logo: null,
    logoInitials: 'C',
    officialUrl: 'https://apps.apple.com/us/app/castora/id6760588570',
    dbKey: 'ios_config',
    contentSlug: 'ios-castora',
    color: 'from-violet-500 to-purple-600',
    colorLight: 'text-violet-400',
    bg: 'bg-violet-500/10',
    theme: 'violet',
    platforms: { tr: 'iPhone, iPad & Apple TV', de: 'iPhone, iPad & Apple TV' },
    faq: {
      tr: [
        { q: 'CASTORA ücretsiz mi?', a: 'Evet, ücretsiz indirilebilir. İsteğe bağlı lifetime aktivasyon satın alınabilir.' },
        { q: 'Xtream Codes ile giriş?', a: 'Evet. Uygulama açıldığında Xtream Codes veya M3U playlist ekleyebilirsiniz.' },
        { q: 'İçerik sağlar mı?', a: 'Hayır. CASTORA yalnızca oynatıcıdır; kendi abonelik bilgilerinizi girmeniz gerekir.' },
      ],
      de: [
        { q: 'Ist CASTORA kostenlos?', a: 'Ja, kostenlos downloadbar. Optionale Lifetime-Aktivierung per In-App-Kauf.' },
        { q: 'Xtream Codes Login?', a: 'Ja. Xtream Codes oder M3U-Playlist in der App hinzufügen.' },
        { q: 'Liefert die App Inhalte?', a: 'Nein. CASTORA ist nur ein Player — Sie benötigen eigene Zugangsdaten.' },
      ],
    },
  },
  {
    slug: 'ios-9xtream',
    appId: '9xtream',
    name: '9Xtream',
    nameDe: '9Xtream',
    pageName: { tr: 'iOS — 9Xtream', de: 'iOS — 9Xtream' },
    tagline: {
      tr: 'iPhone & iPad için IPTV oynatıcı · M3U & Xtream',
      de: 'IPTV-Player für iPhone & iPad · M3U & Xtream',
    },
    logo: null,
    logoInitials: '9X',
    officialUrl: 'https://apps.apple.com/us/app/9xtream-download-play-iptv/id6504282945',
    dbKey: 'ios_config',
    contentSlug: 'ios-9xtream',
    color: 'from-sky-500 to-blue-600',
    colorLight: 'text-sky-400',
    bg: 'bg-sky-500/10',
    theme: 'sky',
    platforms: { tr: 'iPhone, iPad & Apple TV (Smart TV değil)', de: 'iPhone, iPad & Apple TV (kein Smart TV)' },
    faq: {
      tr: [
        { q: '9Xtream Smart TV\'de var mı?', a: 'Samsung/LG Smart TV için ayrı lisans gerekir. iPhone ve iPad kurulumu için bu rehberi kullanın.' },
        { q: 'Ücretsiz mi?', a: 'App Store\'dan ücretsiz indirilebilir; premium özellikler isteğe bağlıdır.' },
        { q: 'Xtream Codes destekler mi?', a: 'Evet. Add Playlist ile Xtream Codes veya M3U ekleyebilirsiniz.' },
      ],
      de: [
        { q: '9Xtream auf Smart TV?', a: 'Für Samsung/LG Smart TV separate Lizenz nötig. Für iPhone/iPad diese Anleitung nutzen.' },
        { q: 'Kostenlos?', a: 'Kostenlos im App Store; Premium optional.' },
        { q: 'Xtream Codes?', a: 'Ja. Playlist mit Xtream Codes oder M3U hinzufügen.' },
      ],
    },
  },
];

export function getIosAppBySlug(slug) {
  return IOS_APPS.find((a) => a.slug === slug) ?? null;
}

export function isIosAppSlug(slug) {
  return IOS_APPS.some((a) => a.slug === slug);
}

export function buildIosAppDevices() {
  return Object.fromEntries(
    IOS_APPS.map((app) => [
      app.slug,
      {
        key: app.dbKey,
        name: app.pageName.tr,
        nameDe: app.pageName.de,
        appId: app.appId,
        logo: app.logo,
        logoInitials: app.logoInitials,
        defaultAppName: app.name,
        color: app.color,
        colorLight: app.colorLight,
        bg: app.bg,
      },
    ])
  );
}
