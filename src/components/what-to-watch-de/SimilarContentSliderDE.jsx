
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCardDE from './ContentCardDE';
import { Button } from '@/components/ui/button';

const SimilarContentSliderDE = ({ items = [], type = 'movie' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/slider">
      <h2 className="text-2xl font-bold text-white mb-6">Ähnliche Inhalte</h2>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 py-4">
          {items.slice(0, 10).map((item) => ( // limit to 10 for performance
            <div key={item.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 min-w-0">
              <ContentCardDE item={item} type={type} />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 w-12 h-12 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-pink-600 opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 shadow-xl"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 w-12 h-12 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-pink-600 opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 shadow-xl"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default SimilarContentSliderDE;
