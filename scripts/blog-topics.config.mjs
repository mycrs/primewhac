/**
 * Blog otomasyonu — konu kuyruğu.
 *
 * Betik her çalıştığında bu listeden, blog_posts tablosunda henüz
 * yayınlanmamış (slug'i olmayan) ilk N konuyu alır ve Gemini ile yazı üretir.
 * Liste bittiğinde yeni konular eklemeniz yeterlidir.
 *
 * Alanlar:
 *  - slug      : Sabit URL parçası (/blog/<slug>). Değiştirirseniz eski yazı
 *                çakışmaz; yeni konu olarak ele alınır.
 *  - keyword   : Yazının hedeflediği ana anahtar kelime (SEO odaklı üretim için).
 *  - titleHint : Başlık için yön (opsiyonel; boş bırakılırsa model önerir).
 *  - category  : blog_posts.category alanına yazılır.
 *  - tags      : Etiket dizisi.
 *  - translateDe: true ise aynı yazının Almanca çevirisi title_de/content_de
 *                sütunlarına da üretilir (DE blog listesinde görünür).
 */

export const POSTS_PER_RUN = 1; // Tek çalıştırmada üretilecek yazı sayısı (--count ile geçersiz kılınır)

export const BLOG_AUTHOR = {
  author: 'QruzeTV Editör',
  author_bio: 'QruzeTV içerik ekibi; IPTV kurulumu, yayın teknolojileri ve cihaz rehberleri üzerine teknik yazılar hazırlar.',
};

export const TOPICS = [
  {
    slug: 'iptv-nedir-nasil-calisir',
    keyword: 'IPTV nedir, nasıl çalışır',
    titleHint: 'IPTV nedir, nasıl çalışır? 2026 için başlangıç rehberi',
    category: 'Rehber',
    tags: ['iptv', 'teknoloji', 'başlangıç rehberi'],
    translateDe: true,
  },
  {
    slug: 'iptv-de-donma-takilma-cozumu',
    keyword: 'IPTV donma takılma çözümü',
    titleHint: 'IPTV yayını donuyor mu? Donma ve takılmaya 8 etkili çözüm',
    category: 'Sorun Giderme',
    tags: ['iptv', 'donma', 'anti-freeze', 'sorun giderme'],
    translateDe: true,
  },
  {
    slug: 'iptv-icin-kac-mbps-internet-hizi',
    keyword: 'IPTV için kaç Mbps internet hızı gerekir',
    titleHint: 'IPTV için kaç Mbps internet hızı yeterli? Cihaz bazlı tablo',
    category: 'Rehber',
    tags: ['iptv', 'internet hızı', '4k', 'bağlantı'],
    translateDe: true,
  },
  {
    slug: 'm3u-linki-nedir-nasil-kullanilir',
    keyword: 'm3u linki nedir',
    titleHint: 'M3U linki nedir, nasıl kullanılır? IPTV listesi rehberi',
    category: 'Rehber',
    tags: ['m3u', 'iptv liste', 'xtream'],
    translateDe: true,
  },
  {
    slug: 'fire-tv-stick-iptv-kurulumu',
    keyword: 'Fire TV Stick IPTV kurulumu',
    titleHint: 'Amazon Fire TV Stick’e IPTV kurulumu (adım adım 2026)',
    category: 'Kurulum',
    tags: ['fire tv stick', 'kurulum', 'iptv'],
    translateDe: true,
  },
  {
    slug: 'apple-tv-iptv-kurulum-rehberi',
    keyword: 'Apple TV IPTV kurulumu',
    titleHint: 'Apple TV’de IPTV izleme: uygulama seçimi ve kurulum rehberi',
    category: 'Kurulum',
    tags: ['apple tv', 'kurulum', 'iptv uygulaması'],
    translateDe: true,
  },
  {
    slug: 'en-iyi-iptv-uygulamalari-2026',
    keyword: 'en iyi IPTV uygulamaları 2026',
    titleHint: '2026’nın en iyi IPTV uygulamaları: Smart TV, telefon ve bilgisayar',
    category: 'Karşılaştırma',
    tags: ['iptv uygulaması', 'smart tv', 'kodi', 'vlc'],
    translateDe: true,
  },
  {
    slug: 'iptv-satin-alirken-dikkat-edilecekler',
    keyword: 'IPTV satın alırken dikkat edilecekler',
    titleHint: 'IPTV satın alırken 7 kritik nokta (dolandırılmamak için)',
    category: 'Karşılaştırma',
    tags: ['iptv', 'güvenlik', 'satın alma rehberi'],
    translateDe: true,
  },
  {
    slug: 'iptv-fiyatlari-2026-karsilastirma',
    keyword: 'IPTV fiyatları 2026',
    titleHint: 'IPTV fiyatları ne kadar? 2026 güncel paket karşılaştırması',
    category: 'Karşılaştırma',
    tags: ['iptv fiyatları', 'paketler', 'karşılaştırma'],
    translateDe: true,
  },
  {
    slug: 'vpn-ile-iptv-guvenli-mi',
    keyword: 'VPN ile IPTV izlemek güvenli mi',
    titleHint: 'VPN ile IPTV izlemek gerekli mi? Gerçekler ve öneriler',
    category: 'Rehber',
    tags: ['vpn', 'güvenlik', 'iptv'],
    translateDe: true,
  },
  {
    slug: 'android-tv-box-iptv-kurulumu',
    keyword: 'Android TV box IPTV kurulumu',
    titleHint: 'Android TV Box’a IPTV kurulumu: yeni başlayanlar için rehber',
    category: 'Kurulum',
    tags: ['android tv box', 'kurulum', 'iptv'],
    translateDe: true,
  },
  {
    slug: 'iptv-mi-uydu-mu-kararlisi',
    keyword: 'IPTV mi uydu mu',
    titleHint: 'IPTV mi, uydu mu, kablo TV mi? 2026 için dürüst karşılaştırma',
    category: 'Karşılaştırma',
    tags: ['iptv', 'uydu', 'karşılaştırma'],
    translateDe: true,
  },

  // ================= TEKNOLOJİ GÜNDEMİ =================
  {
    slug: 'smart-tv-isletim-sistemleri-karsilastirma-2026',
    keyword: 'smart tv işletim sistemleri karşılaştırma',
    titleHint: 'Tizen, webOS ve Google TV: 2026’da Hangi Smart TV Daha Hızlı?',
    category: 'Teknoloji Gündemi',
    tags: ['smart tv', 'tizen', 'webos', 'google tv', 'teknoloji'],
    translateDe: true,
  },
  {
    slug: 'wi-fi-6-ve-5ghz-ile-kesintisiz-4k-yayin',
    keyword: 'kesintisiz 4K yayın için wi-fi ayarları',
    titleHint: 'Wi-Fi 6 ve 5 GHz Ayarları: 4K Yayınlarda Donmayı Bitiren İpuçları',
    category: 'Teknoloji Gündemi',
    tags: ['wifi 6', '5ghz', '4k yayın', 'internet hızı', 'modem ayarları'],
    translateDe: true,
  },
  {
    slug: 'hevc-ve-av1-video-kodekleri-rehberi',
    keyword: 'hevc av1 video kodekleri farkı',
    titleHint: 'HEVC (H.265) ve AV1 Kodekleri Nedir? Düşük Kotayla Yüksek Kalite',
    category: 'Teknoloji Gündemi',
    tags: ['hevc', 'av1', 'video kodek', 'yayın teknolojisi'],
    translateDe: true,
  },
  {
    slug: 'android-tv-box-satin-alma-kriterleri-2026',
    keyword: 'android tv box tavsiyesi 2026',
    titleHint: '2026 Android TV Box Satın Alma Rehberi: Donanım ve Bellek Seçimi',
    category: 'Teknoloji Gündemi',
    tags: ['android tv box', 'tv box rehberi', 'donanım'],
    translateDe: true,
  },
  {
    slug: 'akilli-televizyonlarda-en-iyi-goruntu-ayarlari',
    keyword: 'akıllı tv en iyi görüntü ayarları',
    titleHint: 'Televizyonda En İyi Görüntü Ayarları: Canlı Yayın ve Film Kalibrasyonu',
    category: 'Teknoloji Gündemi',
    tags: ['ekran ayarları', 'hdr', 'renk kalibrasyonu', 'smart tv'],
    translateDe: true,
  },
  {
    slug: 'fiber-internet-ve-canli-yayin-gecikmesi',
    keyword: 'canlı yayın ping ve gecikme düşürme',
    titleHint: 'Fiber İnternette Ping ve Yayın Gecikmesini Düşürmenin 5 Etkili Yolu',
    category: 'Teknoloji Gündemi',
    tags: ['fiber internet', 'ping', 'gecikme', 'dns'],
    translateDe: true,
  },

  // ================= SPOR GÜNDEMİ (TELİF GÜVENLİ) =================
  {
    slug: 'buyuk-mac-gunlerinde-internet-ve-yayin-optimizasyonu',
    keyword: 'maç günlerinde internet donması çözümü',
    titleHint: 'Büyük Maç Günlerinde İnternet Yavaşlaması ve Donmayı Önleme Rehberi',
    category: 'Spor Gündemi',
    tags: ['spor', 'canlı maç', 'donma çözümü', 'ağ optimizasyonu'],
    translateDe: true,
  },
  {
    slug: 'canli-spor-yayinlarinda-gecikme-nasil-azaltilir',
    keyword: 'canlı spor yayınlarında gecikme süresi',
    titleHint: 'Canlı Spor Yayınlarında Gecikme (Latency) Neden Olur, Nasıl Azaltılır?',
    category: 'Spor Gündemi',
    tags: ['canlı spor', 'gecikme', 'latency', 'canlı yayın'],
    translateDe: true,
  },
  {
    slug: 'evde-stadyum-atmosferi-icin-ses-ayarlari',
    keyword: 'spor maçları için ses sistemi ayarları',
    titleHint: 'Evde Stadyum Havası: Spor Karşılaşmaları İçin Soundbar ve Ses Ayarları',
    category: 'Spor Gündemi',
    tags: ['stadyum atmosferi', 'soundbar', 'ses ayarları', 'spor keyfi'],
    translateDe: true,
  },
  {
    slug: 'hafta-sonu-derbileri-oncesi-modem-ve-ag-hazirligi',
    keyword: 'derbi öncesi internet hazırlığı',
    titleHint: 'Hafta Sonu Karşılaşmaları Öncesi Modem, DNS ve Ağ Optimizasyonu',
    category: 'Spor Gündemi',
    tags: ['derbi hazırlığı', 'dns ayarı', 'kablolu internet', 'spor'],
    translateDe: true,
  },
  {
    slug: '4k-spor-karsilasmalari-icin-ekran-ve-memc-ayarlari',
    keyword: '4K maç yayını için tv ayarı',
    titleHint: '4K Spor Karşılaşmalarında Akıcı Hareket (MEMC) ve Ekran Kalibrasyonu',
    category: 'Spor Gündemi',
    tags: ['4k spor', 'memc', 'hareket akıcılığı', 'ekran kalibrasyonu'],
    translateDe: true,
  },
  {
    slug: 'farkli-cihazlarda-es-zamanli-mac-keyfi',
    keyword: 'aynı anda çoklu ekranda maç izleme',
    titleHint: 'Aynı Anda Birden Fazla Ekranda Spor Karşılaşması İzleme Rehberi',
    category: 'Spor Gündemi',
    tags: ['çoklu ekran', 'spor', 'tablet tv telefon'],
    translateDe: true,
  },
];
