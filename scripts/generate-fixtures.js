#!/usr/bin/env node
/**
 * Maç programı verisini fixturedownload'dan çeker, public/data/fixtures.json'a yazar.
 * Build sırasında çalışır – CORS yok (Node.js), anında yükleme için statik JSON.
 */
import fs from 'fs';
import path from 'path';
import { matchBelongsToProgramDay } from '../src/utils/fixtureProgramDay.js';

const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';
const CURRENT_SEASON = '2026';
const LEAGUES = [
  { slug: `super-lig-${CURRENT_SEASON}`, name: 'Türkiye Ligi', country: 'Türkiye', flag: '🇹🇷' },
  { slug: `epl-${CURRENT_SEASON}`, name: 'İngiltere Ligi', country: 'İngiltere', flag: '🏴' },
  { slug: `la-liga-${CURRENT_SEASON}`, name: 'İspanya Ligi', country: 'İspanya', flag: '🇪🇸' },
  { slug: `champions-league-${CURRENT_SEASON}`, name: 'Avrupa Kupası', country: 'Avrupa', flag: '🇪🇺' },
  { slug: `bundesliga-${CURRENT_SEASON}`, name: 'Almanya Ligi', country: 'Almanya', flag: '🇩🇪' },
  { slug: `serie-a-${CURRENT_SEASON}`, name: 'İtalya Ligi', country: 'İtalya', flag: '🇮🇹' },
];

function formatTime(dateUtc) {
  if (!dateUtc) return '20:00';
  const date = new Date(dateUtc.replace(' ', 'T'));
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getMatchesForDateFromCache(dateStr, leagueDataMap) {
  const byLeague = {};
  for (const league of LEAGUES) {
    const list = leagueDataMap[league.slug] || [];
    const forDate = list.filter((m) => matchBelongsToProgramDay(m, dateStr, league.slug));
    if (forDate.length === 0) continue;
    const key = `${league.slug}-${league.name}`;
    byLeague[key] = {
      league: { ...league },
      matches: forDate.map((m) => {
        const dateUtc = m.DateUtc || m.date;
        const home = m.HomeTeam || m.team1 || m.homeTeam?.name || '-';
        const away = m.AwayTeam || m.team2 || m.awayTeam?.name || '-';
        return {
          id: `${league.slug}-${m.MatchNumber || m.id || Math.random()}`,
          time: formatTime(dateUtc),
          home: typeof home === 'string' ? home : (home?.name || '-'),
          away: typeof away === 'string' ? away : (away?.name || '-'),
          status: (m.HomeTeamScore != null && m.AwayTeamScore != null) ? 'FT' : 'NS',
          league: { ...league },
        };
      }),
    };
  }
  const groups = Object.values(byLeague).sort((a, b) => {
    if (a.league.country === 'Türkiye' && b.league.country !== 'Türkiye') return -1;
    if (a.league.country !== 'Türkiye' && b.league.country === 'Türkiye') return 1;
    return a.league.name.localeCompare(b.league.name);
  });
  return groups;
}

async function fetchJsonWithRetry(url, retries = 3) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastError || new Error(`Failed after ${retries} attempts: ${url}`);
}

async function main() {
  console.log('[generate-fixtures] Başlatılıyor...');

  // Her lig verisini 84 kez yerine yalnızca birer kez paralel çek
  const leagueDataMap = {};
  await Promise.all(
    LEAGUES.map(async (league) => {
      try {
        const data = await fetchJsonWithRetry(`${FIXTURE_BASE}/${league.slug}`);
        leagueDataMap[league.slug] = Array.isArray(data) ? data : (data.matches || []);
        console.log(`  [fixtures] ${league.name} (${league.slug}): ${leagueDataMap[league.slug].length} maç çekildi`);
      } catch (e) {
        console.warn(`  [fixtures] ${league.name} atlandı:`, e.message);
      }
    })
  );

  const dates = [];
  for (let i = 0; i <= 13; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }
  const days = {};
  for (const dateStr of dates) {
    days[dateStr] = getMatchesForDateFromCache(dateStr, leagueDataMap);
  }
  const output = {
    generatedAt: new Date().toISOString(),
    days,
  };
  const outDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'fixtures.json');
  fs.writeFileSync(outPath, JSON.stringify(output), 'utf8');
  const totalMatches = Object.values(days).reduce((s, g) => s + g.reduce((a, b) => a + b.matches.length, 0), 0);
  console.log(`[generate-fixtures] Bitti. ${totalMatches} maç → ${outPath}`);
}

main().catch((err) => {
  console.error('[generate-fixtures] Hata:', err);
  process.exit(1);
});
