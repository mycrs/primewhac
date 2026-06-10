import React, { useState, useEffect, useMemo } from 'react';

function parseEndDate(raw) {
  if (raw == null || raw === '') return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Kompakt: g=gün, s=saat, d=dakika, son sayı=saniye (canlı) */
function formatCountdownTr(ms) {
  if (ms <= 0) return null;
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `⏰ ${days}g ${h}s ${m}d ${String(s).padStart(2, '0')}`;
}

function formatCountdownDe(ms) {
  if (ms <= 0) return null;
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `⏰ ${days}T ${h}Std ${m}m ${String(s).padStart(2, '0')}s`;
}

/**
 * @param {{ pkg: Record<string, unknown>, isDe?: boolean }} props
 */
export default function PackageCountdownBadge({ pkg, isDe = false }) {
  const active = pkg?.countdown_active === true || pkg?.countdown_active === 'true';
  const end = useMemo(() => parseEndDate(pkg?.campaign_end_date), [pkg?.campaign_end_date]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active || !end) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active, end]);

  if (!active || !end) return null;

  const remaining = end.getTime() - now;
  if (remaining <= 0) return null;

  const text = isDe ? formatCountdownDe(remaining) : formatCountdownTr(remaining);
  if (!text) return null;

  return (
    <div
      className="absolute top-2 right-2 z-30 max-w-[calc(100%-1rem)] rounded-full border border-orange-400/40 bg-gradient-to-r from-orange-600/90 via-red-600/85 to-red-700/90 px-2.5 py-1 text-[10px] font-bold tracking-tight text-white shadow-lg shadow-orange-900/40 sm:text-[11px] sm:px-3 sm:py-1.5"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="whitespace-nowrap tabular-nums">{text}</span>
    </div>
  );
}
