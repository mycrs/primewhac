import React, { useMemo, memo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useTestModal } from '@/contexts/TestModalContext';

const MovieCard = memo(({ movie }) => {
  const { openModal } = useTestModal();
  
  // Quick optimization: use smaller image if possible
  const imageUrl = movie.image || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400";

  return (
    <div className="embla__slide flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_16%] min-w-0 pl-4 cursor-pointer" onClick={openModal}>
      <div className="aspect-[2/3] rounded-lg overflow-hidden relative border border-[#262626] bg-[#0a0a0a]">
        <img 
          src={imageUrl} 
          alt={`${movie.title} posteri`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-3 bg-[#0a0a0a] border-t border-[#262626]">
          <p className="text-white font-bold text-sm line-clamp-1">{movie.title}</p>
          <p className="text-gray-400 text-xs font-medium">{movie.genre || "Film"}</p>
        </div>
      </div>
    </div>
  );
});

const MovieSlider = ({ movies, siteTexts }) => {
  const plugins = useMemo(() => [Autoplay({ delay: 3500, stopOnInteraction: false })], []);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', dragFree: true }, plugins);

  // Memoize display list to prevent re-calculations
  const displayMovies = useMemo(() => {
    const safeMovies = Array.isArray(movies) ? movies : [];
    
    if (safeMovies.length > 0) {
        const list = [...safeMovies];
        while (list.length > 0 && list.length < 10) {
            list.push(...safeMovies);
        }
        return list.slice(0, 15);
    }
    return [];
  }, [movies]);

  if (!displayMovies.length) return null;

  return (
    <section className="py-16 bg-[#0a0a0a] border-b border-[#262626]">
      <div className="container mx-auto px-4 mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2">Popüler İçerikler</h2>
           <p className="text-gray-400 text-sm">En çok izlenen film ve diziler</p>
        </div>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex touch-pan-y">
          {displayMovies.map((movie, idx) => (
            <MovieCard key={`${movie.id || idx}-${idx}`} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(MovieSlider);