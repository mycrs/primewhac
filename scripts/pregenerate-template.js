#!/usr/bin/env node
/**
 * Mevcut maçlar için profesyonel şablon içerik üretir (TR + DE).
 * Gemini API gerektirmez – siteyi hemen aktif etmek için.
 *
 * Kullanım: node scripts/pregenerate-template.js
 */
import 'dotenv/config';
import { getCachedContent, saveContentToCache } from '../server/api/matchContentCache.js';
import { generateMatchContent } from '../src/utils/matchContentGenerator.js';
import { generateMatchContentDE } from '../src/utils/matchContentGeneratorDE.js';

const forceRefresh = process.argv.includes('--force');
const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';
const LEAGUES = [
  { slug: 'super-lig-2025', name: 'Türkiye Ligi', country: 'Türkiye', flag: '🇹🇷' },
  { slug: 'epl-2025', name: 'İngiltere Ligi', country: 'İngiltere', flag: '🏴' },
  { slug: 'la-liga-2025', name: 'İspanya Ligi', country: 'İspanya', flag: '🇪🇸' },
  { slug: 'champions-league-2025', name: 'Avrupa Kupası', country: 'Avrupa', flag: '🇪🇺' },
  { slug: 'bundesliga-2025', name: 'Almanya Ligi', country: 'Almanya', flag: '🇩🇪' },
  { slug: 'serie-a-2025', name: 'İtalya Ligi', country: 'İtalya', flag: '🇮🇹' },
];

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
          time: '20:00',
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
  console.log('[pregenerate-template] Mevcut maçlar için profesyonel içerik üretiliyor (TR + DE)');
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
      console.warn(`  ✗ ${match.home} - ${match.away}:`, e?.message?.slice(0, 60));
    }
  }

  console.log(`[pregenerate-template] Bitti. Üretilen: ${generated}, Zaten vardı: ${skipped}`);
}

main().catch(console.error);
