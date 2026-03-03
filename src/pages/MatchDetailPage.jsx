import React, { useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { useMatchBySlug } from '@/hooks/useMatchBySlug';
import { useMatchContent } from '@/hooks/useMatchContent';
import { Loader2, Trophy, ArrowLeft, Calendar, Clock, Flame, Tv } from 'lucide-react';
import { parseMatchSlug } from '@/utils/matchSlug';

const SITE_URL = 'https://primewatch.tv';

function formatDateForSeo(dateStr) {
  const [y, m, d] = (dateStr || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${d} ${months[m - 1]} ${y}`;
}

function getTeamInitials(name) {
  const parts = String(name || '').split(' ').filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Futbol topu ikonu - hafif bounce (GIF benzeri animasyon) */
function FootballIcon({ className = 'w-6 h-6' }) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ animation: 'football-bounce 2.5s ease-in-out infinite' }}
      aria-hidden
    >
      ⚽
    </span>
  );
}

/** Sadece önemli ifadeleri vurgular */
function highlightParagraph(text, home, away) {
  const phrases = [
    ['derbi', 'text-amber-200/90 font-semibold'],
    ['Derbi', 'text-amber-200/90 font-semibold'],
    ['PrimeWatch TV', 'text-purple-200/90 font-semibold'],
  ];
  if (home) phrases.push([home, 'text-purple-200/90 font-semibold']);
  if (away) phrases.push([away, 'text-sky-200/90 font-semibold']);
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

const MatchDetailPage = ({ siteData }) => {
  const { slug } = useParams();
  const { state } = useLocation();
  const passedMatch = state?.match;
  const { match: fetchedMatch, loading } = useMatchBySlug(passedMatch ? null : slug);
  const match = passedMatch || fetchedMatch;
  const parsedFromSlug = useMemo(() => parseMatchSlug(slug || ''), [slug]);
  const { contactData, siteTexts } = siteData || {};

  const { content } = useMatchContent(slug, match);

  const isPastMatch = useMemo(() => {
    if (!match?.date) return false;
    const [y, m, d] = match.date.split('-').map(Number);
    const matchDate = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate < today;
  }, [match?.date]);

  const metadata = useMemo(() => {
    if (!match) return { title: 'Maç Detayı | PrimeWatch TV', description: 'Maç bilgisi yükleniyor.', canonicalUrl: `${SITE_URL}/mac-programi` };
    const formattedDate = formatDateForSeo(match.date);
    const title = `${match.home} - ${match.away} | ${match.league.name} ${formattedDate} | PrimeWatch TV`;
    const description = `${formattedDate} ${match.time} - ${match.home} vs ${match.away} maçı. ${match.league.name}. Spor kanallarında PrimeWatch TV IPTV ile canlı izleyin.`;
    return {
      title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
      description: description.substring(0, 160),
      keywords: [match.home, match.away, match.league.name, 'maç izle', 'hangi kanalda', 'PrimeWatch TV'],
      canonicalUrl: `${SITE_URL}/mac-programi/${slug}`,
      noindex: isPastMatch,
    };
  }, [match, slug, isPastMatch]);

  const jsonLd = useMemo(() => {
    if (!match) return [];
    const [y, mo, d] = (match.date || '').split('-');
    const [h, min] = (match.time || '20:00').split(':');
    const startDate = `${y}-${mo}-${d}T${(h || '20').padStart(2, '0')}:${(min || '00').padStart(2, '0')}:00+03:00`;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Maç Programı', item: `${SITE_URL}/mac-programi` },
          { '@type': 'ListItem', position: 3, name: `${match.home} - ${match.away}`, item: `${SITE_URL}/mac-programi/${slug}` },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: `${match.home} - ${match.away}`,
        sport: 'Soccer',
        startDate,
        homeTeam: { '@type': 'SportsTeam', name: match.home },
        awayTeam: { '@type': 'SportsTeam', name: match.away },
        organizer: { '@type': 'SportsOrganization', name: match.league.name },
      },
    ];
  }, [match, slug]);

  const schedulePath = useMemo(() => {
    const date = match?.date || parsedFromSlug?.date;
    return date ? `/mac-programi?date=${date}` : '/mac-programi';
  }, [match?.date, parsedFromSlug?.date]);

  if (!passedMatch && loading) {
    return (
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#4c1d95_0,_#020617_55%)] flex flex-col text-white">
        <Header contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-16 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
          <p className="text-slate-200 font-medium">Maç bilgisi yükleniyor...</p>
          <p className="text-slate-400 text-sm mt-1">Karşılaşma detayları hazırlanıyor</p>
        </main>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#4c1d95_0,_#020617_55%)] flex flex-col text-white">
        <Header contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-16 px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-xl font-bold mb-4 text-white">Maç bulunamadı</h1>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">Aradığınız maç bilgisi mevcut değil veya tarih geçmiş olabilir.</p>
          <Link
            to={schedulePath}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Maç programına dön
          </Link>
        </main>
      </div>
    );
  }

  const formattedDate = formatDateForSeo(match.date);
  const { paragraphs = [], isDerbi = false } = content || {};

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} noindex={metadata.noindex} />

      <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#4c1d95_0,_#020617_55%)] flex flex-col text-white selection:bg-purple-500/30">
        <style>{`
          @keyframes football-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
        <Header contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[90rem] mx-auto w-full">
          <BreadcrumbNavigation customCrumbs={[
            { name: 'Ana Sayfa', path: '/' },
            { name: 'Maç Programı', path: schedulePath },
            { name: `${match.home} - ${match.away}`, path: null },
          ]} />

          <Link
            to={schedulePath}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-purple-200 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Maç programına dön
          </Link>

          <article className="overflow-hidden rounded-3xl border border-slate-800 shadow-xl shadow-purple-900/10">
            {/* Maç kartı - Hero */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-purple-300" />
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
                      <Flame className="w-3.5 h-3.5" /> Derbi
                    </span>
                  )}
                </div>

                {/* Takımlar ve saat */}
                <div className="flex items-center justify-between gap-4 sm:gap-6 flex-wrap">
                  <div className="flex-1 min-w-0 flex items-center justify-center gap-3">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-base font-bold text-white shadow-lg shadow-purple-500/30">
                      {getTeamInitials(match.home)}
                    </div>
                    <p className="text-xl sm:text-2xl font-bold truncate text-slate-50">{match.home}</p>
                    <FootballIcon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400/80" />
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700">
                      <Clock className="w-4 h-4 text-purple-300" />
                      <time className="text-purple-200 font-bold text-2xl" dateTime={match.date}>{match.time}</time>
                    </div>
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">vs</span>
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-center gap-3">
                    <FootballIcon className="w-6 h-6 sm:w-7 sm:h-7 text-sky-400/80 shrink-0" />
                    <p className="text-xl sm:text-2xl font-bold truncate text-slate-50 text-right">{match.away}</p>
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-600 text-base font-bold text-white shadow-lg shadow-sky-500/30">
                      {getTeamInitials(match.away)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-5 text-slate-400 text-base">
                  <Calendar className="w-5 h-5 text-purple-300/80" />
                  <span className="text-purple-200/90 font-medium">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Maç hakkında – tek blok, tutarlı metin */}
            <div className="p-6 sm:p-8 lg:p-12 bg-slate-900/30">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-purple-400" />
                Maç Hakkında
              </h2>
              <div className="prose prose-invert max-w-none space-y-5">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-slate-200 leading-relaxed text-lg sm:text-xl">
                    {highlightParagraph(p, match.home, match.away)}
                  </p>
                ))}
              </div>
            </div>

            {/* Kanal bilgisi */}
            <div className="p-6 sm:p-8 lg:p-12 bg-slate-800/30 border-t border-slate-800">
              <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                <Tv className="w-6 h-6 text-purple-400" />
                Hangi kanalda izlenir?
              </h2>
              <p className="text-slate-200 text-lg sm:text-xl mb-5 leading-relaxed">
                {match.league.country === 'Türkiye'
                  ? <>Süper Lig maçları spor kanallarında canlı yayınlanır. Hangi kanalda, saat kaçta? Haftalık programda güncel bilgiler yer alır.</>
                  : <>Avrupa ligleri spor kanalları ve dijital platformlarda izlenebilir. Yayın bilgisi haftalık programda güncellenir.</>}
              </p>
              <p className="text-slate-300 text-lg sm:text-xl mb-6 leading-relaxed">
                <span className="text-purple-200/90 font-semibold">PrimeWatch TV</span> IPTV aboneliği ile tüm spor kanallarına kesintisiz erişim sağlayın.
              </p>
              <Link
                to="/paketler"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
              >
                Paketleri İncele
              </Link>
            </div>
          </article>
        </main>
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default MatchDetailPage;
