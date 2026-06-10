#!/usr/bin/env node
/**
 * Maç programı verisini fixturedownload'dan çeker, public/data/fixtures.json'a yazar.
 * Build sırasında çalışır – CORS yok (Node.js), anında yükleme için statik JSON.
 */
import fs from 'fs';
import path from 'path';
import { matchBelongsToProgramDay } from '../src/utils/fixtureProgramDay.js';

const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';
const LEAGUES = [
  { slug: 'super-lig-2025', name: 'Süper Lig', country: 'Türkiye', flag: '🇹🇷' },
  { slug: 'epl-2025', name: 'Premier Lig', country: 'İngiltere', flag: '🏴' },
  { slug: 'la-liga-2025', name: 'La Liga', country: 'İspanya', flag: '🇪🇸' },
  { slug: 'champions-league-2025', name: 'Şampiyonlar Ligi', country: 'Avrupa', flag: '🇪🇺' },
  { slug: 'bundesliga-2025', name: 'Bundesliga', country: 'Almanya', flag: '🇩🇪' },
  { slug: 'serie-a-2025', name: 'Serie A', country: 'İtalya', flag: '🇮🇹' },
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

async function fetchMatchesForDate(dateStr) {
  const byLeague = {};
  for (const league of LEAGUES) {
    try {
      const res = await fetch(`${FIXTURE_BASE}/${league.slug}`);
      if (!res.ok) continue;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.matches || []);
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
    } catch (e) {
      console.warn(`  [fixtures] ${league.name} atlandı:`, e.message);
    }
  }
  const groups = Object.values(byLeague).sort((a, b) => {
    if (a.league.country === 'Türkiye' && b.league.country !== 'Türkiye') return -1;
    if (a.league.country !== 'Türkiye' && b.league.country === 'Türkiye') return 1;
    return a.league.name.localeCompare(b.league.name);
  });
  return groups;
}

async function main() {
  console.log('[generate-fixtures] Başlatılıyor...');
  const dates = [];
  for (let i = 0; i <= 13; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }
  const days = {};
  for (const dateStr of dates) {
    days[dateStr] = await fetchMatchesForDate(dateStr);
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
