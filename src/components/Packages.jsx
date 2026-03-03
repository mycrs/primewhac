
import React, { memo, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Check, Star, Zap, Loader2, Globe, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderModal } from '@/contexts/OrderModalContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PackageRegionSelector from './PackageRegionSelector';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { useLocation } from 'react-router-dom';

const getPackageTheme = (name, isPopular) => {
  const lowerName = name?.toLowerCase() || '';
  
  if (isPopular || lowerName.includes('12 ay vip')) {
    return { 
      bgGlow: 'bg-purple-500', 
      border: 'border-purple-500/30', hoverBorder: 'group-hover:border-purple-500/80',
      shadow: 'shadow-lg shadow-purple-900/10', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-purple-500/30',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',
      btnBg: 'bg-gradient-to-r from-[#A855F7] to-[#9333EA]', btnHover: 'hover:from-[#9333EA] hover:to-[#7E22CE] hover:shadow-lg hover:shadow-purple-600/40'
    };
  }
  if (lowerName.includes('3 ay premium')) {
    return { 
      bgGlow: 'bg-fuchsia-500', 
      border: 'border-fuchsia-500/20', hoverBorder: 'group-hover:border-fuchsia-500/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-fuchsia-500/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-fuchsia-500/50 hover:shadow-lg hover:shadow-fuchsia-900/30'
    };
  }
  if (lowerName.includes('3 ay vip')) {
    return { 
      bgGlow: 'bg-blue-500', 
      border: 'border-blue-500/20', hoverBorder: 'group-hover:border-blue-500/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-blue-500/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/30'
    };
  }
  if (lowerName.includes('6 ay premium')) {
    return { 
      bgGlow: 'bg-emerald-500', 
      border: 'border-emerald-500/20', hoverBorder: 'group-hover:border-emerald-500/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-emerald-500/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/30'
    };
  }
  if (lowerName.includes('6 ay vip')) {
    return { 
      bgGlow: 'bg-orange-500', 
      border: 'border-orange-500/20', hoverBorder: 'group-hover:border-orange-500/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-orange-500/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-900/30'
    };
  }
  if (lowerName.includes('12 ay premium')) {
    return { 
      bgGlow: 'bg-indigo-500', 
      border: 'border-indigo-500/20', hoverBorder: 'group-hover:border-indigo-500/60',
      shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-indigo-500/20',
      textGlow: 'group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]',
      btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/30'
    };
  }
  
  // Default fallback theme
  return { 
    bgGlow: 'bg-purple-500', 
    border: 'border-[#2a2a40]', hoverBorder: 'group-hover:border-purple-500/50',
    shadow: 'shadow-md shadow-black/20', hoverShadow: 'group-hover:shadow-xl group-hover:shadow-purple-900/20',
    textGlow: 'group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    btnBg: 'bg-[#1e1e30] border border-[#2a2a40]', btnHover: 'hover:bg-[#2d2d45] hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20'
  };
};

const PackageCard = memo(({ pkg, isPopular, onOrder, currencySymbol, isDe }) => {
  const [selectedRegion, setSelectedRegion] = useState('tr');
  const theme = getPackageTheme(pkg.name, isPopular);

  const handleOrder = () => {
    if (pkg.isRegionSelectable) {
      const regionNames = {
        'tr': isDe ? 'Türkei' : 'Türkiye',
        'eu': isDe ? 'Europa' : 'Avrupa',
        'tr-eu': isDe ? 'Türkei + Europa' : 'Türkiye + Avrupa'
      };
      
      const modifiedPkg = {
        ...pkg,
        title: `${pkg.name} (${regionNames[selectedRegion]})`,
        selectedRegion: selectedRegion
      };
      onOrder(modifiedPkg);
    } else {
      const orderPkg = {
        ...pkg,
        title: pkg.name
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
  
  const seoDescription = getSeoDescription(pkg.name);

  return (
    <div className={`relative p-6 rounded-xl border-2 flex flex-col h-full bg-[#1a1a2e]/90 backdrop-blur-sm group z-10 transition-all duration-300 hover:scale-[1.02] ${theme.border} ${theme.hoverBorder} ${theme.shadow} ${theme.hoverShadow}`}>
      {/* Background Subtle Glow Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] ${theme.bgGlow} opacity-[0.02] group-hover:opacity-[0.12] blur-3xl rounded-full pointer-events-none transition-opacity duration-500 -z-10`}></div>

      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white text-xs font-bold px-4 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg shadow-purple-600/40 z-20 whitespace-nowrap">
          <Star className="w-3 h-3 fill-current animate-pulse" /> {isDe ? 'AM BELIEBTESTEN' : 'EN POPÜLER'}
        </div>
      )}

      <div className="text-center mb-6 pt-4 relative">
        <div className="text-[#A855F7] font-bold uppercase tracking-widest text-sm mb-2">{pkg.duration}</div>
        <div className="flex items-center justify-center gap-0.5 relative z-10">
          <span className="text-xl text-gray-300 font-semibold align-top mt-1">{currencySymbol}</span>
          <span className="text-5xl font-bold text-white tracking-tight transition-all duration-300 group-hover:animate-pulse-slow">{pkg.price}</span>
        </div>
        <h3 className={`text-gray-200 text-lg mt-3 font-bold transition-all duration-300 ${theme.textGlow}`}>{pkg.name}</h3>
        <p className="text-gray-500 text-xs mt-1 italic">{seoDescription}</p>
      </div>
      
      {pkg.isRegionSelectable && (
        <PackageRegionSelector 
          selectedRegion={selectedRegion} 
          onRegionChange={setSelectedRegion} 
        />
      )}

      <div className="flex-grow">
        <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a40] to-transparent mb-6 group-hover:via-slate-600 transition-colors duration-300"></div>
        <ul className="space-y-3 mb-8">
          {(pkg.features || []).slice(0, 6).map((feature, i) => (
            <li key={i} className="flex items-start text-sm text-gray-300 font-medium leading-snug">
              <div className="mr-3 mt-0.5 shrink-0 bg-purple-900/30 rounded-full p-0.5 group-hover:bg-purple-900/50 transition-colors duration-300">
                <Check className="w-3 h-3 text-[#A855F7]" />
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
        className={`w-full h-12 rounded-lg font-bold text-base mt-auto transition-all duration-300 text-white z-10 ${theme.btnBg} ${theme.btnHover}`}
      >
        <Zap className="w-4 h-4 mr-2" />
        {isDe ? 'Jetzt bestellen' : 'Sipariş Ver'}
      </Button>
    </div>
  );
});

const Packages = ({ packages: initialPackages, title, hideRegions = [] }) => {
  const { openModal } = useOrderModal();
  const location = useLocation();
  const isDe = location.pathname.includes('/de');
  const [trPackages, setTrPackages] = useState([]);
  const [euPackages, setEuPackages] = useState([]);
  const [trLoading, setTrLoading] = useState(true);
  const [euLoading, setEuLoading] = useState(false);
  const [trError, setTrError] = useState(null);
  const [euError, setEuError] = useState(null);
  
  // Set initial active tab based on hideRegions
  const [activeTab, setActiveTab] = useState(() => {
    return hideRegions.includes('TR') ? 'EU' : 'TR';
  });

  useEffect(() => {
    fetchTurkeyPackages();
  }, [initialPackages]);

  useEffect(() => {
    if (activeTab === 'EU' && euPackages.length === 0 && !euLoading && !euError) {
      fetchEuropePackages();
    }
  }, [activeTab]);

  const fetchTurkeyPackages = async () => {
    setTrLoading(true);
    setTrError(null);
    const fallbackData = initialPackages?.turkiye || [];
    
    if (!isSupabaseConfigured()) {
      setTrPackages(fallbackData);
      setTrLoading(false);
      return;
    }

    try {
      const { data, error, isFallback, message } = await executeSupabaseQuery(
        () => supabase.from('packages').select('*').eq('enabled', true).in('region', ['TR', 'tr', 'turkiye', 'Türkiye', 'turkey']).order('price', { ascending: true }),
        { retries: 3, context: 'fetch_packages_tr', fallback: fallbackData }
      );

      if (error && isFallback) {
        setTrError(message || (isDe ? "Netzwerkfehler beim Laden." : "Paketler yüklenirken ağ hatası oluştu."));
        setTrPackages(fallbackData);
      } else {
        setTrPackages(data && data.length > 0 ? data : fallbackData);
      }
    } catch (err) {
      console.error("Failed to load Turkey packages:", err);
      setTrError(isDe ? "Ein Fehler ist aufgetreten." : "Beklenmeyen bir hata oluştu.");
      setTrPackages(fallbackData);
    } finally {
      setTrLoading(false);
    }
  };

  const fetchEuropePackages = async () => {
    setEuLoading(true);
    setEuError(null);
    const fallbackData = initialPackages?.avrupa || [];

    if (!isSupabaseConfigured()) {
      setEuPackages(fallbackData);
      setEuLoading(false);
      return;
    }

    try {
      const { data, error, isFallback, message } = await executeSupabaseQuery(
        () => supabase.from('packages').select('*').eq('enabled', true).in('region', ['EU', 'eu', 'europe', 'Avrupa', 'avrupa', 'AVRUPA']).order('price', { ascending: true }),
        { retries: 3, context: 'fetch_packages_eu', fallback: fallbackData }
      );

      if (error && isFallback) {
        setEuError(message || (isDe ? "Netzwerkfehler beim Laden der Europa-Pakete." : "Avrupa paketleri yüklenirken ağ hatası oluştu."));
        setEuPackages(fallbackData);
      } else {
        setEuPackages(data && data.length > 0 ? data : fallbackData);
      }
    } catch (err) {
      console.error("Failed to load Europe packages:", err);
      setEuError(isDe ? "Ein Fehler ist aufgetreten." : "Beklenmeyen bir hata oluştu.");
      setEuPackages(fallbackData);
    } finally {
      setEuLoading(false);
    }
  };

  const handleRetryTurkey = () => fetchTurkeyPackages();
  const handleRetryEurope = () => fetchEuropePackages();

  if (trLoading && trPackages.length === 0 && !hideRegions.includes('TR')) {
    return (
      <section id="packages" className="py-24 bg-[#0F0F1E] border-t border-[#2a2a40] min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{isDe ? 'Pakete werden geladen...' : 'Paketler yükleniyor...'}</p>
        </div>
      </section>
    );
  }

  const showTabsList = !(hideRegions.includes('TR') && hideRegions.includes('EU')) && (hideRegions.length < 1);

  return (
    <section id="packages" className="py-20 bg-[#0F0F1E] border-t border-[#2a2a40] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-900/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {title ? title : (
              isDe ? (
                <>IPTV-Preise und <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Paketoptionen</span></>
              ) : (
                <>IPTV Fiyatları ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Paket Seçenekleri</span></>
              )
            )}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {isDe ? (
              "Wählen Sie das Paket, das Ihren Anforderungen entspricht, und beginnen Sie sofort zu schauen. Hochwertige, unterbrechungsfreie Streaming-Garantie und erschwingliche Abos."
            ) : (
              "İhtiyacınıza en uygun paketi seçin, anında izlemeye başlayın. Yüksek kalite, donmayan yayın garantisi ve uygun fiyatlı abonelikler."
            )}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[90rem] mx-auto">
          {showTabsList && (
            <div className="flex justify-center mb-10">
              <TabsList className="bg-[#1a1a2e] border border-[#2a2a40] p-1 h-auto rounded-full">
                {!hideRegions.includes('TR') && (
                  <TabsTrigger 
                    value="TR" 
                    className="rounded-full px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-[#A855F7] data-[state=active]:text-white transition-all gap-2"
                  >
                    <MapPin className="w-4 h-4" /> {isDe ? 'Türkei Pakete' : 'Türkiye Paketleri'}
                  </TabsTrigger>
                )}
                {!hideRegions.includes('EU') && (
                  <TabsTrigger 
                    value="EU" 
                    className="rounded-full px-6 py-2.5 text-sm md:text-base data-[state=active]:bg-[#A855F7] data-[state=active]:text-white transition-all gap-2"
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
                <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{isDe ? 'Türkei-Pakete werden geladen...' : 'Türkiye paketleri yükleniyor...'}</p>
              </div>
            ) : trError && trPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">{trError}</p>
                <Button onClick={handleRetryTurkey} className="bg-[#A855F7] text-white hover:bg-[#9333EA]">
                  <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
                </Button>
              </div>
            ) : trPackages.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{isDe ? 'Türkei-Pakete sind noch nicht verfügbar' : 'Türkiye paketleri henüz mevcut değil'}</p>
                <p className="text-gray-600 text-sm mt-2">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {trPackages.map((pkg, idx) => (
                  <PackageCard key={pkg.id || idx} pkg={pkg} isPopular={pkg.popular} currencySymbol="₺" onOrder={(p) => openModal(p, false)} isDe={isDe} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="EU" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {euLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{isDe ? 'Pakete werden geladen...' : 'Avrupa paketleri yükleniyor...'}</p>
              </div>
            ) : euError && euPackages.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">{euError}</p>
                <Button onClick={handleRetryEurope} className="bg-[#A855F7] text-white hover:bg-[#9333EA]">
                  <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
                </Button>
              </div>
            ) : euPackages.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{isDe ? 'Europa-Pakete noch nicht verfügbar' : 'Avrupa paketleri henüz mevcut değil'}</p>
                <p className="text-gray-600 text-sm mt-2">{isDe ? 'Neue Pakete werden bald hinzugefügt.' : 'Yakında yeni paketler eklenecektir.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {euPackages.map((pkg, idx) => (
                  <PackageCard key={pkg.id || idx} pkg={pkg} isPopular={pkg.popular} currencySymbol="€" onOrder={(p) => openModal(p, false)} isDe={isDe} />
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
