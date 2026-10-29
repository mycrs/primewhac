
import React, { memo, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Star, Zap, Loader2, Globe, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderModal } from '@/contexts/OrderModalContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PackageRegionSelector from './PackageRegionSelector';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { PACKAGE_LIST_COLUMNS } from '@/constants/publicSupabaseQueries';
import { readSessionCache, writeSessionCache, removeSessionCacheKey } from '@/utils/supabaseSessionCache';
import PackageCountdownBadge from '@/components/packages/PackageCountdownBadge';
import { STATIC_PACKAGES_TR, STATIC_PACKAGES_EU } from '@/constants/staticPackagesFallback';
import { useToast } from '@/components/ui/use-toast';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';

const translateFeature = (feature) => {
  if (!feature) return '';
  let f = feature;
  f = f.replace(/2 Cihaz/g, '2 Geräte');
  f = f.replace(/24\/7 Destek/g, '24/7 Premium Support');
  f = f.replace(/Kanal/g, 'Kanäle');
  f = f.replace(/Kalite/g, 'Qualität');
  return f;
};

const translateName = (name) => {
  if (!name) return '';
  let n = name;
  n = n.replace('3 Aylık Avrupa Paketi', '3 Monate Europa-Paket');
  n = n.replace('6 Aylık Avrupa Paketi', '6 Monate Europa-Paket');
  n = n.replace('12 Aylık Avrupa Paketi', '12 Monate Europa-Paket');
  n = n.replace('12 Aylık Çift Kullanıcı Paketi', '12 Monate Paket für 2 Geräte');
  n = n.replace('Avrupa Paketi', 'Europa-Paket');
  n = n.replace('Türkiye Paketi', 'Türkei-Paket');
  n = n.replace('Aylık', 'Monate');
  n = n.replace('Yıllık', 'Jahr');
  return n;
};

const translateDuration = (duration) => {
  if (!duration) return '';
  return duration.replace('Ay', 'Monate').replace('Yıl', 'Jahr');
};

const PackageCardDE = memo(({ pkg, isPopular, onOrder, currencySymbol }) => {
  const [selectedRegion, setSelectedRegion] = useState('tr');

  const handleOrder = () => {
    if (pkg.isRegionSelectable ?? pkg.is_region_selectable) {
      const regionNames = {
        'tr': 'Türkei',
        'eu': 'Europa',
        'tr-eu': 'Türkei + Europa'
      };
      
      const modifiedPkg = {
        ...pkg,
        title: `${translateName(pkg.name)} (${regionNames[selectedRegion]})`,
        selectedRegion: selectedRegion
      };
      onOrder(modifiedPkg);
    } else {
      const orderPkg = {
        ...pkg,
        title: translateName(pkg.name)
      };
      onOrder(orderPkg);
    }
  };

  const getSeoDescription = (name) => {
    if (!name) return "Zuverlässige IPTV-Preise und Pakete";
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ay') || lowerName.includes('monate')) return "Bester IPTV-Abonnementservice in Europa";
    if (lowerName.includes('yıl') || lowerName.includes('jahr')) return "Unterbrechungsfreier Live-TV-Streaming-Dienst";
    if (lowerName.includes('sınırsız') || lowerName.includes('unbegrenzt')) return "HD und 4K IPTV Streaming-Dienst";
    return "Zuverlässige IPTV-Preise und Pakete";
  };
  
  const seoDescription = getSeoDescription(pkg.name);

  return (
    <article className={`luxury-card relative p-6 md:p-7 rounded-3xl border flex flex-col h-full backdrop-blur-xl group z-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)] ${
      isPopular
        ? 'bg-gradient-to-b from-[#1e1416] via-[#120d0f] to-[#0a0a0d] border-[#e50914]/60 shadow-[0_0_40px_rgba(229,9,20,0.22)] ring-1 ring-[#e50914]/40 hover:border-[#e50914] hover:shadow-[0_0_60px_rgba(229,9,20,0.4)]'
        : 'bg-gradient-to-b from-[#16161c] via-[#0e0e12] to-[#070709] border-white/10 hover:border-white/25'
    }`}>
      {isPopular && (
        <>
          <div className="absolute inset-0 rounded-3xl pointer-events-none -z-10 bg-gradient-to-r from-[#e50914]/15 via-transparent to-[#b20710]/15" />
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-xl shadow-[#e50914]/40 z-20 whitespace-nowrap border border-white/30 tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current animate-pulse text-amber-300" /> AM BELIEBTESTEN
          </div>
        </>
      )}

      <PackageCountdownBadge pkg={pkg} isDe />

      <div className="text-center mb-5 pt-3">
        <span className="qruze-premium-seal mb-2 text-[10px] tracking-widest uppercase">
          {isPopular ? 'VIP Premium-Auswahl' : 'Qruze Paket'}
        </span>
        <div className="text-[#ff4b55] font-black uppercase tracking-widest text-sm mb-1.5">{translateDuration(pkg.duration)}</div>
        {pkg.campaign_label && (
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40 shadow-sm">
            {pkg.campaign_label}
          </div>
        )}
        <div className="flex items-center justify-center gap-1 relative z-10 flex-wrap my-2">
          {pkg.original_price != null && Number(pkg.original_price) > Number(pkg.price) && (
            <span className="text-base text-gray-500 line-through mr-1 align-baseline">{currencySymbol}{pkg.original_price}</span>
          )}
          <span className="text-2xl text-gray-400 font-extrabold align-top mt-1">{currencySymbol}</span>
          <span className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">{pkg.price}</span>
        </div>
        <h3 className="text-white text-lg mt-3 font-bold">{translateName(pkg.name)}</h3>
        <p className="text-slate-400 text-[12px] mt-1 line-clamp-1">{seoDescription}</p>
      </div>
      
      {(pkg.isRegionSelectable ?? pkg.is_region_selectable) && (
        <PackageRegionSelector 
          selectedRegion={selectedRegion} 
          onRegionChange={setSelectedRegion} 
        />
      )}

      <div className="flex-grow my-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-4"></div>
        <ul className="space-y-2.5 mb-6">
          {(pkg.features || []).slice(0, 6).map((feature, i) => (
            <li key={i} className="flex items-start text-xs md:text-sm text-slate-200 font-medium leading-relaxed">
              <div className="mr-2.5 mt-0.5 shrink-0 bg-[#e50914]/20 border border-[#e50914]/40 rounded-full p-0.5 group-hover:bg-[#e50914] group-hover:text-white transition-colors duration-300">
                <Check className="w-3.5 h-3.5 text-[#ff4b55] group-hover:text-white" />
              </div>
              <span className="line-clamp-2">{translateFeature(feature)}</span>
            </li>
          ))}
          {(pkg.features || []).length > 6 && (
            <li className="text-[11px] text-slate-400 pl-6 pt-0.5 italic">
              +{(pkg.features.length - 6)} weitere Funktion{(pkg.features.length - 6) > 1 ? 'en' : ''}
            </li>
          )}
        </ul>
      </div>

      <Button 
        onClick={handleOrder}
        className={`w-full h-12 md:h-14 rounded-2xl font-black text-base mt-auto transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
          isPopular 
            ? 'bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white shadow-xl shadow-[#e50914]/40 hover:shadow-[0_0_35px_rgba(229,9,20,0.6)] hover:scale-[1.02]' 
            : 'bg-white/[0.08] hover:bg-[#e50914] text-white border border-white/20 hover:border-[#e50914] hover:shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:scale-[1.01]'
        }`}
      >
        <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300 mr-1" />
        Jetzt bestellen
      </Button>
    </article>
  );
});

const PackagesDE = ({ packages: initialPackages, title, hideRegions = [] }) => {
  const { openModal } = useOrderModal();
  const { toast } = useToast();
  const [trPackages, setTrPackages] = useState([]);
  const [euPackages, setEuPackages] = useState([]);
  const [trLoading, setTrLoading] = useState(true);
  const [euLoading, setEuLoading] = useState(false);
  const [trError, setTrError] = useState(null);
  const [euError, setEuError] = useState(null);
  
  // Set initial active tab to EU permanently
  const [activeTab, setActiveTab] = useState('EU');

  useEffect(() => {
    if (activeTab === 'TR') {
       fetchTurkeyPackages();
    } else {
       fetchEuropePackages();
    }
  }, [initialPackages]);

  useEffect(() => {
    if (activeTab === 'TR' && trPackages.length === 0 && !trLoading && !trError) {
      fetchTurkeyPackages();
    }
    if (activeTab === 'EU' && euPackages.length === 0 && !euLoading && !euError) {
      fetchEuropePackages();
    }
  }, [activeTab]);

  const fetchTurkeyPackages = async (force = false) => {
    setTrLoading(true);
    setTrError(null);
    const fallbackData = STATIC_PACKAGES_TR;
    const cacheKey = 'sb_pub_packages_tr_v2';

    if (!isSupabaseConfigured()) {
      setTrPackages(fallbackData);
      setTrLoading(false);
      return;
    }

    if (!force) {
      const cached = readSessionCache(cacheKey);
      if (cached && Array.isArray(cached) && cached.length >= 0) {
        setTrPackages(cached.length > 0 ? cached : fallbackData);
        setTrLoading(false);
        return;
      }
    } else {
      removeSessionCacheKey(cacheKey);
    }

    try {
      const { data, error, isFallback } = await executeSupabaseQuery(
        () =>
          supabase
            .from('packages')
            .select(PACKAGE_LIST_COLUMNS)
            .eq('enabled', true)
            .in('region', ['TR', 'tr', 'turkiye', 'Türkiye', 'turkey'])
            .order('price', { ascending: true }),
        { retries: 3, context: 'fetch_packages_tr_de', fallback: fallbackData }
      );

      if (error && isFallback) {
        setTrError(null);
        setTrPackages(fallbackData);
        showPublicMaintenanceToastOnce(toast);
      } else {
        const rows = data && data.length > 0 ? data : fallbackData;
        if (import.meta.env.DEV) {
          console.log('paket data (TR):', rows);
        }
        setTrPackages(rows);
        if (!isFallback && rows.length >= 0) writeSessionCache(cacheKey, rows);
      }
    } catch (err) {
      console.error("Failed to load Turkey packages:", err);
      setTrError(null);
      setTrPackages(fallbackData);
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setTrLoading(false);
    }
  };

  const fetchEuropePackages = async (force = false) => {
    setEuLoading(true);
    setEuError(null);
    const fallbackData = STATIC_PACKAGES_EU;
    const cacheKey = 'sb_pub_packages_eu_v2';

    if (!isSupabaseConfigured()) {
      setEuPackages(fallbackData);
      setEuLoading(false);
      return;
    }

    if (!force) {
      const cached = readSessionCache(cacheKey);
      if (cached && Array.isArray(cached) && cached.length >= 0) {
        setEuPackages(cached.length > 0 ? cached : fallbackData);
        setEuLoading(false);
        return;
      }
    } else {
      removeSessionCacheKey(cacheKey);
    }

    try {
      const { data, error, isFallback } = await executeSupabaseQuery(
        () =>
          supabase
            .from('packages')
            .select(PACKAGE_LIST_COLUMNS)
            .eq('enabled', true)
            .in('region', ['EU', 'eu', 'europe', 'Avrupa', 'avrupa', 'AVRUPA'])
            .order('price', { ascending: true }),
        { retries: 3, context: 'fetch_packages_eu_de', fallback: fallbackData }
      );

      if (error && isFallback) {
        setEuError(null);
        setEuPackages(fallbackData);
        showPublicMaintenanceToastOnce(toast);
      } else {
        const rows = data && data.length > 0 ? data : fallbackData;
        if (import.meta.env.DEV) {
          console.log('paket data (EU):', rows);
        }
        setEuPackages(rows);
        if (!isFallback && rows.length >= 0) writeSessionCache(cacheKey, rows);
      }
    } catch (err) {
      console.error("Failed to load Europe packages:", err);
      setEuError(null);
      setEuPackages(fallbackData);
      showPublicMaintenanceToastOnce(toast);
    } finally {
      setEuLoading(false);
    }
  };

  const handleRetryTurkey = () => fetchTurkeyPackages(true);
  const handleRetryEurope = () => fetchEuropePackages(true);

  if (euLoading && euPackages.length === 0 && !hideRegions.includes('EU')) {
    return (
      <section id="packages" className="qruze-cinema-section py-24 border-t border-[#262626] min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#e50914] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Pakete werden geladen...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="qruze-cinema-section py-20 border-t border-[#262626] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#0a0a0a]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="qruze-premium-seal mb-4">Premium Abo Lounge</span>
          <h2 className="section-title text-4xl md:text-5xl mb-6">
            {title ? title : (
              <>IPTV-Preise und <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">Paketoptionen</span></>
            )}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Wählen Sie das Paket, das Ihren Anforderungen am besten entspricht, und beginnen Sie sofort mit dem Ansehen. <strong>Hohe Qualität, Ruckelfrei-Garantie</strong> und erschwingliche Abonnements.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[90rem] mx-auto">
          {/* Hide tabs completely with conditional rendering and hidden class */}
          <div className="hidden justify-center mb-10">
            <TabsList className="hidden bg-[#0a0a0a] border border-[#262626] p-1 h-auto rounded-full">
              <TabsTrigger value="EU" className="hidden">Europa-Pakete</TabsTrigger>
              <TabsTrigger value="TR" className="hidden">Türkei-Pakete</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="EU" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {euError && euPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">{euError}</p>
                <Button onClick={handleRetryEurope} className="bg-[#e50914] text-white hover:bg-[#b20710]">
                  <RefreshCw className="w-4 h-4 mr-2" /> Erneut versuchen
                </Button>
              </div>
            ) : (
              <>
                {euError && (
                  <div className="mb-6 p-4 bg-orange-900/30 border border-orange-500/50 rounded-lg flex items-center justify-between text-orange-200 text-sm">
                    <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Verbindungsproblem. Temporäre Pakete werden aufgelistet.</div>
                    <Button onClick={handleRetryEurope} variant="ghost" size="sm" className="h-8 hover:bg-orange-500/20"><RefreshCw className="w-3 h-3 mr-2" /> Aktualisieren</Button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                  {euPackages.map((pkg, idx) => (
                    <PackageCardDE key={pkg.id || idx} pkg={pkg} isPopular={pkg.popular} currencySymbol="€" onOrder={(p) => openModal(p, false)} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Turkey packages completely hidden */}
          <TabsContent value="TR" className="hidden">
            {/* Content hidden */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default memo(PackagesDE);
