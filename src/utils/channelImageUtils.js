
/**
 * Utility to get optimized channel background images.
 * @param {string} url - The original image URL
 * @param {string} size - Requested size ('mobile' | 'tablet' | 'desktop' | 'default' | 'slider')
 * @param {string} category - Channel category for fallback images
 * @returns {string} Optimized image URL
 */
export const getChannelImageUrl = (url, size = 'default', category = 'Genel') => {
  // If a valid URL is provided, try to append optimization parameters if it's Unsplash
  if (url && typeof url === 'string' && url.trim() !== '') {
    if (url.includes('unsplash.com') && !url.includes('w=')) {
      const width = size === 'mobile' ? 300 : size === 'tablet' ? 400 : size === 'desktop' ? 500 : size === 'slider' ? 1000 : 800;
      return `${url}${url.includes('?') ? '&' : '?'}w=${width}&q=80&auto=format&fit=crop`;
    }
    return url;
  }

  // High-quality vibrant fallbacks based on category (slider = 1000px for sharp cards)
  const fallbacks = {
    'Spor': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800',
    'Sinema': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    'Belgesel': 'https://images.unsplash.com/photo-1516934825964-b0db4350d750?auto=format&fit=crop&q=80&w=800',
    'Çocuk': 'https://images.unsplash.com/photo-1560506840-085b12c8e31a?auto=format&fit=crop&q=80&w=800',
    'Haber': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800',
    'Müzik': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    'Eğlence': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    'Genel': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800'
  };

  const fallbackUrl = fallbacks[category] || fallbacks['Genel'];
  const width = size === 'mobile' ? 300 : size === 'tablet' ? 400 : size === 'desktop' ? 500 : size === 'slider' ? 1000 : 800;

  // Fallback URL may already have w=; we override with requested width
  const base = fallbackUrl.includes('&w=') ? fallbackUrl.replace(/&w=\d+/, '') : fallbackUrl;
  return `${base}&w=${width}`;
};
