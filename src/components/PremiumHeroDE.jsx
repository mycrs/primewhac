import React, { memo, useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Monitor, ShieldCheck, Film, Clock, Tv2, Radio, Headphones, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';
import useMovieDatabase from '@/hooks/useMovieDatabase';
import { buildPlaceholderPosterList, HERO_PLACEHOLDER_POSTER_COUNT } from '@/utils/heroPrimePosters';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import { trackCtaClick, trackTestRequestStart } from '@/utils/analyticsTracking';

const TMDB_POSTER_W342 = 'https://image.tmdb.org/t/p/w342';

const features = [
  {
    icon: Monitor,
    title: '4K Ultra HD Streaming',
    desc: 'Echtes Kinoerlebnis mit kristallklarer und flüssiger Bildqualität.',
    proof: 'Kino-Schärfe',
    color: 'from-[#e50914] to-[#b20710]',
  },
  {
    icon: ShieldCheck,
    title: 'Anti-Freeze Technologie',
    desc: 'Kein Einfrieren mehr! Unterbrechungsfreies Streaming auch zur Stoßzeit.',
    proof: 'Stark zur Stoßzeit',
    color: 'from-[#e50914] to-[#b20710]',
  },
  {
    icon: Film,
    title: 'Riesiges VOD-Archiv',
    desc: 'Die aktuellsten Serien, Kinofilme und Dokumentationen auf Knopfdruck.',
    proof: 'Ständig aktuell',
    color: 'from-amber-400 to-orange-400',
  },
  {
    icon: Clock,
    title: '24/7 Premium Support',
    desc: 'Unser technisches Expertenteam bietet sofortige Lösungen für jedes Problem.',
    proof: 'Sofortige Hilfe',
    color: 'from-[#e50914] to-green-400',
  },
];

const trustItems = [
  { icon: Tv2, label: '10.000+ Kanäle' },
  { icon: Radio, label: '4K Ultra HD' },
  { icon: Headphones, label: '24/7 Support' },
];

const PLACEHOLDER_GRADS = [
  'from-[#e50914]/90 via-[#0a0a0a] to-[#b20710]/80',
  'from-[#e50914]/90 via-[#0a0a0a] to-[#b20710]/70',
  'from-[#e50914]/85 via-[#0a0a0a] to-[#b20710]/80',
  'from-[#e50914]/90 via-[#0a0a0a] to-[#b20710]/75',
  'from-[#e50914]/85 via-[#0a0a0a] to-[#b20710]/70',
  'from-[#0a0a0a] via-[#e50914]/80 to-[#b20710]/75',
];

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const splitMainTitle = (mainTitle) => {
  const raw = (mainTitle || '').trim();
  if (!raw) {
    return {
      line1: 'Premium IPTV Deutschland – Grenzenlose Unterhaltung',
      line2: 'Wahres Vergnügen entdecken',
    };
  }
  const parts = raw
    .split(/\s*[–-]\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return { line1: parts[0], line2: parts.slice(1).join(' – ') };
  }
  return { line1: raw, line2: 'Wahres Vergnügen entdecken' };
};

function splitItemsIntoColumns(items, colCount) {
  const cols = Array.from({ length: colCount }, () => []);
  items.forEach((item, i) => {
    cols[i % colCount].push(item);
  });
  return cols;
}

function buildSkeletonItems(count) {
  return Array.from({ length: count }, (_, i) => ({
    key: `sk-${i}`,
    skeleton: true,
    url: null,
    hue: i % 6,
  }));
}

const HERO_MD_BREAKPOINT = 768;

function useHeroIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < HERO_MD_BREAKPOINT : false,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${HERO_MD_BREAKPOINT - 1}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return isMobile;
}

const mosaicMaskStyle = {
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, black 30%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
  maskImage:
    'linear-gradient(to right, transparent 0%, black 30%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
  maskComposite: 'intersect',
};

function PosterTile({ url, hue, skeleton, eager }) {
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  if (skeleton) {
    return (
      <div
        className="aspect-[2/3] w-full shrink-0 animate-pulse rounded-lg bg-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        aria-hidden="true"
      />
    );
  }

  if (!url || loadFailed) {
    return (
      <div
        className={`aspect-[2/3] w-full shrink-0 rounded-lg bg-gradient-to-br ${PLACEHOLDER_GRADS[hue % PLACEHOLDER_GRADS.length]} shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {!loaded && <div className="absolute inset-0 z-10 animate-pulse bg-white/[0.12]" aria-hidden="true" />}
      <img
        src={url}
        alt=""
        width={342}
        height={513}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (import.meta.env.DEV) {
            console.warn('[PremiumHeroDE] Poster konnte nicht geladen werden:', url);
          }
          setLoadFailed(true);
        }}
      />
    </div>
  );
}

function ScrollingColumn({ items, durationSec, columnIndex }) {
  const loop = items.length >= 1 ? [...items, ...items] : items;
  return (
    <div className="relative h-full min-h-0 flex-1 overflow-hidden">
      <div className="hero-prime-scroll-col flex flex-col gap-[10px]" style={{ animationDuration: `${durationSec}s` }}>
        {loop.map((item, i) => {
          const isFirstStrip = i < items.length;
          const eager = columnIndex === 0 && isFirstStrip && i < 3;
          return (
            <PosterTile
              key={`${item.key}-${i}`}
              url={item.url}
              hue={item.hue}
              skeleton={item.skeleton}
              eager={eager}
            />
          );
        })}
      </div>
    </div>
  );
}

function HeroMosaicDesktop({ columnsWithG, className = '' }) {
  const speeds = [25, 20, 30];
  return (
    <div
      className={`flex h-full min-h-[420px] w-full justify-end gap-[10px] ${className}`}
      style={mosaicMaskStyle}
      aria-hidden="true"
    >
      {columnsWithG.map((col, ci) => (
        <ScrollingColumn key={ci} items={col} durationSec={speeds[ci] ?? 25} columnIndex={ci} />
      ))}
    </div>
  );
}

function HeroMosaicMobile({ columnsWithG }) {
  const speeds = [22, 28];
  return (
    <div className="absolute inset-0 flex gap-[10px]" aria-hidden="true">
      {columnsWithG.map((col, ci) => (
        <ScrollingColumn key={ci} items={col} durationSec={speeds[ci] ?? 24} columnIndex={ci} />
      ))}
    </div>
  );
}

const PremiumHeroDE = ({ siteData, mainTitle, subTitle: _subTitle }) => {
  const { openTestModal } = useTestModal();
  const { discoverMovies, discoverTV } = useMovieDatabase();
  const [posterUrls, setPosterUrls] = useState([]);
  const [mosaicLoading, setMosaicLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMosaicLoading(true);

    const runFetch = async () => {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          discoverMovies({ sort_by: 'popularity.desc', page: 1 }),
          discoverTV({ sort_by: 'popularity.desc', page: 1 }),
        ]);
        if (cancelled) return;
        const movies = (moviesRes?.results || []).map((m) => ({ ...m, media_type: 'movie' }));
        const tvs = (tvRes?.results || []).map((t) => ({ ...t, media_type: 'tv' }));
        const combined = [...movies, ...tvs]
          .filter((i) => i.poster_path)
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        const seen = new Set();
        const urls = [];
        for (const item of combined) {
          const p = item.poster_path;
          if (!p || seen.has(p)) continue;
          seen.add(p);
          urls.push(`${TMDB_POSTER_W342}${p}`);
          if (urls.length >= 24) break;
        }
        setPosterUrls(urls);
      } catch (e) {
        if (import.meta.env.DEV) {
          console.warn('[PremiumHeroDE] Mosaik-Anfrage fehlgeschlagen:', e);
        }
        if (!cancelled) setPosterUrls([]);
      } finally {
        if (!cancelled) setMosaicLoading(false);
      }
    };

    let idleId;
    let timeoutId;
    const schedule = () => {
      if (cancelled) return;
      runFetch();
    };
    if (typeof requestIdleCallback !== 'undefined') {
      idleId = requestIdleCallback(schedule, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(schedule, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId != null && typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId);
      }
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [discoverMovies, discoverTV]);

  const { line1, line2 } = useMemo(() => splitMainTitle(mainTitle), [mainTitle]);

  const heroData = siteData?.heroData || {};
  const tagline =
    (heroData.premiumHeroCustomSlideCaption || '').trim() || 'Streaming in Kinoqualität';

  const itemsForMosaic = useMemo(() => {
    if (mosaicLoading) {
      return buildSkeletonItems(18);
    }
    if (posterUrls.length === 0) {
      return buildPlaceholderPosterList(HERO_PLACEHOLDER_POSTER_COUNT).map((p) => ({
        ...p,
        skeleton: false,
      }));
    }
    const padded = [...posterUrls];
    while (padded.length < 18) padded.push(null);
    return padded.slice(0, 24).map((url, i) => ({
      key: url ? `discover-${i}-${url}` : `pad-${i}`,
      url,
      hue: i % 6,
      skeleton: false,
    }));
  }, [mosaicLoading, posterUrls]);

  const columnsDesktop = useMemo(() => splitItemsIntoColumns(itemsForMosaic, 3), [itemsForMosaic]);
  const columnsMobile = useMemo(() => splitItemsIntoColumns(itemsForMosaic, 2), [itemsForMosaic]);
  const isMobileViewport = useHeroIsMobile();

  const descriptionAndActions = (
    <>
      <p className="mx-auto mb-6 max-w-[480px] text-center text-[1rem] leading-relaxed text-white/85 md:mx-0 md:mb-8 md:text-left">
        Vergessen Sie das traditionelle Fernsehen. 10.000+{' '}
        <span className="font-medium text-white">Premium-Kanäle</span>, eine riesige{' '}
        <span className="font-medium text-white">VOD-Bibliothek</span> und unsere{' '}
        <span className="font-medium text-[#e50914]">4K-Infrastruktur</span> machen Ihr Zuhause zum privaten Kino.
      </p>

      <motion.div
        variants={itemVariants}
        initial={false}
        animate="visible"
        className="mx-auto mb-6 flex w-full max-w-xl flex-col gap-4 md:mx-0 md:mb-8 md:max-w-none md:flex-row md:flex-wrap md:justify-start md:gap-4 lg:gap-5"
      >
        <Link
          to="/de/pakete"
          onClick={() => trackCtaClick('hero_packages_de', 'premium_hero_de')}
          className="group w-full min-w-0 md:w-auto"
        >
          <Button className="relative h-14 w-full min-w-[180px] overflow-hidden rounded-2xl border border-white/25 bg-gradient-to-r from-[#e50914] via-[#e50914] to-[#b20710] px-8 text-base font-bold text-white shadow-[0_0_50px_rgba(229,9,20,0.45)] transition-all duration-300 hover:scale-[1.02] hover:from-[#e50914] hover:via-[#e50914] hover:to-[#b20710] md:min-w-[200px] md:w-auto">
            <span className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-[100%]" />
            <Play className="relative z-10 mr-2.5 h-5 w-5 fill-current" />
            <span className="relative z-10">Pakete ansehen</span>
          </Button>
        </Link>
        <Button
          onClick={() => {
            trackTestRequestStart('premium_hero_de');
            openTestModal();
          }}
          className="h-14 w-full min-w-[180px] rounded-2xl border-2 border-[#e50914]/50 bg-white/[0.04] px-8 text-base font-bold text-white shadow-[0_0_40px_rgba(229,9,20,0.2)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#e50914]/80 hover:bg-white/[0.08] md:min-w-[200px] md:w-auto"
        >
          <Zap className="relative z-10 mr-2.5 h-5 w-5 text-[#e50914]" />
          <span className="relative z-10">Kostenlos testen</span>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="group relative h-auto min-h-14 w-full items-start justify-start overflow-hidden whitespace-normal rounded-2xl border-2 border-[#e50914]/50 bg-gradient-to-br from-[#e50914]/40 via-[#b20710]/30 to-[#b20710]/25 px-5 py-3.5 text-sm font-semibold leading-snug text-white shadow-[0_0_44px_rgba(229,9,20,0.45),0_0_24px_rgba(229,9,20,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#e50914]/70 hover:from-[#e50914]/50 hover:via-[#e50914]/40 hover:to-[#b20710]/35 hover:shadow-[0_0_56px_rgba(229,9,20,0.55),0_0_36px_rgba(229,9,20,0.35)] md:px-6 md:text-[0.9375rem] min-w-0 md:w-auto md:max-w-[min(100%,320px)] lg:max-w-[24rem] xl:max-w-none"
        >
          <Link
            to="/de/bewertungen#musteriler-ne-dusunuyor"
            onClick={() => trackCtaClick('hero_reviews_de', 'premium_hero_de')}
            className="flex w-full min-w-0"
          >
            <span
              className="absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.18)_50%,transparent_80%)] transition-transform duration-700 group-hover:translate-x-[100%]"
              aria-hidden
            />
            <span className="relative z-10 mr-3 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/50 to-[#b20710]/60 shadow-[0_0_20px_rgba(251,191,36,0.35)] ring-1 ring-white/25">
              <MessageSquare className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
            </span>
            <span className="relative z-10 text-left text-white drop-shadow-[0_0_14px_rgba(229,9,20,0.45)]">
              Was denken unsere Kunden über uns?
            </span>
          </Link>
        </Button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial={false}
        animate="visible"
        className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-400 md:justify-start md:gap-x-4"
      >
        {trustItems.map((item, i) => (
          <React.Fragment key={`${item.label}-${i}`}>
            {i > 0 && <span className="text-slate-600" aria-hidden>|</span>}
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4 shrink-0 text-[#e50914]/85" />
              <span className="font-medium text-slate-300">{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </motion.div>

    </>
  );

  return (
    <div className="relative z-0 flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#0a0a0a]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[min(58vh,560px)] w-[min(92vw,680px)] bg-[radial-gradient(ellipse_80%_70%_at_0%_100%,rgba(229, 9, 20,0.42)_0%,rgba(229,9,20,0.14)_38%,transparent_68%)]"
        aria-hidden
      />
      <div
        className="premium-hero-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.04] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />

      <div className="relative z-[3] mx-auto w-full max-w-7xl px-4 pt-4">
        <div className="flex flex-col items-stretch gap-8 md:flex-row md:items-center md:gap-10 lg:gap-14">
          <div className="relative order-2 flex w-full flex-col items-center text-center md:order-1 md:w-1/2 md:shrink-0 md:items-start md:text-left">
            <motion.div variants={itemVariants} initial={false} animate="visible" className="relative mb-3 md:mb-4">
              <img
                src={BRAND_LOGO_URL}
                alt="QruzeTV logo"
                className="mx-auto h-auto w-full max-w-[120px] object-contain opacity-95 drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] drop-shadow-[0_0_40px_rgba(229,9,20,0.45)] md:mx-0 md:max-w-[160px]"
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <p className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.24em] text-[#e50914]/90 md:mb-3 md:text-[0.65rem] md:tracking-[0.28em] md:text-[#e50914]/95 lg:text-[0.7rem] lg:tracking-[0.32em]">
              {tagline}
            </p>

            <h1 className="font-display mb-4 w-full max-w-lg font-black tracking-tight text-white antialiased md:mb-5 md:max-w-none">
              <span className="block text-xl leading-snug md:text-[4rem] md:leading-[1.05]">{line1}</span>
              <span className="mt-1 block text-base font-black text-[#e50914] md:mt-2 md:text-[2rem]">{line2}</span>
            </h1>

            <div className="mx-auto flex w-full max-w-lg flex-col md:mx-0 md:max-w-none">{descriptionAndActions}</div>
          </div>

          <div className="relative order-1 h-[280px] w-full shrink-0 overflow-hidden rounded-xl md:order-2 md:h-[min(85vh,720px)] md:min-h-[420px] md:w-1/2 md:overflow-visible md:rounded-none">
            {isMobileViewport ? (
              <>
                <HeroMosaicMobile columnsWithG={columnsMobile} />
                <div
                  className="pointer-events-none absolute inset-0 z-[1] bg-[#0a0a0a]/90"
                  aria-hidden="true"
                />
              </>
            ) : (
              <div className="absolute inset-y-0 right-0 hidden h-full w-full max-w-[min(100%,420px)] md:block">
                <HeroMosaicDesktop columnsWithG={columnsDesktop} />
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        variants={itemVariants}
        initial={false}
        animate="visible"
        className="relative z-[4] mx-auto mt-14 grid w-full max-w-6xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature, index) => (
          <motion.article
            key={index}
            whileHover={{ y: -6, scale: 1.015 }}
            className="luxury-card group rounded-3xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_30px_90px_rgba(0,0,0,0.52),0_0_42px_rgba(229,9,20,0.18)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(255,255,255,0.12),transparent_36%),linear-gradient(135deg,rgba(229,9,20,0.08),transparent_42%)] opacity-70 transition-opacity group-hover:opacity-100" />
            <div className="relative mb-6 flex items-start justify-between gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-[0_18px_44px_rgba(0,0,0,0.38),0_0_28px_rgba(229,9,20,0.18),inset_0_1px_0_rgba(255,255,255,0.28)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105`}
              >
                <feature.icon className="h-8 w-8 text-white drop-shadow-md" />
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                0{index + 1}
              </span>
            </div>
            <span className="relative mb-3 inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary/90">
              {feature.proof}
            </span>
            <h3 className="relative mb-3 text-xl font-black tracking-tight text-white">{feature.title}</h3>
            <p className="relative text-sm leading-[1.75] text-slate-300">{feature.desc}</p>
          </motion.article>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-[5] h-32 w-full bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </div>
  );
};

export default memo(PremiumHeroDE);
