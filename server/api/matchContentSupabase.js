/**
 * Maç içeriği - Supabase (match_contents tablosu).
 * Pregenerate script ve runtime fetch için kullanılır.
 */
import { createClient } from '@supabase/supabase-js';

const CACHE_HOURS = 24;

function getSupabase() {
  const url = process.env.SUPABASE_URL || 'https://pkppewdtnuchwjtmulev.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY veya SUPABASE_ANON_KEY gerekli');
  return createClient(url, key, { auth: { persistSession: false } });
}

function isCacheValid(generatedAt) {
  if (!generatedAt) return false;
  const then = new Date(generatedAt).getTime();
  return (Date.now() - then) < CACHE_HOURS * 60 * 60 * 1000;
}

export async function getCachedContentFromSupabase(slug, locale = 'tr') {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('match_contents')
      .select('paragraphs, is_derbi, word_count, generated_at')
      .eq('slug', slug)
      .eq('locale', locale)
      .maybeSingle();
    if (error) {
      console.error('[matchContentSupabase] match_contents okuma hatası:', error?.message || error, error);
      return null;
    }
    if (!data) return null;
    if (!isCacheValid(data.generated_at) || !data.paragraphs?.length) return null;
    return {
      paragraphs: data.paragraphs,
      isDerbi: data.is_derbi ?? false,
      wordCount: data.word_count,
    };
  } catch (err) {
    console.error('[matchContentSupabase] getCachedContentFromSupabase:', err?.message || err, err);
    return null;
  }
}

export async function saveContentToSupabase(slug, result, locale = 'tr') {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('match_contents').upsert(
      {
        slug,
        locale,
        paragraphs: result.paragraphs,
        is_derbi: result.isDerbi ?? false,
        word_count: result.wordCount ?? 0,
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'slug,locale' }
    );
    if (error) throw error;
  } catch (err) {
    console.error('[matchContentSupabase] saveContentToSupabase:', err?.message || err, err);
    throw err;
  }
}
