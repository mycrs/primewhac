import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { getNotificationBannerTheme } from '@/utils/notificationBannerTheme';

const NotificationPreview = ({ data }) => {
  const { title, message, link, theme: themeRaw } = data;
  const theme = getNotificationBannerTheme(themeRaw);

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Canlı Önizleme</h3>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative w-full overflow-hidden rounded-2xl border backdrop-blur-md p-4 ${theme.borderClass} ${theme.extraGlowClass} ${theme.key === 'campaign' ? 'animate-pulse' : ''}`}
        style={theme.containerStyle}
      >
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl border border-white/15 bg-black/30 text-2xl select-none"
            aria-hidden
          >
            {theme.emoji}
          </div>
          <div className="flex-1 pr-8">
            <h4 className="font-bold text-lg mb-1 text-white drop-shadow-md">
              {title || 'Bildirim Başlığı'}
            </h4>
            <p className="text-sm opacity-95 leading-relaxed text-white/90">
              {message || 'Kullanıcılara gösterilecek bildirim mesajı burada yer alacaktır.'}
            </p>
            {link && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-lg text-sm font-semibold text-white">
                  <span>Tıklayınız</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-white/20 transition-colors opacity-70 hover:opacity-100 text-white"
            tabIndex={-1}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPreview;
