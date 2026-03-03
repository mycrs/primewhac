
import { supabase } from '@/lib/customSupabaseClient';
import { validateTokenBeforeUse } from './SessionValidationMiddleware';

/**
 * Initializes a fresh Supabase session and validates it.
 */
export const initializeFreshSession = async () => {
  console.log('[FreshSessionInitializer] Initializing fresh session...');
  try {
    // 1. call supabase.auth.getSession
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!data?.session) {
      return { success: true, session: null, valid: true };
    }
    
    // 2. Validate session structure & claims
    const validation = validateTokenBeforeUse(data.session.access_token);
    
    if (!validation.isValid) {
      console.warn('[FreshSessionInitializer] Session validation failed:', validation.error);
      return { success: false, session: null, error: validation.error, valid: false };
    }
    
    return { success: true, session: data.session, valid: true };
  } catch (error) {
    console.error('[FreshSessionInitializer] Error initializing session:', error);
    return { success: false, session: null, error: error.message, valid: false };
  }
};

export default { initializeFreshSession };
