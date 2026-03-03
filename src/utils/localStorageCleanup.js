
import AuthRecoveryManager from './authRecoveryManager';
import StorageValidator from './localStorageValidator';

/**
 * Enhanced utility for cleaning up corrupted auth data from localStorage.
 */

export const validateStoredToken = (token) => {
  return StorageValidator.validateTokenFormat(token);
};

export const detectMalformedTokens = () => {
  return StorageValidator.detectCorruptedTokens().map(c => c.key);
};

export const removeMalformedTokens = () => {
  return StorageValidator.safelyRemoveInvalidTokens();
};

export const cleanupCorruptedSessions = () => {
  return removeMalformedTokens();
};

export const cleanupAllAuthStorage = () => {
  console.log('[Storage Cleanup] Executing comprehensive auth wipe...');
  return AuthRecoveryManager.wipeAuthStorage();
};

export const getAuthStorageReport = () => {
  return AuthRecoveryManager.getReport();
};

export const getStorageCleanupReport = () => {
  return getAuthStorageReport();
};

export const cleanupCorruptedAuth = () => {
  try {
    console.log('[Storage Cleanup] Starting comprehensive auth storage scan...');
    const hasCorrupted = AuthRecoveryManager.detectCorruptedAuth();
    
    if (hasCorrupted) {
      const report = AuthRecoveryManager.getReport();
      console.warn(`[Storage Cleanup] Found ${report.corruptedFound} corrupted entries. Triggering wipe.`);
      const cleanedCount = cleanupAllAuthStorage();
      console.log(`[Storage Cleanup] Successfully removed ${cleanedCount} corrupted auth entries.`);
      return true;
    }
    
    console.log('[Storage Cleanup] Storage is clean, no corrupted entries found.');
    return false;
  } catch (err) {
    // Silent failure to prevent app crash
    console.error('[Storage Cleanup] Silent error during cleanup:', err);
    return false;
  }
};
