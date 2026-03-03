
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useAdminCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAdminStatus = useCallback(async (email) => {
    if (!email) return { isAdmin: false, error: 'Email is required' };
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase
        .from('admin_users')
        .select('is_admin')
        .eq('email', email)
        .single();

      if (queryError) {
        if (queryError.code === 'PGRST116') {
          // No rows returned
          return { isAdmin: false, error: null };
        }
        throw queryError;
      }

      return { isAdmin: !!data?.is_admin, error: null };
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError(err.message);
      return { isAdmin: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkAdminStatus, loading, error };
};
