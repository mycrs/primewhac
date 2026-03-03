
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { isSupabaseConfigured } from '@/utils/envValidator';

export const useSitemapManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSitemapPages = useCallback(async () => {
    setLoading(true);
    
    if (!isSupabaseConfigured()) {
        setPages([]);
        setLoading(false);
        return;
    }
    
    console.log("Fetching sitemap pages from Supabase...");
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'sitemap_pages')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.value) {
        setPages(data.value);
      } else {
        setPages([]);
      }
    } catch (error) {
      console.error('Error fetching sitemap pages:', error);
      toast({
        title: "Hata",
        description: "Site haritası verileri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSitemapPages();
  }, [fetchSitemapPages]);

  const saveToDatabase = async (newPages) => {
    if (!isSupabaseConfigured()) {
        toast({ title: "Demo Modu", description: "Veritabanına kaydedilemedi." });
        return false;
    }
    
    console.log("Saving sitemap pages to Supabase...");
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ key: 'sitemap_pages', value: newPages }, { onConflict: 'key' });

      if (error) throw error;
      setPages(newPages);
      return true;
    } catch (error) {
      console.error('Error saving sitemap pages:', error);
      toast({
        title: "Hata",
        description: "Değişiklikler kaydedilemedi.",
        variant: "destructive",
      });
      return false;
    }
  };

  const addSitemapPage = async (page) => {
    const newPage = {
      ...page,
      id: Date.now().toString(),
      lastmod: new Date().toISOString().split('T')[0]
    };
    const newPages = [...pages, newPage];
    const success = await saveToDatabase(newPages);
    if (success) {
      toast({ title: "Başarılı", description: "Sayfa site haritasına eklendi." });
    }
  };

  const updateSitemapPage = async (id, updatedData) => {
    const newPages = pages.map(p => 
      p.id === id ? { ...p, ...updatedData, lastmod: new Date().toISOString().split('T')[0] } : p
    );
    const success = await saveToDatabase(newPages);
    if (success) {
      toast({ title: "Başarılı", description: "Sayfa güncellendi." });
    }
  };

  const deleteSitemapPage = async (id) => {
    const newPages = pages.filter(p => p.id !== id);
    const success = await saveToDatabase(newPages);
    if (success) {
      toast({ title: "Başarılı", description: "Sayfa silindi." });
    }
  };

  return {
    pages,
    loading,
    addSitemapPage,
    updateSitemapPage,
    deleteSitemapPage,
    refresh: fetchSitemapPages
  };
};
