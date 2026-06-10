#!/usr/bin/env node
/**
 * Maç içeriklerini şablonla üretir (TR + DE). Gemini kullanmaz.
 *
 * Kullanım: node scripts/pregenerate-match-content.js
 * npm run pregenerate:content
 *
 * --force: Önbelleği yoksay, yeniden yaz
 */
import 'dotenv/config';
import { getCachedContent, saveContentToCache } from '../server/api/matchContentCache.js';
import { generateMatchContent } from '../src/utils/matchContentGenerator.js';
import { generateMatchContentDE } from '../src/utils/matchContentGeneratorDE.js';

const forceRefresh = process.argv.includes('--force');
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
  const date = new Date(String(dateUtc).replace(' ', 'T'));
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

function formatDate(d) {
  return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

async function fetchMatchesForDate(dateStr) {
  const matches = [];
  for (const league of LEAGUES) {
    try {
      const res = await fetch(`${FIXTURE_BASE}/${league.slug}`);
      if (!res.ok) continue;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.matches || []);
      const forDate = list.filter((m) => {
        const raw = (m.DateUtc || m.date || '').toString().replace(' ', 'T');
        if (!raw) return false;
        const matchDate = new Date(raw).toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
        return matchDate === dateStr;
      });
      for (const m of forDate) {
        const dateUtc = m.DateUtc || m.date;
        const home = m.HomeTeam || m.team1 || m.homeTeam?.name || '-';
        const away = m.AwayTeam || m.team2 || m.awayTeam?.name || '-';
        matches.push({
          home: typeof home === 'string' ? home : (home?.name || '-'),
          away: typeof away === 'string' ? away : (away?.name || '-'),
          time: formatTime(dateUtc),
          league: { ...league },
          date: dateStr,
        });
      }
    } catch (e) {
      console.warn(`  ${league.name} yüklenemedi:`, e.message);
    }
  }
  return matches;
}

async function main() {
  console.log('[pregenerate:content] Şablon ile TR+DE üretimi (Gemini yok)');
  if (forceRefresh) console.log('[pregenerate:content] --force: tümü yeniden yazılacak');

  const dates = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }

  let allMatches = [];
  for (const dateStr of dates) {
    const matches = await fetchMatchesForDate(dateStr);
    allMatches = allMatches.concat(matches);
  }

  let generated = 0;
  let skipped = 0;
  for (const match of allMatches) {
    if (!forceRefresh) {
      const hasTR = await getCachedContent(match, 'tr');
      const hasDE = await getCachedContent(match, 'de');
      if (hasTR && hasDE) {
        skipped++;
        continue;
      }
    }
    try {
      const tr = generateMatchContent(match);
      const de = generateMatchContentDE(match);
      await saveContentToCache(match, tr, 'tr');
      await saveContentToCache(match, de, 'de');
      generated++;
      console.log(`  ✓ ${match.home} - ${match.away} (${match.date})`);
    } catch (e) {
      console.warn(`  ✗ ${match.home} - ${match.away}:`, e?.message?.slice(0, 80));
    }
  }

  console.log(`[pregenerate:content] Bitti. Üretilen: ${generated}, atlanan (önbellek): ${skipped}, toplam maç: ${allMatches.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
