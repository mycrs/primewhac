
import ClientValidator from './supabaseClientValidator';
import AuthDebugger from './authDebugger';
import { supabase } from '@/lib/customSupabaseClient';
import { resetSupabaseSession } from './ComprehensiveSessionReset';
import { initializeFreshSession } from './FreshSessionInitializer';
import { validateTokenBeforeUse } from './SessionValidationMiddleware';

export const improvedInitializeAuthWithCleanup = async () => {
  AuthDebugger.logAuthFlow('Starting auth initializer with validation');
  
  try {
    const configValid = ClientValidator.validateSupabaseConfig();
    if (!configValid.isValid) {
      return { success: false, error: 'Invalid configuration', errorType: 'config', details: configValid.errors };
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      await resetSupabaseSession();
      return { success: false, error: error.message, errorType: 'network', details: [error.message] };
    }

    if (session?.access_token) {
      const validation = validateTokenBeforeUse(session.access_token);
      
      if (!validation.isValid) {
        AuthDebugger.logAuthFlow('Corrupted session detected during init. Triggering reset.');
        await resetSupabaseSession();
        const fresh = await initializeFreshSession();
        
        return { 
          success: fresh.valid && !!fresh.session, 
          session: fresh.session,
          details: fresh.error ? [fresh.error] : [],
          wasCleaned: true
        };
      }
    }
    
    return { 
      success: true, 
      session: session,
      details: [],
      wasCleaned: false
    };

  } catch (error) {
    console.error('[Auth Initializer] Unhandled critical error:', error);
    return { success: false, error: 'Initialization failure', errorType: 'fatal', details: [error.message] };
  }
};

export const initializeAuthWithCleanup = improvedInitializeAuthWithCleanup;
export const initializeAuth = improvedInitializeAuthWithCleanup;
