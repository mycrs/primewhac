
import { parseJWT } from './jwtValidator';
import TokenClaimsValidator from './TokenClaimsValidator';

/**
 * Middleware to validate sessions and tokens before use
 */

export const validateTokenBeforeUse = (token) => {
  if (!token) return { isValid: false, error: 'Token is empty or undefined' };
  
  try {
    const payload = parseJWT(token);
    if (!payload) {
      return { isValid: false, error: 'Token payload is malformed' };
    }
    
    const requiredClaims = ['sub', 'session_id', 'aud', 'exp', 'iat'];
    const missingClaims = requiredClaims.filter(claim => !payload[claim]);
    
    if (missingClaims.length > 0) {
      return { isValid: false, error: `Missing required claims: ${missingClaims.join(', ')}` };
    }
    
    const expirationValid = TokenClaimsValidator.validateClaimExpiration(payload);
    if (!expirationValid.isValid) {
      return { isValid: false, error: expirationValid.error };
    }

    return { isValid: true, token, payload };
  } catch (error) {
    return { isValid: false, error: `Token validation failed: ${error.message}` };
  }
};

export const SessionValidationMiddleware = {
  validateTokenBeforeUse
};

export default SessionValidationMiddleware;
