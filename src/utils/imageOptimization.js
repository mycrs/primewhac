
/**
 * Image Optimization Utilities
 */

// Detect WebP support
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  const elem = document.createElement('canvas');
  if (!!(elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

// Generate responsive srcset
export const generateResponsiveSrcSet = (baseUrl, widths = [320, 640, 768, 1024, 1280, 1536]) => {
  if (!baseUrl) return '';
  
  // If it's a TMDB image, we can manipulate the URL
  if (baseUrl.includes('image.tmdb.org')) {
    return widths.map(w => {
      const tmdbSize = w <= 320 ? 'w342' : w <= 768 ? 'w500' : w <= 1024 ? 'w780' : 'original';
      const url = baseUrl.replace(/\/w\d+|\/original/, `/${tmdbSize}`);
      return `${url} ${w}w`;
    }).join(', ');
  }

  // Fallback for regular images (just returns the original, assuming CDN handles it or it's static)
  return `${baseUrl} 1x`;
};

// Generate blur placeholder (tiny data URI) - placeholder logic
export const generateBlurPlaceholder = (color = '#1a1a1a') => {
  // 1x1 pixel SVG with solid color
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`;
};
