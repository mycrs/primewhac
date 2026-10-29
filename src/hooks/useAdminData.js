
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { inferPackageTier } from '@/constants/packageTiers';
import { sortPackagesForDisplay } from '@/utils/buildPackagePayload';

export const useAdminData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const describeSupabaseError = (err) => {
    if (!err) return 'Bilinmeyen veritabanı hatası.';
    const parts = [err.message, err.details, err.hint, err.code ? `Kod: ${err.code}` : '']
      .filter(Boolean)
      .map(String);
    return parts.join(' — ') || String(err);
  };

  const logSupabaseError = (context, err, extra = {}) => {
    console.error(`[useAdminData] ${context}`, {
      message: err?.message,
      details: err?.details,
      hint: err?.hint,
      code: err?.code,
      ...extra,
      error: err,
    });
  };

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
      logSupabaseError('fetchBlogPosts', err);
      toast({ variant: 'destructive', title: 'Hata', description: `Blog yazıları alınamadı: ${describeSupabaseError(err)}` });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = async (id) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Blog yazısı silindi.' });
      return true;
    } catch (err) {
      logSupabaseError('deletePost', err, { id });
      toast({ variant: 'destructive', title: 'Hata', description: 'Silme başarısız: ' + describeSupabaseError(err) });
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
      logSupabaseError('fetchPackages', err);
      toast({ variant: 'destructive', title: 'Hata', description: `Paketler alınamadı: ${describeSupabaseError(err)}` });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePackage = async (id) => {
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Paket silindi.' });
      return true;
    } catch (err) {
      logSupabaseError('deletePackage', err, { id });
      toast({ variant: 'destructive', title: 'Hata', description: 'Silme başarısız: ' + describeSupabaseError(err) });
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
      logSupabaseError('fetchSettings', err);
      toast({ variant: 'destructive', title: 'Hata', description: `Ayarlar alınamadı: ${describeSupabaseError(err)}` });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (key, value, { silent = false } = {}) => {
    try {
      const { data: savedRow, error } = await supabase
        .from('site_content')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select('key,value,updated_at')
        .maybeSingle();
      if (error) throw error;
      if (!savedRow?.key) throw new Error(`Veritabanı kaydı doğrulanamadı (anahtar: ${key}).`);
      if (!silent) {
        toast({ title: 'Başarılı', description: 'Ayarlar güncellendi.' });
      }
      return true;
    } catch (err) {
      setError(err.message);
      logSupabaseError('updateSettings', err, { key });
      toast({ variant: 'destructive', title: 'Hata', description: 'Güncelleme başarısız: ' + describeSupabaseError(err) });
      return false;
    }
  };

  /**
   * Save related settings together. The contact screen uses this to keep the
   * canonical contact_info row and the legacy contactData mirror in sync.
   */
  const updateSettingsMany = async (entries, { silent = false } = {}) => {
    const rows = (entries || []).filter((entry) => entry?.key);
    if (!rows.length) return false;

    try {
      const { data: savedRows, error } = await supabase
        .from('site_content')
        .upsert(
          rows.map(({ key, value }) => ({ key, value, updated_at: new Date().toISOString() })),
          { onConflict: 'key' },
        )
        .select('key,value,updated_at');
      if (error) throw error;
      const savedKeys = new Set((savedRows || []).map(({ key }) => key));
      const missingKeys = rows.map(({ key }) => key).filter((key) => !savedKeys.has(key));
      if (missingKeys.length) {
        throw new Error(`Veritabanı kaydı doğrulanamadı: ${missingKeys.join(', ')}.`);
      }

      if (!silent) {
        toast({ title: 'Başarılı', description: 'Ayarlar güncellendi.' });
      }
      return true;
    } catch (err) {
      setError(err.message);
      logSupabaseError('updateSettingsMany', err, { keys: rows.map(({ key }) => key) });
      toast({
        variant: 'destructive',
        title: 'Ayarlar kaydedilemedi',
        description: describeSupabaseError(err),
      });
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
    updateSettings,
    updateSettingsMany,
  };
};
