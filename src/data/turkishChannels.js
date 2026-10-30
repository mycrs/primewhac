// Curated high-fidelity channel list with Turkish & German metadata
// Used as resilient fallback and instant SSR/prerender dataset
export const turkishChannels = [
  // --- ULUSAL & GENEL ---
  {
    id: "ch-trt-1",
    name: "TRT 1",
    category: "Genel",
    description: "Türkiye'nin köklü ulusal kamu yayıncısı; prestijli dönem dizileri ve ana haber bültenleri.",
    description_de: "Der erste nationale öffentlich-rechtliche Fernsehsender der Türkei mit historischen Serien und Nachrichten.",
    background_image_url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800",
    quality: "4K UHD",
    is_active: true
  },
  {
    id: "ch-atv",
    name: "ATV",
    category: "Genel",
    description: "Reyting lideri yerli diziler, yarışma programları ve güncel magazin kuşakları.",
    description_de: "Beliebte türkische Primetime-Serien, spannende Shows und tägliche Magazine.",
    background_image_url: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-show-tv",
    name: "Show TV",
    category: "Genel",
    description: "Gündem belirleyen dramalar, güldürü programları ve canlı magazin bültenleri.",
    description_de: "Bekannte türkische Dramen, Comedy-Shows und Live-Unterhaltungssendungen.",
    background_image_url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-kanal-d",
    name: "Kanal D",
    category: "Genel",
    description: "Klasikleşen aile dizileri, eğlence programları ve canlı sabah kuşağı.",
    description_de: "Traditionsreicher Privatsender mit Familienserien, Shows und Morgenmagazinen.",
    background_image_url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-star-tv",
    name: "Star TV",
    category: "Genel",
    description: "Yüksek prodüksiyonlu aşk ve dram dizileri, sinema geceleri.",
    description_de: "Der erste Privatsender der Türkei mit hochkarätigen Dramaserien und Spielfilmen.",
    background_image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-tv8",
    name: "TV8",
    category: "Genel",
    description: "MasterChef, Survivor gibi dev yarışma formatları ve kesintisiz eğlence.",
    description_de: "Top-Unterhaltungssender mit internationalen Show-Formaten wie MasterChef und Survivor.",
    background_image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-now-tv",
    name: "NOW TV",
    category: "Genel",
    description: "Sevilen yerli diziler, yaşam programları ve tarafsız ana haber kuşağı.",
    description_de: "Populäre türkische Fernsehserien, Lifestyle-Formate und unabhängige Nachrichtensendungen.",
    background_image_url: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },

  // --- SPOR ---
  {
    id: "ch-trt-spor",
    name: "TRT Spor",
    category: "Spor",
    description: "Milli karşılaşmalar, olimpiyatlar, canlı skorlar ve detaylı taktik analizler.",
    description_de: "Öffentlich-rechtlicher Sportsender mit Länderspielen, Olympia und Spielanalysen.",
    background_image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    quality: "60 FPS 4K",
    is_active: true
  },
  {
    id: "ch-a-spor",
    name: "A Spor",
    category: "Spor",
    description: "7/24 spor bülteni, transfer dedikoduları ve uzman yorumcu kadrosu.",
    description_de: "24/7 Sportnachrichten, Transfer-Updates und Live-Analysen aus den europäischen Ligen.",
    background_image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    quality: "60 FPS FHD",
    is_active: true
  },
  {
    id: "ch-tv8-5",
    name: "TV8.5",
    category: "Spor",
    description: "Avrupa kupaları maç özetleri, boks geceleri ve ekstrem spor yayınları.",
    description_de: "Highlights europäischer Pokalwettbewerbe, Kampfsportabende und Sportmagazine.",
    background_image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800",
    quality: "60 FPS FHD",
    is_active: true
  },
  {
    id: "ch-f1",
    name: "F1 Racing World",
    category: "Spor",
    description: "Formula 1 antrenman turları, sıralama turları ve pilot telsizi analizleri.",
    description_de: "Motorsport pur: Trainingssessions, Qualifyings und Renntage in gestochen scharfer 60FPS-Qualität.",
    background_image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800",
    quality: "60 FPS 4K",
    is_active: true
  },
  {
    id: "ch-sport1",
    name: "SPORT1",
    category: "Spor",
    description: "Almanya ve Avrupa spor dünyasından canlı maçlar, dart turnuvaları ve motorsporları.",
    description_de: "Deutscher Traditionssportsender mit Live-Events, Motorsport und dem legendären Doppelpass.",
    background_image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },

  // --- HABER ---
  {
    id: "ch-cnn-turk",
    name: "CNN Türk",
    category: "Haber",
    description: "Son dakika gelişmeleri, sıcak bölge canlı yayınları ve derinlemesine tartışma programları.",
    description_de: "Breaking News rund um die Uhr, Live-Schalten und politische Diskussionsrunden.",
    background_image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-ntv",
    name: "NTV",
    category: "Haber",
    description: "Ekonomi piyasaları, kültür-sanat, teknoloji ve güvenilir haber yayıncılığı.",
    description_de: "Seriöse Wirtschaftsanalysen, Kulturberichte und aktuelle Weltnachrichten.",
    background_image_url: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-haberturk",
    name: "HaberTürk",
    category: "Haber",
    description: "Türkiye'nin nabzını tutan özel haber dosyaları ve uzman konuklu canlı açık oturumlar.",
    description_de: "Exklusive Reportagen und tägliche Talkrunden zu globalen und regionalen Entwicklungen.",
    background_image_url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-trt-haber",
    name: "TRT Haber",
    category: "Haber",
    description: "7/24 kesintisiz tarafsız haber akışı, yurt bültenleri ve küresel muhabir ağı.",
    description_de: "Öffentlich-rechtlicher Nachrichtensender mit Korrespondentennetzwerk weltweit.",
    background_image_url: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-euronews",
    name: "EuroNews",
    category: "Haber",
    description: "Çok dilli yayın altyapısıyla Avrupa Parlamentosu ve dünya siyasetine objektif bakış.",
    description_de: "Pan-europäischer Nachrichtensender mit objektiven Berichten aus Brüssel und der Welt.",
    background_image_url: "https://images.unsplash.com/photo-1529243856184-fd5465488984?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },

  // --- SİNEMA & DİZİ ---
  {
    id: "ch-rai-movie",
    name: "RAI MOVIE",
    category: "Sinema",
    description: "Avrupa ve dünya sinemasının ödüllü başyapıtları, kült yönetmen klasikleri.",
    description_de: "Prämierte Meisterwerke des europäischen und internationalen Kinos in bester Schärfe.",
    background_image_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    quality: "4K UHD",
    is_active: true
  },
  {
    id: "ch-filmbox-4k",
    name: "FilmBox Cinema 4K",
    category: "Sinema",
    description: "Hollywood aksiyon gişe filmleri, gerilim ve sci-fi serileri 4K HDR kalitesinde.",
    description_de: "Hollywood-Blockbuster, Thriller und Sci-Fi-Premieren in kristallklarer 4K HDR Auflösung.",
    background_image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
    quality: "4K UHD",
    is_active: true
  },
  {
    id: "ch-sinema-tv",
    name: "Sinema TV Premier",
    category: "Sinema",
    description: "Festival seçkileri, en yeni vizyon filmleri ve orijinal seslendirme seçenekleri.",
    description_de: "Exklusive Filmpremieren, Festivallieblinge und mehrsprachige Tonspuren.",
    background_image_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },

  // --- BELGESEL ---
  {
    id: "ch-dmax",
    name: "DMAX",
    category: "Belgesel",
    description: "Otomobil restorasyonu, altın madenciliği, vahşi doğada hayatta kalma serileri.",
    description_de: "Faszinierende Dokumentationen über Abenteuer, Mechanik, Motorsport und Survival.",
    background_image_url: "https://images.unsplash.com/photo-1516934825964-b0db4350d750?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-trt-belgesel",
    name: "TRT Belgesel",
    category: "Belgesel",
    description: "Tarihin gizemleri, insan hikayeleri, vahşi doğa ve Anadolu medeniyetleri mirası.",
    description_de: "Preisgekrönte Naturdokumentationen, historische Expeditionen und Kulturerbe in 4K.",
    background_image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800",
    quality: "4K UHD",
    is_active: true
  },
  {
    id: "ch-discovery",
    name: "Discovery Science & Nature",
    category: "Belgesel",
    description: "Evrenin derinlikleri, yapay zeka, mega mühendislik projeleri ve doğa tarihi.",
    description_de: "Wissenschaft, Weltraumforschung und Mega-Konstruktionen verständlich und bildgewaltig erklärt.",
    background_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    quality: "4K UHD",
    is_active: true
  },

  // --- ÇOCUK & AİLE ---
  {
    id: "ch-trt-cocuk",
    name: "TRT Çocuk",
    category: "Çocuk",
    description: "Pedagojik denetimden geçmiş, reklamsız ve güvenli Türkçe eğitici çizgi diziler.",
    description_de: "Pädagogisch wertvolle türkische Kinderprogramme, Lernzeichentrick und werbefreie Inhalte.",
    background_image_url: "https://images.unsplash.com/photo-1560506840-085b12c8e31a?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-minika-cocuk",
    name: "Minika Çocuk",
    category: "Çocuk",
    description: "3-8 yaş okul öncesi miniklere yönelik hayal gücü ve zeka geliştirici animasyonlar.",
    description_de: "Fördernde Zeichentrickserien für Kleinkinder im Alter von 3 bis 8 Jahren.",
    background_image_url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-minika-go",
    name: "Minika GO",
    category: "Çocuk",
    description: "7-14 yaş kuşağı için macera dolu animeler, eğitici çizgi roman uyarlamaları.",
    description_de: "Spannende Abenteuerserien und populäre Animationen für Kinder und Jugendliche von 7 bis 14 Jahren.",
    background_image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },

  // --- MÜZİK ---
  {
    id: "ch-kral-pop",
    name: "Kral Pop TV",
    category: "Müzik",
    description: "Türkçe pop müziğin en yeni klipleri, müzik listeleri ve canlı akustik stüdyo performansları.",
    description_de: "Die neuesten türkischen Pop-Hits, Charts und exklusive Akustik-Sessions in HD.",
    background_image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-number-one",
    name: "Number One TV",
    category: "Müzik",
    description: "Global hit şarkılar, elektronik dans müziği festivalleri ve dünya yıldızlarının röportajları.",
    description_de: "Internationale Top-40-Hits, EDM-Festivals und Musik-News weltweit.",
    background_image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },

  // --- ULUSLARARASI ---
  {
    id: "ch-das-erste",
    name: "Das Erste (ARD)",
    category: "Uluslararası",
    description: "Almanya kamu yayıncısı; Tatort dizisi, Tagesschau ana haber ve kültür bültenleri.",
    description_de: "Das Erste Deutsche Fernsehen: Tagesschau, Tatort, Dokumentationen und Live-Sport.",
    background_image_url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-zdf",
    name: "ZDF HD",
    category: "Uluslararası",
    description: "Almanya İkinci Televizyonu; Heute haber bülteni, prestijli belgeseller ve talk showlar.",
    description_de: "Zweites Deutsches Fernsehen: Heute Journal, preisgekrönte Dokus und hochkarätige Serien.",
    background_image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-tv5monde",
    name: "TV5Monde",
    category: "Uluslararası",
    description: "Fransızca konuşulan dünyanın kültür, sinema ve güncel uluslararası haber penceresi.",
    description_de: "Weltweiter französischer Sender mit Kulturberichten, französischem Kino und aktuellen Nachrichten.",
    background_image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  },
  {
    id: "ch-rai-1",
    name: "RAI 1",
    category: "Uluslararası",
    description: "İtalya devlet televizyonu; Sanremo Müzik Festivali, İtalyan dizileri ve güncel programlar.",
    description_de: "Italiens führender TV-Sender: Sanremo Festival, italienische Serien und Unterhaltung.",
    background_image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800",
    quality: "Full HD",
    is_active: true
  }
];
