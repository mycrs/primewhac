/**
 * TR paket sayfasında WhatsApp öncesi uyarı: yalnızca /paketler|/packages ve Türkiye paketi / test.
 */

const EU_REGION_HINTS = ['eu', 'europe', 'avrupa', 'europa'];

/** Sadece tam olarak 'not_in_turkey' iken uyarı (boşluk / tip güvenliği). */
export function isAbroadLivingRegion(livingRegion) {
  if (livingRegion == null || typeof livingRegion !== 'string') return false;
  return livingRegion.trim() === 'not_in_turkey';
}

export function isTrPackagesPath(pathname) {
  const p = (pathname || '').split('?')[0].replace(/\/+$/, '') || '/';
  return p === '/paketler' || p === '/packages';
}

export function isEuOnlyPackage(pkg) {
  if (!pkg) return false;
  if (pkg.selectedRegion === 'eu') return true;
  const region = String(pkg.region || '').toLowerCase();
  return EU_REGION_HINTS.some((h) => region === h || region.includes(h));
}

/**
 * Uyarı yalnızca kullanıcı "Türkiye'de yaşamıyorum" (not_in_turkey) seçtiyse gösterilir.
 * @param {{ pathname: string, isDeSite: boolean, pkg: object | null, isTestFlow: boolean, livingRegion: string }}
 */
export function shouldShowTurkeyPackageWhatsAppWarning({
  pathname,
  isDeSite,
  pkg,
  isTestFlow,
  livingRegion,
}) {
  if (isDeSite) return false;
  if (!isTrPackagesPath(pathname)) return false;
  if (!isAbroadLivingRegion(livingRegion)) return false;
  if (isTestFlow) return true;
  if (!pkg) return false;
  return !isEuOnlyPackage(pkg);
}
