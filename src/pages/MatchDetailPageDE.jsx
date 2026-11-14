import React, { useMemo, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import SocialShareButtons from '@/components/SocialShareButtons';
import { useMatchBySlug } from '@/hooks/useMatchBySlug';
import { useMatchContent } from '@/hooks/useMatchContent';
import { Loader2, Trophy, ArrowLeft, Calendar, Clock, Flame, Tv } from 'lucide-react';
import { parseMatchSlug } from '@/utils/matchSlug';
import MatchDetailRelatedLinks from '@/components/match/MatchDetailRelatedLinks';
import TeamLogoOrInitials from '@/components/match/TeamLogoOrInitials';
import { useTeamLogoDisplayMode } from '@/hooks/useTeamLogoDisplayMode';
import { resolveTeamLogoUrl } from '@/utils/teamLogos';
import { matchSportsEventSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';

function formatDateForSeo(dateStr) {
  const [y, m, d] = (dateStr || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${d}. ${months[m - 1]} ${y}`;
}

/** Wichtige Begriffe hervorheben */
function highlightParagraph(text, home, away) {
  const phrases = [
    ['Derby', 'text-amber-200 font-semibold'],
    ['QruzeTV', 'text-primary font-semibold'],
  ];
  if (home) phrases.push([home, 'text-primary font-semibold']);
  if (away) phrases.push([away, 'text-white font-semibold']);
  let parts = [text];
  phrases.forEach(([phrase, cls]) => {
    if (!phrase) return;
    parts = parts.flatMap((p) =>
      typeof p === 'string' && p.includes(phrase)
        ? p.split(phrase).flatMap((seg, i) =>
            i === 0 ? [seg] : [<span key={`${phrase}-${i}`} className={cls}>{phrase}</span>, seg]
          )
        : [p]
    );
  });
  return <>{parts}</>;
}

const MatchDetailPageDE = ({ siteData }) => {
  const { slug } = useParams();
  const { state } = useLocation();
  const passedMatch = state?.match;
  const { match: fetchedMatch, loading } = useMatchBySlug(passedMatch ? null : slug);
  const match = passedMatch || fetchedMatch;
  const parsedFromSlug = useMemo(() => parseMatchSlug(slug || ''), [slug]);
  const { contactData, siteTexts } = siteData || {};

  const logoEntries = useMemo(() => {
    const tl = siteData?.team_logos;
    if (!tl) return [];
    return Array.isArray(tl.entries) ? tl.entries : Array.isArray(tl) ? tl : [];
  }, [siteData?.team_logos]);

  const logoFor = useCallback((name) => resolveTeamLogoUrl(name, logoEntries), [logoEntries]);
  const { showLogos, setShowLogos } = useTeamLogoDisplayMode();
  const logoUrlForDetail = useCallback((name) => (showLogos ? logoFor(name) : null), [showLogos, logoFor]);

  const { content, contentLoadMessage } = useMatchContent(slug, match, { locale: 'de' });

  const metadata = useMemo(() => {
    if (!match) return { title: 'Spielinfo | QruzeTV', description: 'Spielinformationen werden geladen.', canonicalUrl: `${SITE_URL}/de/spielplan` };
    const formattedDate = formatDateForSeo(match.date);
    const title = `${match.home} - ${match.away} | ${match.league.name} ${formattedDate} | QruzeTV`;
    const description = `${formattedDate} ${match.time} – ${match.home} vs ${match.away}. ${match.league.name}. Live auf Sportkanälen mit QruzeTV IPTV.`;
    return {
      title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
      description: description.substring(0, 160),
      keywords: [match.home, match.away, match.league.name, 'Spiel schauen', 'welcher Sender', 'QruzeTV'],
      canonicalUrl: `${SITE_URL}/de/spielplan/${slug}`,
      noindex: true,
    };
  }, [match, slug]);

  const jsonLd = useMemo(() => {
    if (!match) return [];
    const currentUrl = `${SITE_URL}/de/spielplan/${slug}`;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${SITE_URL}/de` },
          { '@type': 'ListItem', position: 2, name: 'Spielplan', item: `${SITE_URL}/de/spielplan` },
          { '@type': 'ListItem', position: 3, name: `${match.home} - ${match.away}`, item: currentUrl },
        ],
      },
      matchSportsEventSchema({ match, url: currentUrl, locale: 'de' }),
    ];
  }, [match, slug]);

  const schedulePath = useMemo(() => {
    const date = match?.date || parsedFromSlug?.date;
    return date ? `/de/spielplan?date=${date}` : '/de/spielplan';
  }, [match?.date, parsedFromSlug?.date]);

  if (!passedMatch && loading) {
    return (
      <>
      <SEOHead
        title="Spielinformationen werden geladen | QruzeTV"
        description="Spieldetails werden geladen. Spielinformationen und Senderhinweise werden vorbereitet."
        pageData={{ isAutoGenerated: true }}
      />
      <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,_#2a0a0a_0,_#020617_55%)] flex flex-col text-white">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-slate-200 font-medium">Spielinformationen werden geladen...</p>
          <p className="text-slate-400 text-sm mt-1">Spieldetails werden vorbereitet</p>
        </main>
      </div>
      </>
    );
  }

  if (!match) {
    return (
      <>
      <SEOHead
        title="Spiel nicht gefunden | QruzeTV"
        description="Dieses Spiel wurde nicht gefunden oder die Information ist nicht mehr verfügbar. Kehren Sie zum Spielplan zurück."
        pageData={{ isAutoGenerated: true }}
      />
      <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,_#2a0a0a_0,_#020617_55%)] flex flex-col text-white">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-16 px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0a0a0a]/80 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-xl font-bold mb-4 text-white">Spiel nicht gefunden</h1>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Die gesuchte Spielinformation ist nicht verfügbar oder das Datum liegt in der Vergangenheit.</p>
          <Link
            to={schedulePath}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück zum Spielplan
          </Link>
        </main>
      </div>
      </>
    );
  }

  const formattedDate = formatDateForSeo(match.date);
  const { paragraphs = [], isDerbi = false } = content || {};

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} noindex={metadata.noindex} pageData={{ isAutoGenerated: true }} />

      <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,_#2a0a0a_0,_#020617_55%)] flex flex-col text-white selection:bg-white/20 relative">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[90rem] mx-auto w-full relative z-10">
          <BreadcrumbNavigation customCrumbs={[
            { name: 'Startseite', path: '/de' },
            { name: 'Spielplan', path: schedulePath },
            { name: `${match.home} - ${match.away}`, path: null },
          ]} />

          {contentLoadMessage && (
            <div
              className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100 text-sm"
              role="alert"
            >
              {contentLoadMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <Link
              to={schedulePath}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Zurück zum Spielplan
            </Link>
            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
              <div
                className="flex rounded-lg bg-[#0a0a0a]/90 p-0.5 border border-slate-600/60 shrink-0"
                role="group"
                aria-label="Team-Abzeichen: Logo oder Kürzel"
              >
                <button
                  type="button"
                  onClick={() => setShowLogos(true)}
                  aria-pressed={showLogos}
                  className={`rounded-md py-1.5 px-2.5 text-xs font-bold transition-all ${
                    showLogos
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Logo
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogos(false)}
                  aria-pressed={!showLogos}
                  className={`rounded-md py-1.5 px-2.5 text-xs font-bold transition-all ${
                    !showLogos
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kürzel
                </button>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a0a0a]/80 border border-slate-700">
                <Clock className="w-4 h-4 text-primary" />
                <time className="text-primary font-bold text-lg" dateTime={match.date}>{match.time}</time>
              </div>
            </div>
          </div>

          <article className="overflow-hidden rounded-3xl border border-slate-800 shadow-xl shadow-primary/10">
            {/* Spielkarte - Hero */}
            <div className="relative bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a]/95 to-[#141414] border-b border-slate-800 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-2xl" aria-hidden>{match.league.flag}</span>
                      <span className="text-slate-300 text-base ml-2 font-medium">{match.league.name}</span>
                      {match.league.country && (
                        <span className="text-slate-500 text-xs ml-2">• {match.league.country}</span>
                      )}
                    </div>
                  </div>
                  {isDerbi && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold">
                      <Flame className="w-3.5 h-3.5" /> Derby
                    </span>
                  )}
                </div>

                {/* Teams – zentriert */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-end">
                    <TeamLogoOrInitials teamName={match.home} logoUrl={logoUrlForDetail(match.home)} variant="home" size="lg" />
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center sm:text-right break-words" title={match.home}>{match.home}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">vs</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-start">
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center sm:text-left order-2 sm:order-1 break-words" title={match.away}>{match.away}</p>
                    <TeamLogoOrInitials teamName={match.away} logoUrl={logoUrlForDetail(match.away)} variant="away" size="lg" className="order-1 sm:order-2" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-5 text-slate-400 text-base">
                  <Calendar className="w-5 h-5 text-primary/80" />
                  <span className="text-primary/90 font-medium">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Über das Spiel – schönes Karten-Design, FAB-Überlappung vermeiden */}
            <div className="relative p-6 sm:p-8 lg:p-12 pr-20 sm:pr-8 lg:pr-12 bg-gradient-to-br from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#141414]/60 border-t border-slate-800/80">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b from-[#e50914]/60 via-[#e50914]/40 to-transparent" aria-hidden />
              <div className="relative pl-4 sm:pl-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  Über das Spiel
                </h2>
                <div className="space-y-5">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-slate-200 leading-[1.85] text-base sm:text-lg lg:text-xl">
                      {highlightParagraph(p, match.home, match.away)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Senderinfo */}
            <div className="p-6 sm:p-8 lg:p-12 pr-20 sm:pr-8 lg:pr-12 bg-[#0a0a0a]/40 border-t border-slate-800">
              <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                <Tv className="w-6 h-6 text-primary" />
                Auf welchem Sender?
              </h2>
              <p className="text-slate-100 text-base sm:text-lg lg:text-xl mb-5 leading-[1.8]">
                {match.league.country === 'Türkiye'
                  ? <>Super-Lig-Spiele werden live auf Sportkanälen übertragen. Welcher Sender, wann? Das wöchentliche Programm enthält aktuelle Infos.</>
                  : <>Europäische Ligen sind auf Sportkanälen und digitalen Plattformen verfügbar. Senderinfos werden im wöchentlichen Programm aktualisiert.</>}
              </p>
              <p className="text-slate-100 text-base sm:text-lg lg:text-xl mb-6 leading-[1.8]">
                Mit einem <span className="text-primary font-semibold">QruzeTV</span> IPTV-Abo haben Sie unterbrechungsfreien Zugang zu allen Sportkanälen.
              </p>
              <Link
                to="/de/pakete/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary text-white font-semibold transition-colors"
              >
                Pakete ansehen
              </Link>
            </div>

            {/* Share Buttons */}
            <div className="p-6 sm:p-8 lg:p-12 bg-[#0a0a0a]/40 border-t border-slate-800">
              <SocialShareButtons
                url={metadata.canonicalUrl}
                title={metadata.title}
                description={metadata.description}
                locale="de"
              />
            </div>

            {/* SEO: Verwandte Seiten verlinken */}
            <MatchDetailRelatedLinks locale="de" />
          </article>
        </main>
        <FooterDE contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default MatchDetailPageDE;
