/**
 * Maç içeriği: session önbelleği → public/data/match-contents*.json → şablon (Supabase yok, kota dostu).
 * locale: 'tr' | 'de'
 */
import { useState, useEffect, useMemo } from 'react';
import { generateMatchContent } from '@/utils/matchContentGenerator';
import { generateMatchContentDE } from '@/utils/matchContentGeneratorDE';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';
import { isAdminAppPath } from '@/constants/adminRoutes';

function matchContentSessionKey(slug, locale) {
  return `sb_mc_${locale}_${slug}`;
}

const CACHE_HOURS = 24;

function isCacheValid(generatedAt) {
  if (!generatedAt) return false;
  const then = new Date(generatedAt).getTime();
  return (Date.now() - then) < CACHE_HOURS * 60 * 60 * 1000;
}

export function useMatchContent(slug, match, options = {}) {
  const { locale = 'tr', isAdmin: isAdminOption } = options;
  const isAdmin =
    typeof isAdminOption === 'boolean'
      ? isAdminOption
      : (typeof window !== 'undefined' && isAdminAppPath(window.location.pathname));
  const isDe = locale === 'de';
  const generator = isDe ? generateMatchContentDE : generateMatchContent;
  const cachePath = isDe ? '/data/match-contents-de/' : '/data/match-contents/';

  const template = useMemo(
    () => (match ? generator({ ...match, date: match.date }) : null),
    [match?.home, match?.away, match?.date, isDe]
  );
  const [cached, setCached] = useState(null);
  const [loading, setLoading] = useState(!!slug);
  const [contentLoadMessage, setContentLoadMessage] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setCached(null);
    setContentLoadMessage(null);

    async function fetchContent() {
      try {
        const mcKey = matchContentSessionKey(slug, locale);
        const sessionHit = readSessionCache(mcKey);
        if (
          sessionHit?.generated_at &&
          isCacheValid(sessionHit.generated_at) &&
          sessionHit.paragraphs?.length &&
          !cancelled
        ) {
          setContentLoadMessage(null);
          setCached({
            paragraphs: sessionHit.paragraphs,
            isDerbi: sessionHit.isDerbi ?? template?.isDerbi,
            wordCount: sessionHit.wordCount,
          });
          return;
        }

        const r = await fetch(`${cachePath}${slug}.json`);
        const data = r.ok ? await r.json() : null;
        if (!cancelled && data && isCacheValid(data.generated_at) && data.paragraphs?.length) {
          setContentLoadMessage(null);
          const block = {
            paragraphs: data.paragraphs,
            isDerbi: data.is_derbi ?? template?.isDerbi,
            wordCount: data.word_count,
          };
          setCached(block);
          writeSessionCache(mcKey, {
            ...block,
            generated_at: data.generated_at,
          });
        }
      } catch (e) {
        console.error('[useMatchContent] statik JSON:', e?.message || e, e);
        if (!cancelled && isAdmin) {
          setContentLoadMessage(e?.message || String(e));
        }
      }
    }

    fetchContent().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug, locale, isDe, template?.isDerbi, cachePath, isAdmin]);

  const content = cached || template;
  return { content, loading, contentLoadMessage };
}
