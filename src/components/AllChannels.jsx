
import React, { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, Tv, Loader2, RefreshCw } from 'lucide-react';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';
import { Button } from '@/components/ui/button';
import { getChannelImageUrl } from '@/utils/channelImageUtils';
import { useLocation } from 'react-router-dom';

const ChannelCard = memo(({ channel, index }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Prioritize background_image_url over image_url, then fallback to utility
  const rawBgUrl = channel.background_image_url || channel.image_url;
  const bgImageUrl = rawBgUrl ? rawBgUrl : getChannelImageUrl(null, 'desktop', channel.category);
  const logoUrl = channel.logo_url;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: Math.min((index % 12) * 0.05, 0.5) }}
      className="relative overflow-hidden rounded-2xl group shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800 hover:border-slate-600 cursor-pointer aspect-[4/3] w-full flex flex-col justify-end"
    >
      {/* Background Skeleton */}
      {!bgLoaded && !bgError && (
        <div className="absolute inset-0 bg-[#0a0a0a] animate-pulse" />
      )}

      {/* Background Image */}
      <img 
        src={bgImageUrl}
        alt=""
        onLoad={() => setBgLoaded(true)}
        onError={() => {
          setBgLoaded(true);
          setBgError(true);
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${bgLoaded && !bgError ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
      />

      {/* Subtle Gradient Overlay - Reduced opacity for better background visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/20 group-hover:to-transparent transition-all duration-300 z-10" />

      {/* Top-Left Logo - şık küçük */}
      <div className="absolute top-2 left-2 z-20">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-black/50 backdrop-blur-md rounded-lg flex items-center justify-center p-1.5 shadow-md border border-white/20 transition-transform duration-300 group-hover:scale-105 group-hover:bg-black/60 shrink-0">
          {logoUrl && !logoError ? (
            <>
              {!logoLoaded && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />
              )}
              <img 
                src={logoUrl} 
                alt="IPTV kanal logosu"
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoError(true)}
                className={`max-h-full max-w-full object-contain drop-shadow-md transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`} 
                loading="lazy"
              />
            </>
          ) : (
            <Tv className="w-4 h-4 md:w-5 md:h-5 text-white/80 group-hover:text-white transition-colors duration-300 drop-shadow-md" />
          )}
        </div>
      </div>
      
      {/* Channel Info (Bottom) */}
      <div className="relative z-20 p-4 md:p-5 w-full pt-10">
        <p className="text-white text-base md:text-lg lg:text-xl font-bold truncate w-full drop-shadow-md transition-colors duration-300 group-hover:text-primary">
          {channel.name}
        </p>
        <div className="flex items-center justify-between mt-1 h-5">
          {channel.category && (
            <span className="text-[10px] md:text-xs text-white/90 font-medium px-2 py-0.5 bg-primary/50 backdrop-blur-sm rounded border border-primary/20 shadow-sm uppercase tracking-wider">
              {channel.category}
            </span>
          )}
          {channel.description && (
            <p className="text-xs text-slate-300 truncate ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-1 text-right drop-shadow-md">
              {channel.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

const AllChannels = () => {
  const { channels, loading, error, refetch } = useChannelsRealtime();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const location = useLocation();
  const isDe = location.pathname.includes('/de');

  // Filter only active channels
  const activeChannels = useMemo(() => {
    return channels.filter(c => c.is_active !== false);
  }, [channels]);

  const categories = useMemo(() => {
    const allCategories = activeChannels.map(c => c.category).filter(Boolean);
    return ['Tümü', ...new Set(allCategories)];
  }, [activeChannels]);

  // Translate category labels for UI display only
  const getTranslatedCategory = (cat) => {
    if (!isDe) return cat;
    const translations = {
      'Tümü': 'Alle',
      'Spor': 'Sport',
      'Genel': 'Allgemein',
      'Haber': 'Nachrichten',
      'Uluslararası': 'International',
      'Belgesel': 'Dokumentation',
      'Çocuk': 'Kinder'
    };
    return translations[cat] || cat;
  };

  const filteredChannels = useMemo(() => {
    return activeChannels.filter(channel => {
      const matchesCategory = selectedCategory === 'Tümü' || channel.category === selectedCategory;
      const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (channel.description && channel.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeChannels, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <section className="py-16 bg-[#0a0a0a] relative z-10 min-h-[50vh]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-slate-400 font-medium">{isDe ? 'Kanäle werden geladen...' : 'Kanallar yükleniyor...'}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-[#0a0a0a] relative z-10 min-h-[50vh]">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-red-950/20 border border-red-900/50 rounded-xl p-8">
            <p className="text-red-400 mb-4 font-semibold">{isDe ? 'Ein Fehler ist beim Laden der Kanäle aufgetreten' : 'Kanallar yüklenirken bir hata oluştu'}</p>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <Button onClick={refetch} className="bg-red-600 hover:bg-red-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#0a0a0a] relative z-10">
      <div className="container mx-auto px-4">
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 sticky top-24 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl py-6 rounded-3xl border border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.3)] px-6 md:px-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={isDe ? "Kanal durchsuchen... (z.B.: TRT, Beinsports, Discovery)" : "Kanal ara... (Örn: TRT, Beinsports, Discovery)"}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a]/50 border-slate-700 text-white pl-12 h-14 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg placeholder:text-gray-500"
              />
            </div>
            <div className="flex-shrink-0 w-full md:w-56">
               <select
                 value={selectedCategory}
                 onChange={e => setSelectedCategory(e.target.value)}
                 className="w-full bg-[#0a0a0a]/50 border border-slate-700 text-white rounded-2xl px-5 h-14 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer text-lg"
               >
                 {categories.map(cat => (
                   <option key={cat} value={cat} className="bg-[#0a0a0a]">
                     {getTranslatedCategory(cat)}
                   </option>
                 ))}
               </select>
            </div>
          </div>
        </motion.div>

        {/* Channel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8 mb-16">
          {filteredChannels.map((channel, index) => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              index={index} 
            />
          ))}
        </div>
        
        {filteredChannels.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-[#0a0a0a]/50 rounded-3xl border border-slate-700/50 backdrop-blur-sm mx-auto max-w-2xl"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto mb-6">
              <Tv className="w-10 h-10 md:w-12 md:h-12 text-slate-500" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-white mb-2">{isDe ? 'Keine Ergebnisse gefunden' : 'Sonuç Bulunamadı'}</p>
            <p className="text-slate-400 text-base md:text-lg px-4">
              {isDe 
                ? 'Es gibt keinen Kanal oder keine Kategorie, die Ihrer Suche entspricht. Bitte ändern Sie die Filter.' 
                : 'Aramanızla eşleşen bir kanal veya kategori yok. Lütfen filtreleri değiştirin.'}
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default AllChannels;
