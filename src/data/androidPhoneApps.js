/**
 * Android Telefon kurulum — uygulama bazlı sayfa yapılandırması.
 * Hub: /kurulum/android-phone
 * Uygulama sayfaları: android-phone-xc, android-phone-ibo
 */

export const ANDROID_PHONE_HUB_SLUG = 'android-phone';

export const LEGACY_ANDROID_PHONE_REDIRECTS = {
  'android-phone-ibo-player': 'android-phone-ibo',
  'android-phone-abc': 'android-phone-xc',
  'android-phone-vs-player': 'android-phone-ibo',
};

export const ANDROID_PHONE_APPS = [
  {
    slug: 'android-phone-xc',
    appId: 'xc-player',
    name: 'Qruze Player XC',
    nameDe: 'Qruze Player XC',
    pageName: { tr: 'Android Telefon — Qruze Player XC', de: 'Android Smartphone — Qruze Player XC' },
    tagline: {
      tr: 'APK kurulum · Xtream Codes · Play Store\'da yok',
      de: 'APK-Installation · Xtream Codes · nicht im Play Store',
    },
    categoryLabel: {
      tr: 'XC Player · APK',
      de: 'XC Player · APK',
    },
    logoInitials: 'XC',
    installSource: { tr: 'APK indirme linki', de: 'APK-Download-Link' },
    dbKey: 'android_phone_config',
    contentSlug: 'android-phone-xc',
    color: 'from-[#e50914] to-[#b20710]',
    colorLight: 'text-[#e50914]',
    bg: 'bg-[#e50914]/10',
    theme: 'red',
    platforms: { tr: 'Android telefon · APK', de: 'Android Smartphone · APK' },
    stepMatcher: (title) => /xc/i.test(title || ''),
    faq: {
      tr: [
        { q: 'XC Player Play Store\'da var mı?', a: 'Hayır. APK linki ile kurulum yapılır; link abonelik sonrası WhatsApp veya e-posta ile gönderilir.' },
        { q: 'Bilinmeyen kaynak hatası alıyorum?', a: 'Telefon ayarlarından bilinmeyen kaynaklardan uygulama yüklemeye izin verin.' },
      ],
      de: [
        { q: 'XC Player im Play Store?', a: 'Nein. Installation per APK-Link nach dem Abo.' },
        { q: 'Unbekannte Quellen?', a: 'In den Einstellungen unbekannte Quellen für die Installation erlauben.' },
      ],
    },
  },
  {
    slug: 'android-phone-ibo',
    appId: 'ibo-player',
    name: 'Qruze Player IBO',
    nameDe: 'Qruze Player IBO',
    pageName: { tr: 'Android Telefon — Qruze Player IBO', de: 'Android Smartphone — Qruze Player IBO' },
    tagline: {
      tr: 'Mobil kurulum · M3U & Xtream · APK',
      de: 'Mobile Installation · M3U & Xtream · APK',
    },
    categoryLabel: {
      tr: 'IBO Player · Mobil',
      de: 'IBO Player · Mobil',
    },
    logoInitials: 'IBO',
    installSource: { tr: 'APK / tarayıcı linki', de: 'APK / Browser-Link' },
    dbKey: 'android_phone_config',
    contentSlug: 'android-phone-ibo',
    color: 'from-emerald-400 to-teal-600',
    colorLight: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    theme: 'emerald',
    platforms: { tr: 'Android telefon · APK', de: 'Android Smartphone · APK' },
    stepMatcher: (title) => /ibo/i.test(title || ''),
    faq: {
      tr: [
        { q: 'IBO Player Android\'de nasıl kurulur?', a: 'Size gönderilen indirme linkini tarayıcıda açın, APK\'yı indirip kurun ve giriş bilgilerinizi girin.' },
        { q: 'M3U ve Xtream destekler mi?', a: 'Evet. Her iki format ile giriş yapabilirsiniz.' },
      ],
      de: [
        { q: 'IBO Player auf Android installieren?', a: 'Download-Link im Browser öffnen, APK installieren, Zugangsdaten eingeben.' },
        { q: 'M3U und Xtream?', a: 'Ja, beide Formate werden unterstützt.' },
      ],
    },
  },
];

export function getAndroidPhoneAppBySlug(slug) {
  return ANDROID_PHONE_APPS.find((a) => a.slug === slug) ?? null;
}

export function buildAndroidPhoneAppDevices() {
  return Object.fromEntries(
    ANDROID_PHONE_APPS.map((app) => [
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
