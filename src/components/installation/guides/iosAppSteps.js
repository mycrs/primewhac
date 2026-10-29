/** iOS App Store — NEXT+, CASTORA, 9Xtream (sayfa başına özgü adımlar) */

export const IOS_APP_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

const IOS_IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'add', 'watch', 'final'];
const IOS_STEP_IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'addUser', 'watch', 'finalLogin'];

function iosGuideImages(appSlug) {
  return Object.fromEntries(
    IOS_STEP_IMAGE_KEYS.map((key, index) => [
      key,
      `/guides/ios/${appSlug}-${IOS_IMAGE_KEYS[index]}.svg`,
    ]),
  );
}

const NEXT_IMAGES = iosGuideImages('next');
const CASTORA_IMAGES = iosGuideImages('castora');
const XTREAM_IMAGES = iosGuideImages('9xtream');

function mapSteps(steps, theme) {
  return steps.map((step, index) => ({
    ...step,
    visual: IOS_APP_VISUALS[index] || 'app',
    theme,
  }));
}

function buildNextPlusSteps(isDe) {
  const tr = [
    { title: "App Store'u Açın", description: 'iPhone veya iPad\'den App Store uygulamasını başlatın.', image: NEXT_IMAGES.store },
    { title: 'Arama Sekmesine Girin', description: 'Alt menüde "Ara" sekmesine dokunun.', image: NEXT_IMAGES.search },
    { title: 'NEXT+ Uygulamasını Bulun', description: 'Arama çubuğuna "NEXT+" yazın. Geliştirici: Sultan ALGhaithi — resmi uygulamayı seçin.', image: NEXT_IMAGES.find },
    { title: 'NEXT+ İndirin', description: '"Al" veya bulut simgesine dokunarak ücretsiz indirin. Face ID / Touch ID ile onaylayın.', image: NEXT_IMAGES.install },
    { title: 'NEXT+ Uygulamasını Açın', description: 'Kurulum bitince "Aç" butonuna dokunun veya ana ekrandan NEXT+ başlatın.', image: NEXT_IMAGES.open },
    { title: 'Playlist veya Xtream Ekleyin', description: 'Ana ekranda playlist ekleme veya "+" seçin. M3U/M3U8 URL veya Xtream Codes (sunucu, kullanıcı adı, şifre) girin.', image: NEXT_IMAGES.login },
    { title: 'Bilgileri Kaydedin', description: 'Girdiğiniz bilgileri kontrol edip kaydedin. Kanal listesi birkaç dakika içinde indirilecektir.', image: NEXT_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Live TV, Movies ve Series bölümlerinden içeriklere erişin. PiP ve Chromecast desteklenir.', image: NEXT_IMAGES.watch },
    { title: 'Uygulamayı Açın ve Giriş Yapın', description: 'NEXT+ uygulamasını açın. Size verdiğimiz giriş bilgileri (kullanıcı adı, şifre, sunucu URL veya M3U linki) ile giriş yapın. WhatsApp veya e-posta ile gönderilen bilgileri eksiksiz girin.', image: NEXT_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'App Store öffnen', description: 'Starten Sie die App Store App auf iPhone oder iPad.', image: NEXT_IMAGES.store },
    { title: 'Suche öffnen', description: 'Tippen Sie unten auf „Suchen“.', image: NEXT_IMAGES.search },
    { title: 'NEXT+ finden', description: 'Suchen Sie nach „NEXT+“ (Entwickler: Sultan ALGhaithi).', image: NEXT_IMAGES.find },
    { title: 'NEXT+ installieren', description: 'Kostenlos laden und mit Face ID / Touch ID bestätigen.', image: NEXT_IMAGES.install },
    { title: 'NEXT+ starten', description: 'Nach der Installation die App öffnen.', image: NEXT_IMAGES.open },
    { title: 'Playlist oder Xtream hinzufügen', description: 'Playlist hinzufügen oder „+“ — M3U/M3U8 oder Xtream Codes eingeben.', image: NEXT_IMAGES.login },
    { title: 'Speichern', description: 'Daten prüfen und speichern. Kanalliste wird geladen.', image: NEXT_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Unter Live TV, Movies und Series streamen. PiP und Chromecast unterstützt.', image: NEXT_IMAGES.watch },
    { title: 'App öffnen und anmelden', description: 'NEXT+ öffnen und sich mit den von uns gesendeten Zugangsdaten anmelden.', image: NEXT_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'apple');
}

function buildCastoraSteps(isDe) {
  const tr = [
    { title: "App Store'u Açın", description: 'iPhone veya iPad\'den App Store uygulamasını başlatın.', image: CASTORA_IMAGES.store },
    { title: 'CASTORA Arayın', description: 'Arama sekmesinde "CASTORA" yazın.', image: CASTORA_IMAGES.search },
    { title: 'CASTORA Uygulamasını İndirin', description: 'Resmi CASTORA uygulamasını seçin ve "Al" butonuna dokunun.', image: CASTORA_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'İndirme bitince uygulamayı açın. Gerekli izinleri onaylayın.', image: CASTORA_IMAGES.install },
    { title: 'CASTORA\'yı Başlatın', description: 'Uygulama açıldığında Xtream Codes veya M3U ekleme ekranına gidin.', image: CASTORA_IMAGES.open },
    { title: 'Xtream Giriş Bilgilerini Girin', description: 'Xtream Codes ile giriş seçin. İsim: istediğiniz bir ad (Any Name). Kullanıcı adı ve şifrenizi girin. Sunucu / URL alanına **8811** yazın.', image: CASTORA_IMAGES.login },
    { title: 'Giriş Yapın', description: '"Login", "Sign In" veya "Add User" butonuna basın. Kanal listesi indirilecektir.', image: CASTORA_IMAGES.addUser },
    { title: 'İzlemeye Başlayın', description: 'Live TV, Movies ve Series kategorilerinden dilediğiniz içeriği seçin.', image: CASTORA_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'CASTORA\'yı açın. WhatsApp veya e-posta ile gönderdiğimiz kullanıcı adı, şifre ve sunucu bilgilerini eksiksiz girin. Sunucu alanına **8811** yazmayı unutmayın.', image: CASTORA_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'App Store öffnen', description: 'App Store auf iPhone oder iPad starten.', image: CASTORA_IMAGES.store },
    { title: 'CASTORA suchen', description: 'Im Tab „Suchen“ nach „CASTORA“ suchen.', image: CASTORA_IMAGES.search },
    { title: 'CASTORA installieren', description: 'Offizielle CASTORA App auswählen und laden.', image: CASTORA_IMAGES.find },
    { title: 'Installation abschließen', description: 'Nach dem Download die App öffnen.', image: CASTORA_IMAGES.install },
    { title: 'CASTORA starten', description: 'Zum Xtream Codes oder M3U Hinzufügen-Bildschirm gehen.', image: CASTORA_IMAGES.open },
    { title: 'Xtream Zugangsdaten', description: 'Xtream Codes wählen. Name: beliebig. Benutzer und Passwort eingeben. Server/URL: **8811**.', image: CASTORA_IMAGES.login },
    { title: 'Anmelden', description: 'Login / Sign In / Add User tippen. Kanalliste wird geladen.', image: CASTORA_IMAGES.addUser },
    { title: 'Streaming starten', description: 'Live TV, Movies und Series auswählen.', image: CASTORA_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: 'CASTORA öffnen und die gesendeten Zugangsdaten eingeben. Server-Feld: **8811**.', image: CASTORA_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'violet');
}

function build9XtreamSteps(isDe) {
  const tr = [
    { title: "App Store'u Açın", description: 'iPhone veya iPad\'den App Store uygulamasını başlatın.', image: XTREAM_IMAGES.store },
    { title: '9Xtream Arayın', description: 'Arama sekmesinde "9Xtream" veya "9Xtream Download Play IPTV" yazın.', image: XTREAM_IMAGES.search },
    { title: '9Xtream Uygulamasını İndirin', description: 'Resmi 9Xtream uygulamasını seçin ve ücretsiz indirin.', image: XTREAM_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'İndirme bitince uygulamayı açın.', image: XTREAM_IMAGES.install },
    { title: '9Xtream\'i Açın', description: 'Uygulama açıldığında ana menüden playlist ekleme bölümüne gidin.', image: XTREAM_IMAGES.open },
    { title: 'Add Playlist — Xtream Codes', description: '"Add Playlist" seçin. "Xtream Codes" veya "Xtream Codes API" ile giriş yapın. Sunucu, kullanıcı adı ve şifre alanlarını doldurun.', image: XTREAM_IMAGES.login },
    { title: 'Playlist Kaydedin', description: 'Bilgileri kontrol edip kaydedin. Kanallar birkaç dakika içinde yüklenecektir.', image: XTREAM_IMAGES.addUser },
    { title: 'Live TV\'ye Geçin', description: 'Live TV bölümünden kanallarınızı kontrol edin. VOD ve diziler varsa ilgili sekmelerden erişin.', image: XTREAM_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: '9Xtream\'i açın. Size verdiğimiz Xtream Codes bilgileri (sunucu URL, kullanıcı adı, şifre) ile giriş yapın. WhatsApp veya e-posta ile gönderilen bilgileri eksiksiz girin.', image: XTREAM_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'App Store öffnen', description: 'App Store auf iPhone oder iPad starten.', image: XTREAM_IMAGES.store },
    { title: '9Xtream suchen', description: 'Nach „9Xtream“ suchen.', image: XTREAM_IMAGES.search },
    { title: '9Xtream installieren', description: 'Offizielle App installieren.', image: XTREAM_IMAGES.find },
    { title: 'Installation abschließen', description: 'App nach dem Download öffnen.', image: XTREAM_IMAGES.install },
    { title: '9Xtream starten', description: 'Zum Menü zum Hinzufügen einer Playlist gehen.', image: XTREAM_IMAGES.open },
    { title: 'Add Playlist — Xtream Codes', description: 'Add Playlist wählen, dann Xtream Codes API. Server, Benutzer und Passwort eingeben.', image: XTREAM_IMAGES.login },
    { title: 'Playlist speichern', description: 'Daten speichern und auf den Kanalimport warten.', image: XTREAM_IMAGES.addUser },
    { title: 'Live TV öffnen', description: 'Unter Live TV Sender prüfen. VOD/Serien in den jeweiligen Tabs.', image: XTREAM_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: '9Xtream öffnen und die gesendeten Xtream Codes vollständig eingeben.', image: XTREAM_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'sky');
}

const BUILDERS = {
  'next-plus': buildNextPlusSteps,
  castora: buildCastoraSteps,
  '9xtream': build9XtreamSteps,
};

export function buildIosAppSteps(isDe, appId = 'next-plus') {
  const build = BUILDERS[appId] || BUILDERS['next-plus'];
  return build(isDe);
}

/** iOS uygulama sayfaları admin ios_config adımlarını paylaştığı için yalnızca fallback kullanılır. */
export function resolveIosAppGuideSteps(_dbSteps, isDe, appId = 'next-plus') {
  return buildIosAppSteps(isDe, appId);
}
