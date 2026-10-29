/** Windows PC — IBO Player Pro, ABC IPTV Player, VS Player */

export const WINDOWS_APP_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

const IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'add', 'watch', 'final'];

function windowsGuideImages(appSlug) {
  const stepKeys = ['store', 'search', 'find', 'install', 'open', 'login', 'addUser', 'watch', 'finalLogin'];
  return Object.fromEntries(
    stepKeys.map((key, index) => [key, `/guides/windows/${appSlug}-${IMAGE_KEYS[index]}.svg`]),
  );
}

const IBO_IMAGES = windowsGuideImages('ibo');
const ABC_IMAGES = windowsGuideImages('abc');
const VS_IMAGES = windowsGuideImages('vs');

function mapSteps(steps, theme) {
  return steps.map((step, index) => ({
    ...step,
    visual: WINDOWS_APP_VISUALS[index] || 'app',
    theme,
  }));
}

function buildIboPlayerSteps(isDe) {
  const tr = [
    { title: 'Microsoft Store\'u Açın', description: 'Windows görev çubuğundan veya Başlat menüsünden Microsoft Store\'u başlatın.', image: IBO_IMAGES.store },
    { title: 'IBO Player Pro Arayın', description: 'Store arama alanına "IBO Player Pro" yazın.', image: IBO_IMAGES.search },
    { title: 'Uygulamayı Bulun', description: 'Resmi IBO Player Pro uygulamasını seçin (Geliştirici: IRBOETECH).', image: IBO_IMAGES.find },
    { title: 'IBO Player Pro İndirin', description: '"Al" / "Get" veya "Yükle" butonuna tıklayarak ücretsiz indirin.', image: IBO_IMAGES.install },
    { title: 'Uygulamayı Açın', description: 'Kurulum bitince Başlat menüsünden IBO Player Pro\'yu başlatın.', image: IBO_IMAGES.open },
    { title: 'Xtream veya M3U Ekleyin', description: 'Playlist ekleme veya Xtream Codes seçin. Sunucu, kullanıcı adı, şifre veya M3U URL girin.', image: IBO_IMAGES.login },
    { title: 'Bilgileri Kaydedin', description: 'Girdiğiniz bilgileri kontrol edip kaydedin. Kanal listesi birkaç dakika içinde indirilecektir.', image: IBO_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Live TV, Movies ve Series bölümlerinden içeriklere erişin.', image: IBO_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'IBO Player Pro\'yu açın. WhatsApp veya e-posta ile gönderdiğimiz Xtream veya M3U bilgilerini eksiksiz girin.', image: IBO_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Microsoft Store öffnen', description: 'Microsoft Store über die Taskleiste oder das Startmenü starten.', image: IBO_IMAGES.store },
    { title: 'IBO Player Pro suchen', description: 'Im Store nach „IBO Player Pro“ suchen.', image: IBO_IMAGES.search },
    { title: 'App finden', description: 'Offizielle IBO Player Pro App auswählen (Entwickler: IRBOETECH).', image: IBO_IMAGES.find },
    { title: 'Installieren', description: '„Herunterladen“ / „Get“ tippen und kostenlos installieren.', image: IBO_IMAGES.install },
    { title: 'App starten', description: 'Nach der Installation über das Startmenü öffnen.', image: IBO_IMAGES.open },
    { title: 'Xtream oder M3U hinzufügen', description: 'Xtream Codes oder M3U-URL eingeben — Server, Benutzer, Passwort.', image: IBO_IMAGES.login },
    { title: 'Speichern', description: 'Daten prüfen und speichern. Kanalliste wird geladen.', image: IBO_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Unter Live TV, Movies und Series streamen.', image: IBO_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: 'IBO Player Pro öffnen und die gesendeten Zugangsdaten eingeben.', image: IBO_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'emerald');
}

function buildAbcSteps(isDe) {
  const tr = [
    { title: 'Resmi Siteyi Açın', description: 'Tarayıcıdan abciptvplayer.com adresine gidin.', image: ABC_IMAGES.store },
    { title: 'Windows Sürümünü Bulun', description: 'Ana sayfada Windows indirme bölümünü bulun ve sürümü seçin.', image: ABC_IMAGES.search },
    { title: 'ABC IPTV Player İndirin', description: 'Windows kurulum dosyasını (.exe) indirin. Güvenilir kaynak: abciptvplayer.com', image: ABC_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'İndirilen dosyayı çalıştırın, ekrandaki adımları izleyerek kurulumu bitirin.', image: ABC_IMAGES.install },
    { title: 'ABC IPTV Player\'ı Açın', description: 'Masaüstü kısayolundan veya Başlat menüsünden uygulamayı başlatın.', image: ABC_IMAGES.open },
    { title: 'M3U Playlist Ekleyin', description: 'Playlist ekleme alanına müşteri panelinizdeki M3U URL\'sini yapıştırın.', image: ABC_IMAGES.login },
    { title: 'Listeyi Yükleyin', description: 'Kaydet / Yükle butonuna basın. Kanallar birkaç dakika içinde gelir.', image: ABC_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Kanal listesinden canlı yayın, film ve dizi içeriklerine erişin.', image: ABC_IMAGES.watch },
    { title: 'Size Verilen M3U Linki', description: 'ABC IPTV Player\'ı açın. WhatsApp veya e-posta ile gönderdiğimiz M3U linkini eksiksiz girin.', image: ABC_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Offizielle Website öffnen', description: 'Im Browser abciptvplayer.com aufrufen.', image: ABC_IMAGES.store },
    { title: 'Windows-Version finden', description: 'Windows-Download-Bereich auf der Startseite suchen.', image: ABC_IMAGES.search },
    { title: 'ABC IPTV Player herunterladen', description: 'Windows-Installationsdatei (.exe) von abciptvplayer.com laden.', image: ABC_IMAGES.find },
    { title: 'Installation abschließen', description: 'Setup ausführen und Anweisungen folgen.', image: ABC_IMAGES.install },
    { title: 'App starten', description: 'Über Desktop-Verknüpfung oder Startmenü öffnen.', image: ABC_IMAGES.open },
    { title: 'M3U-Playlist hinzufügen', description: 'M3U-URL aus dem Kundenpanel einfügen.', image: ABC_IMAGES.login },
    { title: 'Liste laden', description: 'Speichern / Laden tippen. Kanäle werden geladen.', image: ABC_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Kanäle, Filme und Serien auswählen.', image: ABC_IMAGES.watch },
    { title: 'Mit unserem M3U-Link', description: 'ABC IPTV Player öffnen und den gesendeten M3U-Link eingeben.', image: ABC_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'rose');
}

function buildVsPlayerSteps(isDe) {
  const tr = [
    { title: 'Android Emülatör Kurun', description: 'Windows\'ta BlueStacks veya Nox Player gibi bir Android emülatörü indirip kurun.', image: VS_IMAGES.store },
    { title: 'VS Player Arayın', description: 'Emülatör içindeki Play Store\'da "VS Player" veya "Vstro Player" arayın.', image: VS_IMAGES.search },
    { title: 'VS Player İndirin', description: 'Resmi VS Player (Vstro) uygulamasını yükleyin.', image: VS_IMAGES.find },
    { title: 'Kurulumu Tamamlayın', description: 'Yükleme bitince uygulamayı emülatör ana ekranından açın.', image: VS_IMAGES.install },
    { title: 'VS Player\'ı Başlatın', description: 'Gizlilik sözleşmesini onaylayın ve ana menüye girin.', image: VS_IMAGES.open },
    { title: 'Xtream veya Stalker Girişi', description: 'Xtream Codes API veya Stalker/MAC portal seçin. Sunucu, kullanıcı adı ve şifre girin.', image: VS_IMAGES.login },
    { title: 'Portal Bilgilerini Kaydedin', description: 'Giriş yapın veya Add User butonuna basın. Kanal listesi indirilecektir.', image: VS_IMAGES.addUser },
    { title: 'Canlı TV ve VOD', description: 'Live TV, Movies ve Series kategorilerinden içerik seçin.', image: VS_IMAGES.watch },
    { title: 'Size Verilen Bilgilerle Giriş', description: 'VS Player\'ı açın. WhatsApp veya e-posta ile gönderdiğimiz portal veya Xtream bilgilerini eksiksiz girin.', image: VS_IMAGES.finalLogin },
  ];

  const de = [
    { title: 'Android-Emulator installieren', description: 'BlueStacks oder Nox Player auf Windows installieren.', image: VS_IMAGES.store },
    { title: 'VS Player suchen', description: 'Im Play Store des Emulators nach „VS Player“ / „Vstro Player“ suchen.', image: VS_IMAGES.search },
    { title: 'VS Player installieren', description: 'Offizielle VS Player (Vstro) App laden.', image: VS_IMAGES.find },
    { title: 'Installation abschließen', description: 'Nach dem Download die App im Emulator öffnen.', image: VS_IMAGES.install },
    { title: 'VS Player starten', description: 'Datenschutz bestätigen und Hauptmenü öffnen.', image: VS_IMAGES.open },
    { title: 'Xtream oder Stalker Login', description: 'Xtream Codes API oder Stalker/MAC-Portal wählen. Zugangsdaten eingeben.', image: VS_IMAGES.login },
    { title: 'Portal speichern', description: 'Anmelden oder Add User tippen. Kanalliste wird geladen.', image: VS_IMAGES.addUser },
    { title: 'Live TV & VOD', description: 'Live TV, Movies und Series auswählen.', image: VS_IMAGES.watch },
    { title: 'Mit unseren Daten anmelden', description: 'VS Player öffnen und die gesendeten Portal- oder Xtream-Daten eingeben.', image: VS_IMAGES.finalLogin },
  ];

  return mapSteps(isDe ? de : tr, 'cyan');
}

const BUILDERS = {
  'ibo-player': buildIboPlayerSteps,
  abc: buildAbcSteps,
  'vs-player': buildVsPlayerSteps,
};

export function buildWindowsAppSteps(isDe, appId = 'ibo-player') {
  const build = BUILDERS[appId] || BUILDERS['ibo-player'];
  return build(isDe);
}

/** Windows uygulama sayfaları admin windows_pc_config adımlarını paylaştığı için yalnızca fallback kullanılır. */
export function resolveWindowsAppGuideSteps(_dbSteps, isDe, appId = 'ibo-player') {
  return buildWindowsAppSteps(isDe, appId);
}
