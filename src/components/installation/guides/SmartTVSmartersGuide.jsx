import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const SMARTERS_IMAGES = {
  store: '/guides/smarters-store-open.svg',
  search: '/guides/smarters-search.svg',
  install: '/guides/smarters-install.svg',
  xtream: '/guides/smarters-xtream.svg',
  m3u: '/guides/smarters-m3u.svg',
  addUser: '/guides/smarters-add-user.svg',
  livetv: '/guides/smarters-livetv.svg',
  watch: '/guides/smarters-watch.svg',
};

const buildSmartersSteps = (isDe) => {
  const tr = [
    { title: 'TV Mağazasını Açın', description: 'Samsung Smart Hub (Apps) veya LG Content Store\'u açın.', visual: 'store', image: SMARTERS_IMAGES.store },
    { title: 'IPTV Smarters Pro Arayın', description: 'Arama alanına "IPTV Smarters Pro" yazın. Samsung ve LG mağazalarında listelenir.', visual: 'search', image: SMARTERS_IMAGES.search },
    { title: 'Uygulamayı Yükleyin', description: 'IPTV Smarters Pro\'yu seçip Yükle butonuna basın.', visual: 'install', image: SMARTERS_IMAGES.install },
    { title: 'Xtream Codes ile Giriş', description: '"Login with Xtream Codes API" seçeneğini seçin. Sunucu, kullanıcı adı ve şifrenizi girin.', visual: 'xtream', image: SMARTERS_IMAGES.xtream },
    { title: 'M3U ile Giriş (Alternatif)', description: 'M3U linkiniz varsa "Load Your Playlist or File URL" ile linki yapıştırabilirsiniz.', visual: 'm3u', image: SMARTERS_IMAGES.m3u },
    { title: 'Kullanıcı Ekleyin', description: 'Bilgileri kaydedin ve "Add User" / giriş butonuna basın. Kanal listesi indirilecektir.', visual: 'addUser', image: SMARTERS_IMAGES.addUser },
    { title: 'Live TV\'ye Geçin', description: 'Ana menüden Live TV bölümüne girerek kanallarınızı kontrol edin.', visual: 'livetv', image: SMARTERS_IMAGES.livetv },
    { title: 'İzlemeye Başlayın', description: 'Kurulum tamamlandı. EPG ve VOD aboneliğinize bağlı olarak görünür.', visual: 'watch', image: SMARTERS_IMAGES.watch },
  ];
  const de = [
    { title: 'TV-Store öffnen', description: 'Öffnen Sie Samsung Smart Hub (Apps) oder LG Content Store.', visual: 'store', image: SMARTERS_IMAGES.store },
    { title: 'IPTV Smarters Pro suchen', description: 'Suchen Sie nach „IPTV Smarters Pro“ im Samsung- oder LG-Store.', visual: 'search', image: SMARTERS_IMAGES.search },
    { title: 'App installieren', description: 'Wählen Sie IPTV Smarters Pro und tippen Sie auf Installieren.', visual: 'install', image: SMARTERS_IMAGES.install },
    { title: 'Mit Xtream Codes anmelden', description: 'Wählen Sie „Login with Xtream Codes API“ und geben Sie Server, Benutzer und Passwort ein.', visual: 'xtream', image: SMARTERS_IMAGES.xtream },
    { title: 'M3U-Login (Alternative)', description: 'Mit M3U-Link: „Load Your Playlist or File URL“ und Link einfügen.', visual: 'm3u', image: SMARTERS_IMAGES.m3u },
    { title: 'Benutzer hinzufügen', description: 'Speichern und „Add User“ / Login tippen. Die Kanalliste wird geladen.', visual: 'addUser', image: SMARTERS_IMAGES.addUser },
    { title: 'Live TV öffnen', description: 'Wechseln Sie im Hauptmenü zu Live TV und prüfen Sie die Kanäle.', visual: 'livetv', image: SMARTERS_IMAGES.livetv },
    { title: 'Streaming starten', description: 'Einrichtung abgeschlossen. EPG und VOD hängen von Ihrem Abo ab.', visual: 'watch', image: SMARTERS_IMAGES.watch },
  ];
  return (isDe ? de : tr).map((step) => ({ ...step, theme: 'violet' }));
};

export const smartersFallbackStepsTr = buildSmartersSteps(false);
export const smartersFallbackStepsDe = buildSmartersSteps(true);

const SmartTVSmartersGuide = ({ dbData, isDe }) => (
  <InstallationGuideRenderer data={dbData} fallbackData={{ steps: isDe ? smartersFallbackStepsDe : smartersFallbackStepsTr }} />
);

export default SmartTVSmartersGuide;
