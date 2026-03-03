
import { useEffect, useRef, useCallback } from 'react';

const queryCache = new Map();

export const useAdminPerformance = (componentName) => {
  const renderStartTime = useRef(typeof performance !== 'undefined' ? performance.now() : 0);
  const renderCount = useRef(0);

  // Monitor render times
  useEffect(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;
    
    renderCount.current += 1;
    const renderTime = performance.now() - renderStartTime.current;
    
    if (import.meta.env && import.meta.env.DEV) {
      if (renderTime > 50) {
        console.warn(`[Admin Perf] ${componentName} slow render: ${renderTime.toFixed(2)}ms (Render #${renderCount.current})`);
      }
    }
    
    renderStartTime.current = performance.now();
  });

  // Debounce helper for frequent state updates
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Cached fetch helper for Supabase queries
  const cachedQuery = useCallback(async (key, queryFn, ttl = 300000) => {
    const cached = queryCache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return { data: cached.data, error: null, cached: true };
    }

    try {
      const { data, error } = await queryFn();
      if (error) throw error;
      
      queryCache.set(key, { data, timestamp: Date.now() });
      return { data, error: null, cached: false };
    } catch (error) {
      console.error(`[Admin Perf] Query error for ${key}:`, error);
      return { data: null, error, cached: false };
    }
  }, []);

  const clearCache = useCallback((key) => {
    if (key) queryCache.delete(key);
    else queryCache.clear();
  }, []);

  return {
    debounce,
    cachedQuery,
    clearCache
  };
};

export default useAdminPerformance;
