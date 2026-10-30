import React, { useState, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Tv, 
  Trophy, 
  Newspaper, 
  Film, 
  Compass, 
  Baby, 
  Music, 
  Globe, 
  Layers, 
  X, 
  Radio,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';
import { turkishChannels } from '@/data/turkishChannels';
import { Button } from '@/components/ui/button';
import { getChannelImageUrl } from '@/utils/channelImageUtils';
import { useLocation } from 'react-router-dom';

const CATEGORY_ICONS = {
  'Tümü': Layers,
  'Alle': Layers,
  'Genel': Tv,
  'Allgemein': Tv,
  'Spor': Trophy,
  'Sport': Trophy,
  'Haber': Newspaper,
  'Nachrichten': Newspaper,
  'Sinema': Film,
  'Film': Film,
  'Kino & Filme': Film,
  'Belgesel': Compass,
  'Dokumentation': Compass,
  'Çocuk': Baby,
  'Kinder': Baby,
  'Müzik': Music,
  'Musik': Music,
  'Uluslararası': Globe,
  'International': Globe
};

const ChannelCard = memo(({ channel, index, isDe }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);

  const rawBgUrl = channel.background_image_url || channel.image_url;
  const bgImageUrl = rawBgUrl ? rawBgUrl : getChannelImageUrl(null, 'desktop', channel.category);
  const logoUrl = channel.logo_url || channel.logoUrl;
  const quality = channel.quality || (index % 3 === 0 ? '4K UHD' : '60 FPS FHD');
  const description = isDe ? (channel.description_de || channel.description) : channel.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35, delay: Math.min((index % 8) * 0.04, 0.3) }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-red-500/50 bg-[#0c0d12] shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_35px_rgba(229,9,20,0.22)] transition-all duration-300 aspect-[4/3] flex flex-col justify-end cursor-pointer select-none"
    >
      {/* Background Skeleton */}
      {!bgLoaded && !bgError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#131620] to-[#07080a] animate-pulse" />
      )}

      {/* Background Image */}
      <img 
        src={bgImageUrl}
        alt={`${channel.name} görseli`}
        onLoad={() => setBgLoaded(true)}
        onError={() => {
          setBgLoaded(true);
          setBgError(true);
        }}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
      />

      {/* Dark Gradient Scrim Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/55 to-black/15 z-10" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#07080b]/70 z-10 pointer-events-none" />

      {/* Top Bar: Channel Logo + Live Resolution Chip */}
      <div className="absolute top-2.5 inset-x-2.5 md:top-3 md:inset-x-3 z-20 flex items-center justify-between">
        <div className="w-8 h-8 md:w-9 md:h-9 bg-black/70 backdrop-blur-md rounded-xl flex items-center justify-center p-1.5 border border-white/15 shadow-md group-hover:border-red-500/40 transition-colors">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={channel.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`items-center justify-center text-slate-300 ${logoUrl ? 'hidden' : 'flex'}`}>
            <Tv className="w-3.5 h-3.5 text-red-500" />
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] md:text-[11px] font-mono font-bold tracking-wider text-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{quality}</span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-20 p-3.5 md:p-4 w-full">
        <div className="flex items-center gap-1.5 mb-1">
          {channel.category && (
            <span className="text-[9px] md:text-[10px] uppercase font-mono font-bold tracking-wider text-red-400 px-1.5 py-0.5 rounded bg-red-950/60 border border-red-900/50 backdrop-blur-sm">
              {channel.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-medium text-slate-400">
            <Radio className="w-2.5 h-2.5 text-emerald-400" />
            {isDe ? 'Live' : 'Canlı'}
          </span>
        </div>

        <h4 className="text-white text-sm md:text-base lg:text-lg font-display font-bold truncate drop-shadow-md group-hover:text-red-400 transition-colors">
          {channel.name}
        </h4>

        {description && (
          <p className="text-[11px] md:text-xs text-slate-400 line-clamp-1 mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
});

const AllChannels = ({ channels: propChannels }) => {
  const { channels: realtimeChannels } = useChannelsRealtime();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');

  // Unified channel dataset
  const activeChannels = useMemo(() => {
    const source = propChannels || realtimeChannels;
    const list = Array.isArray(source) && source.length > 0 ? source : turkishChannels;
    const filtered = list.filter(c => c && c.is_active !== false);
    return filtered.length > 0 ? filtered : turkishChannels;
  }, [propChannels, realtimeChannels]);

  // Standard category translations
  const categoryTranslationMap = useMemo(() => ({
    'Tümü': isDe ? 'Alle' : 'Tümü',
    'Genel': isDe ? 'Allgemein' : 'Genel',
    'Spor': isDe ? 'Sport' : 'Spor',
    'Haber': isDe ? 'Nachrichten' : 'Haber',
    'Sinema': isDe ? 'Kino & Filme' : 'Sinema',
    'Film': isDe ? 'Kino & Filme' : 'Sinema',
    'Belgesel': isDe ? 'Dokumentation' : 'Belgesel',
    'Çocuk': isDe ? 'Kinder' : 'Çocuk',
    'Müzik': isDe ? 'Musik' : 'Müzik',
    'Uluslararası': isDe ? 'International' : 'Uluslararası'
  }), [isDe]);

  // Categorize channels and calculate category counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts = { 'Tümü': activeChannels.length };
    const rawCategories = new Set();

    activeChannels.forEach(c => {
      if (c.category) {
        rawCategories.add(c.category);
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });

    // Preferred sort order
    const priority = ['Tümü', 'Genel', 'Spor', 'Haber', 'Sinema', 'Belgesel', 'Çocuk', 'Müzik', 'Uluslararası'];
    const ordered = [];

    priority.forEach(cat => {
      if (cat === 'Tümü' || rawCategories.has(cat)) {
        ordered.push(cat);
        rawCategories.delete(cat);
      }
    });

    // Append any extra category
    rawCategories.forEach(cat => ordered.push(cat));

    return { categories: ordered, categoryCounts: counts };
  }, [activeChannels]);

  // Filtered channel results
  const filteredChannels = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return activeChannels.filter(channel => {
      const matchesCategory = selectedCategory === 'Tümü' || channel.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!term) return true;

      const nameMatch = channel.name?.toLowerCase().includes(term);
      const descMatch = channel.description?.toLowerCase().includes(term);
      const descDeMatch = channel.description_de?.toLowerCase().includes(term);
      const catMatch = channel.category?.toLowerCase().includes(term);

      return nameMatch || descMatch || descDeMatch || catMatch;
    });
  }, [activeChannels, searchTerm, selectedCategory]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Tümü');
  };

  return (
    <section className="py-16 md:py-24 bg-[#0a0a0d] relative z-10 border-b border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium text-slate-300 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>{isDe ? 'DURCHSUCHBARE SENDERLISTE' : 'CANLI KANAL VERİ TABANI'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            {isDe ? 'Alle Sender im Überblick' : 'Kategori ve Kanal Rehberi'}
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {isDe
              ? 'Finden Sie blitzschnell Ihre Lieblingssender nach Kategorien sortiert oder über die Suchleiste.'
              : 'Geniş yayın arşivimizdeki tüm ulusal, spor, sinema, haber ve belgesel kanallarını filtreleyin ve keşfedin.'}
          </p>
        </div>

        {/* STICKY SEARCH & CATEGORY FILTER CONTROL LOUNGE */}
        <div className="sticky top-20 z-30 mb-10 bg-[#0c0d12]/95 backdrop-blur-xl p-4 md:p-6 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
          <div className="flex flex-col gap-4">
            
            {/* Search Input Bar */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={
                  isDe
                    ? 'Sender suchen... (z.B. ARD, ZDF, TRT, Spor, Doku)'
                    : 'Kanal adı veya içerik ara... (Örn: TRT, ATV, Spor, Belgesel)'
                }
                className="w-full h-13 md:h-14 pl-12 pr-28 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-red-500/60 focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-red-500/40 text-white placeholder:text-slate-500 text-sm md:text-base font-medium transition-all"
              />

              {/* Clear button or result count */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                    title="Temizle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-slate-400">
                  {filteredChannels.length} {isDe ? 'Sender' : 'Kanal'}
                </span>
              </div>
            </div>

            {/* Category Pills Strip (Horizontal scrolling on mobile) */}
            <div className="overflow-x-auto no-scrollbar -mx-2 px-2 py-1 flex items-center gap-2 md:gap-2.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const Icon = CATEGORY_ICONS[cat] || CATEGORY_ICONS[categoryTranslationMap[cat]] || Layers;
                const label = categoryTranslationMap[cat] || cat;
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-600/30 to-red-950/40 border border-red-500/70 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                        : 'bg-white/[0.03] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    <span>{label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected 
                        ? 'bg-red-500/30 text-white font-bold' 
                        : 'bg-white/5 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* RESULTS STATUS BAR */}
        <div className="flex items-center justify-between mb-6 px-2 text-xs md:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              {isDe ? 'Angezeigt:' : 'Listelenen:'} <strong className="text-white">{filteredChannels.length}</strong> {isDe ? 'Sender' : 'Kanal'}
            </span>
            {selectedCategory !== 'Tümü' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/50 border border-red-900/40 text-red-300 text-xs">
                {categoryTranslationMap[selectedCategory] || selectedCategory}
              </span>
            )}
          </div>

          {(searchTerm || selectedCategory !== 'Tümü') && (
            <button
              onClick={handleResetFilters}
              className="text-red-400 hover:text-red-300 text-xs font-semibold underline underline-offset-4 cursor-pointer"
            >
              {isDe ? 'Filter zurücksetzen' : 'Tüm Filtreleri Sıfırla'}
            </button>
          )}
        </div>

        {/* CHANNEL GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          <AnimatePresence>
            {filteredChannels.map((channel, index) => (
              <ChannelCard 
                key={channel.id || `${channel.name}-${index}`} 
                channel={channel} 
                index={index}
                isDe={isDe}
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* EMPTY STATE */}
        {filteredChannels.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[#0c0d12]/60 rounded-3xl border border-white/10 backdrop-blur-md mx-auto max-w-xl p-8 shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-900/50 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Tv className="w-8 h-8" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {isDe ? 'Keine Sender gefunden' : 'Kanal Bulunamadı'}
            </h3>
            <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed">
              {isDe 
                ? 'Zu Ihrer Suche oder den gewählten Filtern wurden leider keine passenden Kanäle gefunden.' 
                : 'Aradığınız kriterlere veya kategoriye uygun kanal bulunamadı. Lütfen arama terimini veya filtreyi değiştirin.'}
            </p>
            <Button
              onClick={handleResetFilters}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-full"
            >
              {isDe ? 'Filter zurücksetzen' : 'Tüm Kanalları Göster'}
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default memo(AllChannels);
