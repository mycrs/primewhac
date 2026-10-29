import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Star, Zap, Loader2, Globe, MapPin, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  if (isPopular || lowerName.includes('12 ay vip') || lowerName.includes('15 ay')) {
    return { 
      bgGlow: 'bg-[#e50914]', 
      border: 'border-[#e50914]/60', hoverBorder: 'group-hover:border-[#e50914]',
      shadow: 'shadow-lg shadow-[#e50914]/20', hoverShadow: 'group-hover:shadow-2xl group-hover:shadow-[#e50914]/30',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710]', btnHover: 'hover:shadow-[0_0_30px_rgba(229,9,20,0.6)]'
    };
  }
  return { 
    bgGlow: 'bg-white', 
    border: 'border-white/10', hoverBorder: 'group-hover:border-white/30',
    shadow: 'shadow-md shadow-black/40', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-black/60',
    textGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]',
    btnBg: 'bg-white/[0.08] hover:bg-[#e50914]', btnHover: 'hover:border-[#e50914]'
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

const PACKAGE_TEXT_DE = new Map([
  ['Hemen Sipariş Ver', 'Jetzt bestellen'],
  ['4K/UHD Yayınlar', '4K/UHD-Streams'],
  ['Donmayan Sunucu', 'Stabile Server'],
  ['7/24 Destek', '24/7 Support'],
  ['Mobil & Smart TV', 'Mobilgeräte & Smart TV'],
  ['Geri Sarma Özelliği', 'Catch-up-Funktion'],
  ['Tüm Cihazlar', 'Alle Geräte'],
  ['Anında Aktivasyon', 'Sofortige Aktivierung'],
  ['Sınırsız İzleme', 'Unbegrenztes Streaming'],
  ['Premium Seçim', 'Premium-Auswahl'],
  ['Qruze Paket', 'Qruze-Paket']
]);

const localizePackageText = (value, isDe) => {
  if (!isDe || value == null) return value;
  const source = String(value).trim();
  if (PACKAGE_TEXT_DE.has(source)) return PACKAGE_TEXT_DE.get(source);

  return source
    .replace(/\b1\s*Yıl\b/gi, '1 Jahr')
    .replace(/\b(\d+)\s*Yıl\b/gi, '$1 Jahre')
    .replace(/\b(\d+)\s*Ay\b/gi, '$1 Monate')
    .replace(/Yıllık/gi, 'Jährlich')
    .replace(/Aylık/gi, 'Monatlich')
    .replace(/Yayınlar/gi, 'Streams')
    .replace(/Kanal/gi, 'Sender')
    .replace(/Destek/gi, 'Support');
};

const PackageCard = memo(({ pkg, isPopular, onOrder, currencySymbol, isDe }) => {
  const [selectedRegion, setSelectedRegion] = useState('tr');
  const pkgName = pkg.name || pkg.title || '';
  const displayName = localizePackageText(pkgName, isDe);
  const displayDuration = localizePackageText(pkg.duration, isDe);
  const displayFeatures = (pkg.features || []).map((feature) => localizePackageText(feature, isDe));
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
        title: `${displayName} (${regionNames[selectedRegion]})`,
        selectedRegion: selectedRegion
      };
      onOrder(modifiedPkg);
    } else {
      const orderPkg = {
        ...pkg,
        title: displayName
      };
      onOrder(orderPkg);
    }
  };

  const buttonLabel = localizePackageText(pkg.button_text, isDe) || (isDe ? 'Jetzt bestellen' : 'Hemen Sipariş Ver');
  const showCustomBadge = pkg.badge_enabled && pkg.badge_text;

  const getMonthlyBreakdown = (price, duration) => {
    const numPrice = Number(price);
    if (!numPrice || isNaN(numPrice)) return null;
    const d = String(duration || '').toLowerCase();
    let months = 1;
    if (d.includes('24') || d.includes('2 yıl')) months = 24;
    else if (d.includes('15')) months = 15;
    else if (d.includes('12') || d.includes('1 yıl') || d.includes('yıllık') || d.includes('jahr')) months = 12;
    else if (d.includes('6')) months = 6;
    else if (d.includes('3')) months = 3;
    if (months <= 1) return null;
    return Math.round(numPrice / months);
  };

  const monthlyBreakdown = getMonthlyBreakdown(pkg.price, pkg.duration || pkgName);

  return (
    <article className={`relative p-5 md:p-7 rounded-2xl md:rounded-3xl border flex flex-col h-full backdrop-blur-2xl transition-all duration-300 group z-10 ${
      isPopular
        ? 'bg-gradient-to-b from-[#1c1214]/95 via-[#120c0e]/95 to-[#090708]/98 border-[#e50914]/70 shadow-[0_0_40px_rgba(229,9,20,0.22)] ring-1 ring-[#e50914]/40 hover:border-[#e50914] hover:shadow-[0_0_55px_rgba(229,9,20,0.38)]'
        : 'bg-gradient-to-b from-[#15151e]/95 via-[#0e0e13]/95 to-[#08080a]/98 border-white/[0.08] hover:border-white/20 hover:shadow-2xl hover:shadow-black/60'
    }`}>
      {/* Background Subtle Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] ${theme.bgGlow} opacity-[0.03] group-hover:opacity-[0.14] blur-3xl rounded-full pointer-events-none transition-opacity duration-500 -z-10`} />

      {/* Popüler Paket Rozeti */}
      {isPopular && !showCustomBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white text-[10px] md:text-[11px] font-black px-3.5 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-xl shadow-[#e50914]/40 z-20 whitespace-nowrap border border-white/25 tracking-wider">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300 animate-pulse" />
          <span>{isDe ? 'AM BELIEBTESTEN' : 'EN ÇOK TERCİH EDİLEN'}</span>
        </div>
      )}
      {showCustomBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] md:text-[11px] font-black px-3.5 py-1 rounded-full uppercase shadow-xl z-20 whitespace-nowrap border border-white/30 tracking-wider">
          {localizePackageText(pkg.badge_text, isDe)}
        </div>
      )}

      <PackageCountdownBadge pkg={pkg} isDe={isDe} />

      {/* Header Info */}
      <div className="text-center mb-2 pt-1 md:pt-2 relative">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-400 block mb-1">
          {isPopular ? (isDe ? 'VIP PREMIUM SELEKTION' : 'VIP PREMIUM PLAN') : (isDe ? 'STANDARD PLAN' : 'STANDART PLAN')}
        </span>

        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
          {displayDuration || displayName}
        </h3>

        {/* Clean Campaign / Notice Tag (Refined from muddy box) */}
        {pkg.campaign_label && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-[10px] md:text-[11px] font-medium my-1.5">
            <MapPin className="w-3 h-3 text-[#ff4b55] shrink-0" />
            <span className="line-clamp-1">{pkg.campaign_label}</span>
          </div>
        )}
        
        {/* Price Display */}
        <div className="flex items-baseline justify-center gap-1 my-1.5 md:my-2">
          {pkg.original_price != null && Number(pkg.original_price) > Number(pkg.price) && (
            <span className="text-sm md:text-base text-slate-500 line-through mr-1 font-semibold">{currencySymbol}{pkg.original_price}</span>
          )}
          <span className="text-lg md:text-2xl text-slate-400 font-extrabold">{currencySymbol}</span>
          <span className="font-display text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">{pkg.price}</span>
        </div>

        {/* Monthly Breakdown Tag */}
        {monthlyBreakdown && (
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] md:text-xs font-bold shadow-sm">
            <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400 shrink-0" />
            <span>
              {isDe
                ? `Nur ~${currencySymbol}${monthlyBreakdown} / Monat`
                : `Aylık sadece ~${currencySymbol}${monthlyBreakdown}`}
            </span>
          </div>
        )}
      </div>
      
      {(pkg.isRegionSelectable ?? pkg.is_region_selectable) && (
        <PackageRegionSelector 
          selectedRegion={selectedRegion} 
          onRegionChange={setSelectedRegion} 
        />
      )}

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3 md:my-4" />

      {/* Features List */}
      <div className="flex-grow my-1">
        <ul className="space-y-2 md:space-y-2.5">
          {displayFeatures.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-start text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              <div className="mr-2.5 mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center group-hover:bg-[#e50914] group-hover:border-[#e50914] transition-colors">
                <Check className="w-2.5 h-2.5 text-[#ff4b55] group-hover:text-white transition-colors" />
              </div>
              <span className="line-clamp-2">{feature}</span>
            </li>
          ))}
          {displayFeatures.length > 5 && (
            <li className="text-[11px] text-slate-400 pl-6 pt-0.5 italic">
              +{ (displayFeatures.length - 5) } {isDe ? 'weitere Funktionen' : 'özellik daha'}
            </li>
          )}
        </ul>
      </div>

      {/* Action / Buy Button */}
      <div className="mt-auto pt-3 md:pt-4 shrink-0 w-full z-20">
        <Button 
          onClick={handleOrder}
          className={`w-full h-11 md:h-13 rounded-xl md:rounded-2xl font-black text-sm md:text-base tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            isPopular
              ? 'bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white shadow-[#e50914]/35 hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] hover:scale-[1.02]'
              : 'bg-white/[0.08] hover:bg-[#e50914] text-white border border-white/15 hover:border-[#e50914] hover:shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:scale-[1.01]'
          }`}
        >
          <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 mr-1" />
          <span>{buttonLabel}</span>
        </Button>
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 mt-2 font-medium">
          <span>🔒 {isDe ? '256-Bit SSL Verschlüsselung' : '256-Bit SSL Güvenli'}</span>
          <span>•</span>
          <span>⚡ {isDe ? 'Sofort-Aktivierung' : 'Anında Aktivasyon'}</span>
        </div>
      </div>
    </article>
  );
});

const PackagesShowcase = memo(({ packages, currencySymbol, onOrder, isDe, regionKey }) => {
  const popularIndex = Math.max(0, packages.findIndex((p) => p.popular || p.featured));
  const [activeIdx, setActiveIdx] = useState(popularIndex !== -1 ? popularIndex : 0);
  const mobileScrollRef = useRef(null);

  // Reset active index when packages or region change
  useEffect(() => {
    const popIdx = Math.max(0, packages.findIndex((p) => p.popular || p.featured));
    setActiveIdx(popIdx !== -1 ? popIdx : 0);
  }, [packages, regionKey]);

  const handleSelectPackage = (idx) => {
    setActiveIdx(idx);
    if (mobileScrollRef.current) {
      const targetCard = mobileScrollRef.current.children[idx];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0]?.offsetWidth || 300;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx >= 0 && newIdx < packages.length && newIdx !== activeIdx) {
      setActiveIdx(newIdx);
    }
  }, [packages.length, activeIdx]);

  if (!packages || packages.length === 0) return null;

  return (
    <div key={`${regionKey}-${packages.length}`} className="relative w-full py-2">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#e50914]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Mobile Quick-Duration Switcher */}
      <div className="flex md:hidden items-center justify-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar px-2 mb-2">
        {packages.map((pkg, idx) => {
          const isSelected = activeIdx === idx;
          const isPopular = pkg.popular || pkg.featured;
          const durationLabel = localizePackageText(pkg.duration || pkg.name || '', isDe);
          return (
            <button
              key={pkg.id || idx}
              type="button"
              onClick={() => handleSelectPackage(idx)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 border active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white border-white/30 shadow-lg shadow-[#e50914]/40 scale-105'
                  : 'bg-[#141419] text-slate-400 border-white/10 hover:text-white hover:bg-[#1a1a22]'
              }`}
            >
              {isPopular && <Star className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" />}
              <span>{durationLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Responsive Grid (All packages visible side-by-side at a glance) */}
      <div 
        className="hidden md:grid gap-6 items-stretch w-full"
        style={{
          gridTemplateColumns: packages.length <= 2
            ? `repeat(${packages.length}, minmax(320px, 400px))`
            : packages.length === 3
              ? 'repeat(3, minmax(0, 1fr))'
              : 'repeat(auto-fit, minmax(260px, 1fr))',
          justifyContent: 'center'
        }}
      >
        {packages.map((pkg, idx) => {
          const isPopular = pkg.popular || pkg.featured;
          return (
            <div key={pkg.id || idx} className="flex flex-col h-full">
              <PackageCard
                pkg={pkg}
                isPopular={isPopular}
                currencySymbol={currencySymbol}
                onOrder={onOrder}
                isDe={isDe}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile Native Smooth Swiper with CSS Snap */}
      <div
        ref={mobileScrollRef}
        onScroll={handleMobileScroll}
        className="flex md:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-4 px-4 pb-4 pt-1"
      >
        {packages.map((pkg, idx) => {
          const isPopular = pkg.popular || pkg.featured;
          return (
            <div
              key={pkg.id || idx}
              className="snap-center shrink-0 w-[85vw] max-w-[340px] flex flex-col"
            >
              <PackageCard
                pkg={pkg}
                isPopular={isPopular}
                currencySymbol={currencySymbol}
                onOrder={onOrder}
                isDe={isDe}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile Pagination Indicator Dots */}
      <div className="flex md:hidden items-center justify-center gap-1.5 mt-2">
        {packages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPackage(idx)}
            aria-label={`Paket ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIdx === idx
                ? 'w-6 bg-[#e50914]'
                : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
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
    const cacheKey = 'sb_pub_packages_tr_v4';

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
    const cacheKey = 'sb_pub_packages_eu_v4';

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
      <section id="packages" className="qruze-cinema-section py-24 border-t border-white/5 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#e50914] animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">{isDe ? 'Pakete werden geladen...' : 'Paketler yükleniyor...'}</p>
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
      ? 'Wählen Sie das passende Paket und testen Sie die Streaming-Qualität vor dem Kauf auf Ihrem eigenen Gerät.'
      : 'İhtiyacınıza uygun paketi seçin; satın almadan önce yayın kalitesini kendi cihazınızda ücretsiz test edin.'
  );

  const emptyTierMessage = () => getEmptyPackagesMessage(pageContent, isDe);

  const sectionPadding = showTierFilter ? 'py-6 md:py-14' : 'py-10 md:py-18';
  const sectionBorder = hideSectionHeader ? '' : 'border-t border-white/5';

  return (
    <section id="packages" className={`qruze-cinema-section ${sectionPadding} ${sectionBorder} relative`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#0a0a0a]/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {!hideSectionHeader && (
          <div className="text-center mb-4 md:mb-8">
            {!showTierFilter && (
              <span className="qruze-premium-seal mb-2">
                {isDe ? 'Premium Abo Lounge' : 'Premium Paket Salonu'}
              </span>
            )}
            <h2 className="section-title text-2xl md:text-5xl mb-2 md:mb-3">
              {sectionTitle}
            </h2>
            <p className="section-lead mx-auto text-center text-xs md:text-base max-w-2xl text-slate-300">
              {sectionDescription}
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Unified Clean Filter Bar: Region + Quiz + Tiers */}
          <div className="flex flex-col items-center gap-2.5 mb-4 md:mb-8">
            {showTabsList && (
              <TabsList className="bg-[#121218]/90 border border-white/10 p-1.5 h-auto rounded-full shadow-inner">
                {!hideRegions.includes('TR') && (
                  <TabsTrigger 
                    value="TR" 
                    className="rounded-full px-5 py-2 text-xs md:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e50914] data-[state=active]:to-[#b20710] data-[state=active]:text-white text-slate-400 hover:text-white transition-all gap-2"
                  >
                    <span className="text-base leading-none">🇹🇷</span> {isDe ? 'Türkei Pakete' : 'Türkiye Paketleri'}
                  </TabsTrigger>
                )}
                {!hideRegions.includes('EU') && (
                  <TabsTrigger 
                    value="EU" 
                    className="rounded-full px-5 py-2 text-xs md:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#e50914] data-[state=active]:to-[#b20710] data-[state=active]:text-white text-slate-400 hover:text-white transition-all gap-2"
                  >
                    <span className="text-base leading-none">🇪🇺</span> {isDe ? 'Europa Pakete' : 'Avrupa Paketleri'}
                  </TabsTrigger>
                )}
              </TabsList>
            )}

            {showTierFilter && (
              <>
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
                <PackageRecommendationQuiz
                  quizConfig={quizConfig}
                  isDe={isDe}
                  tierOptions={tierOptions}
                  onApply={({ tier, regionTab }) => {
                    setSelectedTier(tier);
                    if (!hideRegions.includes(regionTab)) {
                      setActiveTab(regionTab);
                    }
                    const el = document.getElementById('packages');
                    if (el) {
                      window.requestAnimationFrame(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      });
                    }
                  }}
                />
              </>
            )}
          </div>

          <TabsContent value="TR" className="mt-0 animate-in fade-in duration-300">
            {trLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-[#e50914] animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">{isDe ? 'Türkei-Pakete werden geladen...' : 'Türkiye paketleri yükleniyor...'}</p>
              </div>
            ) : trError && trPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-slate-400 mb-4 text-sm">{trError}</p>
                <Button onClick={handleRetryTurkey} className="bg-[#e50914] text-white hover:bg-[#b20710] rounded-xl text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
                </Button>
              </div>
            ) : displayTrPackages.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-base">
                  {trPackages.length === 0
                    ? (isDe ? 'Türkei-Pakete sind noch nicht verfügbar' : 'Türkiye paketleri henüz mevcut değil')
                    : emptyTierMessage()}
                </p>
                <p className="text-slate-500 text-xs mt-1.5">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <PackagesShowcase
                packages={displayTrPackages}
                currencySymbol={getPackageCurrencySymbol(displayTrPackages[0] || {}, 'TR')}
                onOrder={(p) => openModal(p, false)}
                isDe={isDe}
                regionKey="TR"
              />
            )}
          </TabsContent>

          <TabsContent value="EU" className="mt-0 animate-in fade-in duration-300">
            {euLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-[#e50914] animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">{isDe ? 'Pakete werden geladen...' : 'Avrupa paketleri yükleniyor...'}</p>
              </div>
            ) : euError && euPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-slate-400 mb-4 text-sm">{euError}</p>
                <Button onClick={handleRetryEurope} className="bg-[#e50914] text-white hover:bg-[#b20710] rounded-xl text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
                </Button>
              </div>
            ) : displayEuPackages.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-base">
                  {euPackages.length === 0
                    ? (isDe ? 'Europa-Pakete noch nicht verfügbar' : 'Avrupa paketleri henüz mevcut değil')
                    : emptyTierMessage()}
                </p>
                <p className="text-slate-500 text-xs mt-1.5">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <PackagesShowcase
                packages={displayEuPackages}
                currencySymbol={getPackageCurrencySymbol(displayEuPackages[0] || {}, 'EU')}
                onOrder={(p) => openModal(p, false)}
                isDe={isDe}
                regionKey="EU"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default memo(Packages);
