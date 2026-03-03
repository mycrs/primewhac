
import StorageValidator from './localStorageValidator';

/**
 * Comprehensive manager for detecting, recovering, and resetting auth state.
 */

const detectCorruptedAuth = () => {
  console.log('[AuthRecoveryManager] Scanning for corrupted auth data...');
  const report = StorageValidator.generateCleanupReport();
  if (report.corruptedFound > 0) {
    console.warn(`[AuthRecoveryManager] Found ${report.corruptedFound} corrupted entries.`, report.corruptedDetails);
    return true;
  }
  return false;
};

const validateJWTStructure = (token) => {
  return StorageValidator.validateTokenFormat(token);
};

const wipeAuthStorage = () => {
  console.log('[AuthRecoveryManager] Initiating complete auth storage wipe...');
  let removedCount = 0;
  const keysToRemove = StorageValidator.getAuthRelatedKeys();
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key); // Also clear session storage just in case
      console.log(`[AuthRecoveryManager] Deleted auth key: ${key}`);
      removedCount++;
    } catch (err) {
      console.error(`[AuthRecoveryManager] Failed to delete key: ${key}`, err);
    }
  });
  
  console.log(`[AuthRecoveryManager] Storage wipe complete. Removed ${removedCount} keys.`);
  return removedCount;
};

const resetAuthState = () => {
  console.log('[AuthRecoveryManager] Resetting auth state...');
  const wipedCount = wipeAuthStorage();
  return { success: true, wipedCount };
};

const getReport = () => {
  return StorageValidator.generateCleanupReport();
};

export const AuthRecoveryManager = {
  detectCorruptedAuth,
  validateJWTStructure,
  wipeAuthStorage,
  resetAuthState,
  getReport
};

export default AuthRecoveryManager;
