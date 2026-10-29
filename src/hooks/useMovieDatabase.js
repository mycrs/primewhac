
import { useState, useCallback } from 'react';

const API_TOKEN =
  import.meta.env.VITE_TMDB_BEARER_TOKEN ||
  import.meta.env.VITE_TMDB_API_KEY ||
  '';
const BASE_URL = "https://api.themoviedb.org/3";

const cache = new Map();

export const useMovieDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWithRetry = useCallback(async (endpoint, params = {}, retries = 3) => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      language: params.language || 'tr-TR', // Default fallback
      ...params
    });
    
    // Clean undefined/empty values
    for (const [key, value] of queryParams.entries()) {
      if (value === undefined || value === 'undefined' || value === '') {
        queryParams.delete(key);
      }
    }

    const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
    
    if (cache.has(url)) {
      setLoading(false);
      return cache.get(url);
    }

    let attempt = 0;
    while (attempt < retries) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'accept': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        cache.set(url, data);
        setLoading(false);
        return data;

      } catch (err) {
        clearTimeout(timeoutId);
        attempt++;
        if (attempt >= retries) {
          setError(err.name === 'AbortError' ? 'Timeout: The request took too long.' : err.message || 'An error occurred.');
          setLoading(false);
          return null;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }, []);

  // --- TR Functions (Legacy Support) ---
  const discoverTV = useCallback((params = {}) => fetchWithRetry('/discover/tv', { language: 'tr-TR', ...params }), [fetchWithRetry]);
  const discoverMovies = useCallback((params = {}) => fetchWithRetry('/discover/movie', { language: 'tr-TR', ...params }), [fetchWithRetry]);
  const searchTV = useCallback((query, page = 1) => fetchWithRetry('/search/tv', { query, page, language: 'tr-TR' }), [fetchWithRetry]);
  const searchMovies = useCallback((query, page = 1) => fetchWithRetry('/search/movie', { query, page, language: 'tr-TR' }), [fetchWithRetry]);
  const getTVDetails = useCallback((id) => fetchWithRetry(`/tv/${id}`, { append_to_response: 'credits,similar', language: 'tr-TR' }), [fetchWithRetry]);
  const getMovieDetails = useCallback((id) => fetchWithRetry(`/movie/${id}`, { append_to_response: 'credits,similar', language: 'tr-TR' }), [fetchWithRetry]);
  const getGenres = useCallback((type = 'movie') => fetchWithRetry(`/genre/${type}/list`, { language: 'tr-TR' }), [fetchWithRetry]);

  // --- DE Functions ---
  const fetchPopularTV = useCallback((language = 'de-DE', page = 1, params = {}) => {
    return fetchWithRetry('/discover/tv', { language, page, ...params });
  }, [fetchWithRetry]);

  const fetchPopularMovies = useCallback((language = 'de-DE', page = 1, params = {}) => {
    return fetchWithRetry('/discover/movie', { language, page, ...params });
  }, [fetchWithRetry]);

  const searchTVDE = useCallback((query, language = 'de-DE', page = 1) => {
    return fetchWithRetry('/search/tv', { query, language, page });
  }, [fetchWithRetry]);

  const searchMoviesDE = useCallback((query, language = 'de-DE', page = 1) => {
    return fetchWithRetry('/search/movie', { query, language, page });
  }, [fetchWithRetry]);

  const fetchTVDetails = useCallback((id, language = 'de-DE') => {
    return fetchWithRetry(`/tv/${id}`, { language, append_to_response: 'credits' });
  }, [fetchWithRetry]);

  const fetchMovieDetails = useCallback((id, language = 'de-DE') => {
    return fetchWithRetry(`/movie/${id}`, { language, append_to_response: 'credits' });
  }, [fetchWithRetry]);

  const fetchSimilarTV = useCallback((id, language = 'de-DE') => {
    return fetchWithRetry(`/tv/${id}/similar`, { language });
  }, [fetchWithRetry]);

  const fetchSimilarMovies = useCallback((id, language = 'de-DE') => {
    return fetchWithRetry(`/movie/${id}/similar`, { language });
  }, [fetchWithRetry]);

  const fetchGenresDE = useCallback((type = 'movie', language = 'de-DE') => {
    return fetchWithRetry(`/genre/${type}/list`, { language });
  }, [fetchWithRetry]);

  return {
    loading,
    error,
    // TR
    discoverTV, discoverMovies, searchTV, searchMovies, getTVDetails, getMovieDetails, getGenres,
    // DE
    fetchPopularTV, fetchPopularMovies, searchTVDE, searchMoviesDE, fetchTVDetails, fetchMovieDetails, fetchSimilarTV, fetchSimilarMovies, fetchGenresDE
  };
};

export default useMovieDatabase;
