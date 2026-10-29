
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Star, Zap, Loader2, Globe, MapPin, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, ArrowRight, Sparkles, MousePointer2 } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
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
      btnBg: 'bg-[#1a1a1a] border border-[#262626]', btnHover: 'hover:bg-[#2a2a2a] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('3 ay vip')) {
    return { 
      bgGlow: 'bg-[#141414]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1a1a1a] border border-[#262626]', btnHover: 'hover:bg-[#2a2a2a] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('6 ay premium')) {
    return { 
      bgGlow: 'bg-[#e50914]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1a1a1a] border border-[#262626]', btnHover: 'hover:bg-[#2a2a2a] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('6 ay vip')) {
    return { 
      bgGlow: 'bg-[#b20710]', 
      border: 'border-[#b20710]/20', hoverBorder: 'group-hover:border-[#b20710]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#b20710]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1a1a1a] border border-[#262626]', btnHover: 'hover:bg-[#2a2a2a] hover:border-[#b20710]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  if (lowerName.includes('12 ay premium')) {
    return { 
      bgGlow: 'bg-[#141414]', 
      border: 'border-[#e50914]/20', hoverBorder: 'group-hover:border-[#e50914]/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-[#e50914]/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.8)]',
      btnBg: 'bg-[#1a1a1a] border border-[#262626]', btnHover: 'hover:bg-[#2a2a2a] hover:border-[#e50914]/50 hover:shadow-lg hover:shadow-[#b20710]/30'
    };
  }
  
  // Default fallback theme
  return { 
    bgGlow: 'bg-primary', 
    border: 'border-[#262626]', hoverBorder: 'group-hover:border-primary/50',
    shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-primary/20',
    textGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]',
    btnBg: 'bg-[#1a1a1a] border border-[#262626]', btnHover: 'hover:bg-[#2a2a2a] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
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

  const getSeoDescription = (name) => {
    if (!name) return isDe ? "Zuverlässige IPTV-Preise und Pakete" : "Güvenilir IPTV fiyatları ve paketleri";
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ay')) return isDe ? "Bester IPTV-Abonnementservice" : "En iyi IPTV abonelik hizmeti Türkiye";
    if (lowerName.includes('yıl')) return isDe ? "Unterbrechungsfreier Live-TV-Dienst" : "Kesintisiz canlı TV izleme hizmeti";
    if (lowerName.includes('sınırsız')) return isDe ? "HD und 4K IPTV Streaming" : "HD ve 4K IPTV izleme hizmeti";
    return isDe ? "Zuverlässige IPTV-Preise und Pakete" : "Güvenilir IPTV fiyatları ve paketleri";
  };
  
  const seoDescription = isDe
    ? getSeoDescription(pkgName)
    : (pkg.card_description || getSeoDescription(pkgName));
  const buttonLabel = localizePackageText(pkg.button_text, isDe) || (isDe ? 'Jetzt bestellen' : 'Hemen Sipariş Ver');
  const showCustomBadge = pkg.badge_enabled && pkg.badge_text;
  const trustBadges = isDe
    ? ['Sofortige Aktivierung', 'Support 7/24', 'Alle Geräte']
    : ['Anında aktivasyon', '7/24 Destek', 'Tüm cihazlar'];

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
    <article className={`luxury-card relative p-5 md:p-6 rounded-3xl border-2 flex flex-col h-full backdrop-blur-md group z-10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${theme.border} ${theme.hoverBorder} ${theme.shadow} ${theme.hoverShadow} ${isPopular ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-[#0a0a0a] shadow-[0_0_30px_rgba(229,9,20,0.25)] hover:shadow-[0_0_46px_rgba(229,9,20,0.42)] hover:ring-primary/80' : ''}`}>
      {/* Background Subtle Glow Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] ${theme.bgGlow} opacity-[0.03] group-hover:opacity-[0.14] blur-3xl rounded-full pointer-events-none transition-opacity duration-500 -z-10`}></div>

      {/* Öne çıkan / popüler paket rozeti */}
      {isPopular && !showCustomBadge && (
        <>
          <div className="absolute inset-0 rounded-3xl pointer-events-none -z-10 bg-gradient-to-r from-[#e50914]/10 via-transparent to-[#b20710]/10 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e50914] to-[#b20710] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-lg shadow-primary/50 z-20 whitespace-nowrap border border-white/20">
            <Star className="w-3 h-3 fill-current animate-pulse" /> {isDe ? 'AM BELIEBTESTEN' : 'EN ÇOK TERCİH EDİLEN'}
          </div>
        </>
      )}
      {showCustomBadge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase shadow-lg z-20 whitespace-nowrap border border-white/20">
          {localizePackageText(pkg.badge_text, isDe)}
        </div>
      )}

      <PackageCountdownBadge pkg={pkg} isDe={isDe} />

      {/* Header Info */}
      <div className="text-center mb-4 pt-2 relative">
        <span className="qruze-premium-seal mb-2 text-[10px] tracking-widest uppercase">
          {isPopular ? (isDe ? 'Premium-Auswahl' : 'Premium Seçim') : (isDe ? 'Qruze-Paket' : 'Qruze Paket')}
        </span>
        <div className="text-[#e50914] font-black uppercase tracking-widest text-sm mb-1">{displayDuration}</div>
        {pkg.campaign_label && (
          <div className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
            {pkg.campaign_label}
          </div>
        )}
        
        {/* Price Display */}
        <div className="flex items-center justify-center gap-1 relative z-10 flex-wrap my-1">
          {pkg.original_price != null && Number(pkg.original_price) > Number(pkg.price) && (
            <span className="text-base text-gray-500 line-through mr-1 align-baseline">{currencySymbol}{pkg.original_price}</span>
          )}
          <span className="text-xl text-gray-300 font-bold align-top mt-1">{currencySymbol}</span>
          <span className="font-display text-4xl md:text-5xl font-black text-white tracking-tight transition-all duration-300 group-hover:animate-pulse-slow">{pkg.price}</span>
        </div>

        {monthlyBreakdown && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mt-1 shadow-sm">
            <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400 shrink-0" />
            <span>
              {isDe
                ? `Nur ~${currencySymbol}${monthlyBreakdown} / Monat`
                : `Aylık sadece ~${currencySymbol}${monthlyBreakdown}`}
            </span>
          </div>
        )}

        <p className={`text-gray-100 text-base md:text-lg mt-2 font-bold transition-all duration-300 ${theme.textGlow}`}>{displayName}</p>
        <p className="text-gray-400 text-[11px] mt-0.5 italic line-clamp-1">{seoDescription}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {trustBadges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-300">
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

      {/* Features List */}
      <div className="flex-grow my-3">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-3.5"></div>
        <ul className="space-y-2">
          {displayFeatures.slice(0, 5).map((feature, i) => (
            <li key={i} className="flex items-start text-xs md:text-sm text-gray-300 font-medium leading-snug">
              <div className="mr-2.5 mt-0.5 shrink-0 bg-primary/30 rounded-full p-0.5 group-hover:bg-primary/50 transition-colors duration-300">
                <Check className="w-3 h-3 text-[#e50914]" />
              </div>
              <span className="line-clamp-2">{feature}</span>
            </li>
          ))}
          {displayFeatures.length > 5 && (
            <li className="text-[11px] text-gray-400 pl-6 pt-0.5 italic">
              +{ (displayFeatures.length - 5) } {isDe ? 'weitere Funktionen' : 'özellik daha'}
            </li>
          )}
        </ul>
      </div>

      {/* Guaranteed Visible Buy / Order Button */}
      <div className="mt-auto pt-3 shrink-0 w-full z-20">
        <Button 
          onClick={handleOrder}
          className={`w-full h-12 md:h-13 rounded-2xl font-extrabold text-base shadow-xl shadow-primary/30 transition-all duration-300 text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${theme.btnBg} ${theme.btnHover} ring-1 ring-white/20`}
        >
          <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 mr-1" />
          <span>{buttonLabel}</span>
        </Button>
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-2 font-medium">
          <span>🔒 {isDe ? 'Sichere Bestellung' : '256-Bit SSL Güvenli'}</span>
          <span>•</span>
          <span>⚡ {isDe ? 'Sofort-Aktivierung' : 'Anında Kurulum'}</span>
        </div>
      </div>
    </article>
  );
});

const PackagesScrollShowcase = memo(({ packages, currencySymbol, onOrder, isDe, regionKey }) => {
  const containerRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  const isMobile = windowWidth < 860;
  const visibleCount = isMobile ? 1 : 2;
  const maxSteps = Math.max(0, packages.length - visibleCount);

  const [activeIdx, setActiveIdx] = useState(0);
  const isThrottled = useRef(false);

  // Reset active index when packages or region change
  useEffect(() => {
    setActiveIdx(0);
  }, [packages, regionKey]);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cardWidth = isMobile ? Math.min(340, windowWidth - 32) : 375;
  const gap = isMobile ? 12 : 24;
  const stepWidth = cardWidth + gap;
  const stageWidth = visibleCount * cardWidth + (visibleCount - 1) * gap;

  // Mouse wheel interceptor: locks vertical scroll in BOTH directions
  // (Downwards: 0 -> maxSteps; Upwards: maxSteps -> 0)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (maxSteps <= 0) return;

      if (typeof document !== 'undefined') {
        if (document.querySelector('[role="dialog"]')) return;
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      }

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section focus bounds:
      const isDownFocus = rect.top <= 140 && rect.bottom >= windowHeight * 0.45;
      const isUpFocus = rect.top <= 160 && rect.top >= -140 && rect.bottom >= windowHeight * 0.45;

      const delta = e.deltaY;
      if (Math.abs(delta) < 16) return;

      // 1. Scrolling DOWN: advance to next package card
      if (delta > 0 && isDownFocus) {
        if (activeIdx < maxSteps) {
          e.preventDefault();
          e.stopPropagation();

          if (isThrottled.current) return;
          isThrottled.current = true;

          if (rect.top > 25 && rect.top <= 140) {
            window.scrollTo({
              top: window.scrollY + rect.top - 16,
              behavior: 'smooth',
            });
          }

          setActiveIdx((prev) => Math.min(maxSteps, prev + 1));

          setTimeout(() => {
            isThrottled.current = false;
          }, 360);
        }
      }
      // 2. Scrolling UP: step backward to previous package card
      else if (delta < 0 && isUpFocus) {
        if (activeIdx > 0) {
          e.preventDefault();
          e.stopPropagation();

          if (isThrottled.current) return;
          isThrottled.current = true;

          if (rect.top < 0 || rect.top > 60) {
            window.scrollTo({
              top: window.scrollY + rect.top - 16,
              behavior: 'smooth',
            });
          }

          setActiveIdx((prev) => Math.max(0, prev - 1));

          setTimeout(() => {
            isThrottled.current = false;
          }, 360);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeIdx, maxSteps]);

  // Touch gesture support for mobile
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;
    const diffX = Math.abs(curX - touchStartX.current);
    const diffY = Math.abs(curY - touchStartY.current);

    if (diffX > 14 && diffX > diffY * 1.2) {
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
      if (deltaX > 0 && activeIdx < maxSteps) {
        setActiveIdx((prev) => Math.min(maxSteps, prev + 1));
      } else if (deltaX < 0 && activeIdx > 0) {
        setActiveIdx((prev) => Math.max(0, prev - 1));
      }
    }
  };

  if (!packages || packages.length === 0) return null;

  const isAtEnd = activeIdx >= maxSteps;

  return (
    <div
      ref={containerRef}
      key={`${regionKey}-${packages.length}`}
      className="relative w-full py-2 md:py-6 select-none"
    >
      {/* Subtle Ambient Glow behind active cards */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Header with Duration Pills & Scroll Guide */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-4 md:mb-6 shrink-0 z-20">
        <div className="flex flex-col items-center text-center gap-2.5">
          
          {/* Scroll status / button click indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-xs font-semibold shadow-sm transition-all duration-300">
            <span className={`w-2.5 h-2.5 rounded-full ${isAtEnd ? 'bg-emerald-500' : 'bg-[#e50914] animate-pulse'}`} />
            {isAtEnd ? (
              <span className="text-emerald-400 font-bold">
                {isDe ? '✓ Alle Pakete angezeigt — Nach unten weiter scrollen' : '✓ Tüm paketler görüntülendi — Aşağı kaydırmaya devam edebilirsiniz'}
              </span>
            ) : (
              <span className="text-gray-200">
                {isMobile
                  ? (isDe ? '👉 Mit dem Finger wischen oder auf die roten Pfeile tippen' : '👉 Kartları kaydırın veya kırmızı oklara dokunun')
                  : (isDe
                      ? '👉 Mit der Maus scrollen oder auf die roten Pfeile / Pakete klicken'
                      : '👉 Fare ile kaydırın veya kırmızı oklara / sürelere tıklayın')}
              </span>
            )}
          </div>

          {/* Duration Pills: clicking directly switches to that package */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar max-w-full px-2">
            {packages.map((pkg, idx) => {
              const isPopular = pkg.popular || pkg.featured;
              const isSelected = activeIdx === idx || (!isMobile && activeIdx + 1 === idx && idx > 0);
              const pkgName = pkg.name || pkg.title || '';
              const durationLabel = localizePackageText(pkg.duration || pkgName, isDe);

              return (
                <button
                  key={pkg.id || idx}
                  type="button"
                  onClick={() => setActiveIdx(Math.min(idx, maxSteps))}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 border active:scale-95 shadow-md ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white border-white/40 shadow-lg shadow-primary/50 scale-105 ring-2 ring-primary/60'
                      : 'bg-[#181818] text-gray-300 border-white/15 hover:border-primary/60 hover:text-white hover:bg-[#222]'
                  }`}
                >
                  {isPopular && <Star className="w-3.5 h-3.5 fill-current text-amber-300 shrink-0" />}
                  <span>{durationLabel}</span>
                  {isPopular && (
                    <span className="text-[10px] font-black bg-black/60 px-2 py-0.5 rounded-full text-amber-300 tracking-wide">
                      {isDe ? 'TOP' : 'POPÜLER'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. The Centered Window / Stage Viewport with Floating Prominent Arrows */}
      <div className="relative mx-auto w-full flex items-center justify-center px-2 md:px-14">
        {/* Floating Left Navigation Arrow (Desktop) */}
        <button
          type="button"
          onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
          disabled={activeIdx <= 0}
          aria-label={isDe ? 'Vorheriges Paket' : 'Önceki Paket'}
          className="hidden md:flex absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-[0_0_24px_rgba(229,9,20,0.7)] items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white/30 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* The Frame / Card Stage Viewport */}
        <div
          className="relative shrink-0 z-20 touch-pan-y"
          style={{ width: `${stageWidth}px` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Edge Gradients for seamless arrival from right */}
          <div className="pointer-events-none absolute -left-6 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent z-30" />
          {activeIdx < maxSteps && (
            <div className="pointer-events-none absolute -right-6 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent z-30" />
          )}

          {/* Overflow-hidden container framing the cards */}
          <div className="overflow-hidden rounded-3xl py-2 px-1">
            <motion.div
              className="flex items-stretch"
              animate={{ x: -activeIdx * stepWidth }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
              style={{ gap: `${gap}px` }}
            >
              {packages.map((pkg, idx) => {
                const isPopular = pkg.popular || pkg.featured;
                const isFocus = activeIdx === idx || (!isMobile && activeIdx + 1 === idx);

                return (
                  <div
                    key={pkg.id || idx}
                    style={{ width: `${cardWidth}px` }}
                    className={`shrink-0 flex flex-col min-h-[580px] md:min-h-[600px] h-auto transition-all duration-300 ${
                      isFocus ? 'opacity-100 scale-100' : 'opacity-70 md:opacity-85 scale-[0.98]'
                    }`}
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
            </motion.div>
          </div>
        </div>

        {/* Floating Right Navigation Arrow (Desktop) */}
        <button
          type="button"
          onClick={() => setActiveIdx((prev) => Math.min(maxSteps, prev + 1))}
          disabled={activeIdx >= maxSteps}
          aria-label={isDe ? 'Nächstes Paket' : 'Sonraki Paket'}
          className="hidden md:flex absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-[0_0_24px_rgba(229,9,20,0.7)] items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white/30 disabled:opacity-0 disabled:pointer-events-none cursor-pointer animate-pulse-slow"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      {/* 3. Bottom Controls & Progress Navigation */}
      <div className="w-full max-w-xl mx-auto px-4 mt-5 shrink-0 z-20">
        <div className="flex items-center justify-between gap-3">
          
          {/* Prominent Previous Button with Label */}
          <button
            type="button"
            onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
            disabled={activeIdx <= 0}
            className="px-4 md:px-5 py-2.5 rounded-2xl bg-[#141414] border border-white/20 text-white text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-[#e50914] hover:border-primary transition-all duration-200 disabled:opacity-20 disabled:hover:bg-[#141414] active:scale-95 shadow-md shadow-black/40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">{isDe ? 'Vorheriges' : 'Önceki Paket'}</span>
          </button>

          {/* Center: Interactive Dots & Counter */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {Array.from({ length: maxSteps + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Sayfa ${idx + 1}`}
                  className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIdx === idx
                      ? 'w-9 bg-gradient-to-r from-[#e50914] to-[#b20710] shadow-[0_0_12px_rgba(229,9,20,0.7)] ring-2 ring-primary/30'
                      : 'w-3 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-extrabold text-gray-300 tracking-wider">
              {isDe ? `Paket ${activeIdx + 1} / ${maxSteps + 1}` : `Paket ${activeIdx + 1} / ${maxSteps + 1}`}
            </span>
          </div>

          {/* Prominent Next Button with Label */}
          <button
            type="button"
            onClick={() => setActiveIdx((prev) => Math.min(maxSteps, prev + 1))}
            disabled={activeIdx >= maxSteps}
            className="px-4 md:px-5 py-2.5 rounded-2xl bg-[#141414] border border-white/20 text-white text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-[#e50914] hover:border-primary transition-all duration-200 disabled:opacity-20 disabled:hover:bg-[#141414] active:scale-95 shadow-md shadow-black/40 cursor-pointer"
          >
            <span className="hidden sm:inline">{isDe ? 'Nächstes' : 'Sonraki Paket'}</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
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
      <section id="packages" className="qruze-cinema-section py-24 border-t border-[#262626] min-h-[600px] flex items-center justify-center">
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
      ? 'Wählen Sie das passende Paket und testen Sie die Streaming-Qualität vor dem Kauf auf Ihrem eigenen Gerät.'
      : 'İhtiyacınıza uygun paketi seçin; satın almadan önce yayın kalitesini kendi cihazınızda ücretsiz test edin.'
  );

  const emptyTierMessage = () => getEmptyPackagesMessage(pageContent, isDe);

  const sectionPadding = showTierFilter ? 'py-8 md:py-10' : 'py-20';
  const sectionBorder = hideSectionHeader ? '' : 'border-t border-[#262626]';

  return (
    <section id="packages" className={`qruze-cinema-section ${sectionPadding} ${sectionBorder} relative`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#0a0a0a]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {!hideSectionHeader && (
          <div className="text-center mb-6 md:mb-8">
            {!showTierFilter && (
              <span className="qruze-premium-seal mb-3">
                {isDe ? 'Premium Abo Lounge' : 'Premium Paket Salonu'}
              </span>
            )}
            <h2 className="section-title text-3xl md:text-5xl mb-3">
              {sectionTitle}
            </h2>
            <p className="section-lead mx-auto text-center text-sm md:text-base max-w-2xl">
              {sectionDescription}
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[90rem] mx-auto">
          {showTabsList && (
            <div className="flex flex-col items-center mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {isDe ? 'Nutzungsregion' : 'Kullanım Bölgesi'}
              </p>
              <TabsList className="bg-[#0a0a0a] border border-[#262626] p-1 h-auto rounded-full shadow-inner">
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
              <PackagesScrollShowcase
                packages={displayTrPackages}
                currencySymbol={getPackageCurrencySymbol(displayTrPackages[0] || {}, 'TR')}
                onOrder={(p) => openModal(p, false)}
                isDe={isDe}
                regionKey="TR"
              />
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
              <PackagesScrollShowcase
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
