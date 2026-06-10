
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { resolveAdminAccess } from '@/utils/resolveAdminUser';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useAdminCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: authUser, isAdmin: authIsAdmin } = useAuth();

  const checkAdminStatus = useCallback(async (email) => {
    if (!email) return { isAdmin: false, error: 'Email is required' };

    const normalized = String(email).trim().toLowerCase();

    if (authIsAdmin && authUser?.email?.toLowerCase() === normalized) {
      return { isAdmin: true, error: null };
    }

    setLoading(true);
    setError(null);

    try {
      const user =
        authUser?.email?.toLowerCase() === normalized ? authUser : { email: email.trim() };
      const isAdmin = await resolveAdminAccess(supabase, user);
      return { isAdmin, error: null };
    } catch (err) {
      console.error('Error checking admin status:', err);
      setError(err.message);
      return { isAdmin: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authUser, authIsAdmin]);

  return { checkAdminStatus, loading, error };
};
