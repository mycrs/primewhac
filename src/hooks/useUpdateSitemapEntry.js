
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useUpdateSitemapEntry = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sitemap_entries')
        .select('*')
        .order('language', { ascending: false })
        .order('priority', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching sitemap entries:', error);
      toast({
        title: "Error",
        description: "Failed to load sitemap entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getPublishedEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('sitemap_entries')
        .select('*')
        .eq('published', true);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching published entries:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (entry) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('sitemap_entries').insert([{
        ...entry,
        last_modified: new Date().toISOString()
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Entry added successfully." });
      await fetchEntries();
      return true;
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return false;
    }
  };

  const updateEntry = async (id, updatedData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('sitemap_entries')
        .update({ ...updatedData, last_modified: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Entry updated successfully." });
      await fetchEntries();
      return true;
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return false;
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return false;
    setLoading(true);
    try {
      const { error } = await supabase.from('sitemap_entries').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Entry deleted successfully." });
      await fetchEntries();
      return true;
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setLoading(false);
      return false;
    }
  };

  return { entries, loading, addEntry, updateEntry, deleteEntry, getPublishedEntries, refresh: fetchEntries };
};
