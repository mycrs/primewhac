
export const checkOnlineStatus = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

export const pingServer = async (timeoutMs = 3000) => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch('/favicon.ico', { method: 'HEAD', signal: controller.signal, cache: 'no-store' });
    clearTimeout(id);
    return response.ok;
  } catch (err) {
    return false;
  }
};

export const isNetworkError = (error) => {
  if (!error) return false;
  const msg = error.message?.toLowerCase() || '';
  return msg.includes('fetch') || 
         msg.includes('network') || 
         msg.includes('timeout') || 
         msg.includes('offline') ||
         msg.includes('zaman aşımına uğradı') ||
         error.name === 'TypeError' && msg === 'failed to fetch';
};

export const getCachedData = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    return parsed.data;
  } catch (err) {
    console.error(`Error reading cache for ${key}:`, err);
    return null;
  }
};

export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.error(`Error writing cache for ${key}:`, err);
  }
};
