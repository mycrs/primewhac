
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationAlert from '@/components/NotificationAlert';
import { isTrustDamagingNotification } from '@/utils/trustBannerFilter';
import { filterScheduledNotifications } from '@/utils/notificationSchedule';

const NotificationBannerDisplay = () => {
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');
  const { fetchNotifications, loading, error } = useNotifications();
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [hasShownOnce, setHasShownOnce] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem('qruzetv_notification_shown') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const loadNotifications = async () => {
      const data = await fetchNotifications(true);
      if (isMounted && data) {
        const firstActive = filterScheduledNotifications(Array.isArray(data) ? data : [])
          .filter((n) => !isTrustDamagingNotification(n))
          .slice(0, 1);
        setActiveNotifications(firstActive);
      }
    };
    loadNotifications();
    return () => { isMounted = false; };
  }, [fetchNotifications]);

  useEffect(() => {
    if (activeNotifications.length === 0 || hasShownOnce) return;

    // Sadece ilk bildirim, tek seferde, 3 saniye sonra
    const notification = activeNotifications[0];
    if (dismissedIds.has(notification.id)) return;

    const timer = setTimeout(() => {
      setHasShownOnce(true);
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('qruzetv_notification_shown', 'true');
        }
      } catch {
        // ignore
      }
      setDisplayedNotifications(() => [notification]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeNotifications, dismissedIds, hasShownOnce]);

  const handleClose = (id) => {
    setDismissedIds(prev => new Set(prev).add(id));
    setDisplayedNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Graceful degradation: If error, return null so it doesn't break the UI
  if (error || displayedNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[150] px-4 pointer-events-none flex flex-col items-center gap-4">
      <AnimatePresence>
        {displayedNotifications.map(notification => (
          <div key={notification.id} className="pointer-events-auto w-full flex justify-center animate-slide-in-down">
            <NotificationAlert
              notification={notification}
              onClose={handleClose}
              isDe={isDe}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBannerDisplay;
