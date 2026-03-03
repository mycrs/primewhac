
/**
 * Enhanced centralized utility for validating JWT claims
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateSubClaim = (payload) => {
  if (!payload || !payload.sub) return { isValid: false, error: 'Missing "sub" claim' };
  if (typeof payload.sub !== 'string') return { isValid: false, error: '"sub" claim must be a string' };
  if (payload.sub.trim() === '') return { isValid: false, error: '"sub" claim cannot be empty' };
  if (!UUID_REGEX.test(payload.sub)) return { isValid: false, error: '"sub" claim is not a valid UUID' };
  return { isValid: true };
};

export const validateSessionIdClaim = (payload) => {
  if (!payload || !payload.session_id) return { isValid: false, error: 'Missing "session_id" claim' };
  if (typeof payload.session_id !== 'string') return { isValid: false, error: '"session_id" claim must be a string' };
  if (!UUID_REGEX.test(payload.session_id)) return { isValid: false, error: '"session_id" claim is not a valid UUID' };
  return { isValid: true };
};

export const validateClaimExpiration = (payload) => {
  if (!payload || !payload.exp) return { isValid: false, error: 'Missing "exp" claim' };
  if (typeof payload.exp !== 'number') return { isValid: false, error: '"exp" claim must be a number' };
  if (Date.now() >= payload.exp * 1000) return { isValid: false, error: 'Token has expired' };
  return { isValid: true };
};

export const validateClaimIssuedAt = (payload) => {
  if (!payload || !payload.iat) return { isValid: false, error: 'Missing "iat" claim' };
  if (typeof payload.iat !== 'number') return { isValid: false, error: '"iat" claim must be a number' };
  if (Date.now() < payload.iat * 1000 - 60000) return { isValid: false, error: '"iat" claim is in the future' }; 
  return { isValid: true };
};

export const validateTokenClaims = (payload) => {
  if (!payload) return { isValid: false, missing: ['payload'] };
  const required = ['sub', 'session_id', 'aud', 'exp', 'iat'];
  const missing = required.filter(claim => !payload[claim]);
  
  if (missing.length > 0) return { isValid: false, missing };
  return { isValid: true, missing: [] };
};

export const validateRequiredClaims = validateTokenClaims;

export const detectMissingSubClaim = (payload) => {
  return !payload || !payload.sub;
};

export const validateOptionalClaims = (payload) => {
  if (!payload) return { isValid: false, errors: ['No payload'] };
  const errors = [];
  if (payload.email && typeof payload.email !== 'string') errors.push('"email" must be a string');
  if (payload.role && typeof payload.role !== 'string') errors.push('"role" must be a string');
  return { isValid: errors.length === 0, errors };
};

export const validateClaimFormats = (payload) => {
  const errors = [];
  const subValidation = validateSubClaim(payload);
  if (!subValidation.isValid) errors.push(subValidation.error);
  
  const sidValidation = validateSessionIdClaim(payload);
  if (!sidValidation.isValid) errors.push(sidValidation.error);
  
  const expValidation = validateClaimExpiration(payload);
  if (!expValidation.isValid && expValidation.error !== 'Token has expired') errors.push(expValidation.error); 
  
  const iatValidation = validateClaimIssuedAt(payload);
  if (!iatValidation.isValid && iatValidation.error !== '"iat" claim is in the future') errors.push(iatValidation.error);
  
  if (payload && payload.aud && typeof payload.aud !== 'string') errors.push('"aud" must be a string');
  
  return { isValid: errors.length === 0, errors };
};

export const detectMissingClaims = (payload) => {
  const validation = validateRequiredClaims(payload);
  return validation.missing || [];
};

export const getClaimsValidationReport = (payload) => {
  if (!payload) return { isValid: false, error: 'Payload is empty' };
  
  const missing = detectMissingClaims(payload);
  const formats = validateClaimFormats(payload);
  const expired = !validateClaimExpiration(payload).isValid;
  
  return {
    isValid: missing.length === 0 && formats.isValid && !expired,
    missingClaims: missing,
    formatErrors: formats.errors,
    isExpired: expired,
    payloadSummary: {
      hasSub: !!payload.sub,
      hasSessionId: !!payload.session_id,
      role: payload.role || null
    }
  };
};

export const getTokenValidationReport = getClaimsValidationReport;

export const suggestClaimRecovery = (payload) => {
  const report = getClaimsValidationReport(payload);
  if (report.isValid) return 'No recovery needed.';
  if (report.missingClaims.includes('sub') || report.missingClaims.includes('session_id')) {
    return 'CRITICAL_MISSING_CLAIMS: Force sign out and re-authenticate. The token is fatally malformed.';
  }
  if (report.isExpired) {
    return 'TOKEN_EXPIRED: Attempt to refresh session via supabase.auth.refreshSession().';
  }
  return 'INVALID_FORMATS: Clear local storage and re-authenticate.';
};

export const rejectMalformedToken = (payload) => {
  const report = getClaimsValidationReport(payload);
  if (!report.isValid) {
    if (report.missingClaims.includes('sub')) {
      throw new Error('Token validation failed: missing sub claim');
    }
    throw new Error(`Token validation failed: ${report.missingClaims.join(', ')} missing or invalid format.`);
  }
  return true;
};

export const TokenClaimsValidator = {
  validateSubClaim,
  validateSessionIdClaim,
  validateRequiredClaims,
  validateTokenClaims,
  validateOptionalClaims,
  validateClaimFormats,
  validateClaimExpiration,
  validateClaimIssuedAt,
  getClaimsValidationReport,
  getTokenValidationReport,
  detectMissingClaims,
  detectMissingSubClaim,
  suggestClaimRecovery,
  rejectMalformedToken
};

export default TokenClaimsValidator;
