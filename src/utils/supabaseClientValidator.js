
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Client configuration validator
 */

/**
 * Verifies Supabase URL and ANON_KEY are present in the environment (or replaced by bundler).
 * @returns {Object} Validation result
 */
function cleanEnv(s) {
  if (s == null || typeof s !== 'string') return '';
  return s.trim().replace(/^["']|["']$/g, '');
}

export const validateSupabaseConfig = () => {
  const url = cleanEnv(import.meta.env.VITE_SUPABASE_URL);
  const key = cleanEnv(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const isUrlValid =
    !!url &&
    url !== 'YOUR_SUPABASE_URL' &&
    url.startsWith('https://') &&
    url.includes('.supabase.co');
  const isKeyValid =
    !!key && key !== 'YOUR_SUPABASE_ANON_KEY' && key.split('.').length === 3;

  /** customSupabaseClient ile aynı gömülü proje — URL bu projeyse anon .env’de olmasa da istemci çalışır */
  const BUNDLED_PROJECT_REF = 'pkppewdtnuchwjtmulev';
  const refFromUrl = (() => {
    const m = String(url).match(/^https:\/\/([a-z0-9-]+)\.supabase\.co\/?$/i);
    return m ? m[1].toLowerCase() : null;
  })();

  // VITE yoksa customSupabaseClient gömülü varsayılanlarla açılır; uygulama yine de çalışsın
  if (!isUrlValid && !isKeyValid) {
    return { isValid: true, errors: [] };
  }

  // Sadece URL doğru, anon eksik/hatalı ama URL gömülü projeyle aynı → izin ver (anon kodda varsayılan)
  if (isUrlValid && !isKeyValid && refFromUrl === BUNDLED_PROJECT_REF) {
    return { isValid: true, errors: [] };
  }

  return {
    isValid: isUrlValid && isKeyValid,
    errors: [
      ...(!isUrlValid ? ['VITE_SUPABASE_URL eksik veya hatalı (.env, tırnak/boşluk olmadan https://....supabase.co).'] : []),
      ...(!isKeyValid
        ? [
            'VITE_SUPABASE_ANON_KEY eksik veya hatalı. Supabase → Project Settings → API → anon (public) anahtarını yapıştırın (eyJ ile başlayan uzun JWT). Başka bir proje URL’si kullanıyorsanız o projenin anon key’i zorunludur.',
          ]
        : []),
    ],
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
