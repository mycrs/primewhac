/**
 * Maç içeriği: kaynak public/data/match-contents(.json) dosyaları (statik, kota dostu).
 * İsteğe bağlı: SUPABASE_SYNC_MATCH_CONTENT=1 ile kayıt Supabase match_contents'e de yazılır (varsayılan kapalı).
 */
import fs from 'fs';
import path from 'path';
import { makeMatchSlug } from './makeMatchSlug.js';

const SYNC_MATCH_CONTENT_TO_SUPABASE = ['1', 'true', 'yes'].includes(
  String(process.env.SUPABASE_SYNC_MATCH_CONTENT || '').toLowerCase()
);

const CACHE_HOURS = 24;

function getCacheDir(locale = 'tr') {
  const subdir = locale === 'de' ? 'match-contents-de' : 'match-contents';
  return path.resolve(process.cwd(), 'public', 'data', subdir);
}

function getFilePath(slug, locale = 'tr') {
  const cacheDir = getCacheDir(locale);
  const safeSlug = slug.replace(/[^a-z0-9\-]/g, '-');
  return path.join(cacheDir, `${safeSlug}.json`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function getCachedContent(match, locale = 'tr') {
  const slug = makeMatchSlug(match.home, match.away, match.date);
  try {
    const raw = fs.readFileSync(getFilePath(slug, locale), 'utf8');
    const data = JSON.parse(raw);
    const then = new Date(data.generated_at).getTime();
    if (Date.now() - then >= CACHE_HOURS * 60 * 60 * 1000) return null;
    return {
      paragraphs: data.paragraphs || [],
      isDerbi: data.is_derbi ?? false,
      wordCount: data.word_count,
    };
  } catch (readErr) {
    if (readErr.code !== 'ENOENT') {
      console.error('[matchContentCache] dosya okuma hatası:', readErr?.message || readErr);
    }
    return null;
  }
}

export async function saveContentToCache(match, result, locale = 'tr') {
  const slug = makeMatchSlug(match.home, match.away, match.date);
  if (SYNC_MATCH_CONTENT_TO_SUPABASE) {
    try {
      const { saveContentToSupabase } = await import('./matchContentSupabase.js');
      await saveContentToSupabase(slug, result, locale);
    } catch (e) {
      console.error('[matchContentCache] Supabase yazma (opsiyonel):', e?.message || e, e);
    }
  }
  try {
    const cacheDir = getCacheDir(locale);
    ensureDir(cacheDir);
    fs.writeFileSync(
      getFilePath(slug, locale),
      JSON.stringify({
        slug,
        paragraphs: result.paragraphs,
        is_derbi: result.isDerbi,
        word_count: result.wordCount,
        generated_at: new Date().toISOString(),
      }, null, 2),
      'utf8'
    );
  } catch (writeErr) {
    console.error('[matchContentCache] dosya yazma hatası:', writeErr?.message || writeErr, writeErr);
  }
}
