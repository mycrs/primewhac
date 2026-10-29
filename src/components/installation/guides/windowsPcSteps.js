/** Windows PC — IPTV Smarters Pro / VLC kurulum fallback adımları */

export const WINDOWS_PC_VISUALS = [
  'app', 'download', 'install', 'install', 'xtream', 'login', 'channels', 'watch',
];

const IMAGE_KEYS = ['browser', 'download', 'installer', 'finish', 'xtream', 'login', 'load', 'watch'];
const STEP_IMAGE_KEYS = ['browser', 'download', 'installer', 'finish', 'xtream', 'login', 'load', 'watch'];

const IMAGES = Object.fromEntries(
  STEP_IMAGE_KEYS.map((key, index) => [key, `/guides/windows/${IMAGE_KEYS[index]}.svg`]),
);

function mapSteps(steps) {
  return steps.map((step, index) => ({
    ...step,
    visual: WINDOWS_PC_VISUALS[index] || 'app',
    theme: 'sky',
  }));
}

export function buildWindowsPcSteps(isDe) {
  const tr = [
    { title: 'Web Tarayıcısını Açın', description: 'Bilgisayarınızda Chrome, Edge veya Firefox tarayıcısını açın.', image: IMAGES.browser },
    { title: 'Uygulama İndirin', description: 'IPTV Smarters Pro PC sürümünü veya VLC Media Player\'ı resmi web sitesinden indirin.', image: IMAGES.download },
    { title: 'Kurulum Dosyasını Çalıştırın', description: 'İndirilen .exe uzantılı dosyaya çift tıklayın ve kurulum sihirbazını başlatın.', image: IMAGES.installer },
    { title: 'Kurulumu Tamamlayın', description: '\'Next\' butonlarına tıklayarak kurulumu tamamlayın ve \'Finish\' diyerek uygulamayı başlatın.', image: IMAGES.finish },
    { title: 'Giriş Yöntemi', description: 'Uygulama açıldığında \'Login with Xtream Codes API\' seçeneğini seçin. Bu en stabil yöntemdir.', image: IMAGES.xtream },
    { title: 'Bilgileri Girin', description: 'Size gönderilen kullanıcı adı, şifre ve URL bilgilerini ilgili alanlara yapıştırın.', image: IMAGES.login },
    { title: 'Kanalları Yükleyin', description: 'Giriş yaptıktan sonra kanalların ve içeriklerin yüklenmesini bekleyin. Bu işlem internet hızınıza göre 1-2 dakika sürebilir.', image: IMAGES.load },
    { title: 'İyi Seyirler', description: 'Sol menüden Live TV (Canlı Yayınlar) veya VOD (Filmler) seçerek izlemeye başlayabilirsiniz.', image: IMAGES.watch },
  ];

  const de = [
    { title: 'Webbrowser öffnen', description: 'Öffnen Sie Chrome, Edge oder Firefox auf Ihrem PC.', image: IMAGES.browser },
    { title: 'App herunterladen', description: 'Laden Sie IPTV Smarters Pro für PC oder VLC Media Player von der offiziellen Website.', image: IMAGES.download },
    { title: 'Setup starten', description: 'Doppelklicken Sie auf die .exe-Datei und starten Sie den Installationsassistenten.', image: IMAGES.installer },
    { title: 'Installation abschließen', description: 'Mit „Next“ fortfahren und mit „Finish“ die App starten.', image: IMAGES.finish },
    { title: 'Anmeldemethode', description: 'Wählen Sie „Login with Xtream Codes API“ — die stabilste Methode.', image: IMAGES.xtream },
    { title: 'Zugangsdaten eingeben', description: 'Benutzername, Passwort und URL aus unserer Nachricht einfügen.', image: IMAGES.login },
    { title: 'Kanäle laden', description: 'Nach dem Login auf den Import warten — je nach Internet 1–2 Minuten.', image: IMAGES.load },
    { title: 'Viel Spaß', description: 'Unter Live TV oder VOD streamen.', image: IMAGES.watch },
  ];

  return mapSteps(isDe ? de : tr);
}

export function resolveWindowsPcGuideSteps(dbSteps, isDe) {
  const fallback = buildWindowsPcSteps(isDe);
  if (!Array.isArray(dbSteps) || dbSteps.length === 0) return fallback;

  return dbSteps.map((step, index) => {
    const fb = fallback[index] || fallback[fallback.length - 1];
    return {
      title: step.title || fb.title,
      description: step.description || fb.description,
      image: step.image?.trim() || fb.image,
      visual: step.visual || fb.visual || 'app',
      theme: step.theme || fb.theme,
    };
  });
}
