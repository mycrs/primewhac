import { useState, useEffect, useMemo, startTransition } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { defaultData as staticDefaultData } from '@/data/defaultSiteData';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { isSupabaseConfigured } from '@/utils/envValidator';

const CACHE_KEY = 'site_data_cache_v11';
/** TR ve DE aynı güncel veriyi görsün: önbellek 2 dakikadan eskiyse kullanma, her zaman yeniden çek */
const CACHE_TTL_MS = 2 * 60 * 1000;

const getCachedData = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null; // Süresi dolmuşsa güncel veri için null
    return data;
  } catch (e) {
    console.error('Error reading cache:', e);
  }
  return null;
};

const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.error('Error setting cache:', e);
  }
};

export const useSiteData = (isAdminAuthenticated) => {
  const [siteData, setSiteData] = useState(() => {
    const cached = getCachedData();
    return cached ? { ...staticDefaultData, ...cached } : staticDefaultData;
  });
  
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorState(null);
        
        if (!isSupabaseConfigured()) {
          console.warn("Supabase is not configured. Using default static data.");
          if (isMounted) {
            setSiteData(staticDefaultData);
            setLoading(false);
          }
          return;
        }

        console.log("Fetching site data from Supabase...");
        const { data, error, isFallback, message } = await executeSupabaseQuery(
          () => supabase.from('site_content').select('key, value'),
          { retries: 3, context: 'fetch_site_data', fallback: [], timeoutMs: 30000 }
        );
        
        if (error && isFallback) {
           setErrorState(message || error.message);
           console.error("Site data fetch failed, using fallback:", error);
           toast({
               variant: "destructive",
               title: "Bağlantı Hatası",
               description: "Veri yüklenirken hata oluştu. Sayfa varsayılan ayarlarla gösteriliyor."
           });
        }

        if (isMounted) {
          let mergedData = { ...staticDefaultData };

          if (data && Array.isArray(data) && data.length > 0) {
            const dataMap = data.reduce((acc, item) => {
              try {
                let val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                if (typeof val === 'string') {
                  val = DomainMigrationManager.updateContent(val);
                } else if (typeof val === 'object' && val !== null) {
                   if (val.logoUrl) val.logoUrl = DomainMigrationManager.updateUrl(val.logoUrl);
                }
                acc[item.key] = val;
              } catch (e) {
                acc[item.key] = typeof item.value === 'string' ? DomainMigrationManager.updateContent(item.value) : item.value;
              }
              return acc;
            }, {});
            
            mergedData = { ...mergedData, ...dataMap };

            ['siteTexts', 'heroData', 'contactData', 'contact_info', 'faqData', 'blog_seo_settings', 'sitemap_settings'].forEach(key => {
               if (dataMap[key] && staticDefaultData[key]) {
                   mergedData[key] = { ...staticDefaultData[key], ...dataMap[key] };
               }
            });
          }
          
          startTransition(() => {
            setSiteData(mergedData);
          });
          
          setCachedData(mergedData);
        }
      } catch (e) {
        if (isMounted) setErrorState(e.message);
        console.error("Unexpected error in useSiteData:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    let channel = null;
    if (isSupabaseConfigured()) {
      try {
          channel = supabase.channel('site_content_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
                if (!isMounted) return;
                const { new: newData, eventType } = payload;
                if ((eventType === 'INSERT' || eventType === 'UPDATE') && newData?.key) {
                   let parsedValue = newData.value;
                   try { parsedValue = typeof newData.value === 'string' ? JSON.parse(newData.value) : newData.value; } catch(e) {}
                   setSiteData(prev => {
                      const updated = { ...prev, [newData.key]: parsedValue };
                      setCachedData(updated);
                      return updated;
                   });
                }
              })
            .subscribe();
      } catch (err) {
          console.warn("Failed to subscribe to realtime changes:", err);
      }
    }

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [toast]); 

  const updateSiteContent = async (key, value) => {
    if (!isAdminAuthenticated) {
        toast({ variant: "destructive", title: "Yetkisiz Erişim", description: "Bu işlemi gerçekleştirmek için giriş yapmalısınız." });
        return { success: false, error: "User not authenticated" };
    }
    
    setSiteData(prev => {
        const newData = { ...prev, [key]: value };
        setCachedData(newData);
        return newData;
    });

    if (!isSupabaseConfigured()) {
      toast({ title: "Demo Modu", description: "Değişiklikler yerel olarak kaydedildi (Supabase yapılandırılmamış)." });
      return { success: true };
    }

    try {
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
          toast({ variant: "destructive", title: "Oturum Hatası", description: "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın." });
          return { success: false, error: "Session expired" };
      }

      console.log(`Updating site data in Supabase for key: ${key}...`);
      const { error } = await executeSupabaseQuery(
          () => supabase.from('site_content').upsert({ key, value }, { onConflict: 'key' }),
          { retries: 3, context: `update_site_data_${key}`, timeoutMs: 15000 }
      );
          
      if (error) {
          toast({ variant: "destructive", title: "Hata", description: "Değişiklikler kaydedilemedi. Ağ bağlantınızı kontrol edin." });
          return { success: false, error };
      }
    } catch (err) {
      console.error("Error updating site content:", err);
      return { success: false, error: err };
    }
    
    return { success: true };
  };

  const setSiteDataWrapper = useMemo(() => {
    const wrapper = {
        updateSiteContent,
        setSiteTexts: (val) => updateSiteContent('siteTexts', val),
        setPrivacy_policy_content: (val) => updateSiteContent('privacy_policy_content', val),
        setTerms_of_service_content: (val) => updateSiteContent('terms_of_service_content', val),
        setCookie_policy_content: (val) => updateSiteContent('cookie_policy_content', val),
        setRefund_policy_content: (val) => updateSiteContent('refund_policy_content', val),
        setDisclaimer_content: (val) => updateSiteContent('disclaimer_content', val),
        setBlog_seo_settings: (val) => updateSiteContent('blog_seo_settings', val),
        setSitemap_settings: (val) => updateSiteContent('sitemap_settings', val),
        setContactInfo: (val) => updateSiteContent('contact_info', val),
    };

    for (const key in staticDefaultData) {
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (!wrapper[setterName]) {
          wrapper[setterName] = (val) => updateSiteContent(key, typeof val === 'function' ? val(siteData[key]) : val);
      }
    }
    return wrapper;
  }, [isAdminAuthenticated, siteData]);

  return { siteData, isFetching: loading, error: errorState, setSiteDataWrapper, updateSiteContent };
};