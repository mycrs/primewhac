
/**
 * Utility for scanning and validating auth-related data in localStorage.
 */

export const validateTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  const segments = token.split('.');
  if (segments.length !== 3) return false;
  
  // Basic base64 validation for segments
  const base64Regex = /^[A-Za-z0-9-_]+$/;
  return base64Regex.test(segments[0]) && base64Regex.test(segments[1]);
};

export const getAuthRelatedKeys = () => {
  const keys = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('sb-') && key.includes('-auth-token') ||
        key.includes('supabase.auth') ||
        key.includes('auth-token') ||
        key === 'session' ||
        key === 'user' ||
        key === 'token' ||
        key === 'jwt' ||
        key === 'access_token' ||
        key === 'refresh_token' ||
        key === 'id_token' ||
        key === 'supabase.session'
      )) {
        keys.push(key);
      }
    }
  } catch (err) {
    console.error('[StorageValidator] Error accessing localStorage:', err);
  }
  return keys;
};

export const detectCorruptedTokens = () => {
  const authKeys = getAuthRelatedKeys();
  const corruptedKeys = [];
  
  authKeys.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return;

      // Try to parse as JSON first
      let parsed = null;
      try {
        parsed = JSON.parse(item);
      } catch (e) {
        // If it's an auth token key but not valid JSON, it's corrupted
        if (key.includes('-auth-token')) {
          corruptedKeys.push({ key, reason: 'Invalid JSON format' });
        }
        return;
      }

      // Check if it has an access_token that is malformed
      if (parsed && typeof parsed === 'object' && parsed.access_token) {
        if (!validateTokenFormat(parsed.access_token)) {
          corruptedKeys.push({ key, reason: 'Malformed access_token (not 3 segments or invalid base64)' });
        }
      }
    } catch (e) {
      corruptedKeys.push({ key, reason: 'Unreadable entry' });
    }
  });

  return corruptedKeys;
};

export const safelyRemoveInvalidTokens = () => {
  const corrupted = detectCorruptedTokens();
  let removedCount = 0;
  
  corrupted.forEach(({ key, reason }) => {
    try {
      localStorage.removeItem(key);
      console.warn(`[StorageValidator] Removed corrupted key: ${key}. Reason: ${reason}`);
      removedCount++;
    } catch (e) {
      console.error(`[StorageValidator] Failed to remove key: ${key}`, e);
    }
  });
  
  return removedCount;
};

export const generateCleanupReport = () => {
  const corrupted = detectCorruptedTokens();
  return {
    scannedKeys: getAuthRelatedKeys().length,
    corruptedFound: corrupted.length,
    corruptedDetails: corrupted,
    status: corrupted.length > 0 ? 'needs_cleanup' : 'clean'
  };
};

export const StorageValidator = {
  validateTokenFormat,
  getAuthRelatedKeys,
  detectCorruptedTokens,
  safelyRemoveInvalidTokens,
  generateCleanupReport
};

export default StorageValidator;
