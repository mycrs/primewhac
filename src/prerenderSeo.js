/**
 * Vite prerender: rota listesi + sayfa bazlı title/description/canonical/hreflang.
 * Canlı HTML'de doğru meta için postProcess bu haritayı kullanır.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCanonicalAndHreflang } from './utils/seoCanonicalHreflang.js';
import { SITE_URL } from './constants/siteUrl.js';
import { BASE_KURULUM_DEVICES } from './data/kurulumDeviceSlugs.js';
import { getTvBrandGuide, localizeTvBrandGuide } from './data/tvBrandGuides.js';
import { categoriesTR, categoriesDE } from './data/whatToWatchCategories.js';
import { seoMetadata } from './data/seoMetadata.js';
import { MIN_CONTENT_THRESHOLD, plainTextLengthFromHtml } from './utils/seoNoindexPaths.js';

const KURULUM_DEVICES = BASE_KURULUM_DEVICES;
const DEVICE_LABELS = {
  'android-tv': { tr: 'Android TV', de: 'Android TV' },
  ios: { tr: 'iOS ve iPhone', de: 'iOS und iPhone' },
  'android-phone': { tr: 'Android Telefon', de: 'Android Smartphone' },
  'android-phone-xc': { tr: 'Android Telefon — Qruze Player XC', de: 'Android Smartphone — Qruze Player XC' },
  'android-phone-ibo': { tr: 'Android Telefon — Qruze Player IBO', de: 'Android Smartphone — Qruze Player IBO' },
  windows: { tr: 'Windows PC', de: 'Windows PC' },
  'windows-ibo-player': { tr: 'Windows — IBO Player Pro', de: 'Windows — IBO Player Pro' },  'windows-abc': { tr: 'Windows — ABC IPTV Player', de: 'Windows — ABC IPTV Player' },
  'windows-vs-player': { tr: 'Windows — VS Player', de: 'Windows — VS Player' },
  mac: { tr: 'Mac', de: 'Mac' },
  'mac-next-plus': { tr: 'Mac — NEXT+', de: 'Mac — NEXT+' },
  'mac-castora': { tr: 'Mac — CASTORA', de: 'Mac — CASTORA' },
  'smart-tv': { tr: 'Smart TV (Samsung/LG)', de: 'Smart TV (Samsung/LG)' },
  'smart-tv-0-player': { tr: 'Smart TV — 0 Player', de: 'Smart TV — 0 Player' },
  'smart-tv-smarters-pro': { tr: 'Smart TV — IPTV Smarters Pro', de: 'Smart TV — IPTV Smarters Pro' },
  'ios-next-plus': { tr: 'iOS — NEXT+', de: 'iOS — NEXT+' },
  'ios-castora': { tr: 'iOS — CASTORA', de: 'iOS — CASTORA' },
  'ios-9xtream': { tr: 'iOS — 9Xtream', de: 'iOS — 9Xtream' },
  tablet: { tr: 'Tablet', de: 'Tablet' },
  'tablet-ibo-player': { tr: 'Tablet — IBO Player Pro', de: 'Tablet — IBO Player Pro' },
  'tablet-abc': { tr: 'Tablet — ABC IPTV Player', de: 'Tablet — ABC IPTV Player' },
  'tablet-vs-player': { tr: 'Tablet — VS Player', de: 'Tablet — VS Player' },
};

/** Sayfa bazlı özel title/description (prerender + arama sonuçları). */
const DEVICE_SEO_OVERRIDES = {
  'android-phone': {
    tr: {
      title: 'Android Telefon IPTV Kurulumu — Uygulama Seçin | QruzeTV',
      description: 'Android telefon için Qruze Player XC ve IBO Player kurulum rehberi. APK ile paketinize uygun uygulamayı seçin.',
    },
    de: {
      title: 'Android Smartphone IPTV — App wählen | QruzeTV',
      description: 'Qruze Player XC oder IBO Player auf Android Smartphone — APK-Installation Schritt für Schritt.',
    },
  },
  'android-phone-xc': {
    tr: {
      title: 'Android Telefon — Qruze Player XC Kurulumu | QruzeTV',
      description: 'Qruze Player XC APK kurulumu — WhatsApp/e-posta linki, bilinmeyen kaynak, Xtream giriş adımları.',
    },
    de: {
      title: 'Android Smartphone — Qruze Player XC Einrichtung | QruzeTV',
      description: 'Qruze Player XC per APK — Download-Link, unbekannte Quellen, Xtream-Anmeldung.',
    },
  },
  'android-phone-ibo': {
    tr: {
      title: 'Android Telefon — Qruze Player IBO Kurulumu | QruzeTV',
      description: 'Qruze Player IBO mobil kurulum — APK indirme, giriş bilgileri ve izlemeye başlama adımları.',
    },
    de: {
      title: 'Android Smartphone — Qruze Player IBO Einrichtung | QruzeTV',
      description: 'Qruze Player IBO mobile Installation — APK, Login-Daten, Streaming starten.',
    },
  },
  windows: {
    tr: { title: 'Windows PC IPTV Kurulumu — Uygulama Seçin | QruzeTV', description: 'Windows için IBO Player Pro, ABC IPTV Player ve VS Player. Paketinize göre doğru uygulamayı seçin.' },
    de: { title: 'Windows PC IPTV Einrichtung — App wählen | QruzeTV', description: 'IBO Player Pro, ABC IPTV Player oder VS Player für Windows PC.' },
  },
  'windows-ibo-player': {
    tr: { title: 'Windows — IBO Player Pro Kurulumu | QruzeTV', description: 'Microsoft Store\'dan IBO Player Pro ile Windows IPTV kurulumu. Türkiye paketleri.' },
    de: { title: 'Windows — IBO Player Pro Einrichtung | QruzeTV', description: 'IBO Player Pro aus dem Microsoft Store — Türkei-Pakete mit Xtream oder M3U.' },
  },
  'windows-abc': {
    tr: { title: 'Windows — ABC IPTV Player Kurulumu | QruzeTV', description: 'ABC IPTV Player ile Windows\'ta M3U kurulumu. Avrupa Standart paketler.' },
    de: { title: 'Windows — ABC IPTV Player Einrichtung | QruzeTV', description: 'ABC IPTV Player auf Windows — M3U für Europa-Standard-Pakete.' },
  },
  'windows-vs-player': {
    tr: { title: 'Windows — VS Player IPTV Kurulumu | QruzeTV', description: 'VS Player ile Windows\'ta portal/Xtream kurulumu. Avrupa HD paketler.' },
    de: { title: 'Windows — VS Player Einrichtung | QruzeTV', description: 'VS Player auf Windows — Portal/Xtream für Europa-HD-Pakete.' },
  },
  tablet: {
    tr: { title: 'Tablet IPTV Kurulumu — Uygulama Seçin | QruzeTV', description: 'Tablet için IBO Player Pro, ABC IPTV Player ve VS Player kurulum rehberi.' },
    de: { title: 'Tablet IPTV Einrichtung — App wählen | QruzeTV', description: 'IBO Player Pro, ABC IPTV Player oder VS Player für iPad und Android-Tablet.' },
  },
  'tablet-ibo-player': {
    tr: { title: 'Tablet — IBO Player Pro Kurulumu | QruzeTV', description: 'App Store veya Play Store\'dan IBO Player Pro ile tablet IPTV kurulumu.' },
    de: { title: 'Tablet — IBO Player Pro Einrichtung | QruzeTV', description: 'IBO Player Pro auf dem Tablet — Türkei-Pakete mit Xtream oder M3U.' },
  },
  'tablet-abc': {
    tr: { title: 'Tablet — ABC IPTV Player Kurulumu | QruzeTV', description: 'ABC IPTV Player ile tablette M3U kurulumu. Avrupa Standart paketler.' },
    de: { title: 'Tablet — ABC IPTV Player Einrichtung | QruzeTV', description: 'ABC IPTV Player auf dem Tablet — M3U für Europa-Standard.' },
  },
  'tablet-vs-player': {
    tr: { title: 'Tablet — VS Player Kurulumu | QruzeTV', description: 'VS Player ile Android tablette portal/Xtream kurulumu.' },
    de: { title: 'Tablet — VS Player Einrichtung | QruzeTV', description: 'VS Player auf Android-Tablet — Portal für Europa-HD.' },
  },
  ios: {
    tr: { title: 'iOS ve iPhone IPTV Kurulumu — Uygulama Seçin | QruzeTV', description: 'iPhone ve iPad için NEXT+, CASTORA ve 9Xtream kurulum rehberleri.' },
    de: { title: 'iOS IPTV Einrichtung — App wählen | QruzeTV', description: 'NEXT+, CASTORA oder 9Xtream für iPhone und iPad.' },
  },
  mac: {
    tr: { title: 'Mac IPTV Kurulumu — Uygulama Seçin | QruzeTV', description: 'Mac için NEXT+ ve CASTORA kurulum rehberleri. Paketinize uygun uygulamayı seçin.' },
    de: { title: 'Mac IPTV Einrichtung — App wählen | QruzeTV', description: 'NEXT+ oder CASTORA für Mac — passende App wählen.' },
  },
  'smart-tv': {
    tr: { title: 'Smart TV IPTV Kurulumu — Marka Rehberleri | QruzeTV', description: 'Samsung, LG, Philips, Vestel, Hisense ve TCL TV IPTV kurulumu. İşletim sistemini bulun, resmî mağazayı seçin ve M3U/Xtream ekleyin.' },
    de: { title: 'Smart TV IPTV Einrichtung nach Marke | QruzeTV', description: 'IPTV auf Samsung, LG, Philips, Vestel, Hisense und TCL einrichten. System erkennen, offiziellen Store wählen und M3U/Xtream konfigurieren.' },
  },
};

function pathFromUrl(url) {
  if (!url) return null;
  return url.replace(SITE_URL, '') || '/';
}

/**
 * Ortak sözleşme: kök dışı tüm path'ler trailing slash'lı.
 * Sunucu slash'siz URL'leri slash'lıya 301'lediği için canonical/hreflang
 * beyanları da slash'lı forma sabitlenir.
 */
function withTrailingSlash(p) {
  if (!p || p === '/') return p || '/';
  return p.endsWith('/') ? p : `${p}/`;
}

/**
 * Blog meta üretiminde eski marka/domain kalıntılarını prerender aşamasında temizler.
 * Marka kuralları BlogPostPage.jsx'teki BRAND_TEXT_FIXES ile birebir aynıdır;
 * ek olarak eski domain linkleri (kaliteliiptv.com, primewatch.tv) yeni domain'e çevrilir.
 * buildSeoRoutes.json üretilmiş dosyadır; kalıcı veri temizliği DB/sanitasyon hattında yapılır,
 * bu fonksiyon statik HTML çıktısı için render-zamanı güvenlik ağıdır.
 */
const BLOG_TEXT_FIXES = [
  [/MARKA_ADINIZ/gi, 'QruzeTV'],
  [/MARKA ADINIZ/gi, 'QruzeTV'],
  [/Qruze Tv /gi, 'QruzeTV '],
  [/Qruze<[^>]*>HD<\/[^>]*>/gi, 'QruzeTV'],
  [/Qruze<[^>]*>HD/gi, 'QruzeTV'],
  [/Qruze\s*HD/gi, 'QruzeTV'],
  [/QruzeHD/g, 'QruzeTV'],
  [/KaliteliIPTV/g, 'QruzeTV'],
  [/PrimeWatch TV/g, 'QruzeTV'],
  [/Satın AI/g, 'Satın Al'],
  [/https:\/\/kaliteliiptv\.com/g, SITE_URL],
  [/http:\/\/kaliteliiptv\.com/g, SITE_URL],
  [/https:\/\/primewatch\.tv/g, SITE_URL],
  [/http:\/\/primewatch\.tv/g, SITE_URL],
];

const sanitizeBlogText = (text) => {
  if (typeof text !== 'string' || text.length === 0) return text;
  return BLOG_TEXT_FIXES.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
};

const extractEmbeddedMetaDescription = (html) => {
  if (typeof html !== 'string') return '';
  const tag = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0];
  return tag?.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
};

const getSafeBlogDescription = (candidate, excerpt, title, content) => {
  const value = sanitizeBlogText(candidate || '');
  const suspicious = value.length > 180 || /Ana Sayfa\s+Blog|Hemen Başla|QruzeTV\s+QruzeTV/i.test(value);
  const embedded = sanitizeBlogText(extractEmbeddedMetaDescription(content));
  if ((!value || suspicious) && embedded) return embedded;
  if (value && !suspicious) return value;
  return `${sanitizeBlogText(excerpt || title || '').substring(0, 150)}...`;
};

/**
 * @param {string} canonicalPath
 * @param {string} title
 * @param {string} description
 * @param {{ robots?: string, noHreflang?: boolean }} [extras]
 *   Çevrilmemiş /de/blog yazıları için: { robots: 'noindex, follow', noHreflang: true }
 */
function buildSeo(canonicalPath, title, description, extras = {}) {
  const { hreflangTr, hreflangDe, lang } = getCanonicalAndHreflang(canonicalPath, SITE_URL);
  const trPath = pathFromUrl(hreflangTr);
  const dePath = hreflangDe ? pathFromUrl(hreflangDe) : null;
  return {
    lang,
    title,
    description,
    canonicalPath: withTrailingSlash(canonicalPath),
    hreflangTr: trPath ? withTrailingSlash(trPath) : null,
    hreflangDe: dePath ? withTrailingSlash(dePath) : null,
    // x-default her zaman ilgili sayfanın TR slash'lı URL'si
    hreflangXDefault: trPath ? withTrailingSlash(trPath) : null,
    robots: 'index, follow',
    noHreflang: false,
    locale: lang === 'de' ? 'de_DE' : 'tr_TR',
    alternateLocale: lang === 'de' ? 'tr_TR' : 'de_DE',
    ...extras,
  };
}

const STATIC_SEO = {
  '/': buildSeo(
    '/',
    'IPTV Satın Al — 4K Türk Kanalları | QruzeTV',
    'Yurt dışından Türk kanallarını izlemek için IPTV satın alın: 10.000+ canlı kanal, 4K/UHD yayın, ücretsiz test ve 7/24 Türkçe destek.'
  ),
  '/paketler': buildSeo(
    '/paketler',
    'IPTV Paketleri ve Fiyatları — 4K Abonelik | QruzeTV',
    'IPTV paketlerini süre, kullanıcı sayısı, bölge ve fiyat açısından karşılaştırın. 4K/UHD seçeneklerini kendi cihazınızda ücretsiz test edin.'
  ),
  '/channels': buildSeo(
    '/channels',
    '10.000+ IPTV Kanal Listesi — Spor, Dizi, Film | QruzeTV',
    'QruzeTV kanal listesi: 10.000+ canlı kanal; haber, dizi, film, belgesel, çocuk ve müzik kategorileri. 4K/UHD destekli. Tüm kanalları hemen gör.'
  ),
  '/kurulum': buildSeo(
    '/kurulum',
    'IPTV Kurulum Rehberi — Tüm TV ve Cihazlar | QruzeTV',
    'Samsung, LG, Philips, Vestel, Hisense, TCL, Android TV, Fire TV, iPhone ve bilgisayar için işletim sistemine uygun IPTV kurulum rehberleri.'
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
    'IPTV Blog & Rehberler — Kurulum, İpuçları, Haberler | QruzeTV',
    'IPTV dünyasından en güncel haberler, ipuçları ve teknik rehberler. Kurulum, kanal yönetimi ve sorun giderme rehberleri.'
  ),
  '/sss': buildSeo(
    '/sss',
    'IPTV SSS — Kurulum, Ödeme, İade Soruları | QruzeTV',
    'IPTV yasal mı, güvenli mi, nasıl çalışır? QruzeTV hakkında tüm sorularınıza net yanıtlar. Kurulum, ödeme, iade ve destek rehberi.'
  ),
  '/iletisim': buildSeo(
    '/iletisim',
    'İletişim & 7/24 Canlı Destek — QruzeTV',
    'QruzeTV müşteri hizmetleri, WhatsApp ve Telegram canlı destek hatları. Kurulum, paketler veya teknik destek için bize dilediğiniz an ulaşın.'
  ),
  '/yorumlar': buildSeo(
    '/yorumlar',
    'QruzeTV Müşteri Yorumları | Premium IPTV Deneyimleri',
    'QruzeTV kullanıcı yorumları, IPTV deneyimleri ve müşteri memnuniyeti. Premium IPTV hizmetimizi gerçek kullanıcı görüşleriyle inceleyin.'
  ),
  '/test': buildSeo(
    '/test',
    'Ücretsiz IPTV Test Yayını — 24 Saat Deneme | QruzeTV',
    'Ücretsiz IPTV test hesabıyla 10.000+ kanal ve 4K/UHD yayın seçeneklerini kendi cihazınızda deneyin. Kredi kartı gerekmeden destek ekibine başvurun.'
  ),
  '/m3u-converter': buildSeo(
    '/m3u-converter',
    'M3U Oluştur - IPTV M3U Listesi Oluşturma Aracı | QruzeTV',
    'M3U oluştur aracı ile IPTV M3U listesi hazırlayın veya M3U IPTV linki içinden Xtream bilgilerinizi çıkarın. Kurulum için pratik rehber.'
  ),
  '/sitemap': buildSeo(
    '/sitemap',
    'Site Haritası - QruzeTV',
    'QruzeTV site haritası ile tüm sayfalara kolayca ulaşın. Paketler, kurulum rehberleri, blog yazıları ve daha fazlası.'
  ),
  '/de/test': buildSeo(
    '/de/test',
    'IPTV kostenlos testen | QruzeTV',
    'Testen Sie QruzeTV kostenlos auf Ihrem eigenen Gerät. Für Smart TV, Android, iOS, Windows und Mac; ohne langfristige Verpflichtung.'
  ),
  '/de': buildSeo(
    '/de',
    'IPTV Deutschland 2026 — Türkische Sender & Test | QruzeTV',
    'Türkische Sender per IPTV in Deutschland: auf Smart TV, Fire TV und Mobilgeräten in HD/4K streamen. QruzeTV jetzt kostenlos testen.'
  ),
  '/de/pakete': buildSeo(
    '/de/pakete',
    'IPTV Pakete für Deutschland — 4K & Test | QruzeTV',
    'IPTV-Pakete für Deutschland und Europa nach Laufzeit, Nutzerzahl und Preis vergleichen. 4K/UHD vor dem Kauf kostenlos auf dem eigenen Gerät testen.'
  ),
  '/de/einrichtung': buildSeo(
    '/de/einrichtung',
    'IPTV einrichten — Alle TVs und Geräte | QruzeTV',
    'Anleitungen für Samsung, LG, Philips, Vestel, Hisense, TCL, Android TV, Fire TV, iPhone und Computer – passend zum Betriebssystem.'
  ),
  '/de/uber-uns': buildSeo(
    '/de/uber-uns',
    'Über QruzeTV — IPTV, Gerätehilfe & Support',
    'Erfahren Sie, wie QruzeTV IPTV-Pakete, Geräteanleitungen, Testzugänge und deutsch-türkischen Support für Nutzer in Europa bereitstellt.'
  ),
  '/de/blog': buildSeo(
    '/de/blog',
    'IPTV Ratgeber Deutschland — Einrichtung & Tipps | QruzeTV',
    'Deutsche IPTV-Ratgeber zu Smart TV, Fire TV, Apps, Einrichtung und störungsfreiem Streaming. Praktische Anleitungen für Nutzer in Deutschland.'
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
    seoMetadata.comparison.title,
    seoMetadata.comparison.description
  ),  '/detailed-guides': buildSeo(
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
  '/mac-programi': buildSeo(
    '/mac-programi',
    'Maç Programı — Günlük Fikstür ve Saatler | QruzeTV',
    'Erfahren Sie mehr über QruzeTV, den Kundenservice, Gerätehilfen und die Grundsätze für ein transparentes IPTV-Angebot.'
  ),
  '/de/spielplan': buildSeo(
    '/de/spielplan',
    'Spielplan — Tagesfixture & Anstoßzeiten | QruzeTV',
    'Aktueller Spielplan: Tagesfixture, Anstoßzeiten und Partienübersicht auf einen Blick.'
  ),
  '/ne-izlesem': buildSeo(
    '/ne-izlesem',
    'Ne İzlesem? — Film ve Dizi Önerileri 2026 | QruzeTV',
    'Ne izlesem diye düşünüyorsan doğru yerdesin. Aksiyon, korku, romantik filmler ve popüler diziler — 4K IPTV ile izle.'
  ),
  '/de/was-soll-ich-schauen': buildSeo(
    '/de/was-soll-ich-schauen',
    'Was soll ich schauen? — Film- & Serien-Tipps | QruzeTV',
    'Die besten Film- und Serien-Empfehlungen: Action, Horror, Romantik und beliebte ausländische Serien.'
  ),
  '/gizlilik': buildSeo(
    '/gizlilik',
    seoMetadata.privacy.title,
    seoMetadata.privacy.description
  ),
  '/sartlar': buildSeo(
    '/sartlar',
    seoMetadata.terms.title,
    seoMetadata.terms.description
  ),
  '/de/privacy': buildSeo(
    '/de/privacy',
    'Datenschutzrichtlinie | QruzeTV',
    'Informationen zum Schutz Ihrer personenbezogenen Daten und zur Datensicherheit.'
  ),
  '/guide/iptv-kurulum-rehberi': buildSeo(
    '/guide/iptv-kurulum-rehberi',
    seoMetadata.guide.title,
    seoMetadata.guide.description
  ),
  '/de/guide/iptv-kurulum-rehberi': buildSeo(
    '/de/guide/iptv-kurulum-rehberi',
    'IPTV Anleitung Deutschland — Geräte & Einrichtung | QruzeTV',
    'IPTV in Deutschland Schritt für Schritt einrichten: passende Apps, Smart-TV-, Fire-TV-, Android-, iOS- und PC-Anleitungen plus Tipps gegen Ruckeln.'
  ),
  '/de/kanale': buildSeo(
    '/de/kanale',
    '10.000+ IPTV Kanal Liste — Sport, Serien, Filme | QruzeTV',
    'QruzeTV Kanalliste: 10.000+ Live-Kanäle, Sport, türkische und internationale Sender in 4K.'
  ),
  '/de/m3u-olustur': buildSeo(
    '/de/m3u-olustur',
    'M3U erstellen — IPTV M3U Listen-Tool | QruzeTV',
    'M3U-Liste erstellen oder Xtream-Daten aus M3U-Links extrahieren. Kostenloses IPTV-Tool.'
  ),
  '/de/reseller': buildSeo(
    '/de/reseller',
    'Wiederverkäufer-Programm: Passive Einnahmen | QruzeTV',
    'Starten Sie Ihr eigenes Geschäft mit unserem Wiederverkäufer-Programm. Attraktive Provision und Support.'
  ),
  // DE-only hub sayfaları (TR karşılığı yok): hreflang basılmaz; canonical self-referencing slash'lı kalır.
  // noHreflang olmadan buildSeo hreflangTr'yi ana sayfaya düşürürdü — yanlış eşleşme engellendi.
  '/de/tuerkische-sender-in-deutschland': buildSeo(
    '/de/tuerkische-sender-in-deutschland',
    'Türkische Sender in Deutschland 2026 | QruzeTV',
    'Türkische Sender in Deutschland ohne Schüssel auf Smart TV und Fire TV sehen. Empfangswege vergleichen, IPTV einrichten und kostenlos testen.',
    { noHreflang: true }
  ),
  // TR-only rehber sayfası (DE karşılığı yok): hreflang basılmaz; canonical self-referencing slash'lı kalır.
  '/almanyada-turk-kanallari': buildSeo(
    '/almanyada-turk-kanallari',
    "Almanya'da Türk Kanalları Nasıl İzlenir? 2026 Rehberi | QruzeTV",
    "Almanya'da Türk kanallarını izlemenin yolları: uydu mu IPTV mi? Kurulum adımları, cihazlar, paketler ve pratik ipuçları bu rehberde. Ücretsiz test edin.",
    { noHreflang: true }
  ),
};
function deviceSeoTr(slug) {
  const tvBrandGuide = localizeTvBrandGuide(getTvBrandGuide(slug), 'tr');
  if (tvBrandGuide) {
    return buildSeo(`/kurulum/${slug}`, tvBrandGuide.metaTitle, tvBrandGuide.metaDescription);
  }
  const label = DEVICE_LABELS[slug]?.tr || slug;
  const override = DEVICE_SEO_OVERRIDES[slug]?.tr;
  return buildSeo(
    `/kurulum/${slug}`,
    override?.title || `${label} IPTV Kurulum Rehberi | QruzeTV`,
    override?.description || `Adım adım ${label} IPTV kurulumu. M3U ve Xtream Codes ile kurulum nasıl yapılır?`
  );
}

function deviceSeoDe(slug) {
  const tvBrandGuide = localizeTvBrandGuide(getTvBrandGuide(slug), 'de');
  if (tvBrandGuide) {
    return buildSeo(`/de/einrichtung/${slug}`, tvBrandGuide.metaTitle, tvBrandGuide.metaDescription);
  }
  const label = DEVICE_LABELS[slug]?.de || slug;
  const override = DEVICE_SEO_OVERRIDES[slug]?.de;
  return buildSeo(
    `/de/einrichtung/${slug}`,
    override?.title || `${label} IPTV Einrichtungsanleitung | QruzeTV`,
    override?.description || `Schritt-für-Schritt ${label} IPTV Einrichtung. Mit M3U und Xtream Codes.`
  );
}

for (const slug of KURULUM_DEVICES) {
  STATIC_SEO[`/kurulum/${slug}`] = deviceSeoTr(slug);
  STATIC_SEO[`/de/einrichtung/${slug}`] = deviceSeoDe(slug);
}

/**
 * Ne-izlesem TR film kategorileri — prerender title'larında IPTV vurgusu.
 * Not: whatToWatchCategories.js içindeki cat.title değerleri SPA (Helmet) tarafında
 * da kullanılıyor; tek-kaynak hizalama merkezi entegrasyonda o dosyaya da uygulanmalı.
 */
const CATEGORY_TITLE_OVERRIDES_TR = {
  'aksiyon-filmleri': 'En İyi Aksiyon Filmleri 2026 — IPTV ile 4K İzle | QruzeTV',
  'korku-filmleri': 'En İyi Korku Filmleri 2026 — IPTV ile 4K İzle | QruzeTV',
  'romantik-filmler': 'En İyi Romantik Filmler 2026 — IPTV ile 4K İzle | QruzeTV',
  'imdb-yuksek-filmler': 'IMDb Puanı Yüksek Filmler — IPTV ile 4K İzle | QruzeTV',
};

Object.values(categoriesTR).forEach((cat) => {
  if (!cat?.urlPath) return;
  const title = CATEGORY_TITLE_OVERRIDES_TR[cat.slug] || cat.title;
  STATIC_SEO[cat.urlPath] = buildSeo(cat.urlPath, title, cat.description);
});

Object.values(categoriesDE).forEach((cat) => {
  if (!cat?.urlPath) return;
  STATIC_SEO[cat.urlPath] = buildSeo(cat.urlPath, cat.title, cat.description);
});

function loadBuildExtras() {
  try {
    const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'generated/buildSeoRoutes.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch {
    /* build öncesi sync yoksa varsayılan */
  }
  return { extraKurulumSlugs: [], blogPosts: [] };
}

export const buildSeoExtras = loadBuildExtras();

(buildSeoExtras.extraKurulumSlugs || []).forEach((slug) => {
  if (STATIC_SEO[`/kurulum/${slug}`]) return;
  STATIC_SEO[`/kurulum/${slug}`] = deviceSeoTr(slug);
  STATIC_SEO[`/de/einrichtung/${slug}`] = deviceSeoDe(slug);
});

(buildSeoExtras.blogPosts || []).forEach((post) => {
  if (!post?.slug) return;
  // Üretilmiş buildSeoRoutes.json ham DB verisi taşıyabilir; statik /blog/* HTML'ine
  // eski marka/domain basılmaması için title/description/excerpt sanitize edilir.
  const title = sanitizeBlogText(post.seo_title) || `${sanitizeBlogText(post.title)} | QruzeTV`;
  const description = getSafeBlogDescription(
    post.seo_description,
    post.excerpt,
    post.title,
    post.content,
  );
  // TR blog: index, follow kalır (dokunulmadı).
  STATIC_SEO[`/blog/${post.slug}`] = buildSeo(`/blog/${post.slug}`, title, description);

  // DE BLOG TEMİZLİĞİ: blog_posts tablosunda Almanca çeviri alanı bulunmuyor;
  // çevirisi OLMAYAN yazıların /de/blog çıktısı Türkçe kopya olduğundan
  // robots 'noindex, follow' + hreflang alternate'siz yayınlanır.
  // Canonical self-referencing slash'lı kalır (buildSeo varsayılanı).
  // Bu URL'ler sitemap üretim hattından da dışlanmalı — bkz. merkezi entegrasyon notu.
  const hasGermanTranslation = Boolean(
    typeof post.title_de === 'string' && post.title_de.trim() &&
    plainTextLengthFromHtml(post.content_de) >= MIN_CONTENT_THRESHOLD
  );
  if (!hasGermanTranslation) {
    STATIC_SEO[`/blog/${post.slug}`].hreflangDe = null;
  }
  if (hasGermanTranslation) {
    const deTitle = sanitizeBlogText(post.seo_title_de) || `${sanitizeBlogText(post.title_de || post.title)} | QruzeTV`;
    const deDescription = getSafeBlogDescription(
      post.seo_description_de,
      post.excerpt_de,
      post.title_de,
      post.content_de,
    );
    STATIC_SEO[`/de/blog/${post.slug}`] = buildSeo(`/de/blog/${post.slug}`, deTitle, deDescription);
  } else {
    STATIC_SEO[`/de/blog/${post.slug}`] = buildSeo(`/de/blog/${post.slug}`, title, description, {
      robots: 'noindex, follow',
      noHreflang: true,
    });
  }
});
/** @type {Record<string, ReturnType<typeof buildSeo>>} */
export const prerenderSeoByRoute = STATIC_SEO;

export const prerenderRoutes = Object.keys(STATIC_SEO);
