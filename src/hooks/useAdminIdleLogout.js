import { useEffect, useRef } from 'react';
import { adminLastActivityStorageKey } from '@/constants/adminRoutes';

/** Tıklama + diğer etkileşimler (tarayıcı uyumluluğu) */
const EVENTS = ['click', 'mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

/**
 * Son aktivite zamanını localStorage’da tutar; süre aşımında onIdle çağrılır.
 * @param {object} opts
 * @param {boolean} opts.enabled
 * @param {string} [opts.userId] — oturum kullanıcı id (storage anahtarı)
 * @param {number} [opts.timeoutMs=30*60*1000]
 * @param {() => void | Promise<void>} opts.onIdle
 */
export function useAdminIdleLogout({ enabled, userId, timeoutMs = 30 * 60 * 1000, onIdle }) {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled || !userId) return undefined;

    const storageKey = adminLastActivityStorageKey(userId);
    let timer;
    let interval;
    let idleFired = false;

    const readLast = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const n = raw ? parseInt(raw, 10) : 0;
        return Number.isFinite(n) && n > 0 ? n : 0;
      } catch {
        return 0;
      }
    };

    const writeNow = () => {
      const t = Date.now();
      try {
        localStorage.setItem(storageKey, String(t));
      } catch {
        /* ignore quota */
      }
      return t;
    };

    const fireIdle = () => {
      if (idleFired) return;
      idleFired = true;
      const fn = onIdleRef.current;
      if (typeof fn === 'function') Promise.resolve(fn()).catch(() => {});
    };

    const bump = () => {
      writeNow();
      clearTimeout(timer);
      timer = setTimeout(fireIdle, timeoutMs);
    };

    const last = readLast();
    if (last && Date.now() - last > timeoutMs) {
      fireIdle();
      return undefined;
    }
    if (!last) writeNow();

    bump();

    EVENTS.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));

    interval = window.setInterval(() => {
      const stored = readLast();
      if (stored && Date.now() - stored > timeoutMs) fireIdle();
    }, 30_000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      EVENTS.forEach((ev) => window.removeEventListener(ev, bump));
    };
  }, [enabled, userId, timeoutMs]);
}
