
import React, { useMemo, memo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DynamicChannelCard from './DynamicChannelCard';
import { useLocation } from 'react-router-dom';

const LoadingSkeleton = () => (
  <div className="flex gap-6 overflow-hidden py-8 px-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex-[0_0_auto]">
        <div className="w-[200px] h-[150px] md:w-[250px] md:h-[180px] lg:w-[300px] lg:h-[200px] bg-[#0a0a0a]/50 rounded-xl animate-pulse border border-white/5" />
      </div>
    ))}
  </div>
);

const ChannelSlider = () => {
  const { channels, loading, error, refetch } = useChannelsRealtime();
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');
  
  const title = isDe ? 'Empfohlene Kanäle' : 'Öne Çıkan Kanallar';
  const description = isDe ? 'Die beliebtesten Premium-Inhalte' : 'En çok izlenen premium içerikler';
  
  const plugins = useMemo(() => [Autoplay({ delay: 3000, stopOnInteraction: false })], []);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', dragFree: true }, plugins);

  // Filter only active channels
  const activeChannels = useMemo(() => {
    return channels ? channels.filter(c => c.is_active !== false) : [];
  }, [channels]);

  // Duplicate channels for smooth infinite loop if we have too few
  const displayChannels = useMemo(() => {
    if (!activeChannels || activeChannels.length === 0) return [];
    
    let list = [...activeChannels];
    while (list.length > 0 && list.length < 15) {
      list = [...list, ...activeChannels];
    }
    return list;
  }, [activeChannels]);

  return (
    <section className="luxury-rail py-16 relative flex flex-col justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#141414]/20 to-[#0a0a0a] pointer-events-none" />
      
      <div className="container mx-auto px-4 mb-8 text-center relative z-10">
        <span className="luxury-kicker mb-4">{isDe ? 'Premium Auswahl' : 'Premium Seçki'}</span>
        <h2 className="section-title text-3xl md:text-4xl mb-3">{title}</h2>
        <p className="text-slate-400 text-lg">{description}</p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 z-10 relative">
          <p className="text-red-400 mb-4 bg-red-950/30 px-6 py-3 rounded-lg border border-red-900/50">
            {isDe
              ? 'Kanallere momentan nicht zugreifbar. Bitte später erneut versuchen oder WhatsApp kontaktieren.'
              : 'Kanallar şu an yüklenemedi. Bir süre sonra tekrar deneyebilir veya WhatsApp üzerinden bize ulaşabilirsiniz.'}
          </p>
          <Button onClick={refetch} variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-[#0a0a0a]">
            <RefreshCw className="w-4 h-4 mr-2" /> {isDe ? 'Erneut versuchen' : 'Tekrar Dene'}
          </Button>
        </div>
      ) : displayChannels.length > 0 ? (
        <div className="relative z-10 mx-auto w-full max-w-[96rem] overflow-hidden py-5 pl-4 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-gradient-to-r before:from-[#0a0a0a] before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-gradient-to-l after:from-[#0a0a0a] after:to-transparent" ref={emblaRef}>
          <div className="embla__container flex touch-pan-y items-center">
            {displayChannels.map((channel, idx) => (
              <DynamicChannelCard 
                key={`${channel.id || idx}-${idx}`} 
                channel={channel}
                index={idx}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 z-10 relative bg-[#0a0a0a]/50 rounded-xl mx-4 border border-slate-800 max-w-2xl mx-auto">
          <p className="mb-2 text-lg">
            {isDe ? 'Derzeit sind keine aktiven Kanäle verfügbar.' : 'Şu anda gösterilecek aktif kanal bulunmuyor.'}
          </p>
          <p className="text-sm opacity-70">
            {isDe ? 'Bitte fügen Sie Kanäle über das Admin-Panel hinzu.' : 'Lütfen admin panelinden kanal ekleyin.'}
          </p>
        </div>
      )}
    </section>
  );
};

export default memo(ChannelSlider);
