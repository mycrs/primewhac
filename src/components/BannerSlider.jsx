
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ImageOptimizer from '@/components/ImageOptimizer';

const BannerSlider = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const plugins = useMemo(() => [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ], []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    skipSnaps: false
  }, plugins);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const validBanners = useMemo(() => {
    if (!banners || !Array.isArray(banners)) return [];
    return banners
      .filter(b => b.url)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [banners]);

  const displayBanners = validBanners.length > 0 ? validBanners : [
    {
      id: 'default',
      url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop',
      title: 'Hoş Geldiniz',
      description: 'En kaliteli içerikler tek bir platformda.'
    }
  ];

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-[#0a0a0a] group content-visibility-auto">
      <div className="absolute inset-0 embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex gpu-accelerated">
          {displayBanners.map((banner, index) => (
            <div className="embla__slide relative flex-[0_0_100%] min-w-0 h-full" key={banner.id || index}>
              <div className="absolute inset-0">
                <ImageOptimizer 
                  src={banner.url} 
                  alt={banner.title || 'Banner Image'} 
                  className="w-full h-full object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#141414]/80" />
              </div>

              <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                <AnimatePresence mode="wait">
                  {currentSlide === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="max-w-4xl gpu-accelerated"
                    >
                      {banner.title && (
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
                          {banner.title}
                        </h2>
                      )}
                      {banner.description && (
                        <p className="text-lg md:text-2xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
                          {banner.description}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none z-20">
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={scrollNext}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 backdrop-blur-sm",
              currentSlide === index ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default React.memo(BannerSlider);
