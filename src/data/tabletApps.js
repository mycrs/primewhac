/**
 * Tablet kurulum — uygulama bazlı sayfa yapılandırması.
 * Hub: /kurulum/tablet
 * Uygulama sayfaları: tablet-ibo-player, tablet-abc, tablet-vs-player
 */

export const TABLET_HUB_SLUG = 'tablet';

export const TABLET_APPS = [
  {
    slug: 'tablet-ibo-player',
    appId: 'ibo-player',
    name: 'IBO Player Pro',
    nameDe: 'IBO Player Pro',
    pageName: { tr: 'Tablet — IBO Player Pro', de: 'Tablet — IBO Player Pro' },
    tagline: {
      tr: 'Türkiye paketleri · Xtream Codes & M3U',
      de: 'Türkei-Pakete · Xtream Codes & M3U',
    },
    categoryLabel: {
      tr: 'Türkiye paketleri',
      de: 'Türkei-Pakete',
    },
    logo: null,
    logoInitials: 'IBO',
    officialUrl: 'https://apps.apple.com/us/app/ibo-player-pro/id6444024156',
    installSource: { tr: 'App Store / Play Store', de: 'App Store / Play Store' },
    dbKey: 'tablet_config',
    contentSlug: 'tablet-ibo-player',
    color: 'from-emerald-400 to-teal-600',
    colorLight: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    theme: 'emerald',
    platforms: { tr: 'iPad & Android tablet · App Store / Play Store', de: 'iPad & Android-Tablet · App Store / Play Store' },
    faq: {
      tr: [
        { q: 'IBO Player Pro tablette ücretsiz mi?', a: 'Evet, App Store ve Google Play\'den ücretsiz indirilebilir.' },
        { q: 'iPad ve Android\'de var mı?', a: 'Evet. iPad\'de App Store, Android tablette Play Store\'dan yükleyin.' },
        { q: 'Hangi paket için?', a: 'Türkiye paketleri ve Xtream Codes bilgisi alan müşteriler için.' },
      ],
      de: [
        { q: 'Ist IBO Player Pro auf dem Tablet kostenlos?', a: 'Ja, kostenlos im App Store und Google Play.' },
        { q: 'iPad und Android?', a: 'Ja. App Store (iPad) oder Play Store (Android-Tablet).' },
        { q: 'Für welches Paket?', a: 'Empfohlen für Türkei-Pakete mit Xtream-Codes-Zugang.' },
      ],
    },
  },
  {
    slug: 'tablet-abc',
    appId: 'abc',
    name: 'ABC IPTV Player',
    nameDe: 'ABC IPTV Player',
    pageName: { tr: 'Tablet — ABC IPTV Player', de: 'Tablet — ABC IPTV Player' },
    tagline: {
      tr: 'M3U playlist · Avrupa Standart paketler',
      de: 'M3U-Playlist · Europa Standard-Pakete',
    },
    categoryLabel: {
      tr: 'Avrupa Standart · M3U',
      de: 'Europa Standard · M3U',
    },
    logo: null,
    logoInitials: 'ABC',
    officialUrl: 'https://abciptvplayer.com/',
    installSource: { tr: 'App Store / Play Store', de: 'App Store / Play Store' },
    dbKey: 'tablet_config',
    contentSlug: 'tablet-abc',
    color: 'from-rose-400 to-red-600',
    colorLight: 'text-rose-300',
    bg: 'bg-rose-500/10',
    theme: 'rose',
    platforms: { tr: 'iPad & Android tablet · App Store / Play Store', de: 'iPad & Android-Tablet · App Store / Play Store' },
    faq: {
      tr: [
        { q: 'ABC IPTV Player nereden indirilir?', a: 'App Store (iPad) veya Google Play (Android tablet). Resmi site: abciptvplayer.com' },
        { q: 'M3U linki nasıl eklenir?', a: 'Uygulamayı açın, M3U URL alanına müşteri panelinizdeki linki yapıştırın.' },
        { q: 'Hangi paket için?', a: 'Avrupa Standart paketler ve M3U playlist ile giriş yapan müşteriler için.' },
      ],
      de: [
        { q: 'Wo herunterladen?', a: 'App Store oder Google Play. Offizielle Website: abciptvplayer.com' },
        { q: 'M3U hinzufügen?', a: 'App öffnen und M3U-URL aus dem Kundenpanel einfügen.' },
        { q: 'Für welches Paket?', a: 'Für Europa-Standard-Pakete mit M3U-Playlist.' },
      ],
    },
  },
  {
    slug: 'tablet-vs-player',
    appId: 'vs-player',
    name: 'VS Player',
    nameDe: 'VS Player',
    pageName: { tr: 'Tablet — VS Player', de: 'Tablet — VS Player' },
    tagline: {
      tr: 'Xtream & Stalker portal · Avrupa HD paketler',
      de: 'Xtream & Stalker Portal · Europa HD-Pakete',
    },
    categoryLabel: {
      tr: 'Avrupa HD · Portal',
      de: 'Europa HD · Portal',
    },
    logo: null,
    logoInitials: 'VS',
    officialUrl: 'https://play.google.com/store/apps/details?id=com.vs.vsplayer',
    installSource: { tr: 'Google Play', de: 'Google Play' },
    dbKey: 'tablet_config',
    contentSlug: 'tablet-vs-player',
    color: 'from-cyan-400 to-blue-600',
    colorLight: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    theme: 'cyan',
    platforms: { tr: 'Android tablet · VS Player (Vstro)', de: 'Android-Tablet · VS Player (Vstro)' },
    faq: {
      tr: [
        { q: 'VS Player tablette nasıl kurulur?', a: 'Google Play\'den VS Player (Vstro) uygulamasını indirin. iPad için Android tablet önerilir veya alternatif portal uygulaması kullanın.' },
        { q: 'Xtream ve Stalker destekler mi?', a: 'Evet. Xtream Codes API ve Stalker/MAC portal girişi desteklenir.' },
        { q: 'Hangi paket için?', a: 'Avrupa HD paketler ve portal/Xtream bilgisi alan müşteriler için.' },
      ],
      de: [
        { q: 'Installation auf dem Tablet?', a: 'VS Player (Vstro) aus Google Play laden.' },
        { q: 'Xtream und Stalker?', a: 'Ja. Xtream Codes API und Stalker/MAC-Portal werden unterstützt.' },
        { q: 'Für welches Paket?', a: 'Empfohlen für Europa-HD-Pakete mit Portal- oder Xtream-Zugang.' },
      ],
    },
  },
];

export function getTabletAppBySlug(slug) {
  return TABLET_APPS.find((a) => a.slug === slug) ?? null;
}

export function isTabletAppSlug(slug) {
  return TABLET_APPS.some((a) => a.slug === slug);
}

export function buildTabletAppDevices() {
  return Object.fromEntries(
    TABLET_APPS.map((app) => [
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
