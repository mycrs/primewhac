
import { supabase } from '@/lib/customSupabaseClient';
import TokenValidator from './tokenValidator';
import AuthDebugger from './authDebugger';
import SessionClaimsValidator from './SessionClaimsValidator';
import TokenClaimsValidator from './TokenClaimsValidator';

/**
 * Safe auth state reset and recovery with claim validation
 */

export const validateTokenClaimsBeforeReset = (token) => {
  return TokenValidator.getDetailedClaimsReport(token);
};

export const validateSessionClaimsBeforeReset = (session) => {
  return SessionClaimsValidator.getSessionValidationReport(session);
};

export const recoverFromMissingSubClaim = async () => {
  AuthDebugger.logAuthFlow('Recovering from missing SUB claim');
  return await resetAuthState();
};

export const recoverFromMissingSessionIdClaim = async () => {
  AuthDebugger.logAuthFlow('Recovering from missing SESSION_ID claim');
  return await resetAuthState();
};

export const improvedCleanupCorruptedTokens = () => {
  AuthDebugger.logAuthFlow('Cleaning up corrupted tokens with strict claim validation');
  let removedCount = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase.auth.token') || key.includes('-auth-token'))) {
        const item = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(item);
          if (parsed?.access_token) {
            const claimsReport = TokenValidator.getDetailedClaimsReport(parsed.access_token);
            if (!claimsReport.isValid) {
              localStorage.removeItem(key);
              removedCount++;
              AuthDebugger.logAuthFlow(`Removed corrupted token key: ${key}. Reason: ${JSON.stringify(claimsReport.missingClaims)}`);
            }
          } else {
             localStorage.removeItem(key);
             removedCount++;
          }
        } catch (e) {
          localStorage.removeItem(key);
          removedCount++;
        }
      }
    }
  } catch (err) {
    console.error('Failed to access localStorage during cleanup', err);
  }
  
  return removedCount;
};

export const cleanupCorruptedTokens = improvedCleanupCorruptedTokens;

export const validateTokenClaimsAfterRecovery = (session) => {
  if (!session) return false;
  return SessionClaimsValidator.getSessionValidationReport(session).isValid;
};

export const improvedValidateAndRecoverSession = async () => {
  AuthDebugger.logAuthFlow('Validating and recovering session with claims');
  
  improvedCleanupCorruptedTokens();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      AuthDebugger.logAuthFlow('getSession error during recovery', { error: error.message });
      return { success: false, session: null, error };
    }
    
    if (session?.access_token) {
      const claimsReport = TokenValidator.getDetailedClaimsReport(session.access_token);
      if (!claimsReport.isValid) {
        AuthDebugger.logAuthFlow('Recovered session token lacks critical claims. Forcing sign out.', claimsReport);
        
        if (claimsReport.missingClaims.includes('sub')) {
          await recoverFromMissingSubClaim();
        } else if (claimsReport.missingClaims.includes('session_id')) {
          await recoverFromMissingSessionIdClaim();
        } else {
          await supabase.auth.signOut().catch(() => {});
        }
        return { success: false, session: null, error: 'Token claims validation failed post-recovery' };
      }
    }
    
    return { success: true, session };
  } catch (err) {
    AuthDebugger.logAuthFlow('Critical error during session recovery', { error: err.message });
    return { success: false, session: null, error: err };
  }
};

export const validateAndRecoverSession = improvedValidateAndRecoverSession;

export const resetAuthState = async () => {
  AuthDebugger.logAuthFlow('Executing complete safe auth state reset');
  try {
    await supabase.auth.signOut().catch(() => {});
    
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes('supabase') || key?.includes('sb-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    return true;
  } catch (err) {
    console.error('Failed to reset auth state safely', err);
    return false;
  }
};

export const reinitializeAuth = async () => {
  AuthDebugger.logAuthFlow('Reinitializing auth from scratch');
  await resetAuthState();
  return improvedValidateAndRecoverSession();
};

export const AuthFlowReset = {
  validateTokenClaimsBeforeReset,
  validateSessionClaimsBeforeReset,
  cleanupCorruptedTokens,
  improvedCleanupCorruptedTokens,
  validateAndRecoverSession,
  improvedValidateAndRecoverSession,
  resetAuthState,
  reinitializeAuth,
  recoverFromMissingSubClaim,
  recoverFromMissingSessionIdClaim,
  validateTokenClaimsAfterRecovery
};

export default AuthFlowReset;
