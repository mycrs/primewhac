
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { isSupabaseConfigured } from '@/utils/envValidator';

export function useSetupPage() {
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    console.log(`[useSetupPage] Hook initialized. Supabase Configured: ${isSupabaseConfigured()}`);
    return () => { isMounted.current = false; };
  }, []);

  const fetchSetupPage = useCallback(async (forceRefresh = false) => {
    if (!isMounted.current) return;
    console.log(`[useSetupPage] fetchSetupPage called. Force refresh: ${forceRefresh}`);
    
    if (setupData && !forceRefresh) {
        console.log(`[useSetupPage] Returning cached setupData:`, setupData);
        return setupData;
    }

    if (!isSupabaseConfigured()) {
        console.warn("[useSetupPage] Supabase not configured. Using fallback.");
        setLoading(false);
        return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`[useSetupPage] Executing SELECT query on setup_pages`);
      const { data, error: fetchErr } = await supabase
        .from('setup_pages')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (fetchErr) {
        console.error(`[useSetupPage] SELECT query error:`, fetchErr);
        throw fetchErr;
      }

      console.log(`[useSetupPage] SELECT query successful. Data:`, data);
      if (isMounted.current) {
        setSetupData(data || {});
      }
      return data;
    } catch (err) {
      console.error("[useSetupPage] Exception in fetchSetupPage:", err);
      if (isMounted.current) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Veri Yükleme Hatası",
          description: "Kurulum verileri yüklenirken bir sorun oluştu: " + err.message
        });
      }
      return null;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [setupData, toast]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    console.log(`[useSetupPage] Subscribing to setup_pages realtime changes`);
    const channel = supabase
      .channel('setup_pages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'setup_pages'
        },
        (payload) => {
          console.log(`[useSetupPage] Realtime update received:`, payload);
          if (payload.new) {
             setSetupData(prev => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`[useSetupPage] Unsubscribing from setup_pages realtime changes`);
      supabase.removeChannel(channel);
    };
  }, []);

  const saveSetupPage = async (targetId, payload) => {
    if (targetId) {
      return await supabase.from('setup_pages').update(payload).eq('id', targetId).select().single();
    } else {
      return await supabase.from('setup_pages').insert(payload).select().single();
    }
  };

  const updateDeviceData = useCallback(async (columnName, deviceData) => {
    if (!isMounted.current) return { success: false };
    console.log(`[useSetupPage] updateDeviceData called. Column: ${columnName}`, deviceData);
    
    if (!isSupabaseConfigured()) {
       console.warn(`[useSetupPage] Demo Mode - Cannot save device data`);
       toast({ title: "Demo Modu", description: "Veriler kaydedilemedi, Supabase eksik." });
       return { success: false };
    }
    
    try {
      console.log(`[useSetupPage] Checking for existing row in setup_pages`);
      let { data: existingRow, error: fetchError } = await supabase
          .from('setup_pages')
          .select('id')
          .limit(1)
          .maybeSingle();

      if (fetchError) {
        console.error(`[useSetupPage] Fetch existing row error:`, fetchError);
        throw fetchError;
      }

      let targetId = existingRow?.id;
      const updatePayload = {
          [columnName]: deviceData,
          updated_at: new Date().toISOString()
      };

      console.log(`[useSetupPage] Executing UPSERT via saveSetupPage for ID ${targetId} with payload:`, updatePayload);
      const { data, error: saveErr } = await saveSetupPage(targetId, updatePayload);

      if (saveErr) {
        console.error(`[useSetupPage] UPSERT query error:`, saveErr);
        throw saveErr;
      }

      console.log(`[useSetupPage] UPSERT query successful. Updated data:`, data);
      if (isMounted.current) {
        setSetupData(data);
        toast({
          title: "Başarılı",
          description: "Ayarlar ve adımlar başarıyla kaydedildi.",
          className: "bg-green-600 text-white border-green-700"
        });
      }
      return { success: true, data };
    } catch (err) {
      console.error(`[useSetupPage] Error updating ${columnName}:`, err);
      if (isMounted.current) {
        toast({
          variant: "destructive",
          title: "Kaydetme Hatası",
          description: err.message || "Bilinmeyen bir hata oluştu."
        });
      }
      return { success: false, error: err };
    }
  }, [toast]);

  const updateGeneralSettings = useCallback(async (settingsData) => {
      if (!isMounted.current) return { success: false };
      console.log(`[useSetupPage] updateGeneralSettings called with payload:`, settingsData);
      
      if (!isSupabaseConfigured()) {
         console.warn(`[useSetupPage] Demo Mode - Cannot save general settings`);
         toast({ title: "Demo Modu", description: "Ayarlar kaydedilemedi, Supabase eksik." });
         return { success: false };
      }

      if (!settingsData.sayfa_baslik || settingsData.sayfa_baslik.length < 3) {
          console.warn(`[useSetupPage] Validation failed. Title is missing or too short.`);
          toast({ variant: "destructive", title: "Doğrulama Hatası", description: "Sayfa başlığı en az 3 karakter olmalıdır." });
          return { success: false };
      }

      try {
        console.log(`[useSetupPage] Checking for existing row in setup_pages`);
        let { data: existingRow } = await supabase.from('setup_pages').select('id').limit(1).maybeSingle();
        let targetId = existingRow?.id;
  
        const updatePayload = { ...settingsData, updated_at: new Date().toISOString() };
        console.log(`[useSetupPage] Executing UPSERT via saveSetupPage for ID ${targetId} with payload:`, updatePayload);

        const { data, error: saveErr } = await saveSetupPage(targetId, updatePayload);

        if (saveErr) {
            console.error(`[useSetupPage] UPDATE error for general settings:`, saveErr);
            throw saveErr;
        }

        console.log(`[useSetupPage] General settings UPDATE successful. Data:`, data);
        if (isMounted.current) {
            setSetupData(data);
            toast({
              title: "Başarılı",
              description: "Genel ayarlar güncellendi.",
              className: "bg-green-600 text-white border-green-700"
            });
        }
        return { success: true, data };
      } catch (err) {
        console.error("[useSetupPage] Error updating general settings exception:", err);
        if (isMounted.current) {
            toast({ variant: "destructive", title: "Hata", description: err.message });
        }
        return { success: false, error: err };
      }
  }, [toast]);

  return {
    setupData,
    loading,
    error,
    fetchSetupPage,
    saveSetupPage,
    updateDeviceData,
    updateGeneralSettings
  };
}
