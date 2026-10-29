
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, Clock } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ContentCard from '@/components/what-to-watch/ContentCard';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import { useWhenVisible } from '@/hooks/useWhenVisible';

const TrendingContentSlider = ({ title = "Trend İçerikler", customItems, customLoading, customError, customRefetch, isDe = false }) => {
  const { discoverMovies, discoverTV, loading: hookLoading, error: hookError } = useMovieDatabase();
  const [sectionRef, sectionVisible] = useWhenVisible({ rootMargin: '300px' });
  const [localItems, setLocalItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [emblaRef] = useEmblaCarousel(
    { align: 'start', loop: true, dragFree: true },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const fetchContent = useCallback(async () => {
    if (Array.isArray(customItems) && customItems.length > 0) return;

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
    if (Array.isArray(customItems) && customItems.length > 0) return;
    if (!sectionVisible) return;
    fetchContent();
    const intervalId = setInterval(fetchContent, 600000); // 10 minutes
    return () => clearInterval(intervalId);
  }, [fetchContent, customItems, sectionVisible]);

  const items =
    Array.isArray(customItems) && customItems.length > 0 ? customItems : localItems;
  const isLoading = customLoading !== undefined ? customLoading : (sectionVisible && (hookLoading || isFetching));
  const error = customError !== undefined ? customError : hookError;
  const refetch = customRefetch || fetchContent;

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString(isDe ? 'de-DE' : 'tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const copy = isDe
    ? {
        badge: '4K / Full HD Highlights',
        subtitle: 'Die beliebtesten Filme und Serien der Woche – hoch bewertet von Zuschauern.',
        lastUpdate: 'Zuletzt aktualisiert',
        errorTitle: 'Inhalte konnten nicht geladen werden',
        retry: 'Erneut versuchen',
        emptyTitle: 'Keine Inhalte',
        emptyBody: 'Derzeit sind keine Trend-Inhalte verfügbar. Bitte später erneut versuchen.',
        refresh: 'Aktualisieren',
      }
    : {
        badge: '4K / Full HD Öne Çıkanlar',
        subtitle: 'Haftanın en çok izlenen, izleyiciler tarafından yüksek puanlanmış popüler film ve dizileri.',
        lastUpdate: 'Son güncelleme',
        errorTitle: 'İçerikler Yüklenemedi',
        retry: 'Yeniden Dene',
        emptyTitle: 'İçerik Bulunamadı',
        emptyBody: 'Şu an için gösterilecek popüler içerik verisi bulunmuyor. Biraz sonra yeniden deneyin.',
        refresh: 'Yenile',
      };

  // Görünür olmadan TMDB isteği yok — hafif placeholder
  if (!sectionVisible && !(Array.isArray(customItems) && customItems.length > 0)) {
    return (
      <section ref={sectionRef} className="py-12 w-full container mx-auto px-4 min-h-[280px]" aria-hidden="true" />
    );
  }

  // Loading State
  if (isLoading && items.length === 0) {
    return (
      <section ref={sectionRef} className="py-12 w-full container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
            <span className="bg-gradient-to-b from-[#e50914] to-[#b20710] w-2 h-8 rounded-full animate-pulse"></span>
            <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex -ml-2 md:-ml-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-[0_0_33.333%] sm:flex-[0_0_33.333%] md:flex-[0_0_33.333%] lg:flex-[0_0_33.333%] pl-2 md:pl-4">
                <div className="flex flex-col gap-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-[#0a0a0a]/60" />
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
      <section ref={sectionRef} className="py-12 w-full container mx-auto px-4">
        <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-2xl mx-auto shadow-xl">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
          <p className="text-xl font-bold text-white mb-2">{copy.errorTitle}</p>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={refetch} 
            className="flex items-center gap-2 bg-primary hover:bg-primary text-white rounded-xl px-6 py-3 font-medium transition-all shadow-lg"
          >
            <RefreshCw className="w-5 h-5" /> {copy.retry}
          </button>
        </div>
      </section>
    );
  }

  if (!isLoading && !error && (!items || items.length === 0)) {
    return (
      <section ref={sectionRef} className="py-12 w-full container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-gradient-to-b from-[#e50914] to-[#b20710] w-2 h-8 rounded-full" />
          <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
        </div>
        <div className="text-center py-16 bg-[#0a0a0a]/50 rounded-2xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-xl font-bold text-white mb-2">{copy.emptyTitle}</p>
          <p className="text-slate-400 max-w-md mx-auto px-4">{copy.emptyBody}</p>
          <button
            type="button"
            onClick={() => refetch?.()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary"
          >
            <RefreshCw className="h-4 w-4" />
            {copy.refresh}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-12 relative w-full container mx-auto px-4 transition-opacity duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {copy.badge}
            </span>
          </div>
          <h2 className="section-title text-3xl md:text-4xl flex items-center gap-3">
            <span className="bg-gradient-to-b from-[#e50914] to-[#b20710] w-2 h-10 rounded-full" />
            <span className="text-white">{title}</span>
          </h2>
          <p className="text-slate-400 mt-1 md:mt-2 md:ml-5 text-sm md:text-base max-w-xl">
            {copy.subtitle}
          </p>
        </div>
        
        {lastUpdated && !(Array.isArray(customItems) && customItems.length > 0) && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-[#0a0a0a]/70 py-1.5 px-3 rounded-full border border-slate-700/80 shadow-lg shadow-slate-900/70">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{copy.lastUpdate}: {formatTime(lastUpdated)}</span>
          </div>
        )}
      </div>

      <div className="relative rounded-3xl border border-slate-800/80 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.12),transparent_55%),_radial-gradient(circle_at_bottom,_rgba(229,9,20,0.06),transparent_55%),_#0a0a0a] px-1.5 md:px-3 py-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-2 md:-ml-4 py-4">
            {items.map((item, index) => (
              <div 
                key={`${item.media_type || 'content'}-${item.id}`} 
                className="flex-[0_0_48%] sm:flex-[0_0_38%] md:flex-[0_0_30%] lg:flex-[0_0_22%] xl:flex-[0_0_18%] pl-2 md:pl-4"
              >
                <ContentCard item={item} type={item.media_type} isDe={isDe} accentIndex={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingContentSlider;
