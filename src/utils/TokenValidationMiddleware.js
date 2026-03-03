
import TokenClaimsValidator from './TokenClaimsValidator';
import { parseJWT } from './jwtValidator';

/**
 * Middleware to intercept and validate Supabase auth operations
 */

export const validateBeforeStorage = (token) => {
  console.log('[TokenMiddleware] Validating token before storage...');
  if (!token) {
    console.error('[TokenMiddleware] Token is empty');
    return false;
  }
  
  try {
    const payload = parseJWT(token);
    if (TokenClaimsValidator.detectMissingSubClaim(payload)) {
      console.error('[TokenMiddleware] Validation failed: missing sub claim. Rejecting storage.');
      return false;
    }
    
    const report = TokenClaimsValidator.getTokenValidationReport(payload);
    if (!report.isValid) {
      console.error(`[TokenMiddleware] Validation failed: ${report.missingClaims.join(', ')}`);
      return false;
    }
    
    console.log('[TokenMiddleware] Token validation passed before storage.');
    return true;
  } catch (e) {
    console.error('[TokenMiddleware] Fatal error during token validation:', e);
    return false;
  }
};

export const validateBeforeUse = (token) => {
  console.log('[TokenMiddleware] Validating token before API use...');
  if (!token) return false;
  
  try {
    const payload = parseJWT(token);
    TokenClaimsValidator.rejectMalformedToken(payload);
    console.log('[TokenMiddleware] Token valid for API use.');
    return true;
  } catch (e) {
    console.error('[TokenMiddleware] Token validation failed before use:', e.message);
    return false;
  }
};

export const TokenValidationMiddleware = {
  validateBeforeStorage,
  validateBeforeUse
};

export default TokenValidationMiddleware;
