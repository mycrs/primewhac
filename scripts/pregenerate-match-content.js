#!/usr/bin/env node
/**
 * Maç içeriklerini önceden üretir (TR + DE).
 * Günlük 1 kez çalıştırılır – yeni takvim için tüm maçları günceller.
 *
 * Kullanım: node scripts/pregenerate-match-content.js
 * Cron (her gün 00:01 – yeni gün başlayınca): 1 0 * * * cd /proje && npm run pregenerate:content
 *
 * --force: Cache'i yoksay, hepsini yeniden üret
 */
import 'dotenv/config';
import { generateMatchContentWithAI, generateMatchContentWithAI_DE } from '../server/api/generateMatchContent.js';
import { getCachedContent, saveContentToCache } from '../server/api/matchContentCache.js';

const DELAY_MS = 8000; // İstekler arası bekleme (rate limit için)
const forceRefresh = process.argv.includes('--force');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';
const LEAGUES = [
  { slug: 'super-lig-2025', name: 'Süper Lig', country: 'Türkiye', flag: '🇹🇷' },
  { slug: 'epl-2024', name: 'Premier Lig', country: 'İngiltere', flag: '🏴' },
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
  return d.toISOString().split('T')[0];
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
        const matchDate = (m.DateUtc || m.date || '').toString().split(' ')[0].split('T')[0];
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

async function generateForLocale(matches, locale) {
  const label = locale === 'de' ? 'DE' : 'TR';
  const generator = locale === 'de' ? generateMatchContentWithAI_DE : generateMatchContentWithAI;
  let generated = 0;
  let skipped = 0;
  let lastApiCall = 0;
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (!forceRefresh) {
      const cached = await getCachedContent(match, locale);
      if (cached) {
        skipped++;
        continue;
      }
    }
    try {
      if (lastApiCall > 0) await sleep(DELAY_MS);
      lastApiCall++;
      const result = await generator(match);
      await saveContentToCache(match, result, locale);
      generated++;
      console.log(`  [${label}] ✓ ${match.home} - ${match.away} (${match.date})`);
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`  [${label}] ⏳ Kota aşıldı, 60 sn bekleniyor...`);
        await sleep(60000);
        i--;
        continue;
      }
      console.warn(`  [${label}] ✗ ${match.home} - ${match.away}:`, msg.slice(0, 80));
    }
  }
  return { generated, skipped };
}

async function main() {
  console.log('[pregenerate] Başlatılıyor (TR + DE) – günde 1 kez yeterli');
  if (forceRefresh) console.log('[pregenerate] --force: Tüm içerik yeniden üretilecek');
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

  const trStats = await generateForLocale(allMatches, 'tr');
  const deStats = await generateForLocale(allMatches, 'de');

  console.log(`[pregenerate] Bitti. TR: Yeni ${trStats.generated}, Önbellekte ${trStats.skipped}`);
  console.log(`[pregenerate] Bitti. DE: Yeni ${deStats.generated}, Önbellekte ${deStats.skipped}`);
}

main().catch(console.error);
