/**
 * Paket tier sistemi — economic / standard / premium / ultra genişletilebilir.
 * region: tr | eu (DB'de TR/EU olabilir; normalize edilir).
 */

/** Tüm desteklenen tier kimlikleri (ileride economic, ultra eklenebilir) */
export const PACKAGE_TIER_IDS = ['economic', 'standard', 'premium', 'ultra'];

export const DEFAULT_PACKAGE_TIER = 'premium';
export const DEFAULT_PACKAGE_REGION = 'tr';

/** Şu an UI'da gösterilen tier seçenekleri */
export const ACTIVE_TIER_OPTIONS = [
  { id: 'standard', labelTr: 'Standart Paketler', labelDe: 'Standard Pakete' },
  { id: 'premium', labelTr: 'Premium Paketler', labelDe: 'Premium Pakete' },
];

/** Paket kartlarının üstünde — seçili tier için 1-2 satır */
export const TIER_SHORT_DESCRIPTIONS_TR = {
  standard: 'Günlük kullanım için uygun fiyatlı IPTV paketleri.',
  premium: 'Daha geniş içerik, yüksek kalite yayın ve öncelikli destek isteyen kullanıcılar için.',
  economic: '',
  ultra: '',
};

export const TIER_SHORT_DESCRIPTIONS_DE = {
  standard: 'Preiswerte IPTV-Pakete für den täglichen Gebrauch.',
  premium: 'Für Nutzer mit größerem Inhaltsarchiv, hoher Qualität und priorisiertem Support.',
  economic: '',
  ultra: '',
};

export const TIER_DESCRIPTIONS_TR = {
  standard:
    'Standart IPTV paketleri, günlük kullanım için hazırlanmış uygun fiyatlı abonelik seçenekleridir. Temel kanal erişimi, film/dizi içerikleri ve yaygın cihaz desteği sunar.',
  premium:
    'Premium IPTV paketleri, daha geniş içerik arşivi, yüksek kalite yayın seçenekleri ve öncelikli destek isteyen kullanıcılar için hazırlanmıştır.',
  economic: '',
  ultra: '',
};

export const TIER_DESCRIPTIONS_DE = {
  standard:
    'Standard-IPTV-Pakete sind preiswerte Abonnements für den täglichen Gebrauch mit Grundkanälen, Film- und Serieninhalten sowie breiter Geräteunterstützung.',
  premium:
    'Premium-IPTV-Pakete bieten ein größeres Inhaltsarchiv, hochwertige Streaming-Optionen und priorisierten Support für anspruchsvolle Nutzer.',
  economic: '',
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
    if (PACKAGE_TIER_IDS.includes(t)) return t;
  }

  const name = (pkg?.name || pkg?.title || '').toLowerCase();
  if (name.includes('ultra')) return 'ultra';
  if (name.includes('premium') || name.includes('vip')) return 'premium';
  if (name.includes('economic') || name.includes('ekonomik')) return 'economic';
  return 'standard';
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
