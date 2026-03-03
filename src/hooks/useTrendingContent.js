import { useState, useEffect, useCallback } from 'react';
import { useIMDbAPI } from '@/hooks/useIMDbAPI';
import { CacheManager } from '@/utils/localCache';

const CACHE_KEY = 'trending_content_v1';
const REFRESH_INTERVAL = 60 * 60 * 1000; // Check every hour if we need a refresh
const MIDNIGHT_HOUR = 0; // 00:00

export const useTrendingContent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { getTrending } = useIMDbAPI();

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    try {
      if (forceRefresh) setIsRefreshing(true);
      else setLoading(true);

      // Fetch trending for both movies and TV, or use 'all' endpoint if available in hook
      // Assuming getTrending uses /trending/all/day based on previous instructions
      const result = await getTrending('day');
      
      if (result && result.results) {
        // Filter out items without posters or minimal info
        const validResults = result.results.filter(item => item.poster_path && (item.title || item.name));
        
        setData(validResults);
        CacheManager.set(CACHE_KEY, validResults); // 24h TTL handled by default in CacheManager
        setError(null);
      } else {
        throw new Error('Invalid data received');
      }
    } catch (err) {
      console.error('Failed to fetch trending content:', err);
      // Fallback to cache even if expired if api fails
      const staleData = localStorage.getItem(CACHE_KEY);
      if (staleData) {
        try {
           setData(JSON.parse(staleData).value);
           setError('Güncel veriler alınamadı, kayıtlı veriler gösteriliyor.');
        } catch {
           setError('Veri yüklenirken bir hata oluştu.');
        }
      } else {
        setError('Trending içerikler yüklenemedi.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [getTrending]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh logic
  useEffect(() => {
    const checkRefresh = () => {
      const now = new Date();
      // If cache is expired OR it's past midnight and we haven't refreshed recently (implied by cache expiry)
      // CacheManager handles expiry, so we just try to get it. If null, we fetch.
      if (CacheManager.isExpired(CACHE_KEY)) {
        fetchData(true);
      }
    };

    // Check periodically
    const intervalId = setInterval(checkRefresh, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { data, loading, error, isRefreshing, refetch: () => fetchData(true) };
};