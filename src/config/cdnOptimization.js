/**
 * CDN Optimization Configuration
 * Used to define how the frontend interacts with CDN assets.
 */

export const cdnOptimizationConfig = {
  edgeCaching: {
    enabled: true,
    ttl: 3600, // 3600s = 1 hour
    staleWhileRevalidate: 86400 // 24 hours
  },
  security: {
    originShield: true
  },
  protocols: {
    http2: true,
    http3_quic: true
  },
  compression: {
    brotliPreferred: true,
    gzipFallback: true
  },
  endpoints: {
    assets: 'https://cdn.qruzehd.com/assets',
    images: 'https://cdn.qruzehd.com/images'
  }
};

export const getCdnUrl = (path, type = 'assets') => {
  const baseUrl = cdnOptimizationConfig.endpoints[type];
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};