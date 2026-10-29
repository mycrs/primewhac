
import React, { useState } from 'react';
import { Star, Calendar, Film, Tv, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ACCENT_COLORS = [
  { border: 'group-hover:border-primary/80', shadow: 'group-hover:shadow-primary/40', glow: 'from-[#e50914]/70 via-[#b20710]/60 to-[#b20710]/70', badge: 'bg-primary/10 border-primary/50 text-primary' },
  { border: 'group-hover:border-[#e50914]/80', shadow: 'group-hover:shadow-[#e50914]/40', glow: 'from-[#e50914]/70 via-[#b20710]/60 to-[#b20710]/70', badge: 'bg-[#e50914]/10 border-[#e50914]/50 text-white' },
  { border: 'group-hover:border-blue-400/80', shadow: 'group-hover:shadow-blue-500/40', glow: 'from-[#e50914]/70 via-[#e50914]/60 to-[#b20710]/70', badge: 'bg-[#141414]/10 border-blue-500/50 text-blue-200' },
  { border: 'group-hover:border-[#e50914]/80', shadow: 'group-hover:shadow-emerald-500/40', glow: 'from-[#e50914]/70 via-[#e50914]/60 to-[#b20710]/70', badge: 'bg-[#e50914]/10 border-[#e50914]/50 text-[#e50914]' },
  { border: 'group-hover:border-amber-400/80', shadow: 'group-hover:shadow-amber-500/40', glow: 'from-amber-500/70 via-orange-500/60 to-yellow-500/70', badge: 'bg-amber-500/10 border-amber-500/50 text-amber-200' },
  { border: 'group-hover:border-rose-400/80', shadow: 'group-hover:shadow-rose-500/40', glow: 'from-rose-500/70 via-pink-500/60 to-red-500/70', badge: 'bg-rose-500/10 border-rose-500/50 text-rose-200' },
  { border: 'group-hover:border-[#e50914]/80', shadow: 'group-hover:shadow-[#e50914]/40', glow: 'from-[#e50914]/70 via-[#e50914]/60 to-[#b20710]/70', badge: 'bg-[#e50914]/10 border-[#e50914]/50 text-[#e50914]' },
  { border: 'group-hover:border-primary/80', shadow: 'group-hover:shadow-primary/40', glow: 'from-[#e50914]/70 via-[#e50914]/60 to-[#b20710]/70', badge: 'bg-primary/10 border-primary/50 text-primary' },
];

const ContentCard = ({ item, type, isDe = false, accentIndex = 0 }) => {
  const { id, title, name, poster_path, vote_average, release_date, first_air_date, overview } = item;
  const [imgLoaded, setImgLoaded] = useState(false);
  const accent = ACCENT_COLORS[accentIndex % ACCENT_COLORS.length];
  
  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const year = displayDate ? new Date(displayDate).getFullYear() : 'N/A';
  const mediaType = type || (title ? 'movie' : 'tv');
  
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  const label = isDe
    ? { type: mediaType === 'movie' ? 'Film' : 'Serie', noOverview: 'Keine Beschreibung.', details: `${displayTitle} Details` }
    : { type: mediaType === 'movie' ? 'Film' : 'Dizi', noOverview: 'Özet bulunmuyor.', details: `${displayTitle} detayları` };

  return (
    <Link to={`/ne-izlesem/${id}?type=${mediaType}`} className="block h-full outline-none">
      <div className="group relative h-full">
        <div className={`pointer-events-none absolute -inset-[1.5px] rounded-3xl bg-gradient-to-br ${accent.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]`} />
        <motion.div 
          whileHover={{ y: -10, scale: 1.02 }}
          className={`relative bg-[#0a0a0a]/90 rounded-3xl overflow-hidden shadow-xl border border-slate-800/80 ${accent.border} ${accent.shadow} transition-all duration-300 h-full flex flex-col group`}
        >
        <div className="relative aspect-[2/3] overflow-hidden bg-[#0a0a0a]">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80">
              {mediaType === 'movie' ? <Film className="w-16 h-16 text-slate-600" /> : <Tv className="w-16 h-16 text-slate-600" />}
            </div>
          )}
          <img 
            src={imageUrl}
            alt={`${displayTitle} posteri`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-semibold border border-white/10 flex items-center gap-1.5">
            {mediaType === 'movie' ? <Film className="w-3 h-3 text-primary" /> : <Tv className="w-3 h-3 text-blue-400" />}
            {label.type}
          </div>

          <div className="absolute top-2 left-2 bg-yellow-500/95 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-black font-extrabold flex items-center gap-1.5 shadow-md">
            <Star className="w-3 h-3 fill-current" />
            {vote_average ? vote_average.toFixed(1) : 'N/A'}
          </div>

          <div className="absolute inset-0 bg-black/85 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center backdrop-blur-sm">
            <p className="text-slate-200 text-sm line-clamp-4 mb-4">{overview || label.noOverview}</p>
            <div className="bg-primary text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold text-sm">
              <PlayCircle className="w-4 h-4" /> {label.details}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-[#0a0a0a]/95">
          <p className="text-white font-bold text-base mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
            {displayTitle}
          </p>
          <div className="mt-auto flex items-center justify-between text-slate-400 text-[11px]">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${accent.badge}`}>
              4K / Full HD
            </span>
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{year}</span>
            </div>
          </div>
        </div>
        </motion.div>
      </div>
    </Link>
  );
};

export default ContentCard;
