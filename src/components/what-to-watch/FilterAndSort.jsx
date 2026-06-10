
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';
import useMovieDatabase from '@/hooks/useMovieDatabase';

const FilterAndSort = ({ type = 'movie', onFilterChange }) => {
  const { getGenres } = useMovieDatabase();
  const [genres, setGenres] = useState([]);
  
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [rating, setRating] = useState([0]);
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres(type);
        if (data?.genres) setGenres(data.genres);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenres();
  }, [type, getGenres]);

  useEffect(() => {
    onFilterChange({
      with_genres: selectedGenre === 'all' ? '' : selectedGenre,
      primary_release_year: type === 'movie' ? selectedYear : undefined,
      first_air_date_year: type === 'tv' ? selectedYear : undefined,
      'vote_average.gte': rating[0],
      sort_by: sortBy
    });
  }, [selectedGenre, selectedYear, rating, sortBy, type]); // removed onFilterChange to prevent loops

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-800 mb-8">
      <div className="flex items-center gap-2 mb-4 text-white font-semibold">
        <Filter className="w-4 h-4 text-primary" /> Filtrele ve Sırala
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Tür</label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="bg-[#0a0a0a] border-slate-700 text-white"><SelectValue placeholder="Tüm Türler" /></SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] text-white border-slate-700 max-h-60">
              <SelectItem value="all">Tüm Türler</SelectItem>
              {genres.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Yıl</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-[#0a0a0a] border-slate-700 text-white"><SelectValue placeholder="Tüm Yıllar" /></SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] text-white border-slate-700 max-h-60">
              <SelectItem value="all">Tüm Yıllar</SelectItem>
              {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Sıralama</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-[#0a0a0a] border-slate-700 text-white"><SelectValue placeholder="Sıralama Seç" /></SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] text-white border-slate-700">
              <SelectItem value="popularity.desc">En Popüler</SelectItem>
              <SelectItem value="vote_average.desc">En Yüksek Puan</SelectItem>
              <SelectItem value="primary_release_date.desc">En Yeni</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-2 block flex justify-between">
            <span>Min Puan</span> <span className="text-primary font-bold">{rating[0]}</span>
          </label>
          <Slider min={0} max={10} step={0.5} value={rating} onValueChange={setRating} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default FilterAndSort;
