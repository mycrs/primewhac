/**
 * Kurulum cihaz sayfaları için statik HowTo adımları (prerender / Supabase yokken fallback).
 * installationDeviceContent.js içindeki görünür adımlarla uyumlu.
 */

export const DEVICE_LABELS = {
  'android-tv': { tr: 'Android TV', de: 'Android TV' },
  ios: { tr: 'iOS ve iPhone', de: 'iOS und iPhone' },
  'android-phone': { tr: 'Android Telefon', de: 'Android Smartphone' },
  windows: { tr: 'Windows PC', de: 'Windows PC' },
  'windows-next-plus': { tr: 'Windows — NEXT+', de: 'Windows — NEXT+' },
  'windows-castora': { tr: 'Windows — CASTORA', de: 'Windows — CASTORA' },
  'windows-ibo-player': { tr: 'Windows — IBO Player Pro', de: 'Windows — IBO Player Pro' },
  'windows-abc': { tr: 'Windows — ABC IPTV Player', de: 'Windows — ABC IPTV Player' },
  'windows-vs-player': { tr: 'Windows — VS Player', de: 'Windows — VS Player' },
  'tablet-ibo-player': { tr: 'Tablet — IBO Player Pro', de: 'Tablet — IBO Player Pro' },
  'tablet-abc': { tr: 'Tablet — ABC IPTV Player', de: 'Tablet — ABC IPTV Player' },
  'tablet-vs-player': { tr: 'Tablet — VS Player', de: 'Tablet — VS Player' },
  mac: { tr: 'Mac', de: 'Mac' },
  'mac-next-plus': { tr: 'Mac — NEXT+', de: 'Mac — NEXT+' },
  'mac-castora': { tr: 'Mac — CASTORA', de: 'Mac — CASTORA' },
  'smart-tv': { tr: 'Smart TV (Samsung/LG)', de: 'Smart TV (Samsung/LG)' },
  'smart-tv-0-player': { tr: 'Smart TV — 0 Player', de: 'Smart TV — 0 Player' },
  'smart-tv-smarters-pro': { tr: 'Smart TV — IPTV Smarters Pro', de: 'Smart TV — IPTV Smarters Pro' },
  'ios-next-plus': { tr: 'iOS — NEXT+', de: 'iOS — NEXT+' },
  'ios-castora': { tr: 'iOS — CASTORA', de: 'iOS — CASTORA' },
  'ios-9xtream': { tr: 'iOS — 9Xtream', de: 'iOS — 9Xtream' },
  tablet: { tr: 'Tablet', de: 'Tablet' },
};

export const CONTENT_ALIASES = {};

/** @type {Record<string, { tr: { name: string, text: string }[], de: { name: string, text: string }[] }>} */
export const INSTALLATION_DEVICE_HOWTO_STEPS = {
  'android-tv': {
    tr: [
      { name: 'Downloader Kurulumu', text: 'TV mağazasından Downloader by AFTVnews uygulamasını indirin.' },
      { name: 'APK Linkini Girin', text: 'Downloader\'a WhatsApp/e-posta ile gelen Qruze Player APK linkini yapıştırın ve yükleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen giriş bilgileri ile Qruze Player\'da oturum açın.' },
    ],
    de: [
      { name: 'Downloader installieren', text: 'Downloader by AFTVnews aus dem TV-Store installieren.' },
      { name: 'APK-Link eingeben', text: 'Gesendeten Qruze Player APK-Link in Downloader einfügen und installieren.' },
      { name: 'Anmelden und streamen', text: 'Mit den gesendeten Zugangsdaten in Qruze Player anmelden.' },
    ],
  },
  ios: {
    tr: [
      { name: 'Uygulama Seçin', text: 'NEXT+, CASTORA veya 9Xtream — hub sayfasından uygulamanızı seçin.' },
    ],
    de: [
      { name: 'App wählen', text: 'NEXT+, CASTORA oder 9Xtream — App auf der Hub-Seite wählen.' },
    ],
  },
  'ios-next-plus': {
    tr: [
      { name: 'NEXT+ Uygulamasını İndirin', text: 'App Store\'dan NEXT+ uygulamasını indirin ve açın.' },
      { name: 'Abonelik Bilgilerini Girin', text: 'M3U URL veya Xtream Codes bilgilerinizi uygulamaya ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen giriş bilgileri ile giriş yapın; kanallar otomatik yüklenecektir.' },
    ],
    de: [
      { name: 'NEXT+ installieren', text: 'Installieren Sie NEXT+ aus dem App Store und öffnen Sie die App.' },
      { name: 'Zugangsdaten eingeben', text: 'M3U-URL oder Xtream-Codes-Daten in der App hinzufügen.' },
      { name: 'Anmelden und streamen', text: 'Mit den von uns gesendeten Zugangsdaten anmelden.' },
    ],
  },
  'ios-castora': {
    tr: [
      { name: 'CASTORA Uygulamasını İndirin', text: 'App Store\'dan CASTORA uygulamasını indirin.' },
      { name: 'Giriş Bilgilerini Girin', text: 'M3U veya Xtream Codes bilgilerinizi ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen giriş bilgileri ile giriş yapın.' },
    ],
    de: [
      { name: 'CASTORA installieren', text: 'CASTORA aus dem App Store installieren.' },
      { name: 'Zugangsdaten eingeben', text: 'M3U oder Xtream Codes eingeben.' },
      { name: 'Anmelden und streamen', text: 'Mit den gesendeten Zugangsdaten anmelden.' },
    ],
  },
  'ios-9xtream': {
    tr: [
      { name: '9Xtream Uygulamasını İndirin', text: 'App Store\'dan 9Xtream uygulamasını indirin (iPhone/iPad).' },
      { name: 'Giriş Bilgilerini Girin', text: 'Add Playlist ile Xtream Codes veya M3U ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen giriş bilgileri ile giriş yapın.' },
    ],
    de: [
      { name: '9Xtream installieren', text: '9Xtream aus dem App Store installieren (iPhone/iPad).' },
      { name: 'Zugangsdaten eingeben', text: 'Add Playlist mit Xtream Codes oder M3U.' },
      { name: 'Anmelden und streamen', text: 'Mit den gesendeten Zugangsdaten anmelden.' },
    ],
  },
  'android-phone': {
    tr: [
      { name: 'APK Linkini Açın', text: 'WhatsApp veya e-posta ile gönderilen Qruze Player APK indirme linkini tarayıcıda açın.' },
      { name: 'APK Kurulumu', text: 'Dosyayı indirin, bilinmeyen kaynak iznini verin ve Qruze Player APK\'sını yükleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen M3U veya Xtream Codes bilgileri ile giriş yapın.' },
    ],
    de: [
      { name: 'APK-Link öffnen', text: 'Den per WhatsApp/E-Mail gesendeten Qruze Player APK-Link im Browser öffnen.' },
      { name: 'APK installieren', text: 'APK herunterladen, unbekannte Quellen erlauben und installieren.' },
      { name: 'Anmelden und streamen', text: 'Mit den gesendeten M3U- oder Xtream-Daten anmelden.' },
    ],
  },
  windows: {
    tr: [
      { name: 'Uygulama Seçin', text: 'IBO Player Pro, ABC IPTV Player veya VS Player — paketinize göre hub sayfasından seçin.' },
    ],
    de: [
      { name: 'App wählen', text: 'IBO Player Pro, ABC IPTV Player oder VS Player — je nach Paket auf der Hub-Seite wählen.' },
    ],
  },
  'windows-ibo-player': {
    tr: [
      { name: 'IBO Player Pro İndirin', text: 'Microsoft Store\'dan IBO Player Pro uygulamasını indirin ve açın.' },
      { name: 'Abonelik Bilgilerini Girin', text: 'M3U URL veya Xtream Codes bilgilerinizi uygulamaya ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen giriş bilgileri ile giriş yapın; kanallar otomatik yüklenecektir.' },
    ],
    de: [
      { name: 'IBO Player Pro installieren', text: 'Installieren Sie IBO Player Pro aus dem Microsoft Store und öffnen Sie die App.' },
      { name: 'Zugangsdaten eingeben', text: 'M3U-URL oder Xtream-Codes-Daten in der App hinzufügen.' },
      { name: 'Anmelden und streamen', text: 'Mit den von uns gesendeten Zugangsdaten anmelden.' },
    ],
  },
  'windows-abc': {
    tr: [
      { name: 'ABC IPTV Player İndirin', text: 'abciptvplayer.com\'dan Windows sürümünü indirin ve kurun.' },
      { name: 'M3U Linkini Girin', text: 'Müşteri panelinizdeki M3U URL\'sini uygulamaya ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen M3U linki ile kanallar yüklenecektir.' },
    ],
    de: [
      { name: 'ABC IPTV Player installieren', text: 'Windows-Version von abciptvplayer.com herunterladen und installieren.' },
      { name: 'M3U-Link eingeben', text: 'M3U-URL aus dem Kundenpanel in der App hinzufügen.' },
      { name: 'Anmelden und streamen', text: 'Mit dem gesendeten M3U-Link streamen.' },
    ],
  },
  'windows-vs-player': {
    tr: [
      { name: 'VS Player Kurun', text: 'Android emülatörü kurun, VS Player (Vstro) uygulamasını yükleyin.' },
      { name: 'Portal Bilgilerini Girin', text: 'Xtream Codes veya Stalker portal bilgilerinizi ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen portal/Xtream bilgileri ile giriş yapın.' },
    ],
    de: [
      { name: 'VS Player installieren', text: 'Android-Emulator installieren, VS Player (Vstro) laden.' },
      { name: 'Portal-Daten eingeben', text: 'Xtream Codes oder Stalker-Portal-Daten eingeben.' },
      { name: 'Anmelden und streamen', text: 'Mit den gesendeten Portal-/Xtream-Daten anmelden.' },
    ],
  },
  mac: {
    tr: [
      { name: 'IINA Uygulamasını İndirin', text: 'iina.io adresinden IINA uygulamasını indirin ve kurun.' },
      { name: 'M3U Linkini Açın', text: 'Dosya > URL Aç menüsünden M3U linkinizi yapıştırın.' },
      { name: 'Yayını Başlatın', text: 'Kanal listesi yüklendikten sonra izlemeye başlayın.' },
    ],
    de: [
      { name: 'IINA installieren', text: 'Laden Sie IINA von iina.io herunter und installieren Sie die App.' },
      { name: 'M3U-Link öffnen', text: 'Wählen Sie Datei > URL öffnen und fügen Sie Ihren M3U-Link ein.' },
      { name: 'Wiedergabe starten', text: 'Starten Sie die Wiedergabe, sobald die Kanalliste geladen ist.' },
    ],
  },
  'smart-tv-0-player': {
    tr: [
      { name: '0 Player Uygulamasını İndirin', text: 'Samsung Apps veya LG Content Store\'dan 0 Player uygulamasını indirin.' },
      { name: '0 Player\'ı Açın', text: 'Uygulamayı başlatın ve playlist ekleme menüsüne gidin.' },
      { name: 'M3U veya Xtream Bilgilerini Girin', text: 'Abonelik bilgilerinizi girin ve kanalların yüklenmesini bekleyin.' },
    ],
    de: [
      { name: '0 Player installieren', text: 'Installieren Sie 0 Player aus dem Samsung- oder LG-App-Store.' },
      { name: '0 Player starten', text: 'Starten Sie die App und öffnen Sie das Menü zum Hinzufügen der Playlist.' },
      { name: 'M3U oder Xtream eingeben', text: 'Geben Sie Ihre Zugangsdaten ein und warten Sie auf den Kanalimport.' },
    ],
  },
  'smart-tv-smarters-pro': {
    tr: [
      { name: 'IPTV Smarters Pro İndirin', text: 'Samsung Apps veya LG Content Store\'dan IPTV Smarters Pro\'yu indirin.' },
      { name: 'Xtream Codes ile Giriş', text: 'Login with Xtream Codes API seçeneği ile bilgilerinizi girin.' },
      { name: 'Kanalları Yükleyin', text: 'Add User sonrası Live TV bölümünden kanallarınızı kontrol edin.' },
    ],
    de: [
      { name: 'IPTV Smarters Pro installieren', text: 'Installieren Sie die App aus dem Samsung- oder LG-Store.' },
      { name: 'Mit Xtream Codes anmelden', text: 'Wählen Sie Login with Xtream Codes API und geben Sie Ihre Daten ein.' },
      { name: 'Kanäle laden', text: 'Nach Add User unter Live TV die Kanäle prüfen.' },
    ],
  },
  tablet: {
    tr: [
      { name: 'Uygulama Seçin', text: 'IBO Player Pro, ABC IPTV Player veya VS Player — paketinize göre hub sayfasından seçin.' },
    ],
    de: [
      { name: 'App wählen', text: 'IBO Player Pro, ABC IPTV Player oder VS Player — je nach Paket auf der Hub-Seite wählen.' },
    ],
  },
  'tablet-ibo-player': {
    tr: [
      { name: 'IBO Player Pro İndirin', text: 'App Store veya Play Store\'dan IBO Player Pro uygulamasını indirin ve açın.' },
      { name: 'Abonelik Bilgilerini Girin', text: 'M3U URL veya Xtream Codes bilgilerinizi uygulamaya ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen giriş bilgileri ile giriş yapın; kanallar otomatik yüklenecektir.' },
    ],
    de: [
      { name: 'IBO Player Pro installieren', text: 'Installieren Sie IBO Player Pro aus App Store oder Play Store und öffnen Sie die App.' },
      { name: 'Zugangsdaten eingeben', text: 'M3U-URL oder Xtream-Codes-Daten in der App hinzufügen.' },
      { name: 'Anmelden und streamen', text: 'Mit den von uns gesendeten Zugangsdaten anmelden.' },
    ],
  },
  'tablet-abc': {
    tr: [
      { name: 'ABC IPTV Player İndirin', text: 'App Store veya Play Store\'dan ABC IPTV Player uygulamasını indirin.' },
      { name: 'M3U Linkini Girin', text: 'Müşteri panelinizdeki M3U URL\'sini uygulamaya ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen M3U linki ile kanallar yüklenecektir.' },
    ],
    de: [
      { name: 'ABC IPTV Player installieren', text: 'ABC IPTV Player aus App Store oder Play Store installieren.' },
      { name: 'M3U-Link eingeben', text: 'M3U-URL aus dem Kundenpanel in der App hinzufügen.' },
      { name: 'Anmelden und streamen', text: 'Mit dem gesendeten M3U-Link streamen.' },
    ],
  },
  'tablet-vs-player': {
    tr: [
      { name: 'VS Player İndirin', text: 'Google Play\'den VS Player (Vstro) uygulamasını indirin.' },
      { name: 'Portal Bilgilerini Girin', text: 'Xtream Codes veya Stalker portal bilgilerinizi ekleyin.' },
      { name: 'Giriş Yapın ve İzlemeye Başlayın', text: 'Size verilen portal/Xtream bilgileri ile giriş yapın.' },
    ],
    de: [
      { name: 'VS Player installieren', text: 'VS Player (Vstro) aus Google Play laden.' },
      { name: 'Portal-Daten eingeben', text: 'Xtream Codes oder Stalker-Portal-Daten eingeben.' },
      { name: 'Anmelden und streamen', text: 'Mit den gesendeten Portal-/Xtream-Daten anmelden.' },
    ],
  },
};

/** Cihaz sayfası FAQ — InstallationDevicePage deviceFaqItems ile aynı (TR). */
export const DEVICE_FAQ_TR = {
  'android-tv': [
    { q: 'Qruze Player Play Store\'da var mı?', a: 'Hayır. Qruze Player APK olarak kurulur; Downloader ile size gönderilen linkten yükleyin.' },
    { q: "Fire TV Stick'te nasıl kurulur?", a: 'Amazon Appstore\'dan Downloader indirin, APK linkini Downloader\'a yapıştırın ve yükleyin.' },
    { q: 'APK linkini nereden alırım?', a: 'Abonelik sonrası WhatsApp veya e-posta ile Qruze Player APK indirme linki gönderilir.' },
  ],
  ios: [
    { q: '000 Player ücretsiz mi?', a: 'Evet, temel özellikler ücretsiz.' },
    { q: "Apple TV'de çalışır mı?", a: "Evet, tvOS App Store'dan indirilebilir." },
  ],
  'android-phone': [
    { q: 'Qruze Player Play Store\'da var mı?', a: 'Hayır. Qruze Player Play Store\'da yoktur; size gönderilen APK linki ile kurulum yapılır.' },
    { q: 'APK linkini nereden alırım?', a: 'Abonelik sonrası WhatsApp veya e-posta ile size Qruze Player APK indirme linki iletilir.' },
    { q: 'Chromecast destekler mi?', a: 'Evet, Qruze Player Chromecast destekli cihazlara yansıtma yapabilir.' },
  ],
  windows: [
    { q: 'VLC ücretsiz mi?', a: 'Evet, tamamen ücretsiz ve açık kaynak.' },
    { q: 'Kodi mi VLC mi?', a: 'M3U için VLC daha basit; EPG ve kayıt için Kodi.' },
  ],
  mac: [
    { q: 'IINA ücretsiz mi?', a: 'Evet, açık kaynak ve ücretsiz.' },
    { q: 'Apple Silicon destekler mi?', a: 'Evet, native destek.' },
  ],
  'smart-tv-0-player': [
    { q: '0 Player nedir?', a: '0 Player (Zero Player), Samsung Tizen ve LG webOS için premium IPTV oynatıcıdır. Resmi site: 0player.com' },
    { q: 'M3U mü Xtream Codes mu?', a: 'Her ikisi de desteklenir. Müşteri panelinizde hangi bilgi varsa onu girin.' },
    { q: "Philips/Sony'de var mı?", a: '0 Player Samsung ve LG için optimize edilmiştir. Android TV cihazlarda Tivimate kullanın.' },
  ],
  'smart-tv-smarters-pro': [
    { q: 'IPTV Smarters Pro ücretsiz mi?', a: 'Evet, temel sürüm ücretsizdir. Premium sürüm isteğe bağlı ek özellikler sunar.' },
    { q: 'Xtream Codes destekler mi?', a: 'Evet. Login with Xtream Codes API ile sunucu, kullanıcı adı ve şifre girin.' },
    { q: "Samsung ve LG'de nasıl bulurum?", a: 'Samsung Apps veya LG Content Store\'da "IPTV Smarters Pro" arayıp yükleyin.' },
  ],
  tablet: [
    { q: 'Paketime hangi uygulama?', a: 'Türkiye paketi → IBO Player Pro. Avrupa Standart (M3U) → ABC. Avrupa HD (portal) → VS Player.' },
    { q: 'iPad ve Android destekler mi?', a: 'IBO Player Pro ve ABC hem iPad (App Store) hem Android tablet (Play Store). VS Player ağırlıklı Android tablet.' },
  ],
};

/** Cihaz sayfası FAQ — InstallationDevicePage deviceFaqItems ile aynı (DE). */
export const DEVICE_FAQ_DE = {
  'android-tv': [
    { q: 'Qruze Player im Play Store?', a: 'Nein. Installation als APK — Link per WhatsApp/E-Mail, Download mit Downloader.' },
    { q: 'Qruze Player auf Fire TV Stick?', a: 'Downloader aus dem Amazon Store, APK-Link einfügen und installieren.' },
    { q: 'Wo bekomme ich den APK-Link?', a: 'Nach dem Abo per WhatsApp oder E-Mail.' },
  ],
  ios: [
    { q: 'Ist 000 Player kostenlos?', a: 'Ja, Grundfunktionen sind kostenlos.' },
    { q: 'Läuft auf Apple TV?', a: 'Ja, im tvOS App Store erhältlich.' },
  ],
  'android-phone': [
    { q: 'Qruze Player im Play Store?', a: 'Nein. Qruze Player ist nicht im Play Store — Installation per gesendetem APK-Link.' },
    { q: 'Wo bekomme ich den APK-Link?', a: 'Nach dem Abo erhalten Sie den Qruze Player APK-Link per WhatsApp oder E-Mail.' },
    { q: 'Chromecast unterstützt?', a: 'Ja, Cast auf Chromecast-fähige Geräte möglich.' },
  ],
  windows: [
    { q: 'Ist VLC kostenlos?', a: 'Ja, komplett kostenlos und Open Source.' },
    { q: 'Kodi oder VLC?', a: 'VLC einfacher für M3U; Kodi für EPG und Aufnahme.' },
  ],
  mac: [
    { q: 'IINA kostenlos?', a: 'Ja, Open Source und kostenlos.' },
    { q: 'Apple Silicon unterstützt?', a: 'Ja, native Unterstützung.' },
  ],
  'smart-tv-0-player': [
    { q: 'Was ist 0 Player?', a: '0 Player (Zero Player) ist ein Premium-Media-Player für Samsung Tizen und LG webOS. Offizielle Seite: 0player.com' },
    { q: 'M3U oder Xtream Codes?', a: 'Beides wird unterstützt. Nutzen Sie die Daten aus Ihrem Kundenpanel.' },
    { q: 'Philips/Sony unterstützt?', a: '0 Player ist für Samsung/LG optimiert. Auf Android-TV-Geräten Tivimate nutzen.' },
  ],
  'smart-tv-smarters-pro': [
    { q: 'Ist IPTV Smarters Pro kostenlos?', a: 'Ja, die Basisversion ist kostenlos. Premium ist optional.' },
    { q: 'Unterstützt es Xtream Codes?', a: 'Ja. Wählen Sie Login with Xtream Codes API und geben Sie Server, Benutzer und Passwort ein.' },
    { q: 'Wo finde ich die App?', a: 'Im Samsung Apps oder LG Content Store nach „IPTV Smarters Pro“ suchen.' },
  ],
  tablet: [
    { q: 'Welche App für mein Paket?', a: 'Türkei → IBO Player Pro. Europa Standard (M3U) → ABC. Europa HD (Portal) → VS Player.' },
    { q: 'iPad und Android?', a: 'IBO Player Pro und ABC auf iPad (App Store) und Android (Play Store). VS Player primär Android-Tablet.' },
  ],
};
