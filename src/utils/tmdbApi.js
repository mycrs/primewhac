import { queueRequest } from './tmdbRateLimiter';
import { logAPICall, logError } from './tmdbMonitoring';
import { CacheManager } from './localCache';
import { validateDataStructure } from './dataValidator';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const buildImageUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
};

export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Tarih Yok';
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Enhanced error handler with user-friendly messages
 */
export const handleTMDBError = (error) => {
  const code = error.response?.status;
  
  // Log specific technical error for monitoring
  logError('tmdb_error_handler', error);

  if (code === 401) {
    return 'API yapılandırma hatası: Yetkisiz erişim.';
  }
  if (code === 404) {
    return 'İstenen içerik bulunamadı.';
  }
  if (code === 429) {
    return 'Çok fazla istek yapıldı, lütfen biraz bekleyin.';
  }
  if (!error.response && error.request) {
    return 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
  }
  
  return error.response?.data?.status_message || 'Beklenmeyen bir hata oluştu.';
};

/**
 * Validates TMDB API response
 */
export const validateTMDBResponse = (response) => {
  if (!response || !response.data) {
    throw new Error('Invalid API Response: No data received');
  }
  
  // Run middleware validation
  const validData = validateDataStructure(response.data);
  return validData;
};

// Re-export cache manager for convenience
export const cacheManager = CacheManager;