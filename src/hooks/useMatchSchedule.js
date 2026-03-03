import { useState, useEffect, useCallback } from 'react';

/** Fixturedownload.com - Ücretsiz, güncel maç programı. API key gerekmez. Proxy ile CORS bypass. */
const FIXTURE_BASE = import.meta.env.DEV ? '/api/fixtures' : 'https://fixturedownload.com/feed/json';

const LEAGUES = [
  { slug: 'super-lig-2025', name: 'Süper Lig', country: 'Türkiye', flag: '🇹🇷' },
  { slug: 'epl-2024', name: 'Premier Lig', country: 'İngiltere', flag: '🏴' },
  { slug: 'la-liga-2025', name: 'La Liga', country: 'İspanya', flag: '🇪🇸' },
  { slug: 'champions-league-2025', name: 'Şampiyonlar Ligi', country: 'Avrupa', flag: '🇪🇺' },
  { slug: 'bundesliga-2025', name: 'Bundesliga', country: 'Almanya', flag: '🇩🇪' },
  { slug: 'serie-a-2025', name: 'Serie A', country: 'İtalya', flag: '🇮🇹' },
];

function formatDate(d) {
  const date = new Date(d);
  return date.toISOString().split('T')[0];
}

/** DateUtc "2025-03-03 18:30:00Z" -> Istanbul saati HH:mm */
function formatTime(dateUtc) {
  if (!dateUtc) return '--:--';
  const date = new Date(dateUtc.replace(' ', 'T'));
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

export function useMatchSchedule() {
  const getInitialDate = () => {
    const today = formatDate(new Date());
    if (typeof window === 'undefined') return today;
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get('date');
      return fromUrl || today;
    } catch {
      return today;
    }
  };

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getInitialDate);

  const fetchFixtures = useCallback(async (date) => {
    // Tüm lig isteklerini paralel çalıştır
    const results = await Promise.all(
      LEAGUES.map(async (league) => {
        try {
          const res = await fetch(`${FIXTURE_BASE}/${league.slug}`);
          if (!res.ok) return [];
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.matches || []);
          const forDate = list.filter((m) => {
            const matchDate = (m.DateUtc || m.date || '').toString().split(' ')[0].split('T')[0];
            return matchDate === date;
          });
          return forDate.map((m) => {
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
            };
          });
        } catch (e) {
          console.warn(`Lig ${league.name} yüklenemedi:`, e.message);
          return [];
        }
      })
    );

    const allMatches = results.flat();

    const byLeague = {};
    allMatches.forEach((m) => {
      const key = `${m.league.slug}-${m.league.name}`;
      if (!byLeague[key]) byLeague[key] = { league: m.league, matches: [] };
      byLeague[key].matches.push(m);
    });

    return Object.values(byLeague).sort((a, b) => {
      if (a.league.country === 'Türkiye' && b.league.country !== 'Türkiye') return -1;
      if (a.league.country !== 'Türkiye' && b.league.country === 'Türkiye') return 1;
      return a.league.name.localeCompare(b.league.name);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFixtures(selectedDate)
      .then((data) => setMatches(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedDate, fetchFixtures]);

  const changeDate = (dateStr) => {
    setSelectedDate(dateStr);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('date', dateStr);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore URL update errors
      }
    }
  };

  const getDateOptions = (locale = 'tr') => {
    const opts = [];
    const isDe = locale === 'de';
    const shortDay = isDe ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] : ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const todayLabel = isDe ? 'Heute' : 'Bugün';
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      opts.push({
        value: formatDate(d),
        label: i === 0 ? `${todayLabel} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}` : `${shortDay[d.getDay()]} ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      });
    }
    return opts;
  };

  return { matches, loading, error, selectedDate, changeDate, getDateOptions };
}
