/**
 * Vite prerender: rota listesi + sayfa bazlı title/description/canonical/hreflang.
 * Canlı HTML'de doğru meta için postProcess bu haritayı kullanır.
 */
import { getCanonicalAndHreflang } from './utils/seoCanonicalHreflang.js';
import { SITE_URL } from './constants/siteUrl.js';

const KURULUM_DEVICES = [
  'android-tv',
  'ios',
  'android-phone',
  'windows',
  'mac',
  'smart-tv',
  'samsung-tv',
  'lg-tv',
  'tablet',
];

const DEVICE_LABELS = {
  'android-tv': { tr: 'Android TV', de: 'Android TV' },
  ios: { tr: 'iOS ve iPhone', de: 'iOS und iPhone' },
  'android-phone': { tr: 'Android Telefon', de: 'Android Smartphone' },
  windows: { tr: 'Windows PC', de: 'Windows PC' },
  mac: { tr: 'Mac', de: 'Mac' },
  'smart-tv': { tr: 'Smart TV (Samsung/LG)', de: 'Smart TV (Samsung/LG)' },
  'samsung-tv': { tr: 'Samsung TV', de: 'Samsung TV' },
  'lg-tv': { tr: 'LG TV', de: 'LG TV' },
  tablet: { tr: 'Tablet', de: 'Tablet' },
};

function pathFromUrl(url) {
  if (!url) return null;
  return url.replace(SITE_URL, '') || '/';
}

function buildSeo(canonicalPath, title, description) {
  const { hreflangTr, hreflangDe, xDefaultUrl, lang } = getCanonicalAndHreflang(canonicalPath, SITE_URL);
  return {
    lang,
    title,
    description,
    canonicalPath,
    hreflangTr: pathFromUrl(hreflangTr),
    hreflangDe: hreflangDe ? pathFromUrl(hreflangDe) : null,
    xDefault: pathFromUrl(xDefaultUrl),
    locale: lang === 'de' ? 'de_DE' : 'tr_TR',
    alternateLocale: lang === 'de' ? 'tr_TR' : 'de_DE',
  };
}

const STATIC_SEO = {
  '/': buildSeo(
    '/',
    'IPTV Satın Al 2026 — Donmayan 4K Yayın | QruzeTV',
    '20.000+ kanal, canlı spor, film ve dizi tek abonelikte. 4K kalitede donmayan yayın, ücretsiz test, anında teslimat ve 7/24 destek.'
  ),
  '/paketler': buildSeo(
    '/paketler',
    'IPTV Paketleri ve Fiyatları 2026 — 4K Abonelik | QruzeTV',
    'QruzeTV IPTV paketleri: aylık, 3-6-12 aylık seçenekler. Anında aktivasyon, ücretsiz test ve 24 saat iade hakkı. Paketleri hemen incele.'
  ),
  '/channels': buildSeo(
    '/channels',
    '10.000+ IPTV Kanal Listesi — Spor, Dizi, Film | QruzeTV',
    'QruzeTV kanal listesi: 10.000+ canlı kanal, beIN Sports, S Sport, TRT, Show TV, ATV, yerli ve yabancı. 4K destekli. Tüm kanalları hemen gör.'
  ),
  '/kurulum': buildSeo(
    '/kurulum',
    'IPTV Kurulum Rehberi — Samsung, LG, Fire TV | QruzeTV',
    'QruzeTV IPTV kurulumu 5 dakikada tamam: Samsung, LG, Android TV, Apple TV, Fire Stick, iPhone için adım adım video rehber. Hemen kur.'
  ),
  '/hakkimizda': buildSeo(
    '/hakkimizda',
    'Hakkımızda - QruzeTV',
    'QruzeTV hakkında detaylı bilgi. Vizyonumuz, misyonumuz ve kalite standartlarımız.'
  ),
  '/reseller': buildSeo(
    '/reseller',
    'IPTV Bayilik (Reseller) Programı | Kendi İşinizi Kurun',
    'IPTV bayilik (reseller) programımızla kendi işinizi kurun. En gelişmiş kontrol paneli ve yüksek kazanç oranları ile hemen başlayın.'
  ),
  '/blog': buildSeo(
    '/blog',
    'Premium IPTV Blog - Blog & Rehberler | QruzeTV',
    'IPTV dünyasından en güncel haberler, ipuçları ve teknik rehberler. Kurulum, kanal yönetimi ve sorun giderme rehberleri.'
  ),
  '/sss': buildSeo(
    '/sss',
    'Sıkça Sorulan Sorular — IPTV Rehberi | QruzeTV',
    'IPTV yasal mı, güvenli mi, nasıl çalışır? QruzeTV hakkında tüm sorularınıza net yanıtlar. Kurulum, ödeme, iade ve destek rehberi.'
  ),
  '/yorumlar': buildSeo(
    '/yorumlar',
    'QruzeTV Müşteri Yorumları | Premium IPTV Deneyimleri',
    'QruzeTV kullanıcı yorumları, IPTV deneyimleri ve müşteri memnuniyeti. Premium IPTV hizmetimizi gerçek kullanıcı görüşleriyle inceleyin.'
  ),
  '/test': buildSeo(
    '/test',
    'Ücretsiz Test Yayını Al | QruzeTV',
    'Ücretsiz IPTV test yayını talep edin. Cihazınızı seçin, uygulamanızı belirleyin ve hemen izlemeye başlayın. Kaliteli IPTV test deneyimi için iptv deneme hesabı oluşturun.'
  ),
  '/m3u-converter': buildSeo(
    '/m3u-converter',
    'M3U Oluştur - IPTV M3U Listesi Oluşturma Aracı | QruzeTV',
    'M3U oluştur aracı ile IPTV M3U listesi hazırlayın veya M3U IPTV linki içinden Xtream bilgilerinizi çıkarın. Kaliteli IPTV ve donmayan IPTV deneyimi için rehber.'
  ),
  '/sitemap': buildSeo(
    '/sitemap',
    'Site Haritası - QruzeTV',
    'QruzeTV site haritası ile tüm sayfalara kolayca ulaşın. Paketler, kurulum rehberleri, blog yazıları ve daha fazlası.'
  ),
  '/de/test': buildSeo(
    '/de/test',
    'IPTV kostenlos testen | QruzeTV',
    'Testen Sie unseren Premium IPTV Service kostenlos! Mit unserem IPTV Test Deutschland können Sie eine stabile IPTV testen, ohne sich zu verpflichten.'
  ),
  '/de': buildSeo(
    '/de',
    'Türkisches IPTV in Deutschland — Legal & 4K | QruzeTV',
    'Entdecken Sie Premium IPTV in Deutschland. Stabile 4K IPTV ohne Unterbrechung. Kaufen Sie jetzt IPTV von unserem zuverlässigen Anbieter. Kostenlos testen!'
  ),
  '/de/pakete': buildSeo(
    '/de/pakete',
    'Premium IPTV Deutschland | Stabile 4K IPTV Kaufen - 2026',
    'Premium IPTV Abo für Deutschland und Europa. Wählen Sie Ihr Paket für stabile 4K IPTV ohne Unterbrechungen. Jetzt beim Premium IPTV Anbieter kaufen!'
  ),
  '/de/einrichtung': buildSeo(
    '/de/einrichtung',
    'IPTV einrichten in 5 Min — Samsung, LG, Fire TV | QruzeTV',
    'Türkisches IPTV auf Samsung, LG, Fire TV Stick, Apple TV & Android einrichten — Schritt für Schritt auf Deutsch, in 5 Minuten live.'
  ),
  '/de/uber-uns': buildSeo(
    '/de/uber-uns',
    'Premium IPTV Anbieter Deutschland - Stabile & 4K IPTV Services',
    'Als führender Premium IPTV Anbieter Deutschland bieten wir stabile IPTV Verbindungen und 4K IPTV Service. Ihr Experte, wenn Sie IPTV kaufen Deutschland möchten.'
  ),
  '/de/blog': buildSeo(
    '/de/blog',
    'IPTV Blog Deutschland | QruzeTV',
    'Aktuelle IPTV Tipps, Streaming-Ratgeber und Premium IPTV Informationen für Deutschland.'
  ),
  '/de/sss': buildSeo(
    '/de/sss',
    'Häufige Fragen zum türkischen IPTV | QruzeTV',
    'Ist IPTV legal? Welche Geräte? Wie bezahle ich per SEPA? Alle Antworten rund um QruzeTV — Einrichtung, Rechnung, Kündigung und Support auf Deutsch.'
  ),
  '/de/bewertungen': buildSeo(
    '/de/bewertungen',
    'QruzeTV Bewertungen | Premium IPTV Erfahrungen',
    'Lesen Sie echte QruzeTV Bewertungen und Erfahrungen zu Premium IPTV, 4K Streaming, Aktivierung und Support.'
  ),
  '/de/terms': buildSeo(
    '/de/terms',
    'Nutzungsbedingungen | Rechtliche Informationen',
    'Nutzungsbedingungen und rechtliche Informationen für unseren IPTV Service.'
  ),
  '/karsilastirma': buildSeo(
    '/karsilastirma',
    'IPTV Paketleri Karşılaştırması | Hangisi Sizin İçin Uygun?',
    'IPTV paketlerini karşılaştırın. Temel, Standart ve Premium paketlerin özellikleri, fiyatları ve avantajları.'
  ),
  '/detailed-guides': buildSeo(
    '/detailed-guides',
    'IPTV İzleme Rehberi | Kurulum ve Kullanım Kılavuzu',
    'IPTV nasıl izlenir? Adım adım kurulum, cihaz ayarları ve kullanım ipuçları.'
  ),
  '/de/vergleich': buildSeo(
    '/de/vergleich',
    'IPTV Pakete im Vergleich | Welches Abo passt zu Ihnen?',
    'Vergleichen Sie IPTV-Pakete: Basis, Standard und Premium. Funktionen, Preise und Vorteile auf einen Blick.'
  ),
  '/de/detaillierte-anleitungen': buildSeo(
    '/de/detaillierte-anleitungen',
    'IPTV Anleitung | Einrichtung und Nutzung auf Deutsch',
    'IPTV einrichten und nutzen: Geräte-Anleitungen, Stabilitäts-Tipps und Support-Ressourcen für Deutschland.'
  ),
};

function deviceSeoTr(slug) {
  const label = DEVICE_LABELS[slug]?.tr || slug;
  return buildSeo(
    `/kurulum/${slug}`,
    `${label} IPTV Kurulum Rehberi | QruzeTV`,
    `Adım adım ${label} IPTV kurulumu. M3U ve Xtream Codes ile kurulum nasıl yapılır?`
  );
}

function deviceSeoDe(slug) {
  const label = DEVICE_LABELS[slug]?.de || slug;
  return buildSeo(
    `/de/einrichtung/${slug}`,
    `${label} IPTV Einrichtungsanleitung | QruzeTV`,
    `Schritt-für-Schritt ${label} IPTV Einrichtung. Mit M3U und Xtream Codes.`
  );
}

for (const slug of KURULUM_DEVICES) {
  STATIC_SEO[`/kurulum/${slug}`] = deviceSeoTr(slug);
  STATIC_SEO[`/de/einrichtung/${slug}`] = deviceSeoDe(slug);
}

/** @type {Record<string, ReturnType<typeof buildSeo>>} */
export const prerenderSeoByRoute = STATIC_SEO;

export const prerenderRoutes = Object.keys(STATIC_SEO);
