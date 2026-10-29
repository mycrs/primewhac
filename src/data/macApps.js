/**
 * Mac kurulum — uygulama bazlı sayfa yapılandırması.
 * Hub: /kurulum/mac
 * Uygulama sayfaları: mac-next-plus, mac-castora
 */

export const MAC_HUB_SLUG = 'mac';

export const LEGACY_MAC_REDIRECTS = {
  'mac-iina': 'mac-next-plus',
  'mac-vlc': 'mac-next-plus',
  'mac-smarters-pro': 'mac-castora',
};

export const MAC_APPS = [
  {
    slug: 'mac-next-plus',
    appId: 'next-plus',
    name: 'NEXT+',
    nameDe: 'NEXT+',
    pageName: { tr: 'Mac — NEXT+', de: 'Mac — NEXT+' },
    tagline: {
      tr: 'Premium IPTV oynatıcı · Mac App Store',
      de: 'Premium IPTV-Player · Mac App Store',
    },
    logo: null,
    logoInitials: 'N+',
    officialUrl: 'https://apps.apple.com/us/app/next/id6443335504',
    dbKey: 'mac_config',
    contentSlug: 'mac-next-plus',
    color: 'from-slate-400 to-slate-600',
    colorLight: 'text-slate-200',
    bg: 'bg-slate-500/10',
    theme: 'apple',
    platforms: { tr: 'macOS · Mac App Store', de: 'macOS · Mac App Store' },
    faq: {
      tr: [
        { q: 'NEXT+ Mac\'te ücretsiz mi?', a: 'Evet, temel sürüm ücretsizdir. Mac App Store\'dan indirilebilir.' },
        { q: 'M3U ve Xtream destekler mi?', a: 'Evet. M3U/M3U8 playlist ve Xtream Codes ile giriş yapabilirsiniz.' },
        { q: 'Apple Silicon uyumlu mu?', a: 'Evet, M1/M2/M3 Mac\'lerde native çalışır.' },
      ],
      de: [
        { q: 'Ist NEXT+ auf Mac kostenlos?', a: 'Ja, die Basisversion ist kostenlos im Mac App Store.' },
        { q: 'M3U und Xtream?', a: 'Ja. M3U/M3U8-Playlists und Xtream Codes werden unterstützt.' },
        { q: 'Apple Silicon?', a: 'Ja, native Unterstützung für M1/M2/M3.' },
      ],
    },
  },
  {
    slug: 'mac-castora',
    appId: 'castora',
    name: 'CASTORA',
    nameDe: 'CASTORA',
    pageName: { tr: 'Mac — CASTORA', de: 'Mac — CASTORA' },
    tagline: {
      tr: 'Modern medya oynatıcı · M3U & Xtream Codes',
      de: 'Moderner Media-Player · M3U & Xtream Codes',
    },
    logo: null,
    logoInitials: 'C',
    officialUrl: 'https://apps.apple.com/us/app/castora/id6760588570',
    dbKey: 'mac_config',
    contentSlug: 'mac-castora',
    color: 'from-violet-500 to-purple-600',
    colorLight: 'text-violet-400',
    bg: 'bg-violet-500/10',
    theme: 'violet',
    platforms: { tr: 'macOS · Mac App Store', de: 'macOS · Mac App Store' },
    faq: {
      tr: [
        { q: 'CASTORA Mac\'te ücretsiz mi?', a: 'Evet, ücretsiz indirilebilir. Mac App Store\'dan yükleyin.' },
        { q: 'Xtream Codes ile giriş?', a: 'Evet. Sunucu / URL alanına **8811** yazın.' },
        { q: 'NEXT+ mı CASTORA mı?', a: 'İkisi de Mac App Store\'da. CASTORA Xtream + 8811; NEXT+ genel playlist/Xtream desteği sunar.' },
      ],
      de: [
        { q: 'Ist CASTORA auf Mac kostenlos?', a: 'Ja, kostenlos im Mac App Store.' },
        { q: 'Xtream Codes Login?', a: 'Ja. Server/URL-Feld: **8811**.' },
        { q: 'NEXT+ oder CASTORA?', a: 'Beide im Mac App Store. CASTORA mit Xtream und 8811.' },
      ],
    },
  },
];

export function getMacAppBySlug(slug) {
  return MAC_APPS.find((a) => a.slug === slug) ?? null;
}

export function isMacAppSlug(slug) {
  return MAC_APPS.some((a) => a.slug === slug);
}

export function buildMacAppDevices() {
  return Object.fromEntries(
    MAC_APPS.map((app) => [
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
    ]),
  );
}
