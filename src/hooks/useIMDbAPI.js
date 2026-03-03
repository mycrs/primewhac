import { useState, useCallback } from 'react';
import axios from 'axios';
import { handleTMDBError, validateTMDBResponse } from '@/utils/tmdbApi';
import { CacheManager } from '@/utils/localCache';
import { queueRequest } from '@/utils/tmdbRateLimiter';
import { blockIMDbAccess, validateDataSource } from '@/utils/imdbBlocker';
import { validateAPIKey, getSecureAPIKey } from '@/utils/apiKeyValidator';
import { logAPICall, logError } from '@/utils/tmdbMonitoring';

const BASE_URL = 'https://api.themoviedb.org/3';

validateAPIKey();

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    language: 'tr-TR',
  },
  timeout: 30000 
});

tmdbClient.interceptors.request.use(config => {
  blockIMDbAccess(config.url);
  validateDataSource('tmdb');

  const apiKey = getSecureAPIKey();
  
  if (apiKey.length > 100) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  } else {
    config.params = { ...config.params, api_key: apiKey };
  }
  
  return config;
}, error => Promise.reject(error));

export const useIMDbAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFromApi = useCallback(async (endpoint, params = {}, cacheKey = null, retries = 3) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    if (cacheKey) {
      const cachedData = CacheManager.get(cacheKey);
      if (cachedData) {
        logAPICall(endpoint, Date.now() - startTime, 200, true);
        setLoading(false);
        return cachedData;
      }
    }

    let attempt = 0;
    while (attempt < retries) {
      try {
        const response = await queueRequest(() => tmdbClient.get(endpoint, { params }));
        const validData = validateTMDBResponse(response);
        
        if (cacheKey && validData) {
          CacheManager.set(cacheKey, validData);
        }
        
        logAPICall(endpoint, Date.now() - startTime, response.status, false);
        setLoading(false);
        return validData;
      } catch (err) {
        attempt++;
        if (attempt >= retries) {
          const errorMessage = handleTMDBError(err);
          logError(endpoint, err);
          setError(errorMessage);
          
          if (cacheKey) {
            const staleData = localStorage.getItem(cacheKey);
            if (staleData) {
              try {
                 const parsed = JSON.parse(staleData);
                 console.warn('Network failed, serving stale cache for:', endpoint);
                 setLoading(false);
                 return parsed.value;
              } catch { /* ignore */ }
            }
          }
          setLoading(false);
          return null;
        }
        await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
      }
    }
  }, []);

  const searchMovies = useCallback((query, page = 1) => {
    return fetchFromApi('/search/movie', { query, page }, `search_movie_${query}_${page}`);
  }, [fetchFromApi]);

  const searchTV = useCallback((query, page = 1) => {
    return fetchFromApi('/search/tv', { query, page }, `search_tv_${query}_${page}`);
  }, [fetchFromApi]);

  const discoverMovies = useCallback((params = {}, page = 1) => {
    return fetchFromApi('/discover/movie', { ...params, page }, `discover_movie_${JSON.stringify(params)}_${page}`);
  }, [fetchFromApi]);

  const discoverTV = useCallback((params = {}, page = 1) => {
    return fetchFromApi('/discover/tv', { ...params, page }, `discover_tv_${JSON.stringify(params)}_${page}`);
  }, [fetchFromApi]);

  const getMovieDetails = useCallback((id) => {
    return fetchFromApi(`/movie/${id}`, { append_to_response: 'credits,recommendations,similar' }, `movie_detail_${id}`);
  }, [fetchFromApi]);

  const getTVDetails = useCallback((id) => {
    return fetchFromApi(`/tv/${id}`, { append_to_response: 'credits,recommendations,similar' }, `tv_detail_${id}`);
  }, [fetchFromApi]);

  const getMovieCredits = useCallback((id) => {
    return fetchFromApi(`/movie/${id}/credits`, {}, `movie_credits_${id}`);
  }, [fetchFromApi]);

  const getTVCredits = useCallback((id) => {
    return fetchFromApi(`/tv/${id}/credits`, {}, `tv_credits_${id}`);
  }, [fetchFromApi]);

  const getSimilarMovies = useCallback((id, page = 1) => {
    return fetchFromApi(`/movie/${id}/similar`, { page }, `movie_similar_${id}_${page}`);
  }, [fetchFromApi]);

  const getSimilarTV = useCallback((id, page = 1) => {
    return fetchFromApi(`/tv/${id}/similar`, { page }, `tv_similar_${id}_${page}`);
  }, [fetchFromApi]);

  const getGenres = useCallback((type = 'movie') => {
    return fetchFromApi(`/genre/${type}/list`, {}, `genres_${type}`);
  }, [fetchFromApi]);

  return {
    loading,
    error,
    searchMovies,
    searchTV,
    discoverMovies,
    discoverTV,
    getMovieDetails,
    getTVDetails,
    getMovieCredits,
    getTVCredits,
    getSimilarMovies,
    getSimilarTV,
    getGenres
  };
};

export default useIMDbAPI;