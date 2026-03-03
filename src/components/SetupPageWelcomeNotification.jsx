import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, Info } from 'lucide-react';

const SetupPageWelcomeNotification = ({ 
  title = "Kuruluma Başlayın",
  message = "Cihazınızı seçin ve adımları takip edin. Mobil cihazlarda sağa kaydırarak ilerleyebilirsiniz.",
  autoDismiss = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a brief delay for better UX
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
    }, autoDismiss + 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [autoDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-24 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto max-w-md w-full bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-4 flex items-start gap-4 relative overflow-hidden group">
            {/* Glossy Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
            
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <h4 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                {title}
                <ChevronRight className="w-4 h-4 text-white/50" />
              </h4>
              <p className="text-blue-100/90 text-sm leading-snug">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetupPageWelcomeNotification;