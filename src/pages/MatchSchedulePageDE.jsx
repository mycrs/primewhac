import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { makeMatchSlug } from '@/utils/matchSlug';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import MatchScheduleSeoSectionDE from '@/components/MatchScheduleSeoSectionDE';
import { useMatchSchedule } from '@/hooks/useMatchSchedule';
import { Loader2, Calendar, Trophy } from 'lucide-react';

const SITE_URL = 'https://primewatch.tv';

/** "2025-03-03" -> "3. März 2025" */
function formatDateForSeo(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${d}. ${months[m - 1]} ${y}`;
}

/** Heute prüfen */
function isToday(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

function getTeamInitials(name) {
  const parts = String(name || '')
    .split(' ')
    .filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const MatchSchedulePageDE = ({ siteData }) => {
  const { matches, loading, error, selectedDate, changeDate, getDateOptions } = useMatchSchedule();
  const { contactData, siteTexts } = siteData || {};

  const dateOpts = getDateOptions('de');
  const formattedDate = formatDateForSeo(selectedDate);
  const matchCount = matches.reduce((sum, g) => sum + g.matches.length, 0);
  const leagueNames = matches.map((g) => g.league.name).join(', ');

  const metadata = useMemo(() => {
    const dateLabel = isToday(selectedDate) ? 'Heutiger' : `${formattedDate}`;
    let title = matchCount > 0
      ? `${dateLabel} Spielplan - ${leagueNames} | PrimeWatch TV`
      : `Spielplan - ${formattedDate} Fixture | PrimeWatch TV`;
    if (title.length > 60) {
      title = `${dateLabel} Spielplan | PrimeWatch TV`;
    }
    const description = matchCount > 0
      ? `Am ${formattedDate} ${matchCount} Spiele: ${leagueNames}. Welcher Sender, wann? Live mit PrimeWatch TV IPTV.`
      : `Super Lig, Premier League, La Liga, Champions League Spielplan. ${formattedDate} Fixture. Sportkanäle mit PrimeWatch TV – unterbrechungsfrei Fußball schauen.`;
    return {
      title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
      description: description.substring(0, 160),
      keywords: [
        'Spielplan',
        'heutige Spiele',
        formattedDate,
        'Super Lig Fixture',
        'Premier League Spiele',
        'welcher Sender',
        'IPTV Fußball schauen',
      ],
      ogType: 'website',
      canonicalUrl: `${SITE_URL}/de/spielplan`,
    };
  }, [selectedDate, formattedDate, matchCount, leagueNames]);

  const jsonLd = useMemo(() => {
    const schemas = [];

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Spielplan - ${formattedDate}`,
      description: metadata.description,
      url: `${SITE_URL}/de/spielplan`,
      publisher: { '@type': 'Organization', name: 'PrimeWatch TV' },
    });

    if (matchCount > 0) {
      const events = [];
      matches.forEach((group) => {
        group.matches.forEach((m) => {
          const [y, mo, d] = selectedDate.split('-');
          const [h, min] = (m.time || '20:00').split(':');
          const startDate = `${y}-${mo}-${d}T${h.padStart(2, '0')}:${(min || '00').padStart(2, '0')}:00+03:00`;
          events.push({
            '@type': 'SportsEvent',
            name: `${m.home} - ${m.away}`,
            sport: 'Soccer',
            startDate,
            homeTeam: { '@type': 'SportsTeam', name: m.home },
            awayTeam: { '@type': 'SportsTeam', name: m.away },
            competitor: [
              { '@type': 'SportsTeam', name: m.home },
              { '@type': 'SportsTeam', name: m.away },
            ],
            organizer: { '@type': 'SportsOrganization', name: group.league.name },
          });
        });
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${formattedDate} Spielplan`,
        itemListElement: events.slice(0, 20).map((e, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: e,
        })),
      });
    }

    return schemas;
  }, [matches, selectedDate, formattedDate, matchCount, metadata.description]);

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />

      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#4c1d95_0,_#020617_55%)] flex flex-col text-white selection:bg-purple-500/30">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <BreadcrumbNavigation
            customCrumbs={[
              { name: 'Startseite', path: '/de' },
              { name: 'Spielplan', path: null },
            ]}
          />

          <article className="mt-4 space-y-8">
            {/* Hero-Karte */}
            <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 px-5 py-6 sm:px-8 sm:py-8 shadow-xl shadow-purple-900/20">
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="space-y-3 lg:max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
                    <Trophy className="w-3.5 h-3.5" aria-hidden />
                    <span>Live aktualisierter Spielplan</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.35)]">
                    Heutiger und kommender Spielplan
                  </h1>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                    {matchCount > 0
                      ? <><span className="text-purple-200/90 font-semibold">{formattedDate}</span> – <span className="text-amber-200/90">{matchCount} Partien</span> auf einen Blick, nach Ligen gefiltert, Uhrzeiten schnell prüfbar.</>
                      : <><span className="text-purple-200/90">{formattedDate}</span> – <span className="text-emerald-300/90">Super Lig, Premier League, La Liga</span> und weitere Top-Ligen. Offizielle Spiele Schritt für Schritt verfolgen.</>}
                  </p>

                  <dl className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                      <dt className="text-slate-400">Gewähltes Datum</dt>
                      <dd className="font-semibold text-purple-200">{formattedDate}</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2">
                      <dt className="text-slate-400">Spiele gesamt</dt>
                      <dd className="font-semibold text-amber-200">{matchCount}</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2 hidden sm:block">
                      <dt className="text-slate-300 text-xs">Top-Ligen</dt>
                      <dd className="mt-0.5 text-[11px] font-medium text-emerald-200/90 leading-snug">
                        {leagueNames || 'Programm wird geladen'}
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2 hidden lg:block">
                      <dt className="text-slate-400 text-xs">Zeitraum</dt>
                      <dd className="mt-0.5 text-[11px] font-medium text-sky-200/90 leading-snug">
                        Heute + 6 Tage, nur aktuelles Programm
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="hidden lg:block lg:flex-1">
                  <div className="relative h-32 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-slate-950 flex items-center justify-center">
                    <div className="absolute -right-6 -bottom-10 h-28 w-28 rounded-full bg-purple-500/30 blur-3xl" />
                    <div className="relative text-center space-y-1">
                      <p className="text-xs uppercase tracking-[0.25em] text-purple-200/80">PrimeWatch Fixture</p>
                      <p className="text-sm text-slate-200">
                        Spielplan wird <span className="text-emerald-200/90">täglich automatisch</span> aktualisiert.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-10 -bottom-20 h-44 w-44 rounded-full bg-purple-500/10 blur-3xl" />
            </header>

            {/* Datumsauswahl */}
            <section aria-labelledby="date-selector-heading-de" className="rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-4 sm:px-6 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/40">
                  <Calendar className="w-5 h-5 text-purple-300" aria-hidden />
                </div>
                <div>
                  <h2 id="date-selector-heading-de" className="text-sm font-medium text-slate-100">Tag wählen</h2>
                  <p className="text-xs text-slate-300">
                    <span className="text-purple-200/90">Heute und die nächsten 6 Tage</span> – Fixture auf einen Blick.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto md:justify-end scrollbar-hide">
                {dateOpts.map((opt) => {
                  const isSelected = selectedDate === opt.value;
                  const isTodayOpt = opt.label.startsWith('Heute');
                  return (
                    <button
                      key={opt.value}
                      onClick={() => changeDate(opt.value)}
                      className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-transparent shadow-lg shadow-purple-500/40'
                          : isTodayOpt
                            ? 'bg-slate-900/80 text-purple-200 border-purple-500/60 hover:bg-slate-800 hover:text-white'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Status / Spiellisten */}
            {loading ? (
              <section
                aria-label="Spielplan wird geladen"
                className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 py-16 px-6 text-center"
              >
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" aria-hidden />
                <p className="text-slate-200 text-sm sm:text-base mb-1">Spielplan wird geladen...</p>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md">
                  Fixturedownload-Daten werden <span className="text-purple-200/90">sicher</span> abgerufen. Bitte warten Sie einige Sekunden.
                </p>
              </section>
            ) : error ? (
              <section
                aria-label="Fehler beim Laden der Spieldaten"
                className="rounded-3xl border border-amber-500/40 bg-amber-500/10 px-6 py-8 text-center"
              >
                <p className="text-amber-100 font-semibold mb-2 text-sm sm:text-base">Spieldaten konnten nicht geladen werden</p>
                <p className="text-amber-50/80 text-xs sm:text-sm mb-4">{error}</p>
                <p className="text-amber-100/70 text-xs max-w-md mx-auto">
                  Daten stammen von fixturedownload.com. Bei anhaltenden Problemen die Seite in einigen Minuten neu laden.
                </p>
              </section>
            ) : matches.length === 0 ? (
              <section
                aria-label="Keine Spiele am gewählten Tag"
                className="rounded-3xl border border-slate-800 bg-slate-900/70 px-8 py-16 text-center"
              >
                <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" aria-hidden />
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">An diesem Tag keine offiziellen Spiele</h2>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Am gewählten Tag sind in <span className="text-purple-200/90">Super Lig, Premier League, La Liga</span> oder anderen Top-Ligen keine offiziellen Spiele. Wählen Sie über die <span className="text-amber-200/90">Datumsleiste</span> einen anderen Tag.
                </p>
              </section>
            ) : (
              <section aria-labelledby="match-list-heading-de" className="space-y-6">
                <h2 id="match-list-heading-de" className="sr-only">Täglicher Spielplan</h2>
                {matches.map((group, groupIdx) => (
                  <section
                    key={`${group.league.slug || group.league.name}-${group.league.name}`}
                    className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70"
                    aria-labelledby={`league-de-${groupIdx}`}
                  >
                    <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden>
                          {group.league.flag}
                        </span>
                        <div>
                          <h3 id={`league-de-${groupIdx}`} className="font-semibold text-sm sm:text-base text-white">
                            {group.league.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-300">{group.league.country}</p>
                        </div>
                      </div>
                      <span className="text-[11px] sm:text-xs text-amber-200/90 font-medium">
                        {group.matches.length} Spiele
                      </span>
                    </div>

                    <ul className="divide-y divide-slate-800/60" aria-label={`${group.league.name} Spiele`}>
                      {group.matches.map((m) => {
                        const matchSlug = makeMatchSlug(m.home, m.away, selectedDate);
                        const matchData = { ...m, date: selectedDate, league: group.league };
                        return (
                          <li key={m.id} className="px-2 sm:px-3 py-2">
                            <Link
                              to={`/de/spielplan/${matchSlug}`}
                              state={{ match: matchData }}
                              className="group relative flex items-center gap-4 px-3 py-3 sm:px-4 sm:py-3"
                              aria-label={`${m.home} - ${m.away} Spielinfo, ${m.time}`}
                            >
                              <div className="absolute inset-0 rounded-2xl bg-slate-900/70 border border-slate-800 group-hover:border-purple-500/70 group-hover:bg-slate-900/95 transition-all duration-200 shadow-sm group-hover:shadow-[0_0_22px_rgba(168,85,247,0.45)]" />
                              <div className="relative flex items-center gap-4 w-full">
                                <div className="shrink-0">
                                  <span className="inline-flex items-center justify-center rounded-full border border-purple-500/60 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold text-purple-100">
                                    {m.time}
                                  </span>
                                </div>
                                <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-[11px] font-bold text-white shadow-md">
                                      {getTeamInitials(m.home)}
                                    </div>
                                    <span className="truncate font-semibold text-sm sm:text-base text-slate-50">
                                      {m.home}
                                    </span>
                                    <span className="shrink-0 text-base opacity-70" aria-hidden>⚽</span>
                                  </div>
                                  <span className="text-slate-500 shrink-0 px-2 text-xs sm:text-sm" aria-hidden>
                                    vs
                                  </span>
                                  <div className="flex items-center gap-2 min-w-0 justify-end">
                                    <span className="shrink-0 text-base opacity-70" aria-hidden>⚽</span>
                                    <span className="truncate font-semibold text-right text-sm sm:text-base text-slate-50">
                                      {m.away}
                                    </span>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 text-[11px] font-bold text-white shadow-md">
                                      {getTeamInitials(m.away)}
                                    </div>
                                  </div>
                                </div>
                                <span className="shrink-0 text-[11px] sm:text-xs text-slate-300 group-hover:text-purple-200">
                                  Details
                                </span>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </section>
            )}

            {/* SEO-Bereich */}
            <section>
              <MatchScheduleSeoSectionDE />
            </section>
          </article>
        </main>
        <FooterDE contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default MatchSchedulePageDE;
