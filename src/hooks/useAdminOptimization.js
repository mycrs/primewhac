
import { useState, useEffect, useCallback, useRef } from 'react';

// A simple in-memory cache for API requests
const apiCache = new Map();

export const useAdminOptimization = () => {
  const abortControllers = useRef(new Map());

  // Cleanup pending requests on unmount
  useEffect(() => {
    return () => {
      abortControllers.current.forEach(controller => controller.abort());
      abortControllers.current.clear();
    };
  }, []);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const createAbortController = useCallback((key) => {
    if (abortControllers.current.has(key)) {
      abortControllers.current.get(key).abort();
    }
    const controller = new AbortController();
    abortControllers.current.set(key, controller);
    return controller.signal;
  }, []);

  const cachedFetch = useCallback(async (key, fetcher, ttl = 60000) => {
    const cached = apiCache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    const data = await fetcher();
    apiCache.set(key, { data, timestamp: Date.now() });
    return data;
  }, []);

  const clearCache = useCallback((key) => {
    if (key) apiCache.delete(key);
    else apiCache.clear();
  }, []);

  return {
    debounce,
    createAbortController,
    cachedFetch,
    clearCache
  };
};

export default useAdminOptimization;
