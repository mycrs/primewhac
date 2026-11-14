#!/usr/bin/env node
/**
 * Build öncesi: Supabase'den hub uygulama slug'ları + blog yazıları → prerender/sitemap senkronu.
 * Çıktı: src/generated/buildSeoRoutes.json
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchBuildSeoExtras } from '../src/utils/seoRouteRegistry.js';
import { isBrandRiskBlogSlug } from '../src/constants/brandRiskBlogSlugs.js';
import { BLOG_TRANSLATIONS_DE } from '../src/data/staticBlogTranslationsDE.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../src/generated');
const outFile = path.join(outDir, 'buildSeoRoutes.json');

/**
 * Telif/marka riski taşıyan blog yazılarını manifest'ten düşür.
 * Supabase'de henüz yayından kaldırılmamış olsalar bile prerender edilmezler.
 */
function dropBrandRiskPosts(posts) {
  if (!Array.isArray(posts)) return posts;
  const kept = posts.filter((p) => !isBrandRiskBlogSlug(p?.slug));
  const removed = posts.length - kept.length;
  if (removed > 0) {
    console.log(`[sync-seo-routes] ${removed} riskli blog yazısı manifest dışı bırakıldı.`);
  }
  return kept;
}

function sanitizePost(post) {
  if (!post) return post;
  const p = { ...post };
  const clean = (val) => {
    if (typeof val !== 'string') return val;
    return val
      .replace(/MARKA_ADINIZ/gi, 'QruzeTV')
      .replace(/MARKA ADINIZ/gi, 'QruzeTV')
      .replace(/Qruze<[^>]*>HD<\/[^>]*>/gi, 'QruzeTV')
      .replace(/Qruze<[^>]*>HD/gi, 'QruzeTV')
      .replace(/Qruze\s*HD/gi, 'QruzeTV')
      .replace(/QruzeHD/gi, 'QruzeTV')
      .replace(/KaliteliIPTV/gi, 'QruzeTV')
      .replace(/PrimeWatch TV/gi, 'QruzeTV')
      .replace(/https?:\/\/(?:www\.)?qruzetv\.com/gi, 'https://cineverse.pro')
      .replace(/https?:\/\/(?:www\.)?kaliteliiptv\.com/gi, 'https://cineverse.pro')
      .replace(/https?:\/\/(?:www\.)?primewatch\.tv/gi, 'https://cineverse.pro')
      .replace(/Qruze Tv /gi, 'QruzeTV ');
  };
  p.title = clean(p.title);
  p.seo_title = clean(p.seo_title);
  p.seo_description = clean(p.seo_description);
  p.excerpt = clean(p.excerpt);
  p.content = clean(p.content);

  // Authentische deutsche Übersetzung aus staticBlogTranslationsDE anheften
  if (BLOG_TRANSLATIONS_DE[p.slug]) {
    const trDe = BLOG_TRANSLATIONS_DE[p.slug];
    p.title_de = trDe.title_de;
    p.seo_title_de = trDe.seo_title_de;
    p.seo_description_de = trDe.seo_description_de;
    p.excerpt_de = trDe.excerpt_de;
    p.content_de = trDe.content_de;
  }

  return p;
}

function readPreviousManifest() {
  try {
    const value = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    if (Array.isArray(value?.allKurulumSlugs) && Array.isArray(value?.blogPosts)) return value;
  } catch {
    // İlk senkronizasyonda geçerli bir önceki dosya olmayabilir.
  }
  return null;
}

async function main() {
  console.log('[sync-seo-routes] Dinamik SEO rotaları alınıyor...');
  const previousManifest = readPreviousManifest();
  try {
    const data = await fetchBuildSeoExtras();
    if (previousManifest) {
      if (!data.blogPosts?.length && previousManifest.blogPosts?.length) {
        data.blogPosts = previousManifest.blogPosts;
      }
      if (!data.extraKurulumSlugs?.length && previousManifest.extraKurulumSlugs?.length) {
        data.extraKurulumSlugs = previousManifest.extraKurulumSlugs;
        data.allKurulumSlugs = previousManifest.allKurulumSlugs;
      }
      if (!data.packagesData && previousManifest.packagesData) {
        data.packagesData = previousManifest.packagesData;
      }
    }
    data.blogPosts = dropBrandRiskPosts(data.blogPosts).map(sanitizePost);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    console.log(
      `[sync-seo-routes] Bitti. ${data.extraKurulumSlugs.length} ek kurulum slug, ${data.blogPosts.length} blog yazısı → ${path.relative(process.cwd(), outFile)}`,
    );
  } catch (err) {
    console.warn('[sync-seo-routes] Uyarı — son geçerli rota manifesti korunacak:', err?.message || err);
    if (previousManifest) return;
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      outFile,
      `${JSON.stringify({
        extraKurulumSlugs: [],
        allKurulumSlugs: [],
        blogPosts: [],
        packagesData: null,
      }, null, 2)}\n`,
      'utf8',
    );
  }
}

main();
