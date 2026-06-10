
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  fetchAdminNotifications,
  createAdminNotification,
  updateAdminNotification,
  deleteAdminNotification,
} from '@/utils/adminNotificationsApi';
import { formatNotificationDbError, formatNotificationApiError } from '@/utils/notificationRlsErrors';
import { insertNotificationRow, updateNotificationRow } from '@/utils/notificationSupabasePersist';

export const useNotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const token = () => session?.access_token || null;

  const fetchNotifications = useCallback(async (activeOnly = false) => {
    setLoading(true);
    setError(null);
    try {
      const api = await fetchAdminNotifications(token());
      if (api.notifications) {
        const rows = activeOnly
          ? api.notifications.filter((n) => n.active)
          : api.notifications;
        setNotifications(rows);
        return rows;
      }

      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (activeOnly) query = query.eq('active', true);
      const { data, error: fetchError } = await query;
      if (fetchError) {
        throw new Error(formatNotificationDbError(fetchError, formatNotificationApiError(api.error)));
      }
      setNotifications(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Liste alınamadı');
      return [];
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  const createNotification = async (notificationData) => {
    setLoading(true);
    try {
      const api = await createAdminNotification(token(), notificationData);
      if (api.ok) {
        toast({ title: 'Başarılı', description: 'Duyuru eklendi.', variant: 'default' });
        await fetchNotifications();
        return { success: true, data: api.data };
      }

      const { data, error: insertError } = await insertNotificationRow(notificationData);
      if (insertError) throw new Error(formatNotificationDbError(insertError, formatNotificationApiError(api.error)));
      toast({ title: 'Başarılı', description: 'Duyuru eklendi.', variant: 'default' });
      await fetchNotifications();
      return { success: true, data: data?.[0] };
    } catch (err) {
      console.error('Error creating notification:', err);
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateNotification = async (id, updates, { silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const api = await updateAdminNotification(token(), id, updates);
      if (api.ok) {
        if (!silent) toast({ title: 'Başarılı', description: 'Duyuru güncellendi.', variant: 'default' });
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, ...updates, ...(api.data || {}) } : n)),
        );
        return { success: true, data: api.data };
      }

      const { data, error: updateError } = await updateNotificationRow(id, updates);
      if (updateError) throw new Error(formatNotificationDbError(updateError, formatNotificationApiError(api.error)));
      if (!silent) toast({ title: 'Başarılı', description: 'Duyuru güncellendi.', variant: 'default' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates, ...(data?.[0] || {}) } : n)),
      );
      return { success: true, data: data?.[0] };
    } catch (err) {
      console.error('Error updating notification:', err);
      toast({ title: 'Hata', description: err.message, variant: 'destructive' });
      return { success: false, error: err.message };
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    setLoading(true);
    try {
      const api = await deleteAdminNotification(token(), id);
      if (api.ok) {
        toast({ title: 'Başarılı', description: 'Duyuru silindi.', variant: 'default' });
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        return { success: true };
      }

      const { error: deleteError } = await supabase.from('notifications').delete().eq('id', id);
      if (deleteError) throw new Error(formatNotificationDbError(deleteError, formatNotificationApiError(api.error)));
      toast({ title: 'Başarılı', description: 'Duyuru silindi.', variant: 'default' });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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
    deleteNotification,
  };
};
