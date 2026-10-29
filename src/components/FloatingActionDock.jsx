import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useSiteData } from '@/hooks/useSiteData';
import {
  openSupportWhatsApp,
  openSupportTelegram,
  isWhatsAppEnabled,
  isTelegramEnabled,
  getFloatingActionsConfig,
} from '@/utils/supportChannel';

// Custom SVG Icons for WhatsApp and Telegram
const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.36 5L2 22l5.16-1.33A9.957 9.957 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.05c-1.63 0-3.14-.49-4.41-1.33l-.32-.21-3.06.79.82-2.98-.23-.34A8.04 8.04 0 014 12c0-4.41 3.59-8.05 8-8.05s8 3.64 8 8.05c0 4.42-3.59 8.05-8 8.05z" />
  </svg>
);

const TelegramIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const FloatingActionDock = () => {
  const location = useLocation();
  const isDe = location.pathname === '/de' || location.pathname.startsWith('/de/');
  const { siteData } = useSiteData();
  const contactData = siteData?.contactData || siteData?.contact_info || {};

  const floatingCfg = getFloatingActionsConfig({ siteData, contactData });
  if (floatingCfg.enabled === false) {
    return null;
  }

  const showWhatsApp =
    floatingCfg.show_whatsapp !== false &&
    isWhatsAppEnabled({ siteData, contactData });

  const showTelegram =
    floatingCfg.show_telegram !== false &&
    isTelegramEnabled({ siteData, contactData });

  // İkisi de kapalıysa hiçbir şey render etme
  if (!showWhatsApp && !showTelegram) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 select-none"
      role="region"
      aria-label={isDe ? 'Schnelle Kontaktmöglichkeiten' : 'Hızlı Destek Butonları'}
    >
      {/* WhatsApp Butonu */}
      {showWhatsApp && (
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => openSupportWhatsApp({ siteData, contactData })}
          className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.6)] border border-emerald-400/40 transition-all duration-200"
          aria-label={isDe ? 'WhatsApp-Support' : 'WhatsApp Destek Hattı'}
          title={isDe ? 'Über WhatsApp kontaktieren' : 'WhatsApp ile İletişime Geç'}
        >
          {/* Pulse Ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-[#0a0a0a]"></span>
          </span>

          <WhatsAppIcon className="w-6 h-6 md:w-7 md:h-7 shrink-0 drop-shadow" />
        </motion.button>
      )}

      {/* Telegram Butonu */}
      {showTelegram && (
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => openSupportTelegram({ siteData, contactData })}
          className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_4px_20px_rgba(14,165,233,0.4)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.6)] border border-sky-400/40 transition-all duration-200"
          aria-label={isDe ? 'Telegram-Support' : 'Telegram Destek Kanalı'}
          title={isDe ? 'Über Telegram kontaktieren' : 'Telegram ile İletişime Geç'}
        >
          {/* Pulse Ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-300 border-2 border-[#0a0a0a]"></span>
          </span>

          <TelegramIcon className="w-6 h-6 md:w-7 md:h-7 shrink-0 drop-shadow -translate-x-0.5" />
        </motion.button>
      )}
    </div>
  );
};

export default memo(FloatingActionDock);
