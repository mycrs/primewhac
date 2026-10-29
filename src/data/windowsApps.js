/**
 * Windows PC kurulum — uygulama bazlı sayfa yapılandırması.
 * Hub: /kurulum/windows
 * Uygulama sayfaları: windows-ibo-player, windows-abc, windows-vs-player
 */

export const WINDOWS_HUB_SLUG = 'windows';

export const LEGACY_WINDOWS_REDIRECTS = {
  'windows-next-plus': 'windows-ibo-player',
  'windows-castora': 'windows-vs-player',
};

export const WINDOWS_APPS = [
  {
    slug: 'windows-ibo-player',
    appId: 'ibo-player',
    name: 'IBO Player Pro',
    nameDe: 'IBO Player Pro',
    pageName: { tr: 'Windows — IBO Player Pro', de: 'Windows — IBO Player Pro' },
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
    officialUrl: 'https://apps.microsoft.com/detail/9msnk97xpvrk',
    installSource: { tr: 'Microsoft Store', de: 'Microsoft Store' },
    dbKey: 'windows_pc_config',
    contentSlug: 'windows-ibo-player',
    color: 'from-emerald-400 to-teal-600',
    colorLight: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    theme: 'emerald',
    platforms: { tr: 'Windows 10/11 · Microsoft Store', de: 'Windows 10/11 · Microsoft Store' },
    faq: {
      tr: [
        { q: 'IBO Player Pro Windows\'ta ücretsiz mi?', a: 'Evet, Microsoft Store\'dan ücretsiz indirilebilir. Premium özellikler isteğe bağlıdır.' },
        { q: 'M3U ve Xtream destekler mi?', a: 'Evet. M3U/M3U8 playlist ve Xtream Codes ile giriş yapabilirsiniz.' },
        { q: 'Hangi paket için?', a: 'Türkiye paketleri ve Xtream Codes bilgisi alan müşteriler için önerilir.' },
      ],
      de: [
        { q: 'Ist IBO Player Pro auf Windows kostenlos?', a: 'Ja, kostenlos im Microsoft Store. Premium optional.' },
        { q: 'M3U und Xtream?', a: 'Ja. M3U/M3U8-Playlists und Xtream Codes werden unterstützt.' },
        { q: 'Für welches Paket?', a: 'Empfohlen für Türkei-Pakete mit Xtream-Codes-Zugang.' },
      ],
    },
  },
  {
    slug: 'windows-abc',
    appId: 'abc',
    name: 'ABC IPTV Player',
    nameDe: 'ABC IPTV Player',
    pageName: { tr: 'Windows — ABC IPTV Player', de: 'Windows — ABC IPTV Player' },
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
    installSource: { tr: 'Resmi site', de: 'Offizielle Website' },
    dbKey: 'windows_pc_config',
    contentSlug: 'windows-abc',
    color: 'from-rose-400 to-red-600',
    colorLight: 'text-rose-300',
    bg: 'bg-rose-500/10',
    theme: 'rose',
    platforms: { tr: 'Windows 10/11 · Resmi indirme', de: 'Windows 10/11 · Offizieller Download' },
    faq: {
      tr: [
        { q: 'ABC IPTV Player nereden indirilir?', a: 'Resmi site abciptvplayer.com üzerinden Windows sürümünü indirin.' },
        { q: 'M3U linki nasıl eklenir?', a: 'Uygulamayı açın, playlist/M3U URL alanına müşteri panelinizdeki linki yapıştırın.' },
        { q: 'Hangi paket için?', a: 'Avrupa Standart paketler ve M3U playlist ile giriş yapan müşteriler için.' },
      ],
      de: [
        { q: 'Wo herunterladen?', a: 'Windows-Version von abciptvplayer.com herunterladen.' },
        { q: 'M3U hinzufügen?', a: 'App öffnen und M3U-URL aus dem Kundenpanel einfügen.' },
        { q: 'Für welches Paket?', a: 'Für Europa-Standard-Pakete mit M3U-Playlist.' },
      ],
    },
  },
  {
    slug: 'windows-vs-player',
    appId: 'vs-player',
    name: 'VS Player',
    nameDe: 'VS Player',
    pageName: { tr: 'Windows — VS Player', de: 'Windows — VS Player' },
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
    installSource: { tr: 'Android emülatör / APK', de: 'Android-Emulator / APK' },
    dbKey: 'windows_pc_config',
    contentSlug: 'windows-vs-player',
    color: 'from-cyan-400 to-blue-600',
    colorLight: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    theme: 'cyan',
    platforms: { tr: 'Windows 10/11 · VS Player (Vstro)', de: 'Windows 10/11 · VS Player (Vstro)' },
    faq: {
      tr: [
        { q: 'VS Player Windows\'ta nasıl kurulur?', a: 'BlueStacks veya benzeri Android emülatörü kurun, ardından VS Player (Vstro) uygulamasını yükleyin.' },
        { q: 'Xtream ve Stalker destekler mi?', a: 'Evet. Xtream Codes API ve Stalker/MAC portal girişi desteklenir.' },
        { q: 'Hangi paket için?', a: 'Avrupa HD paketler ve portal/Xtream bilgisi alan müşteriler için önerilir.' },
      ],
      de: [
        { q: 'Installation auf Windows?', a: 'Android-Emulator (z. B. BlueStacks) installieren, dann VS Player (Vstro) laden.' },
        { q: 'Xtream und Stalker?', a: 'Ja. Xtream Codes API und Stalker/MAC-Portal werden unterstützt.' },
        { q: 'Für welches Paket?', a: 'Empfohlen für Europa-HD-Pakete mit Portal- oder Xtream-Zugang.' },
      ],
    },
  },
];

export function getWindowsAppBySlug(slug) {
  return WINDOWS_APPS.find((a) => a.slug === slug) ?? null;
}

export function isWindowsAppSlug(slug) {
  return WINDOWS_APPS.some((a) => a.slug === slug);
}

export function buildWindowsAppDevices() {
  return Object.fromEntries(
    WINDOWS_APPS.map((app) => [
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
