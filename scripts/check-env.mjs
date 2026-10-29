/**
 * .env okunuyor mu? — Çalıştır: npm run check:env
 * Anahtar içeriğini yazdırmaz; yalnızca var/yok ve uzunluk.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env') });

function checkKey(key, { minLen = 1, jwt = false } = {}) {
  const v = process.env[key];
  const good = jwt ? v && v.length > 80 : v && String(v).trim().length >= minLen;
  const placeholder =
    v &&
    (v.includes('YOUR_PROJECT') ||
      v.includes('PASTE_FULL') ||
      v === 'your_tmdb_api_key_here' ||
      v === 'your_gemini_api_key');
  return { key, good, placeholder, v };
}

function printRow({ key, good, placeholder, v }) {
  let status = good ? '✓' : '✗';
  let detail = 'YOK veya çok kısa';
  if (good) {
    detail = key.includes('KEY') || key.includes('TOKEN') ? `tanımlı (${v.length} karakter)` : `tanımlı`;
    if (placeholder) {
      status = '⚠';
      detail += ' — şablon değer; gerçek anahtar girin';
    }
  }
  console.log(`${status} ${key}: ${detail}`);
}

const groups = [
  {
    title: 'Vite — frontend (npm run dev / build)',
    required: true,
    keys: [
      { key: 'VITE_SUPABASE_URL' },
      { key: 'VITE_SUPABASE_ANON_KEY', jwt: true },
      { key: 'VITE_SITE_URL' },
    ],
  },
  {
    title: 'Express API (npm run dev:all) — SUPABASE_* veya VITE_* fallback',
    required: false,
    keys: [
      { key: 'SUPABASE_URL', fallback: 'VITE_SUPABASE_URL' },
      { key: 'SUPABASE_ANON_KEY', jwt: true, fallback: 'VITE_SUPABASE_ANON_KEY' },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', jwt: true },
    ],
  },
  {
    title: 'İsteğe bağlı — TMDB, Gemini, FTP',
    required: false,
    keys: [
      { key: 'VITE_TMDB_API_KEY' },
      { key: 'GEMINI_API_KEY' },
      { key: 'FTP_HOST' },
    ],
  },
];

let requiredOk = true;
let apiWarn = false;

for (const group of groups) {
  console.log(`\n── ${group.title}`);
  for (const spec of group.keys) {
    let row = checkKey(spec.key, { minLen: spec.minLen || 1, jwt: spec.jwt });
    if (!row.good && spec.fallback) {
      const fb = checkKey(spec.fallback, { jwt: spec.jwt });
      if (fb.good) {
        row = { ...row, good: true, v: process.env[spec.fallback] };
        printRow({ ...row, key: `${spec.key} (→ ${spec.fallback})` });
        continue;
      }
    }
    printRow(row);
    if (group.required && !row.good) requiredOk = false;
    if (group.title.includes('Express') && !row.good && spec.key === 'SUPABASE_SERVICE_ROLE_KEY') {
      apiWarn = true;
    }
  }
}

console.log('');
if (!requiredOk) {
  console.log('Eksik: proje kökünde .env oluşturun (.env.example şablonu).');
  process.exit(1);
}
console.log('Tamam: zorunlu Vite değişkenleri tanımlı.');
if (apiWarn) {
  console.log('Not: SUPABASE_SERVICE_ROLE_KEY yok — admin müşteri API ve duyuru CRUD yerelde sınırlı çalışır.');
}

