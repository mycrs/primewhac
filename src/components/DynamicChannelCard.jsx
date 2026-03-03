
import React, { memo, useState } from 'react';
import { Tv } from 'lucide-react';
import { getChannelImageUrl } from '@/utils/channelImageUtils';
import { cn } from '@/lib/utils';

const CARD_COLORS = [
  { gradient: 'from-blue-500/40 to-blue-900/60', border: 'border-blue-500/50', shadow: 'hover:shadow-blue-500/50', glow: 'group-hover:border-blue-400' },
  { gradient: 'from-green-500/40 to-green-900/60', border: 'border-green-500/50', shadow: 'hover:shadow-green-500/50', glow: 'group-hover:border-green-400' },
  { gradient: 'from-red-500/40 to-red-900/60', border: 'border-red-500/50', shadow: 'hover:shadow-red-500/50', glow: 'group-hover:border-red-400' },
  { gradient: 'from-orange-500/40 to-orange-900/60', border: 'border-orange-500/50', shadow: 'hover:shadow-orange-500/50', glow: 'group-hover:border-orange-400' },
  { gradient: 'from-purple-500/40 to-purple-900/60', border: 'border-purple-500/50', shadow: 'hover:shadow-purple-500/50', glow: 'group-hover:border-purple-400' },
  { gradient: 'from-pink-500/40 to-pink-900/60', border: 'border-pink-500/50', shadow: 'hover:shadow-pink-500/50', glow: 'group-hover:border-pink-400' },
  { gradient: 'from-cyan-500/40 to-cyan-900/60', border: 'border-cyan-500/50', shadow: 'hover:shadow-cyan-500/50', glow: 'group-hover:border-cyan-400' },
  { gradient: 'from-yellow-500/40 to-yellow-900/60', border: 'border-yellow-500/50', shadow: 'hover:shadow-yellow-500/50', glow: 'group-hover:border-yellow-400' },
  { gradient: 'from-indigo-500/40 to-indigo-900/60', border: 'border-indigo-500/50', shadow: 'hover:shadow-indigo-500/50', glow: 'group-hover:border-indigo-400' },
  { gradient: 'from-teal-500/40 to-teal-900/60', border: 'border-teal-500/50', shadow: 'hover:shadow-teal-500/50', glow: 'group-hover:border-teal-400' },
  { gradient: 'from-rose-500/40 to-rose-900/60', border: 'border-rose-500/50', shadow: 'hover:shadow-rose-500/50', glow: 'group-hover:border-rose-400' },
  { gradient: 'from-lime-500/40 to-lime-900/60', border: 'border-lime-500/50', shadow: 'hover:shadow-lime-500/50', glow: 'group-hover:border-lime-400' },
];

const DynamicChannelCard = memo(({ channel, index = 0 }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);

  const handleCardClick = () => {
    // Silent operation
  };

  // Prioritize background_image_url over image_url; fallback yüksek çözünürlük (slider kartları net görünsün)
  const rawBgUrl = channel.background_image_url || channel.image_url;
  const bgImageUrl = rawBgUrl ? rawBgUrl : getChannelImageUrl(null, 'slider', channel.category);
  const logoUrl = channel.logo_url || channel.logoUrl;

  const colorStyles = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div 
      onClick={handleCardClick}
      className="flex-[0_0_auto] min-w-0 mr-6 cursor-pointer group"
    >
      <div className={cn(
        "w-[200px] h-[150px] md:w-[250px] md:h-[180px] lg:w-[300px] lg:h-[200px] rounded-xl overflow-hidden relative transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl border-2 bg-slate-900",
        colorStyles.border,
        colorStyles.glow,
        colorStyles.shadow
      )}>
        
        {/* Skeleton/Placeholder for background */}
        {!bgLoaded && !bgError && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}

        {/* Arka plan görseli - yüksek çözünürlük ve keskin ölçekleme (admin’de 600×400+ önerilir) */}
        <img 
          src={bgImageUrl}
          alt={`${channel.name} background`}
          onLoad={() => setBgLoaded(true)}
          onError={() => {
            setBgLoaded(true);
            setBgError(true);
          }}
          decoding="async"
          loading="lazy"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          className={`absolute inset-0 w-full h-full min-w-full min-h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110 ${bgLoaded && !bgError ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Colorful Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br mix-blend-overlay z-[5] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500",
          colorStyles.gradient
        )} />

        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300 z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-between p-4">
          {/* Logo - büyük alan ve net görüntü (yüksek çözünürlüklü logo URL'leri önerilir) */}
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center p-2 shadow-inner border border-white/20 transition-transform duration-300 group-hover:scale-105 shrink-0">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={channel.name} 
                width={96}
                height={96}
                className="w-full h-full object-contain drop-shadow-lg select-none"
                style={{ imageRendering: 'auto' }}
                loading="lazy"
                decoding="async"
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
                }} 
              />
            ) : null}
            <div className={`items-center justify-center text-white/90 ${logoUrl ? 'hidden' : 'flex'}`}>
              <Tv className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
            </div>
          </div>
          
          {/* Channel Info */}
          <div className="w-full mt-auto">
            <h4 className="text-white font-bold text-lg truncate w-full drop-shadow-md" title={channel.name}>
              {channel.name}
            </h4>
            {channel.description && (
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">
                {channel.description}
              </p>
            )}
            {channel.category && (
              <span className="text-[10px] text-white/90 font-semibold px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded border border-white/10 inline-block shadow-sm uppercase tracking-wider">
                {channel.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DynamicChannelCard;
