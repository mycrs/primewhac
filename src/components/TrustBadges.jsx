import React, { useId, memo } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const COPY = {
  tr: {
    sealTop: '7/24',
    sealBottom: 'DESTEK GARANTİSİ',
    ssl: '256-bit SSL Şifreleme',
    instant: 'Anında Aktivasyon',
    uhd: '4K Ultra HD',
    channels: '10.000+ Kanal',
  },
  de: {
    sealTop: '7/24',
    sealBottom: 'SUPPORT-GARANTIE',
    ssl: '256-bit SSL-Verschlüsselung',
    instant: 'Sofort-Aktivierung',
    uhd: '4K Ultra HD',
    channels: '10.000+ Kanäle',
  },
};

function DashedRing({ size = 112, strokeWidth = 2.8, dash = '8 12', gradId }) {
  const c = size / 2;
  const r = c - strokeWidth - 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e50914" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Ana mühür: dönen kesik halka + cam iç + kalkan */
const GuaranteeSeal = memo(function GuaranteeSeal({ locale }) {
  const isDe = locale === 'de';
  const t = isDe ? COPY.de : COPY.tr;
  const uid = useId().replace(/:/g, '');
  const gradId = `trust-ring-${uid}`;

  return (
    <div
      className="group relative flex flex-col items-center gap-2"
      role="img"
      aria-label={`${t.sealTop} ${t.sealBottom}`}
    >
      <div className="relative h-[7.25rem] w-[7.25rem] shrink-0 md:h-[8.25rem] md:w-[8.25rem] transition-transform duration-300 ease-out group-hover:scale-105">
        <div
          className="trust-seal-ring-spin absolute inset-0 flex items-center justify-center"
          style={{ transformOrigin: 'center center' }}
        >
          <DashedRing size={116} gradId={gradId} strokeWidth={3} dash="7 11" />
        </div>
        <div className="absolute inset-[11%] flex flex-col items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#1e1035]/95 via-[#0a0a0a]/90 to-[#0c1222]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
          <div className="trust-seal-inner-pulse pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-[#e50914]/15 via-[#e50914]/10 to-transparent" />
          <span className="relative z-10 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e50914]/95 md:text-xs">
            {t.sealTop}
          </span>
          <Shield
            className="relative z-10 my-0.5 h-8 w-8 text-[#e50914] drop-shadow-[0_0_14px_rgba(229,9,20,0.65)] md:h-9 md:w-9"
            strokeWidth={2}
            fill="rgba(229, 9, 20, 0.22)"
            aria-hidden
          />
          <span className="relative z-10 max-w-[5.5rem] text-center text-[0.5rem] font-extrabold uppercase leading-tight tracking-wide text-white/90 md:max-w-[6rem] md:text-[0.55rem]">
            {t.sealBottom}
          </span>
        </div>
      </div>
    </div>
  );
});

/** Küçük rozet — aynı dil: dönen halka + emoji + metin */
const TrustMiniBadge = memo(function TrustMiniBadge({ emoji, label, gradId }) {
  return (
    <div className="group flex max-w-[7.5rem] flex-col items-center gap-1.5 text-center sm:max-w-[8rem]">
      <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 transition-transform duration-300 ease-out group-hover:scale-105 md:h-[4.75rem] md:w-[4.75rem]">
        <div
          className="trust-seal-ring-spin absolute inset-0 flex items-center justify-center opacity-90"
          style={{ transformOrigin: 'center center' }}
        >
          <DashedRing size={76} gradId={gradId} strokeWidth={2.2} dash="5 8" />
        </div>
        <div className="absolute inset-[12%] flex items-center justify-center rounded-full border border-white/12 bg-gradient-to-br from-[#1a1030]/95 via-[#0a0a0a]/88 to-[#0b1020]/95 shadow-inner backdrop-blur-sm">
          <div className="trust-seal-inner-pulse pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-[#e50914]/12 to-transparent" />
          <span className="relative z-10 text-xl md:text-2xl" aria-hidden>
            {emoji}
          </span>
        </div>
      </div>
      <p className="text-[0.65rem] font-semibold leading-snug text-slate-300 md:text-xs">{label}</p>
    </div>
  );
});

/**
 * Güven rozeti şeridi — paketler sayfası, footer üstü.
 * @param {{ locale?: 'tr'|'de', variant?: 'page'|'footer', className?: string }} props
 */
function TrustBadges({ locale = 'tr', variant = 'page', className = '' }) {
  const isDe = locale === 'de';
  const t = isDe ? COPY.de : COPY.tr;
  const baseId = useId().replace(/:/g, '');

  const minis = [
    { emoji: '🔒', label: t.ssl, key: 'ssl' },
    { emoji: '⚡', label: t.instant, key: 'instant' },
    { emoji: '📺', label: t.uhd, key: 'uhd' },
    { emoji: '✅', label: t.channels, key: 'channels' },
  ];

  const bandClasses = cn(
    'relative overflow-hidden border-y border-white/[0.08]',
    variant === 'footer' && 'border-t border-b-0 border-white/10 bg-[#0d0d18]/95 py-8 md:py-10',
    variant === 'page' && 'bg-gradient-to-r from-[#0f0f1a]/90 via-[#12101f]/95 to-[#0f0f1a]/90 py-10 md:py-12',
    className
  );

  return (
    <motion.section
      className={bandClasses}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px', amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      aria-label={isDe ? 'Vertrauens- und Qualitätsmerkmale' : 'Güven ve kalite rozetleri'}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(229, 9, 20,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:flex-wrap md:justify-center md:gap-10 lg:gap-14">
        <GuaranteeSeal locale={locale} />
        <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8 md:gap-10">
          {minis.map((m, i) => (
            <TrustMiniBadge key={m.key} emoji={m.emoji} label={m.label} gradId={`trust-mini-${baseId}-${i}`} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default memo(TrustBadges);
export { GuaranteeSeal, TrustMiniBadge };
