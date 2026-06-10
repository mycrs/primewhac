#!/usr/bin/env node
/**
 * fill-tmdb-posters.js
 *
 * whatToWatchCategories.js dosyasındaki boş `posterPath: ''` alanlarını
 * TMDB API'den çekerek doldurur.
 *
 * Token kaynağı (sırasıyla):
 *   1. process.env.VITE_TMDB_BEARER_TOKEN / TMDB_BEARER_TOKEN
 *   2. process.env.VITE_TMDB_API_KEY / TMDB_API_KEY
 *   3. src/hooks/useMovieDatabase.js içindeki hardcoded API_TOKEN
 *
 * Kullanım:  node scripts/fill-tmdb-posters.js
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

async function fetchPoster(type, tmdbId, token) {
  const url = `${TMDB_BASE}/${type}/${tmdbId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
  });
  if (res.status === 404) {
    return { ok: false, status: 404, error: 'Not found on TMDB' };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ok: false, status: res.status, error: body.slice(0, 160) };
  }
  const data = await res.json();
  return { ok: true, posterPath: data.poster_path || null };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Dosyayı satır satır tara. Her `posterPath: ''` satırı için
 * o item'a ait (satır üzerinde önce geçen) tmdbId, type, title değerlerini eşle.
 */
function scanItems(lines) {
  const items = [];
  let curTmdbId = null;
  let curType = null;
  let curTitle = null;
  let curId = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Yeni item bloğu başlangıcı (id alanı) → önceki state sıfırla
    const mId = line.match(/^\s*id:\s*['"]([^'"]+)['"]/);
    if (mId) {
      curId = mId[1];
      curTmdbId = null;
      curType = null;
      curTitle = null;
      continue;
    }
    const mTmdb = line.match(/^\s*tmdbId:\s*(\d+)/);
    if (mTmdb) {
      curTmdbId = Number(mTmdb[1]);
      continue;
    }
    const mType = line.match(/^\s*type:\s*['"](tv|movie)['"]/);
    if (mType) {
      curType = mType[1];
      continue;
    }
    const mTitle = line.match(/^\s*title:\s*['"]([^'"]+)['"]/);
    if (mTitle) {
      curTitle = mTitle[1];
      continue;
    }
    if (/^\s*posterPath:\s*['"]['"],?\s*$/.test(line)) {
      items.push({
        lineIdx: i,
        id: curId,
        tmdbId: curTmdbId,
        type: curType,
        title: curTitle,
      });
    }
  }
  return items;
}

async function main() {
  const { token, source } = resolveToken();
  if (!token) {
    console.error('❌ TMDB token bulunamadı (env de, hook da boş).');
    process.exit(1);
  }
  console.log(`→ Token kaynağı: ${source}  (length=${token.length})`);

  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const lines = src.split('\n');
  const items = scanItems(lines);
  console.log(`→ Boş posterPath sayısı: ${items.length}\n`);

  if (items.length === 0) {
    console.log('Doldurulacak item yok.');
    return;
  }

  let success = 0;
  let errorCount = 0;
  let skipped = 0;
  const errorList = [];
  const skippedList = [];

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const label = item.title || item.id || `line ${item.lineIdx + 1}`;
    const prefix = `[${idx + 1}/${items.length}]`;

    if (!item.tmdbId || item.tmdbId === 0) {
      skipped++;
      skippedList.push(`${label} (tmdbId=0)`);
      console.log(`${prefix} ⊘ ${label}  →  tmdbId=0 atlandı`);
      continue;
    }
    if (!item.type) {
      skipped++;
      skippedList.push(`${label} (type eksik)`);
      console.log(`${prefix} ⊘ ${label}  →  type eksik`);
      continue;
    }

    try {
      const r = await fetchPoster(item.type, item.tmdbId, token);
      if (r.ok && r.posterPath) {
        lines[item.lineIdx] = lines[item.lineIdx].replace(
          /posterPath:\s*['"]['"]/,
          `posterPath: '${r.posterPath}'`,
        );
        success++;
        console.log(`${prefix} ✓ ${label}  →  ${r.posterPath}`);
      } else if (r.ok && !r.posterPath) {
        errorCount++;
        errorList.push(`${label} (TMDB'de poster_path null)`);
        console.log(`${prefix} ⚠ ${label}  →  TMDB'de poster_path null`);
      } else {
        errorCount++;
        errorList.push(`${label} (HTTP ${r.status}: ${r.error})`);
        console.log(`${prefix} ✗ ${label}  →  HTTP ${r.status}`);
      }
    } catch (e) {
      errorCount++;
      errorList.push(`${label} (${e.message})`);
      console.log(`${prefix} ✗ ${label}  →  ${e.message}`);
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
  console.log(`  Başarılı:   ${success}`);
  console.log(`  Hata:       ${errorCount}`);
  console.log(`  Atlanan:    ${skipped}`);
  console.log(`  Toplam:     ${items.length}`);

  if (skippedList.length) {
    console.log('\nAtlananlar (tmdbId=0 veya type eksik — manuel düzeltme gerekir):');
    skippedList.forEach((s) => console.log(`  - ${s}`));
  }
  if (errorList.length) {
    console.log('\nHatalar:');
    errorList.forEach((e) => console.log(`  - ${e}`));
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
