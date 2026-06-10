import { differenceInCalendarDays, startOfDay } from 'date-fns';

/** @param {string} ymd - YYYY-MM-DD */
export function parseYmd(ymd) {
  if (!ymd || typeof ymd !== 'string') return null;
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** @param {Date} d */
export function toYmd(d) {
  if (!d || !(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

export function addDaysYmd(ymd, days) {
  const d = parseYmd(ymd);
  if (!d) return null;
  const n = new Date(d);
  n.setDate(n.getDate() + Number(days || 0));
  return toYmd(n);
}

/** TR: 15.01.2026 */
export function formatTrDate(ymd) {
  const d = parseYmd(ymd);
  if (!d) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const y = d.getFullYear();
  return `${day}.${mo}.${y}`;
}

/** Kalan gün (bitiş dahil değil: bugünden bitişe kadar tam gün) */
export function remainingCalendarDaysUntilEnd(endYmd) {
  const end = parseYmd(endYmd);
  if (!end) return null;
  return differenceInCalendarDays(startOfDay(end), startOfDay(new Date()));
}

/**
 * Admin MOD A: başlangıç + paket günü → bitiş
 */
export function adminModAStartPackage(startYmd, packageDays) {
  const end = addDaysYmd(startYmd, packageDays);
  const rem = end ? remainingCalendarDaysUntilEnd(end) : null;
  return { start_date: startYmd, end_date: end, remaining_days: rem };
}

/**
 * Admin MOD B: kalan gün + paket günü → bitiş = bugün+kalan, başlangıç = bitiş - paket
 */
export function adminModBRemainingPackage(remainingDays, packageDays) {
  const today = toYmd(startOfDay(new Date()));
  const end = addDaysYmd(today, remainingDays);
  const start = end ? addDaysYmd(end, -Number(packageDays || 0)) : null;
  const rem = end ? remainingCalendarDaysUntilEnd(end) : null;
  return { start_date: start, end_date: end, remaining_days: rem };
}

/**
 * Public A: başlangıç → bitiş = başlangıç + paket günü
 */
export function publicOptionA(startYmd, packageDays) {
  const end = addDaysYmd(startYmd, packageDays);
  const rem = end ? remainingCalendarDaysUntilEnd(end) : null;
  return { start_date: startYmd, end_date: end, remaining_days: rem };
}

/**
 * Public B: kalan gün → bitiş = bugün + kalan, başlangıç = bitiş - paket
 */
export function publicOptionB(remainingDays, packageDays) {
  return adminModBRemainingPackage(remainingDays, packageDays);
}
