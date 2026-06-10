import { supabase } from '@/lib/customSupabaseClient';
import { BLOG_LIST_COLUMNS, BLOG_LIST_PAGE_SIZE } from '@/constants/publicSupabaseQueries';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

/**
 * @param {{ pageIndex: number, cachePrefix: string }} opts
 * @returns {Promise<{ rows: object[], totalCount: number, error?: string, fromCache?: boolean }>}
 */
export async function loadBlogListPage({ pageIndex, cachePrefix }) {
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
    () =>
      supabase
        .from('blog_posts')
        .select(BLOG_LIST_COLUMNS, { count: 'exact' })
        .not('published_at', 'is', null)
        .order('featured', { ascending: false, nullsFirst: false })
        .order('published_at', { ascending: false })
        .range(from, to),
    { retries: 3, context: `blog_list_${cachePrefix}`, fallback: null, timeoutMs: 20000 }
  );

  if (error && isFallback) {
    return { rows: [], totalCount: 0, error: message || error?.message || 'fetch_failed' };
  }

  const rows = data || [];
  const totalCount = typeof count === 'number' ? count : rows.length;

  if (pageIndex === 0) {
    writeSessionCache(`${cachePrefix}_p0`, { rows, totalCount });
  } else {
    writeSessionCache(pageKey, { rows });
  }

  return { rows, totalCount, fromCache: false };
}

export { BLOG_LIST_PAGE_SIZE };
