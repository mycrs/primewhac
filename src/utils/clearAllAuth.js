
import { supabase } from '@/lib/customSupabaseClient';
import TokenManager from './tokenManager';
import AuthRecoveryManager from './authRecoveryManager';
import { errorLogger, ERROR_SEVERITY } from './errorLogger';

export const clearAllAuth = async () => {
  try {
    console.log('[clearAllAuth] Initiating comprehensive auth cleanup...');
    
    // Clear application tokens
    TokenManager.clearTokens();
    
    // Use the comprehensive recovery manager to wipe all related local/session storage
    AuthRecoveryManager.wipeAuthStorage();
    
    try {
      // Attempt to sign out from Supabase (catch errors gracefully if already signed out)
      const { error } = await supabase.auth.signOut();
      if (error && error.status !== 403 && !error.message?.includes('session_not_found') && !error.message?.includes('JWT')) {
        errorLogger.log(error, ERROR_SEVERITY.WARNING, { context: 'clearAllAuth_signOut' });
      }
    } catch (e) {
      console.warn('[clearAllAuth] Supabase signOut threw error (expected if token was malformed):', e);
    }
    
    // Fallback manual clear as absolute last resort, but preserve non-auth data if possible
    // (If user explicitly requested clearing all, we might want to keep it localized to Auth via AuthRecoveryManager to avoid losing preferences)
    // localStorage.clear(); // Skipped to preserve user preferences
    
    console.log('[clearAllAuth] Cleanup successful.');
    return true;
  } catch (error) {
    errorLogger.log(error, ERROR_SEVERITY.ERROR, { context: 'clearAllAuth_catch' });
    return false;
  }
};
