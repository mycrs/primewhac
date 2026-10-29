import { useState, useEffect, useMemo, useRef, startTransition } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { defaultData as staticDefaultData } from '@/data/defaultSiteData';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { normalizeIptvFlowDevicesData } from '@/constants/iptvFlowDevices';
import { withResolvedContactLogo } from '@/constants/brandAssets';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';
import { normalizeGlobalAlert } from '@/utils/normalizeGlobalAlert';
import { mergePackageQuizContent } from '@/utils/packageRecommendationQuiz';
import { normalizeContactSettings, parseSiteContentValue } from '@/utils/contactSettings';

export const SITE_DATA_CACHE_KEY = 'site_data_cache_v13';
const CACHE_KEY = SITE_DATA_CACHE_KEY;
/** Public site için Supabase kotasını korur; admin kaydı clearSiteDataCache ile anında tazeler. */
const CACHE_TTL_MS = 15 * 60 * 1000;
let siteDataFetchPromise = null;

export const SITE_DATA_REFRESH_EVENT = 'site_data_cache_cleared';

/** Admin panelinden iletişim kaydedilince cache temizle - site güncel veriyi çeksin */
export const clearSiteDataCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    window.dispatchEvent(new CustomEvent(SITE_DATA_REFRESH_EVENT));
  } catch (e) {
    console.error('Cache clear failed:', e);
  }
};

const getCachedData = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null; // Süresi dolmuşsa güncel veri için null
    // Eski cache'de boş packagesData olabilir - varsayılanla doldur
    if (data?.packagesData && (!data.packagesData.turkiye?.length) && (!data.packagesData.avrupa?.length)) {
      data.packagesData = {
        turkiye: staticDefaultData.packagesData?.turkiye || [],
        avrupa: staticDefaultData.packagesData?.avrupa || []
      };
    }
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

/**
 * @param {boolean} isAdminAuthenticated - admin işlemleri için (updateSiteContent)
 * @param {boolean} [enableSiteContentRealtime=false] - sadece /admin + oturum: site_content Realtime
 * @param {boolean} [skipFetch=false] - true: Supabase site_content çağrısı yok (ör. /admin-login — gereksiz hata toast’u)
 */
export const useSiteData = (isAdminAuthenticated, enableSiteContentRealtime = false, skipFetch = false) => {
  const [siteData, setSiteData] = useState(() => {
    const cached = getCachedData();
    const merged = cached ? { ...staticDefaultData, ...cached } : staticDefaultData;
    return withResolvedContactLogo(merged);
  });
  
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const { toast } = useToast();

  const fetchDataRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (skipFetch) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

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

        if (!enableSiteContentRealtime) {
          const cached = getCachedData();
          if (cached) {
            if (isMounted) {
              setSiteData(withResolvedContactLogo({ ...staticDefaultData, ...cached }));
              setLoading(false);
            }
            return;
          }
        }

        console.log("Fetching site data from Supabase...");
        if (!siteDataFetchPromise) {
          siteDataFetchPromise = executeSupabaseQuery(
            () => supabase.from('site_content').select('key, value'),
            { retries: 2, context: 'fetch_site_data', fallback: [], timeoutMs: 20000 }
          ).finally(() => {
            siteDataFetchPromise = null;
          });
        }
        const { data, error, isFallback } = await siteDataFetchPromise;
        
        if (error && isFallback) {
           setErrorState(null);
           console.error("Site data fetch failed, using fallback:", error);
           showPublicMaintenanceToastOnce(toast);
        }

        if (isMounted) {
          let mergedData = { ...staticDefaultData };

          if (data && Array.isArray(data) && data.length > 0) {
            const dataMap = data.reduce((acc, item) => {
              try {
                let val = parseSiteContentValue(item.value);
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

            if (dataMap.team_logos && Array.isArray(dataMap.team_logos.entries)) {
              dataMap.team_logos = {
                ...dataMap.team_logos,
                entries: dataMap.team_logos.entries.map((e) => ({
                  ...e,
                  url: e?.url ? DomainMigrationManager.updateUrl(e.url) : e.url,
                })),
              };
            }

            mergedData = { ...mergedData, ...dataMap };

            ['siteTexts', 'heroData', 'contactData', 'contact_info', 'faqData', 'blog_seo_settings', 'sitemap_settings', 'videos'].forEach(key => {
               if (dataMap[key] && staticDefaultData[key]) {
                   mergedData[key] = { ...staticDefaultData[key], ...dataMap[key] };
               }
            });
            if (dataMap.packagesPageContent && staticDefaultData.packagesPageContent) {
              mergedData.packagesPageContent = {
                ...staticDefaultData.packagesPageContent,
                ...dataMap.packagesPageContent,
                defaults: { ...staticDefaultData.packagesPageContent.defaults, ...dataMap.packagesPageContent.defaults },
                page: { ...staticDefaultData.packagesPageContent.page, ...dataMap.packagesPageContent.page },
                tiers: { ...staticDefaultData.packagesPageContent.tiers, ...dataMap.packagesPageContent.tiers },
                regions: { ...staticDefaultData.packagesPageContent.regions, ...dataMap.packagesPageContent.regions },
                seo: { ...staticDefaultData.packagesPageContent.seo, ...dataMap.packagesPageContent.seo },
                packageQuiz: mergePackageQuizContent(dataMap.packagesPageContent.packageQuiz),
              };
            }
            // packagesData: DB'den boş gelirse varsayılan paketleri kullan (bağlantı hatasında boş sayfa olmasın)
            if (dataMap.packagesData) {
              const fromDb = dataMap.packagesData;
              mergedData.packagesData = {
                turkiye: (fromDb.turkiye && fromDb.turkiye.length > 0) ? fromDb.turkiye : (staticDefaultData.packagesData?.turkiye || []),
                avrupa: (fromDb.avrupa && fromDb.avrupa.length > 0) ? fromDb.avrupa : (staticDefaultData.packagesData?.avrupa || [])
              };
            }
            // İletişim Bilgileri: contact_info is canonical; contactData remains
            // a backwards-compatible mirror for older pages/components.
            mergedData.contactData = normalizeContactSettings({
              contactInfo: mergedData.contact_info,
              contactData: mergedData.contactData,
            });

            if (dataMap.iptvFlowDevicesData !== undefined) {
              const norm = normalizeIptvFlowDevicesData(dataMap.iptvFlowDevicesData);
              mergedData.iptvFlowDevicesData = norm ?? staticDefaultData.iptvFlowDevicesData;
            }
          }

          // Also normalize static/fallback data so the public runtime follows
          // the same boolean and legacy-key rules as the admin screen.
          mergedData.contactData = normalizeContactSettings({
            contactInfo: mergedData.contact_info,
            contactData: mergedData.contactData,
          });

          mergedData.globalAlert = normalizeGlobalAlert({
            ...staticDefaultData.globalAlert,
            ...mergedData.globalAlert,
          });
          mergedData = withResolvedContactLogo(mergedData);

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

    fetchDataRef.current = fetchData;
    fetchData();

    // Public kullanıcıda sekmeye dönüşte tekrar Supabase çağrısı yapma; admin realtime açıkken tazele.
    const handleVisibilityChange = () => {
      if (enableSiteContentRealtime && document.visibilityState === 'visible' && fetchDataRef.current) {
        fetchDataRef.current();
      }
    };
    const handleCacheCleared = () => {
      if (fetchDataRef.current) fetchDataRef.current();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener(SITE_DATA_REFRESH_EVENT, handleCacheCleared);

    let channel = null;
    if (enableSiteContentRealtime && isSupabaseConfigured()) {
      try {
        channel = supabase
          .channel('site_content_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
            if (!isMounted) return;
            const { new: newData, eventType } = payload;
            if ((eventType === 'INSERT' || eventType === 'UPDATE') && newData?.key) {
              let parsedValue = newData.value;
              parsedValue = parseSiteContentValue(newData.value);
              setSiteData((prev) => {
                let updated = { ...prev, [newData.key]: parsedValue };
                if (
                  (newData.key === 'contact_info' || newData.key === 'contactData') &&
                  parsedValue &&
                  typeof parsedValue === 'object'
                ) {
                  updated.contactData = normalizeContactSettings({
                    contactInfo: updated.contact_info,
                    contactData: updated.contactData,
                  });
                }
                updated = withResolvedContactLogo(updated);
                setCachedData(updated);
                return updated;
              });
            }
          })
          .subscribe();
      } catch (err) {
        console.warn('Failed to subscribe to site_content realtime:', err);
      }
    }

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener(SITE_DATA_REFRESH_EVENT, handleCacheCleared);
      if (channel) supabase.removeChannel(channel);
    };
  }, [toast, enableSiteContentRealtime, skipFetch]); 

  const updateSiteContent = async (key, value) => {
    if (!isAdminAuthenticated) {
        toast({ variant: "destructive", title: "Yetkisiz Erişim", description: "Bu işlemi gerçekleştirmek için giriş yapmalısınız." });
        return { success: false, error: "User not authenticated" };
    }
    
    setSiteData(prev => {
        const newData = withResolvedContactLogo({ ...prev, [key]: value });
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
          const errMsg = error?.message || error?.error_description || error?.details || JSON.stringify(error);
          toast({ variant: "destructive", title: "Hata", description: errMsg || "Değişiklikler kaydedilemedi." });
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
