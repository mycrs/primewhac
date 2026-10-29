
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Hand, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import DeviceSelectionSection from './DeviceSelectionSection';
import AppDownloadButtons from './AppDownloadButtons';
import InstallationGuideRenderer from './InstallationGuideRenderer';
import InstallationGuideList from './InstallationGuideList';
import ImportantInfoSection from './ImportantInfoSection';
import ZeroPlayerShowcase from './ZeroPlayerShowcase';
import SmartersProShowcase from './SmartersProShowcase';
import QruzePlayerShowcase from './QruzePlayerShowcase';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useLocation } from 'react-router-dom';
import { smartTvFallbackStepsTr, smartTvFallbackStepsDe } from './guides/SmartTVGuide';
import { smartersFallbackStepsTr, smartersFallbackStepsDe } from './guides/SmartTVSmartersGuide';
import { resolveAndroidTvGuideSteps } from './guides/AndroidTVGuide';
import { buildIosAppSteps } from './guides/iosAppSteps';
import { buildMacAppSteps } from './guides/macAppSteps';
import { buildWindowsAppSteps } from './guides/windowsAppSteps';
import { buildTabletAppSteps } from './guides/tabletAppSteps';
import { resolveTabletGuideSteps } from './guides/tabletSteps';
import { buildAndroidPhoneAppSteps } from './guides/androidPhoneAppSteps';
import { mapDbStepsToGuide, resolveHubAppBySlug } from '@/utils/hubAppsConfig';
import { getSmartTvAppBySlug } from '@/data/smartTvApps';
import { getIosAppBySlug } from '@/data/iosApps';
import { getMacAppBySlug } from '@/data/macApps';
import { getAndroidAppBySlug } from '@/data/androidApps';
import { ANDROID_PHONE_APPS } from '@/data/androidPhoneApps';
import { WINDOWS_APPS } from '@/data/windowsApps';
import { TABLET_APPS } from '@/data/tabletApps';

function getGuideListTitle(effectiveDevice, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp, isDe) {
  if (smartTvApp) {
    return isDe ? `${smartTvApp.nameDe} — Anleitung` : `${smartTvApp.name} — Kurulum`;
  }
  if (iosApp) {
    return isDe ? `iPhone & iPad — ${iosApp.nameDe} Anleitung` : `iPhone & iPad — ${iosApp.name} Kurulum`;
  }
  if (macApp) {
    return isDe ? `Mac — ${macApp.nameDe} Anleitung` : `Mac — ${macApp.name} Kurulum`;
  }
  if (windowsApp) {
    return isDe ? `Windows — ${windowsApp.nameDe} Anleitung` : `Windows — ${windowsApp.name} Kurulum`;
  }
  if (tabletApp) {
    return isDe ? `Tablet — ${tabletApp.nameDe} Anleitung` : `Tablet — ${tabletApp.name} Kurulum`;
  }
  if (androidPhoneApp) {
    return isDe ? `${androidPhoneApp.pageName.de} Anleitung` : `${androidPhoneApp.pageName.tr} Kurulum`;
  }
  if (androidApp) {
    return isDe ? `${androidApp.pageName.de} Anleitung` : `${androidApp.pageName.tr} Kurulum`;
  }
  if (effectiveDevice === 'android-tv') {
    return isDe ? 'Android TV — Qruze Player Anleitung' : 'Android TV — Qruze Player Kurulum';
  }
  if (effectiveDevice === 'android-phone') {
    return isDe ? 'Android Smartphone — Qruze Player Anleitung' : 'Android Telefon — Qruze Player Kurulum';
  }
  if (effectiveDevice === 'windows') {
    return isDe ? 'Windows PC — App wählen' : 'Windows PC — Uygulama Seçin';
  }
  if (effectiveDevice === 'mac') {
    return isDe ? 'Mac — IPTV Anleitung' : 'Mac — IPTV Kurulum';
  }
  if (effectiveDevice === 'tablet') {
    return isDe ? 'Tablet — App wählen' : 'Tablet — Uygulama Seçin';
  }
  return isDe ? 'Installationsanleitung' : 'Kurulum Rehberi';
}

function getGuideListTheme(effectiveDevice, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp) {
  if (smartTvApp) return smartTvApp.appId === '0-player' ? 'amber' : 'violet';
  if (iosApp) return iosApp.theme || 'apple';
  if (macApp) return macApp.theme || 'apple';
  if (windowsApp) return windowsApp.theme || 'sky';
  if (tabletApp) return tabletApp.theme || 'orange';
  if (androidPhoneApp) return androidPhoneApp.theme || 'red';
  if (androidApp) return androidApp.theme || (androidApp.slug === 'android-tv' ? 'green' : 'red');
  if (effectiveDevice === 'android-phone') return 'red';
  if (effectiveDevice === 'android-tv') return 'green';
  if (effectiveDevice === 'windows') return 'sky';
  if (effectiveDevice === 'mac') return 'apple';
  if (effectiveDevice === 'tablet') return 'orange';
  if (effectiveDevice === 'ios') return 'apple';
  return 'neutral';
}

function resolveHubAppSteps(hubApp, config, isDe, fallbackBuilder) {
  const dbApp = config?.apps?.find((a) => a.slug === hubApp.slug);
  if (dbApp?.steps?.length) {
    return mapDbStepsToGuide(dbApp.steps, hubApp.theme);
  }
  if (hubApp.steps?.length) {
    return mapDbStepsToGuide(hubApp.steps, hubApp.theme);
  }
  return fallbackBuilder(isDe, hubApp.appId);
}

const SwipeInstructionOverlay = ({ onDismiss, isDe }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none md:hidden"
    >
      <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-full flex items-center gap-4 text-white shadow-xl border border-white/10">
        <Hand className="w-6 h-6 animate-pulse text-blue-400" />
        <span className="font-medium text-sm">
          {isDe ? "Wischen für Schritte" : "Adımlar için kaydırın"}
        </span>
        <div className="flex gap-1 text-blue-400">
          <ChevronLeft className="w-4 h-4 animate-[bounce_1s_infinite]" />
          <ChevronRight className="w-4 h-4 animate-[bounce_1s_infinite]" />
        </div>
      </div>
    </motion.div>
  );
};

const InstallationPageLayout = ({ siteData, pageContent, isLoading, forceDevice, hideDeviceSelector }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');
  const [selectedDevice, setSelectedDevice] = useState(forceDevice || 'android-tv');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [selectedDevice]);

  useEffect(() => {
    if (forceDevice) setSelectedDevice(forceDevice);
  }, [forceDevice]);

  useEffect(() => {
    const hintKey = isDe ? 'hasSeenSwipeHintDE' : 'hasSeenSwipeHintTR';
    const hasSeenHint = localStorage.getItem(hintKey);
    if (!hasSeenHint && window.innerWidth < 768) {
      setShowSwipeHint(true);
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
        localStorage.setItem(hintKey, 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isDe]);

  const getDbKey = (deviceId) => {
    const mapping = {
      'android-tv': 'android_tv_config',
      'ios': 'ios_config',
      'android-phone': 'android_phone_config',
      'android-phone-xc': 'android_phone_config',
      'android-phone-ibo': 'android_phone_config',
      'windows': 'windows_pc_config',
      'mac': 'mac_config',
      'smart-tv-0-player': 'smart_tv_config',
      'smart-tv-smarters-pro': 'smart_tv_config',
      'ios-next-plus': 'ios_config',
      'ios-castora': 'ios_config',
      'ios-9xtream': 'ios_config',
      'mac-next-plus': 'mac_config',
      'mac-castora': 'mac_config',
      'windows-next-plus': 'windows_pc_config',
      'windows-castora': 'windows_pc_config',
      'windows-ibo-player': 'windows_pc_config',
      'windows-abc': 'windows_pc_config',
      'windows-vs-player': 'windows_pc_config',
      'tablet-ibo-player': 'tablet_config',
      'tablet-abc': 'tablet_config',
      'tablet-vs-player': 'tablet_config',
      'tablet': 'tablet_config'
    };
    return mapping[deviceId] || 'android_tv_config';
  };
  
  const getDeviceTitle = (deviceId) => {
    const titles = isDe ? {
      'android-tv': 'Android TV IPTV Installationsanleitung',
      'ios': 'iOS und iPhone — App wählen',
      'tablet-vs-player': 'Tablet — VS Player Installation',
      'android-phone': 'Android Smartphone IPTV — App wählen',
      'android-phone-xc': 'Android Telefon — Qruze Player XC',
      'android-phone-ibo': 'Android Telefon — Qruze Player IBO',
      'windows': 'Windows PC IPTV — App wählen',
      'mac': 'Mac IPTV Installation',
      'smart-tv-0-player': 'Smart TV IPTV Installation mit 0 Player',
      'smart-tv-smarters-pro': 'Smart TV IPTV Installation mit IPTV Smarters Pro',
      'ios-next-plus': 'iOS — NEXT+ Installation',
      'ios-castora': 'iOS — CASTORA Installation',
      'ios-9xtream': 'iOS — 9Xtream Installation',
      'mac-next-plus': 'Mac — NEXT+ Installation',
      'mac-castora': 'Mac — CASTORA Installation',
      'windows-next-plus': 'Windows — NEXT+ Installation',
      'windows-castora': 'Windows — CASTORA Installation',
      'windows-ibo-player': 'Windows — IBO Player Pro Installation',
      'windows-abc': 'Windows — ABC IPTV Player Installation',
      'windows-vs-player': 'Windows — VS Player Installation',
      'tablet-ibo-player': 'Tablet — IBO Player Pro Installation',
      'tablet-abc': 'Tablet — ABC IPTV Player Installation',
      'tablet-vs-player': 'Tablet — VS Player Installation',
      'tablet': 'Tablet IPTV — App wählen'
    } : {
      'android-tv': 'Android TV IPTV Kurulum Kılavuzu',
      'ios': 'iOS ve iPhone — Uygulama Seçin',
      'tablet-vs-player': 'Tablet — VS Player Kurulumu',
      'android-phone': 'Android Telefon IPTV — Uygulama Seçin',
      'android-phone-xc': 'Android Telefon — Qruze Player XC Kurulumu',
      'android-phone-ibo': 'Android Telefon — Qruze Player IBO Kurulumu',
      'windows': 'Windows PC IPTV Kurulumu — Uygulama Seçin',
      'mac': 'Mac IPTV Kurulumu',
      'smart-tv-0-player': 'Smart TV IPTV Kurulumu — 0 Player',
      'smart-tv-smarters-pro': 'Smart TV IPTV Kurulumu — IPTV Smarters Pro',
      'ios-next-plus': 'iOS — NEXT+ Kurulumu',
      'ios-castora': 'iOS — CASTORA Kurulumu',
      'ios-9xtream': 'iOS — 9Xtream Kurulumu',
      'mac-next-plus': 'Mac — NEXT+ Kurulumu',
      'mac-castora': 'Mac — CASTORA Kurulumu',
      'windows-next-plus': 'Windows — NEXT+ Kurulumu',
      'windows-castora': 'Windows — CASTORA Kurulumu',
      'windows-ibo-player': 'Windows — IBO Player Pro Kurulumu',
      'windows-abc': 'Windows — ABC IPTV Player Kurulumu',
      'windows-vs-player': 'Windows — VS Player Kurulumu',
      'tablet-ibo-player': 'Tablet — IBO Player Pro Kurulumu',
      'tablet-abc': 'Tablet — ABC IPTV Player Kurulumu',
      'tablet-vs-player': 'Tablet — VS Player Kurulumu',
      'tablet': 'Tablet IPTV Kurulumu — Uygulama Seçin'
    };
    return titles[deviceId] || (isDe ? 'Geräteinstallation' : 'Cihaz Kurulumu');
  };

  const effectiveDevice = forceDevice || selectedDevice;
  const smartTvApp = useMemo(() => getSmartTvAppBySlug(effectiveDevice), [effectiveDevice]);
  const iosApp = useMemo(() => getIosAppBySlug(effectiveDevice), [effectiveDevice]);
  const macApp = useMemo(() => getMacAppBySlug(effectiveDevice), [effectiveDevice]);
  const windowsApp = useMemo(
    () => resolveHubAppBySlug(effectiveDevice, pageContent?.windows_pc_config, WINDOWS_APPS),
    [effectiveDevice, pageContent],
  );
  const tabletApp = useMemo(
    () => resolveHubAppBySlug(effectiveDevice, pageContent?.tablet_config, TABLET_APPS),
    [effectiveDevice, pageContent],
  );
  const androidPhoneApp = useMemo(
    () => resolveHubAppBySlug(effectiveDevice, pageContent?.android_phone_config, ANDROID_PHONE_APPS),
    [effectiveDevice, pageContent],
  );
  const androidApp = useMemo(() => getAndroidAppBySlug(effectiveDevice), [effectiveDevice]);
  const usesGuideList = Boolean(
    smartTvApp
    || iosApp
    || macApp
    || windowsApp
    || tabletApp
    || androidPhoneApp
    || androidApp
    || effectiveDevice === 'android-tv'
  );
  const usesAppGuideLayout = Boolean(iosApp || macApp || windowsApp || tabletApp || androidPhoneApp);

  const currentConfig = useMemo(() => {
     if (!pageContent) return null;
     const key = getDbKey(effectiveDevice);
     const config = pageContent[key] || {};
     const title = (smartTvApp || iosApp || macApp || windowsApp || tabletApp || androidPhoneApp || androidApp) ? getDeviceTitle(effectiveDevice) : (config.title || getDeviceTitle(effectiveDevice));
     return { ...config, title };
  }, [pageContent, effectiveDevice, isDe, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp]);

  const steps = useMemo(() => {
    if (smartTvApp) {
      if (smartTvApp.appId === '0-player') return isDe ? smartTvFallbackStepsDe : smartTvFallbackStepsTr;
      if (smartTvApp.appId === 'smarters-pro') return isDe ? smartersFallbackStepsDe : smartersFallbackStepsTr;
      return [];
    }

    if (androidPhoneApp) {
      const key = getDbKey(effectiveDevice);
      const config = pageContent?.[key] || currentConfig;
      return resolveHubAppSteps(androidPhoneApp, config, isDe, buildAndroidPhoneAppSteps);
    }

    if (androidApp) {
      const key = getDbKey(effectiveDevice);
      const config = pageContent?.[key] || currentConfig;
      return resolveAndroidTvGuideSteps(config?.steps, isDe);
    }

    if (iosApp) {
      return buildIosAppSteps(isDe, iosApp.appId);
    }

    if (macApp) {
      return buildMacAppSteps(isDe, macApp.appId);
    }

    if (windowsApp) {
      const key = getDbKey(effectiveDevice);
      const config = pageContent?.[key] || currentConfig;
      return resolveHubAppSteps(windowsApp, config, isDe, buildWindowsAppSteps);
    }

    if (tabletApp) {
      const key = getDbKey(effectiveDevice);
      const config = pageContent?.[key] || currentConfig;
      return resolveHubAppSteps(tabletApp, config, isDe, buildTabletAppSteps);
    }

    if (effectiveDevice === 'tablet') {
      const key = getDbKey(effectiveDevice);
      const config = pageContent?.[key] || currentConfig;
      return resolveTabletGuideSteps(config?.steps, isDe);
    }

    if (!pageContent) return [];
    const key = getDbKey(effectiveDevice);
    const config = pageContent[key] || currentConfig;
    return config?.steps || [];
  }, [pageContent, effectiveDevice, currentConfig, isDe, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [currentStepIndex, steps.length]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [currentStepIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    if (showSwipeHint) setShowSwipeHint(false);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  const configForDevice = useMemo(() => {
    if (!pageContent) return currentConfig;
    const key = getDbKey(effectiveDevice);
    return pageContent[key] || currentConfig;
  }, [pageContent, effectiveDevice, currentConfig]);

  const appLinks = useMemo(() => {
    if (smartTvApp) {
      return [{
        id: `${smartTvApp.appId}-official`,
        app_name: isDe ? smartTvApp.nameDe : smartTvApp.name,
        app_url: smartTvApp.officialUrl,
      }];
    }

    if (iosApp) {
      return [{
        id: `${iosApp.appId}-appstore`,
        app_name: isDe ? iosApp.nameDe : iosApp.name,
        app_url: iosApp.officialUrl,
      }];
    }

    if (macApp) {
      return [{
        id: `${macApp.appId}-official`,
        app_name: isDe ? macApp.nameDe : macApp.name,
        app_url: macApp.officialUrl,
      }];
    }

    if (windowsApp) {
      return [{
        id: `${windowsApp.appId}-store`,
        app_name: isDe ? windowsApp.nameDe : windowsApp.name,
        app_url: windowsApp.officialUrl,
      }];
    }

    if (tabletApp) {
      return [{
        id: `${tabletApp.appId}-store`,
        app_name: isDe ? tabletApp.nameDe : tabletApp.name,
        app_url: tabletApp.officialUrl,
      }];
    }

    if (androidPhoneApp) {
      const cfg = configForDevice || currentConfig;
      if (Array.isArray(cfg?.app_links) && cfg.app_links.length > 0) {
        return cfg.app_links;
      }
      if (cfg?.download_url) {
        return [{
          id: `${androidPhoneApp.appId}-apk`,
          app_name: isDe ? `${androidPhoneApp.nameDe} APK` : `${androidPhoneApp.name} APK`,
          app_url: cfg.download_url,
        }];
      }
      return [];
    }

    if (androidApp) {
      const cfg = configForDevice || currentConfig;
      if (Array.isArray(cfg?.app_links) && cfg.app_links.length > 0) {
        return cfg.app_links;
      }
      if (cfg?.download_url) {
        return [{
          id: `${androidApp.appId}-apk`,
          app_name: isDe ? `${androidApp.nameDe} APK` : `${androidApp.name} APK`,
          app_url: cfg.download_url,
        }];
      }
      return [];
    }

    const cfg = configForDevice || currentConfig;
    if (!cfg) return [];
    if (Array.isArray(cfg.app_links) && cfg.app_links.length > 0) {
      return cfg.app_links;
    }
    if (cfg.download_url) {
      return [{
        id: 'legacy-link',
        app_name: isDe ? 'App herunterladen' : 'Uygulamayı İndir',
        app_url: cfg.download_url
      }];
    }
    return [];
  }, [configForDevice, currentConfig, isDe, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp]);
  return (
      <ErrorBoundary>
        <div className="relative w-full" onTouchStart={smartTvApp ? undefined : onTouchStart} onTouchMove={smartTvApp ? undefined : onTouchMove} onTouchEnd={smartTvApp ? undefined : onTouchEnd}>
          
          {/* Device Selection Wrapper - gizlenebilir (cihaz sayfasında) */}
          {!hideDeviceSelector && (
            <div className="relative z-20 mb-12 w-full">
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-slate-800 p-2">
                  <DeviceSelectionSection 
                    selectedDevice={selectedDevice} 
                    onSelect={setSelectedDevice} 
                  />
              </div>
            </div>
          )}
          
          {/* Main Content Area */}
          {isLoading ? (
             <div className="w-full py-24 flex justify-center items-center">
                 <Loader2 className="w-12 h-12 text-primary animate-spin" />
             </div>
          ) : !currentConfig ? (
              <div className="w-full py-20 text-center">
                <div className="bg-[#0a0a0a]/50 backdrop-blur-md border border-slate-800 rounded-3xl p-12 shadow-2xl">
                  <AlertCircle className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {isDe ? "Inhalt nicht gefunden" : "İçerik bulunamadı"}
                  </h3>
                  <p className="text-slate-400 mb-8 text-lg">
                    {isDe 
                      ? "Für dieses Gerät wurde noch keine Installationsanleitung erstellt." 
                      : "Bu cihaz için henüz bir kurulum kılavuzu oluşturulmadı."}
                  </p>
                </div>
              </div>
          ) : (
              <div className="w-full pb-16">
                  {smartTvApp && smartTvApp.showcaseType === 'zero-player' && (
                    <ZeroPlayerShowcase isDe={isDe} variant={smartTvApp.storeVariant} />
                  )}
                  {smartTvApp && smartTvApp.showcaseType === 'smarters-pro' && (
                    <SmartersProShowcase isDe={isDe} />
                  )}
                  {androidApp?.slug === 'android-tv' && (
                    <QruzePlayerShowcase isDe={isDe} variant={androidApp.showcaseVariant} />
                  )}
                  {!usesAppGuideLayout && (
                  <div className="w-full mb-12">
                      <div className="text-center mb-10">
                          <h2 className="text-3xl font-bold text-white mb-4 sr-only md:not-sr-only md:block">
                            {smartTvApp || iosApp || macApp || windowsApp || tabletApp || androidApp ? getDeviceTitle(effectiveDevice) : (configForDevice?.title || currentConfig?.title)}
                          </h2>
                          <p className="text-slate-400 max-w-2xl mx-auto text-lg hidden md:block font-light">
                              {smartTvApp
                                ? (isDe
                                  ? `${smartTvApp.nameDe} aus dem TV-Store installieren, M3U oder Xtream Codes hinzufügen — fertig in wenigen Minuten.`
                                  : `TV mağazasından ${smartTvApp.name} indirin, M3U veya Xtream bilgilerinizi ekleyin — birkaç dakikada hazır.`)
                                : iosApp
                                  ? (isDe
                                    ? `${iosApp.nameDe} aus dem App Store installieren, M3U oder Xtream Codes hinzufügen — in wenigen Minuten bereit.`
                                    : `App Store'dan ${iosApp.name} indirin, M3U veya Xtream bilgilerinizi ekleyin — birkaç dakikada hazır.`)
                                : macApp
                                  ? (isDe
                                    ? `${macApp.nameDe} installieren, M3U oder Xtream Codes eingeben — in wenigen Minuten bereit.`
                                    : `${macApp.name} kurun, M3U veya Xtream bilgilerinizi girin — birkaç dakikada hazır.`)
                                  : windowsApp
                                    ? (isDe
                                      ? `${windowsApp.nameDe} aus dem Microsoft Store installieren, M3U oder Xtream Codes eingeben — in wenigen Minuten bereit.`
                                      : `Microsoft Store'dan ${windowsApp.name} indirin, M3U veya Xtream bilgilerinizi girin — birkaç dakikada hazır.`)
                                    : tabletApp
                                      ? (isDe
                                        ? `${tabletApp.nameDe} aus App Store oder Play Store installieren, M3U oder Xtream Codes eingeben — in wenigen Minuten bereit.`
                                        : `App Store veya Play Store'dan ${tabletApp.name} indirin, M3U veya Xtream bilgilerinizi girin — birkaç dakikada hazır.`)
                                      : androidApp
                                        ? (isDe
                                          ? `${androidApp.nameDe} per APK installieren — Link per WhatsApp/E-Mail, dann M3U oder Xtream Codes eingeben.`
                                          : `${androidApp.name} APK ile kurun — WhatsApp/e-posta linki, ardından M3U veya Xtream bilgilerinizi girin.`)
                                      : effectiveDevice === 'tablet'
                                          ? (isDe
                                            ? 'IBO Player Pro, ABC IPTV Player oder VS Player — passende App auf der Hub-Seite wählen.'
                                            : 'IBO Player Pro, ABC IPTV Player veya VS Player — hub sayfasından paketinize uygun uygulamayı seçin.')
                                          : ((configForDevice?.description || currentConfig?.description) || (isDe
                                        ? 'Sie können die erforderlichen Apps für die IPTV-Installation auf Ihren Android TV-, Google TV- und Fire TV Stick-Geräten herunterladen und Ihre Verbindung einfach hinzufügen.'
                                        : 'Android TV, Google TV ve Fire TV Stick cihazlarınıza IPTV kurulumu için gerekli uygulamaları indirebilir ve bağlantınızı kolayca ekleyebilirsiniz.'))}
                          </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
                          <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              className="bg-[#0a0a0a]/60 border border-slate-800 rounded-2xl p-6 flex items-start gap-4 shadow-lg hover:shadow-2xl transition-all duration-300"
                          >
                              <div className="p-3 bg-[#141414]/10 rounded-xl text-blue-400 shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-lg mb-2">
                                  {isDe ? "Wichtige Warnung" : "Önemli Uyarı"}
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {isDe 
                                      ? "Bei der Eingabe von Benutzername und Passwort ist die Groß-/Kleinschreibung wichtig. Stellen Sie sicher, dass Sie die korrekten Informationen eingegeben haben." 
                                      : "Kullanıcı adı ve şifre girerken büyük/küçük harf duyarlılığı önemlidir. Doğru bilgileri girdiğinizden emin olun."}
                                </p>
                              </div>
                          </motion.div>

                          <div className="flex flex-col justify-center w-full">
                              {appLinks.length > 0 && <AppDownloadButtons appLinks={appLinks} />}
                          </div>
                      </div>
                  </div>
                  )}

                  <section className="w-full mb-20 relative">
                      {!usesGuideList && (
                        <AnimatePresence>
                          {showSwipeHint && <SwipeInstructionOverlay isDe={isDe} />}
                        </AnimatePresence>
                      )}

                      {usesGuideList ? (
                        <InstallationGuideList
                          steps={steps}
                          isDe={isDe}
                          title={getGuideListTitle(effectiveDevice, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp, isDe)}
                          theme={getGuideListTheme(effectiveDevice, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp)}
                        />
                      ) : (
                        <InstallationGuideRenderer
                          steps={steps}
                          currentStepIndex={currentStepIndex}
                          onNext={handleNext}
                          onPrev={handlePrev}
                        />
                      )}
                  </section>

                  <div className="w-full mt-20">
                      <div className="container mx-auto">
                        <ImportantInfoSection selectedDevice={effectiveDevice} lang={isDe ? 'de' : 'tr'} />
                      </div>
                  </div>
              </div>
          )}
        </div>
      </ErrorBoundary>
  );
};

export default InstallationPageLayout;
