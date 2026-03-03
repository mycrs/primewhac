
import React, { memo } from 'react';
import { Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { getChannelImageUrl } from '@/utils/channelImageUtils';

const ColorfulChannelCard = memo(({ channel, index }) => {
  // Use utility function for responsive fallback generation
  const bgImageUrl = getChannelImageUrl(channel.image_url, 'mobile', channel.category);

  return (
    <div className="embla__slide flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_20%] lg:flex-[0_0_15%] min-w-0 pl-4 py-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
        whileHover={{ scale: 1.05 }}
        className="relative h-32 rounded-2xl border border-white/10 flex flex-col p-4 cursor-pointer overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:z-10 hover:border-white/30"
      >
        {/* Full coverage background image */}
        <img 
          src={bgImageUrl}
          alt={`${channel.name} background`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0"
          loading="lazy"
        />

        {/* Gradient Overlay for text readability (Dark to transparent) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-0" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-colors duration-300 z-0 pointer-events-none mix-blend-overlay" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Top Section: Logo */}
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center p-1.5 shadow-inner border border-white/20">
            {channel.logoUrl || channel.logo_url ? (
              <img 
                src={channel.logoUrl || channel.logo_url} 
                alt={channel.name} 
                className="h-full w-full object-contain drop-shadow-md"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`items-center justify-center ${channel.logoUrl || channel.logo_url ? 'hidden' : 'flex'}`}>
              <Tv className="h-5 w-5 text-white/90 drop-shadow-md" />
            </div>
          </div>

          {/* Bottom Section: Name & Category */}
          <div className="mt-auto">
            <span className="block text-sm font-bold text-white tracking-wide truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-0.5">
              {channel.name}
            </span>
            {channel.category && (
              <span className="inline-block text-[10px] font-semibold text-white/80 uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 shadow-sm">
                {channel.category}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default ColorfulChannelCard;
