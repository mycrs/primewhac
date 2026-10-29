import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Star, Zap, Loader2, Globe, MapPin, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Film } from 'lucide-react';
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

/**
 * 3 Ana Paket Kimliği:
 * 1. Premium Stabil (Emerald/Cyan - Donmayan Altyapı & Canlı TV)
 * 2. 4K Ultra İçerik & Sinema (Radiant Ruby/Gold - 15.000+ VOD & Dolby Atmos - EN ÇOK TERCİH EDİLEN)
 * 3. Global & Dünya Kanalları (Sapphire/Cyan - Tüm Dünya & Küresel Anycast CDN)
 */
const getPackageTheme = (pkg, isPopular, isDe) => {
  const name = (pkg?.name || pkg?.title || '').toLowerCase();
  const tier = (pkg?.tier || '').toLowerCase();

  // 1. 4K Ultra İçerik & Sinema (Flagship)
  if (isPopular || tier === 'cinema' || name.includes('4k') || name.includes('sinema') || name.includes('kino') || name.includes('içerik')) {
    return {
      type: 'cinema',
      seal: isDe ? '4K KINO & VOD-ARCHIV' : '4K SİNEMA & DEV VOD ARŞİVİ',
      badge: isDe ? 'AM BELIEBTESTEN' : 'EN ÇOK TERCİH EDİLEN',
      icon: Film,
      bgGlow: 'bg-[#e50914]',
      border: 'border-[#e50914]/80 shadow-[0_0_50px_rgba(229,9,20,0.3)] ring-1 ring-[#e50914]/50',
      hoverBorder: 'hover:border-[#e50914]',
      cardBg: 'bg-gradient-to-b from-[#1d1214]/95 via-[#130c0e]/95 to-[#090708]/98',
      accentColor: '#ff4b55',
      checkColor: 'text-[#ff4b55]',
      checkBg: 'bg-[#e50914]/20 border-[#e50914]/40',
      btnBg: 'bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white shadow-xl shadow-[#e50914]/40 hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] hover:scale-[1.02]',
      tagline: isDe ? '15.000+ Filme, Serien & 4K Master' : '15.000+ Film, Dizi & 4K Master Yayın',
    };
  }

  // 2. Global & Dünya Kanalları
  if (tier === 'global' || name.includes('global') || name.includes('dünya') || name.includes('welt')) {
    return {
      type: 'global',
      seal: isDe ? 'GLOBALER ZUGRIFF • WELTKANÄLE' : 'KÜRESEL ERİŞİM • DÜNYA KANALLARI',
      badge: isDe ? 'ALLE WELTKANÄLE' : 'TÜM DÜNYA KANALLARI',
      icon: Globe,
      bgGlow: 'bg-blue-600',
      border: 'border-blue-500/40 shadow-[0_0_35px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/25',
      hoverBorder: 'hover:border-blue-400',
      cardBg: 'bg-gradient-to-b from-[#121624]/95 via-[#0c0f18]/95 to-[#07090f]/98',
      accentColor: '#38bdf8',
      checkColor: 'text-blue-400',
      checkBg: 'bg-blue-500/20 border-blue-500/40',
      btnBg: 'bg-white/[0.08] hover:bg-blue-600 text-white border border-white/15 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.01]',
      tagline: isDe ? 'Anycast CDN & Weltweiter Zugriff' : 'Tüm Dünya Kanalları & Küresel CDN',
    };
  }

  // 3. Premium Stabil Paket (Default)
  return {
    type: 'stabil',
    seal: isDe ? 'STABILITÄTS-FOKUS • LIVE-TV' : 'STABİLİTE ODAKLI • CANLI TV',
    badge: isDe ? 'DEDIZIERTE SERVER' : 'DONMAYAN ALTYAPI',
    icon: ShieldCheck,
    bgGlow: 'bg-emerald-600',
    border: 'border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20',
    hoverBorder: 'hover:border-emerald-400',
    cardBg: 'bg-gradient-to-b from-[#101b17]/95 via-[#0b1210]/95 to-[#060b09]/98',
    accentColor: '#34d399',
    checkColor: 'text-emerald-400',
    checkBg: 'bg-emerald-500/20 border-emerald-500/40',
    btnBg: 'bg-white/[0.08] hover:bg-emerald-600 text-white border border-white/15 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 hover:scale-[1.01]',
    tagline: isDe ? 'Anti-Freeze v4 & Dedizierte Server' : 'Anti-Freeze v4 & Kesintisiz Canlı TV',
  };
};

const fetchPackagesQuery = async (regionValues) => {
  const run = (cols) =>
    supabase
      .from('packages')
      .select(cols)
      .eq('enabled', true)
      .in('region', regionValues)
      .order('sort_order', { ascending: true });

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
  const theme = getPackageTheme(pkg, isPopular, isDe);
  const IconComponent = theme.icon;

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
        title: `${displayName} (${regionNames[selectedRegion]} - ${displayDuration})`,
        selectedRegion: selectedRegion
      };
      onOrder(modifiedPkg);
    } else {
      const orderPkg = {
        ...pkg,
        title: `${displayName} (${displayDuration})`
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
    <article className={`relative p-5 md:p-7 rounded-2xl md:rounded-3xl border flex flex-col h-full backdrop-blur-2xl transition-all duration-300 group z-10 ${theme.cardBg} ${theme.border} ${theme.hoverBorder} ${theme.type === 'cinema' ? 'md:-translate-y-2' : ''}`}>
      {/* Background Subtle Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] ${theme.bgGlow} opacity-[0.04] group-hover:opacity-[0.16] blur-3xl rounded-full pointer-events-none transition-opacity duration-500 -z-10`} />

      {/* Popüler Paket / Özel Rozet */}
      {theme.type === 'cinema' && !showCustomBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white text-[10px] md:text-[11px] font-black px-4 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-xl shadow-[#e50914]/40 z-20 whitespace-nowrap border border-white/25 tracking-wider">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
          <span>{theme.badge}</span>
        </div>
      )}
      {showCustomBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] md:text-[11px] font-black px-4 py-1 rounded-full uppercase shadow-xl z-20 whitespace-nowrap border border-white/30 tracking-wider">
          {localizePackageText(pkg.badge_text, isDe)}
        </div>
      )}

      <PackageCountdownBadge pkg={pkg} isDe={isDe} />

      {/* Header Info */}
      <div className="text-center mb-2 pt-1 md:pt-2 relative">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <IconComponent className="w-4 h-4" style={{ color: theme.accentColor }} />
          <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold" style={{ color: theme.accentColor }}>
            {theme.seal}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
          {displayName}
        </h3>

        {/* Dynamic Tagline */}
        <p className="text-slate-400 text-xs mt-1 mb-2">
          {theme.tagline}
        </p>

        {/* Duration Sub-pill */}
        <div className="inline-block px-3 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-white font-bold text-xs mb-2">
          {displayDuration}
        </div>
        
        {/* Price Display */}
        <div className="flex items-baseline justify-center gap-1 my-1 md:my-2">
          {pkg.original_price != null && Number(pkg.original_price) > Number(pkg.price) && (
            <span className="text-sm md:text-base text-slate-500 line-through mr-1 font-semibold">{currencySymbol}{pkg.original_price}</span>
          )}
          <span className="text-lg md:text-2xl text-slate-400 font-extrabold">{currencySymbol}</span>
          <span className="font-display text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm">{pkg.price}</span>
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
          {displayFeatures.slice(0, 6).map((feature, i) => (
            <li key={i} className="flex items-start text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              <div className={`mr-2.5 mt-0.5 shrink-0 w-4 h-4 rounded-full ${theme.checkBg} flex items-center justify-center`}>
                <Check className={`w-2.5 h-2.5 ${theme.checkColor}`} />
              </div>
              <span className="line-clamp-2">{feature}</span>
            </li>
          ))}
          {displayFeatures.length > 6 && (
            <li className="text-[11px] text-slate-400 pl-6 pt-0.5 italic">
              +{ (displayFeatures.length - 6) } {isDe ? 'weitere Funktionen' : 'özellik daha'}
            </li>
          )}
        </ul>
      </div>

      {/* Action / Buy Button */}
      <div className="mt-auto pt-4 shrink-0 w-full z-20">
        <Button 
          onClick={handleOrder}
          className={`w-full h-12 md:h-13 rounded-xl md:rounded-2xl font-black text-sm md:text-base tracking-wide shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${theme.btnBg}`}
        >
          <Zap className="w-4 h-4 fill-current mr-1" />
          <span>{buttonLabel}</span>
        </Button>
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 mt-2.5 font-medium">
          <span>🔒 {isDe ? '256-Bit SSL Verschlüsselung' : '256-Bit SSL Güvenli'}</span>
          <span>•</span>
          <span>⚡ {isDe ? 'Sofort-Aktivierung' : 'Anında Aktivasyon'}</span>
        </div>
      </div>
    </article>
  );
});

const PackagesShowcase = memo(({ packages, currencySymbol, onOrder, isDe, regionKey }) => {
  // Extract all available durations: 3 Ay, 6 Ay, 12 Ay, 15 Ay
  const durationOrder = ['3 Ay', '6 Ay', '12 Ay', '15 Ay'];
  const availableDurations = durationOrder.filter((d) =>
    packages.some((p) => (p.duration || '').trim().toLowerCase() === d.toLowerCase())
  );
  
  // Default to 12 Ay (most popular) or first available
  const initialDuration = availableDurations.includes('12 Ay')
    ? '12 Ay'
    : (availableDurations[0] || '12 Ay');

  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const mobileScrollRef = useRef(null);

  // Filter packages for the selected duration
  const currentDurationPackages = packages.filter(
    (p) => (p.duration || '').trim().toLowerCase() === selectedDuration.toLowerCase()
  );

  // If none match duration, show all packages
  const displayPackages = currentDurationPackages.length > 0 ? currentDurationPackages : packages;

  // Active card index for mobile dots
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const container = mobileScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.children[0]?.offsetWidth || 300;
    const newIdx = Math.round(scrollLeft / cardWidth);
    if (newIdx >= 0 && newIdx < displayPackages.length && newIdx !== mobileActiveIdx) {
      setMobileActiveIdx(newIdx);
    }
  }, [displayPackages.length, mobileActiveIdx]);

  const handleScrollToCard = (idx) => {
    setMobileActiveIdx(idx);
    if (mobileScrollRef.current) {
      const targetCard = mobileScrollRef.current.children[idx];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  if (!packages || packages.length === 0) return null;

  return (
    <div key={`${regionKey}-${packages.length}`} className="relative w-full py-2">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#e50914]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Duration Switcher (Süre Seçimi: 3 Ay, 6 Ay, 12 Ay Yıllık, 15 Ay) */}
      {availableDurations.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar px-2 mb-6">
          {availableDurations.map((dur) => {
            const isSelected = selectedDuration === dur;
            const isVip = dur.includes('12') || dur.includes('15');
            const displayLabel = localizePackageText(dur, isDe);

            return (
              <button
                key={dur}
                type="button"
                onClick={() => {
                  setSelectedDuration(dur);
                  setMobileActiveIdx(0);
                }}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 border active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white border-white/30 shadow-lg shadow-[#e50914]/40 scale-105 ring-2 ring-[#e50914]/50'
                    : 'bg-[#121218]/90 text-slate-400 border-white/10 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {isVip && <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" />}
                <span>{displayLabel}</span>
                {dur.includes('12') && (
                  <span className="text-[10px] font-black bg-black/60 px-2 py-0.5 rounded-full text-amber-300 tracking-wide uppercase">
                    {isDe ? 'EMPFOHLEN' : 'EN AVANTAJLI'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop Responsive Grid (The 3 Packages side-by-side: Stabil, 4K Sinema, Global) */}
      <div 
        className="hidden md:grid gap-6 lg:gap-8 items-stretch w-full"
        style={{
          gridTemplateColumns: displayPackages.length <= 2
            ? `repeat(${displayPackages.length}, minmax(320px, 420px))`
            : displayPackages.length === 3
              ? 'repeat(3, minmax(0, 1fr))'
              : 'repeat(auto-fit, minmax(280px, 1fr))',
          justifyContent: 'center'
        }}
      >
        {displayPackages.map((pkg, idx) => {
          const isPopular = pkg.popular || (pkg.tier === 'cinema');
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
        {displayPackages.map((pkg, idx) => {
          const isPopular = pkg.popular || (pkg.tier === 'cinema');
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
        {displayPackages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleScrollToCard(idx)}
            aria-label={`Paket ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              mobileActiveIdx === idx
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
    const cacheKey = 'sb_pub_packages_tr_v5';

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
    const cacheKey = 'sb_pub_packages_eu_v5';

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
          {/* Unified Clean Filter Bar: Region + Quiz Helper */}
          <div className="flex flex-col items-center gap-2.5 mb-4 md:mb-6">
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
              <div className="mt-1">
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
              </div>
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
            ) : trPackages.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-base">
                  {isDe ? 'Türkei-Pakete sind noch nicht verfügbar' : 'Türkiye paketleri henüz mevcut değil'}
                </p>
                <p className="text-slate-500 text-xs mt-1.5">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <PackagesShowcase
                packages={trPackages}
                currencySymbol={getPackageCurrencySymbol(trPackages[0] || {}, 'TR')}
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
            ) : euPackages.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-base">
                  {isDe ? 'Europa-Pakete noch nicht verfügbar' : 'Avrupa paketleri henüz mevcut değil'}
                </p>
                <p className="text-slate-500 text-xs mt-1.5">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <PackagesShowcase
                packages={euPackages}
                currencySymbol={getPackageCurrencySymbol(euPackages[0] || {}, 'EU')}
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
