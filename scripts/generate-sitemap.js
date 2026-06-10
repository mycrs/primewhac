#!/usr/bin/env node
/**
 * Sitemap XML üretir ve public/sitemap.xml'e yazar.
 * Blog: Supabase `blog_posts` (yayındakiler). Hariç tutulan path'ler EXCLUDED_PATTERNS.
 *
 * Hreflang: `generateSitemapXml` (src/utils/sitemapGenerator.js) her uygun <url> için
 * xmlns:xhtml ve <xhtml:link rel="alternate" hreflang="tr|de|x-default"> ekler;
 * TR/DE eşlemesi seoCanonicalHreflang.js ile uyumludur (/ ↔ /de, /mac-programi ↔ /de/spielplan, …).
 *
 * Kullanım: node scripts/generate-sitemap.js
 * package.json: npm run generate:sitemap
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EXCLUDED_PATTERNS } from '../src/sitemapExcludedPatterns.js';
import { generateSitemapXml } from '../src/utils/sitemapGenerator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const BASE_URL = process.env.VITE_SITE_URL || 'https://streamtr.eu';

async function main() {
  console.log('[generate-sitemap] Sitemap üretiliyor...');
  try {
    const xml = await generateSitemapXml(BASE_URL, { excludedPatterns: EXCLUDED_PATTERNS });
    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
    const count = (xml.match(/<url>/g) || []).length;
    console.log(`[generate-sitemap] Bitti. ${count} URL → public/sitemap.xml`);
  } catch (err) {
    console.error('[generate-sitemap] Hata:', err?.message || err);
    process.exit(1);
  }
}

main();
