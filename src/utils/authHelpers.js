import { supabase } from '@/lib/customSupabaseClient';

/**
 * Safely handles logout process by checking session existence first.
 * This prevents 403 errors when trying to sign out of an already invalid session.
 * 
 * @returns {Promise<{error: any}>}
 */
export const safeSignOut = async () => {
  try {
    // Task 2: Check if session exists before calling signOut
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // If no session exists, we are effectively already signed out
      return { error: null };
    }

    // Attempt to sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      // If error is 403 or session not found, it means we're already signed out on server
      // or the session token was invalid. In either case, the goal (no session) is achieved.
      if (error.status === 403 || error.message?.includes('session_not_found')) {
        return { error: null };
      }
      // Return actual errors that might need attention
      return { error };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Safe sign out error:", error);
    // Even if there's an exception, we usually want to treat it as "signed out" for the UI
    return { error };
  }
};