/** Mac — NEXT+ ve CASTORA (sayfa başına özgü adımlar) */

export const MAC_APP_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

const IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'add', 'watch', 'final'];

function macGuideImages(appSlug) {
  const stepKeys = ['store', 'search', 'find', 'install', 'open', 'login', 'addUser', 'watch', 'finalLogin'];
  return Object.fromEntries(
    stepKeys.map((key, index) => [key, `/guides/mac/${appSlug}-${IMAGE_KEYS[index]}.svg`]),
  );
}

const NEXT_IMAGES = macGuideImages('next');
const CASTORA_IMAGES = macGuideImages('castora');

function mapSteps(steps, theme) {
  return steps.map((step, index) => ({
    ...step,
    visual: MAC_APP_VISUALS[index] || 'app',
    theme,
  }));
}

function buildNextPlusSteps(isDe) {
  const tr = [
    { title: 'Mac App Store\'u Açın', description: 'Mac bilgisayarınızda App Store uygulamasını başlatın.', image: NEXT_IMAGES.store },
    { title: 'Arama Sekmesine Girin', description: 'App Store\'da arama alanına tıklayın veya Cmd+F kullanın.', image: NEXT_IMAGES.search },
    { title: 'NEXT+ Uygulamasını Bulun', description: 'Arama çubuğuna "NEXT+" yazın. Geliştirici: Sultan ALGhaithi — resmi uygulamayı seçin.', image: NEXT_IMAGES.find },
    { title: 'NEXT+ İndirin', description: '"Al" veya "Get" butonuna tıklayarak ücretsiz indirin. Apple ID ile onaylayın.', image: NEXT_IMAGES.install },
    { title: 'NEXT+ Uygulamasını Açın', description: 'Kurulum bitince "Aç" butonuna tıklayın veya Launchpad\'den NEXT+ başlatın.', image: NEXT_IMAGES.open },
    { title: 'Playlist veya Xtream Ekleyin', description: 'Ana ekranda playlist ekleme veya "+" seçin. M3U/M3U8 URL veya Xtream Codes (sunucu, kullanıcı adı, şifre) girin.', image: NEXT_IMAGES.login },
    { title: 'Bilgileri Kaydedin', description: 'Girdiğiniz bilgileri kontrol edip kaydedin. Kanal listesi birkaç dakika içinde indirilecektir.', image: NEXT_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Live TV, Movies ve Series bölümlerinden içeriklere erişin.', image: NEXT_IMAGES.watch },
    { title: 'Uygulamayı Açın ve Giriş Yapın', description: 'NEXT+ uygulamasını açın. Size verdiğimiz giriş bilgileri (kullanıcı adı, şifre, sunucu URL veya M3U linki) ile giriş yapın. WhatsApp veya e-posta ile gönderilen bilgileri eksiksiz girin.', image: NEXT_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Mac App Store öffnen', description: 'Starten Sie den App Store auf Ihrem Mac.', image: NEXT_IMAGES.store },
    { title: 'Suche öffnen', description: 'Suchfeld im App Store anklicken oder Cmd+F.', image: NEXT_IMAGES.search },
    { title: 'NEXT+ finden', description: 'Nach „NEXT+“ suchen (Entwickler: Sultan ALGhaithi).', image: NEXT_IMAGES.find },
    { title: 'NEXT+ installieren', description: '„Laden“ / „Get“ tippen und mit Apple ID bestätigen.', image: NEXT_IMAGES.install },
    { title: 'NEXT+ starten', description: 'Nach der Installation über Launchpad öffnen.', image: NEXT_IMAGES.open },
    { title: 'Playlist oder Xtream hinzufügen', description: 'Playlist hinzufügen oder „+“ — M3U/M3U8 oder Xtream Codes eingeben.', image: NEXT_IMAGES.login },
    { title: 'Speichern', description: 'Daten prüfen und speichern. Kanalliste wird geladen.', image: NEXT_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Unter Live TV, Movies und Series streamen.', image: NEXT_IMAGES.watch },
    { title: 'App öffnen und anmelden', description: 'NEXT+ öffnen und sich mit den von uns gesendeten Zugangsdaten anmelden.', image: NEXT_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'apple');
}

function buildCastoraSteps(isDe) {
  const tr = [
    { title: 'Mac App Store\'u Açın', description: 'Mac bilgisayarınızda App Store uygulamasını başlatın.', image: CASTORA_IMAGES.store },
    { title: 'CASTORA Arayın', description: 'Arama alanına "CASTORA" yazın.', image: CASTORA_IMAGES.search },
    { title: 'CASTORA Uygulamasını İndirin', description: 'Resmi CASTORA uygulamasını seçin ve "Al" / "Get" butonuna tıklayın.', image: CASTORA_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'İndirme bitince uygulamayı açın. Gerekli izinleri onaylayın.', image: CASTORA_IMAGES.install },
    { title: 'CASTORA\'yı Başlatın', description: 'Launchpad\'den veya Uygulamalar klasöründen CASTORA\'yı açın.', image: CASTORA_IMAGES.open },
    { title: 'Xtream Giriş Bilgilerini Girin', description: 'Xtream Codes ile giriş seçin. İsim: istediğiniz bir ad. Kullanıcı adı ve şifrenizi girin. Sunucu / URL alanına **8811** yazın.', image: CASTORA_IMAGES.login },
    { title: 'Giriş Yapın', description: '"Login", "Sign In" veya "Add User" butonuna basın. Kanal listesi indirilecektir.', image: CASTORA_IMAGES.addUser },
    { title: 'İzlemeye Başlayın', description: 'Live TV, Movies ve Series kategorilerinden dilediğiniz içeriği seçin.', image: CASTORA_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'CASTORA\'yı açın. WhatsApp veya e-posta ile gönderdiğimiz kullanıcı adı, şifre ve sunucu bilgilerini eksiksiz girin. Sunucu alanına **8811** yazmayı unutmayın.', image: CASTORA_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Mac App Store öffnen', description: 'App Store auf dem Mac starten.', image: CASTORA_IMAGES.store },
    { title: 'CASTORA suchen', description: 'Im App Store nach „CASTORA“ suchen.', image: CASTORA_IMAGES.search },
    { title: 'CASTORA installieren', description: 'Offizielle CASTORA App auswählen und laden.', image: CASTORA_IMAGES.find },
    { title: 'Installation abschließen', description: 'Nach dem Download die App öffnen.', image: CASTORA_IMAGES.install },
    { title: 'CASTORA starten', description: 'Über Launchpad oder Programme-Ordner öffnen.', image: CASTORA_IMAGES.open },
    { title: 'Xtream Zugangsdaten', description: 'Xtream Codes wählen. Name: beliebig. Benutzer und Passwort eingeben. Server/URL: **8811**.', image: CASTORA_IMAGES.login },
    { title: 'Anmelden', description: 'Login / Sign In / Add User tippen. Kanalliste wird geladen.', image: CASTORA_IMAGES.addUser },
    { title: 'Streaming starten', description: 'Live TV, Movies und Series auswählen.', image: CASTORA_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: 'CASTORA öffnen und die gesendeten Zugangsdaten eingeben. Server-Feld: **8811**.', image: CASTORA_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'violet');
}

const BUILDERS = {
  'next-plus': buildNextPlusSteps,
  castora: buildCastoraSteps,
};

export function buildMacAppSteps(isDe, appId = 'next-plus') {
  const build = BUILDERS[appId] || BUILDERS['next-plus'];
  return build(isDe);
}

/** Mac uygulama sayfaları admin mac_config adımlarını paylaştığı için yalnızca fallback kullanılır. */
export function resolveMacAppGuideSteps(_dbSteps, isDe, appId = 'next-plus') {
  return buildMacAppSteps(isDe, appId);
}
