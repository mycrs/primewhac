
import { getConfigStatus } from './supabaseConfigValidator';

export const validateEnvironment = () => {
  const status = getConfigStatus();
  
  const warnings = [...status.warnings];
  if (!status.isValid) {
    warnings.push(...status.errors);
  }

  if (!status.isValid && import.meta.env.DEV) {
    console.error("❌ Environment configuration errors detected:\n", status.errors.join('\n'));
  } else if (warnings.length > 0 && import.meta.env.DEV) {
    console.warn("⚠️ Environment configuration warnings:\n", warnings.join('\n'));
  }

  return { isValid: status.isValid, warnings, errors: status.errors, details: status.details };
};

export const isSupabaseConfigured = () => {
  const status = getConfigStatus();
  
  if (import.meta.env.DEV) {
    const urlSet = status.details.urlPresent ? '[SET]' : '[MISSING]';
    const keySet = status.details.keyPresent ? '[SET]' : '[MISSING]';
    console.log(`[EnvValidator] Supabase Config Status: URL=${urlSet}, KEY=${keySet}, Valid=${status.isValid}`);
  }
  
  return status.isValid;
};
