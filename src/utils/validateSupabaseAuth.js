
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Validates Supabase authentication configuration and connection status.
 */
export const validateSupabaseAuth = async () => {
  const status = {
    connected: false,
    authEnabled: false,
    sessionValid: false,
    errors: []
  };

  try {
    console.log('[Auth Validation] Starting Supabase auth checks...');

    // 1. Check basic connection by attempting to fetch session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      status.errors.push(`Session Fetch Error: ${sessionError.message}`);
      if (sessionError.message.includes('missing sub claim') || sessionError.message.includes('JWT')) {
        console.error('[Auth Validation] CRITICAL: JWT secret mismatch or corrupted token detected.');
        // Clear broken session
        await supabase.auth.signOut().catch(() => {});
        localStorage.removeItem('supabase.auth.token');
      }
    } else {
      status.connected = true;
      status.authEnabled = true; // If getSession succeeds (even returning null), auth API is accessible
      
      if (session) {
        status.sessionValid = true;
        // Basic JWT parse for debugging (safe, client-side only)
        try {
          if (session.access_token) {
            const payload = JSON.parse(atob(session.access_token.split('.')[1]));
            console.log('[Auth Validation] Current Token Payload (Safe):', {
              sub: payload.sub,
              exp: new Date(payload.exp * 1000).toLocaleString(),
              email: payload.email,
              hasAppMetadata: !!payload.app_metadata,
              hasUserMetadata: !!payload.user_metadata
            });
          }
        } catch (e) {
          console.warn('[Auth Validation] Could not parse current token payload:', e);
        }
      }
    }

    console.log('[Auth Validation] Validation complete:', status);
    return status;

  } catch (err) {
    console.error('[Auth Validation] Unexpected system error during validation:', err);
    status.errors.push(`System Error: ${err.message}`);
    return status;
  }
};
