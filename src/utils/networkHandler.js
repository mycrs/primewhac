
import { useState, useEffect } from 'react';

export const NETWORK_TIMEOUT_MS = 30000; // 30 seconds

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = NETWORK_TIMEOUT_MS } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`İstek zaman aşımına uğradı (${timeout}ms). Lütfen bağlantınızı kontrol edin.`);
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Ağ hatası: Sunucuya ulaşılamıyor (CORS veya bağlantı reddedildi).');
    }
    throw error;
  }
};
