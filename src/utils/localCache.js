/**
 * Enhanced Local Cache Strategy
 * 24-hour duration, stats tracking, auto-invalidation.
 */

const CACHE_STATS_KEY = 'tmdb_cache_stats';

const getStats = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_STATS_KEY)) || { hits: 0, misses: 0, size: 0 };
  } catch {
    return { hits: 0, misses: 0, size: 0 };
  }
};

const updateStats = (hit) => {
  const stats = getStats();
  if (hit) stats.hits++;
  else stats.misses++;
  localStorage.setItem(CACHE_STATS_KEY, JSON.stringify(stats));
};

export const CacheManager = {
  /**
   * Save data to LocalStorage with an expiration time.
   * @param {string} key - The storage key.
   * @param {any} value - The data to store.
   * @param {number} ttlInMs - Time to live in milliseconds (default 24 hours).
   */
  set: (key, value, ttlInMs = 24 * 60 * 60 * 1000) => {
    try {
      const now = Date.now();
      const item = {
        value,
        expiry: now + ttlInMs,
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn('LocalStorage Quota Exceeded or Disabled:', error);
      // Optional: Clear old cache items strategy could go here
      return false;
    }
  },

  /**
   * Retrieve data from LocalStorage if it exists and hasn't expired.
   * @param {string} key - The storage key.
   * @returns {any|null} - The stored value or null if missing/expired.
   */
  get: (key) => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        updateStats(false);
        return null;
      }

      const item = JSON.parse(itemStr);
      const now = Date.now();

      if (now > item.expiry) {
        localStorage.removeItem(key);
        updateStats(false);
        return null;
      }

      updateStats(true);
      return item.value;
    } catch (error) {
      console.error('Error parsing cached data:', error);
      updateStats(false);
      return null;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },

  isExpired: (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return true;
    
    try {
      const item = JSON.parse(itemStr);
      return Date.now() > item.expiry;
    } catch {
      return true;
    }
  },

  getCacheStats: () => getStats()
};

// Aliases for the specific task requirements
export const getCachedData = CacheManager.get;
export const setCachedData = CacheManager.set;
export const invalidateCache = CacheManager.remove;
export const getCacheStats = CacheManager.getCacheStats;