/** Tablet — IBO Player Pro, ABC IPTV Player, VS Player */

export const TABLET_APP_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

const IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'add', 'watch', 'final'];

function tabletGuideImages(appSlug) {
  const stepKeys = ['store', 'search', 'find', 'install', 'open', 'login', 'addUser', 'watch', 'finalLogin'];
  return Object.fromEntries(
    stepKeys.map((key, index) => [key, `/guides/tablet/${appSlug}-${IMAGE_KEYS[index]}.svg`]),
  );
}

const IBO_IMAGES = tabletGuideImages('ibo');
const ABC_IMAGES = tabletGuideImages('abc');
const VS_IMAGES = tabletGuideImages('vs');

function mapSteps(steps, theme) {
  return steps.map((step, index) => ({
    ...step,
    visual: TABLET_APP_VISUALS[index] || 'app',
    theme,
  }));
}

function buildIboPlayerSteps(isDe) {
  const tr = [
    { title: 'App Store veya Play Store\'u Açın', description: 'iPad\'de App Store, Android tablette Google Play Store uygulamasını açın.', image: IBO_IMAGES.store },
    { title: 'IBO Player Pro Arayın', description: 'Arama alanına "IBO Player Pro" yazın.', image: IBO_IMAGES.search },
    { title: 'Uygulamayı Bulun', description: 'Resmi IBO Player Pro uygulamasını seçin.', image: IBO_IMAGES.find },
    { title: 'IBO Player Pro İndirin', description: 'Yükle / İndir butonuna basarak kurulumu başlatın.', image: IBO_IMAGES.install },
    { title: 'Uygulamayı Açın', description: 'Kurulum bitince uygulamayı başlatın ve gerekli izinleri onaylayın.', image: IBO_IMAGES.open },
    { title: 'Xtream veya M3U Ekleyin', description: 'Playlist ekleme veya Xtream Codes seçin. Sunucu, kullanıcı adı, şifre veya M3U URL girin.', image: IBO_IMAGES.login },
    { title: 'Bilgileri Kaydedin', description: 'Girdiğiniz bilgileri kontrol edip kaydedin. Kanal listesi birkaç dakika içinde indirilecektir.', image: IBO_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Yatay modda tam ekran; Live TV, Movies ve Series bölümlerinden izleyin.', image: IBO_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'IBO Player Pro\'yu açın. WhatsApp veya e-posta ile gönderdiğimiz Xtream veya M3U bilgilerini eksiksiz girin.', image: IBO_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'App Store oder Play Store öffnen', description: 'App Store (iPad) oder Google Play (Android-Tablet) öffnen.', image: IBO_IMAGES.store },
    { title: 'IBO Player Pro suchen', description: 'Nach „IBO Player Pro“ suchen.', image: IBO_IMAGES.search },
    { title: 'App finden', description: 'Offizielle IBO Player Pro App auswählen.', image: IBO_IMAGES.find },
    { title: 'Installieren', description: 'Installieren / Herunterladen tippen.', image: IBO_IMAGES.install },
    { title: 'App starten', description: 'Nach der Installation öffnen und Berechtigungen bestätigen.', image: IBO_IMAGES.open },
    { title: 'Xtream oder M3U hinzufügen', description: 'Xtream Codes oder M3U-URL eingeben.', image: IBO_IMAGES.login },
    { title: 'Speichern', description: 'Daten prüfen und speichern. Kanalliste wird geladen.', image: IBO_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Querformat für Vollbild; unter Live TV, Movies und Series streamen.', image: IBO_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: 'IBO Player Pro öffnen und die gesendeten Zugangsdaten eingeben.', image: IBO_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'emerald');
}

function buildAbcSteps(isDe) {
  const tr = [
    { title: 'App Store veya Play Store\'u Açın', description: 'iPad\'de App Store, Android tablette Google Play\'i açın.', image: ABC_IMAGES.store },
    { title: 'ABC IPTV Player Arayın', description: 'Arama alanına "ABC IPTV Player" yazın.', image: ABC_IMAGES.search },
    { title: 'Uygulamayı İndirin', description: 'Resmi ABC IPTV Player uygulamasını seçip yükleyin. Alternatif: abciptvplayer.com', image: ABC_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'İndirme bitince uygulamayı açın.', image: ABC_IMAGES.install },
    { title: 'ABC IPTV Player\'ı Açın', description: 'Ana ekrandan uygulamayı başlatın.', image: ABC_IMAGES.open },
    { title: 'M3U Playlist Ekleyin', description: 'Playlist alanına müşteri panelinizdeki M3U URL\'sini yapıştırın.', image: ABC_IMAGES.login },
    { title: 'Listeyi Yükleyin', description: 'Kaydet / Yükle butonuna basın. Kanallar birkaç dakika içinde gelir.', image: ABC_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Tabletinizi yatay çevirerek tam ekran izleyin.', image: ABC_IMAGES.watch },
    { title: 'Size Verilen M3U Linki', description: 'ABC IPTV Player\'ı açın. WhatsApp veya e-posta ile gönderdiğimiz M3U linkini eksiksiz girin.', image: ABC_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'App Store oder Play Store öffnen', description: 'App Store (iPad) oder Google Play (Android) öffnen.', image: ABC_IMAGES.store },
    { title: 'ABC IPTV Player suchen', description: 'Nach „ABC IPTV Player“ suchen.', image: ABC_IMAGES.search },
    { title: 'App installieren', description: 'Offizielle ABC IPTV Player App laden. Alternative: abciptvplayer.com', image: ABC_IMAGES.find },
    { title: 'Installation abschließen', description: 'Nach dem Download die App öffnen.', image: ABC_IMAGES.install },
    { title: 'App starten', description: 'Über den Startbildschirm öffnen.', image: ABC_IMAGES.open },
    { title: 'M3U-Playlist hinzufügen', description: 'M3U-URL aus dem Kundenpanel einfügen.', image: ABC_IMAGES.login },
    { title: 'Liste laden', description: 'Speichern / Laden tippen.', image: ABC_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Tablet quer drehen für Vollbild.', image: ABC_IMAGES.watch },
    { title: 'Mit unserem M3U-Link', description: 'ABC IPTV Player öffnen und den gesendeten M3U-Link eingeben.', image: ABC_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'rose');
}

function buildVsPlayerSteps(isDe) {
  const tr = [
    { title: 'Google Play Store\'u Açın', description: 'Android tablette Google Play Store uygulamasını açın.', image: VS_IMAGES.store },
    { title: 'VS Player Arayın', description: 'Arama alanına "VS Player" veya "Vstro Player" yazın.', image: VS_IMAGES.search },
    { title: 'VS Player İndirin', description: 'Resmi VS Player (Vstro) uygulamasını yükleyin.', image: VS_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'Yükleme bitince uygulamayı açın.', image: VS_IMAGES.install },
    { title: 'VS Player\'ı Başlatın', description: 'Gizlilik sözleşmesini onaylayın ve ana menüye girin.', image: VS_IMAGES.open },
    { title: 'Xtream veya Stalker Girişi', description: 'Xtream Codes API veya Stalker/MAC portal seçin. Sunucu, kullanıcı adı ve şifre girin.', image: VS_IMAGES.login },
    { title: 'Portal Bilgilerini Kaydedin', description: 'Giriş yapın veya Add User butonuna basın. Kanal listesi indirilecektir.', image: VS_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Live TV, Movies ve Series kategorilerinden içerik seçin.', image: VS_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'VS Player\'ı açın. WhatsApp veya e-posta ile gönderdiğimiz portal veya Xtream bilgilerini eksiksiz girin.', image: VS_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Google Play Store öffnen', description: 'Google Play auf dem Android-Tablet öffnen.', image: VS_IMAGES.store },
    { title: 'VS Player suchen', description: 'Nach „VS Player“ / „Vstro Player“ suchen.', image: VS_IMAGES.search },
    { title: 'VS Player installieren', description: 'Offizielle VS Player (Vstro) App laden.', image: VS_IMAGES.find },
    { title: 'Installation abschließen', description: 'Nach dem Download die App öffnen.', image: VS_IMAGES.install },
    { title: 'VS Player starten', description: 'Datenschutz bestätigen und Hauptmenü öffnen.', image: VS_IMAGES.open },
    { title: 'Xtream oder Stalker Login', description: 'Xtream Codes API oder Stalker/MAC-Portal wählen.', image: VS_IMAGES.login },
    { title: 'Portal speichern', description: 'Anmelden oder Add User tippen.', image: VS_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Live TV, Movies und Series auswählen.', image: VS_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: 'VS Player öffnen und die gesendeten Portal-/Xtream-Daten eingeben.', image: VS_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'cyan');
}

const BUILDERS = {
  'ibo-player': buildIboPlayerSteps,
  abc: buildAbcSteps,
  'vs-player': buildVsPlayerSteps,
};

export function buildTabletAppSteps(isDe, appId = 'ibo-player') {
  const build = BUILDERS[appId] || BUILDERS['ibo-player'];
  return build(isDe);
}

/** Tablet uygulama sayfaları admin tablet_config adımlarını paylaştığı için yalnızca fallback kullanılır. */
export function resolveTabletAppGuideSteps(_dbSteps, isDe, appId = 'ibo-player') {
  return buildTabletAppSteps(isDe, appId);
}
