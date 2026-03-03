
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, Megaphone, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationBanner = () => {
  const { fetchNotifications } = useNotifications();
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load dismissed IDs from local storage
    try {
        const storedDismissed = localStorage.getItem('dismissedNotifications');
        if (storedDismissed) {
          setDismissedIds(JSON.parse(storedDismissed));
        }
    } catch (e) {
        console.warn("Could not read dismissed notifications from localStorage", e);
    }

    const loadNotifications = async () => {
      try {
          const data = await fetchNotifications(true); // Fetch active only (RLS enforces this too)
          setActiveNotifications(data || []);
      } catch (error) {
          console.error("Failed to load notifications for banner:", error);
      } finally {
          setIsLoaded(true);
      }
    };

    loadNotifications();
  }, [fetchNotifications]);

  const handleDismiss = (id) => {
    const updatedDismissed = [...dismissedIds, id];
    setDismissedIds(updatedDismissed);
    try {
        localStorage.setItem('dismissedNotifications', JSON.stringify(updatedDismissed));
    } catch (e) {
        console.warn("Could not save dismissed notifications to localStorage", e);
    }
  };

  if (!isLoaded) return null; // Don't show anything while loading to avoid layout shift

  // Filter out dismissed notifications and ensure they are explicitly active just in case
  const visibleNotifications = activeNotifications.filter(n => n.active && !dismissedIds.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  const getStyleProps = (color) => {
    switch (color) {
      case 'kırmızı': return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', icon: AlertTriangle };
      case 'sarı': return { bg: 'bg-yellow-500', text: 'text-black', border: 'border-yellow-600', icon: AlertTriangle };
      case 'yeşil': return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600', icon: CheckCircle2 };
      case 'mavi': return { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', icon: Info };
      case 'mor': return { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700', icon: Megaphone };
      default: return { bg: 'bg-slate-800', text: 'text-white', border: 'border-slate-700', icon: Info };
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center">
      <AnimatePresence>
        {visibleNotifications.map((notif) => {
          const style = getStyleProps(notif.color);
          const Icon = style.icon;

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50, height: 0, overflow: 'hidden' }}
              className={`w-full ${style.bg} ${style.text} ${style.border} border-b shadow-lg relative`}
            >
              <div className="container mx-auto px-4 py-3 pr-12 flex items-start sm:items-center justify-center gap-3 text-sm md:text-base font-medium">
                <Icon className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0 opacity-80" />
                <div className="text-center">
                  {notif.title && <span className="font-bold mr-2">{notif.title}:</span>}
                  <span>{notif.message}</span>
                  {notif.link && (
                    <a
                      href={notif.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-bold underline hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Tıklayınız
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDismiss(notif.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/20 transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBanner;
