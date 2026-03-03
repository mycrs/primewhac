
import TokenClaimsValidator from './TokenClaimsValidator';

/**
 * Session-specific validation utility
 */

export const validateSessionStructure = (session) => {
  if (!session) return { isValid: false, error: 'Session is null or undefined' };
  if (typeof session !== 'object') return { isValid: false, error: 'Session is not an object' };
  
  const requiredFields = ['access_token', 'refresh_token', 'user', 'expires_at'];
  const missing = requiredFields.filter(f => !session[f]);
  
  if (missing.length > 0) {
    return { isValid: false, error: `Missing required session fields: ${missing.join(', ')}` };
  }
  
  return { isValid: true };
};

export const validateSessionClaims = (session) => {
  const structureCheck = validateSessionStructure(session);
  if (!structureCheck.isValid) return structureCheck;
  
  if (!session.user.id) return { isValid: false, error: 'Session user object missing "id"' };
  if (!session.user.aud) return { isValid: false, error: 'Session user object missing "aud"' };
  
  return { isValid: true };
};

// Internal safe token parser just for claims comparison
const parseTokenSafely = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch (e) {
    return null;
  }
};

export const validateSessionTokenClaims = (session) => {
  if (!session?.access_token) return { isValid: false, error: 'No access token in session' };
  const payload = parseTokenSafely(session.access_token);
  return TokenClaimsValidator.getClaimsValidationReport(payload);
};

export const validateSessionExpiration = (session) => {
  if (!session?.expires_at) return { isValid: false, error: 'No expires_at in session' };
  if (Date.now() >= session.expires_at * 1000) return { isValid: false, error: 'Session has expired' };
  return { isValid: true };
};

export const validateSessionConsistency = (session, tokenPayload) => {
  if (!session?.user || !tokenPayload) return { isValid: false, error: 'Missing session or payload for comparison' };
  
  const mismatches = [];
  if (session.user.id !== tokenPayload.sub) mismatches.push('User ID mismatch (session.user.id vs token.sub)');
  if (session.user.role !== tokenPayload.role) mismatches.push('Role mismatch');
  
  return {
    isValid: mismatches.length === 0,
    mismatches
  };
};

export const detectSessionCorruption = (session) => {
  const structureValid = validateSessionStructure(session).isValid;
  const claimsValid = validateSessionClaims(session).isValid;
  return !structureValid || !claimsValid;
};

export const getSessionValidationReport = (session) => {
  const structure = validateSessionStructure(session);
  const claims = validateSessionClaims(session);
  const expiration = validateSessionExpiration(session);
  const tokenClaims = validateSessionTokenClaims(session);
  
  let consistency = { isValid: false, mismatches: ['Cannot compare due to invalid token'] };
  if (session?.access_token) {
    const payload = parseTokenSafely(session.access_token);
    consistency = validateSessionConsistency(session, payload);
  }

  return {
    isValid: structure.isValid && claims.isValid && expiration.isValid && tokenClaims.isValid && consistency.isValid,
    structureError: structure.error || null,
    claimsError: claims.error || null,
    expirationError: expiration.error || null,
    tokenClaimsReport: tokenClaims,
    consistencyMismatches: consistency.mismatches
  };
};

export const suggestSessionRecovery = (session) => {
  const report = getSessionValidationReport(session);
  if (report.isValid) return 'Session is healthy.';
  if (report.structureError || report.claimsError) return 'FATAL_CORRUPTION: Wipe local storage and hard reset.';
  if (report.expirationError) return 'EXPIRED: Refresh token required.';
  if (report.consistencyMismatches?.length > 0) return 'MISMATCH: Token and session desynchronized. Force sign out.';
  if (report.tokenClaimsReport?.missingClaims?.includes('sub')) return 'MISSING_SUB: Token is invalid. Force sign out.';
  return 'UNKNOWN_ISSUE: Reset auth state.';
};

export const SessionClaimsValidator = {
  validateSessionStructure,
  validateSessionClaims,
  validateSessionTokenClaims,
  validateSessionExpiration,
  validateSessionConsistency,
  detectSessionCorruption,
  getSessionValidationReport,
  suggestSessionRecovery
};

export default SessionClaimsValidator;
