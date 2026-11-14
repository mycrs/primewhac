/**
 * SEO rota kaydı — sitemap, prerender ve build senkronizasyonu.
 */
import { supabase } from '../lib/customSupabaseClient.js';
import {
  BASE_KURULUM_DEVICES,
  LEGACY_KURULUM_REDIRECTS,
  HUB_CONFIG_KEYS,
} from '../data/kurulumDeviceSlugs.js';
import { plainTextLengthFromHtml, MIN_CONTENT_THRESHOLD } from './seoNoindexPaths.js';
import { BLOG_TRANSLATIONS_DE } from '../data/staticBlogTranslationsDE.js';

export { BASE_KURULUM_DEVICES, LEGACY_KURULUM_REDIRECTS };

const BASE_SET = new Set(BASE_KURULUM_DEVICES);

function slugsFromHubConfig(config, hubSlug) {
  const slugs = [hubSlug];
  if (Array.isArray(config?.apps)) {
    config.apps.forEach((app) => {
      if (app?.slug) slugs.push(app.slug);
    });
  }
  return slugs;
}

/**
 * @param {Record<string, unknown>|null|undefined} setupRow
 * @returns {string[]}
 */
export function collectAllKurulumSlugsFromSetup(setupRow) {
  const slugs = new Set(BASE_KURULUM_DEVICES);

  Object.entries(HUB_CONFIG_KEYS).forEach(([dbKey, hubSlug]) => {
    slugsFromHubConfig(setupRow?.[dbKey], hubSlug).forEach((s) => {
      if (s && !LEGACY_KURULUM_REDIRECTS[s]) slugs.add(s);
    });
  });

  return [...slugs];
}

/**
 * @returns {Promise<Record<string, unknown>|null>}
 */
export async function fetchSetupPageRow() {
  try {
    const { data, error } = await supabase.from('setup_pages').select('*').limit(1).maybeSingle();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Build öncesi sitemap + prerender için dinamik rotalar.
 * @returns {Promise<{
 *   extraKurulumSlugs: string[],
 *   allKurulumSlugs: string[],
 *   blogPosts: object[],
 *   packagesData: Record<string, unknown>|null
 * }>}
 */
export async function fetchBuildSeoExtras() {
  const setupRow = await fetchSetupPageRow();
  const allKurulumSlugs = collectAllKurulumSlugsFromSetup(setupRow);
  const extraKurulumSlugs = allKurulumSlugs.filter((s) => !BASE_SET.has(s));

  let blogPosts = [];
  try {
    const translatedFields = [
      'slug',
      'title',
      'seo_title',
      'seo_description',
      'excerpt',
      'content',
      'title_de',
      'seo_title_de',
      'seo_description_de',
      'excerpt_de',
      'content_de',
      'updated_at',
      'published_at',
    ].join(', ');
    const baseFields = [
      'slug',
      'title',
      'seo_title',
      'seo_description',
      'excerpt',
      'content',
      'updated_at',
      'published_at',
    ].join(', ');

    let queryResult = await supabase
      .from('blog_posts')
      .select(translatedFields)
      .not('published_at', 'is', null);

    // Bazı eski veritabanlarında Almanca sütunlar henüz bulunmayabilir.
    if (queryResult.error) {
      queryResult = await supabase
        .from('blog_posts')
        .select(baseFields)
        .not('published_at', 'is', null);
    }

    const { data, error } = queryResult;
    if (!error && data?.length) {
      blogPosts = data
        .filter((post) => post.slug && plainTextLengthFromHtml(post.content) >= MIN_CONTENT_THRESHOLD)
        .map((post) => {
          if (BLOG_TRANSLATIONS_DE[post.slug]) {
            const trDe = BLOG_TRANSLATIONS_DE[post.slug];
            return {
              ...post,
              title_de: trDe.title_de,
              seo_title_de: trDe.seo_title_de,
              seo_description_de: trDe.seo_description_de,
              excerpt_de: trDe.excerpt_de,
              content_de: trDe.content_de,
            };
          }
          return post;
        });
    }
  } catch {
    blogPosts = [];
  }

  let packagesData = null;
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'packagesData')
      .maybeSingle();

    if (!error && data?.value) {
      const value = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      if (value && typeof value === 'object' && !Array.isArray(value)) packagesData = value;
    }
  } catch {
    packagesData = null;
  }

  return { extraKurulumSlugs, allKurulumSlugs, blogPosts, packagesData };
}

/**
 * Sitemap'e eklenecek dinamik kurulum URL'leri (TR + DE).
 * @param {string[]} extraSlugs
 * @returns {{ loc: string, changefreq: string }[]}
 */
export function kurulumSitemapEntriesFromSlugs(extraSlugs) {
  const entries = [];
  extraSlugs.forEach((slug) => {
    if (LEGACY_KURULUM_REDIRECTS[slug]) return;
    entries.push({ loc: `/kurulum/${slug}`, changefreq: 'weekly' });
    entries.push({ loc: `/de/einrichtung/${slug}`, changefreq: 'weekly' });
  });
  return entries;
}
