/** Qruze Player — Android TV & Android Telefon kurulum fallback adımları (APK — Play Store'da yok) */

export const QRUZE_PLAYER_VISUALS = [
  'store', 'search', 'search', 'install', 'app', 'xtream', 'addUser', 'watch', 'login',
];

const ANDROID_IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'add', 'watch', 'final'];
const ANDROID_STEP_IMAGE_KEYS = ['store', 'search', 'find', 'install', 'open', 'login', 'addUser', 'watch', 'finalLogin'];

export function qruzeGuideImages(device = 'tv') {
  const prefix = device === 'phone' ? 'qruze-phone' : 'qruze-tv';
  return Object.fromEntries(
    ANDROID_STEP_IMAGE_KEYS.map((key, index) => [
      key,
      `/guides/android/${prefix}-${ANDROID_IMAGE_KEYS[index]}.svg`,
    ]),
  );
}

export function buildQruzePlayerSteps(isDe, { device = 'tv' } = {}) {
  const isPhone = device === 'phone';
  const IMAGES = qruzeGuideImages(device);

  const tr = isPhone
    ? [
        {
          title: 'APK İndirme Linkini Açın',
          description: 'Size WhatsApp veya e-posta ile gönderilen Qruze Player APK indirme linkini telefonunuzun tarayıcısında açın.',
          image: IMAGES.store,
        },
        {
          title: 'APK Dosyasını İndirin',
          description: 'Linke tıkladıktan sonra indirmeyi onaylayın. Dosya genellikle İndirilenler klasörüne kaydedilir.',
          image: IMAGES.search,
        },
        {
          title: 'Bilinmeyen Kaynaklara İzin Verin',
          description: 'Gerekirse Ayarlar > Güvenlik bölümünden bilinmeyen kaynaklardan uygulama yüklemeye izin verin.',
          image: IMAGES.find,
        },
        {
          title: 'APK Kurulumunu Başlatın',
          description: 'İndirilen Qruze Player APK dosyasına dokunun ve "Yükle" / "Kur" butonuna basın.',
          image: IMAGES.install,
        },
        {
          title: 'Qruze Player\'ı Açın',
          description: 'Kurulum bitince uygulamayı başlatın. Gerekli izinleri onaylayın.',
          image: IMAGES.open,
        },
        {
          title: 'Giriş Bilgilerini Girin',
          description: 'M3U linki veya Xtream Codes (sunucu, kullanıcı adı, şifre) bilgilerinizi ilgili alanlara girin.',
          image: IMAGES.login,
        },
        {
          title: 'Kullanıcıyı Ekleyin',
          description: "Bilgileri kaydedin ve 'Add User' / 'Login' butonuna basın. Kanal listesi indirilecektir.",
          image: IMAGES.addUser,
        },
        {
          title: 'İzlemeye Başlayın',
          description: 'Profilinize tıklayın. Canlı kanallar, filmler ve diziler otomatik olarak yüklenecektir.',
          image: IMAGES.watch,
        },
        {
          title: 'Uygulamayı Açın ve Giriş Yapın',
          description: 'Qruze Player\'ı açın. Size verdiğimiz giriş bilgileri (kullanıcı adı, şifre, sunucu URL) ile giriş yapın. WhatsApp veya e-posta ile gönderilen bilgileri eksiksiz girin.',
          image: IMAGES.finalLogin,
        },
      ]
    : [
        {
          title: 'Downloader Uygulamasını İndirin',
          description: 'Android TV veya Fire TV\'de uygulama mağazasından "Downloader by AFTVnews" uygulamasını arayıp yükleyin.',
          image: IMAGES.store,
        },
        {
          title: 'Downloader\'ı Açın',
          description: 'Downloader uygulamasını başlatın. Fire TV Stick kullanıyorsanız önce Ayarlar > Geliştirici seçenekleri > Bilinmeyen uygulamalar için Downloader\'a izin verin.',
          image: IMAGES.search,
        },
        {
          title: 'APK Linkini Girin',
          description: 'URL alanına size WhatsApp veya e-posta ile gönderilen Qruze Player APK indirme linkini eksiksiz yazın ve Go / İndir\'e basın.',
          image: IMAGES.find,
        },
        {
          title: 'APK\'yı Yükleyin',
          description: 'İndirme tamamlanınca kurulum ekranı açılır. "Yükle" / Install butonuna basarak Qruze Player\'ı kurun.',
          image: IMAGES.install,
        },
        {
          title: 'Qruze Player\'ı Açın',
          description: 'Kurulum bitince uygulamayı başlatın. Gerekli izinleri onaylayın.',
          image: IMAGES.open,
        },
        {
          title: 'Giriş Bilgilerini Girin',
          description: 'M3U linki veya Xtream Codes (sunucu, kullanıcı adı, şifre) bilgilerinizi ilgili alanlara girin.',
          image: IMAGES.login,
        },
        {
          title: 'Kullanıcıyı Ekleyin',
          description: "Bilgileri kaydedin ve 'Add User' / 'Login' butonuna basın. Kanal listesi indirilecektir.",
          image: IMAGES.addUser,
        },
        {
          title: 'İzlemeye Başlayın',
          description: 'Profilinize tıklayın. Canlı kanallar, filmler ve diziler otomatik olarak yüklenecektir.',
          image: IMAGES.watch,
        },
        {
          title: 'Uygulamayı Açın ve Giriş Yapın',
          description: 'Qruze Player\'ı açın. Size verdiğimiz giriş bilgileri (kullanıcı adı, şifre, sunucu URL) ile giriş yapın. WhatsApp veya e-posta ile gönderilen bilgileri eksiksiz girin.',
          image: IMAGES.finalLogin,
        },
      ];

  const de = isPhone
    ? [
        { title: 'APK-Download-Link öffnen', description: 'Öffnen Sie den per WhatsApp oder E-Mail gesendeten Qruze Player APK-Link im Browser Ihres Smartphones.', image: IMAGES.store },
        { title: 'APK herunterladen', description: 'Bestätigen Sie den Download. Die Datei landet meist im Ordner „Downloads“.', image: IMAGES.search },
        { title: 'Unbekannte Quellen erlauben', description: 'Falls nötig: Einstellungen > Sicherheit > Installation aus unbekannten Quellen erlauben.', image: IMAGES.find },
        { title: 'APK installieren', description: 'Tippen Sie auf die heruntergeladene Qruze Player APK und bestätigen Sie mit Installieren.', image: IMAGES.install },
        { title: 'App starten', description: 'Nach der Installation Qruze Player öffnen und Berechtigungen bestätigen.', image: IMAGES.open },
        { title: 'Zugangsdaten eingeben', description: 'M3U-Link oder Xtream Codes (Server, Benutzer, Passwort) eingeben.', image: IMAGES.login },
        { title: 'Benutzer hinzufügen', description: 'Speichern und Add User / Login tippen. Die Kanalliste wird geladen.', image: IMAGES.addUser },
        { title: 'Streaming starten', description: 'Profil auswählen — Live-Kanäle, Filme und Serien werden geladen.', image: IMAGES.watch },
        { title: 'App öffnen und anmelden', description: 'Qruze Player öffnen und mit den gesendeten Zugangsdaten anmelden (Benutzer, Passwort, Server-URL).', image: IMAGES.finalLogin },
      ]
    : [
        { title: 'Downloader installieren', description: 'Im App Store Ihres Android TV oder Fire TV nach „Downloader by AFTVnews“ suchen und installieren.', image: IMAGES.store },
        { title: 'Downloader öffnen', description: 'Downloader starten. Fire TV Stick: Entwickleroptionen > Unbekannte Apps für Downloader erlauben.', image: IMAGES.search },
        { title: 'APK-Link eingeben', description: 'Den per WhatsApp/E-Mail gesendeten Qruze Player APK-Link in die URL-Zeile einfügen und Go tippen.', image: IMAGES.find },
        { title: 'APK installieren', description: 'Nach dem Download Installieren bestätigen, um Qruze Player zu installieren.', image: IMAGES.install },
        { title: 'App starten', description: 'Qruze Player öffnen und Berechtigungen bestätigen.', image: IMAGES.open },
        { title: 'Zugangsdaten eingeben', description: 'M3U-Link oder Xtream Codes eingeben.', image: IMAGES.login },
        { title: 'Benutzer hinzufügen', description: 'Speichern und Add User / Login — Kanalliste laden.', image: IMAGES.addUser },
        { title: 'Streaming starten', description: 'Profil wählen — Inhalte werden automatisch geladen.', image: IMAGES.watch },
        { title: 'App öffnen und anmelden', description: 'Mit den gesendeten Zugangsdaten anmelden (Benutzer, Passwort, Server-URL).', image: IMAGES.finalLogin },
      ];

  const theme = isPhone ? 'red' : 'green';

  return (isDe ? de : tr).map((step, index) => ({
    ...step,
    visual: QRUZE_PLAYER_VISUALS[index] || 'app',
    theme,
  }));
}

export function resolveQruzePlayerGuideSteps(dbSteps, isDe, options = {}) {
  if (Array.isArray(dbSteps) && dbSteps.length > 0) {
    const theme = options.device === 'phone' ? 'red' : 'green';
    return dbSteps.map((step) => ({
      title: step.title || '',
      description: step.description || step.content || '',
      image: step.image?.trim() || '',
      visual: step.visual || 'app',
      theme: step.theme || theme,
    }));
  }
  return buildQruzePlayerSteps(isDe, options);
}
