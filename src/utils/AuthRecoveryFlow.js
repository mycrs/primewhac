
import { supabase } from '@/lib/customSupabaseClient';
import { cleanupAllCorruptedData } from './ComprehensiveTokenCleanup';

/**
 * Handles specifically "missing sub claim" and other critical token errors
 */

export const handleMissingSubClaimError = async () => {
  console.error('[AuthRecovery] DETECTED: Missing "sub" claim error. Initiating full recovery sequence.');
  
  // 1. Wipe all corrupted data
  cleanupAllCorruptedData();
  
  // 2. Force sign out locally and remotely (if possible)
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('[AuthRecovery] Error during forced sign out, continuing recovery...', e.message);
  }
  
  console.log('[AuthRecovery] Recovery complete. User must log in again to obtain a fresh token.');
  return { recovered: true, requiresLogin: true };
};

export const recoverFromTokenError = async (error) => {
  const msg = error?.message?.toLowerCase() || '';
  
  if (msg.includes('missing sub claim') || msg.includes('jwt') || msg.includes('malformed') || msg.includes('session_id')) {
    console.warn(`[AuthRecovery] Triggering recovery due to token error: ${error.message}`);
    return await handleMissingSubClaimError();
  }
  
  console.log('[AuthRecovery] Error does not appear to be a structural token issue. Skipping full wipe.');
  return { recovered: false, requiresLogin: false };
};

export const AuthRecoveryFlow = {
  handleMissingSubClaimError,
  recoverFromTokenError
};

export default AuthRecoveryFlow;
