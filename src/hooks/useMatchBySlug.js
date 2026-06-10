import { useState, useEffect, useCallback } from 'react';
import { parseMatchSlug, makeMatchSlug } from '@/utils/matchSlug';
import { fetchLeagueFixturesJson } from '@/utils/liveMatchFixtures';
import { matchBelongsToProgramDay } from '@/utils/fixtureProgramDay';

const LEAGUES = [
  { slug: 'super-lig-2025', name: 'Süper Lig', country: 'Türkiye', flag: '🇹🇷' },
  { slug: 'epl-2025', name: 'Premier Lig', country: 'İngiltere', flag: '🏴' },
  { slug: 'la-liga-2025', name: 'La Liga', country: 'İspanya', flag: '🇪🇸' },
  { slug: 'champions-league-2025', name: 'Şampiyonlar Ligi', country: 'Avrupa', flag: '🇪🇺' },
  { slug: 'bundesliga-2025', name: 'Bundesliga', country: 'Almanya', flag: '🇩🇪' },
  { slug: 'serie-a-2025', name: 'Serie A', country: 'İtalya', flag: '🇮🇹' },
];

function formatTime(dateUtc) {
  if (!dateUtc) return '--:--';
  const date = new Date(dateUtc.replace(' ', 'T'));
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

export function useMatchBySlug(slug) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatch = useCallback(async (s) => {
    const parsed = parseMatchSlug(s);
    if (!parsed) {
      setMatch(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const results = await Promise.all(
      LEAGUES.map(async (league) => {
        try {
          const data = await fetchLeagueFixturesJson(league.slug);
          if (!data) return [];
          const list = Array.isArray(data) ? data : (data.matches || []);
          return list
            .filter((m) => matchBelongsToProgramDay(m, parsed.date, league.slug))
            .map((m) => {
              const dateUtc = m.DateUtc || m.date;
              const home = m.HomeTeam || m.team1 || m.homeTeam?.name || '-';
              const away = m.AwayTeam || m.team2 || m.awayTeam?.name || '-';
              return {
                id: `${league.slug}-${m.MatchNumber || m.id || Math.random()}`,
                time: formatTime(dateUtc),
                home: typeof home === 'string' ? home : (home?.name || '-'),
                away: typeof away === 'string' ? away : (away?.name || '-'),
                homeLogo: null,
                awayLogo: null,
                status: (m.HomeTeamScore != null && m.AwayTeamScore != null) ? 'FT' : 'NS',
                league: { ...league },
                date: parsed.date,
              };
            });
        } catch (e) {
          return [];
        }
      })
    );
    const allMatches = results.flat();
    const found = allMatches.find((m) => makeMatchSlug(m.home, m.away, parsed.date) === s) || null;
    setMatch(found);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (slug) fetchMatch(slug);
    else {
      setMatch(null);
      setLoading(false);
    }
  }, [slug, fetchMatch]);

  return { match, loading, error };
}
