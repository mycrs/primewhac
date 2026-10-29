/** Mac — IPTV Smarters Pro / GSE Smart IPTV kurulum fallback adımları */

export const MAC_VISUALS = [
  'store', 'search', 'install', 'app', 'xtream', 'login', 'login', 'watch',
];

const IMAGE_KEYS = ['store', 'search', 'install', 'open', 'xtream', 'login', 'submit', 'watch'];

const IMAGES = Object.fromEntries(
  IMAGE_KEYS.map((key) => [key, `/guides/mac/${key}.svg`]),
);

function mapSteps(steps) {
  return steps.map((step, index) => ({
    ...step,
    visual: MAC_VISUALS[index] || 'app',
    theme: 'apple',
  }));
}

export function buildMacSteps(isDe) {
  const tr = [
    { title: 'App Store\'u Açın', description: 'Mac bilgisayarınızda App Store uygulamasını açın.', image: IMAGES.store },
    { title: 'Uygulama Arayın', description: 'Arama çubuğuna \'IPTV Smarters Pro\' veya \'GSE Smart IPTV\' yazın.', image: IMAGES.search },
    { title: 'İndirin', description: 'Uygulamayı indirmek için \'Get\' veya bulut simgesine tıklayın.', image: IMAGES.install },
    { title: 'Uygulamayı Başlatın', description: 'Launchpad\'den veya Uygulamalar klasöründen indirdiğiniz uygulamayı açın.', image: IMAGES.open },
    { title: 'Xtream Codes Girişi', description: 'Giriş ekranında \'Xtream Codes API\' seçeneğini seçin.', image: IMAGES.xtream },
    { title: 'Bilgileri Girin', description: 'Size WhatsApp üzerinden iletilen kullanıcı adı, şifre ve sunucu URL adresini girin.', image: IMAGES.login },
    { title: 'Oturum Açın', description: 'Bilgileri kontrol ettikten sonra \'Login\' butonuna basın.', image: IMAGES.submit },
    { title: 'İyi Seyirler', description: 'Kurulum tamamlandı. Artık Mac bilgisayarınızdan tüm yayınları izleyebilirsiniz.', image: IMAGES.watch },
  ];

  const de = [
    { title: 'App Store öffnen', description: 'Öffnen Sie den App Store auf Ihrem Mac.', image: IMAGES.store },
    { title: 'App suchen', description: 'Suchen Sie nach „IPTV Smarters Pro“ oder „GSE Smart IPTV“.', image: IMAGES.search },
    { title: 'Installieren', description: 'Tippen Sie auf „Get“ oder das Cloud-Symbol.', image: IMAGES.install },
    { title: 'App starten', description: 'Über Launchpad oder den Programme-Ordner öffnen.', image: IMAGES.open },
    { title: 'Xtream Codes', description: 'Wählen Sie „Xtream Codes API“ auf dem Login-Bildschirm.', image: IMAGES.xtream },
    { title: 'Zugangsdaten', description: 'Benutzer, Passwort und Server-URL aus der WhatsApp-Nachricht eingeben.', image: IMAGES.login },
    { title: 'Anmelden', description: 'Daten prüfen und auf „Login“ tippen.', image: IMAGES.submit },
    { title: 'Viel Spaß', description: 'Jetzt alle Sender auf dem Mac streamen.', image: IMAGES.watch },
  ];

  return mapSteps(isDe ? de : tr);
}

export function resolveMacGuideSteps(dbSteps, isDe) {
  const fallback = buildMacSteps(isDe);
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
