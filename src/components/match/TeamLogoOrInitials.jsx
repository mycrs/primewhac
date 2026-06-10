import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/** Takım adından 2 harflik kısaltma (ör. "Galatasaray" → "GA", "Man City" → "MC"). */
export function getTeamInitials(name) {
  const parts = String(name || '').split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * @param {string} teamName
 * @param {string|null|undefined} logoUrl
 * @param {'home'|'away'} variant
 * @param {'sm'|'lg'} size
 */
export default function TeamLogoOrInitials({ teamName, logoUrl, variant = 'home', className, size = 'sm' }) {
  const [showImg, setShowImg] = useState(!!logoUrl);
  const initials = getTeamInitials(teamName);

  useEffect(() => {
    setShowImg(!!logoUrl);
  }, [logoUrl]);

  const ring =
    variant === 'home'
      ? 'bg-gradient-to-br from-[#e50914] to-[#b20710]'
      : 'bg-gradient-to-br from-[#e50914] to-[#b20710]';

  const boxSm = 'h-8 w-8 rounded-full text-[10px]';
  const boxLg = 'h-12 w-12 sm:h-14 sm:w-14 rounded-2xl text-base shadow-lg';
  const box = size === 'lg' ? boxLg : boxSm;
  const innerRound = size === 'lg' ? 'rounded-2xl' : 'rounded-full';
  const shadow =
    size === 'lg'
      ? variant === 'home'
        ? 'shadow-primary/30'
        : 'shadow-sky-500/30'
      : '';

  const decorativeWrap = (children) => (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center select-none pointer-events-none',
        box,
        shadow,
        className,
      )}
      aria-hidden
    >
      {children}
    </div>
  );

  if (logoUrl && showImg) {
    return decorativeWrap(
      <div className={cn('h-full w-full bg-white/10 overflow-hidden border border-white/15 flex items-center justify-center', innerRound)}>
        <img
          src={logoUrl}
          alt=""
          className="h-full w-full object-contain p-0.5"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setShowImg(false)}
        />
      </div>,
    );
  }

  return decorativeWrap(
    <div
      className={cn(
        'h-full w-full flex items-center justify-center font-bold text-white',
        innerRound,
        ring,
      )}
    >
      {initials}
    </div>,
  );
}
