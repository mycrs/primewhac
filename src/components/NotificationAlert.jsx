
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getNotificationBannerTheme } from '@/utils/notificationBannerTheme';

const NotificationAlert = ({ notification, onClose, isDe = false }) => {
  if (!notification) return null;
  const linkLabel = isDe ? 'Hier klicken' : 'Tıklayınız';

  const theme = getNotificationBannerTheme(notification.theme);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-xs sm:max-w-sm mx-auto mb-3 rounded-2xl overflow-hidden relative z-[100] backdrop-blur-md hover:scale-[1.02] hover:brightness-110 transition-all duration-300 shadow-xl border ${theme.borderClass} ${theme.extraGlowClass} ${theme.key === 'campaign' ? 'animate-pulse' : ''}`}
      style={theme.containerStyle}
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-2.5 py-2 sm:px-3 sm:py-2.5 pr-9">
        <button
          type="button"
          onClick={() => onClose(notification.id)}
          className="absolute top-2 right-2 z-20 p-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 hover:bg-white/20 focus:ring-white/50 text-white/90 hover:text-white"
          aria-label="Close Notification"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-2">
          <div
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-xl shadow-inner border border-white/15 bg-black/30 text-sm leading-none select-none"
            aria-hidden
          >
            {theme.emoji}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center animate-fade-in">
            {notification.title && (
              <p className="text-sm font-semibold leading-snug tracking-wide drop-shadow-md text-white m-0">
                {notification.title}
              </p>
            )}
            <p
              className={`text-xs font-medium opacity-95 leading-snug text-white/90 ${notification.title ? 'mt-0.5' : ''}`}
            >
              {notification.message}
            </p>
            {notification.link && (
              <div className="w-full text-right mt-1">
                <a
                  href={notification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline underline-offset-2 text-white/90 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {linkLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationAlert;
