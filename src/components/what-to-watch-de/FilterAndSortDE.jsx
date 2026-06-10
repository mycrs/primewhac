
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useMovieDatabase from '@/hooks/useMovieDatabase';

const FilterAndSortDE = ({ type = 'movie', onFilterChange }) => {
  const { fetchGenresDE } = useMovieDatabase();
  const [genres, setGenres] = useState([]);
  
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [rating, setRating] = useState([0]);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenresDE(type);
        if (data?.genres) setGenres(data.genres);
      } catch (err) {
        console.error(err);
      }
    };
    loadGenres();
  }, [type, fetchGenresDE]);

  const applyFilters = () => {
    onFilterChange({
      with_genres: selectedGenre === 'all' ? '' : selectedGenre,
      primary_release_year: type === 'movie' ? selectedYear : undefined,
      first_air_date_year: type === 'tv' ? selectedYear : undefined,
      'vote_average.gte': rating[0],
      sort_by: sortBy
    });
  };

  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setRating([0]);
    setSortBy('popularity.desc');
    onFilterChange({ sort_by: 'popularity.desc' });
  };

  const years = Array.from({ length: 12 }, (_, i) => 2026 - i); // 2015-2026 as requested

  let activeCount = 0;
  if (selectedGenre && selectedGenre !== 'all') activeCount++;
  if (selectedYear && selectedYear !== 'all') activeCount++;
  if (rating[0] > 0) activeCount++;
  if (sortBy !== 'popularity.desc') activeCount++;

  return (
    <div className="bg-[#0a0a0a]/50 p-5 rounded-2xl border border-slate-800 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Filter className="w-5 h-5 text-pink-500" /> Filter & Sortierung
          {activeCount > 0 && (
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{activeCount}</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4 mr-2" /> Zurücksetzen
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Genre</label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-[#0a0a0a] border-slate-700 text-white"><SelectValue placeholder="Alle Genres" /></SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] text-white border-slate-700 max-h-60">
              <SelectItem value="all">Alle Genres</SelectItem>
              {genres.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Jahr</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-[#0a0a0a] border-slate-700 text-white"><SelectValue placeholder="Alle Jahre" /></SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] text-white border-slate-700 max-h-60">
              <SelectItem value="all">Alle Jahre</SelectItem>
              {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Sortieren nach</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-[#0a0a0a] border-slate-700 text-white"><SelectValue placeholder="Auswählen" /></SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] text-white border-slate-700">
              <SelectItem value="popularity.desc">Popularität</SelectItem>
              <SelectItem value="vote_average.desc">Bewertung</SelectItem>
              <SelectItem value="primary_release_date.desc">Veröffentlichungsdatum</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-semibold mb-3 flex justify-between uppercase tracking-wider">
            <span>Min. Bewertung</span> <span className="text-pink-400 font-bold">{rating[0]} / 10</span>
          </label>
          <Slider min={0} max={10} step={1} value={rating} onValueChange={setRating} className="w-full" />
        </div>
      </div>
      
      <div className="flex justify-end border-t border-slate-800 pt-4">
        <Button onClick={applyFilters} className="bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white">
          Filter anwenden
        </Button>
      </div>
    </div>
  );
};

export default FilterAndSortDE;
