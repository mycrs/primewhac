const trim = (v) => (typeof v === 'string' ? v.trim() : '');

const envLogo = trim(import.meta.env?.VITE_BRAND_LOGO_URL);

/** Same-origin default (public/logo.png). Override: VITE_BRAND_LOGO_URL */
export const BRAND_LOGO_URL = envLogo || '/logo.png';

const LEGACY_BROKEN_LOGO_RE =
  /horizons-cdn\.hostinger\.com|hostinger-horizons-assets-prod/i;

/**
 * @param {string | undefined | null} preferred - e.g. contactData.logoUrl from Supabase
 * @returns {string}
 */
export function resolveBrandLogoSrc(preferred) {
  const p = trim(preferred);
  if (p && !LEGACY_BROKEN_LOGO_RE.test(p)) return p;
  return BRAND_LOGO_URL;
}

/** Normalizes contactData.logoUrl after Supabase merge or cache load. */
export function withResolvedContactLogo(siteData) {
  if (!siteData?.contactData || typeof siteData.contactData !== 'object') return siteData;
  return {
    ...siteData,
    contactData: {
      ...siteData.contactData,
      logoUrl: resolveBrandLogoSrc(siteData.contactData.logoUrl),
    },
  };
}
