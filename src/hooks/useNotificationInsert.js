
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { createAdminNotification } from '@/utils/adminNotificationsApi';
import { formatNotificationDbError, formatNotificationApiError } from '@/utils/notificationRlsErrors';
import { insertNotificationRow } from '@/utils/notificationSupabasePersist';

export const useNotificationInsert = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const insertNotification = async (notificationData) => {
    setLoading(true);
    try {
      const token = session?.access_token;
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı.');

      const api = await createAdminNotification(token, notificationData);
      if (api.ok) {
        toast({ title: 'Başarılı', description: 'Duyuru başarıyla oluşturuldu.', variant: 'default' });
        return { success: true, data: api.data };
      }

      const { data, error } = await insertNotificationRow(notificationData);
      if (error) {
        throw new Error(formatNotificationDbError(error, formatNotificationApiError(api.error)));
      }

      toast({ title: 'Başarılı', description: 'Duyuru başarıyla oluşturuldu.', variant: 'default' });
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Insert notification error:', err);
      toast({
        title: 'Hata',
        description: err.message || 'Duyuru oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { insertNotification, loading };
};
