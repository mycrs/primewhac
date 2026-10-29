#!/usr/bin/env node
/**
 * Basketbol maç programını çeker, public/data/fixtures-basketball.json'a yazar.
 *
 * Kaynaklar:
 *   - fixturedownload.com → NBA, WNBA, NBL
 *   - TheSportsDB (round-by-round) → EuroLeague, EuroCup, Turkish BSL
 */
import fs from 'fs';
import path from 'path';

const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';
const SPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const FETCH_TIMEOUT_MS = 20000;
const SPORTSDB_DELAY_MS = 900;
const MAX_ROUNDS = 50;
const MAX_EMPTY_STREAK = 4;

const FIXTUREDOWNLOAD_LEAGUES = [
  { slug: 'nbl-2026', name: 'NBL', country: 'Avustralya', flag: '🇦🇺' },
  { slug: 'nba-2025', name: 'NBA', country: 'ABD', flag: '🇺🇸' },
  { slug: 'nba-2024', name: 'NBA', country: 'ABD', flag: '🇺🇸' },
  { slug: 'wnba-2025', name: 'WNBA', country: 'ABD', flag: '🇺🇸' },
  { slug: 'wnba-2024', name: 'WNBA', country: 'ABD', flag: '🇺🇸' },
  { slug: 'nbl-2025', name: 'NBL', country: 'Avustralya', flag: '🇦🇺' },
  { slug: 'nbl-2024', name: 'NBL', country: 'Avustralya', flag: '🇦🇺' },
];

const SPORTSDB_LEAGUES = [
  { id: '4546', name: 'EuroLeague', country: 'Avrupa', flag: '🇪🇺', seasons: ['2026', '2025'] },
  { id: '4547', name: 'EuroCup', country: 'Avrupa', flag: '🇪🇺', seasons: ['2026', '2025'] },
  { id: '4475', name: 'BSL', country: 'Türkiye', flag: '🇹🇷', seasons: ['2026-2027', '2025-2026', '2026', '2025'] },
  { id: '4548', name: 'FIBA Champions League', country: 'Avrupa', flag: '🏆', seasons: ['2026-2027', '2025-2026', '2026', '2025'] },
];

function formatTime(dateUtc) {
  if (!dateUtc) return '20:00';
  const date = new Date(String(dateUtc).replace(' ', 'T'));
  if (isNaN(date.getTime())) return '20:00';
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

function formatDate(d) {
  return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function sortGroups(groups) {
  const priority = { 'Türkiye': 0, 'Avrupa': 1 };
  return groups.sort((a, b) => {
    const pa = priority[a.league.country] ?? 2;
    const pb = priority[b.league.country] ?? 2;
    if (pa !== pb) return pa - pb;
    return a.league.name.localeCompare(b.league.name);
  });
}

async function fetchWithTimeout(url) {
  let timeoutId;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } catch (e) {
    return null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function fetchFixturedownload(league) {
  const res = await fetchWithTimeout(`${FIXTURE_BASE}/${league.slug}`);
  if (!res || !res.ok) return [];
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : (data.matches || []);
  } catch {
    return [];
  }
}

async function fetchSportsDBRounds(league) {
  const allEvents = [];
  for (const season of league.seasons) {
    let emptyStreak = 0;
    for (let r = 1; r <= MAX_ROUNDS; r++) {
      const res = await fetchWithTimeout(`${SPORTSDB_BASE}/eventsround.php?id=${league.id}&r=${r}&s=${season}`);
      if (!res || !res.ok) { emptyStreak++; if (emptyStreak >= MAX_EMPTY_STREAK) break; await sleep(SPORTSDB_DELAY_MS); continue; }
      try {
        const text = await res.text();
        if (text.startsWith('<')) { emptyStreak++; if (emptyStreak >= MAX_EMPTY_STREAK) break; await sleep(SPORTSDB_DELAY_MS); continue; }
        const data = JSON.parse(text);
        const events = data.events || [];
        if (events.length === 0) { emptyStreak++; if (emptyStreak >= MAX_EMPTY_STREAK) break; } else { emptyStreak = 0; allEvents.push(...events); }
      } catch { emptyStreak++; if (emptyStreak >= MAX_EMPTY_STREAK) break; }
      await sleep(SPORTSDB_DELAY_MS);
    }
    if (allEvents.length > 0) break;
  }
  return allEvents;
}

function parseSportsDBTime(event) {
  const ts = event.strTimestamp || event.dateEvent;
  if (!ts) return '20:00';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '20:00';
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

function parseSportsDBTeams(event) {
  let home = event.strHomeTeam || '';
  let away = event.strAwayTeam || '';
  if (!home && !away && event.strEvent) {
    const parts = event.strEvent.split(/\s+vs\s+/i);
    if (parts.length === 2) { home = parts[0].trim(); away = parts[1].trim(); }
  }
  return { home: home || '-', away: away || '-' };
}

async function main() {
  console.log('[generate-fixtures-basketball] Başlatılıyor...');

  const dates = [];
  for (let i = 0; i <= 364; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }
  const days = {};
  for (const dateStr of dates) days[dateStr] = [];

  // 1) fixturedownload.com — NBA / WNBA / NBL
  for (const league of FIXTUREDOWNLOAD_LEAGUES) {
    const list = await fetchFixturedownload(league);
    console.log(`  [fixturedownload] ${league.name} (${league.slug}): ${list.length} maç`);
    const groupsByDate = {};

    for (const match of list) {
      const matchDate = (match.DateUtc || match.date || '').toString().split(' ')[0].split('T')[0];
      if (!days[matchDate]) continue;

      const key = `${matchDate}:${league.slug}`;
      if (!groupsByDate[key]) {
        groupsByDate[key] = { league: { slug: league.slug, name: league.name, country: league.country, flag: league.flag }, matches: [] };
      }

      const dateUtc = match.DateUtc || match.date;
      const home = match.HomeTeam || match.team1 || match.homeTeam?.name || '-';
      const away = match.AwayTeam || match.team2 || match.awayTeam?.name || '-';

      groupsByDate[key].matches.push({
        id: `${league.slug}-${match.MatchNumber || match.id || Math.random()}`,
        time: formatTime(dateUtc),
        home: typeof home === 'string' ? home : (home?.name || '-'),
        away: typeof away === 'string' ? away : (away?.name || '-'),
        status: (match.HomeTeamScore != null && match.AwayTeamScore != null) ? 'FT' : 'NS',
        league: { slug: league.slug, name: league.name, country: league.country, flag: league.flag },
      });
    }

    for (const [key, group] of Object.entries(groupsByDate)) {
      const dateStr = key.split(':')[0];
      days[dateStr].push(group);
    }
  }

  // 2) TheSportsDB — EuroLeague / EuroCup / BSL / FIBA CL
  for (let li = 0; li < SPORTSDB_LEAGUES.length; li++) {
    if (li > 0) await sleep(5000);
    const league = SPORTSDB_LEAGUES[li];
    const events = await fetchSportsDBRounds(league);
    console.log(`  [sportsdb] ${league.name}: ${events.length} etkinlik`);
    const groupsByDate = {};

    for (const event of events) {
      const matchDate = (event.dateEvent || '').split('T')[0];
      if (!days[matchDate]) continue;

      const key = `${matchDate}:sdb-${league.id}`;
      if (!groupsByDate[key]) {
        groupsByDate[key] = { league: { slug: `sdb-${league.id}`, name: league.name, country: league.country, flag: league.flag }, matches: [] };
      }

      const { home, away } = parseSportsDBTeams(event);
      groupsByDate[key].matches.push({
        id: `sdb-${league.id}-${event.idEvent || Math.random()}`,
        time: parseSportsDBTime(event),
        home,
        away,
        status: event.intHomeScore != null ? 'FT' : 'NS',
        league: { slug: `sdb-${league.id}`, name: league.name, country: league.country, flag: league.flag },
      });
    }

    for (const [key, group] of Object.entries(groupsByDate)) {
      const dateStr = key.split(':')[0];
      days[dateStr].push(group);
    }
  }

  for (const dateStr of dates) {
    days[dateStr] = sortGroups(days[dateStr]);
  }

  const output = { generatedAt: new Date().toISOString(), days };
  const outDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'fixtures-basketball.json');
  fs.writeFileSync(outPath, JSON.stringify(output), 'utf8');
  const totalMatches = Object.values(days).reduce((s, g) => s + g.reduce((a, b) => a + b.matches.length, 0), 0);
  console.log(`[generate-fixtures-basketball] Bitti. ${totalMatches} maç → ${outPath}`);
}

main().catch((err) => {
  console.error('[generate-fixtures-basketball] Hata:', err);
  process.exit(1);
});
