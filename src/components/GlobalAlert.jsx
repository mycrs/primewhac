import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isTrustDamagingBannerText } from '@/utils/trustBannerFilter';
import { normalizeGlobalAlert } from '@/utils/normalizeGlobalAlert';

const GlobalAlert = ({ alertData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const normalized = normalizeGlobalAlert(alertData);

  useEffect(() => {
    if (!normalized.enabled || isTrustDamagingBannerText(normalized.message)) {
      setIsVisible(false);
      return;
    }
    try {
      const dismissed = sessionStorage.getItem('globalAlertDismissed');
      setIsVisible(!dismissed);
    } catch (error) {
      console.error("Session storage'a erişilemedi:", error);
      setIsVisible(true);
    }
  }, [normalized.enabled, normalized.message]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('globalAlertDismissed', 'true');
    } catch (error) {
        console.error("Session storage'a yazılamadı:", error);
    }
    setIsVisible(false);
  };

  const alertStyles = {
    info: 'bg-[#141414]/80 border-blue-400',
    warning: 'bg-yellow-500/80 border-yellow-400',
    error: 'bg-red-500/80 border-red-400',
  };

  if (!alertData) return null;

  const content = normalized.link ? (
    <a href={normalized.link} className="text-sm md:text-base font-medium hover:underline" target="_blank" rel="noopener noreferrer">
      {normalized.message}
    </a>
  ) : (
    <p className="text-sm md:text-base font-medium">{normalized.message}</p>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[200] p-4 text-white border-b backdrop-blur-sm",
            alertStyles[normalized.type] || alertStyles.info
          )}
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
              {content}
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Uyarıyı kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalAlert;