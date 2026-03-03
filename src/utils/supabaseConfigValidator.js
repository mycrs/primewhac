
import { sanitizeEnvVar } from './envDebugger';

export const validateSupabaseConfig = (rawUrl, rawKey) => {
  const url = sanitizeEnvVar(rawUrl);
  const key = sanitizeEnvVar(rawKey);

  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    details: {
      urlPresent: !!url,
      keyPresent: !!key,
      urlValid: false,
      keyValid: false,
      cleanedUrl: url,
      cleanedKey: key
    }
  };

  // URL Validation
  if (!url) {
    result.isValid = false;
    result.errors.push('VITE_SUPABASE_URL eksik (missing). Lütfen .env dosyanızı kontrol edin.');
  } else {
    result.details.urlPresent = true;
    let isUrlValid = true;

    if (!url.startsWith('https://')) {
      result.isValid = false;
      isUrlValid = false;
      result.errors.push('VITE_SUPABASE_URL "https://" ile başlamalıdır.');
    }
    if (!url.includes('.supabase.co')) {
      result.isValid = false;
      isUrlValid = false;
      result.errors.push('VITE_SUPABASE_URL ".supabase.co" içermelidir.');
    }
    if (url.endsWith('/')) {
      result.isValid = false;
      isUrlValid = false;
      result.errors.push('VITE_SUPABASE_URL sonunda bölü (/) işareti olmamalıdır.');
    }

    result.details.urlValid = isUrlValid;
  }

  // Key Validation
  if (!key) {
    result.isValid = false;
    result.errors.push('VITE_SUPABASE_ANON_KEY eksik (missing). Lütfen .env dosyanızı kontrol edin.');
  } else {
    result.details.keyPresent = true;
    let isKeyValid = true;

    if (key.length < 50) {
      result.warnings.push('VITE_SUPABASE_ANON_KEY çok kısa görünüyor. Tam JWT anahtarı olduğundan emin olun.');
    }
    
    const parts = key.split('.');
    if (parts.length !== 3) {
      result.warnings.push('VITE_SUPABASE_ANON_KEY geçerli bir JWT formatında (3 parçalı) görünmüyor.');
    }

    result.details.keyValid = isKeyValid;
  }

  if (import.meta.env.DEV) {
    console.log('[Supabase Config Validator] Validation Result:', result);
  }

  return result;
};

export const getConfigStatus = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return validateSupabaseConfig(url, key);
};
