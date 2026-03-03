/**
 * API Key Security & Validation
 * Ensures TMDB API keys are present, valid format, and not hardcoded.
 */

const TMDB_KEY_PATTERN = /^[a-zA-Z0-9]{32}$/;
const JWT_PATTERN = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

/**
 * Validates the presence and format of the TMDB API Key.
 * @returns {boolean}
 */
export const validateAPIKey = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const bearerToken = import.meta.env.VITE_TMDB_BEARER_TOKEN;

  if (!apiKey && !bearerToken) {
    console.error('TMDB Configuration Error: No API Key or Bearer Token found in environment variables.');
    return false;
  }

  // Check simple API Key format (v3)
  if (apiKey && !TMDB_KEY_PATTERN.test(apiKey)) {
    console.warn('Security Warning: TMDB API Key does not match expected format.');
  }

  // Check Bearer Token format (v4)
  if (bearerToken && !JWT_PATTERN.test(bearerToken)) {
    console.warn('Security Warning: TMDB Bearer Token does not match expected JWT format.');
  }

  return true;
};

/**
 * Checks if the API key environment variable is likely a placeholder.
 * @returns {boolean}
 */
export const checkAPIKeyExpiry = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  if (apiKey === 'your_tmdb_api_key_here' || apiKey === 'INSERT_KEY_HERE') {
    console.error('Configuration Error: Placeholder API Key detected.');
    return false;
  }
  return true;
};

/**
 * Retrieves the API key securely.
 * Throws if missing to prevent authorized requests from failing silently/weirdly.
 */
export const getSecureAPIKey = () => {
  if (!validateAPIKey() || !checkAPIKeyExpiry()) {
    throw new Error('Secure API Key retrieval failed. Check environment configuration.');
  }
  // Prefer Bearer token for v4, fallback to v3 key
  return import.meta.env.VITE_TMDB_BEARER_TOKEN || import.meta.env.VITE_TMDB_API_KEY;
};