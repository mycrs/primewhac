
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useNotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const fetchNotifications = useCallback(async (activeOnly = false) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (activeOnly) {
        query = query.eq('active', true);
      }
      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setNotifications(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotification = async (notificationData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    setLoading(true);
    try {
      const { data, error: insertError } = await supabase.from('notifications').insert([notificationData]).select();
      if (insertError) throw insertError;
      toast({ title: 'Başarılı', description: 'Bildirim eklendi.', variant: 'default' });
      await fetchNotifications();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error creating notification:', err);
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = async (id, updates) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase.from('notifications').update(updates).eq('id', id).select();
      if (updateError) throw updateError;
      toast({ title: 'Başarılı', description: 'Bildirim güncellendi.', variant: 'default' });
      await fetchNotifications();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error updating notification:', err);
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    setLoading(true);
    try {
      const { error: deleteError } = await supabase.from('notifications').delete().eq('id', id);
      if (deleteError) throw deleteError;
      toast({ title: 'Başarılı', description: 'Bildirim silindi.', variant: 'default' });
      await fetchNotifications();
      return { success: true };
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
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
