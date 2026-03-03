/**
 * Maç içeriği: önce Supabase, yoksa statik JSON, yoksa şablon.
 * Ne izlesem gibi runtime'da güncel içerik çeker.
 * locale: 'tr' | 'de'
 */
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { generateMatchContent } from '@/utils/matchContentGenerator';
import { generateMatchContentDE } from '@/utils/matchContentGeneratorDE';

const CACHE_HOURS = 24;

function isCacheValid(generatedAt) {
  if (!generatedAt) return false;
  const then = new Date(generatedAt).getTime();
  return (Date.now() - then) < CACHE_HOURS * 60 * 60 * 1000;
}

export function useMatchContent(slug, match, options = {}) {
  const { locale = 'tr' } = options;
  const isDe = locale === 'de';
  const generator = isDe ? generateMatchContentDE : generateMatchContent;
  const cachePath = isDe ? '/data/match-contents-de/' : '/data/match-contents/';

  const template = useMemo(
    () => (match ? generator({ ...match, date: match.date }) : null),
    [match?.home, match?.away, match?.date, isDe]
  );
  const [cached, setCached] = useState(null);
  const [loading, setLoading] = useState(!!slug);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('match_contents')
          .select('paragraphs, is_derbi, word_count, generated_at')
          .eq('slug', slug)
          .eq('locale', locale)
          .maybeSingle();

        if (!cancelled && !error && data && isCacheValid(data.generated_at) && data.paragraphs?.length) {
          setCached({
            paragraphs: data.paragraphs,
            isDerbi: data.is_derbi ?? template?.isDerbi,
            wordCount: data.word_count,
          });
          return;
        }
      } catch (_) {}

      if (!cancelled) {
        const r = await fetch(`${cachePath}${slug}.json`);
        const data = r.ok ? await r.json() : null;
        if (data && isCacheValid(data.generated_at) && data.paragraphs?.length) {
          setCached({
            paragraphs: data.paragraphs,
            isDerbi: data.is_derbi ?? template?.isDerbi,
            wordCount: data.word_count,
          });
        }
      }
    }

    fetchContent().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug, locale, template?.isDerbi, cachePath]);

  const content = cached || template;
  return { content, loading };
}
