import { BLOG_TRANSLATIONS_DE } from '@/data/staticBlogTranslationsDE';
import { supabase } from '@/lib/customSupabaseClient';
import { BLOG_LIST_COLUMNS, BLOG_LIST_COLUMNS_DE, BLOG_LIST_PAGE_SIZE } from '@/constants/publicSupabaseQueries';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

/**
 * @param {{ pageIndex: number, cachePrefix: string, locale?: 'tr'|'de' }} opts
 * @returns {Promise<{ rows: object[], totalCount: number, error?: string, fromCache?: boolean }>}
 */
export async function loadBlogListPage({ pageIndex, cachePrefix, locale = 'tr' }) {
  const pageSize = BLOG_LIST_PAGE_SIZE;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;
  const pageKey = `${cachePrefix}_p${pageIndex}`;

  if (pageIndex === 0) {
    const c = readSessionCache(`${cachePrefix}_p0`);
    if (c?.rows && typeof c.totalCount === 'number') {
      return { rows: c.rows, totalCount: c.totalCount, fromCache: true };
    }
  } else {
    const c = readSessionCache(pageKey);
    if (c?.rows?.length) {
      return { rows: c.rows, totalCount: null, fromCache: true };
    }
  }

  const { data, error, count, isFallback, message } = await executeSupabaseQuery(
    () => {
      let query = supabase
        .from('blog_posts')
        .select(BLOG_LIST_COLUMNS, { count: 'exact' })
        .not('published_at', 'is', null)
        .order('featured', { ascending: false, nullsFirst: false });

      return query
        .order('published_at', { ascending: false })
        .range(from, to);
    },
    { retries: 3, context: `blog_list_${cachePrefix}`, fallback: null, timeoutMs: 20000 }
  );

  if (error && isFallback) {
    return { rows: [], totalCount: 0, error: message || error?.message || 'fetch_failed' };
  }

  let rows = data || [];
  if (locale === 'de') {
    rows = rows
      .filter((r) => r.slug && (r.title_de || BLOG_TRANSLATIONS_DE[r.slug]))
      .map((r) => {
        const trDe = BLOG_TRANSLATIONS_DE[r.slug];
        if (trDe) {
          return {
            ...r,
            title_de: trDe.title_de,
            excerpt_de: trDe.excerpt_de,
            content_de: trDe.content_de,
          };
        }
        return r;
      });
  }
  const totalCount = locale === 'de' ? rows.length : (typeof count === 'number' ? count : rows.length);

  if (pageIndex === 0) {
    writeSessionCache(`${cachePrefix}_p0`, { rows, totalCount });
  } else {
    writeSessionCache(pageKey, { rows });
  }

  return { rows, totalCount, fromCache: false };
}

export { BLOG_LIST_PAGE_SIZE };
