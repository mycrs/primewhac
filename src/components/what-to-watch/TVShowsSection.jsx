
import React, { useState, useEffect } from 'react';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import ContentCard from './ContentCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TVShowsSection = ({ filters, searchQuery }) => {
  const { discoverTV, searchTV, loading, error } = useMovieDatabase();
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setShows([]);
    setPage(1);
  }, [filters, searchQuery]);

  const fetchShows = async (currentPage) => {
    try {
      let data;
      if (searchQuery) {
        data = await searchTV(searchQuery, currentPage);
      } else {
        const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ''));
        data = await discoverTV({ ...cleanFilters, page: currentPage });
      }
      if (data) {
        setShows(prev => currentPage === 1 ? data.results : [...prev, ...data.results]);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShows(page);
  }, [page, filters, searchQuery]);

  if (loading && shows.length === 0) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>;
  if (error && shows.length === 0) return <div className="text-center py-20 text-red-400"><AlertCircle className="w-10 h-10 mx-auto mb-4" />{error} <Button onClick={() => fetchShows(page)} className="mt-4">Tekrar Dene</Button></div>;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {shows.map((show, i) => <ContentCard key={`${show.id}-${i}`} item={show} type="tv" accentIndex={i} />)}
      </div>
      {shows.length === 0 && !loading && <p className="text-center py-10 text-slate-400">Sonuç bulunamadı.</p>}
      {page < totalPages && (
        <div className="flex justify-center mt-10">
          <Button onClick={() => setPage(p => p + 1)} disabled={loading} className="bg-[#0a0a0a] text-white hover:bg-[#0a0a0a] px-8 py-2 rounded-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TVShowsSection;
