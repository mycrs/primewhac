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
import fs from 'fs';
import path from 'path';
import { getCachedContent, saveContentToCache } from '../server/api/matchContentCache.js';
import { generateMatchContent } from '../src/utils/matchContentGenerator.js';
import { generateMatchContentDE } from '../src/utils/matchContentGeneratorDE.js';

const forceRefresh = process.argv.includes('--force');
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
  const date = new Date(String(dateUtc).replace(' ', 'T'));
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
}

function formatDate(d) {
  return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
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
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastError || new Error(`Failed after ${retries} attempts: ${url}`);
}

async function main() {
  console.log('[pregenerate:content] Şablon ile TR+DE üretimi (Gemini yok)');
  if (forceRefresh) console.log('[pregenerate:content] --force: tümü yeniden yazılacak');

  const fixturesPath = path.resolve(process.cwd(), 'public', 'data', 'fixtures.json');
  let allMatches = [];

  if (fs.existsSync(fixturesPath)) {
    try {
      const fixturesData = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
      if (fixturesData?.days) {
        for (const [dateStr, groups] of Object.entries(fixturesData.days)) {
          if (Array.isArray(groups)) {
            for (const group of groups) {
              if (Array.isArray(group.matches)) {
                for (const m of group.matches) {
                  allMatches.push({
                    home: m.home,
                    away: m.away,
                    time: m.time,
                    league: m.league,
                    date: dateStr,
                  });
                }
              }
            }
          }
        }
      }
      console.log(`[pregenerate:content] fixtures.json'dan ${allMatches.length} maç okundu.`);
    } catch (e) {
      console.warn('[pregenerate:content] fixtures.json okunamadı:', e.message);
    }
  }

  if (allMatches.length === 0) {
    // Her ligi birer kez paralel çek
    const leagueDataMap = {};
    await Promise.all(
      LEAGUES.map(async (league) => {
        try {
          const data = await fetchJsonWithRetry(`${FIXTURE_BASE}/${league.slug}`);
          leagueDataMap[league.slug] = Array.isArray(data) ? data : (data.matches || []);
        } catch (e) {
          console.warn(`  ${league.name} yüklenemedi:`, e.message);
        }
      })
    );

    const dates = [];
    for (let i = 0; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(formatDate(d));
    }

    for (const dateStr of dates) {
      for (const league of LEAGUES) {
        const list = leagueDataMap[league.slug] || [];
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
          allMatches.push({
            home: typeof home === 'string' ? home : (home?.name || '-'),
            away: typeof away === 'string' ? away : (away?.name || '-'),
            time: formatTime(dateUtc),
            league: { ...league },
            date: dateStr,
          });
        }
      }
    }
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
