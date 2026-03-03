
import { validateJWT } from './jwtValidator';

/**
 * Middleware utility to intercept and validate auth payloads.
 */

export const sanitizeAuthData = (data) => {
  // Returns a safe clone of auth data without deep nested functions
  if (!data) return null;
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    return null;
  }
};

export const validateAuthOperation = (operation, data) => {
  const result = {
    isValid: true,
    errors: []
  };

  switch (operation) {
    case 'login':
    case 'refresh':
      if (data?.session?.access_token) {
        const tokenValidation = validateJWT(data.session.access_token);
        if (!tokenValidation.isValid) {
          result.isValid = false;
          result.errors.push(`Invalid token received during ${operation}: ${tokenValidation.errors.join(', ')}`);
        }
      } else {
        // Some operations might succeed but not return a session immediately, 
        // but if they DO return a session, it must be valid.
        if (data?.session) {
           result.isValid = false;
           result.errors.push(`Missing access_token in session during ${operation}`);
        }
      }
      break;
    
    default:
      // Unknown operation, let it pass but log
      console.warn(`[Auth Middleware] Validating unknown operation: ${operation}`);
      break;
  }

  if (!result.isValid) {
    console.error(`[Auth Middleware] Validation failed for operation '${operation}':`, result.errors);
  }

  return result;
};
