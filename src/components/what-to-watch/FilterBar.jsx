
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import useIMDbAPI from '@/hooks/useIMDbAPI';

const FilterBar = ({ type = 'movie', onFilterChange }) => {
  const { getGenres } = useIMDbAPI();
  const [genres, setGenres] = useState([]);
  
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    const fetchGenres = async () => {
      const data = await getGenres(type);
      if (data?.genres) setGenres(data.genres);
    };
    fetchGenres();
  }, [type, getGenres]);

  useEffect(() => {
    const filters = {
      with_genres: selectedGenre === 'all' ? '' : selectedGenre,
      primary_release_year: type === 'movie' ? selectedYear : undefined,
      first_air_date_year: type === 'tv' ? selectedYear : undefined,
      'vote_average.gte': ratingRange[0],
      'vote_average.lte': ratingRange[1],
      sort_by: sortBy
    };

    // Clean up undefined/empty values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    onFilterChange(filters);
  }, [selectedGenre, selectedYear, ratingRange, sortBy, type]); // removed onFilterChange to avoid loop

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setRatingRange([0, 10]);
    setSortBy('popularity.desc');
  };

  const hasActiveFilters = selectedGenre || selectedYear || ratingRange[0] > 0 || ratingRange[1] < 10 || sortBy !== 'popularity.desc';

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400" /> Filtreler
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-slate-400 hover:text-white">
            <X className="w-4 h-4 mr-1" /> Temizle
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Genre Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">Tür</label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Tüm Türler" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60">
              <SelectItem value="all">Tüm Türler</SelectItem>
              {genres.map(g => (
                <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">Yıl</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Tüm Yıllar" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-60">
              <SelectItem value="all">Tüm Yıllar</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">Sıralama</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Sıralama Seç" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="popularity.desc">En Popüler</SelectItem>
              <SelectItem value="vote_average.desc">En Yüksek Puan</SelectItem>
              <SelectItem value="primary_release_date.desc">En Yeni</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-medium">IMDb Puanı</label>
            <span className="text-xs text-purple-400 font-bold">{ratingRange[0]} - {ratingRange[1]}</span>
          </div>
          <Slider
            min={0}
            max={10}
            step={0.5}
            value={ratingRange}
            onValueChange={setRatingRange}
            className="w-full"
          />
        </div>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50 mt-4">
          {selectedGenre && selectedGenre !== 'all' && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
              Tür: {genres.find(g => g.id.toString() === selectedGenre)?.name}
            </Badge>
          )}
          {selectedYear && selectedYear !== 'all' && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
              Yıl: {selectedYear}
            </Badge>
          )}
          {(ratingRange[0] > 0 || ratingRange[1] < 10) && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
              Puan: {ratingRange[0]} - {ratingRange[1]}
            </Badge>
          )}
          {sortBy !== 'popularity.desc' && (
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
              Sıralama: {sortBy === 'vote_average.desc' ? 'Puan' : 'Yeni'}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
