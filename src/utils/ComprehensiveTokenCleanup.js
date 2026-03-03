
import { parseJWT } from './jwtValidator';
import TokenClaimsValidator from './TokenClaimsValidator';

/**
 * Utility to completely wipe all corrupted tokens and sessions
 */

export const validateTokenStructure = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  try {
    const payload = parseJWT(token);
    const report = TokenClaimsValidator.getTokenValidationReport(payload);
    return report.isValid;
  } catch (e) {
    return false;
  }
};

export const detectMalformedTokens = () => {
  const malformedKeys = [];
  
  // Check localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase.auth.token') || key.includes('-auth-token'))) {
        const item = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(item);
          if (parsed?.access_token) {
            const payload = parseJWT(parsed.access_token);
            if (TokenClaimsValidator.detectMissingSubClaim(payload)) {
              malformedKeys.push({ storage: 'local', key });
            }
          }
        } catch (e) {
          malformedKeys.push({ storage: 'local', key }); // JSON parse error = malformed
        }
      }
    }
  } catch (e) {
    console.error('[TokenCleanup] Failed accessing localStorage', e);
  }

  // Check sessionStorage
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('supabase.auth.token') || key.includes('-auth-token'))) {
        malformedKeys.push({ storage: 'session', key }); // any auth in session storage is suspicious in this app
      }
    }
  } catch (e) {
    console.error('[TokenCleanup] Failed accessing sessionStorage', e);
  }

  return malformedKeys;
};

export const cleanupAllCorruptedData = () => {
  console.log('[TokenCleanup] Executing complete wipe of all tokens and sessions...');
  let removedCount = 0;

  const removeKeys = (storage) => {
    const keysToRemove = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && (
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth.token') ||
        key.includes('supabase.auth.token')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => {
      storage.removeItem(k);
      removedCount++;
    });
  };

  try {
    removeKeys(localStorage);
    removeKeys(sessionStorage);
  } catch (e) {
    console.error('[TokenCleanup] Critical failure during cleanup:', e);
  }

  console.log(`[TokenCleanup] Successfully removed ${removedCount} auth-related keys.`);
  return removedCount;
};

export const ComprehensiveTokenCleanup = {
  validateTokenStructure,
  detectMalformedTokens,
  cleanupAllCorruptedData
};

export default ComprehensiveTokenCleanup;
