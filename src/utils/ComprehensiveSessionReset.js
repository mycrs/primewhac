
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Completely clears Supabase session, tokens, and storage.
 */
export const resetSupabaseSession = async () => {
  console.log('[SessionReset] Executing comprehensive session reset...');
  try {
    // 1. supabase.auth.signOut()
    await supabase.auth.signOut().catch(() => {});
    
    // 2. clear all localStorage keys related to auth
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('supabase') || 
        key.includes('sb-') || 
        key.includes('auth') || 
        key.includes('token') || 
        key.includes('session') ||
        key.includes('user')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    // 3. clear all sessionStorage keys
    sessionStorage.clear();
    
    // 4. clear memory variables (handled by calling components usually, but we log it)
    console.log('[SessionReset] Cleared all auth storage keys.');
    
    // 5. return success
    return { success: true };
  } catch (error) {
    console.error('[SessionReset] Error during reset:', error);
    return { success: false, error: error.message };
  }
};

export default { resetSupabaseSession };
