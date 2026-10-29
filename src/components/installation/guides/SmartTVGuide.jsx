import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const ZERO_PLAYER_IMAGES = {
  store: '/guides/0player-store-open.svg',
  search: '/guides/0player-search.svg',
  install: '/guides/0player-install.svg',
  app: '/0player-ui-mock.svg',
  playlist: '/guides/0player-playlist.svg',
  channels: '/guides/0player-channels.svg',
  favorites: '/guides/0player-favorites.svg',
  watch: '/guides/0player-watch.svg',
};

const buildZeroPlayerSteps = (isDe) => {
  const tr = [
    { title: 'TV Mağazasını Açın', description: 'Samsung Smart Hub (Apps) veya LG Content Store\'u uzaktan kumandadan açın.', visual: 'store', image: ZERO_PLAYER_IMAGES.store },
    { title: '0 Player Uygulamasını Arayın', description: 'Arama alanına "0 Player" veya "Zero Player" yazın. Resmi site: 0player.com', visual: 'search', image: ZERO_PLAYER_IMAGES.search },
    { title: 'Uygulamayı Yükleyin', description: '0 Player\'ı seçip Yükle / Install butonuna basın. Kurulum birkaç saniye sürer.', visual: 'install', image: ZERO_PLAYER_IMAGES.install },
    { title: '0 Player\'ı Açın', description: 'Uygulamayı başlatın. Ana menüde Canlı TV, EPG ve VOD bölümlerini göreceksiniz.', visual: 'app', image: ZERO_PLAYER_IMAGES.app },
    { title: 'Playlist Ekleyin', description: 'M3U linki veya Xtream Codes (sunucu, kullanıcı adı, şifre) bilgilerinizi girin ve kaydedin.', visual: 'playlist', image: ZERO_PLAYER_IMAGES.playlist },
    { title: 'Kanalları Yükleyin', description: 'Liste otomatik oluşur. EPG birkaç dakika içinde dolabilir; bu normaldir.', visual: 'channels', image: ZERO_PLAYER_IMAGES.channels },
    { title: 'Favorileri Ayarlayın', description: 'Sık izlediğiniz kanalları favorilere ekleyerek hızlı erişim tanımlayın.', visual: 'favorites', image: ZERO_PLAYER_IMAGES.favorites },
    { title: 'İzlemeye Başlayın', description: 'Smart TV kurulumunuz tamamlandı. Canlı TV\'den dilediğiniz kanalı seçin.', visual: 'watch', image: ZERO_PLAYER_IMAGES.watch },
  ];
  const de = [
    { title: 'TV-Store öffnen', description: 'Öffnen Sie Samsung Smart Hub (Apps) oder LG Content Store mit der Fernbedienung.', visual: 'store', image: ZERO_PLAYER_IMAGES.store },
    { title: '0 Player suchen', description: 'Suchen Sie nach "0 Player" oder "Zero Player". Offizielle Seite: 0player.com', visual: 'search', image: ZERO_PLAYER_IMAGES.search },
    { title: 'App installieren', description: 'Wählen Sie 0 Player und tippen Sie auf Installieren. Die Installation dauert wenige Sekunden.', visual: 'install', image: ZERO_PLAYER_IMAGES.install },
    { title: '0 Player starten', description: 'Starten Sie die App. Im Hauptmenü finden Sie Live TV, EPG und VOD.', visual: 'app', image: ZERO_PLAYER_IMAGES.app },
    { title: 'Playlist hinzufügen', description: 'Geben Sie Ihre M3U-URL oder Xtream Codes (Server, Benutzer, Passwort) ein und speichern.', visual: 'playlist', image: ZERO_PLAYER_IMAGES.playlist },
    { title: 'Kanäle laden', description: 'Die Liste wird automatisch erstellt. EPG kann einige Minuten zum Laden brauchen.', visual: 'channels', image: ZERO_PLAYER_IMAGES.channels },
    { title: 'Favoriten setzen', description: 'Markieren Sie häufig genutzte Sender als Favoriten für schnellen Zugriff.', visual: 'favorites', image: ZERO_PLAYER_IMAGES.favorites },
    { title: 'Streaming starten', description: 'Die Smart-TV-Einrichtung ist abgeschlossen. Wählen Sie einen Sender unter Live TV.', visual: 'watch', image: ZERO_PLAYER_IMAGES.watch },
  ];
  return (isDe ? de : tr).map((step) => ({ ...step, theme: 'amber' }));
};

export const smartTvFallbackStepsTr = buildZeroPlayerSteps(false);
export const smartTvFallbackStepsDe = buildZeroPlayerSteps(true);

const SmartTVGuide = ({ dbData }) => (
  <InstallationGuideRenderer data={dbData} fallbackData={{ steps: smartTvFallbackStepsTr }} />
);

export default SmartTVGuide;
