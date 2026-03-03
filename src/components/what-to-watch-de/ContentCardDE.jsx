
import React from 'react';
import { Star, Calendar, Film, Tv, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/utils/tmdbApiDE';

const ContentCardDE = ({ item, type }) => {
  const { id, title, name, poster_path, vote_average, release_date, first_air_date, overview } = item;
  
  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const year = displayDate ? new Date(displayDate).getFullYear() : 'N/A';
  const mediaType = type || (title ? 'movie' : 'tv');
  
  const imageUrl = buildImageUrl(poster_path, 'w500');

  return (
    <Link to={`/de/was-soll-ich-schauen/${id}?type=${mediaType}`} className="block h-full outline-none">
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-pink-500/50 hover:shadow-pink-500/20 transition-all duration-300 h-full flex flex-col group relative"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
          <img 
            src={imageUrl}
            alt={displayTitle}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs text-white font-bold border border-white/10 flex items-center gap-1">
            {mediaType === 'movie' ? <Film className="w-3 h-3 text-pink-400" /> : <Tv className="w-3 h-3 text-blue-400" />}
            {mediaType === 'movie' ? 'Film' : 'Serie'}
          </div>

          <div className="absolute top-2 left-2 bg-yellow-500/90 backdrop-blur-md px-2 py-1 rounded text-xs text-black font-extrabold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            {vote_average ? vote_average.toFixed(1) : 'N/A'}
          </div>

          <div className="absolute inset-0 bg-black/80 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center backdrop-blur-sm">
            <p className="text-slate-200 text-sm line-clamp-4 mb-4">{overview || 'Keine Beschreibung verfügbar.'}</p>
            <div className="bg-pink-600 text-white rounded-full px-4 py-2 flex items-center gap-2 font-bold text-sm">
              <PlayCircle className="w-4 h-4" /> Mehr anzeigen
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-slate-900">
          <h3 className="text-white font-bold text-base mb-1 line-clamp-1 group-hover:text-pink-400 transition-colors">
            {displayTitle}
          </h3>
          <div className="mt-auto flex items-center text-slate-400 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{year}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ContentCardDE;
