
import { validateSupabaseConfig } from './supabaseConfigValidator';

export const debugSupabaseConfig = () => {
  console.groupCollapsed('[Supabase Config Debug]');
  
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('URL defined:', !!url);
  console.log('KEY defined:', !!key);
  
  if (url) {
    console.log('URL format starts with https://:', url.startsWith('https://'));
    console.log('URL format ends with .supabase.co:', url.endsWith('.supabase.co') || url.includes('.supabase.co'));
    console.log('URL has trailing slash:', url.endsWith('/'));
    console.log('URL has whitespace:', url !== url.trim());
  }
  
  const validation = validateSupabaseConfig(url || '', key || '');
  console.log('Validation IsValid:', validation.isValid);
  
  if (validation.errors.length > 0) {
    console.error('Validation Errors:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('Validation Warnings:', validation.warnings);
  }
  
  console.groupEnd();
  
  return validation;
};
