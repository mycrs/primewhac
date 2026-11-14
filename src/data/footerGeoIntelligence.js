/**
 * Footer GEO Intelligence — tek veri kaynağı (TR + DE).
 * Görünür footer içeriği ile JSON-LD (footerSchema.js) birebir aynı veriden beslenir;
 * Google'ın "görünür içerik = yapılandırılmış veri" tutarlılık sinyali için kritik.
 */

/** Yayın altyapısı düğümleri — canlı yerel saat göstergesi için IANA timezone */
export const BROADCAST_NODES = [
  { id: 'ist', city: 'İstanbul', country: 'TR', timeZone: 'Europe/Istanbul', labelDe: 'Istanbul' },
  { id: 'fra', city: 'Frankfurt', country: 'DE', timeZone: 'Europe/Berlin', labelDe: 'Frankfurt' },
  { id: 'ams', city: 'Amsterdam', country: 'NL', timeZone: 'Europe/Amsterdam', labelDe: 'Amsterdam' },
];

/**
 * Kapsama matrisi — bölge → şehirler. areaServed schema'sı bu listeden üretilir.
 * Şehirler bilgilendirme amaçlı görünür içeriktir (keyword stuffing değil, hizmet kapsamı beyanı).
 */
export const COVERAGE_MATRIX = {
  tr: [
    { region: 'Marmara', cities: ['İstanbul', 'Bursa', 'Kocaeli', 'Tekirdağ'] },
    { region: 'Ege', cities: ['İzmir', 'Aydın', 'Muğla', 'Denizli'] },
    { region: 'İç Anadolu', cities: ['Ankara', 'Konya', 'Kayseri', 'Eskişehir'] },
    { region: 'Akdeniz', cities: ['Antalya', 'Adana', 'Mersin', 'Hatay'] },
    { region: 'Karadeniz', cities: ['Samsun', 'Trabzon', 'Ordu', 'Rize'] },
    { region: 'Doğu & G.Doğu', cities: ['Gaziantep', 'Diyarbakır', 'Şanlıurfa', 'Van'] },
  ],
  de: [
    { region: 'Deutschland', cities: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart'] },
    { region: 'Österreich', cities: ['Wien', 'Graz', 'Linz', 'Salzburg'] },
    { region: 'Schweiz', cities: ['Zürich', 'Basel', 'Bern', 'Genf'] },
    { region: 'Niederlande', cities: ['Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht'] },
  ],
};

/** Bölge → ülke kodu eşlemesi (schema areaServed için) */
export const COVERAGE_COUNTRY = {
  tr: { default: 'TR' },
  de: {
    Deutschland: 'DE',
    'Österreich': 'AT',
    Schweiz: 'CH',
    Niederlande: 'NL',
    default: 'DE',
  },
};

/** Ağ istatistikleri — footer üst bandında görünür güven sinyalleri */
export const NETWORK_STATS = {
  tr: [
    { value: '10.000+', label: 'Canlı kanal' },
    { value: 'Yedekli', label: 'Yayın altyapısı' },
    { value: '4K/UHD', label: 'Görüntü kalitesi' },
    { value: '7/24', label: 'Türkçe destek' },
  ],
  de: [
    { value: '10.000+', label: 'Live-Kanäle' },
    { value: 'Redundant', label: 'Streaming-Infrastruktur' },
    { value: '4K/UHD', label: 'Bildqualität' },
    { value: '24/7', label: 'Support' },
  ],
};

/**
 * Topic cluster navigasyonu — hub & spoke iç link mimarisi.
 * Her cluster bir konu otoritesi grubu; SiteNavigationElement schema'sı buradan üretilir.
 */
export const TOPIC_CLUSTERS = {
  tr: [
    {
      id: 'basla',
      title: 'Hemen Başlayın',
      links: [
        { to: '/paketler/', label: 'IPTV Paketleri ve Fiyatları' },
        { to: '/test/', label: 'Ücretsiz IPTV Testi' },
        { to: '/karsilastirma/', label: 'Paket Karşılaştırma' },
        { to: '/channels/', label: 'Kanal Listesi' },
        { to: '/reseller/', label: 'Bayilik Programı' },
      ],
    },
    {
      id: 'kurulum',
      title: 'Cihazınıza Kurun',
      links: [
        { to: '/kurulum/', label: 'Kurulum Merkezi' },
        { to: '/kurulum/smart-tv/', label: 'Smart TV Kurulumu' },
        { to: '/kurulum/android-phone/', label: 'Android Kurulumu' },
        { to: '/kurulum/ios/', label: 'iPhone / iPad Kurulumu' },
        { to: '/kurulum/windows/', label: 'Windows Kurulumu' },
        { to: '/kurulum/mac/', label: 'Mac Kurulumu' },
      ],
    },
    {
      id: 'izle',
      title: 'İzleme Rehberleri',
      links: [
        { to: '/ne-izlesem/', label: 'Sinema & Dizi Arşivi' },
        { to: '/channels/', label: 'Kanal Listesi' },
        { to: '/almanyada-turk-kanallari/', label: "Almanya'da Türk Kanalları" },
        { to: '/blog/', label: 'Blog & Haberler' },
        { to: '/yorumlar/', label: 'Müşteri Yorumları' },
        { to: '/sss/', label: 'Sık Sorulan Sorular' },
        { to: '/hakkimizda/', label: 'Hakkımızda' },
        { to: '/iletisim/', label: 'İletişim & Destek' },
      ],
    },
  ],
  de: [
    {
      id: 'start',
      title: 'Schnell starten',
      links: [
        { to: '/de/pakete/', label: 'IPTV Pakete & Preise' },
        { to: '/de/test/', label: 'Kostenloser IPTV Test' },
        { to: '/de/vergleich/', label: 'Paketvergleich' },
        { to: '/de/kanale/', label: 'Kanalliste' },
        { to: '/de/reseller/', label: 'Reseller-Programm' },
      ],
    },
    {
      id: 'kurulum',
      title: 'Auf Ihrem Gerät einrichten',
      links: [
        { to: '/de/einrichtung/', label: 'Einrichtungszentrum' },
        { to: '/de/einrichtung/smart-tv/', label: 'Smart TV Einrichtung' },
        { to: '/de/einrichtung/android-phone/', label: 'Android Einrichtung' },
        { to: '/de/einrichtung/ios/', label: 'iPhone / iPad Einrichtung' },
        { to: '/de/einrichtung/windows/', label: 'Windows Einrichtung' },
        { to: '/de/einrichtung/mac/', label: 'Mac Einrichtung' },
      ],
    },
    {
      id: 'ansehen',
      title: 'Tipps zum Anschauen',
      links: [
        { to: '/de/was-soll-ich-schauen/', label: 'Filme & Serien Archiv' },
        { to: '/de/kanale/', label: 'Alle Sender' },
        { to: '/de/tuerkische-sender-in-deutschland/', label: 'Türkische Sender in DE' },
        { to: '/de/kanale/', label: 'Alle Sender' },
        { to: '/de/einrichtung/', label: 'Einrichtung & Support' },
        { to: '/de/blog/', label: 'Blog & News' },
        { to: '/de/bewertungen/', label: 'Kundenbewertungen' },
        { to: '/de/sss/', label: 'Häufige Fragen (FAQ)' },
        { to: '/de/uber-uns/', label: 'Über uns' },
      ],
    },
  ],
};

/** Yasal linkler */
export const LEGAL_LINKS = {
  tr: [
    { to: '/gizlilik/', label: 'Gizlilik Politikası' },
    { to: '/sartlar/', label: 'Hizmet Şartları' },
    { to: '/sitemap/', label: 'Site Haritası' },
  ],
  de: [
    { to: '/de/privacy/', label: 'Datenschutz' },
    { to: '/de/terms/', label: 'Impressum & AGB' },
    { to: '/sitemap/', label: 'Sitemap' },
  ],
};

/** Dil çapraz geçişi — hreflang ile uyumlu görünür sinyal */
export const LANG_SWITCH = {
  tr: { to: '/de/', label: 'Deutsch (DE / AT / CH)', hint: 'Avrupa sürümü' },
  de: { to: '/', label: 'Türkçe (TR)', hint: 'Türkei-Version' },
};

/** Kapsama başlığı ve açıklaması */
export const COVERAGE_COPY = {
  tr: {
    title: 'Hizmet Kapsama Alanı',
    subtitle: 'QruzeTV hizmeti Türkiye genelinde ve desteklenen Avrupa ülkelerinde kullanılabilir.',
  },
  de: {
    title: 'Verfügbarkeitsgebiet',
    subtitle: 'QruzeTV ist in der DACH-Region und den Niederlanden nutzbar; die Qualität hängt auch von Verbindung und Gerät ab.',
  },
};
