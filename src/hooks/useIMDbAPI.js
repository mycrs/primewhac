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

function normalizeHeroTmdbItem(item) {
  if (!item || item.id == null) return null;
  const title = (
    item.title ||
    item.name ||
    item.original_title ||
    item.original_name ||
    ''
  ).trim() || 'Sinema görseli';
  const backdrop = item.backdrop_path;
  const poster = item.poster_path;
  const path = backdrop || poster;
  if (!path) return null;
  const size = backdrop ? 'w1280' : 'w780';
  const kind = backdrop ? 'b' : 'p';
  return {
    key: `hero-${item.id}-${kind}`,
    title,
    src: `https://image.tmdb.org/t/p/${size}${path}`,
    alt: `${title} — TMDB görseli`,
  };
}

function extractAxiosResults(settled) {
  if (settled.status !== 'fulfilled' || !settled.value?.data) return [];
  const { results } = settled.value.data;
  return Array.isArray(results) ? results : [];
}

/**
 * Premium ana sayfa hero (TMDB). Yedek görsel listesi yok; boş veya hata → [].
 */
export async function fetchPremiumHeroBackdropItems(targetCount = 10) {
  const requestFns = [
    () => tmdbClient.get('/movie/top_rated', { params: { page: 1 } }),
    () => tmdbClient.get('/movie/top_rated', { params: { page: 2 } }),
    () => tmdbClient.get('/tv/top_rated', { params: { page: 1 } }),
    () => tmdbClient.get('/tv/top_rated', { params: { page: 2 } }),
    () => tmdbClient.get('/trending/movie/week'),
    () => tmdbClient.get('/trending/tv/week'),
    () =>
      tmdbClient.get('/discover/movie', {
        params: {
          sort_by: 'vote_average.desc',
          'vote_count.gte': 200,
          'vote_average.gte': 6,
          page: 1,
        },
      }),
    () =>
      tmdbClient.get('/discover/tv', {
        params: {
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          page: 1,
        },
      }),
  ];

  let settledList;
  try {
    settledList = await Promise.allSettled(requestFns.map((fn) => queueRequest(fn)));
  } catch (e) {
    console.warn('[PremiumHero] TMDB hero queue failed:', e);
    return [];
  }

  const pool = [];
  for (const s of settledList) {
    pool.push(...extractAxiosResults(s));
  }

  const seenSrc = new Set();
  const unique = [];
  for (const item of pool) {
    const row = normalizeHeroTmdbItem(item);
    if (!row) continue;
    if (seenSrc.has(row.src)) continue;
    seenSrc.add(row.src);
    unique.push(row);
    if (unique.length >= targetCount) break;
  }

  return unique;
}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

/** API yokken hero poster mozaiği (doğrulanmış poster_path). */
export const HERO_POSTER_MOSAIC_FALLBACK = [
  `${TMDB_IMG}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
  `${TMDB_IMG}/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg`,
  `${TMDB_IMG}/hek3lDUyRkCOf2hs5rb1Xfgdgka.jpg`,
  `${TMDB_IMG}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
  `${TMDB_IMG}/f89U3ADr1oiB1s9GkdpoEpXu5Sk.jpg`,
  `${TMDB_IMG}/8UlWHLMpg9J8wWcuNi4xqu7jrJt.jpg`,
  `${TMDB_IMG}/vUUqzWa2LnHIVqKaKVlVGkVcZIW.jpg`,
  `${TMDB_IMG}/6oomb5OA0JBKpqFKDNwIBPOIvdh.jpg`,
  `${TMDB_IMG}/b6ko0IKC8Idm0cetJ6zSykFtKv3.jpg`,
  `${TMDB_IMG}/7IiTTgI4R8iaRYH5AM4TyTX5aoc.jpg`,
  `${TMDB_IMG}/wRnbLt44RxMnsDuhU5kJ25VVzZL.jpg`,
  `${TMDB_IMG}/xfWac8MTYDxjax8YpG9AiNlXVzC.jpg`,
];

function posterUrlFromItem(item) {
  if (!item?.poster_path) return null;
  return `${TMDB_IMG}${item.poster_path}`;
}

/**
 * Hero sağ mozaik için poster URL listesi (TMDB). Boş / hata → [].
 */
export async function fetchHeroPosterMosaicUrls(minCount = 24) {
  const requestFns = [
    () => tmdbClient.get('/trending/movie/week'),
    () => tmdbClient.get('/trending/tv/week'),
    () => tmdbClient.get('/movie/top_rated', { params: { page: 1 } }),
    () => tmdbClient.get('/tv/top_rated', { params: { page: 1 } }),
  ];

  let settledList;
  try {
    settledList = await Promise.allSettled(requestFns.map((fn) => queueRequest(fn)));
  } catch (e) {
    console.warn('[HeroPosterMosaic] TMDB failed:', e);
    return [];
  }

  const pool = [];
  for (const s of settledList) {
    pool.push(...extractAxiosResults(s));
  }

  const seen = new Set();
  const urls = [];
  for (const item of pool) {
    const u = posterUrlFromItem(item);
    if (!u || seen.has(u)) continue;
    seen.add(u);
    urls.push(u);
    if (urls.length >= minCount) break;
  }

  return urls;
}

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

  /** Ne izlesem / useTrendingContent — TMDB: GET /trending/all/{day|week} */
  const getTrending = useCallback((timeWindow = 'day') => {
    const w = timeWindow === 'week' ? 'week' : 'day';
    return fetchFromApi(`/trending/all/${w}`, {}, `trending_all_${w}`);
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
    getGenres,
    getTrending,
  };
};

export default useIMDbAPI;