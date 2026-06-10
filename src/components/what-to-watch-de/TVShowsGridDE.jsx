
import React, { useState, useEffect } from 'react';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import ContentCardDE from './ContentCardDE';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleTMDBError } from '@/utils/tmdbApiDE';

const TVShowsGridDE = ({ filters, searchQuery }) => {
  const { fetchPopularTV, searchTVDE, loading, error: apiError } = useMovieDatabase();
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filters, searchQuery]);

  const loadShows = async (currentPage) => {
    setLocalError(null);
    try {
      let data;
      if (searchQuery) {
        data = await searchTVDE(searchQuery, 'de-DE', currentPage);
      } else {
        const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined && v !== ''));
        data = await fetchPopularTV('de-DE', currentPage, cleanFilters);
      }
      if (data) {
        setShows(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB limits to 500
      }
    } catch (err) {
      setLocalError(handleTMDBError(err));
    }
  };

  useEffect(() => {
    loadShows(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, filters, searchQuery]);

  const displayError = localError || apiError;

  if (loading && shows.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#0a0a0a] rounded-xl aspect-[2/3] animate-pulse border border-slate-800" />
        ))}
      </div>
    );
  }

  if (displayError && shows.length === 0) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-slate-300 mb-6">{displayError}</p>
        <Button onClick={() => loadShows(page)} className="bg-red-600 hover:bg-red-700 text-white">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {shows.map((show) => <ContentCardDE key={show.id} item={show} type="tv" />)}
      </div>
      
      {shows.length === 0 && !loading && (
        <p className="text-center py-20 text-slate-400">Keine Serien gefunden.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || loading}
            className="border-slate-700 text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Zurück
          </Button>
          <span className="text-slate-400 text-sm font-medium">
            Seite {page} von {totalPages}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages || loading}
            className="border-slate-700 text-slate-300 hover:text-white"
          >
            Weiter <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TVShowsGridDE;
