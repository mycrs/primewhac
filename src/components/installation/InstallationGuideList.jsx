import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ImageOff, Loader2, Tv, Search, Download, KeyRound, Link2,
  ListVideo, Star, Play, UserPlus, LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FALLBACK_ICONS = {
  store: Tv,
  search: Search,
  install: Download,
  app: Play,
  xtream: KeyRound,
  m3u: Link2,
  addUser: UserPlus,
  channels: ListVideo,
  favorites: Star,
  livetv: ListVideo,
  watch: Play,
  login: LogIn,
};

const THEME_STYLES = {
  amber: 'from-amber-500/15 via-[#0a0a0a] to-[#141414] text-amber-400 border-amber-500/20',
  violet: 'from-violet-500/15 via-[#0a0a0a] to-[#141414] text-violet-400 border-violet-500/20',
  green: 'from-green-500/15 via-[#0a0a0a] to-[#141414] text-green-400 border-green-500/20',
  red: 'from-[#e50914]/15 via-[#0a0a0a] to-[#141414] text-[#e50914] border-[#e50914]/20',
  apple: 'from-slate-400/15 via-[#0a0a0a] to-[#141414] text-slate-200 border-slate-500/25',
  sky: 'from-sky-500/15 via-[#0a0a0a] to-[#141414] text-sky-400 border-sky-500/20',
  emerald: 'from-emerald-500/15 via-[#0a0a0a] to-[#141414] text-emerald-400 border-emerald-500/20',
  rose: 'from-rose-500/15 via-[#0a0a0a] to-[#141414] text-rose-400 border-rose-500/20',
  cyan: 'from-cyan-500/15 via-[#0a0a0a] to-[#141414] text-cyan-400 border-cyan-500/20',
  orange: 'from-orange-500/15 via-[#0a0a0a] to-[#141414] text-orange-400 border-orange-500/20',
  neutral: 'from-slate-500/10 via-[#0a0a0a] to-[#141414] text-slate-400 border-slate-700/40',
};

function inferTheme(src, visual) {
  if (visual?.includes('smarters') || src?.includes('smarters')) return 'violet';
  if (visual?.includes('0player') || src?.includes('0player')) return 'amber';
  if (src?.includes('/guides/windows/ibo') || (src?.includes('/guides/windows') && src?.includes('ibo-'))) return 'emerald';
  if (src?.includes('/guides/windows/abc') || (src?.includes('/guides/windows') && src?.includes('abc-'))) return 'rose';
  if (src?.includes('/guides/windows/vs') || (src?.includes('/guides/windows') && src?.includes('vs-'))) return 'cyan';
  if (src?.includes('/guides/windows/castora') || (src?.includes('/guides/windows') && src?.includes('castora-'))) return 'violet';
  if (src?.includes('/guides/windows/next') || (src?.includes('/guides/windows') && src?.includes('next-'))) return 'sky';
  if (src?.includes('/guides/windows')) return 'sky';
  if (src?.includes('/guides/mac/next') || src?.includes('next-')) return 'apple';
  if (src?.includes('/guides/mac/castora') || src?.includes('castora-')) return 'violet';
  if (src?.includes('/guides/tablet/ibo') || (src?.includes('/guides/tablet') && src?.includes('ibo-'))) return 'emerald';
  if (src?.includes('/guides/tablet/abc') || (src?.includes('/guides/tablet') && src?.includes('abc-'))) return 'rose';
  if (src?.includes('/guides/tablet/vs') || (src?.includes('/guides/tablet') && src?.includes('vs-'))) return 'cyan';
  if (src?.includes('/guides/tablet')) return 'orange';
  if (src?.includes('android-tv') || src?.includes('/guides/android/qruze-tv')) return 'green';
  if (src?.includes('/guides/android/qruze-phone')) return 'red';
  if (src?.includes('/guides/ios')) return 'apple';
  return 'neutral';
}

function GuideVisualShell({ resolvedTheme, themeClass, children, state, alt }) {
  const glowClass =
    resolvedTheme === 'amber'
      ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.12),transparent_55%)]'
      : resolvedTheme === 'violet'
        ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.12),transparent_55%)]'
        : resolvedTheme === 'green'
          ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.12),transparent_55%)]'
          : resolvedTheme === 'red'
            ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(229,9,20,0.12),transparent_55%)]'
            : resolvedTheme === 'apple'
              ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.14),transparent_55%)]'
              : resolvedTheme === 'sky'
                ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.12),transparent_55%)]'
                : resolvedTheme === 'emerald'
                  ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.12),transparent_55%)]'
                  : resolvedTheme === 'rose'
                    ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(251,113,133,0.12),transparent_55%)]'
                    : resolvedTheme === 'cyan'
                      ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.12),transparent_55%)]'
                      : 'bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.08),transparent_55%)]';

  return (
    <div className={cn('relative w-full h-full min-h-[220px] md:min-h-[260px] overflow-hidden bg-gradient-to-br border-l border-slate-800/70', themeClass)}>
      <div className={cn('absolute inset-0 pointer-events-none', glowClass)} />
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 text-primary animate-spin opacity-50" />
        </div>
      )}
      <div
        className={cn(
          'relative z-[1] w-full h-full min-h-[220px] md:min-h-[260px] flex items-center justify-center p-3 md:p-5 transition-opacity duration-500',
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        )}
        role="img"
        aria-label={alt}
      >
        {children}
      </div>
    </div>
  );
}

const GuideListImage = ({ src, alt, visual, theme }) => {
  const [state, setState] = useState(src ? 'loading' : 'empty');
  const [inlineSvg, setInlineSvg] = useState(null);
  const resolvedTheme = theme || inferTheme(src, visual);
  const themeClass = THEME_STYLES[resolvedTheme] || THEME_STYLES.neutral;
  const FallbackIcon = FALLBACK_ICONS[visual] || Tv;
  const isSvg = Boolean(src?.toLowerCase().endsWith('.svg'));

  useEffect(() => {
    if (!src) {
      setInlineSvg(null);
      setState('empty');
      return undefined;
    }

    if (!isSvg) {
      setInlineSvg(null);
      setState('loading');
      return undefined;
    }

    let cancelled = false;
    setInlineSvg(null);
    setState('loading');

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error('svg fetch failed');
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const cleaned = text.replace(/<\?xml[^?]*\?>/i, '').trim();
        if (!cleaned.includes('<svg')) throw new Error('invalid svg');
        setInlineSvg(cleaned);
        setState('loaded');
      })
      .catch(() => {
        if (!cancelled) {
          setInlineSvg(null);
          setState('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src, isSvg]);

  if (!src || state === 'empty') {
    return (
      <div className={cn('w-full h-full min-h-[200px] md:min-h-[240px] flex flex-col items-center justify-center bg-gradient-to-br border-l border-slate-800/70', themeClass)}>
        <div className="w-16 h-16 rounded-2xl bg-black/40 border border-current/20 flex items-center justify-center mb-3">
          <FallbackIcon className="w-8 h-8" />
        </div>
        <span className="text-xs text-slate-500 px-6 text-center">{alt}</span>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={cn('w-full h-full min-h-[220px] md:min-h-[260px] flex flex-col items-center justify-center bg-gradient-to-br border-l border-slate-800/70', themeClass)}>
        <ImageOff className="w-8 h-8 text-slate-500 mb-3" />
        <FallbackIcon className={cn(
          'w-10 h-10',
          resolvedTheme === 'amber' ? 'text-amber-400'
            : resolvedTheme === 'violet' ? 'text-violet-400'
              : resolvedTheme === 'green' ? 'text-green-400'
                : resolvedTheme === 'red' ? 'text-[#e50914]'
                  : resolvedTheme === 'apple' ? 'text-slate-200'
                    : resolvedTheme === 'sky' ? 'text-sky-400'
                      : resolvedTheme === 'emerald' ? 'text-emerald-400'
                        : resolvedTheme === 'rose' ? 'text-rose-400'
                          : resolvedTheme === 'cyan' ? 'text-cyan-400'
                            : 'text-slate-400'
        )} />
      </div>
    );
  }

  if (isSvg) {
    return (
      <GuideVisualShell resolvedTheme={resolvedTheme} themeClass={themeClass} state={state} alt={alt}>
        {inlineSvg && (
          <div
            className="w-full max-w-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[260px] [&>svg]:block [&>svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: inlineSvg }}
          />
        )}
      </GuideVisualShell>
    );
  }

  return (
    <GuideVisualShell resolvedTheme={resolvedTheme} themeClass={themeClass} state={state} alt={alt}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto max-h-[260px] object-contain mx-auto"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
      />
    </GuideVisualShell>
  );
};

const InstallationGuideList = ({ steps, isDe = false, title, theme = 'neutral', hideHeader = false }) => {
  if (!steps?.length) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {!hideHeader && (
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {title || (isDe ? 'Installationsanleitung' : 'Kurulum Rehberi')}
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            {isDe
              ? 'Alle Schritte auf einen Blick — von oben nach unten folgen.'
              : 'Tüm kurulum adımları aşağıda — yukarıdan aşağıya takip edin.'}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {steps.map((step, index) => {
          const hasImage = Boolean(step.image?.trim());
          return (
          <motion.article
            key={`${step.title}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: index * 0.04 }}
            className={cn(
              'gap-0 rounded-2xl overflow-hidden border border-slate-800/70 bg-[#0a0a0a]/50 shadow-lg',
              hasImage ? 'grid md:grid-cols-2' : 'block'
            )}
          >
            <div className={cn('p-6 md:p-8 flex flex-col justify-center', hasImage && 'order-2 md:order-1')}>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {step.description}
              </p>
            </div>
            {hasImage && (
              <div className="order-1 md:order-2 min-h-[220px] md:min-h-[260px]">
                <GuideListImage
                  src={step.image}
                  alt={step.title ? `${step.title} kurulum` : 'Kurulum görseli'}
                  visual={step.visual}
                  theme={step.theme || theme}
                />
              </div>
            )}
          </motion.article>
        );
        })}
      </div>
    </div>
  );
};

export default InstallationGuideList;
