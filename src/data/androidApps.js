/**
 * Android kurulum — Qruze Player (TV).
 * Telefon hub: /kurulum/android-phone → androidPhoneApps.js
 */

export const ANDROID_APPS = [
  {
    slug: 'android-tv',
    appId: 'qruze-player-tv',
    name: 'Qruze Player',
    nameDe: 'Qruze Player',
    pageName: {
      tr: 'Android TV — Qruze Player',
      de: 'Android TV — Qruze Player',
    },
    tagline: {
      tr: 'Downloader + APK · Android TV & Fire TV Stick',
      de: 'Downloader + APK · Android TV & Fire TV Stick',
    },
    logoInitials: 'QP',
    dbKey: 'android_tv_config',
    contentSlug: 'android-tv',
    showcaseVariant: 'tv',
    color: 'from-green-500 to-[#b20710]',
    colorLight: 'text-green-400',
    bg: 'bg-green-500/10',
    theme: 'green',
    faq: {
      tr: [
        { q: 'Qruze Player Play Store\'da var mı?', a: 'Hayır. Qruze Player APK olarak kurulur; Downloader ile size gönderilen linkten yükleyin.' },
        { q: "Fire TV Stick'te nasıl kurulur?", a: 'Amazon Appstore\'dan Downloader indirin, APK linkini Downloader\'a yapıştırın ve yükleyin.' },
        { q: 'APK linkini nereden alırım?', a: 'Abonelik sonrası WhatsApp veya e-posta ile Qruze Player APK indirme linki gönderilir.' },
      ],
      de: [
        { q: 'Qruze Player im Play Store?', a: 'Nein. Installation als APK — Link per WhatsApp/E-Mail, Download mit Downloader.' },
        { q: 'Qruze Player auf Fire TV Stick?', a: 'Downloader aus dem Amazon Store, APK-Link einfügen und installieren.' },
        { q: 'Wo bekomme ich den APK-Link?', a: 'Nach dem Abo per WhatsApp oder E-Mail.' },
      ],
    },
  },
];

export function getAndroidAppBySlug(slug) {
  return ANDROID_APPS.find((a) => a.slug === slug) ?? null;
}

export function buildAndroidAppDevices() {
  return Object.fromEntries(
    ANDROID_APPS.map((app) => [
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
