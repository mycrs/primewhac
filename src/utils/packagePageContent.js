import { DEFAULT_PACKAGES_PAGE_CONTENT } from '@/data/defaultPackagesPageContent';
import { mergePackageQuizContent } from '@/utils/packageRecommendationQuiz';
import {
  ACTIVE_TIER_OPTIONS,
  TIER_SHORT_DESCRIPTIONS_TR,
  TIER_SHORT_DESCRIPTIONS_DE,
  TIER_DESCRIPTIONS_TR,
  TIER_DESCRIPTIONS_DE,
  DEFAULT_PACKAGE_TIER,
  DEFAULT_PACKAGE_REGION,
} from '@/constants/packageTiers';

function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = { ...base };
  for (const key of Object.keys(override)) {
    const val = override[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && base[key] && typeof base[key] === 'object') {
      out[key] = deepMerge(base[key], val);
    } else if (val !== undefined && val !== null) {
      out[key] = val;
    }
  }
  return out;
}

/** siteData.packagesPageContent + varsayılanlar */
export function resolvePackagesPageContent(siteData) {
  const merged = deepMerge(DEFAULT_PACKAGES_PAGE_CONTENT, siteData?.packagesPageContent || {});
  if (merged.packageQuiz) {
    merged.packageQuiz = mergePackageQuizContent(merged.packageQuiz);
  }
  return merged;
}

/** Aktif tier butonları — CMS'den, yoksa packageTiers fallback */
export function getActiveTierOptions(pageContent, isDe = false) {
  const fromCms = (pageContent?.activeTiers || []).filter((t) => t.enabled !== false);
  if (fromCms.length > 0) {
    return fromCms.map((t) => ({
      id: t.id,
      label: isDe ? t.labelDe || t.labelTr : t.labelTr || t.labelDe,
    }));
  }
  return ACTIVE_TIER_OPTIONS.map((t) => ({
    id: t.id,
    label: isDe ? t.labelDe : t.labelTr,
  }));
}

export function getDefaultTier(pageContent) {
  return pageContent?.defaults?.tier || DEFAULT_PACKAGE_TIER;
}

export function getDefaultRegionTab(pageContent) {
  const r = pageContent?.defaults?.region || DEFAULT_PACKAGE_REGION;
  return r === 'eu' ? 'EU' : 'TR';
}

export function getTierShortDescription(pageContent, tierId, isDe = false) {
  const tier = pageContent?.tiers?.[tierId];
  if (isDe && tier?.shortDescriptionDe) return tier.shortDescriptionDe;
  if (tier?.shortDescription) return tier.shortDescription;
  const fallback = isDe ? TIER_SHORT_DESCRIPTIONS_DE : TIER_SHORT_DESCRIPTIONS_TR;
  return fallback[tierId] || '';
}

export function getTierDetailDescriptions(pageContent, isDe = false) {
  const fallback = isDe ? TIER_DESCRIPTIONS_DE : TIER_DESCRIPTIONS_TR;
  const tiers = pageContent?.tiers || {};
  return ['standard', 'premium'].map((id) => ({
    id,
    title: tiers[id]?.title || (id === 'standard' ? (isDe ? 'Standard Pakete' : 'Standart Paketler') : (isDe ? 'Premium Pakete' : 'Premium Paketler')),
    description: tiers[id]?.detailDescription || fallback[id] || '',
  }));
}

export function getPageTitle(pageContent, isDe = false) {
  if (isDe && pageContent?.page?.titleDe) return pageContent.page.titleDe;
  return pageContent?.page?.title || DEFAULT_PACKAGES_PAGE_CONTENT.page.title;
}

export function getPageShortDescription(pageContent, isDe = false) {
  if (isDe && pageContent?.page?.shortDescriptionDe) return pageContent.page.shortDescriptionDe;
  return (
    pageContent?.page?.shortDescription || DEFAULT_PACKAGES_PAGE_CONTENT.page.shortDescription
  );
}

export function getEmptyPackagesMessage(pageContent, isDe = false) {
  if (isDe) {
    return (
      pageContent?.page?.emptyMessageDe || DEFAULT_PACKAGES_PAGE_CONTENT.page.emptyMessageDe
    );
  }
  return pageContent?.page?.emptyMessage || DEFAULT_PACKAGES_PAGE_CONTENT.page.emptyMessage;
}
