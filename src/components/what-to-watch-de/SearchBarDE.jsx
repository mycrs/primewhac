
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Film, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import { buildImageUrl } from '@/utils/tmdbApiDE';

const SearchBarDE = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { searchMoviesDE, searchTVDE, loading } = useMovieDatabase();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        try {
          let res;
          if (searchType === 'movie') {
            res = await searchMoviesDE(searchTerm);
          } else {
            res = await searchTVDE(searchTerm);
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
  }, [searchTerm, searchType, searchMoviesDE, searchTVDE]);

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

  const executeSearch = () => {
    setShowDropdown(false);
    if (onSearch) onSearch(searchTerm, searchType);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50" ref={dropdownRef}>
      <div className="flex justify-center mb-4 gap-2">
        <button 
          onClick={() => setSearchType('tv')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${searchType === 'tv' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          <Tv className="w-4 h-4" /> Serien
        </button>
        <button 
          onClick={() => setSearchType('movie')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${searchType === 'movie' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          <Film className="w-4 h-4" /> Filme
        </button>
      </div>

      <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-full shadow-lg">
        <div className="pl-4 text-slate-400">
          {loading ? <Loader2 className="w-5 h-5 animate-spin text-pink-400" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if(suggestions.length > 0 || (searchTerm.length > 2 && suggestions.length === 0)) setShowDropdown(true); }}
          placeholder="Suchen..."
          className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-slate-500"
        />
        {searchTerm && (
          <button onClick={handleClear} className="pr-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={executeSearch}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2.5 m-1 rounded-full text-sm font-bold transition-colors"
        >
          Suchen
        </button>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <div 
                key={item.id}
                onClick={() => { navigate(`/de/was-soll-ich-schauen/${item.id}?type=${item.media_type}`); setShowDropdown(false); }}
                className="flex items-center gap-4 p-3 hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <img 
                  src={buildImageUrl(item.poster_path, 'w92')} 
                  alt="" className="w-10 h-14 object-cover rounded bg-slate-800" 
                />
                <div>
                  <h4 className="text-white font-medium text-sm">{item.title || item.name}</h4>
                  <p className="text-xs text-slate-400">{(item.release_date || item.first_air_date)?.substring(0, 4) || 'N/A'}</p>
                </div>
              </div>
            ))
          ) : searchTerm.length > 2 && !loading ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              Keine Ergebnisse
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBarDE;
