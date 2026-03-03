
import { errorLogger, ERROR_SEVERITY } from './errorLogger';

class TokenManager {
  static getStorageKey() {
    // Attempt to find the supabase auth token key dynamically
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
        return key;
      }
    }
    return null;
  }

  static getRawToken() {
    try {
      const key = this.getStorageKey();
      if (!key) return null;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      errorLogger.log(error, ERROR_SEVERITY.WARNING, { context: 'tokenManager_getRawToken' });
      return null;
    }
  }

  static isTokenExpired(session) {
    if (!session || !session.expires_at) return true;
    // Buffer of 5 minutes (300 seconds)
    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    return (expiresAt - now) < 300000; 
  }

  static isValidFormat(session) {
    return !!(session && session.access_token && session.refresh_token && session.expires_at);
  }

  static clearTokens() {
    try {
      const key = this.getStorageKey();
      if (key) {
        localStorage.removeItem(key);
      }
      // General cleanup
      Object.keys(localStorage).forEach(k => {
        if (k.includes('supabase.auth.token') || k.startsWith('sb-')) {
          localStorage.removeItem(k);
        }
      });
      sessionStorage.clear();
      console.log('[TokenManager] Tokens cleared successfully.');
    } catch (error) {
      errorLogger.log(error, ERROR_SEVERITY.ERROR, { context: 'tokenManager_clearTokens' });
    }
  }
}

export default TokenManager;
