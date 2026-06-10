/**
 * Kurulum cihaz sayfaları için statik HowTo adımları (prerender / Supabase yokken fallback).
 * installationDeviceContent.js içindeki görünür adımlarla uyumlu.
 */

export const DEVICE_LABELS = {
  'android-tv': { tr: 'Android TV', de: 'Android TV' },
  ios: { tr: 'iOS ve iPhone', de: 'iOS und iPhone' },
  'android-phone': { tr: 'Android Telefon', de: 'Android Smartphone' },
  windows: { tr: 'Windows PC', de: 'Windows PC' },
  mac: { tr: 'Mac', de: 'Mac' },
  'smart-tv': { tr: 'Smart TV (Samsung/LG)', de: 'Smart TV (Samsung/LG)' },
  'samsung-tv': { tr: 'Samsung TV', de: 'Samsung TV' },
  'lg-tv': { tr: 'LG TV', de: 'LG TV' },
  tablet: { tr: 'Tablet', de: 'Tablet' },
};

export const CONTENT_ALIASES = {
  'samsung-tv': 'smart-tv',
  'lg-tv': 'smart-tv',
};

/** @type {Record<string, { tr: { name: string, text: string }[], de: { name: string, text: string }[] }>} */
export const INSTALLATION_DEVICE_HOWTO_STEPS = {
  'android-tv': {
    tr: [
      { name: 'Tivimate Uygulamasını İndirin', text: 'Android TV\'nizde Google Play Store\'u açın, Tivimate uygulamasını indirin ve açın.' },
      { name: 'Abonelik Bilgilerini Girin', text: 'M3U linkinizi veya Xtream Codes sunucu, kullanıcı adı ve şifre bilgilerinizi uygulamaya girin.' },
      { name: 'Kanalları Yükleyin ve İzlemeye Başlayın', text: 'Kaydedin; kanallar otomatik yüklenecek ve EPG birkaç dakika içinde hazır olacaktır.' },
    ],
    de: [
      { name: 'Tivimate installieren', text: 'Öffnen Sie den Google Play Store auf Ihrem Android TV, suchen Sie nach Tivimate und installieren Sie die App.' },
      { name: 'Zugangsdaten eingeben', text: 'Fügen Sie Ihren M3U-Link ein oder geben Sie Xtream-Codes-Server, Benutzername und Passwort ein.' },
      { name: 'Kanäle laden und streamen', text: 'Speichern Sie die Playlist; Kanäle werden automatisch geladen, EPG kann 2–5 Minuten dauern.' },
    ],
  },
  ios: {
    tr: [
      { name: '000 Player Uygulamasını İndirin', text: 'App Store\'dan 000 Player uygulamasını indirin ve açın.' },
      { name: 'Playlist Ekleyin', text: 'M3U URL\'nizi veya Xtream Codes bilgilerinizi uygulamaya girin.' },
      { name: 'Kanalları Yükleyin', text: 'Kaydedin; kanallar ve EPG otomatik yüklenecektir.' },
    ],
    de: [
      { name: '000 Player installieren', text: 'Laden Sie 000 Player aus dem App Store herunter und öffnen Sie die App.' },
      { name: 'Playlist hinzufügen', text: 'Geben Sie Ihre M3U-URL oder Xtream-Codes-Daten ein.' },
      { name: 'Kanäle laden', text: 'Speichern Sie die Einstellungen; Kanäle und EPG werden automatisch geladen.' },
    ],
  },
  'android-phone': {
    tr: [
      { name: 'IPTV Smarters Uygulamasını İndirin', text: 'Google Play Store\'dan IPTV Smarters uygulamasını indirin.' },
      { name: 'Giriş Bilgilerini Girin', text: 'M3U veya Xtream Codes bilgilerinizi uygulamaya ekleyin.' },
      { name: 'İzlemeye Başlayın', text: 'Kanalların yüklenmesini bekleyin ve yayına başlayın.' },
    ],
    de: [
      { name: 'IPTV Smarters installieren', text: 'Installieren Sie IPTV Smarters aus dem Google Play Store.' },
      { name: 'Zugangsdaten eingeben', text: 'Fügen Sie M3U- oder Xtream-Codes-Daten in der App hinzu.' },
      { name: 'Streaming starten', text: 'Warten Sie, bis die Kanäle geladen sind, und starten Sie die Wiedergabe.' },
    ],
  },
  windows: {
    tr: [
      { name: 'VLC Media Player İndirin', text: 'Resmi siteden veya Microsoft Store\'dan VLC\'yi indirin ve kurun.' },
      { name: 'M3U Playlist Açın', text: 'VLC\'de Medya > Ağ Akışını Aç seçeneğiyle M3U linkinizi yapıştırın.' },
      { name: 'Kanalları İzleyin', text: 'Playlist yüklendikten sonra kanallarınızı seçip izlemeye başlayın.' },
    ],
    de: [
      { name: 'VLC Media Player installieren', text: 'Laden Sie VLC von der offiziellen Website oder dem Microsoft Store herunter.' },
      { name: 'M3U-Playlist öffnen', text: 'Öffnen Sie in VLC Medien > Netzwerkstream öffnen und fügen Sie Ihren M3U-Link ein.' },
      { name: 'Kanäle ansehen', text: 'Nach dem Laden der Playlist können Sie Sender auswählen und streamen.' },
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
  'smart-tv': {
    tr: [
      { name: 'BOB Player Uygulamasını İndirin', text: 'Samsung veya LG TV mağazasından BOB Player uygulamasını indirin.' },
      { name: 'Cihaz Kodunu Etkinleştirin', text: 'Uygulamada görünen cihaz kodunu BOB Player web sitesinden etkinleştirin.' },
      { name: 'M3U veya Xtream Bilgilerini Girin', text: 'Playlist bilgilerinizi girin ve kanalların yüklenmesini bekleyin.' },
    ],
    de: [
      { name: 'BOB Player installieren', text: 'Installieren Sie BOB Player aus dem Samsung- oder LG-App-Store.' },
      { name: 'Gerätecode aktivieren', text: 'Aktivieren Sie den in der App angezeigten Code auf der BOB-Player-Website.' },
      { name: 'M3U oder Xtream eingeben', text: 'Geben Sie Ihre Playlist-Daten ein und warten Sie auf den Kanalimport.' },
    ],
  },
  tablet: {
    tr: [
      { name: 'Uygun Uygulamayı İndirin', text: 'iPad için 000 Player, Android tablet için IPTV Smarters uygulamasını indirin.' },
      { name: 'Abonelik Bilgilerini Girin', text: 'M3U veya Xtream Codes bilgilerinizi uygulamaya ekleyin.' },
      { name: 'İzlemeye Başlayın', text: 'Kanallar yüklendikten sonra tabletinizden izlemeye başlayın.' },
    ],
    de: [
      { name: 'Passende App installieren', text: '000 Player für iPad oder IPTV Smarters für Android-Tablet installieren.' },
      { name: 'Zugangsdaten eingeben', text: 'M3U- oder Xtream-Codes-Daten in der App hinzufügen.' },
      { name: 'Streaming starten', text: 'Nach dem Laden der Kanäle können Sie auf dem Tablet streamen.' },
    ],
  },
};

/** Cihaz sayfası FAQ — InstallationDevicePage deviceFaqItems ile aynı (TR). */
export const DEVICE_FAQ_TR = {
  'android-tv': [
    { q: 'Tivimate ücretsiz mi?', a: 'Evet, ücretsiz sürüm tüm temel özellikleri sunar. Premium isteğe bağlıdır.' },
    { q: "Fire TV Stick'te Tivimate var mı?", a: 'Play Store yok; Downloader ile APK sideload edin.' },
    { q: 'Kaç cihazda aynı anda kullanılır?', a: 'Aboneliğinizin eşzamanlı izleme limitine bağlıdır.' },
  ],
  ios: [
    { q: '000 Player ücretsiz mi?', a: 'Evet, temel özellikler ücretsiz.' },
    { q: "Apple TV'de çalışır mı?", a: "Evet, tvOS App Store'dan indirilebilir." },
  ],
  'android-phone': [
    { q: 'IPTV Smarters ücretsiz mi?', a: 'Evet, reklamlı ücretsiz sürüm var.' },
    { q: 'Chromecast destekler mi?', a: "Evet, TV'ye yansıtma yapabilirsiniz." },
  ],
  windows: [
    { q: 'VLC ücretsiz mi?', a: 'Evet, tamamen ücretsiz ve açık kaynak.' },
    { q: 'Kodi mi VLC mi?', a: 'M3U için VLC daha basit; EPG ve kayıt için Kodi.' },
  ],
  mac: [
    { q: 'IINA ücretsiz mi?', a: 'Evet, açık kaynak ve ücretsiz.' },
    { q: 'Apple Silicon destekler mi?', a: 'Evet, native destek.' },
  ],
  'smart-tv': [
    { q: 'BOB Player ücretsiz mi?', a: '7 gün deneme; sonrası ücretli.' },
    { q: "Philips/Sony'de var mı?", a: "Hayır; Android TV'de Tivimate kullanın." },
  ],
  'samsung-tv': [
    { q: "Samsung Tizen TV'de IPTV çalışır mı?", a: "Evet. BOB Player, SS IPTV ve benzeri uygulamalar Samsung Smart TV'lerde çalışır." },
    { q: "M3U linkini Samsung TV'ye nasıl gönderirim?", a: 'En kolay yöntem SmartThings uygulaması veya uzaktan kumanda ile giriş yapmaktır.' },
  ],
  'lg-tv': [
    { q: "LG webOS TV'de IPTV çalışır mı?", a: 'Evet. LG Content Store üzerinden BOB Player gibi uyumlu IPTV uygulamaları kullanılabilir.' },
    { q: 'Hangi LG modelleri desteklenir?', a: 'Genellikle webOS 3.0 ve üzeri çalışan LG modeller desteklenir.' },
  ],
  tablet: [
    { q: 'iPad mi Android mi?', a: "İkisi de çalışır; iPad'de 000 Player, Android'de IPTV Smarters." },
  ],
};

/** Cihaz sayfası FAQ — InstallationDevicePage deviceFaqItems ile aynı (DE). */
export const DEVICE_FAQ_DE = {
  'android-tv': [
    { q: 'Ist Tivimate kostenlos?', a: 'Ja, die kostenlose Version bietet alle Grundfunktionen. Premium ist optional.' },
    { q: 'Tivimate auf Fire TV Stick?', a: 'Play Store fehlt; APK per Downloader sideloaden.' },
    { q: 'Wie viele Geräte gleichzeitig?', a: 'Abhängig von Ihrem Abonnement-Limit.' },
  ],
  ios: [
    { q: 'Ist 000 Player kostenlos?', a: 'Ja, Grundfunktionen sind kostenlos.' },
    { q: 'Läuft auf Apple TV?', a: 'Ja, im tvOS App Store erhältlich.' },
  ],
  'android-phone': [
    { q: 'IPTV Smarters kostenlos?', a: 'Ja, mit Werbung. Premium ohne Werbung.' },
    { q: 'Chromecast unterstützt?', a: 'Ja, Streaming zum TV möglich.' },
  ],
  windows: [
    { q: 'Ist VLC kostenlos?', a: 'Ja, komplett kostenlos und Open Source.' },
    { q: 'Kodi oder VLC?', a: 'VLC einfacher für M3U; Kodi für EPG und Aufnahme.' },
  ],
  mac: [
    { q: 'IINA kostenlos?', a: 'Ja, Open Source und kostenlos.' },
    { q: 'Apple Silicon unterstützt?', a: 'Ja, native Unterstützung.' },
  ],
  'smart-tv': [
    { q: 'BOB Player kostenlos?', a: '7 Tage Testversion; danach einmalige Gebühr.' },
    { q: 'Philips/Sony unterstützt?', a: 'Nein; bei Android TV Tivimate nutzen.' },
  ],
  'samsung-tv': [
    { q: 'Funktioniert IPTV auf Samsung Tizen?', a: 'Ja. BOB Player, SS IPTV und ähnliche Apps unterstützen Samsung Smart TVs.' },
    { q: 'Wie sende ich den M3U-Link an Samsung TV?', a: 'Am einfachsten per SmartThings-App oder per Eingabe mit der Fernbedienung.' },
  ],
  'lg-tv': [
    { q: 'Funktioniert IPTV auf LG webOS?', a: 'Ja. LG Content Store bietet kompatible IPTV-Apps wie BOB Player.' },
    { q: 'Welche LG Modelle werden unterstützt?', a: 'In der Regel webOS 3.0 und neuere LG Modelle.' },
  ],
  tablet: [
    { q: 'iPad oder Android?', a: 'Beide funktionieren; 000 Player auf iPad, IPTV Smarters auf Android.' },
  ],
};
