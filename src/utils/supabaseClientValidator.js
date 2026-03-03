
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Client configuration validator
 */

/**
 * Verifies Supabase URL and ANON_KEY are present in the environment (or replaced by bundler).
 * @returns {Object} Validation result
 */
export const validateSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Note: customSupabaseClient.js uses string replacements like '__SUPABASE_URL__' 
  // We check if the environment variables themselves exist as a fallback for standard Vite setups.
  const isUrlValid = !!url && url !== 'YOUR_SUPABASE_URL';
  const isKeyValid = !!key && key !== 'YOUR_SUPABASE_ANON_KEY';

  return {
    isValid: isUrlValid && isKeyValid,
    errors: [
      ...(!isUrlValid ? ['Supabase URL is missing or default.'] : []),
      ...(!isKeyValid ? ['Supabase Anon Key is missing or default.'] : [])
    ]
  };
};

/**
 * Tests if the Supabase client can successfully connect to the server.
 * @returns {Promise<Object>} Connection test result
 */
export const testSupabaseConnection = async () => {
  try {
    // Lightweight call to check connection
    const { error } = await supabase.auth.getSession();
    if (error && error.status === 0) {
      return { ok: false, error: 'Network or CORS error. Client cannot reach Supabase.' };
    }
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

/**
 * Validates storage adapter (localStorage) availability.
 * @returns {Object} Validation result
 */
export const validateStorageAdapter = () => {
  try {
    const testKey = '__supabase_storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return { isValid: true, error: null };
  } catch (err) {
    return { isValid: false, error: 'localStorage is not available or accessible.' };
  }
};

/**
 * Ensures auth options are fundamentally viable.
 * @returns {Object} Validation result
 */
export const validateAuthOptions = () => {
  const storageValid = validateStorageAdapter();
  if (!storageValid.isValid) {
    return { isValid: false, errors: [storageValid.error] };
  }
  return { isValid: true, errors: [] };
};

export const ClientValidator = {
  validateSupabaseConfig,
  testSupabaseConnection,
  validateStorageAdapter,
  validateAuthOptions
};

export default ClientValidator;
