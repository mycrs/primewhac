import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { turkishChannels } from '@/data/turkishChannels';
import { CHANNEL_PUBLIC_COLUMNS } from '@/constants/publicSupabaseQueries';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';

const FALLBACK_CHANNELS = turkishChannels;

const PUBLIC_CHANNELS_CACHE_KEY = 'sb_pub_channels_v2';

/**
 * @param {{ enableRealtime?: boolean, skipInitialFetch?: boolean }} [options]
 * - Realtime yalnızca admin; public: dar kolon + is_active + session cache
 */
export const useChannelsRealtime = (options = {}) => {
  const { enableRealtime = false, skipInitialFetch = false } = options;
  const [channels, setChannels] = useState(() => {
    if (typeof window === 'undefined') return FALLBACK_CHANNELS;
    const cached = readSessionCache(PUBLIC_CHANNELS_CACHE_KEY);
    return Array.isArray(cached) && cached.length > 0 ? cached : FALLBACK_CHANNELS;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchChannels = useCallback(
    async (forceRefresh = false) => {
      if (skipInitialFetch && !forceRefresh) {
        return;
      }

      if (!enableRealtime && !forceRefresh) {
        const cached = readSessionCache(PUBLIC_CHANNELS_CACHE_KEY);
        if (Array.isArray(cached) && cached.length > 0) {
          setChannels(cached);
          setError(null);
          return;
        }
      }

      setLoading(true);
      setError(null);
      try {
        const q = enableRealtime
          ? supabase.from('channels').select('*').order('name')
          : supabase.from('channels').select(CHANNEL_PUBLIC_COLUMNS).eq('is_active', true).order('name');

        const { data, error: fetchError } = await q;

        if (fetchError) throw fetchError;
        const rows = (data && data.length > 0) ? data : FALLBACK_CHANNELS;
        setChannels(rows);
        if (!enableRealtime && rows.length > 0) {
          writeSessionCache(PUBLIC_CHANNELS_CACHE_KEY, rows);
        }
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError(null);
        setChannels(FALLBACK_CHANNELS);
        showPublicMaintenanceToastOnce(toast);
      } finally {
        setLoading(false);
      }
    },
    [toast, enableRealtime, skipInitialFetch]
  );

  useEffect(() => {
    fetchChannels(false);

    if (!enableRealtime) {
      return undefined;
    }

    const channelSubscription = supabase
      .channel('public:channels')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setChannels((prev) => {
            const exists = prev.find((c) => c.id === payload.new.id);
            if (exists) return prev;
            return [...prev, payload.new].sort((a, b) => a.name.localeCompare(b.name));
          });
        } else if (payload.eventType === 'UPDATE') {
          setChannels((prev) =>
            prev.map((c) => (c.id === payload.new.id ? payload.new : c)).sort((a, b) => a.name.localeCompare(b.name))
          );
        } else if (payload.eventType === 'DELETE') {
          setChannels((prev) => prev.filter((c) => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, [fetchChannels, enableRealtime]);

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
    refetch: () => fetchChannels(true),
    addChannel,
    updateChannel,
    deleteChannel,
  };
};
