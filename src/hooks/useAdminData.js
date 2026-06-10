
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { inferPackageTier } from '@/constants/packageTiers';
import { sortPackagesForDisplay } from '@/utils/buildPackagePayload';

export const useAdminData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Hata', description: 'Blog yazıları alınamadı.' });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deletePost = async (id) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Blog yazısı silindi.' });
      return true;
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Silme başarısız: ' + err.message });
      return false;
    }
  };

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const rows = (data || []).map((p) => ({
        ...p,
        tier: p.tier ?? inferPackageTier(p),
      }));
      return sortPackagesForDisplay(rows);
    } catch (err) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Hata', description: 'Paketler alınamadı.' });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deletePackage = async (id) => {
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Paket silindi.' });
      return true;
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Silme başarısız: ' + err.message });
      return false;
    }
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*');
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Hata', description: 'Ayarlar alınamadı.' });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateSettings = async (key, value) => {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Ayarlar güncellendi.' });
      return true;
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Güncelleme başarısız: ' + err.message });
      return false;
    }
  };

  return {
    loading,
    error,
    fetchBlogPosts,
    deletePost,
    fetchPackages,
    deletePackage,
    fetchSettings,
    updateSettings
  };
};
