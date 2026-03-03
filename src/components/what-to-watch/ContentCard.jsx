
import React, { useState } from 'react';
import { Star, Calendar, Film, Tv, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ContentCard = ({ item, type, isDe = false }) => {
  const { id, title, name, poster_path, vote_average, release_date, first_air_date, overview } = item;
  const [imgLoaded, setImgLoaded] = useState(false);
  
  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const year = displayDate ? new Date(displayDate).getFullYear() : 'N/A';
  const mediaType = type || (title ? 'movie' : 'tv');
  
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';

  const label = isDe
    ? { type: mediaType === 'movie' ? 'Film' : 'Serie', noOverview: 'Keine Beschreibung.', details: 'Details' }
    : { type: mediaType === 'movie' ? 'Film' : 'Dizi', noOverview: 'Özet bulunmuyor.', details: 'Detaylar' };

  return (
    <Link to={`/what-to-watch/${id}?type=${mediaType}`} className="block h-full outline-none">
      <div className="group relative h-full">
        <div className="pointer-events-none absolute -inset-[1.5px] rounded-3xl bg-gradient-to-br from-purple-500/70 via-fuchsia-500/60 to-indigo-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
        <motion.div 
          whileHover={{ y: -10, scale: 1.02 }}
          className="relative bg-slate-950/90 rounded-3xl overflow-hidden shadow-xl border border-slate-800/80 group-hover:border-purple-400/80 group-hover:shadow-purple-500/40 transition-all duration-300 h-full flex flex-col group"
        >
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
              {mediaType === 'movie' ? <Film className="w-16 h-16 text-slate-600" /> : <Tv className="w-16 h-16 text-slate-600" />}
            </div>
          )}
          <img 
            src={imageUrl}
            alt={displayTitle}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-semibold border border-white/10 flex items-center gap-1.5">
            {mediaType === 'movie' ? <Film className="w-3 h-3 text-purple-400" /> : <Tv className="w-3 h-3 text-blue-400" />}
            {label.type}
          </div>

          <div className="absolute top-2 left-2 bg-yellow-500/95 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-black font-extrabold flex items-center gap-1.5 shadow-md">
            <Star className="w-3 h-3 fill-current" />
            {vote_average ? vote_average.toFixed(1) : 'N/A'}
          </div>

          <div className="absolute inset-0 bg-black/85 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center backdrop-blur-sm">
            <p className="text-slate-200 text-sm line-clamp-4 mb-4">{overview || label.noOverview}</p>
            <div className="bg-purple-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold text-sm">
              <PlayCircle className="w-4 h-4" /> {label.details}
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-slate-950/95">
          <h3 className="text-white font-bold text-base mb-1.5 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {displayTitle}
          </h3>
          <div className="mt-auto flex items-center justify-between text-slate-400 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/50 text-[10px] font-semibold text-purple-200">
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
