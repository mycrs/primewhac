import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'primewhac.teamLogoDisplay';

/** @returns {'logos' | 'initials'} */
function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'initials' ? 'initials' : 'logos';
  } catch {
    return 'logos';
  }
}

/**
 * Maç programı / maç detayında takım görselleri: logo veya isim kısaltması (harf rozeti).
 * Tercih localStorage’da saklanır.
 */
export function useTeamLogoDisplayMode() {
  const [mode, setMode] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const showLogos = mode === 'logos';
  const setShowLogos = useCallback((v) => setMode(v ? 'logos' : 'initials'), []);
  const toggle = useCallback(() => setMode((m) => (m === 'logos' ? 'initials' : 'logos')), []);

  return { mode, showLogos, setShowLogos, toggle };
}
