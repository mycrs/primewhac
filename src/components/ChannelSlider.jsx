import React, { useMemo, memo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';
import { turkishChannels } from '@/data/turkishChannels';
import DynamicChannelCard from './DynamicChannelCard';
import { useLocation } from 'react-router-dom';

const ChannelSlider = ({ channels: propChannels }) => {
  const { channels: realtimeChannels } = useChannelsRealtime();
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');
  
  const title = isDe ? 'Beliebte Sender & Live Streams' : 'Öne Çıkan Canlı Kanallar';
  const subtitle = isDe 
    ? 'Kristallklare 4K/UHD Qualität auf allen Geräten ohne Ruckeln' 
    : 'Yüksek bant genişliği ve Anycast CDN altyapısıyla sıfır donma garantili canlı yayınlar';

  const plugins = useMemo(() => [Autoplay({ delay: 2800, stopOnInteraction: false })], []);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', dragFree: true }, plugins);

  // Filter only active channels, with resilient fallback
  const activeChannels = useMemo(() => {
    const source = propChannels || realtimeChannels;
    const list = Array.isArray(source) && source.length > 0 ? source : turkishChannels;
    const filtered = list.filter(c => c && c.is_active !== false);
    return filtered.length > 0 ? filtered : turkishChannels;
  }, [propChannels, realtimeChannels]);

  // Duplicate channels for smooth infinite loop if we have too few
  const displayChannels = useMemo(() => {
    if (!activeChannels || activeChannels.length === 0) return turkishChannels;
    
    let list = [...activeChannels];
    while (list.length > 0 && list.length < 16) {
      list = [...list, ...activeChannels];
    }
    return list;
  }, [activeChannels]);

  return (
    <section className="py-16 md:py-20 relative flex flex-col justify-center overflow-hidden border-b border-white/5 bg-[#07080b]">
      {/* Background ambient obsidian lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[15rem] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium text-slate-300 mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isDe ? '● 10.000+ SENDER AKTIV · ANYCAST 4K CDN' : '● 10.000+ KANAL AKTİF · ANYCAST 4K CDN'}</span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-3 drop-shadow-sm">
          {title}
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Infinite Carousel Rail */}
      <div 
        className="relative z-10 mx-auto w-full max-w-[96rem] overflow-hidden py-3 pl-4 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-20 md:before:w-32 before:bg-gradient-to-r before:from-[#07080b] before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-20 md:after:w-32 after:bg-gradient-to-l after:from-[#07080b] after:to-transparent" 
        ref={emblaRef}
      >
        <div className="embla__container flex touch-pan-y items-center">
          {displayChannels.map((channel, idx) => (
            <DynamicChannelCard 
              key={`${channel.id || channel.name || idx}-${idx}`} 
              channel={channel}
              index={idx}
              isDe={isDe}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(ChannelSlider);
