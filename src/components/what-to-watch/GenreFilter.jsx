import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Loader2 } from 'lucide-react';
import { useIMDbAPI } from '@/hooks/useIMDbAPI';
import { useLocation } from 'react-router-dom';

const GenreFilter = ({ selectedGenre, onSelectGenre, type = 'movie' }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getGenres } = useIMDbAPI();
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      const data = await getGenres(type);
      if (data?.genres) {
        setGenres(data.genres);
      }
      setLoading(false);
    };

    fetchGenres();
  }, [type, getGenres]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div 
      role="group" 
      aria-label={isDe ? "Kategoriefilter" : "Kategori filtreleri"}
      className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto"
    >
      <button
        type="button"
        onClick={() => onSelectGenre(null)}
        className={cn(
          "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 outline-none focus:ring-2 ring-offset-2 ring-offset-slate-900",
          !selectedGenre 
            ? "bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
        )}
      >
        {isDe ? "Alle Genres" : "Tümü"}
        {selectedGenre && <X className="w-3.5 h-3.5" />}
      </button>

      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          onClick={() => onSelectGenre(genre.id === selectedGenre ? null : genre.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent outline-none focus:ring-2 ring-offset-2 ring-offset-slate-900 relative overflow-hidden group",
            selectedGenre === genre.id
              ? "text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-105 border-primary/50 bg-gradient-to-r from-[#e50914] to-[#b20710]"
              : "bg-white/5 text-slate-400 border-white/5 hover:border-primary/30 hover:text-white hover:bg-white/10"
          )}
        >
          <span className="relative z-10">{genre.name}</span>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-[#e50914]/80 to-[#b20710]/80 opacity-0 transition-opacity duration-300",
            selectedGenre !== genre.id && "group-hover:opacity-100"
          )} />
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;