/**
 * Maç içeriği cache - Supabase (match_contents) + dosya yedek.
 * Öncelik Supabase, yoksa dosya. Kayıt her ikisine de yapılır.
 */
import fs from 'fs';
import path from 'path';
import { makeMatchSlug } from './generateMatchContent.js';
import { getCachedContentFromSupabase, saveContentToSupabase } from './matchContentSupabase.js';

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
  const fromSupabase = await getCachedContentFromSupabase(slug, locale);
  if (fromSupabase) return fromSupabase;
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
  } catch {
    return null;
  }
}

export async function saveContentToCache(match, result, locale = 'tr') {
  const slug = makeMatchSlug(match.home, match.away, match.date);
  try {
    await saveContentToSupabase(slug, result, locale);
  } catch (e) {
    console.warn('[cache] Supabase yazma hatası:', e?.message);
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
  } catch (_) {}
}
