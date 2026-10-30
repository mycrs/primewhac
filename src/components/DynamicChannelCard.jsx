import React, { memo, useState } from 'react';
import { Tv, Radio } from 'lucide-react';
import { getChannelImageUrl } from '@/utils/channelImageUtils';
import { cn } from '@/lib/utils';

const DynamicChannelCard = memo(({ channel, index = 0, isDe = false }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);

  const rawBgUrl = channel.background_image_url || channel.image_url;
  const bgImageUrl = rawBgUrl ? rawBgUrl : getChannelImageUrl(null, 'slider', channel.category);
  const logoUrl = channel.logo_url || channel.logoUrl;
  const quality = channel.quality || (index % 3 === 0 ? '4K UHD' : '60 FPS FHD');
  const description = isDe ? (channel.description_de || channel.description) : channel.description;

  return (
    <div className="flex-[0_0_auto] min-w-0 mr-5 cursor-pointer group select-none">
      <div className={cn(
        "w-[220px] h-[160px] md:w-[270px] md:h-[190px] lg:w-[320px] lg:h-[210px] rounded-2xl overflow-hidden relative transition-all duration-500 transform group-hover:-translate-y-1 group-hover:scale-[1.02]",
        "border border-white/10 group-hover:border-red-500/50 bg-[#0c0d12] shadow-[0_10px_30px_rgba(0,0,0,0.6)] group-hover:shadow-[0_15px_40px_rgba(229,9,20,0.25)]"
      )}>
        
        {/* Placeholder / skeleton with category ambient tint */}
        {!bgLoaded && !bgError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-[#0e1017] to-[#07080b] animate-pulse" />
        )}

        {/* Background Image */}
        <img
          src={bgImageUrl}
          alt={`${channel?.name || 'Kanal'} görseli`}
          width={320}
          height={210}
          onLoad={() => setBgLoaded(true)}
          onError={() => {
            setBgLoaded(true);
            setBgError(true);
          }}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
        />

        {/* Gradient overlays for crystal-clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/50 to-black/15 z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#07080b]/80 z-10 pointer-events-none" />

        {/* Top bar: Logo + Quality Badge */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
          <div className="w-10 h-10 bg-black/70 backdrop-blur-md rounded-xl flex items-center justify-center p-2 border border-white/15 shadow-md group-hover:border-red-500/40 transition-colors">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={channel?.name ? `${channel.name} logo` : 'Logo'}
                width={36}
                height={36}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`items-center justify-center text-slate-300 ${logoUrl ? 'hidden' : 'flex'}`}>
              <Tv className="w-4 h-4 text-red-500" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold tracking-wider text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{quality}</span>
          </div>
        </div>

        {/* Bottom content: Channel name & category */}
        <div className="relative z-20 h-full flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-1">
            {channel.category && (
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-400 px-2 py-0.5 rounded-md bg-red-950/60 border border-red-900/50 backdrop-blur-sm">
                {channel.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
              <Radio className="w-2.5 h-2.5 text-emerald-400" />
              {isDe ? 'Live' : 'Canlı'}
            </span>
          </div>

          <h3 className="text-white font-bold text-base md:text-lg font-display tracking-tight truncate drop-shadow-md group-hover:text-red-400 transition-colors">
            {channel.name}
          </h3>

          {description && (
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 leading-snug">
              {description}
            </p>
          )}
        </div>

      </div>
    </div>
  );
});

export default DynamicChannelCard;
