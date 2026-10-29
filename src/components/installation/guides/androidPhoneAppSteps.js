/** Android Telefon — Qruze Player XC & IBO kurulum adımları */

import { qruzeGuideImages } from './androidQruzePlayerSteps';

export const ANDROID_PHONE_APP_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

const PHONE_IMAGES = qruzeGuideImages('phone');

function mapSteps(steps, theme) {
  return steps.map((step, index) => ({
    ...step,
    visual: ANDROID_PHONE_APP_VISUALS[index] || 'app',
    theme,
  }));
}

function buildXcPlayerSteps(isDe) {
  const tr = [
    { title: 'APK İndirme Linkini Açın', description: 'Size WhatsApp veya e-posta ile gönderilen Qruze Player XC APK indirme linkini telefon tarayıcısında açın.', image: PHONE_IMAGES.store },
    { title: 'APK Dosyasını İndirin', description: 'Linke tıkladıktan sonra indirmeyi onaylayın. Dosya genellikle İndirilenler klasörüne kaydedilir.', image: PHONE_IMAGES.search },
    { title: 'Bilinmeyen Kaynaklara İzin Verin', description: 'Gerekirse Ayarlar > Güvenlik bölümünden bilinmeyen kaynaklardan uygulama yüklemeye izin verin.', image: PHONE_IMAGES.find },
    { title: 'APK Kurulumunu Başlatın', description: 'İndirilen Qruze Player XC APK dosyasına dokunun ve "Yükle" / "Kur" butonuna basın.', image: PHONE_IMAGES.install },
    { title: 'Qruze Player XC\'yi Açın', description: 'Kurulum bitince uygulamayı başlatın. Gerekli izinleri onaylayın.', image: PHONE_IMAGES.open },
    { title: 'Xtream Bilgilerini Girin', description: 'Sunucu URL, kullanıcı adı ve şifre alanlarına size gönderilen Xtream Codes bilgilerini girin.', image: PHONE_IMAGES.login },
    { title: 'Giriş Yapın', description: 'Bilgileri kontrol edip "Giriş" butonuna basın. Kanal listesi indirilecektir.', image: PHONE_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Canlı kanallar, filmler ve diziler otomatik olarak yüklenecektir.', image: PHONE_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'Qruze Player XC\'yi açın. WhatsApp veya e-posta ile gönderdiğimiz kullanıcı adı, şifre ve sunucu bilgilerini eksiksiz girin.', image: PHONE_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'APK-Link öffnen', description: 'Gesendeten Qruze Player XC APK-Link im Browser öffnen.', image: PHONE_IMAGES.store },
    { title: 'APK herunterladen', description: 'Download bestätigen. Datei landet meist im Download-Ordner.', image: PHONE_IMAGES.search },
    { title: 'Unbekannte Quellen erlauben', description: 'Bei Bedarf in Einstellungen > Sicherheit unbekannte Quellen aktivieren.', image: PHONE_IMAGES.find },
    { title: 'APK installieren', description: 'Heruntergeladene APK öffnen und „Installieren“ tippen.', image: PHONE_IMAGES.install },
    { title: 'Qruze Player XC starten', description: 'App nach der Installation öffnen und Berechtigungen bestätigen.', image: PHONE_IMAGES.open },
    { title: 'Xtream-Daten eingeben', description: 'Server-URL, Benutzername und Passwort aus unserer Nachricht einfügen.', image: PHONE_IMAGES.login },
    { title: 'Anmelden', description: 'Daten prüfen und „Login“ tippen. Kanalliste wird geladen.', image: PHONE_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Kanäle, Filme und Serien werden automatisch geladen.', image: PHONE_IMAGES.watch },
    { title: 'Mit unseren Zugangsdaten', description: 'Qruze Player XC öffnen und alle gesendeten Login-Daten eingeben.', image: PHONE_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'red');
}

function buildIboPlayerSteps(isDe) {
  const tr = [
    { title: 'Kurulum Linkini Açın', description: 'Size gönderilen Qruze Player IBO kurulum linkini telefon tarayıcısında açın.', image: PHONE_IMAGES.store },
    { title: 'APK İndirin', description: '"APK İNDİR" butonuna basarak uygulamayı indirin.', image: PHONE_IMAGES.search },
    { title: 'Bilinmeyen Kaynaklara İzin Verin', description: 'Telefon ayarlarından bilinmeyen kaynaklardan uygulama yüklemeye izin verin.', image: PHONE_IMAGES.find },
    { title: 'Uygulamayı Kurun', description: 'İndirilen APK dosyasını açın ve kurulumu tamamlayın.', image: PHONE_IMAGES.install },
    { title: 'IBO Player\'ı Açın', description: 'Kurulum bitince uygulamayı başlatın.', image: PHONE_IMAGES.open },
    { title: 'Kullanıcı Adı ve Şifre Girin', description: 'Size verilen kullanıcı adı ve şifreyi ilgili alanlara yazın.', image: PHONE_IMAGES.login },
    { title: 'Giriş Yapın', description: '"Giriş" butonuna basın ve dosya izinlerini onaylayın.', image: PHONE_IMAGES.addUser },
    { title: 'Kanalları Yükleyin', description: 'Giriş sonrası kanal listesinin yüklenmesini bekleyin.', image: PHONE_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'IBO Player\'ı açın. WhatsApp veya e-posta ile gönderdiğimiz giriş bilgilerini eksiksiz girin.', image: PHONE_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Installationslink öffnen', description: 'Gesendeten Qruze Player IBO Link im Browser öffnen.', image: PHONE_IMAGES.store },
    { title: 'APK herunterladen', description: 'Auf „APK DOWNLOAD“ tippen und Datei speichern.', image: PHONE_IMAGES.search },
    { title: 'Unbekannte Quellen erlauben', description: 'In den Einstellungen unbekannte Quellen aktivieren.', image: PHONE_IMAGES.find },
    { title: 'App installieren', description: 'APK öffnen und Installation abschließen.', image: PHONE_IMAGES.install },
    { title: 'IBO Player starten', description: 'App nach der Installation öffnen.', image: PHONE_IMAGES.open },
    { title: 'Benutzername & Passwort', description: 'Zugangsdaten aus unserer Nachricht eingeben.', image: PHONE_IMAGES.login },
    { title: 'Anmelden', description: '„Login“ tippen und Dateiberechtigungen bestätigen.', image: PHONE_IMAGES.addUser },
    { title: 'Kanäle laden', description: 'Nach dem Login auf den Import warten.', image: PHONE_IMAGES.watch },
    { title: 'Mit unseren Zugangsdaten', description: 'IBO Player öffnen und alle gesendeten Login-Daten eingeben.', image: PHONE_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'emerald');
}

const BUILDERS = {
  'xc-player': buildXcPlayerSteps,
  'ibo-player': buildIboPlayerSteps,
};

export function buildAndroidPhoneAppSteps(isDe, appId = 'xc-player') {
  const build = BUILDERS[appId] || BUILDERS['xc-player'];
  return build(isDe);
}

export function resolveAndroidPhoneAppGuideSteps(_dbSteps, isDe, appId = 'xc-player') {
  return buildAndroidPhoneAppSteps(isDe, appId);
}
