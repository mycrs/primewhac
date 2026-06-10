
import React, { memo, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Star, Zap, Loader2, Globe, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderModal } from '@/contexts/OrderModalContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PackageRegionSelector from './PackageRegionSelector';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { PACKAGE_LIST_COLUMNS, PACKAGE_LIST_COLUMNS_FALLBACK } from '@/constants/publicSupabaseQueries';
import { sortPackagesForDisplay, getPackageCurrencySymbol } from '@/utils/buildPackagePayload';
import {
  resolvePackagesPageContent,
  getActiveTierOptions,
  getDefaultTier,
  getDefaultRegionTab,
  getTierShortDescription,
  getEmptyPackagesMessage,
} from '@/utils/packagePageContent';
import { resolvePackageQuiz } from '@/utils/packageRecommendationQuiz';
import { readSessionCache, writeSessionCache, removeSessionCacheKey } from '@/utils/supabaseSessionCache';
import { useLocation } from 'react-router-dom';
import PackageCountdownBadge from '@/components/packages/PackageCountdownBadge';
import PackageTierSelector from '@/components/packages/PackageTierSelector';
import PackageTierShortDescription from '@/components/packages/PackageTierShortDescription';
import PackageRecommendationQuiz from '@/components/packages/PackageRecommendationQuiz';
import { STATIC_PACKAGES_TR, STATIC_PACKAGES_EU } from '@/constants/staticPackagesFallback';
import {
  DEFAULT_PACKAGE_TIER,
  filterPackagesByTier,
  normalizePackage,
} from '@/constants/packageTiers';
import { useToast } from '@/components/ui/use-toast';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';
import { trackOrderIntent, trackPackagesPageView } from '@/utils/analyticsTracking';

const getPackageTheme = (name, isPopular) => {
  const lowerName = name?.toLowerCase() || '';
  
  if (isPopular || lowerName.includes('12 ay vip')) {
    return { 
      bgGlow: 'bg-primary', 
      border: 'border-primary/30', hoverBorder: 'group-hover:border-primary/80',
      shadow: 'shadow-lg shadow-primary/10', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-primary/30',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-gradient-to-r from-[#e50914] to-[#b20710]', btnHover: 'hover:from-[#b20710] hover:to-[#b20710] hover:shadow-lg hover:shadow-primary/40'
    };
  }
  if (lowerName.includes('3 ay premium')) {
    return { 
      bgGlow: 'bg-[#e50914]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('3 ay vip')) {
    return { 
      bgGlow: 'bg-[#141414]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('6 ay premium')) {
    return { 
      bgGlow: 'bg-[#e50914]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('6 ay vip')) {
    return { 
      bgGlow: 'bg-[#b20710]', 
      border: 'border-[#b20710]/20', hoverBorder: 'group-hover:border-[#b20710]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#b20710]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-[#b20710]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('12 ay premium')) {
    return { 
      bgGlow: 'bg-[#141414]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  
  // Default fallback theme
  return { 
    bgGlow: 'bg-primary', 
    border: 'border-[#2a2a40]', hoverBorder: 'group-hover:border-primary/50',
    shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-primary/20',
    textGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]',
    btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
  };
};

const fetchPackagesQuery = async (regionValues) => {
  const run = (cols) =>
    supabase
      .from('packages')
      .select(cols)
      .eq('enabled', true)
      .in('region', regionValues);

  let result = await run(PACKAGE_LIST_COLUMNS);
  if (result.error?.message?.includes('column')) {
    result = await run(PACKAGE_LIST_COLUMNS_FALLBACK);
  }
  return result;
};

const PackageCard = memo(({ pkg, isPopular, onOrder, currencySymbol, isDe }) => {
  const [selectedRegion, setSelectedRegion] = useState('tr');
  const pkgName = pkg.name || pkg.title || '';
  const theme = getPackageTheme(pkgName, isPopular);

  const handleOrder = () => {
    trackOrderIntent(pkgName, isDe ? 'packages_de' : 'packages_tr');
    if (pkg.isRegionSelectable ?? pkg.is_region_selectable) {
      const regionNames = {
        'tr': isDe ? 'Türkei' : 'Türkiye',
        'eu': isDe ? 'Europa' : 'Avrupa',
        'tr-eu': isDe ? 'Türkei + Europa' : 'Türkiye + Avrupa'
      };
      
      const modifiedPkg = {
        ...pkg,
        title: `${pkgName} (${regionNames[selectedRegion]})`,
        selectedRegion: selectedRegion
      };
      onOrder(modifiedPkg);
    } else {
      const orderPkg = {
        ...pkg,
        title: pkgName
      };
      onOrder(orderPkg);
    }
  };

  const getSeoDescription = (name) => {
    if (!name) return isDe ? "Zuverlässige IPTV-Preise und Pakete" : "Güvenilir IPTV fiyatları ve paketleri";
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ay')) return isDe ? "Bester IPTV-Abonnementservice" : "En iyi IPTV abonelik hizmeti Türkiye";
    if (lowerName.includes('yıl')) return isDe ? "Unterbrechungsfreier Live-TV-Dienst" : "Kesintisiz canlı TV izleme hizmeti";
    if (lowerName.includes('sınırsız')) return isDe ? "HD und 4K IPTV Streaming" : "HD ve 4K IPTV izleme hizmeti";
    return isDe ? "Zuverlässige IPTV-Preise und Pakete" : "Güvenilir IPTV fiyatları ve paketleri";
  };
  
  const seoDescription = pkg.card_description || getSeoDescription(pkgName);
  const buttonLabel = pkg.button_text || (isDe ? 'Jetzt bestellen' : 'Sipariş Ver');
  const showCustomBadge = pkg.badge_enabled && pkg.badge_text;
  const trustBadges = isDe
    ? ['Sofortige Aktivierung', 'Einrichtungs-Support', 'Alle Geräte']
    : ['Anında aktivasyon', 'Kurulum desteği', 'Tüm cihazlar'];

  return (
    <article className={`luxury-card relative p-6 rounded-3xl border-2 flex flex-col h-full backdrop-blur-sm group z-10 transition-all duration-300 hover:scale-[1.015] ${theme.border} ${theme.hoverBorder} ${theme.shadow} ${theme.hoverShadow} ${isPopular ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-[#0a0a0a] shadow-[0_0_30px_rgba(229,9,20,0.25)] hover:shadow-[0_0_46px_rgba(229,9,20,0.42)] hover:ring-primary/80' : ''}`}>
      {/* Background Subtle Glow Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] ${theme.bgGlow} opacity-[0.02] group-hover:opacity-[0.12] blur-3xl rounded-full pointer-events-none transition-opacity duration-500 -z-10`}></div>

      {/* Öne çıkan / popüler paket */}
      {isPopular && !showCustomBadge && (
        <>
          <div className="absolute inset-0 rounded-xl pointer-events-none -z-10 bg-gradient-to-r from-[#e50914]/10 via-transparent to-[#b20710]/10 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e50914] to-[#b20710] text-white text-xs font-bold px-4 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg shadow-primary/40 z-20 whitespace-nowrap">
            <Star className="w-3 h-3 fill-current animate-pulse" /> {isDe ? 'AM BELIEBTESTEN' : 'EN POPÜLER'}
          </div>
        </>
      )}
      {showCustomBadge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase shadow-lg z-20 whitespace-nowrap">
          {pkg.badge_text}
        </div>
      )}

      <PackageCountdownBadge pkg={pkg} isDe={isDe} />

      <div className="text-center mb-6 pt-4 relative">
        <span className="qruze-premium-seal mb-4">
          {isPopular ? (isDe ? 'Premium Choice' : 'Premium Seçim') : (isDe ? 'Qruze Paket' : 'Qruze Paket')}
        </span>
        <div className="text-[#e50914] font-bold uppercase tracking-widest text-sm mb-2">{pkg.duration}</div>
        {pkg.campaign_label && (
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            {pkg.campaign_label}
          </div>
        )}
        <div className="flex items-center justify-center gap-0.5 relative z-10 flex-wrap">
          {pkg.original_price != null && Number(pkg.original_price) > Number(pkg.price) && (
            <span className="text-lg text-gray-500 line-through mr-2 align-baseline">{currencySymbol}{pkg.original_price}</span>
          )}
          <span className="text-xl text-gray-300 font-semibold align-top mt-1">{currencySymbol}</span>
          <span className="text-5xl font-bold text-white tracking-tight transition-all duration-300 group-hover:animate-pulse-slow">{pkg.price}</span>
        </div>
        <h3 className={`text-gray-200 text-lg mt-3 font-bold transition-all duration-300 ${theme.textGlow}`}>{pkgName}</h3>
        <p className="text-gray-500 text-xs mt-1 italic">{seoDescription}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {trustBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300">
              {badge}
            </span>
          ))}
        </div>
      </div>
      
      {(pkg.isRegionSelectable ?? pkg.is_region_selectable) && (
        <PackageRegionSelector 
          selectedRegion={selectedRegion} 
          onRegionChange={setSelectedRegion} 
        />
      )}

      <div className="flex-grow">
        <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a40] to-transparent mb-6 group-hover:via-[#141414] transition-colors duration-300"></div>
        <ul className="space-y-3 mb-8">
          {(pkg.features || []).slice(0, 6).map((feature, i) => (
            <li key={i} className="flex items-start text-sm text-gray-300 font-medium leading-snug">
              <div className="mr-3 mt-0.5 shrink-0 bg-primary/30 rounded-full p-0.5 group-hover:bg-primary/50 transition-colors duration-300">
                <Check className="w-3 h-3 text-[#e50914]" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
          {(pkg.features || []).length > 6 && (
            <li className="text-xs text-gray-500 pl-8 pt-1 italic">
              +{ (pkg.features.length - 6) } {isDe ? 'weitere Funktionen' : 'özellik daha'}
            </li>
          )}
        </ul>
      </div>

      <Button 
        onClick={handleOrder}
        className={`w-full h-12 rounded-2xl font-bold text-base mt-auto transition-all duration-300 text-white z-10 ${theme.btnBg} ${theme.btnHover}`}
      >
        <Zap className="w-4 h-4 mr-2" />
        {buttonLabel}
      </Button>
    </article>
  );
});

const Packages = ({
  packages: initialPackages,
  title,
  description,
  hideRegions = [],
  showTierFilter = false,
  hideSectionHeader = false,
  packagesPageContent: packagesPageContentProp,
}) => {
  const { openModal } = useOrderModal();
  const { toast } = useToast();
  const location = useLocation();
  const isDe = location.pathname.includes('/de');
  const pageContent = resolvePackagesPageContent(
    packagesPageContentProp ? { packagesPageContent: packagesPageContentProp } : {}
  );
  const tierOptions = getActiveTierOptions(pageContent, isDe);
  const quizConfig = showTierFilter ? resolvePackageQuiz(pageContent, isDe) : { enabled: false };
  const [trPackages, setTrPackages] = useState([]);
  const [euPackages, setEuPackages] = useState([]);
  const [trLoading, setTrLoading] = useState(true);
  const [euLoading, setEuLoading] = useState(false);
  const [trError, setTrError] = useState(null);
  const [euError, setEuError] = useState(null);
  
  const [selectedTier, setSelectedTier] = useState(() =>
    showTierFilter ? getDefaultTier(pageContent) : DEFAULT_PACKAGE_TIER
  );

  const [activeTab, setActiveTab] = useState(() => {
    if (hideRegions.includes('TR')) return 'EU';
    if (showTierFilter) return getDefaultRegionTab(pageContent);
    return 'TR';
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    trackPackagesPageView(searchParams.get('source') || document.referrer || 'direct');
  }, [location.search]);

  useEffect(() => {
    fetchTurkeyPackages();
  }, [initialPackages]);

  useEffect(() => {
    if (activeTab === 'EU' && euPackages.length === 0 && !euLoading && !euError) {
      fetchEuropePackages();
    }
  }, [activeTab]);

  const fetchTurkeyPackages = async (force = false) => {
    setTrLoading(true);
    setTrError(null);
    const fallbackData = STATIC_PACKAGES_TR;
    const cacheKey = 'sb_pub_packages_tr_v3';

    if (!isSupabaseConfigured()) {
      setTrPackages(fallbackData.map(normalizePackage));
      setTrLoading(false);
      return;
    }

    if (!force) {
      const cached = readSessionCache(cacheKey);
      if (cached && Array.isArray(cached) && cached.length >= 0) {
        const rows = (cached.length > 0 ? cached : fallbackData).map(normalizePackage);
        setTrPackages(rows);
        setTrLoading(false);
        return;
      }
    } else {
      removeSessionCacheKey(cacheKey);
    }

    try {
      const { data, error, isFallback } = await executeSupabaseQuery(
        () => fetchPackagesQuery(['TR', 'tr', 'turkiye', 'Türkiye', 'turkey']),
        { retries: 3, context: 'fetch_packages_tr', fallback: fallbackData }
      );

      if (error && isFallback) {
        setTrError(null);
        setTrPackages(sortPackagesForDisplay(fallbackData.map(normalizePackage)));
        showPublicMaintenanceToastOnce(toast);
      } else {
        const rows = sortPackagesForDisplay(
          (data && data.length > 0 ? data : fallbackData).map(normalizePackage)
        );
        if (import.meta.env.DEV) {
          console.log('paket data (TR):', rows);
        }
        setTrPackages(rows);
        if (!isFallback && rows.length >= 0) writeSessionCache(cacheKey, rows);
      }
    } catch (err) {
      console.error("Failed to load Turkey packages:", err);
      setTrError(null);
      setTrPackages(fallbackData.map(normalizePackage));
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setTrLoading(false);
    }
  };

  const fetchEuropePackages = async (force = false) => {
    setEuLoading(true);
    setEuError(null);
    const fallbackData = STATIC_PACKAGES_EU;
    const cacheKey = 'sb_pub_packages_eu_v3';

    if (!isSupabaseConfigured()) {
      setEuPackages(fallbackData.map(normalizePackage));
      setEuLoading(false);
      return;
    }

    if (!force) {
      const cached = readSessionCache(cacheKey);
      if (cached && Array.isArray(cached) && cached.length >= 0) {
        const rows = (cached.length > 0 ? cached : fallbackData).map(normalizePackage);
        setEuPackages(rows);
        setEuLoading(false);
        return;
      }
    } else {
      removeSessionCacheKey(cacheKey);
    }

    try {
      const { data, error, isFallback } = await executeSupabaseQuery(
        () => fetchPackagesQuery(['EU', 'eu', 'europe', 'Avrupa', 'avrupa', 'AVRUPA']),
        { retries: 3, context: 'fetch_packages_eu', fallback: fallbackData }
      );

      if (error && isFallback) {
        setEuError(null);
        setEuPackages(sortPackagesForDisplay(fallbackData.map(normalizePackage)));
        showPublicMaintenanceToastOnce(toast);
      } else {
        const rows = sortPackagesForDisplay(
          (data && data.length > 0 ? data : fallbackData).map(normalizePackage)
        );
        if (import.meta.env.DEV) {
          console.log('paket data (EU):', rows);
        }
        setEuPackages(rows);
        if (!isFallback && rows.length >= 0) writeSessionCache(cacheKey, rows);
      }
    } catch (err) {
      console.error("Failed to load Europe packages:", err);
      setEuError(null);
      setEuPackages(fallbackData.map(normalizePackage));
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setEuLoading(false);
    }
  };

  const handleRetryTurkey = () => fetchTurkeyPackages(true);
  const handleRetryEurope = () => fetchEuropePackages(true);

  if (trLoading && trPackages.length === 0 && !hideRegions.includes('TR')) {
    return (
      <section id="packages" className="qruze-cinema-section py-24 border-t border-[#2a2a40] min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#e50914] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{isDe ? 'Pakete werden geladen...' : 'Paketler yükleniyor...'}</p>
        </div>
      </section>
    );
  }

  const showTabsList = !(hideRegions.includes('TR') && hideRegions.includes('EU')) && (hideRegions.length < 1);

  const displayTrPackages = showTierFilter
    ? filterPackagesByTier(trPackages, selectedTier)
    : trPackages;
  const displayEuPackages = showTierFilter
    ? filterPackagesByTier(euPackages, selectedTier)
    : euPackages;

  const sectionTitle = title ?? (
    isDe ? (
      <>IPTV-Preise und <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">Paketoptionen</span></>
    ) : (
      <>IPTV Fiyatları ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">Paket Seçenekleri</span></>
    )
  );

  const sectionDescription = description ?? (
    isDe
      ? 'Wählen Sie das Paket, das Ihren Anforderungen entspricht, und beginnen Sie sofort zu schauen. Hochwertige, unterbrechungsfreie Streaming-Garantie und erschwingliche Abos.'
      : 'İhtiyacınıza en uygun paketi seçin, anında izlemeye başlayın. Yüksek kalite, donmayan yayın garantisi ve uygun fiyatlı abonelikler.'
  );

  const emptyTierMessage = () => getEmptyPackagesMessage(pageContent, isDe);

  const sectionPadding = showTierFilter ? 'py-8 md:py-10' : 'py-20';
  const sectionBorder = hideSectionHeader ? '' : 'border-t border-[#2a2a40]';

  return (
    <section id="packages" className={`qruze-cinema-section ${sectionPadding} ${sectionBorder} relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#0a0a0a]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {!hideSectionHeader && (
          <div className="text-center mb-12">
            {!showTierFilter && (
              <span className="qruze-premium-seal mb-4">
                {isDe ? 'Premium Abo Lounge' : 'Premium Paket Salonu'}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {sectionDescription}
            </p>
          </div>
        )}

        {showTierFilter && (
          <>
            <div className="flex flex-col items-center">
              <PackageRecommendationQuiz
                quizConfig={quizConfig}
                isDe={isDe}
                tierOptions={tierOptions}
                onApply={({ tier, regionTab }) => {
                  setSelectedTier(tier);
                  if (!hideRegions.includes(regionTab)) {
                    setActiveTab(regionTab);
                  }
                  const el = document.getElementById('packages-list');
                  if (el) {
                    window.requestAnimationFrame(() => {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                  }
                }}
              />
            </div>
            <PackageTierSelector
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              isDe={isDe}
              tierOptions={tierOptions}
            />
            <PackageTierShortDescription
              selectedTier={selectedTier}
              isDe={isDe}
              text={getTierShortDescription(pageContent, selectedTier, isDe)}
            />
          </>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[90rem] mx-auto">
          {showTabsList && (
            <div className={`flex flex-col items-center ${showTierFilter ? 'mb-6' : 'mb-10'}`}>
              {showTierFilter && (
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {isDe ? 'Nutzungsregion' : 'Kullanım Bölgesi'}
                </p>
              )}
              <TabsList className="bg-[#0a0a0a] border border-[#2a2a40] p-1 h-auto rounded-full">
                {!hideRegions.includes('TR') && (
                  <TabsTrigger 
                    value="TR" 
                    className="rounded-full px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-[#e50914] data-[state=active]:text-white transition-all gap-2"
                  >
                    <MapPin className="w-4 h-4" /> {isDe ? 'Türkei Pakete' : 'Türkiye Paketleri'}
                  </TabsTrigger>
                )}
                {!hideRegions.includes('EU') && (
                  <TabsTrigger 
                    value="EU" 
                    className="rounded-full px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-[#e50914] data-[state=active]:text-white transition-all gap-2"
                  >
                    <Globe className="w-4 h-4" /> {isDe ? 'Europa Pakete' : 'Avrupa Paketleri'}
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
          )}

          <TabsContent value="TR" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {trLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#e50914] animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{isDe ? 'Türkei-Pakete werden geladen...' : 'Türkiye paketleri yükleniyor...'}</p>
              </div>
            ) : trError && trPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">{trError}</p>
                <Button onClick={handleRetryTurkey} className="bg-[#e50914] text-white hover:bg-[#b20710]">
                  <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
                </Button>
              </div>
            ) : displayTrPackages.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {trPackages.length === 0
                    ? (isDe ? 'Türkei-Pakete sind noch nicht verfügbar' : 'Türkiye paketleri henüz mevcut değil')
                    : emptyTierMessage()}
                </p>
                <p className="text-gray-600 text-sm mt-2">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {displayTrPackages.map((pkg, idx) => (
                  <PackageCard
                    key={pkg.id || idx}
                    pkg={pkg}
                    isPopular={pkg.popular || pkg.featured}
                    currencySymbol={getPackageCurrencySymbol(pkg, 'TR')}
                    onOrder={(p) => openModal(p, false)}
                    isDe={isDe}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="EU" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {euLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#e50914] animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{isDe ? 'Pakete werden geladen...' : 'Avrupa paketleri yükleniyor...'}</p>
              </div>
            ) : euError && euPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">{euError}</p>
                <Button onClick={handleRetryEurope} className="bg-[#e50914] text-white hover:bg-[#b20710]">
                  <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
                </Button>
              </div>
            ) : displayEuPackages.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {euPackages.length === 0
                    ? (isDe ? 'Europa-Pakete noch nicht verfügbar' : 'Avrupa paketleri henüz mevcut değil')
                    : emptyTierMessage()}
                </p>
                <p className="text-gray-600 text-sm mt-2">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {displayEuPackages.map((pkg, idx) => (
                  <PackageCard
                    key={pkg.id || idx}
                    pkg={pkg}
                    isPopular={pkg.popular || pkg.featured}
                    currencySymbol={getPackageCurrencySymbol(pkg, 'EU')}
                    onOrder={(p) => openModal(p, false)}
                    isDe={isDe}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default memo(Packages);
