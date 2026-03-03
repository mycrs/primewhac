
import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useNotificationInsert = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { checkAdminStatus } = useAdminCheck();
  const { user } = useAuth();

  const insertNotification = async (notificationData) => {
    setLoading(true);
    try {
      if (!user?.email) {
        throw new Error('Kullanıcı oturumu bulunamadı.');
      }

      const { isAdmin, error: adminError } = await checkAdminStatus(user.email);
      
      if (adminError || !isAdmin) {
        throw new Error('Bu işlem için yönetici yetkiniz bulunmuyor.');
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select();

      if (error) {
        if (error.code === '42501') {
          throw new Error('RLS Politikası hatası: Yönetici yetkiniz reddedildi.');
        }
        throw error;
      }

      toast({
        title: 'Başarılı',
        description: 'Bildirim başarıyla oluşturuldu.',
        variant: 'default',
      });

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Insert notification error:', err);
      toast({
        title: 'Hata',
        description: err.message || 'Bildirim oluşturulurken bir hata oluştu.',
        variant: 'destructive',
      });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { insertNotification, loading };
};
