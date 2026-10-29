import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import SEOHead from '@/components/SEOHead';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import MatchScheduleSeoSectionDE from '@/components/MatchScheduleSeoSectionDE';
import TeamLogoOrInitials from '@/components/match/TeamLogoOrInitials';
import { useMatchScheduleStatic, SPORT_FOOTBALL, SPORT_BASKETBALL, SPORT_TENNIS } from '@/hooks/useMatchScheduleStatic';
import { resolveTeamLogoUrl } from '@/utils/teamLogos';
import { Calendar, Trophy, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { SITE_URL } from '@/constants/siteUrl';

/** Sinematik sayfa noise (feTurbulence tabanlı SVG) */
const CINEMA_NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

function MatchScheduleLoadingSkeletonDE() {
  return (
    <section
      aria-label="Laden"
      className="rounded-2xl border border-white/[0.12] bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8"
    >
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-36 animate-pulse rounded-lg bg-gradient-to-r from-[#e50914]/30 to-[#b20710]/20" />
            <div className="h-[4.5rem] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.04]" />
            <div className="h-[4.5rem] animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.04]" />
          </div>
        ))}
      </div>
      <p className="mt-8 bg-gradient-to-r from-[#e50914] via-white/85 to-[#b20710] bg-clip-text text-center text-sm font-semibold tracking-wide text-transparent">
        Spielplan wird geladen...
      </p>
    </section>
  );
}

function formatDateForSeo(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${d}. ${months[m - 1]} ${y}`;
}

function isToday(dateStr) {
  return dateStr === new Date().toISOString().split('T')[0];
}

const MatchSchedulePageDE = ({ siteData }) => {
  const { matches, loading, error, selectedDate, changeDate, getDateOptions, retry, sport, setSport } = useMatchScheduleStatic();
  const { contactData, siteTexts } = siteData || {};

  const logoEntries = useMemo(() => {
    const tl = siteData?.team_logos;
    if (!tl) return [];
    return Array.isArray(tl.entries) ? tl.entries : Array.isArray(tl) ? tl : [];
  }, [siteData?.team_logos]);

  const logoFor = useCallback((name) => resolveTeamLogoUrl(name, logoEntries), [logoEntries]);
  const logoUrlForList = useCallback((name) => logoFor(name), [logoFor]);

  const dateOpts = getDateOptions('de', sport);
  const formattedDate = formatDateForSeo(selectedDate);
  const matchCount = matches.reduce((sum, g) => sum + g.matches.length, 0);
  const leagueNames = matches.map((g) => g.league.name).join(', ');

  const PAGE_SIZE = 7;
  const isBasketball = sport === SPORT_BASKETBALL;
  const isTennis = sport === SPORT_TENNIS;
  const isPaginated = dateOpts.length > PAGE_SIZE;
  const selectedIdx = dateOpts.findIndex((o) => o.value === selectedDate);
  const currentPage = selectedIdx >= 0 ? Math.floor(selectedIdx / PAGE_SIZE) : 0;
  const totalPages = Math.ceil(dateOpts.length / PAGE_SIZE);
  const visibleDates = isPaginated
    ? dateOpts.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
    : dateOpts;
  const hasPrev = isPaginated && currentPage > 0;
  const hasNext = isPaginated && currentPage < totalPages - 1;

  const dateBarRef = useRef(null);
  const selectedBtnRef = useRef(null);

  useEffect(() => {
    if (selectedBtnRef.current && dateBarRef.current) {
      const bar = dateBarRef.current;
      const btn = selectedBtnRef.current;
      bar.scrollLeft = btn.offsetLeft - bar.clientWidth / 2 + btn.offsetWidth / 2;
    }
  }, [selectedDate, sport]);

  const goPrev = () => {
    if (!hasPrev) return;
    changeDate(dateOpts[(currentPage - 1) * PAGE_SIZE].value);
  };
  const goNext = () => {
    if (!hasNext) return;
    changeDate(dateOpts[(currentPage + 1) * PAGE_SIZE].value);
  };

  const metadata = useMemo(() => {
    const dateLabel = isToday(selectedDate) ? 'Heutiger' : `${formattedDate}`;
    let title = matchCount > 0
      ? `${dateLabel} Spielplan - ${leagueNames} | QruzeTV`
      : `Spielplan - ${formattedDate} Fixture | QruzeTV`;
    if (title.length > 60) title = `${dateLabel} Spielplan | QruzeTV`;
    const description = matchCount > 0
      ? `Am ${formattedDate} ${matchCount} Spiele: ${leagueNames}. Anstoßzeiten und Partienübersicht auf einen Blick.`
      : `Tagesaktueller Spielplan: ${formattedDate} Fixture, Anstoßzeiten und Partienübersicht. Wählen Sie den Tag über die Datumsleiste.`;
    return {
      title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
      description: description.substring(0, 160),
      keywords: ['Spielplan', 'heutige Spiele', formattedDate, 'Tagesfixture', 'Anstoßzeiten', 'Wochenprogramm'],
      ogType: 'website',
      canonicalUrl: `${SITE_URL}/de/spielplan`,
    };
  }, [selectedDate, formattedDate, matchCount, leagueNames]);

  const jsonLd = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/de` },
        { '@type': 'ListItem', position: 2, name: 'Spielplan', item: `${SITE_URL}/de/spielplan` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Spielplan - ${formattedDate}`,
      description: metadata.description,
      url: `${SITE_URL}/de/spielplan`,
      publisher: { '@type': 'Organization', name: 'QruzeTV' },
    },
  ], [formattedDate, metadata.description]);

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />

      <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] text-white selection:bg-white/20">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[#0a0a0a]" aria-hidden />
        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.045] mix-blend-overlay"
          style={{ backgroundImage: CINEMA_NOISE_DATA_URI, backgroundSize: '200px 200px' }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-screen flex-col bg-[#0a0a0a]">
          <HeaderDE contactData={contactData} siteTexts={siteTexts} />
          <main className="mx-auto w-full max-w-7xl flex-grow bg-[#0a0a0a] px-5 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-10">
            <BreadcrumbNavigation
              tone="cinema"
              className="py-3 sm:py-4"
              listClassName="text-[0.8125rem] sm:text-sm opacity-90"
              customCrumbs={[
                { name: 'Startseite', path: '/de' },
                { name: 'Spielplan', path: null },
              ]}
            />

            <article className="mt-1 space-y-6 sm:space-y-7">
              <div className="pb-1">
                <h1
                  className="font-extrabold tracking-tight text-white"
                  style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', lineHeight: 1.2 }}
                >
                  <span className="text-[#e50914]">Spielplan</span> & Fixture – {formattedDate}
                </h1>
                <div
                  className="mt-4 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#e50914]/45 to-transparent shadow-[0_0_14px_rgba(229,9,20,0.45)]"
                  aria-hidden
                />
              </div>

              <header className="rounded-2xl border border-white/[0.12] bg-white/[0.06] px-5 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[12px] sm:px-6 sm:py-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex w-full flex-col gap-4 sm:w-auto">
                    <div
                      className="flex flex-wrap gap-1.5 rounded-2xl bg-black/25 p-1.5 ring-1 ring-white/[0.08]"
                      role="tablist"
                    >
                      <button
                        role="tab"
                        aria-selected={sport === SPORT_FOOTBALL}
                        onClick={() => setSport(SPORT_FOOTBALL)}
                        className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all sm:flex-initial sm:px-5 ${
                          sport === SPORT_FOOTBALL
                            ? 'bg-[linear-gradient(135deg,#e50914,#b20710)] text-white shadow-[0_4px_15px_rgba(229, 9, 20,0.5),0_0_24px_rgba(229, 9, 20,0.25)] ring-1 ring-white/25'
                            : 'text-white/55 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span className="text-base leading-none" aria-hidden>
                          ⚽
                        </span>
                        Fußball
                      </button>
                      <button
                        role="tab"
                        aria-selected={isBasketball}
                        onClick={() => setSport(SPORT_BASKETBALL)}
                        className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all sm:flex-initial sm:px-5 ${
                          isBasketball
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.45),0_0_20px_rgba(251,146,60,0.2)] ring-1 ring-white/20'
                            : 'text-white/55 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span className="text-base leading-none" aria-hidden>
                          🏀
                        </span>
                        Basketball
                      </button>
                      <button
                        role="tab"
                        aria-selected={isTennis}
                        onClick={() => setSport(SPORT_TENNIS)}
                        className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all sm:flex-initial sm:px-5 ${
                          isTennis
                            ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-[0_4px_15px_rgba(16,185,129,0.45),0_0_20px_rgba(20,184,166,0.2)] ring-1 ring-white/20'
                            : 'text-white/55 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span className="text-base leading-none" aria-hidden>
                          🎾
                        </span>
                        Tennis
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.1] bg-black/20 px-4 py-3 text-sm backdrop-blur-sm">
                    <Calendar className="h-5 w-5 shrink-0 text-[#e50914]/90" aria-hidden />
                    <span className="font-semibold text-white">{formattedDate}</span>
                    <span className="text-white/35">·</span>
                    <span className="font-semibold text-amber-200/95">{matchCount} Spiele</span>
                  </div>
                </div>
              </header>

              <section
                aria-labelledby="date-selector-heading-de"
                className="rounded-2xl border border-white/[0.12] bg-white/[0.05] px-3 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[12px] sm:px-4 sm:py-4"
              >
                <h2 id="date-selector-heading-de" className="sr-only">
                  Datumsauswahl
                </h2>
                <div className="flex items-stretch gap-2 sm:gap-3">
                  {isPaginated && (
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={!hasPrev}
                      aria-label="Vorherige Woche"
                      className={`flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] transition-all ${
                        hasPrev
                          ? 'text-white/90 hover:border-[#e50914]/40 hover:bg-white/[0.12] hover:text-white hover:shadow-[0_0_20px_rgba(229, 9, 20,0.25)] active:scale-95'
                          : 'cursor-not-allowed text-white/20 opacity-50'
                      }`}
                    >
                      <ChevronLeft className="h-7 w-7" strokeWidth={2.25} />
                    </button>
                  )}
                  <div ref={dateBarRef} className="flex flex-1 gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-hide sm:gap-2.5">
                    {visibleDates.map((opt) => {
                      const isSelected = selectedDate === opt.value;
                      const isTodayOpt = opt.label.startsWith('Heute');
                      const selectedClasses = isBasketball
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_4px_18px_rgba(245,158,11,0.45),0_0_20px_rgba(251,146,60,0.2)] ring-1 ring-white/25'
                        : isTennis
                          ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-[0_4px_18px_rgba(16,185,129,0.4),0_0_18px_rgba(20,184,166,0.2)] ring-1 ring-white/25'
                          : 'bg-[linear-gradient(135deg,#e50914,#b20710)] text-white shadow-[0_4px_16px_rgba(229, 9, 20,0.5),0_0_22px_rgba(229, 9, 20,0.25)] ring-1 ring-white/25';
                      return (
                        <button
                          key={opt.value}
                          ref={isSelected ? selectedBtnRef : null}
                          onClick={() => changeDate(opt.value)}
                          className={`shrink-0 rounded-full px-3.5 py-2.5 text-xs font-semibold transition-all sm:px-5 sm:py-3 sm:text-sm ${
                            isSelected
                              ? selectedClasses
                              : isTodayOpt
                                ? 'border border-[#e50914]/35 bg-[#e50914]/10 text-white/90 hover:border-[#e50914]/50 hover:bg-[#e50914]/18'
                                : 'border border-white/[0.1] bg-white/[0.04] text-white/55 hover:border-white/[0.2] hover:bg-white/[0.1] hover:text-white/95'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {isPaginated && (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!hasNext}
                      aria-label="Nächste Woche"
                      className={`flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] transition-all ${
                        hasNext
                          ? 'text-white/90 hover:border-[#e50914]/40 hover:bg-white/[0.12] hover:text-white hover:shadow-[0_0_20px_rgba(229, 9, 20,0.25)] active:scale-95'
                          : 'cursor-not-allowed text-white/20 opacity-50'
                      }`}
                    >
                      <ChevronRight className="h-7 w-7" strokeWidth={2.25} />
                    </button>
                  )}
                </div>
              </section>

              {loading ? (
                <MatchScheduleLoadingSkeletonDE />
              ) : error ? (
                <section
                  aria-label="Fehler"
                  className="rounded-2xl border border-amber-400/35 bg-amber-500/[0.12] px-6 py-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
                >
                  <p className="mb-2 text-sm font-semibold text-amber-100">{error}</p>
                  <button
                    onClick={retry}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-400"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden />
                    Erneut versuchen
                  </button>
                </section>
              ) : matches.length === 0 ? (
                <section
                  aria-label="Keine Spiele"
                  className="rounded-2xl border border-white/[0.12] bg-white/[0.05] px-6 py-14 text-center shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[12px] sm:px-10"
                >
                  {isBasketball ? (
                    <>
                      <span className="mb-3 inline-block text-4xl" aria-hidden>
                        🏀
                      </span>
                      <h2 className="mb-2 text-lg font-semibold text-white">Keine Basketballspiele an diesem Tag</h2>
                      <p className="mx-auto max-w-md text-sm text-white/55">
                        Wählen Sie ein anderes Datum oder wechseln Sie zu{' '}
                        <button
                          type="button"
                          onClick={() => setSport(SPORT_FOOTBALL)}
                          className="font-medium text-[#e50914] underline decoration-[#e50914]/50 hover:text-white"
                        >
                          Fußball
                        </button>
                        .
                      </p>
                    </>
                  ) : isTennis ? (
                    <>
                      <span className="mb-3 inline-block text-4xl" aria-hidden>
                        🎾
                      </span>
                      <h2 className="mb-2 text-lg font-semibold text-white">Keine Tennisspiele an diesem Tag</h2>
                      <p className="mx-auto max-w-md text-sm text-white/55">
                        Wählen Sie ein anderes Datum oder wechseln Sie zu{' '}
                        <button
                          type="button"
                          onClick={() => setSport(SPORT_FOOTBALL)}
                          className="font-medium text-[#e50914] underline decoration-[#e50914]/50 hover:text-white"
                        >
                          Fußball
                        </button>
                        .
                      </p>
                    </>
                  ) : (
                    <>
                      <Trophy className="mx-auto mb-3 h-12 w-12 text-white/30" aria-hidden />
                      <h2 className="mb-2 text-lg font-semibold text-white">Keine Spiele an diesem Tag</h2>
                      <p className="mx-auto max-w-md text-sm text-white/55">
                        Wählen Sie über die Datumsleiste einen anderen Tag.
                      </p>
                    </>
                  )}
                </section>
              ) : (
                <section aria-labelledby="match-list-heading-de" className="space-y-4">
                  <h2 id="match-list-heading-de" className="sr-only">
                    Täglicher Spielplan
                  </h2>
                  {matches.map((group, groupIdx) => (
                    <section
                      key={`${group.league.slug || group.league.name}-${group.league.name}`}
                      className="overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[12px]"
                      aria-labelledby={`league-de-${groupIdx}`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-white/[0.1] bg-black/20 px-4 py-3.5 backdrop-blur-sm sm:px-5">
                        <div className="flex items-center gap-3">
                          <span className="text-xl" aria-hidden>
                            {group.league.flag}
                          </span>
                          <div>
                            <h3 id={`league-de-${groupIdx}`} className="text-sm font-semibold text-white">
                              {group.league.name}
                            </h3>
                            <p className="text-[11px] text-white/45">{group.league.country}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-amber-200/90">{group.matches.length} Spiele</span>
                      </div>
                      <ul className="divide-y divide-white/[0.06]" aria-label={`${group.league.name} Spiele`}>
                        {group.matches.map((m) => (
                          <li key={m.id} className="px-3 py-2 sm:px-4">
                            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 backdrop-blur-sm sm:gap-4">
                              <span className="shrink-0 rounded-lg border border-primary/35 bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary shadow-[0_0_12px_rgba(229, 9, 20,0.2)]">
                                {m.time}
                              </span>
                              <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2">
                                <div className="flex min-w-0 items-center gap-2">
                                  <TeamLogoOrInitials teamName={m.home} logoUrl={logoUrlForList(m.home)} variant="home" />
                                  <span className="truncate text-xs font-semibold text-white/90 sm:text-sm" title={m.home}>
                                    {m.home}
                                  </span>
                                </div>
                                <span className="shrink-0 text-xs font-medium text-white/35">vs</span>
                                <div className="flex min-w-0 items-center justify-end gap-2">
                                  <span
                                    className="truncate text-right text-xs font-semibold text-white/90 sm:text-sm"
                                    title={m.away}
                                  >
                                    {m.away}
                                  </span>
                                  <TeamLogoOrInitials teamName={m.away} logoUrl={logoUrlForList(m.away)} variant="away" />
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </section>
              )}

              <section>
                <MatchScheduleSeoSectionDE />
              </section>
            </article>
          </main>
          <FooterDE contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
        </div>
      </div>
    </>
  );
};

export default MatchSchedulePageDE;
