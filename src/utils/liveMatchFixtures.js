/** Fixturedownload.com — tarayıcıdan çekim (dev: Vite proxy, prod: CORS proxy). */

import { matchBelongsToProgramDay } from '@/utils/fixtureProgramDay';

const FIXTURE_ORIGIN = 'https://fixturedownload.com/feed/json';
const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const FETCH_TIMEOUT_MS = 15000;
const FETCH_RETRIES = 2;

/**
 * `slug` = fixturedownload uç noktası (değiştirilemez, veri kaynağı buna bağlı).
 * `name` = kullanıcıya gösterilen etiket; telif/marka riski taşımaması için
 * tescilli lig adları yerine coğrafi-tanımlayıcı jenerik karşılıklar kullanılır.
 */
export const CURRENT_FOOTBALL_SEASON = '2026';

export const FOOTBALL_LEAGUES = [
  { slug: `super-lig-${CURRENT_FOOTBALL_SEASON}`, name: 'Türkiye Ligi', country: 'Türkiye', flag: '🇹🇷' },
  { slug: `epl-${CURRENT_FOOTBALL_SEASON}`, name: 'İngiltere Ligi', country: 'İngiltere', flag: '🏴' },
  { slug: `la-liga-${CURRENT_FOOTBALL_SEASON}`, name: 'İspanya Ligi', country: 'İspanya', flag: '🇪🇸' },
  { slug: `champions-league-${CURRENT_FOOTBALL_SEASON}`, name: 'Avrupa Kupası', country: 'Avrupa', flag: '🇪🇺' },
  { slug: `bundesliga-${CURRENT_FOOTBALL_SEASON}`, name: 'Almanya Ligi', country: 'Almanya', flag: '🇩🇪' },
  { slug: `serie-a-${CURRENT_FOOTBALL_SEASON}`, name: 'İtalya Ligi', country: 'İtalya', flag: '🇮🇹' },
];

export { matchBelongsToProgramDay } from '@/utils/fixtureProgramDay';

/** Önce same-origin (Node veya Vite proxy), olmazsa herkese açık CORS proxy. */
function getFixtureUrls(leagueSlug) {
  const fullUrl = `${FIXTURE_ORIGIN}/${leagueSlug}`;
  const sameOrigin = `/api/fixtures/${leagueSlug}`;
  return [sameOrigin, ...CORS_PROXIES.map((fn) => fn(fullUrl))];
}

/** Tek lig JSON’u (maç detay / arama); tüm yedek URL’leri dener. */
export async function fetchLeagueFixturesJson(leagueSlug) {
  for (const url of getFixtureUrls(leagueSlug)) {
    try {
      const res = await fetchWithRetry(url);
      if (!res.ok) continue;
      const data = await res.json();
      return data;
    } catch {
      continue;
    }
  }
  return null;
}

async function fetchWithRetry(url, { timeout = FETCH_TIMEOUT_MS, retries = FETCH_RETRIES } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(id);
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function formatTime(dateUtc) {
  if (!dateUtc) return '--:--';
  const date = new Date(String(dateUtc).replace(' ', 'T'));
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

/**
 * Belirli bir takvim günü (YYYY-MM-DD) için gruplu futbol fikstürü.
 * Gün eşlemesi: fixtureProgramDay.js (Türkiye Ligi Nisan 2026+ kaynak düzeltmesi dahil).
 */
export async function fetchGroupedFootballMatches(dateStr) {
  const fetchOneLeague = async (league) => {
    const urls = getFixtureUrls(league.slug);
    let lastErr;
    for (const url of urls) {
      try {
        const res = await fetchWithRetry(url);
        if (!res.ok) continue;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.matches || []);
        const forDate = list.filter((m) => matchBelongsToProgramDay(m, dateStr, league.slug));
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
        lastErr = e;
        continue;
      }
    }
    console.warn(`Lig ${league.name} yüklenemedi:`, lastErr?.message);
    return null;
  };

  const BATCH_SIZE = 2;
  const results = [];
  for (let i = 0; i < FOOTBALL_LEAGUES.length; i += BATCH_SIZE) {
    const batch = FOOTBALL_LEAGUES.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map((l) => fetchOneLeague(l)));
    results.push(...batchResults);
  }

  const allFetchesFailed = results.every((r) => r === null);
  if (allFetchesFailed) {
    throw new Error('Maç verisi şu an yüklenemiyor. İnternet bağlantınızı kontrol edip yeniden deneyin.');
  }
  const allMatches = results.filter((r) => Array.isArray(r)).flat();

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
}
