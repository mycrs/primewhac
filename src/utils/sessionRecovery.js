
import { supabase } from '@/lib/customSupabaseClient';
import TokenManager from './tokenManager';
import { clearAllAuth } from './clearAllAuth';
import { errorLogger, ERROR_SEVERITY } from './errorLogger';

export const recoverSession = async () => {
  try {
    console.log('[SessionRecovery] Attempting to recover session...');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.warn('[SessionRecovery] Error fetching session:', error.message);
      await clearAllAuth();
      return { status: 'failed', session: null };
    }

    if (!session) {
      console.log('[SessionRecovery] No active session found.');
      return { status: 'no-session', session: null };
    }

    if (!TokenManager.isValidFormat(session)) {
      console.warn('[SessionRecovery] Invalid session format.');
      await clearAllAuth();
      return { status: 'failed', session: null };
    }

    if (TokenManager.isTokenExpired(session)) {
      console.log('[SessionRecovery] Session expired, attempting refresh...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        console.warn('[SessionRecovery] Refresh failed:', refreshError?.message);
        await clearAllAuth();
        return { status: 'failed', session: null };
      }
      return { status: 'success', session: refreshData.session };
    }

    console.log('[SessionRecovery] Valid session recovered.');
    return { status: 'success', session };
  } catch (error) {
    errorLogger.log(error, ERROR_SEVERITY.CRITICAL, { context: 'sessionRecovery_exception' });
    await clearAllAuth();
    return { status: 'failed', session: null };
  }
};
