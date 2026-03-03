
import React from 'react';
import { motion } from 'framer-motion';
import { X, Bell, ExternalLink } from 'lucide-react';

const NotificationAlert = ({ notification, onClose, isDe = false }) => {
  if (!notification) return null;
  const linkLabel = isDe ? 'Hier klicken' : 'Tıklayınız';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto mb-3 rounded-2xl overflow-hidden relative z-[100] border border-purple-400/40 bg-slate-950/95 backdrop-blur-md animate-premium-glow hover:scale-[1.02] hover:brightness-110 transition-all duration-300 shadow-2xl"
      style={{ 
        background: 'radial-gradient(circle at top left, rgba(129, 140, 248, 0.55), transparent 55%), radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.45), transparent 55%), #020617',
        boxShadow: '0 24px 80px rgba(15, 23, 42, 0.9)',
        color: '#ffffff'
      }}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="px-5 py-4 flex items-center justify-between gap-4 relative z-10">
        
        {/* Logo Area - logo hemen görünsün, logosuz flash önlenir */}
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl shadow-inner border border-white/15 bg-black/30 overflow-hidden">
          <img 
            src="https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png" 
            alt="Primewatch.tv Logo" 
            className="w-full h-full object-contain animate-premium-pulse"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.nextElementSibling;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <Bell className="w-6 h-6 text-white hidden animate-premium-pulse" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          {notification.title && (
            <h4 className="text-base sm:text-lg font-bold tracking-wide leading-tight drop-shadow-md text-white">
              {notification.title}
            </h4>
          )}
          <p className={`text-sm sm:text-base font-medium opacity-95 leading-snug text-white/90 ${notification.title ? 'mt-0.5' : ''}`}>
            {notification.message}
          </p>
          {notification.link && (
            <div className="mt-2">
              <a
                href={notification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{linkLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose(notification.id)}
          className="flex-shrink-0 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 hover:bg-white/20 focus:ring-white/50 text-white/90 hover:text-white"
          aria-label="Close Notification"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationAlert;
