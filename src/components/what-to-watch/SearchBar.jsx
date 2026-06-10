
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Film, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMovieDatabase from '@/hooks/useMovieDatabase';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { searchMovies, searchTV, loading } = useMovieDatabase();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        try {
          let res;
          if (searchType === 'movie') {
            res = await searchMovies(searchTerm, 1);
          } else {
            res = await searchTV(searchTerm, 1);
          }
          const results = (res?.results || []).slice(0, 5).map(item => ({ ...item, media_type: searchType }));
          setSuggestions(results);
          setShowDropdown(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchType, searchMovies, searchTV]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
    if (onSearch) onSearch('', searchType);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowDropdown(false);
      if (onSearch) onSearch(searchTerm, searchType);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50" ref={dropdownRef}>
      <div className="flex justify-center mb-4 gap-2">
        <button 
          onClick={() => setSearchType('movie')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${searchType === 'movie' ? 'bg-primary text-white' : 'bg-[#0a0a0a] text-slate-400 hover:text-white'}`}
        >
          <Film className="w-4 h-4" /> Filmler
        </button>
        <button 
          onClick={() => setSearchType('tv')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${searchType === 'tv' ? 'bg-primary text-white' : 'bg-[#0a0a0a] text-slate-400 hover:text-white'}`}
        >
          <Tv className="w-4 h-4" /> Diziler
        </button>
      </div>

      <div className="relative flex items-center bg-[#0a0a0a] border border-slate-700 rounded-full shadow-lg">
        <div className="pl-4 text-slate-400">
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if(suggestions.length > 0) setShowDropdown(true); }}
          placeholder={`${searchType === 'movie' ? 'Film' : 'Dizi'} ara...`}
          className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-slate-500"
        />
        {searchTerm && (
          <button onClick={handleClear} className="pr-4 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.map((item) => (
            <div 
              key={item.id}
              onClick={() => { navigate(`/ne-izlesem/${item.id}?type=${item.media_type}`); setShowDropdown(false); }}
              className="flex items-center gap-4 p-3 hover:bg-[#0a0a0a] cursor-pointer transition-colors"
            >
              <img 
                src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : 'https://via.placeholder.com/92x138'} 
                alt={`${item.title || item.name} posteri`}
                className="w-10 h-14 object-cover rounded bg-[#0a0a0a]" 
              />
              <div>
                <p className="text-white font-medium text-sm">{item.title || item.name}</p>
                <p className="text-xs text-slate-400">{(item.release_date || item.first_air_date)?.substring(0, 4) || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
