import { useState, useEffect, useCallback, useTransition } from 'react';

// Simple in-memory cache for deduplication
const requestCache = new Map();

export const useBackgroundDataFetch = (fetcher, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { dedupKey, skip = false, ttl = 60000 } = options; // TTL default 1 min

  const fetchData = useCallback(async () => {
    if (skip) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    setError(null);

    // Cache check
    if (dedupKey && requestCache.has(dedupKey)) {
      const { data: cachedData, timestamp } = requestCache.get(dedupKey);
      if (Date.now() - timestamp < ttl) {
        startTransition(() => {
          setData(cachedData);
          setLoading(false);
        });
        return;
      }
    }

    try {
      const result = await fetcher();
      
      if (dedupKey) {
        requestCache.set(dedupKey, { data: result, timestamp: Date.now() });
      }

      startTransition(() => {
        setData(result);
        setLoading(false);
      });
    } catch (err) {
      console.error("Background fetch error:", err);
      startTransition(() => {
        setError(err);
        setLoading(false);
      });
    }
  }, [dedupKey, skip, ttl, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading: loading || isPending, error, refetch: fetchData };
};