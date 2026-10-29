/**
 * Paket tier sistemi — stabil / cinema / global (ve geriye uyumlu standard / premium / economic).
 * region: tr | eu (DB'de TR/EU olabilir; normalize edilir).
 */

export const PACKAGE_TIER_IDS = ['stabil', 'cinema', 'global', 'economic', 'standard', 'premium', 'ultra'];

export const DEFAULT_PACKAGE_TIER = 'cinema';
export const DEFAULT_PACKAGE_REGION = 'tr';

/** UI'da gösterilen 3 özelleştirilmiş paket hattı */
export const ACTIVE_TIER_OPTIONS = [
  { id: 'stabil', labelTr: 'Premium Stabil', labelDe: 'Premium Stabil' },
  { id: 'cinema', labelTr: '4K Yoğun İçerik & Sinema', labelDe: '4K Ultra Kino & VOD' },
  { id: 'global', labelTr: 'Global & Dünya', labelDe: 'Global & Welt' },
];

/** Paket kartlarının üstünde — seçili tier için 1 satırlık rafine açıklama */
export const TIER_SHORT_DESCRIPTIONS_TR = {
  stabil: 'Anti-Freeze v4 altyapısı ile donmayan, kesintisiz canlı TV ve maç yayını odaklı paket.',
  cinema: '15.000+ film ve dizi arşivi, gerçek 4K HDR görüntü ve Dolby Atmos ses deneyimi.',
  global: 'Tüm Avrupa ve dünya kanalları, küresel Anycast CDN ve çok dilli yayın erişimi.',
  standard: 'Anti-Freeze v4 altyapısı ile donmayan, kesintisiz canlı TV ve maç yayını odaklı paket.',
  premium: '15.000+ film ve dizi arşivi, gerçek 4K HDR görüntü ve Dolby Atmos ses deneyimi.',
  economic: 'Ekonomik fiyatlı temel yayın paketi.',
  ultra: '',
};

export const TIER_SHORT_DESCRIPTIONS_DE = {
  stabil: 'Unterbrechungsfreies Live-TV und Sport mit Anti-Freeze v4 Infrastruktur.',
  cinema: '15.000+ Filme & Serien, echtes 4K HDR und Dolby Atmos Raumklang.',
  global: 'Alle Welt- & Europakanäle mit Anycast CDN ohne Latenz.',
  standard: 'Unterbrechungsfreies Live-TV und Sport mit Anti-Freeze v4 Infrastruktur.',
  premium: '15.000+ Filme & Serien, echtes 4K HDR und Dolby Atmos Raumklang.',
  economic: 'Wirtschaftliche Basispakete.',
  ultra: '',
};

export const TIER_DESCRIPTIONS_TR = {
  stabil:
    'Premium Stabil paket; yoğun saatlerde donma yaşamadan akıcı canlı TV ve maç izlemek isteyen kullanıcılar için dedicated altyapıyla sunulur.',
  cinema:
    '4K Yoğun İçerik & Sinema paketi; 15.000+ film ve dizi arşivi, 4K HDR master yayınlar ve Dolby çevresel ses kalitesiyle sinema tutkunları için hazırlanmıştır.',
  global:
    'Global & Dünya İçerikleri paketi; tüm dünya ve Avrupa kanallarına sıfır gecikmeli Anycast CDN üzerinden VPN gerektirmeden erişim sunar.',
  standard:
    'Premium Stabil paket; yoğun saatlerde donma yaşamadan akıcı canlı TV ve maç izlemek isteyen kullanıcılar için dedicated altyapıyla sunulur.',
  premium:
    '4K Yoğun İçerik & Sinema paketi; 15.000+ film ve dizi arşivi, 4K HDR master yayınlar ve Dolby çevresel ses kalitesiyle sinema tutkunları için hazırlanmıştır.',
  economic:
    'Ekonomik IPTV paketleri, bütçe dostu fiyatlarla temel kanal erişimi sunar.',
  ultra: '',
};

export const TIER_DESCRIPTIONS_DE = {
  stabil:
    'Premium Stabil-Paket: Unterbrechungsfreies Live-TV und Sportübertragungen mit dedizierter Anti-Freeze-Infrastruktur.',
  cinema:
    '4K Ultra Kino & VOD-Paket: Riesiges Archiv mit über 15.000 Filmen und Serien, echtes 4K HDR und Dolby-Audio.',
  global:
    'Global & Weltkanäle-Paket: Voller Zugriff auf europäische und weltweite Sender über das globale Anycast-Netzwerk.',
  standard:
    'Premium Stabil-Paket: Unterbrechungsfreies Live-TV und Sportübertragungen mit dedizierter Anti-Freeze-Infrastruktur.',
  premium:
    '4K Ultra Kino & VOD-Paket: Riesiges Archiv mit über 15.000 Filmen und Serien, echtes 4K HDR und Dolby-Audio.',
  economic:
    'Economy-IPTV-Pakete bieten zu budgetfreundlichen Preisen Zugang zu den wichtigsten Kanälen.',
  ultra: '',
};

const TR_REGION_VALUES = new Set(['tr', 'turkey', 'turkiye', 'türkiye', 'turkiye paketleri']);
const EU_REGION_VALUES = new Set(['eu', 'europe', 'avrupa', 'avrupa paketleri']);

/**
 * @param {string|undefined} value
 * @param {'tr'|'eu'} [fallback]
 * @returns {'tr'|'eu'}
 */
export function normalizePackageRegion(value, fallback = DEFAULT_PACKAGE_REGION) {
  const r = String(value ?? fallback).toLowerCase().trim();
  if (EU_REGION_VALUES.has(r) || r === 'eu' || r.includes('avrupa') || r.includes('europe')) {
    return 'eu';
  }
  if (TR_REGION_VALUES.has(r) || r === 'tr' || r.includes('turkiye') || r.includes('türkiye') || r.includes('turkey')) {
    return 'tr';
  }
  return fallback;
}

/**
 * @param {string} tabValue - Tabs bileşenindeki 'TR' | 'EU'
 * @returns {'tr'|'eu'}
 */
export function regionFromTab(tabValue) {
  return tabValue === 'EU' ? 'eu' : 'tr';
}

/**
 * @param {object} pkg
 * @returns {typeof PACKAGE_TIER_IDS[number]}
 */
export function inferPackageTier(pkg) {
  const explicit = pkg?.tier ?? pkg?.package_tier;
  if (explicit) {
    const t = String(explicit).toLowerCase().trim();
    if (t === 'stabil') return 'stabil';
    if (t === 'cinema') return 'cinema';
    if (t === 'global') return 'global';
    if (t === 'standard') return 'stabil';
    if (t === 'premium') return 'cinema';
    if (t === 'economic') return 'stabil';
  }

  const name = (pkg?.name || pkg?.title || '').toLowerCase();
  if (name.includes('global') || name.includes('dünya') || name.includes('welt')) return 'global';
  if (name.includes('4k') || name.includes('cinema') || name.includes('sinema') || name.includes('kino') || name.includes('içerik')) return 'cinema';
  if (name.includes('stabil')) return 'stabil';
  return 'cinema';
}

/**
 * Pakete normalize tier + region ekler (orijinal alanları korur).
 * @param {object} pkg
 * @returns {object}
 */
export function normalizePackage(pkg) {
  const region = normalizePackageRegion(pkg?.region);
  return {
    ...pkg,
    tier: inferPackageTier(pkg),
    region,
  };
}

/**
 * @param {object[]} packages
 * @param {string} tier
 * @param {'tr'|'eu'} region
 * @returns {object[]}
 */
export function filterPackagesByTierAndRegion(packages, tier, region) {
  if (!Array.isArray(packages)) return [];
  return packages
    .map(normalizePackage)
    .filter((p) => p.tier === tier && p.region === region);
}

/**
 * Bölge sekmesine göre önceden filtrelenmiş listede sadece tier uygular.
 * @param {object[]} packages
 * @param {string} tier
 * @returns {object[]}
 */
export function filterPackagesByTier(packages, tier) {
  if (!Array.isArray(packages)) return [];
  return packages.map(normalizePackage).filter((p) => p.tier === tier);
}
