
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Hand, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import DeviceSelectionSection from './DeviceSelectionSection';
import AppDownloadButtons from './AppDownloadButtons';
import InstallationGuideRenderer from './InstallationGuideRenderer';
import ImportantInfoSection from './ImportantInfoSection';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useLocation } from 'react-router-dom';

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
      'windows': 'windows_pc_config',
      'mac': 'mac_config',
      'smart-tv': 'smart_tv_config',
      'tablet': 'tablet_config'
    };
    return mapping[deviceId] || 'android_tv_config';
  };
  
  const getDeviceTitle = (deviceId) => {
    const titles = isDe ? {
      'android-tv': 'Android TV IPTV Installationsanleitung',
      'ios': 'iOS und iPhone IPTV Installation',
      'android-phone': 'Android Smartphone IPTV Installation',
      'windows': 'Windows PC IPTV Installation',
      'mac': 'Mac IPTV Installation',
      'smart-tv': 'Smart TV IPTV Installation (Samsung/LG)',
      'tablet': 'Tablet IPTV Installation'
    } : {
      'android-tv': 'Android TV IPTV Kurulum Kılavuzu',
      'ios': 'iOS ve iPhone IPTV Kurulumu',
      'android-phone': 'Android Akıllı Telefon IPTV Kurulumu',
      'windows': 'Windows PC IPTV Kurulumu',
      'mac': 'Mac IPTV Kurulumu',
      'smart-tv': 'Smart TV IPTV Kurulumu (Samsung/LG)',
      'tablet': 'Tablet IPTV Kurulumu'
    };
    return titles[deviceId] || (isDe ? 'Geräteinstallation' : 'Cihaz Kurulumu');
  };

  const effectiveDevice = forceDevice || selectedDevice;

  const currentConfig = useMemo(() => {
     if (!pageContent) return null;
     const key = getDbKey(effectiveDevice);
     const config = pageContent[key] || {};
     return { ...config, title: config.title || getDeviceTitle(effectiveDevice) };
  }, [pageContent, effectiveDevice, isDe]);

  const steps = useMemo(() => {
    if (!pageContent) return [];
    const key = getDbKey(effectiveDevice);
    const config = pageContent[key] || currentConfig;
    return config?.steps || [];
  }, [pageContent, effectiveDevice, currentConfig]);

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
  }, [configForDevice, currentConfig, isDe]);
  
  return (
      <ErrorBoundary>
        <div className="relative w-full" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          
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
                  <div className="w-full mb-12">
                      <div className="text-center mb-10">
                          <h2 className="text-3xl font-bold text-white mb-4 sr-only md:not-sr-only md:block">{configForDevice?.title || currentConfig?.title}</h2>
                          <p className="text-slate-400 max-w-2xl mx-auto text-lg hidden md:block font-light">
                              {(configForDevice?.description || currentConfig?.description) || (isDe 
                                ? "Sie können die erforderlichen Apps für die IPTV-Installation auf Ihren Android TV-, Google TV- und Fire TV Stick-Geräten herunterladen und Ihre Verbindung einfach hinzufügen." 
                                : "Android TV, Google TV ve Fire TV Stick cihazlarınıza IPTV kurulumu için gerekli uygulamaları indirebilir ve bağlantınızı kolayca ekleyebilirsiniz.")}
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

                  <section className="w-full mb-20 relative">
                      <AnimatePresence>
                        {showSwipeHint && <SwipeInstructionOverlay isDe={isDe} />}
                      </AnimatePresence>
                      
                      <InstallationGuideRenderer 
                        steps={steps}
                        currentStepIndex={currentStepIndex}
                        onNext={handleNext}
                        onPrev={handlePrev}
                      />
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
