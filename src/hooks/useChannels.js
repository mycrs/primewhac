
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

// Simple in-memory cache to avoid redundant fetches across component remounts
let globalChannelsCache = null;
let globalChannelsPromise = null;

export const useChannels = () => {
  const [channels, setChannels] = useState(globalChannelsCache || []);
  const [loading, setLoading] = useState(!globalChannelsCache);
  const [error, setError] = useState(null);

  const fetchChannels = useCallback(async (forceRefresh = false) => {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && globalChannelsCache) {
      setChannels(globalChannelsCache);
      setLoading(false);
      return;
    }

    // If a fetch is already in progress, wait for it
    if (globalChannelsPromise && !forceRefresh) {
      try {
        const data = await globalChannelsPromise;
        setChannels(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    // Create a new fetch promise
    globalChannelsPromise = supabase
      .from('channels')
      .select('*')
      .eq('is_active', true)
      .order('name');

    try {
      const { data, error: fetchError } = await globalChannelsPromise;
      
      if (fetchError) throw fetchError;
      
      globalChannelsCache = data || [];
      setChannels(globalChannelsCache);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err.message || 'Kanallar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      globalChannelsPromise = null;
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return { 
    channels, 
    loading, 
    error, 
    refetch: () => fetchChannels(true) 
  };
};
