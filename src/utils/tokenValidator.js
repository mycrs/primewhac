
/**
 * Comprehensive token validation utility
 * Designed to strictly validate token structure without manipulating or corrupting it.
 */

const BASE64_URL_REGEX = /^[A-Za-z0-9-_]+$/;

/**
 * Validates that the token has exactly 3 segments separated by dots.
 * @param {string} token - The JWT token to validate
 * @returns {boolean} True if exactly 3 segments exist
 */
export const validateTokenStructure = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  const segments = token.split('.');
  return segments.length === 3;
};

/**
 * Verifies each segment of the JWT is valid Base64Url.
 * @param {string} token - The JWT token to validate
 * @returns {boolean} True if all segments are valid Base64Url
 */
export const validateTokenSegments = (token) => {
  if (!validateTokenStructure(token)) return false;
  const segments = token.split('.');
  
  // Only validating header and payload for Base64Url strictly, 
  // signature might have padding in some loose implementations, but standard JWT uses Base64Url without padding.
  return (
    BASE64_URL_REGEX.test(segments[0]) && 
    BASE64_URL_REGEX.test(segments[1]) &&
    BASE64_URL_REGEX.test(segments[2])
  );
};

/**
 * Ensures proper JWT format overall.
 * @param {string} token - The JWT token to validate
 * @returns {boolean} True if the format is completely valid
 */
export const validateTokenFormat = (token) => {
  return validateTokenStructure(token) && validateTokenSegments(token);
};

/**
 * Identifies corrupted or malformed tokens.
 * @param {string} token - The token to check
 * @returns {boolean} True if the token is definitely malformed
 */
export const detectMalformedToken = (token) => {
  if (!token) return true; // Empty is considered invalid for use
  if (typeof token !== 'string') return true;
  return !validateTokenFormat(token);
};

/**
 * Safely extracts tokens ensuring it is a string and basically formed.
 * Does NOT manipulate the actual string content to prevent corruption.
 * @param {any} rawInput - The raw input to sanitize
 * @returns {string|null} The sanitized token string or null if unrecoverable
 */
export const sanitizeToken = (rawInput) => {
  if (!rawInput) return null;
  const tokenStr = String(rawInput).trim();
  if (validateTokenStructure(tokenStr)) {
    return tokenStr;
  }
  return null;
};

export const TokenValidator = {
  validateTokenStructure,
  validateTokenSegments,
  validateTokenFormat,
  detectMalformedToken,
  sanitizeToken
};

export default TokenValidator;
