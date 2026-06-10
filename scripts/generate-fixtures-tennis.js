#!/usr/bin/env node
/**
 * Tenis maç programını TheSportsDB API'den çeker, public/data/fixtures-tennis.json'a yazar.
 * Round-by-round yaklaşım: eventsseason (15 limit) yerine eventsround ile tüm turları çeker.
 * ATP World Tour (4464) + WTA Tour (4517).
 * NOT: TheSportsDB ücretsiz API'de veri gecikmeli eklenir; bazı tarihler boş kalabilir.
 */
import fs from 'fs';
import path from 'path';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const FETCH_TIMEOUT_MS = 15000;
const REQUEST_DELAY_MS = 600;

const TENNIS_LEAGUES = [
  { id: '4464', name: 'ATP', label: 'ATP World Tour', flag: '🎾' },
  { id: '4517', name: 'WTA', label: 'WTA Tour', flag: '🎾' },
];

const MAX_ROUNDS = 60;
const MAX_EMPTY_ROUNDS = 5;

function formatDate(d) {
  return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractTournamentAndPlayers(event) {
  const desc = event.strDescriptionEN || '';
  const evName = event.strEvent || '';

  let tournament = '';
  let player1 = '';
  let player2 = '';

  const descLines = desc.split('\n').map((l) => l.replace(/\r/g, '').trim()).filter(Boolean);
  if (descLines.length > 0) {
    const dashParts = descLines[0].split(' - ');
    if (dashParts.length >= 1) tournament = dashParts[0].trim();
  }

  const vsMatch = evName.match(/^(.+?)\s+(.+?)\s+vs\s+(.+)$/i);
  if (vsMatch) {
    if (!tournament) tournament = vsMatch[1].trim();
    player1 = vsMatch[2].trim();
    player2 = vsMatch[3].trim();
  } else {
    const simpleVs = evName.split(/\s+vs\s+/i);
    if (simpleVs.length === 2) {
      player1 = simpleVs[0].trim();
      player2 = simpleVs[1].trim();
    }
  }

  if (!tournament && event.strVenue) tournament = event.strVenue;
  if (!tournament) tournament = 'Tenis';

  return { tournament, player1: player1 || '?', player2: player2 || '?' };
}

function extractRound(event) {
  const desc = event.strDescriptionEN || '';
  const lines = desc.split('\n').map((l) => l.replace(/\r/g, '').trim());
  if (lines.length > 0) {
    const parts = lines[0].split(' - ');
    if (parts.length >= 3) return parts[parts.length - 1].trim();
  }
  if (event.intRound) return `R${event.intRound}`;
  return '';
}

function extractScore(event) {
  const result = event.strResult || '';
  if (!result) return '';
  return result.split('\n')[0].replace(/\r/g, '').trim();
}

async function fetchRound(leagueId, round, season) {
  let timeoutId;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const url = `${API_BASE}/eventsround.php?id=${leagueId}&r=${round}&s=${season}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const text = await res.text();
    if (text.startsWith('<')) return null;
    const data = JSON.parse(text);
    return data.events || [];
  } catch {
    return null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function fetchAllLeagueEvents(league, season) {
  console.log(`  ${league.name} ${season} — round-by-round çekiliyor...`);
  const allEvents = [];
  let emptyStreak = 0;

  for (let r = 1; r <= MAX_ROUNDS; r++) {
    const events = await fetchRound(league.id, r, season);

    if (events === null) {
      emptyStreak++;
      if (emptyStreak >= MAX_EMPTY_ROUNDS) break;
      await sleep(REQUEST_DELAY_MS);
      continue;
    }

    if (events.length === 0) {
      emptyStreak++;
      if (emptyStreak >= MAX_EMPTY_ROUNDS) break;
    } else {
      emptyStreak = 0;
      allEvents.push(...events);
    }

    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`    ${league.name} ${season}: ${allEvents.length} etkinlik toplandı`);
  return allEvents;
}

async function main() {
  console.log('[generate-fixtures-tennis] Başlatılıyor...');

  const now = new Date();
  const currentYear = now.getFullYear();
  const seasons = [currentYear.toString()];
  if (now.getMonth() >= 10) seasons.push((currentYear + 1).toString());

  const dateRange = {};
  for (let i = 0; i <= 59; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dateRange[formatDate(d)] = [];
  }

  for (const league of TENNIS_LEAGUES) {
    for (const season of seasons) {
      const events = await fetchAllLeagueEvents(league, season);

      const groupsByDateTournament = {};

      for (const event of events) {
        if (event.strSport !== 'Tennis') continue;

        const matchDate = (event.dateEvent || '').split('T')[0];
        if (!dateRange.hasOwnProperty(matchDate)) continue;

        const { tournament, player1, player2 } = extractTournamentAndPlayers(event);
        const round = extractRound(event);
        const score = extractScore(event);
        const country = event.strCountry || '';
        const city = event.strCity || '';

        const groupKey = `${matchDate}:${league.name}:${tournament}`;

        if (!groupsByDateTournament[groupKey]) {
          groupsByDateTournament[groupKey] = {
            league: {
              slug: `${league.name.toLowerCase()}-${tournament.toLowerCase().replace(/\s+/g, '-')}`,
              name: `${league.name} · ${tournament}`,
              country: city ? `${city}, ${country}` : country,
              flag: league.flag,
            },
            matches: [],
          };
        }

        groupsByDateTournament[groupKey].matches.push({
          id: `${league.name}-${event.idEvent || Math.random()}`,
          time: round || 'TBD',
          home: player1,
          away: player2,
          score: score,
          status: score ? 'FT' : 'NS',
          league: {
            slug: `${league.name.toLowerCase()}-${tournament.toLowerCase().replace(/\s+/g, '-')}`,
            name: `${league.name} · ${tournament}`,
            country: city ? `${city}, ${country}` : country,
            flag: league.flag,
          },
        });
      }

      for (const [key, group] of Object.entries(groupsByDateTournament)) {
        const dateStr = key.split(':')[0];
        dateRange[dateStr].push(group);
      }
    }
  }

  for (const dateStr of Object.keys(dateRange)) {
    dateRange[dateStr].sort((a, b) => a.league.name.localeCompare(b.league.name));
  }

  const output = { generatedAt: new Date().toISOString(), days: dateRange };
  const outDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'fixtures-tennis.json');
  fs.writeFileSync(outPath, JSON.stringify(output), 'utf8');

  const totalMatches = Object.values(dateRange).reduce((s, groups) => s + groups.reduce((a, g) => a + g.matches.length, 0), 0);
  const nonEmptyDays = Object.values(dateRange).filter((g) => g.length > 0).length;
  console.log(`[generate-fixtures-tennis] Bitti. ${totalMatches} maç, ${nonEmptyDays} günde veri → ${outPath}`);

  if (totalMatches === 0) {
    console.log('[generate-fixtures-tennis] UYARI: Hiç maç bulunamadı. TheSportsDB veritabanı henüz güncel olmayabilir.');
  }
}

main().catch((err) => {
  console.error('[generate-fixtures-tennis] Hata:', err);
  process.exit(1);
});
