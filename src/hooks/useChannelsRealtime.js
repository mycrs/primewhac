
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useChannelsRealtime = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('channels')
        .select('*')
        .order('name');
        
      if (fetchError) throw fetchError;
      setChannels(data || []);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err.message || 'Kanallar yüklenirken bir hata oluştu.');
      toast({ 
        variant: 'destructive', 
        title: 'Bağlantı Hatası', 
        description: 'Kanallar yüklenemedi. ' + (err.message || '') 
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchChannels();

    const channelSubscription = supabase
      .channel('public:channels')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setChannels(prev => {
            const exists = prev.find(c => c.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new].sort((a, b) => a.name.localeCompare(b.name));
          });
        } else if (payload.eventType === 'UPDATE') {
          setChannels(prev => 
            prev.map(c => (c.id === payload.new.id ? payload.new : c))
                .sort((a, b) => a.name.localeCompare(b.name))
          );
        } else if (payload.eventType === 'DELETE') {
          setChannels(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, [fetchChannels]);

  const addChannel = async (channelData) => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert([channelData])
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Kanal başarıyla eklendi.' });
      return { success: true, data };
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: err.message });
      return { success: false, error: err.message };
    }
  };

  const updateChannel = async (id, channelData) => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .update(channelData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Kanal başarıyla güncellendi.' });
      return { success: true, data };
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: err.message });
      return { success: false, error: err.message };
    }
  };

  const deleteChannel = async (id) => {
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Başarılı', description: 'Kanal başarıyla silindi.' });
      return { success: true };
    } catch (err) {
      toast({ variant: 'destructive', title: 'Hata', description: err.message });
      return { success: false, error: err.message };
    }
  };

  return { 
    channels, 
    loading, 
    error, 
    refetch: fetchChannels,
    addChannel,
    updateChannel,
    deleteChannel
  };
};
