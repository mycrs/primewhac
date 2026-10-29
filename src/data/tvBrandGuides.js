const t = (tr, de) => ({ tr, de });

const commonTroubleshooting = [
  {
    title: t('Uygulama mağazada görünmüyor', 'App wird im Store nicht angezeigt'),
    text: t(
      'TV modelini, yazılım sürümünü ve hizmet bölgesini kontrol edin. Uygulama desteği model ve ülkeye göre değişebilir.',
      'Prüfen Sie TV-Modell, Softwareversion und Serviceregion. Die App-Verfügbarkeit kann je nach Modell und Land variieren.',
    ),
  },
  {
    title: t('Liste yükleniyor ama yayın açılmıyor', 'Liste lädt, aber der Stream startet nicht'),
    text: t(
      'Aynı hesabı başka cihazda kapatın, TV ile modemi yeniden başlatın ve mümkünse Ethernet veya 5 GHz Wi‑Fi deneyin.',
      'Schließen Sie denselben Zugang auf anderen Geräten, starten Sie TV und Router neu und testen Sie möglichst Ethernet oder 5-GHz-WLAN.',
    ),
  },
  {
    title: t('Görüntü donuyor', 'Bild friert ein'),
    text: t(
      'Önce farklı bir kanalı deneyin. Sorun tüm kanallardaysa ağ bağlantısını; tek kanaldaysa yayın kaynağını destek ekibine bildirin.',
      'Testen Sie zuerst einen anderen Sender. Betrifft es alle Sender, prüfen Sie die Verbindung; betrifft es nur einen, melden Sie die Quelle dem Support.',
    ),
  },
  {
    title: t('Giriş bilgileri kabul edilmiyor', 'Zugangsdaten werden abgelehnt'),
    text: t(
      'Sunucu adresi, kullanıcı adı ve şifreyi boşluk bırakmadan girin. M3U ile Xtream alanlarını birbirine karıştırmayın.',
      'Geben Sie Serveradresse, Benutzername und Passwort ohne Leerzeichen ein. Verwechseln Sie M3U- und Xtream-Felder nicht.',
    ),
  },
];

const commonFaqs = (brand) => [
  {
    q: t(`${brand} TV’ye her IPTV uygulaması yüklenir mi?`, `Lässt sich jede IPTV-App auf einem ${brand} TV installieren?`),
    a: t(
      'Hayır. Yalnızca TV’nin işletim sistemi, modeli ve mağaza bölgesiyle uyumlu uygulamalar yüklenebilir. Mağazada görünmeyen bir uygulamayı destekleniyor kabul etmeyin.',
      'Nein. Installierbar sind nur Apps, die Betriebssystem, Modell und Store-Region unterstützen. Eine nicht gelistete App sollte nicht als kompatibel gelten.',
    ),
  },
  {
    q: t('IPTV uygulaması kanal sağlar mı?', 'Liefert eine IPTV-App selbst Sender?'),
    a: t(
      'Genellikle hayır. Oynatıcı uygulama ile yasal yayın aboneliği veya oynatma listeniz ayrı ürünlerdir.',
      'In der Regel nicht. Player-App und rechtmäßiges Abonnement beziehungsweise Playlist sind getrennte Produkte.',
    ),
  },
  {
    q: t('M3U mu, Xtream Codes mu seçmeliyim?', 'Soll ich M3U oder Xtream Codes wählen?'),
    a: t(
      'Sağlayıcınız hangi biçimi verdiyse onu seçin. Sunucu, kullanıcı adı ve şifre ayrı geldiyse çoğunlukla Xtream; tek uzun bağlantı geldiyse M3U kullanılır.',
      'Wählen Sie das Format Ihres Anbieters. Separate Server-, Benutzer- und Passwortdaten sprechen meist für Xtream; ein einzelner langer Link für M3U.',
    ),
  },
  {
    q: t('Uygulama mağazada yoksa ne yapmalıyım?', 'Was tun, wenn die App nicht im Store ist?'),
    a: t(
      'Model ve bölge uyumluluğunu kontrol edin. Desteklenmiyorsa rastgele dosya yüklemek yerine sertifikalı bir Google TV, Android TV veya Apple TV cihazı kullanın.',
      'Prüfen Sie Modell- und Regionskompatibilität. Nutzen Sie bei fehlender Unterstützung lieber ein zertifiziertes Google-TV-, Android-TV- oder Apple-TV-Gerät statt unbekannter Installationsdateien.',
    ),
  },
];

const makeHowTo = (brand, storeName) => [
  {
    name: t('İşletim sistemini belirleyin', 'Betriebssystem bestimmen'),
    text: t(
      `${brand} TV’nin ana ekranını veya Ayarlar > Destek/Cihaz Hakkında bölümünü açın; görünen işletim sistemi ve model kodunu not edin.`,
      `Öffnen Sie den Startbildschirm oder Einstellungen > Support/Geräteinfo des ${brand} TV und notieren Sie Betriebssystem sowie Modellcode.`,
    ),
  },
  {
    name: t('Ağ ve yazılımı kontrol edin', 'Netzwerk und Software prüfen'),
    text: t(
      'TV’yi internete bağlayın, tarih/saat ayarını doğrulayın ve mevcut sistem güncellemelerini kurun.',
      'Verbinden Sie den TV mit dem Internet, prüfen Sie Datum/Uhrzeit und installieren Sie verfügbare Systemupdates.',
    ),
  },
  {
    name: t('Uyumlu oynatıcıyı resmî mağazada arayın', 'Kompatiblen Player im offiziellen Store suchen'),
    text: t(
      `${storeName} içinde abonelik sağlayıcınızın önerdiği, TV modelinizle uyumlu IPTV veya medya oynatıcısını tam adıyla arayın.`,
      `Suchen Sie im ${storeName} den von Ihrem Anbieter empfohlenen und mit Ihrem TV-Modell kompatiblen IPTV- oder Media-Player unter seinem exakten Namen.`,
    ),
  },
  {
    name: t('Abonelik biçimini doğru ekleyin', 'Zugangsformat korrekt hinzufügen'),
    text: t(
      'Uygulamada M3U URL veya Xtream Codes seçeneğini açın; yalnızca yasal aboneliğinize ait bilgileri boşluksuz girin.',
      'Öffnen Sie in der App M3U URL oder Xtream Codes und geben Sie ausschließlich die Daten Ihres rechtmäßigen Abonnements ohne zusätzliche Leerzeichen ein.',
    ),
  },
  {
    name: t('Yayını test edin ve ana ekrana sabitleyin', 'Stream testen und App anheften'),
    text: t(
      'Canlı bir kanalı 2–3 dakika test edin, ses ve görüntüyü kontrol edin; sorunsuzsa uygulamayı ana ekrana ekleyin.',
      'Testen Sie einen Live-Sender zwei bis drei Minuten, prüfen Sie Ton und Bild und heften Sie die App anschließend an den Startbildschirm.',
    ),
  },
];

export const TV_BRAND_GUIDES = {
  'samsung-tv-iptv': {
    slug: 'samsung-tv-iptv',
    brand: 'Samsung',
    accent: 'from-blue-500 to-cyan-400',
    accentText: 'text-cyan-300',
    accentBg: 'bg-cyan-400/10',
    title: t('Samsung TV’de IPTV Nasıl Kullanılır?', 'IPTV auf Samsung TV einrichten'),
    metaTitle: t('Samsung TV’de IPTV Nasıl Kullanılır? | QruzeTV', 'IPTV auf Samsung TV einrichten – Anleitung | QruzeTV'),
    metaDescription: t(
      'Samsung Smart TV’de IPTV kurulumu: Tizen ve Smart Hub’da Bob Player (Bob IPTV) veya IPTV Smarters Pro seçimi, M3U/Xtream ve sorun çözümü.',
      'IPTV auf Samsung Smart TV: Bob Player (Bob IPTV) oder IPTV Smarters Pro im Tizen/Smart Hub wählen, M3U/Xtream einrichten und Fehler lösen.',
    ),
    summary: t(
      'Samsung TV’de IPTV kullanmak için Home > Uygulamalar bölümünden modelinize uygun oynatıcıyı yükleyin, yasal aboneliğinizin M3U veya Xtream bilgilerini girin ve yayını test edin. Uygulama görünmüyorsa model ve bölge desteğini kontrol edin.',
      'Öffnen Sie auf dem Samsung TV Home > Apps, installieren Sie einen kompatiblen Player, tragen Sie M3U- oder Xtream-Daten Ihres rechtmäßigen Abonnements ein und testen Sie den Stream. Fehlt die App, prüfen Sie Modell und Region.',
    ),
    intro: t(
      'Samsung’un güncel Smart TV modelleri Smart Hub üzerinden uygulama kurar. Menü adları model yılına göre değişse de güvenli yol her zaman TV’nin kendi uygulama mağazasıdır.',
      'Aktuelle Samsung Smart TVs installieren Apps über den Smart Hub. Menünamen unterscheiden sich je nach Modelljahr; der sichere Weg bleibt der offizielle TV-App-Store.',
    ),
    storeName: 'Samsung Apps / Smart Hub',
    systems: [
      {
        id: 'tizen',
        label: t('Smart Hub / Apps var', 'Smart Hub / Apps vorhanden'),
        clue: t('Kumandada Home tuşu ve ana ekranda Uygulamalar bölümü görünüyor.', 'Home-Taste und Apps-Bereich sind auf dem Startbildschirm sichtbar.'),
        verdict: t('Doğrudan TV’ye kurulum', 'Direkte Installation auf dem TV'),
        method: t(
          'Home > Uygulamalar > Ara yolunu izleyin. Önerilen oynatıcıyı tam adıyla arayıp Yükle ve ardından Ana Ekrana Ekle seçeneklerini kullanın.',
          'Öffnen Sie Home > Apps > Suche. Suchen Sie den empfohlenen Player unter dem exakten Namen, wählen Sie Installieren und anschließend Zum Startbildschirm hinzufügen.',
        ),
      },
      {
        id: 'legacy',
        label: t('Apps yok veya çok sınırlı', 'Apps fehlen oder sind stark eingeschränkt'),
        clue: t('Eski model, mağaza açılmıyor ya da gerekli uygulama aramada bulunmuyor.', 'Älteres Modell, Store öffnet nicht oder die benötigte App fehlt in der Suche.'),
        verdict: t('Harici cihaz daha güvenilir', 'Externes Gerät ist zuverlässiger'),
        method: t(
          'Model kodu ve yazılım güncellemesini kontrol edin. Uygulama hâlâ yoksa HDMI üzerinden sertifikalı bir Google TV/Android TV veya Apple TV cihazı bağlayın.',
          'Prüfen Sie Modellcode und Softwareupdate. Bleibt die App unsichtbar, schließen Sie per HDMI ein zertifiziertes Google-TV-/Android-TV- oder Apple-TV-Gerät an.',
        ),
      },
    ],
    howToSteps: makeHowTo('Samsung', 'Samsung Apps / Smart Hub'),
    troubleshooting: commonTroubleshooting,
    faqs: commonFaqs('Samsung'),
    sources: [
      {
        label: t('Samsung Türkiye: TV’ye uygulama yükleme', 'Samsung Deutschland: Apps installieren'),
        url: t(
          'https://www.samsung.com/tr/support/tv-audio-video/how-can-i-download-apps-to-samsung-tv/',
          'https://www.samsung.com/de/support/tv-audio-video/apps-installieren-und-loeschen/',
        ),
      },
    ],
  },
  'lg-tv-iptv': {
    slug: 'lg-tv-iptv',
    brand: 'LG',
    accent: 'from-fuchsia-600 to-rose-500',
    accentText: 'text-rose-300',
    accentBg: 'bg-rose-400/10',
    title: t('LG TV’de IPTV Nasıl Kullanılır?', 'IPTV auf LG TV einrichten'),
    metaTitle: t('LG TV’de IPTV Nasıl Kullanılır? webOS Rehberi | QruzeTV', 'IPTV auf LG TV einrichten – webOS Anleitung | QruzeTV'),
    metaDescription: t(
      'LG webOS TV’de IPTV kurulumu: LG Content Store’da Bob Player (Bob IPTV) veya IPTV Smarters Pro seçimi, M3U/Xtream ve çözüm adımları.',
      'IPTV auf LG webOS TV: Bob Player (Bob IPTV) oder IPTV Smarters Pro im LG Content Store, M3U/Xtream-Zugang und Fehlerbehebung.',
    ),
    summary: t(
      'LG webOS TV’de Home > Apps veya LG Content Store’u açın, model ve bölgenizde bulunan uyumlu oynatıcıyı yükleyin, M3U ya da Xtream bilgilerinizi ekleyin. Aradığınız uygulama çıkmıyorsa webOS sürümü ile LG Hizmet Ülkesi ayarını kontrol edin.',
      'Öffnen Sie auf dem LG webOS TV Home > Apps beziehungsweise den LG Content Store, installieren Sie einen für Modell und Region verfügbaren Player und fügen Sie M3U- oder Xtream-Daten hinzu. Prüfen Sie bei fehlender App webOS-Version und LG-Serviceland.',
    ),
    intro: t(
      'LG Smart TV’ler telefonlardaki Android uygulamalarını değil, webOS için yayımlanan TV uygulamalarını çalıştırır. Bu nedenle mağaza araması uyumluluk için temel kontroldür.',
      'LG Smart TVs führen keine Android-Handy-Apps aus, sondern für webOS veröffentlichte TV-Apps. Die Store-Suche ist deshalb der wichtigste Kompatibilitätscheck.',
    ),
    storeName: 'LG Content Store / LG Apps',
    systems: [
      {
        id: 'webos',
        label: t('Home ekranında Apps var', 'Apps auf dem Home-Bildschirm'),
        clue: t('Apps, LG Apps veya LG Content Store simgesi görünüyor.', 'Apps, LG Apps oder LG Content Store ist sichtbar.'),
        verdict: t('webOS mağazasından kurulum', 'Installation aus dem webOS Store'),
        method: t(
          'LG hesabınızla oturum açın, Apps içindeki aramaya uygulamanın tam adını yazın, Yükle ve Başlat seçeneklerini kullanın.',
          'Melden Sie sich mit Ihrem LG-Konto an, suchen Sie in Apps nach dem exakten App-Namen und wählen Sie Installieren und Starten.',
        ),
      },
      {
        id: 'legacy',
        label: t('Eski webOS / NetCast', 'Älteres webOS / NetCast'),
        clue: t('Mağaza görünümü çok eski veya uygulama desteği sınırlı.', 'Store-Oberfläche ist sehr alt oder App-Unterstützung eingeschränkt.'),
        verdict: t('Model kontrolü veya harici cihaz', 'Modell prüfen oder externes Gerät nutzen'),
        method: t(
          'Ayarlar bölümünden model ve yazılım sürümünü not edin. LG Content Store’da destek yoksa HDMI üzerinden güncel, sertifikalı bir yayın cihazı kullanın.',
          'Notieren Sie Modell und Softwareversion in den Einstellungen. Fehlt die Unterstützung im LG Content Store, verwenden Sie ein aktuelles zertifiziertes Streaming-Gerät per HDMI.',
        ),
      },
    ],
    howToSteps: makeHowTo('LG', 'LG Content Store / LG Apps'),
    troubleshooting: commonTroubleshooting,
    faqs: commonFaqs('LG'),
    sources: [
      {
        label: t('LG: webOS Content Store kullanımı', 'LG: webOS Content Store verwenden'),
        url: t(
          'https://www.lg.com/us/support/help-library/lg-tvs-how-to-use-the-lg-content-store-with-webos--20150291623404',
          'https://www.lg.com/de/microsites/losungen/tv/apps-aus-dem-lg-content-store-installieren/',
        ),
      },
    ],
  },
  'philips-tv-iptv': {
    slug: 'philips-tv-iptv',
    brand: 'Philips',
    accent: 'from-blue-600 to-indigo-400',
    accentText: 'text-indigo-300',
    accentBg: 'bg-indigo-400/10',
    title: t('Philips TV’de IPTV Nasıl Kullanılır?', 'IPTV auf Philips TV einrichten'),
    metaTitle: t('Philips TV’de IPTV Nasıl Kullanılır? | QruzeTV', 'IPTV auf Philips TV einrichten – Anleitung | QruzeTV'),
    metaDescription: t(
      'Philips TV IPTV kurulumu: Google/Android TV’de IPTV Smarters Pro, Titan/Saphi’de Bob Player uygunluğunu ve M3U/Xtream adımlarını kontrol edin.',
      'IPTV auf Philips TV: IPTV Smarters Pro auf Google/Android TV, Bob Player auf Titan/Saphi prüfen und M3U/Xtream einrichten.',
    ),
    summary: t(
      'Philips TV’de önce işletim sistemini belirleyin. Google TV veya Android TV ise Play Store’u; Titan OS ya da Saphi ise TV’nin kendi uygulama galerisini kullanın. Gerekli oynatıcı mağazada yoksa sertifikalı harici cihaz en temiz çözümdür.',
      'Bestimmen Sie zuerst das Betriebssystem des Philips TV. Nutzen Sie bei Google TV/Android TV den Play Store, bei Titan OS oder Saphi die integrierte App-Galerie. Fehlt der benötigte Player, ist ein zertifiziertes externes Gerät die sauberste Lösung.',
    ),
    intro: t(
      'Philips adı altında farklı akıllı TV platformları bulunduğundan, yalnızca marka adına göre uygulama önerisi yapmak doğru değildir. Ana ekran ve ürün bilgi menüsü doğru yolu gösterir.',
      'Unter der Marke Philips gibt es mehrere Smart-TV-Plattformen. Eine App-Empfehlung nur nach Markenname wäre daher ungenau; Startbildschirm und Produktinfo zeigen den richtigen Weg.',
    ),
    storeName: 'Google Play Store / Philips uygulama galerisi',
    systems: [
      {
        id: 'google',
        label: t('Google TV / Android TV', 'Google TV / Android TV'),
        clue: t('Ana ekranda Google Play Store, Uygulamalar veya Google hesabı seçenekleri var.', 'Google Play Store, Apps oder Google-Konto sind auf dem Startbildschirm sichtbar.'),
        verdict: t('Play Store’dan doğrudan kurulum', 'Direkte Installation aus dem Play Store'),
        method: t(
          'Google hesabıyla oturum açın, Play Store’da TV uyumlu oynatıcıyı arayın ve yükleyin. Yalnızca “TV için kullanılabilir” uygulamaları seçin.',
          'Melden Sie sich mit einem Google-Konto an, suchen Sie im Play Store einen TV-kompatiblen Player und installieren Sie nur Apps, die für den Fernseher verfügbar sind.',
        ),
      },
      {
        id: 'titan-saphi',
        label: t('Titan OS / Saphi', 'Titan OS / Saphi'),
        clue: t('Play Store yok; Philips’in kendi uygulama ekranı bulunuyor.', 'Kein Play Store; stattdessen ist eine Philips-eigene App-Ansicht vorhanden.'),
        verdict: t('Yerleşik mağaza ile sınırlı', 'Auf integrierten Store beschränkt'),
        method: t(
          'Uygulama galerisinde sağlayıcınızın önerdiği oynatıcıyı arayın. Bulunmuyorsa bilinmeyen dosya yüklemek yerine harici sertifikalı cihaz kullanın.',
          'Suchen Sie in der App-Galerie nach dem empfohlenen Player. Ist er nicht vorhanden, verwenden Sie ein zertifiziertes externes Gerät statt unbekannter Installationsdateien.',
        ),
      },
      {
        id: 'unknown',
        label: t('Sistemden emin değilim', 'System ist unbekannt'),
        clue: t('Model yılı veya ana ekran tanıdık gelmiyor.', 'Modelljahr oder Startbildschirm sind nicht eindeutig.'),
        verdict: t('Model koduyla doğrulayın', 'Über Modellcode prüfen'),
        method: t(
          'Ayarlar > Tüm Ayarlar > Hakkında/TV Bilgileri menüsünden model kodunu alın ve Philips destek sayfasında teknik özellikleri kontrol edin.',
          'Öffnen Sie Einstellungen > Alle Einstellungen > Info/TV-Informationen, notieren Sie den Modellcode und prüfen Sie die technischen Daten beim Philips Support.',
        ),
      },
    ],
    howToSteps: makeHowTo('Philips', 'Google Play Store veya Philips uygulama galerisi'),
    troubleshooting: commonTroubleshooting,
    faqs: commonFaqs('Philips'),
    sources: [
      {
        label: t('Philips: Android TV’de Play Store uygulaması kurma', 'Philips: Play-Store-App auf Android TV installieren'),
        url: t(
          'https://www.philips.co.uk/c-f/XC000016527/how-to-log-into-the-google-play-store-to-install-apps-on-philips-android-tv',
          'https://www.philips.co.uk/c-f/XC000016527/how-to-log-into-the-google-play-store-to-install-apps-on-philips-android-tv',
        ),
      },
    ],
  },
  'vestel-tv-iptv': {
    slug: 'vestel-tv-iptv',
    brand: 'Vestel',
    accent: 'from-red-600 to-orange-500',
    accentText: 'text-orange-300',
    accentBg: 'bg-orange-400/10',
    title: t('Vestel TV’de IPTV Nasıl Kullanılır?', 'IPTV auf Vestel TV einrichten'),
    metaTitle: t('Vestel TV’de IPTV Nasıl Kullanılır? | QruzeTV', 'IPTV auf Vestel TV einrichten – Anleitung | QruzeTV'),
    metaDescription: t(
      'Vestel TV IPTV kurulumu: Android/Google TV’de IPTV Smarters Pro, diğer sistemlerde Bob Player uygunluğunu ve doğru mağaza girişini kontrol edin.',
      'IPTV auf Vestel TV: IPTV Smarters Pro auf Android/Google TV, Bob Player auf anderen Systemen und den passenden Store prüfen.',
    ),
    summary: t(
      'Vestel TV’lerde işletim sistemi modele göre Android TV, Google TV, TiVo, VIDAA veya Vestel’in kendi Smart TV platformu olabilir. Önce ana ekrandaki sistemi belirleyin; ardından yalnızca o sistemin resmî mağazasındaki uyumlu oynatıcıyı kurun.',
      'Vestel TVs können je nach Modell Android TV, Google TV, TiVo, VIDAA oder eine Vestel-eigene Smart-TV-Plattform verwenden. Erkennen Sie zuerst das System und installieren Sie nur einen kompatiblen Player aus dessen offiziellem Store.',
    ),
    intro: t(
      'Vestel’de model ailesi kurulum yolunu doğrudan değiştirir. Bu rehber, aynı marka içindeki farklı platformları yanlış uygulama önerisine düşmeden ayırır.',
      'Bei Vestel bestimmt die Modellfamilie den Installationsweg. Dieser Leitfaden trennt die Plattformen, ohne eine unpassende App für alle Modelle zu empfehlen.',
    ),
    storeName: 'Google Play Store / Vestel TV uygulama mağazası',
    systems: [
      {
        id: 'google',
        label: t('Google TV / Android TV', 'Google TV / Android TV'),
        clue: t('Play Store ve Google hesabı seçenekleri görünüyor.', 'Play Store und Google-Konto sind sichtbar.'),
        verdict: t('Play Store’dan kurulum', 'Installation aus dem Play Store'),
        method: t(
          'Play Store’u açın, TV uyumlu oynatıcıyı arayın, yükleyin ve abonelik biçiminizi ekleyin.',
          'Öffnen Sie den Play Store, suchen Sie einen TV-kompatiblen Player, installieren Sie ihn und fügen Sie Ihr Zugangsformat hinzu.',
        ),
      },
      {
        id: 'other',
        label: t('TiVo / VIDAA / Vestel Smart TV', 'TiVo / VIDAA / Vestel Smart TV'),
        clue: t('Play Store yok; ana ekranda farklı bir uygulama mağazası var.', 'Kein Play Store; auf dem Startbildschirm ist ein anderer App-Store vorhanden.'),
        verdict: t('Model mağazasındaki uygulamalarla sınırlı', 'Auf Apps des Modell-Stores beschränkt'),
        method: t(
          'Yerleşik mağazada önerilen oynatıcıyı tam adıyla arayın. Mağazada yoksa model uyumlu değildir; harici sertifikalı cihaz seçin.',
          'Suchen Sie im integrierten Store nach dem exakten Namen des empfohlenen Players. Fehlt er, ist das Modell nicht kompatibel; wählen Sie ein zertifiziertes externes Gerät.',
        ),
      },
      {
        id: 'unknown',
        label: t('Sistemden emin değilim', 'System ist unbekannt'),
        clue: t('Ana ekrandan platform anlaşılmıyor.', 'Die Plattform ist am Startbildschirm nicht erkennbar.'),
        verdict: t('Model kodunu kontrol edin', 'Modellcode prüfen'),
        method: t(
          'Ayarlar > Sistem veya TV Hakkında menüsünden model/yazılım bilgisini alın; Vestel destek sayfasındaki ürün kılavuzuyla eşleştirin.',
          'Lesen Sie unter Einstellungen > System oder Über den TV Modell und Software aus und gleichen Sie diese mit dem Vestel-Produkthandbuch ab.',
        ),
      },
    ],
    howToSteps: makeHowTo('Vestel', 'Google Play Store veya Vestel TV uygulama mağazası'),
    troubleshooting: commonTroubleshooting,
    faqs: commonFaqs('Vestel'),
    sources: [
      {
        label: t('Vestel Destek: Televizyona uygulama yükleme', 'Vestel Support: Apps auf dem TV installieren'),
        url: t(
          'https://destekmerkezi.vestel.com.tr/cozumler/tv-ses/tv/icerikler/televizyonuma-nasil-uygulama-yukleyebilirim',
          'https://destekmerkezi.vestel.com.tr/cozumler/tv-ses/tv/icerikler/televizyonuma-nasil-uygulama-yukleyebilirim',
        ),
      },
    ],
  },
  'hisense-tv-iptv': {
    slug: 'hisense-tv-iptv',
    brand: 'Hisense',
    accent: 'from-emerald-600 to-teal-400',
    accentText: 'text-teal-300',
    accentBg: 'bg-teal-400/10',
    title: t('Hisense TV’de IPTV Nasıl Kullanılır?', 'IPTV auf Hisense TV einrichten'),
    metaTitle: t('Hisense TV’de IPTV Nasıl Kullanılır? | QruzeTV', 'IPTV auf Hisense TV einrichten – Anleitung | QruzeTV'),
    metaDescription: t(
      'Hisense TV IPTV kurulumu: VIDAA’da Bob Player, Google/Android TV’de IPTV Smarters Pro seçimi, mağaza, M3U/Xtream ve sorun giderme.',
      'IPTV auf Hisense TV: Bob Player auf VIDAA, IPTV Smarters Pro auf Google/Android TV, Store, M3U/Xtream und Fehlerbehebung.',
    ),
    summary: t(
      'Hisense TV’de ana ekranda VIDAA mı yoksa Google TV/Android TV mi yazdığını kontrol edin. VIDAA App Store veya Play Store’dan modelinize uygun oynatıcıyı kurun; uygulama yoksa harici sertifikalı cihaz kullanın.',
      'Prüfen Sie, ob der Hisense TV VIDAA oder Google TV/Android TV verwendet. Installieren Sie einen kompatiblen Player aus dem VIDAA App Store oder Play Store; fehlt die App, nutzen Sie ein zertifiziertes externes Gerät.',
    ),
    intro: t(
      'Hisense, ülke ve model serisine göre birden fazla platform kullanır. VIDAA için hazırlanan uygulama ile Android TV uygulaması aynı paket değildir.',
      'Hisense verwendet je nach Land und Modellreihe mehrere Plattformen. Eine VIDAA-App ist nicht dasselbe Paket wie eine Android-TV-App.',
    ),
    storeName: 'VIDAA App Store / Google Play Store',
    systems: [
      {
        id: 'vidaa',
        label: t('VIDAA', 'VIDAA'),
        clue: t('Ana ekranda VIDAA logosu veya VIDAA Store bulunuyor.', 'VIDAA-Logo oder VIDAA Store ist auf dem Startbildschirm sichtbar.'),
        verdict: t('VIDAA mağazasından kurulum', 'Installation aus dem VIDAA Store'),
        method: t(
          'My Apps veya App Store’u açın, önerilen oynatıcıyı tam adıyla arayın ve bölgenizde görünüyorsa yükleyin.',
          'Öffnen Sie My Apps oder App Store, suchen Sie den empfohlenen Player unter dem exakten Namen und installieren Sie ihn, sofern er in Ihrer Region gelistet ist.',
        ),
      },
      {
        id: 'google',
        label: t('Google TV / Android TV', 'Google TV / Android TV'),
        clue: t('Play Store ve Google hesabı menüsü var.', 'Play Store und Google-Konto-Menü sind vorhanden.'),
        verdict: t('Play Store’dan kurulum', 'Installation aus dem Play Store'),
        method: t(
          'Play Store’da yalnızca TV için uyumlu görünen oynatıcıyı yükleyin; telefon APK’sını TV uygulaması olarak değerlendirmeyin.',
          'Installieren Sie im Play Store nur einen ausdrücklich TV-kompatiblen Player; behandeln Sie eine Handy-APK nicht als TV-App.',
        ),
      },
      {
        id: 'unknown',
        label: t('Sistemden emin değilim', 'System ist unbekannt'),
        clue: t('Logo ya da mağaza adı belirgin değil.', 'Logo oder Store-Name ist nicht eindeutig.'),
        verdict: t('TV Hakkında menüsünü açın', 'TV-Info öffnen'),
        method: t(
          'Ayarlar > Destek > Sistem Bilgisi bölümünden model ve işletim sistemi bilgisini alın; ürün destek sayfasında doğrulayın.',
          'Öffnen Sie Einstellungen > Support > Systeminformationen, notieren Sie Modell und Betriebssystem und prüfen Sie beides auf der Produkt-Supportseite.',
        ),
      },
    ],
    howToSteps: makeHowTo('Hisense', 'VIDAA App Store veya Google Play Store'),
    troubleshooting: commonTroubleshooting,
    faqs: commonFaqs('Hisense'),
    sources: [
      {
        label: t('Hisense: Smart TV platformları ve VIDAA', 'Hisense: Smart-TV-Plattform VIDAA'),
        url: t('https://it.hisense.com/vidaa', 'https://it.hisense.com/vidaa'),
      },
    ],
  },
  'tcl-tv-iptv': {
    slug: 'tcl-tv-iptv',
    brand: 'TCL',
    accent: 'from-red-600 to-pink-500',
    accentText: 'text-pink-300',
    accentBg: 'bg-pink-400/10',
    title: t('TCL TV’de IPTV Nasıl Kullanılır?', 'IPTV auf TCL TV einrichten'),
    metaTitle: t('TCL TV’de IPTV Nasıl Kullanılır? Google TV Rehberi | QruzeTV', 'IPTV auf TCL TV einrichten – Google TV Anleitung | QruzeTV'),
    metaDescription: t(
      'TCL TV IPTV kurulumu: Google TV/Android TV’de IPTV Smarters Pro veya Bob Player kurun, M3U/Xtream ekleyin ve sorunları çözün.',
      'IPTV auf TCL TV: IPTV Smarters Pro oder Bob Player auf Google TV/Android TV installieren, M3U/Xtream hinzufügen und Probleme lösen.',
    ),
    summary: t(
      'Türkiye’deki birçok TCL modelinde Google TV veya Android TV bulunur. Play Store’dan TV uyumlu oynatıcıyı yükleyin, aboneliğinizin M3U ya da Xtream bilgilerini ekleyin. Bölgesel farklı bir sistem varsa o sistemin kendi mağazasını kullanın.',
      'Viele TCL Modelle verwenden Google TV oder Android TV. Installieren Sie einen TV-kompatiblen Player aus dem Play Store und fügen Sie M3U- oder Xtream-Daten hinzu. Bei einer regional anderen Plattform gilt deren eigener Store.',
    ),
    intro: t(
      'TCL modellerinin çoğunda Google ekosistemi kurulumu kolaylaştırır; yine de model ve satış bölgesi doğrulanmadan uygulama uyumluluğu kesin kabul edilmemelidir.',
      'Bei vielen TCL Modellen vereinfacht das Google-Ökosystem die Installation. Ohne Prüfung von Modell und Verkaufsregion sollte die App-Kompatibilität dennoch nicht als sicher gelten.',
    ),
    storeName: 'Google Play Store / TCL uygulama mağazası',
    systems: [
      {
        id: 'google',
        label: t('Google TV / Android TV', 'Google TV / Android TV'),
        clue: t('Play Store, Google hesabı ve Uygulamalar sekmesi görünüyor.', 'Play Store, Google-Konto und Apps-Tab sind sichtbar.'),
        verdict: t('Play Store’dan doğrudan kurulum', 'Direkte Installation aus dem Play Store'),
        method: t(
          'Uygulamalar > Uygulama ara bölümünü açın, TV uyumlu oynatıcıyı yükleyin ve yasal abonelik bilgilerinizi ekleyin.',
          'Öffnen Sie Apps > Nach Apps suchen, installieren Sie einen TV-kompatiblen Player und fügen Sie die Daten Ihres rechtmäßigen Abonnements hinzu.',
        ),
      },
      {
        id: 'other',
        label: t('Farklı bölgesel sistem', 'Andere regionale Plattform'),
        clue: t('Play Store yok veya ana ekran Google TV’ye benzemiyor.', 'Kein Play Store oder der Startbildschirm entspricht nicht Google TV.'),
        verdict: t('Yerleşik mağaza veya harici cihaz', 'Integrierter Store oder externes Gerät'),
        method: t(
          'TV’nin uygulama mağazasında önerilen oynatıcıyı arayın. Destek yoksa HDMI ile sertifikalı bir Google TV/Android TV veya Apple TV cihazı kullanın.',
          'Suchen Sie im TV-App-Store nach dem empfohlenen Player. Fehlt die Unterstützung, nutzen Sie per HDMI ein zertifiziertes Google-TV-/Android-TV- oder Apple-TV-Gerät.',
        ),
      },
    ],
    howToSteps: makeHowTo('TCL', 'Google Play Store veya TCL uygulama mağazası'),
    troubleshooting: commonTroubleshooting,
    faqs: commonFaqs('TCL'),
    sources: [
      {
        label: t('TCL Türkiye: Google TV modelleri', 'TCL: Google-TV-Modelle'),
        url: t('https://www.tcl.com/tr/tr/tvs/google-tv', 'https://www.tcl.com/tr/tr/tvs/google-tv'),
      },
      {
        label: t('TCL Türkiye: Android TV ve Play Store', 'TCL: Android TV und Play Store'),
        url: t('https://www.tcl.com/tr/tr/android-tv', 'https://www.tcl.com/tr/tr/android-tv'),
      },
    ],
  },
};

export const TV_BRAND_GUIDE_SLUGS = Object.keys(TV_BRAND_GUIDES);

export const getTvBrandGuide = (slug) => TV_BRAND_GUIDES[slug] || null;

const appRecommendation = (primary, search, alternative, trNote, deNote) => ({
  primary,
  search,
  alternative,
  note: { tr: trNote, de: deNote },
});

/**
 * Kullanıcının kuracağı uygulama — işletim sistemi seçimine göre tek kaynak.
 * Mağaza ve model desteği değişebildiği için öneri, "mağazada görünüyorsa" kuralıyla gösterilir.
 */
export const TV_BRAND_APP_RECOMMENDATIONS = {
  'samsung-tv-iptv': {
    tizen: appRecommendation(
      'Bob Player',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro',
      'Samsung Tizen için öncelikli seçimimiz Bob Player. Smart Hub aramasında Bob Player/Bob IPTV görünmüyorsa IPTV Smarters Pro’yu deneyin.',
      'Für Samsung Tizen ist Bob Player unsere erste Wahl. Wird Bob Player/Bob IPTV im Smart Hub nicht angezeigt, testen Sie IPTV Smarters Pro.',
    ),
    legacy: appRecommendation(
      'Bob Player (mağazada görünüyorsa)',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro (mağazada görünüyorsa)',
      'Eski modellerde uygulama desteği sınırlı olabilir. Bob Player görünmüyorsa rastgele APK yerine sertifikalı harici cihaz kullanın.',
      'Bei älteren Modellen kann die App-Unterstützung eingeschränkt sein. Fehlt Bob Player, nutzen Sie statt einer unbekannten APK ein zertifiziertes externes Gerät.',
    ),
  },
  'lg-tv-iptv': {
    webos: appRecommendation(
      'Bob Player',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro',
      'LG webOS için öncelikli seçimimiz Bob Player. LG Content Store’da görünmüyorsa IPTV Smarters Pro’yu arayın.',
      'Für LG webOS ist Bob Player unsere erste Wahl. Wird er im LG Content Store nicht angezeigt, suchen Sie nach IPTV Smarters Pro.',
    ),
    legacy: appRecommendation(
      'Bob Player (mağazada görünüyorsa)',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro (mağazada görünüyorsa)',
      'Eski webOS/NetCast modellerinde uygulama listesi bölge ve modele göre değişir. Destek yoksa harici sertifikalı cihaz tercih edin.',
      'Bei älterem webOS/NetCast variiert das App-Angebot nach Modell und Region. Bei fehlender Unterstützung ist ein zertifiziertes externes Gerät sinnvoll.',
    ),
  },
  'philips-tv-iptv': {
    google: appRecommendation(
      'IPTV Smarters Pro',
      'IPTV Smarters Pro',
      'Bob Player (Play Store’da görünüyorsa)',
      'Philips Android/Google TV’de Play Store’dan IPTV Smarters Pro kurun. Bob Player görünüyorsa alternatif olarak deneyebilirsiniz.',
      'Installieren Sie auf Philips Android/Google TV IPTV Smarters Pro aus dem Play Store. Bob Player kann als Alternative getestet werden, wenn er gelistet ist.',
    ),
    'titan-saphi': appRecommendation(
      'Bob Player (mağazada görünüyorsa)',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro (mağazada görünüyorsa)',
      'Titan OS/Saphi’de önce Bob Player’ı arayın. İki uygulama da yoksa TV’ye APK yüklemeyin; sertifikalı Android/Google TV cihaz kullanın.',
      'Suchen Sie auf Titan OS/Saphi zuerst nach Bob Player. Sind beide Apps nicht vorhanden, installieren Sie keine APK und nutzen Sie ein zertifiziertes Android-/Google-TV-Gerät.',
    ),
    unknown: appRecommendation(
      'Önce işletim sistemini doğrulayın',
      'Bob Player veya IPTV Smarters Pro',
      'Sertifikalı harici cihaz',
      'Model kodunu doğrulamadan uygulama seçmeyin. Google/Android TV ise IPTV Smarters Pro; diğer sistemlerde mağazada görünen Bob Player veya uyumlu oynatıcıyı kullanın.',
      'Wählen Sie erst nach Prüfung des Modells. Bei Google/Android TV IPTV Smarters Pro, auf anderen Systemen Bob Player oder einen kompatiblen gelisteten Player verwenden.',
    ),
  },
  'vestel-tv-iptv': {
    google: appRecommendation(
      'IPTV Smarters Pro',
      'IPTV Smarters Pro',
      'Bob Player (Play Store’da görünüyorsa)',
      'Vestel Android/Google TV’de önerimiz IPTV Smarters Pro’dur. Bob Player Play Store’da görünüyorsa alternatif olarak kullanabilirsiniz.',
      'Auf Vestel Android/Google TV empfehlen wir IPTV Smarters Pro. Bob Player ist eine Alternative, wenn er im Play Store gelistet ist.',
    ),
    other: appRecommendation(
      'Bob Player (mağazada görünüyorsa)',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro (mağazada görünüyorsa)',
      'TiVo, VIDAA veya Vestel Smart TV’de Bob Player’ı arayın. Mağazada yoksa model uyumlu değildir; harici cihaz seçin.',
      'Suchen Sie auf TiVo, VIDAA oder Vestel Smart TV nach Bob Player. Fehlt er im Store, ist das Modell nicht kompatibel; wählen Sie ein externes Gerät.',
    ),
    unknown: appRecommendation(
      'Önce işletim sistemini doğrulayın',
      'IPTV Smarters Pro veya Bob Player',
      'Sertifikalı harici cihaz',
      'İşletim sistemi belirlendikten sonra Google/Android TV için IPTV Smarters Pro, diğer platformlar için mağazada görünen Bob Player tercih edilir.',
      'Nach der Systemprüfung gilt: IPTV Smarters Pro auf Google/Android TV, Bob Player auf anderen Plattformen, sofern im Store verfügbar.',
    ),
  },
  'hisense-tv-iptv': {
    vidaa: appRecommendation(
      'Bob Player (mağazada görünüyorsa)',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro (mağazada görünüyorsa)',
      'Hisense VIDAA’da önce Bob Player’ı arayın. Uygulama yoksa VIDAA dışına APK yüklemek yerine harici sertifikalı cihaz kullanın.',
      'Suchen Sie auf Hisense VIDAA zuerst nach Bob Player. Fehlt die App, nutzen Sie statt einer APK ein zertifiziertes externes Gerät.',
    ),
    google: appRecommendation(
      'IPTV Smarters Pro',
      'IPTV Smarters Pro',
      'Bob Player (Play Store’da görünüyorsa)',
      'Hisense Google/Android TV’de Play Store’dan IPTV Smarters Pro kurun; Bob Player görünüyorsa alternatif olarak deneyin.',
      'Installieren Sie auf Hisense Google/Android TV IPTV Smarters Pro aus dem Play Store; Bob Player ist eine Alternative, wenn er gelistet ist.',
    ),
    unknown: appRecommendation(
      'Önce işletim sistemini doğrulayın',
      'IPTV Smarters Pro veya Bob Player',
      'Sertifikalı harici cihaz',
      'VIDAA ise Bob Player, Google/Android TV ise IPTV Smarters Pro önerilir. Modeli doğrulamadan APK kurmayın.',
      'Bei VIDAA empfehlen wir Bob Player, bei Google/Android TV IPTV Smarters Pro. Installieren Sie keine APK ohne Modellprüfung.',
    ),
  },
  'tcl-tv-iptv': {
    google: appRecommendation(
      'IPTV Smarters Pro',
      'IPTV Smarters Pro',
      'Bob Player (Play Store’da görünüyorsa)',
      'TCL Google/Android TV’de Play Store’dan IPTV Smarters Pro kurun. Bob Player listeleniyorsa alternatif olarak kullanabilirsiniz.',
      'Installieren Sie auf TCL Google/Android TV IPTV Smarters Pro aus dem Play Store. Bob Player ist eine Alternative, wenn er gelistet ist.',
    ),
    other: appRecommendation(
      'Bob Player (mağazada görünüyorsa)',
      'Bob Player veya Bob IPTV',
      'IPTV Smarters Pro (mağazada görünüyorsa)',
      'Bölgesel sistemlerde önce Bob Player’ı arayın. Uygulama mağazada yoksa sertifikalı harici Google TV/Android TV cihazı kullanın.',
      'Suchen Sie auf regionalen Plattformen zuerst nach Bob Player. Fehlt die App, nutzen Sie ein zertifiziertes Google-TV-/Android-TV-Gerät.',
    ),
  },
};

export const getTvBrandAppRecommendation = (slug, systemId, lang = 'tr') => {
  const recommendation = TV_BRAND_APP_RECOMMENDATIONS[slug]?.[systemId];
  if (!recommendation) return null;
  return {
    ...recommendation,
    note: recommendation.note?.[lang] || recommendation.note?.tr,
  };
};

export const localizeTvBrandGuide = (guide, lang = 'tr') => {
  if (!guide) return null;
  const pick = (value) => value?.[lang] ?? value?.tr ?? value;
  return {
    ...guide,
    title: pick(guide.title),
    metaTitle: pick(guide.metaTitle),
    metaDescription: pick(guide.metaDescription),
    summary: pick(guide.summary),
    intro: pick(guide.intro),
    systems: guide.systems.map((system) => ({
      ...system,
      label: pick(system.label),
      clue: pick(system.clue),
      verdict: pick(system.verdict),
      method: pick(system.method),
    })),
    howToSteps: guide.howToSteps.map((step) => ({
      name: pick(step.name),
      text: pick(step.text),
    })),
    troubleshooting: guide.troubleshooting.map((item) => ({
      title: pick(item.title),
      text: pick(item.text),
    })),
    faqs: guide.faqs.map((item) => ({
      q: pick(item.q),
      a: pick(item.a),
    })),
    sources: guide.sources.map((source) => ({
      label: pick(source.label),
      url: pick(source.url),
    })),
  };
};
