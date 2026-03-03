
import { supabase } from '@/lib/customSupabaseClient';
import { validateJWT, getDetailedTokenError, parseJWT } from './jwtValidator';
import { cleanupCorruptedAuth, cleanupCorruptedSessions } from './localStorageCleanup';
import SessionClaimsValidator from './SessionClaimsValidator';
import TokenClaimsValidator from './TokenClaimsValidator';

/**
 * Enhanced session recovery and validation utility.
 */

export const validateSessionStructure = (session) => {
  return SessionClaimsValidator.validateSessionStructure(session);
};

export const validateSessionClaims = (session) => {
  return SessionClaimsValidator.validateSessionClaims(session);
};

export const detectSessionMismatch = (session) => {
  if (!session?.access_token) return true;
  const payload = parseJWT(session.access_token);
  const consistency = SessionClaimsValidator.validateSessionConsistency(session, payload);
  return !consistency.isValid;
};

export const validateSessionPersistence = () => {
  let isPersisted = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('supabase.auth.token')) {
      isPersisted = true;
      break;
    }
  }
  return { isValid: isPersisted };
};

export const getSessionValidationReport = (session) => {
  return SessionClaimsValidator.getSessionValidationReport(session);
};

export const validateSessionToken = (token) => {
  if (!token) return { isValid: false, reason: 'No token provided' };
  const validation = validateJWT(token);
  if (!validation.isValid) {
    return { 
      isValid: false, 
      reason: getDetailedTokenError(token),
      errors: validation.errors
    };
  }
  return { isValid: true };
};

export const detectAndRemoveMalformedSession = () => {
  console.log('[Session Recovery] Detecting and removing malformed sessions...');
  const cleaned = cleanupCorruptedSessions();
  return cleaned > 0;
};

export const validateSession = (session) => {
  const report = SessionClaimsValidator.getSessionValidationReport(session);
  if (!report.isValid) {
    return { 
      isValid: false, 
      reason: SessionClaimsValidator.suggestSessionRecovery(session), 
      details: [report.structureError, report.claimsError, report.expirationError].filter(Boolean)
    };
  }
  return { isValid: true };
};

export const createFallbackSession = () => {
  console.warn('[Session Recovery] Creating empty fallback session');
  return null; 
};

export const recoverFromMissingSubClaim = async () => {
  console.error('[Session Recovery] Critical: missing "sub" claim. Full wipe required.');
  detectAndRemoveMalformedSession();
  await supabase.auth.signOut().catch(() => {});
  return createFallbackSession();
};

export const recoverFromMissingSessionIdClaim = async () => {
  console.error('[Session Recovery] Missing "session_id". Forcing logout to prevent state corruption.');
  detectAndRemoveMalformedSession();
  await supabase.auth.signOut().catch(() => {});
  return createFallbackSession();
};

export const validateTokenClaimsAfterRefresh = (session) => {
  const report = SessionClaimsValidator.getSessionValidationReport(session);
  return report.isValid;
};

export const refreshSessionToken = async (retryCount = 0) => {
  const MAX_RETRIES = 2;
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    
    if (data?.session) {
      if (validateTokenClaimsAfterRefresh(data.session)) {
        return { success: true, session: data.session };
      }
      throw new Error(`Refreshed session produced invalid claims.`);
    }
    return { success: false, error: 'No session returned from refresh' };
  } catch (error) {
    console.error(`[Session Recovery] Token refresh failed (Attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      const backoff = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoff));
      return refreshSessionToken(retryCount + 1);
    }
    
    detectAndRemoveMalformedSession();
    return { success: false, error: error.message };
  }
};

export const recoverSession = async () => {
  console.log('[Session Recovery] Attempting to recover and validate session...');
  
  if (detectAndRemoveMalformedSession()) {
    console.warn('[Session Recovery] Cleaned malformed session prior to recovery attempt.');
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('[Session Recovery] getSession error:', error.message);
      
      if (error.message.includes('missing sub claim') || error.message.includes('JWT') || error.message.includes('malformed')) {
        console.log('[Session Recovery] Attempting forced refresh due to corrupted JWT...');
        const refreshResult = await refreshSessionToken();
        if (refreshResult.success) return refreshResult.session;
        
        console.warn('[Session Recovery] Forced refresh failed, recovering to fallback...');
        return await recoverFromMissingSubClaim();
      }
      return null;
    }

    if (!session) return null;

    const report = SessionClaimsValidator.getSessionValidationReport(session);
    
    if (!report.isValid) {
      console.warn('[Session Recovery] Retrieved session is invalid:', SessionClaimsValidator.suggestSessionRecovery(session));
      
      if (report.tokenClaimsReport?.missingClaims?.includes('sub')) {
        return await recoverFromMissingSubClaim();
      }
      if (report.tokenClaimsReport?.missingClaims?.includes('session_id')) {
        return await recoverFromMissingSessionIdClaim();
      }

      const refreshResult = await refreshSessionToken();
      if (refreshResult.success) return refreshResult.session;
      
      console.warn('[Session Recovery] Refresh failed, clearing corrupted data...');
      return await recoverFromMissingSubClaim();
    }

    console.log('[Session Recovery] Valid session recovered successfully.');
    return session;

  } catch (err) {
    console.error('[Session Recovery] Critical failure during recovery:', err);
    return await recoverFromMissingSubClaim();
  }
};
