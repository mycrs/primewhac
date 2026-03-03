
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, Clock } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ContentCard from '@/components/what-to-watch/ContentCard';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingContentSlider = ({ title = "Trend İçerikler", customItems, customLoading, customError, customRefetch, isDe = false }) => {
  const { discoverMovies, discoverTV, loading: hookLoading, error: hookError } = useMovieDatabase();
  const [localItems, setLocalItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [emblaRef] = useEmblaCarousel(
    { align: 'start', loop: true, dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const fetchContent = useCallback(async () => {
    if (customItems) return; // Skip fetch if data is provided via props
    
    setIsFetching(true);
    try {
      const [moviesRes, tvRes] = await Promise.all([
        discoverMovies({ sort_by: 'popularity.desc', page: 1 }),
        discoverTV({ sort_by: 'popularity.desc', page: 1 })
      ]);
      
      const movies = (moviesRes?.results || []).map(m => ({ ...m, media_type: 'movie' }));
      const tvs = (tvRes?.results || []).map(t => ({ ...t, media_type: 'tv' }));
      
      const combined = [...movies, ...tvs]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 12);
        
      setLocalItems(combined);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Trending fetch error:", e);
    } finally {
      setIsFetching(false);
    }
  }, [discoverMovies, discoverTV, customItems]);

  useEffect(() => {
    if (!customItems) {
      fetchContent();
      const intervalId = setInterval(fetchContent, 600000); // 10 minutes
      return () => clearInterval(intervalId);
    }
  }, [fetchContent, customItems]);

  const items = customItems || localItems;
  const isLoading = customLoading !== undefined ? customLoading : (hookLoading || isFetching);
  const error = customError !== undefined ? customError : hookError;
  const refetch = customRefetch || fetchContent;

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString(isDe ? 'de-DE' : 'tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const copy = isDe
    ? { badge: '4K / Full HD Highlights', subtitle: 'Die beliebtesten Filme und Serien der Woche – hoch bewertet von Zuschauern.', lastUpdate: 'Zuletzt aktualisiert', errorTitle: 'Inhalte konnten nicht geladen werden', retry: 'Erneut versuchen' }
    : { badge: '4K / Full HD Öne Çıkanlar', subtitle: 'Haftanın en çok izlenen, izleyiciler tarafından yüksek puanlanmış popüler film ve dizileri.', lastUpdate: 'Son güncelleme', errorTitle: 'İçerikler Yüklenemedi', retry: 'Yeniden Dene' };

  // Loading State
  if (isLoading && items.length === 0) {
    return (
      <section className="py-12 w-full container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
            <span className="bg-gradient-to-b from-purple-400 to-indigo-600 w-2 h-8 rounded-full animate-pulse"></span>
            <h2 className="text-3xl font-extrabold text-white">{title}</h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex -ml-2 md:-ml-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-[0_0_33.333%] sm:flex-[0_0_33.333%] md:flex-[0_0_33.333%] lg:flex-[0_0_33.333%] pl-2 md:pl-4">
                <div className="flex flex-col gap-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-slate-800/60" />
                  <div className="space-y-2 mt-2 px-1">
                    <Skeleton className="h-5 w-4/5 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error && items.length === 0) {
    return (
      <section className="py-12 w-full container mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-xl">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{copy.errorTitle}</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={refetch} 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 py-3 font-medium transition-all shadow-lg"
          >
            <RefreshCw className="w-5 h-5" /> {copy.retry}
          </button>
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 relative w-full container mx-auto px-4 transition-opacity duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.22em] text-purple-200">
              {copy.badge}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
            <span className="bg-gradient-to-b from-purple-400 to-indigo-600 w-2 h-10 rounded-full" />
            <span className="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-slate-400 mt-1 md:mt-2 md:ml-5 text-sm md:text-base max-w-xl">
            {copy.subtitle}
          </p>
        </div>
        
        {lastUpdated && !customItems && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/70 py-1.5 px-3 rounded-full border border-slate-700/80 shadow-lg shadow-slate-900/70">
            <Clock className="w-3.5 h-3.5 text-purple-300" />
            <span>{copy.lastUpdate}: {formatTime(lastUpdated)}</span>
          </div>
        )}
      </div>

      <div className="relative rounded-3xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_55%),_radial-gradient(circle_at_bottom,_rgba(236,72,153,0.16),transparent_55%),_#020617] px-1.5 md:px-3 py-2.5 shadow-[0_24px_80px_rgba(15,23,42,0.95)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#020617] via-[#020617]/80 to-transparent" />
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-2 md:-ml-4 py-4">
            {items.map((item) => (
              <div 
                key={`${item.media_type || 'content'}-${item.id}`} 
                className="flex-[0_0_33.333%] sm:flex-[0_0_33.333%] md:flex-[0_0_30%] lg:flex-[0_0_20%] xl:flex-[0_0_16.666%] pl-2 md:pl-4"
              >
                <ContentCard item={item} type={item.media_type} isDe={isDe} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingContentSlider;
