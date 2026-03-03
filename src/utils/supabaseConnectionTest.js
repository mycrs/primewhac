
import { supabase } from '@/lib/customSupabaseClient';
import { errorLogger, ERROR_SEVERITY } from './errorLogger';

export const testSupabaseConnection = async () => {
  try {
    const start = performance.now();
    // Use a very light query to test connectivity
    const { error } = await supabase.from('site_content').select('id').limit(1);
    const duration = performance.now() - start;

    if (error) {
       // Table might not exist or RLS blocked, but connection worked
       if (error.code === '42P01' || error.code === '42501') {
         return { connected: true, duration, status: 'Connected (Table/RLS Error)', error: null };
       }
       throw error;
    }

    return { connected: true, duration, status: 'Healthy', error: null };
  } catch (error) {
    errorLogger.log(error, ERROR_SEVERITY.ERROR, { context: 'testSupabaseConnection' });
    return { connected: false, duration: null, status: 'Error', error: error.message };
  }
};

export const generateConnectionReport = async () => {
  const result = await testSupabaseConnection();
  return {
    timestamp: new Date().toISOString(),
    ...result
  };
};
