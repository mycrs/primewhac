
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();

  const fetchNotifications = useCallback(async (activeOnly = false) => {
    setLoading(true);
    setError(null);
    
    const queryFn = async () => {
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (activeOnly) {
        query = query.eq('active', true);
      }
      return await query;
    };

    const result = await executeSupabaseQuery(queryFn, {
      retries: 3,
      backoffMs: 1000,
      context: 'fetchNotifications',
      fallback: [],
      timeoutMs: 10000
    });

    setLoading(false);
    
    if (result.error) {
      setError(result.message);
      if (!activeOnly && isAdmin) {
        toast({ 
          variant: "destructive", 
          title: "İşlem Başarısız", 
          description: result.message 
        });
      }
    } else {
      setNotifications(result.data || []);
    }
    
    return result.data || [];
  }, [toast, isAdmin, user]);

  const createNotification = async (notificationData) => {
    if (!isAdmin) {
      toast({ variant: "destructive", title: "Hata", description: "Yetkisiz erişim." });
      return { success: false, data: null };
    }

    setLoading(true);
    const queryFn = async () => await supabase.from('notifications').insert([notificationData]).select();
    
    const result = await executeSupabaseQuery(queryFn, {
      retries: 1, // Don't retry inserts too many times
      context: 'createNotification'
    });
    
    setLoading(false);

    if (result.error) {
      toast({ variant: "destructive", title: "Hata", description: result.message });
      return { success: false, data: null };
    }

    toast({ 
      title: "Başarılı", 
      description: "Bildirim başarıyla oluşturuldu.",
      className: "bg-green-600 border-none text-white"
    });
    await fetchNotifications();
    return { success: true, data: result.data?.[0] };
  };

  const updateNotification = async (id, updates) => {
    if (!isAdmin) {
      toast({ variant: "destructive", title: "Hata", description: "Yetkisiz erişim." });
      return { success: false, data: null };
    }

    setLoading(true);
    const queryFn = async () => await supabase.from('notifications').update(updates).eq('id', id).select();
    
    const result = await executeSupabaseQuery(queryFn, { context: 'updateNotification' });
    setLoading(false);

    if (result.error || (!result.data || result.data.length === 0)) {
      toast({ variant: "destructive", title: "Hata", description: result.error ? result.message : "Güncelleme başarısız." });
      return { success: false, data: null };
    }

    toast({ 
      title: "Başarılı", 
      description: "Bildirim başarıyla güncellendi.",
      className: "bg-green-600 border-none text-white"
    });
    await fetchNotifications();
    return { success: true, data: result.data[0] };
  };

  const deleteNotification = async (id) => {
    if (!isAdmin) {
      toast({ variant: "destructive", title: "Hata", description: "Yetkisiz erişim." });
      return { success: false };
    }

    setLoading(true);
    const queryFn = async () => await supabase.from('notifications').delete().eq('id', id);
    
    const result = await executeSupabaseQuery(queryFn, { context: 'deleteNotification' });
    setLoading(false);

    if (result.error) {
      toast({ variant: "destructive", title: "Hata", description: result.message });
      return { success: false };
    }

    toast({ 
      title: "Başarılı", 
      description: "Bildirim başarıyla silindi.",
      className: "bg-green-600 border-none text-white"
    });
    setNotifications(prev => prev.filter(n => n.id !== id));
    return { success: true };
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification
  };
};
