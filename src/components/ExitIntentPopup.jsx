import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FlaskConical, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'qruze_exit_intent_shown';
const COOKIE_DAYS = 1; // 1 gün boyunca tekrar gösterme

const TEXTS = {
  tr: {
    title: 'Ücretsiz IPTV Testi Denemek İster misiniz?',
    subtitle: 'Kaliteyi önce deneyin. Dakikalar içinde test bilgileriniz hazır.',
    testBtn: 'Ücretsiz Test',
    packagesBtn: 'Paketleri Gör',
    closeAria: 'Kapat',
  },
  de: {
    title: 'Kostenlosen IPTV-Test ausprobieren?',
    subtitle: 'Testen Sie zuerst die Qualität. Ihre Testdaten sind in wenigen Minuten bereit.',
    testBtn: 'Kostenlos testen',
    packagesBtn: 'Pakete ansehen',
    closeAria: 'Schließen',
  },
};

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { openTestModal } = useTestModal();
  const location = useLocation();
  const popupJustShownRef = useRef(false);
  const lastPathRef = useRef(location.pathname);
  const isDe = location.pathname.startsWith('/de');
  const t = isDe ? TEXTS.de : TEXTS.tr;

  const isExcluded = /^\/(admin|yonetim)(\/|$)/.test(location.pathname) ||
    location.pathname === '/packages' ||
    location.pathname === '/de/pakete';

  useEffect(() => {
    lastPathRef.current = location.pathname + (location.search || '');
  }, [location.pathname, location.search]);

  const wasShownRecently = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const { timestamp } = JSON.parse(stored);
      return Date.now() - timestamp < COOKIE_DAYS * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, []);

  const markAsShown = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: Date.now() }));
  }, []);

  const showPopup = useCallback(() => {
    if (wasShownRecently()) return;
    setIsVisible(true);
    markAsShown();
    popupJustShownRef.current = true;
    setTimeout(() => {
      popupJustShownRef.current = false;
    }, 2000);
  }, [wasShownRecently, markAsShown]);

  useEffect(() => {
    if (isExcluded) return;
    const timerId = setTimeout(() => {
      showPopup();
    }, 35000);
    return () => clearTimeout(timerId);
  }, [isExcluded, showPopup]);

  // Desktop: mouse leave to top
  useEffect(() => {
    if (isExcluded) return;

    let lastCheck = 0;
    const handleMouseMove = (e) => {
      if (Date.now() - lastCheck < 500) return;
      lastCheck = Date.now();
      if (e.clientY <= 10 && !wasShownRecently()) {
        setIsVisible(true);
        markAsShown();
      }
    };

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) return;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [location.pathname, isExcluded, wasShownRecently, markAsShown]);

  // Sekme değiştirme / uygulamadan çıkış (mobil): Gizliden geri gelince göster
  useEffect(() => {
    if (isExcluded) return;

    let hiddenAt = null;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenAt = Date.now();
      } else if (hiddenAt && Date.now() - hiddenAt > 5000 && !wasShownRecently()) {
        showPopup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExcluded, wasShownRecently, showPopup]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleTestClick = () => {
    openTestModal();
    handleClose();
  };

  const packagesPath = isDe ? '/de/pakete' : '/paketler';

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-h-[85vh] overflow-y-auto w-[calc(100%-2rem)] max-w-sm mx-auto bg-[#0a0a0a] border border-slate-700 rounded-xl shadow-2xl shadow-primary/20 z-[201] p-4 sm:p-5"
          >
            <button
              onClick={handleClose}
              className="absolute top-2.5 right-2.5 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label={t.closeAria}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="inline-flex p-2 rounded-full bg-primary/20 mb-3">
                <FlaskConical className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {t.title}
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                {t.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleTestClick}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm bg-primary hover:bg-primary text-white font-semibold transition-colors"
                >
                  <FlaskConical className="w-4 h-4" />
                  {t.testBtn}
                </button>
                <Link
                  to={packagesPath}
                  onClick={handleClose}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm border border-slate-600 text-slate-300 hover:bg-[#0a0a0a] hover:text-white font-semibold transition-colors"
                >
                  <Package className="w-4 h-4" />
                  {t.packagesBtn}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
