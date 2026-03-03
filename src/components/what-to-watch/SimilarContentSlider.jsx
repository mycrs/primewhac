
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { Button } from '@/components/ui/button';

const SimilarContentSlider = ({ items = [], type = 'movie' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    slidesToScroll: 2,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
      '(min-width: 1280px)': { slidesToScroll: 5 }
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 py-4">
          {items.map((item) => (
            <div key={item.id} className="flex-[0_0_50%] sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_20%] pl-4 min-w-0">
              <ContentCard item={item} type={type} />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-purple-600 opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 shadow-xl"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-purple-600 opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 shadow-xl"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SimilarContentSlider;
