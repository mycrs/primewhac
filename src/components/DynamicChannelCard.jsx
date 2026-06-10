
import React, { memo, useState } from 'react';
import { Tv } from 'lucide-react';
import { getChannelImageUrl } from '@/utils/channelImageUtils';
import { cn } from '@/lib/utils';

const CARD_COLORS = [
  { gradient: 'from-[#e50914]/45 via-[#0a0a0a]/10 to-[#b20710]/65', border: 'border-[#e50914]/45', shadow: 'hover:shadow-[#e50914]/35', glow: 'group-hover:border-[#e50914]/80' },
  { gradient: 'from-amber-400/30 via-[#0a0a0a]/10 to-[#e50914]/55', border: 'border-amber-400/35', shadow: 'hover:shadow-amber-400/25', glow: 'group-hover:border-amber-300/70' },
  { gradient: 'from-white/20 via-[#0a0a0a]/10 to-[#e50914]/50', border: 'border-white/15', shadow: 'hover:shadow-white/10', glow: 'group-hover:border-white/35' },
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
        "w-[200px] h-[150px] md:w-[250px] md:h-[180px] lg:w-[300px] lg:h-[200px] rounded-2xl overflow-hidden relative transition-all duration-300 transform group-hover:scale-[1.035] shadow-lg group-hover:shadow-2xl border-2 bg-[#0a0a0a]",
        colorStyles.border,
        colorStyles.glow,
        colorStyles.shadow
      )}>
        
        {/* Skeleton/Placeholder for background */}
        {!bgLoaded && !bgError && (
          <div className="absolute inset-0 bg-[#0a0a0a] animate-pulse" />
        )}

        {/* Arka plan görseli - yüksek çözünürlük ve keskin ölçekleme (admin’de 600×400+ önerilir) */}
        <img
          src={bgImageUrl}
          alt=""
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300 z-10" />

        {/* Logo - sol üst köşe şık küçük */}
        <div className="absolute top-2 left-2 z-20">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-black/50 backdrop-blur-md rounded-lg flex items-center justify-center p-1.5 shadow-md border border-white/20 transition-transform duration-300 group-hover:scale-105 group-hover:bg-black/60 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={channel?.name ? `${channel.name} kanal logosu` : 'IPTV kanal logosu'}
                className="max-h-full max-w-full object-contain drop-shadow-lg select-none"
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
              <Tv className="w-4 h-4 md:w-5 md:h-5 drop-shadow-md" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-end p-4 pt-12">
          {/* Channel Info */}
          <div className="w-full mt-auto">
            <p className="text-white font-bold text-lg truncate w-full drop-shadow-md" title={channel.name}>
              {channel.name}
            </p>
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
