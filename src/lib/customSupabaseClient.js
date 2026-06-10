import { createClient } from '@supabase/supabase-js';

/** .env’de yanlışlıkla kalan boşluk / tırnak — "Failed to fetch" sık nedeni */
function cleanEnv(s) {
  if (s == null || typeof s !== 'string') return '';
  return s.trim().replace(/^["']|["']$/g, '');
}

const DEFAULT_URL = 'https://pkppewdtnuchwjtmulev.supabase.co';
const DEFAULT_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrcHBld2R0bnVjaHdqdG11bGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDIzMzIsImV4cCI6MjA2NjQ3ODMzMn0.P2KIzJHmDCPOHrWQymZJEjhg4opXKn8DBD6NDCsWshI';

/** Node betikleri (generate-sitemap vb.): import.meta.env yok; dotenv → process.env */
const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const nodeEnv =
  typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env
    ? globalThis.process.env
    : {};
const fromEnvUrl = cleanEnv(metaEnv.VITE_SUPABASE_URL || nodeEnv.VITE_SUPABASE_URL || '');
const fromEnvKey = cleanEnv(metaEnv.VITE_SUPABASE_ANON_KEY || nodeEnv.VITE_SUPABASE_ANON_KEY || '');

const supabaseUrl =
  fromEnvUrl && fromEnvUrl !== 'YOUR_SUPABASE_URL' ? fromEnvUrl.replace(/\/+$/, '') : DEFAULT_URL;
const supabaseAnonKey =
  fromEnvKey && fromEnvKey !== 'YOUR_SUPABASE_ANON_KEY' ? fromEnvKey : DEFAULT_ANON;

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
    storage: isBrowser ? window.localStorage : undefined,
  },
});

export default customSupabaseClient;
export { customSupabaseClient, customSupabaseClient as supabase };
