import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, RefreshCw, Clock, Film, Tv, Star, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ContentCard from '@/components/what-to-watch/ContentCard';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

const DEFAULT_CURATED_ITEMS = [
  {
    id: 693134,
    title: 'Dune: Çöl Gezegeni Bölüm İki',
    media_type: 'movie',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
    vote_average: 8.3,
    release_date: '2024-02-27',
    overview: 'Paul Atreides, ailesini yok eden komploculara karşı bir intikam savaşı yürütürken Chani ve Fremenlerle birleşir.',
    popularity: 95.4
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    media_type: 'movie',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    vote_average: 8.1,
    release_date: '2023-07-19',
    overview: 'Manhattan Projesi yöneticisi J. Robert Oppenheimer ve nükleer silah geliştirme sürecinin sürükleyici hikayesi.',
    popularity: 92.1
  },
  {
    id: 157336,
    title: 'Yıldızlararası (Interstellar)',
    media_type: 'movie',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    vote_average: 8.7,
    release_date: '2014-11-05',
    overview: 'İnsanlığın geleceğini kurtarmak için solucan deliğinden geçen bir grup kaşifin zaman ve uzay yolculuğu.',
    popularity: 90.0
  },
  {
    id: 1396,
    name: 'Breaking Bad',
    media_type: 'tv',
    poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP19.jpg',
    vote_average: 8.9,
    first_air_date: '2008-01-20',
    overview: 'Kanser teşhisi konan bir lise kimya öğretmeninin ailesinin geleceğini güvence altına alma serüveni.',
    popularity: 88.5
  },
  {
    id: 100088,
    name: 'The Last of Us',
    media_type: 'tv',
    poster_path: '/uKVGegafB59HGOPbyBZmglvZ4ft.jpg',
    backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
    vote_average: 8.6,
    first_air_date: '2023-01-15',
    overview: 'Modern uygarlığın çöküşünden 20 yıl sonra, hayatta kalan sert bir adam ile genç bir kızın tehlikeli yolculuğu.',
    popularity: 86.2
  },
  {
    id: 155,
    title: 'Kara Şövalye (The Dark Knight)',
    media_type: 'movie',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    vote_average: 8.5,
    release_date: '2008-07-16',
    overview: 'Batman, Teğmen Gordon ve Savcı Harvey Dent ile Gotham sokaklarını suçtan arındırmaya çalışır.',
    popularity: 85.0
  },
  {
    id: 27205,
    title: 'Başlangıç (Inception)',
    media_type: 'movie',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    vote_average: 8.4,
    release_date: '2010-07-15',
    overview: 'Rüya paylaşımı teknolojisiyle insanların zihinlerinden sır çalan yetenekli bir hırsızın son görevi.',
    popularity: 84.1
  },
  {
    id: 85937,
    name: 'Chernobyl',
    media_type: 'tv',
    poster_path: '/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    backdrop_path: '/uL6AdBipW5wW7b5V27m1D5gZt15.jpg',
    vote_average: 8.7,
    first_air_date: '2019-05-06',
    overview: '1986 yılında Ukrayna Sovyet Sosyalist Cumhuriyeti\'nde meydana gelen nükleer santral felaketi.',
    popularity: 83.0
  },
  {
    id: 66732,
    name: 'Stranger Things',
    media_type: 'tv',
    poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    vote_average: 8.6,
    first_air_date: '2016-07-15',
    overview: 'Küçük bir kasabada kaybolan bir çocuk ve peşinden ortaya çıkan gizemli doğaüstü güçler.',
    popularity: 82.5
  },
  {
    id: 76479,
    name: 'The Boys',
    media_type: 'tv',
    poster_path: '/2zm7mHapBEhFvqq2qWf4v8vQxWz.jpg',
    backdrop_path: '/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    vote_average: 8.4,
    first_air_date: '2019-07-26',
    overview: 'Güçlerini kötüye kullanan süper kahramanlara karşı savaşan yozlaşmamış bir intikam grubu.',
    popularity: 81.0
  },
  {
    id: 98,
    title: 'Gladyatör',
    media_type: 'movie',
    poster_path: '/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    vote_average: 8.2,
    release_date: '2000-05-01',
    overview: 'Roma İmparatoru\'nun oğlu tarafından ihanete uğrayan ve ailesi katledilen generalin gladyatör olarak intikamı.',
    popularity: 80.2
  },
  {
    id: 94997,
    name: 'House of the Dragon',
    media_type: 'tv',
    poster_path: '/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg',
    backdrop_path: '/etj8E2o0ej904ed12a79N819c9x.jpg',
    vote_average: 8.4,
    first_air_date: '2022-08-21',
    overview: 'Targaryen hanedanlığının iç savaşını ve ejderhaların dansını anlatan epik fantastik dizi.',
    popularity: 80.0
  }
];

const TrendingContentSlider = ({ title = "Popüler Film & Dizi Arşivi", customItems, customLoading, customError, customRefetch, isDe = false }) => {
  const { discoverMovies, discoverTV, loading: hookLoading, error: hookError } = useMovieDatabase();
  const [localItems, setLocalItems] = useState(DEFAULT_CURATED_ITEMS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: 'start', loop: true, dragFree: true },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

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
        .slice(0, 24);
        
      if (combined.length > 0) {
        setLocalItems(combined);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.warn("Trending fetch fallback active:", e);
    } finally {
      setIsFetching(false);
    }
  }, [discoverMovies, discoverTV, customItems]);

  useEffect(() => {
    if (Array.isArray(customItems) && customItems.length > 0) return;
    fetchContent();
    const intervalId = setInterval(fetchContent, 600000); // 10 minutes
    return () => clearInterval(intervalId);
  }, [fetchContent, customItems]);

  const rawItems = Array.isArray(customItems) && customItems.length > 0 ? customItems : localItems;

  const filteredItems = useMemo(() => {
    if (activeCategory === 'movies') {
      return rawItems.filter(item => (item.media_type || (item.title ? 'movie' : 'tv')) === 'movie');
    }
    if (activeCategory === 'tv') {
      return rawItems.filter(item => (item.media_type || (item.title ? 'movie' : 'tv')) === 'tv');
    }
    if (activeCategory === 'top_rated') {
      return rawItems.filter(item => Number(item.vote_average || 0) >= 7.8);
    }
    return rawItems;
  }, [rawItems, activeCategory]);

  const items = filteredItems.length > 0 ? filteredItems : rawItems;
  const isLoading = customLoading !== undefined ? customLoading : (hookLoading || isFetching);
  const error = customError !== undefined ? customError : hookError;
  const refetch = customRefetch || fetchContent;

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString(isDe ? 'de-DE' : 'tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const copy = isDe
    ? {
        badge: '4K ULTRA HD · VOD MEDIATHEK',
        title: title || 'Beliebte Filme & Serien',
        subtitle: 'Die gefragtesten Kinohits und Serien-Highlights der Woche – in 4K und Full HD.',
        all: 'Alle Inhalte',
        movies: '🎬 Kinofilme',
        tv: '📺 Serien-Hits',
        topRated: '⭐ IMDb 8+ Top',
        viewAll: 'Gesamte Mediathek ansehen',
        lastUpdate: 'Aktualisiert',
        errorTitle: 'Inhalte konnten nicht geladen werden',
        retry: 'Erneut versuchen',
        catalogLink: '/de/was-soll-ich-schauen',
      }
    : {
        badge: '4K ULTRA HD · VOD KÜTÜPHANESİ',
        title: title || 'Popüler Film & Dizi Arşivi',
        subtitle: 'Haftanın en çok izlenen, dünya genelinde yüksek puan almış hit sinema ve dizi yapımları.',
        all: 'Tüm Arşiv',
        movies: '🎬 Sinema Filmleri',
        tv: '📺 Popüler Diziler',
        topRated: '⭐ IMDb 8+ Seçkisi',
        viewAll: 'Tüm Kataloğu İncele',
        lastUpdate: 'Son Güncelleme',
        errorTitle: 'İçerikler Yüklenemedi',
        retry: 'Yeniden Dene',
        catalogLink: '/ne-izlesem',
      };

  return (
    <section className="py-14 relative w-full container mx-auto px-4">
      {/* Background ambient cinema glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-gradient-to-b from-[#e50914]/15 via-[#b20710]/5 to-transparent blur-3xl rounded-full" />

      {/* Header section with category pills and controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-white/5 pb-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e50914]/20 to-amber-500/20 border border-[#e50914]/40 px-3.5 py-1 backdrop-blur-md">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#e50914] animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white">
              {copy.badge}
            </span>
          </div>
          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl font-black flex items-center gap-3 tracking-tight">
            <span className="bg-gradient-to-b from-[#e50914] to-[#b20710] w-2.5 h-10 rounded-full" />
            <span className="text-white drop-shadow-md">{copy.title}</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        {/* Filter Pills + Controls */}
        <div className="flex flex-col items-start md:items-end gap-3.5 min-w-0 w-full md:w-auto">
          {/* Category Tabs */}
          <div className="flex max-w-full overflow-x-auto no-scrollbar items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-lg">
            {[
              { id: 'all', label: copy.all },
              { id: 'movies', label: copy.movies },
              { id: 'tv', label: copy.tv },
              { id: 'top_rated', label: copy.topRated },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                type="button"
                className={`shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg shadow-[#e50914]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Row: Last Update + Arrows */}
          <div className="flex items-center gap-3 w-full justify-between md:justify-end">
            {lastUpdated && (
              <div className="inline-flex items-center gap-2 text-[11px] text-slate-400 bg-white/[0.03] py-1.5 px-3 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-[#e50914]" />
                <span>{copy.lastUpdate}: {formatTime(lastUpdated)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                type="button"
                aria-label="Önceki"
                className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-[#e50914] border border-white/10 hover:border-[#e50914] flex items-center justify-center text-white transition-all duration-300 active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollNext}
                type="button"
                aria-label="Sonraki"
                className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-[#e50914] border border-white/10 hover:border-[#e50914] flex items-center justify-center text-white transition-all duration-300 active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && items.length === 0 && (
        <div className="overflow-hidden py-4">
          <div className="flex -ml-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-[0_0_50%] sm:flex-[0_0_33.3%] md:flex-[0_0_25%] lg:flex-[0_0_16.6%] pl-4">
                <div className="flex flex-col gap-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-white/[0.05]" />
                  <Skeleton className="h-4 w-3/4 rounded-md bg-white/[0.05]" />
                  <Skeleton className="h-3 w-1/2 rounded-md bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && items.length === 0 && (
        <div className="bg-[#121217] border border-white/10 rounded-3xl p-8 text-center max-w-xl mx-auto my-8">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-lg font-bold text-white mb-2">{copy.errorTitle}</p>
          <p className="text-slate-400 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            type="button"
            className="inline-flex items-center gap-2 bg-[#e50914] text-white rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg"
          >
            <RefreshCw className="w-4 h-4" /> {copy.retry}
          </button>
        </div>
      )}

      {/* Embla Cinema Showcase Carousel */}
      {items.length > 0 && (
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#111116] via-[#09090c] to-[#050507] p-3 md:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-4 md:w-12 bg-gradient-to-r from-[#09090c] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-4 md:w-12 bg-gradient-to-l from-[#09090c] to-transparent z-10" />

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-3 md:-ml-4 py-2">
              {items.map((item, index) => (
                <div
                  key={`${item.media_type || 'content'}-${item.id}-${index}`}
                  className="flex-[0_0_65%] sm:flex-[0_0_36%] md:flex-[0_0_28%] lg:flex-[0_0_20%] xl:flex-[0_0_16.6%] pl-3 md:pl-4"
                >
                  <ContentCard item={item} type={item.media_type} isDe={isDe} accentIndex={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Call to Action */}
          <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
            <span className="text-xs text-slate-400 font-medium">
              🎬 {isDe ? 'Über 15.000 VOD-Titel in Ultra HD und Dolby Audio' : '15.000+ Film & Dizi Ultra HD ve Dolby Ses Kalitesiyle'}
            </span>
            <Link
              to={copy.catalogLink}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#e50914] hover:text-white transition-colors group"
            >
              <span>{copy.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingContentSlider;
