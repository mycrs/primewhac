/**
 * Performance Optimization configuration for frontend build and request handling.
 * Defines headers and settings applied via API requests or meta tags.
 */

export const performanceConfig = {
  compression: {
    gzip: true,
    brotli: true,
    threshold: 1024 // Only compress if over 1KB
  },
  minification: {
    css: true,
    js: true,
    html: true
  },
  loading: {
    lazyLoadImages: true,
    codeSplitting: true
  },
  caching: {
    defaultCacheControl: 'public, max-age=3600, must-revalidate',
    enableETag: true
  }
};

/**
 * Generates optimal headers for API requests to ensure payload compression and caching.
 */
export const getOptimizedHeaders = (customHeaders = {}) => {
  return {
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': performanceConfig.caching.defaultCacheControl,
    ...customHeaders
  };
};