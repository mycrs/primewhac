
import TokenClaimsValidator from './TokenClaimsValidator';

/**
 * Utility for parsing and validating JWT tokens safely on the client side.
 */

export const validateJWTFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
  return jwtRegex.test(token);
};

export const validateTokenStructure = (token) => {
  if (!token || typeof token !== 'string') return false;
  return token.split('.').length === 3;
};

export const validateTokenSegmentFormat = (token) => {
  return validateJWTFormat(token);
};

export const validateTokenPayload = (token) => {
  const payload = parseJWT(token);
  if (!payload) return { isValid: false, error: 'Malformed payload' };
  return { isValid: true, payload };
};

export const validateTokenHeader = (token) => {
  if (!validateTokenStructure(token)) return { isValid: false };
  try {
    const headerStr = atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/'));
    const header = JSON.parse(headerStr);
    if (!header.alg || !header.typ) return { isValid: false, error: 'Missing alg or typ in header' };
    return { isValid: true, header };
  } catch (e) {
    return { isValid: false, error: 'Malformed header' };
  }
};

export const validateTokenSignature = (token) => {
  if (!validateTokenStructure(token)) return false;
  const signature = token.split('.')[2];
  return /^[A-Za-z0-9-_]+$/.test(signature);
};

export const detectMalformedClaims = (payload) => {
  return TokenClaimsValidator.detectMissingClaims(payload);
};

export const getTokenStructureReport = (token) => {
  const hasStructure = validateTokenStructure(token);
  const hasValidSegments = validateTokenSegmentFormat(token);
  const headerCheck = validateTokenHeader(token);
  const payloadCheck = validateTokenPayload(token);
  const hasValidSignatureFormat = validateTokenSignature(token);
  
  return {
    isStructurallySound: hasStructure && hasValidSegments && headerCheck.isValid && payloadCheck.isValid && hasValidSignatureFormat,
    details: {
      hasStructure,
      hasValidSegments,
      headerValid: headerCheck.isValid,
      payloadValid: payloadCheck.isValid,
      signatureFormatValid: hasValidSignatureFormat,
    }
  };
};

export const validateJWTStructure = (base64UrlPayload) => {
  try {
    const base64 = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const parseJWT = (token) => {
  if (!validateTokenStructure(token)) return null;
  const parts = token.split('.');
  return validateJWTStructure(parts[1]);
};

export const isTokenExpired = (token) => {
  const payload = typeof token === 'string' ? parseJWT(token) : token;
  return !TokenClaimsValidator.validateClaimExpiration(payload).isValid;
};

export const hasValidSubClaim = (token) => {
  const payload = typeof token === 'string' ? parseJWT(token) : token;
  return TokenClaimsValidator.validateSubClaim(payload).isValid;
};

export const validateAllClaims = (token) => {
  const payload = typeof token === 'string' ? parseJWT(token) : token;
  return TokenClaimsValidator.getClaimsValidationReport(payload);
};

export const getDetailedTokenError = (token) => {
  if (!token) return "Token is empty or undefined.";
  if (typeof token !== 'string') return "Token is not a string.";
  
  const structureReport = getTokenStructureReport(token);
  if (!structureReport.isStructurallySound) {
    return `Token structure invalid: ${JSON.stringify(structureReport.details)}`;
  }
  
  const payload = parseJWT(token);
  const claimsReport = TokenClaimsValidator.getClaimsValidationReport(payload);
  
  if (!claimsReport.isValid) {
    return `Claims invalid: ${JSON.stringify({ missing: claimsReport.missingClaims, formats: claimsReport.formatErrors })}`;
  }

  return "Token format appears structurally valid.";
};

export const validateJWT = (token) => {
  const result = {
    isValid: false,
    payload: null,
    errors: []
  };

  const detailedError = getDetailedTokenError(token);
  if (detailedError !== "Token format appears structurally valid.") {
    result.errors.push(detailedError);
    return result;
  }

  const payload = parseJWT(token);
  result.payload = payload;

  const claimsValidation = validateAllClaims(payload);
  if (!claimsValidation.isValid) {
    if (claimsValidation.isExpired) result.errors.push('Token has expired.');
    claimsValidation.missingClaims.forEach(m => result.errors.push(`Missing claim: ${m}`));
    claimsValidation.formatErrors.forEach(e => result.errors.push(`Format error: ${e}`));
  }

  result.isValid = result.errors.length === 0;
  return result;
};
