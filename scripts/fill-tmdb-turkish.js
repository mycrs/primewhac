#!/usr/bin/env node
/**
 * fill-tmdb-turkish.js
 *
 * Türk dizileri için TMDB search ile tmdbId ve posterPath alanlarını doldurur.
 * /search/tv?query=...&language=tr-TR  →  popularity-desc  →  top result
 *
 * Token kaynağı: env veya useMovieDatabase.js içindeki hardcoded API_TOKEN.
 * Kullanım:  node scripts/fill-tmdb-turkish.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(REPO_ROOT, 'src', 'data', 'whatToWatchCategories.js');
const HOOK_FILE = path.join(REPO_ROOT, 'src', 'hooks', 'useMovieDatabase.js');

const RATE_LIMIT_MS = 200;
const TMDB_BASE = 'https://api.themoviedb.org/3';

const TARGETS = [
  'Diriliş: Ertuğrul',
  'Çukur',
  'Kara Para Aşk',
  'Muhteşem Yüzyıl',
  'Behzat Ç.',
  'Bir Zamanlar Çukurova',
  'Kuruluş: Osman',
  'Leyla ile Mecnun',
  'Kara Sevda',
  'Yargı',
];

function resolveToken() {
  const envToken =
    process.env.VITE_TMDB_BEARER_TOKEN ||
    process.env.TMDB_BEARER_TOKEN ||
    process.env.VITE_TMDB_API_KEY ||
    process.env.TMDB_API_KEY ||
    '';
  if (envToken && envToken.trim().length > 20) {
    return { token: envToken.trim(), source: '.env' };
  }
  try {
    const hookSrc = fs.readFileSync(HOOK_FILE, 'utf8');
    const m = hookSrc.match(/const\s+API_TOKEN\s*=\s*"([^"]+)"/);
    if (m && m[1] && m[1].length > 20) {
      return { token: m[1], source: 'useMovieDatabase.js (hardcoded)' };
    }
  } catch {
    /* ignore */
  }
  return { token: '', source: 'none' };
}

async function searchTV(query, token) {
  const url = new URL(`${TMDB_BASE}/search/tv`);
  url.searchParams.set('query', query);
  url.searchParams.set('language', 'tr-TR');
  url.searchParams.set('include_adult', 'false');
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });
  if (!res.ok) {
    return { ok: false, status: res.status, error: (await res.text()).slice(0, 160) };
  }
  const data = await res.json();
  return { ok: true, results: data.results || [] };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Satır satır tarayarak her TARGET title için item aralığını bulur.
 * Her item'da tmdbId ve posterPath satırlarının index'i döner.
 */
function locateTargets(lines) {
  const found = new Map(); // title → { tmdbIdLine, posterPathLine, year }

  // Her item bloğu için local state
  let startIdx = -1;
  let curTmdbIdLine = -1;
  let curPosterLine = -1;
  let curTitle = null;
  let curYear = null;

  const reset = () => {
    startIdx = -1;
    curTmdbIdLine = -1;
    curPosterLine = -1;
    curTitle = null;
    curYear = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*id:\s*['"][^'"]+['"]/.test(line)) {
      reset();
      startIdx = i;
      continue;
    }
    const mTmdb = line.match(/^\s*tmdbId:\s*(\d+),?\s*$/);
    if (mTmdb) {
      curTmdbIdLine = i;
      continue;
    }
    const mTitle = line.match(/^\s*title:\s*['"]([^'"]+)['"]/);
    if (mTitle) {
      curTitle = mTitle[1];
      continue;
    }
    const mYear = line.match(/^\s*year:\s*(\d+),?\s*$/);
    if (mYear) {
      curYear = Number(mYear[1]);
      continue;
    }
    if (/^\s*posterPath:\s*['"]['"],?\s*$/.test(line)) {
      curPosterLine = i;

      if (curTitle && TARGETS.includes(curTitle) && curTmdbIdLine >= 0) {
        if (!found.has(curTitle)) {
          found.set(curTitle, {
            tmdbIdLine: curTmdbIdLine,
            posterPathLine: curPosterLine,
            year: curYear,
          });
        }
      }
    }
  }

  return found;
}

/**
 * TMDB arama sonuçlarından en uygun olanı seç:
 *   - varsa yıl ±1 eşleşen + en yüksek popularity
 *   - yoksa en yüksek popularity
 */
function pickBest(results, year) {
  if (!results.length) return null;
  const sorted = [...results].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  if (year) {
    const yearMatch = sorted.find((r) => {
      const d = (r.first_air_date || '').slice(0, 4);
      if (!d) return false;
      const y = Number(d);
      return Math.abs(y - year) <= 1;
    });
    if (yearMatch) return yearMatch;
  }
  return sorted[0];
}

async function main() {
  const { token, source } = resolveToken();
  if (!token) {
    console.error('❌ TMDB token bulunamadı.');
    process.exit(1);
  }
  console.log(`→ Token kaynağı: ${source}  (length=${token.length})`);

  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const lines = src.split('\n');

  const locations = locateTargets(lines);
  console.log(`→ Dosyada bulunan hedefler: ${locations.size}/${TARGETS.length}\n`);

  // Eksik olanları uyar
  const missing = TARGETS.filter((t) => !locations.has(t));
  if (missing.length) {
    console.log('⚠ Dosyada eşleşmeyen title:', missing);
  }

  const summary = [];
  let success = 0;
  let errorCount = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const title = TARGETS[i];
    const prefix = `[${i + 1}/${TARGETS.length}]`;
    const loc = locations.get(title);

    if (!loc) {
      errorCount++;
      summary.push({ title, status: 'file-miss' });
      console.log(`${prefix} ✗ ${title}  →  dosyada item bulunamadı`);
      continue;
    }

    try {
      const r = await searchTV(title, token);
      if (!r.ok) {
        errorCount++;
        summary.push({ title, status: `http-${r.status}` });
        console.log(`${prefix} ✗ ${title}  →  HTTP ${r.status}`);
      } else {
        const best = pickBest(r.results, loc.year);
        if (!best) {
          errorCount++;
          summary.push({ title, status: 'no-results' });
          console.log(`${prefix} ⚠ ${title}  →  TMDB'de sonuç yok`);
        } else if (!best.id) {
          errorCount++;
          summary.push({ title, status: 'no-id' });
          console.log(`${prefix} ⚠ ${title}  →  id yok`);
        } else {
          // Satırları değiştir
          const tmdbLine = lines[loc.tmdbIdLine];
          lines[loc.tmdbIdLine] = tmdbLine.replace(
            /tmdbId:\s*0/,
            `tmdbId: ${best.id}`,
          );
          const posterLine = lines[loc.posterPathLine];
          const posterPath = best.poster_path || '';
          if (posterPath) {
            lines[loc.posterPathLine] = posterLine.replace(
              /posterPath:\s*['"]['"]/,
              `posterPath: '${posterPath}'`,
            );
          }
          const year = (best.first_air_date || '').slice(0, 4);
          const pop = Math.round(best.popularity || 0);
          success++;
          summary.push({
            title,
            status: 'ok',
            id: best.id,
            posterPath: posterPath || '(null)',
            name: best.name,
            year,
            popularity: pop,
          });
          console.log(
            `${prefix} ✓ ${title}  →  id=${best.id}  year=${year}  pop=${pop}  poster=${posterPath || '(null)'}`,
          );
          console.log(`          match name: "${best.name}"`);
        }
      }
    } catch (e) {
      errorCount++;
      summary.push({ title, status: `err: ${e.message}` });
      console.log(`${prefix} ✗ ${title}  →  ${e.message}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  if (success > 0) {
    fs.writeFileSync(DATA_FILE, lines.join('\n'), 'utf8');
    console.log(`\n✓ ${path.relative(REPO_ROOT, DATA_FILE)} güncellendi.`);
  } else {
    console.log('\n(Dosya yazılmadı — hiç başarılı çağrı olmadı.)');
  }

  console.log('\n=== ÖZET ===');
  console.log(`  Başarılı:   ${success}/${TARGETS.length}`);
  console.log(`  Hata:       ${errorCount}/${TARGETS.length}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
