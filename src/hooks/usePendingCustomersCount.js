import { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { fetchAdminPendingCustomersCount } from '@/utils/adminCustomersApi';

/** Admin sidebar badge: silinmemiş + status = beklemede */
export function usePendingCustomersCount() {
  const { user, isAdmin, session } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      setCount(0);
      return;
    }
    let cancelled = false;
    (async () => {
      const token = session?.access_token;
      const api = await fetchAdminPendingCustomersCount(token);
      if (cancelled) return;
      if (api.count != null) {
        setCount(api.count);
        return;
      }
      const { data, error } = await supabase.from('customers').select('*').eq('status', 'beklemede');
      if (cancelled) return;
      if (error) {
        setCount(0);
        return;
      }
      const n = (data || []).filter((r) => r.deleted_at == null || r.deleted_at === undefined).length;
      setCount(n);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, session?.access_token]);

  return count;
}
