#!/usr/bin/env node
/**
 * Üretim çıktısı için bağımlılıksız SEO/GEO kalite kapısı.
 *
 * Kontroller:
 * - temel head etiketleri, canonical ve hreflang bütünlüğü
 * - sitemap ↔ prerender HTML uyumu
 * - JSON-LD sözdizimi
 * - tekil title/canonical değerleri
 * - dil, görünür içerik ve bozuk UTF-8/önceki marka kalıntıları
 *
 * Kullanım: npm run audit:seo
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const expectedOrigin = String(process.env.VITE_SITE_URL || 'https://cineverse.pro').replace(/\/+$/, '');

const errors = [];
const warnings = [];

function report(bucket, file, message) {
  bucket.push(`${path.relative(root, file).replaceAll('\\', '/')}: ${message}`);
}

function decodeEntities(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(value = '') {
  return decodeEntities(
    value
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function oneMatch(html, expression) {
  return expression.exec(html)?.[1]?.trim() || '';
}

function allMatches(html, expression) {
  return [...html.matchAll(expression)].map((match) => match[1]?.trim() || '');
}

function extractAttribute(tag, name) {
  const match = new RegExp(`\\b${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i').exec(tag);
  return match?.[2]?.trim() || '';
}

function extractMetaContents(html, name) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => extractAttribute(tag, 'name').toLowerCase() === name.toLowerCase())
    .map((tag) => extractAttribute(tag, 'content'));
}

function extractLink(html, rel, extraAttribute) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  return tags
    .filter((tag) => new RegExp(`\\brel=["']${rel}["']`, 'i').test(tag))
    .filter((tag) => !extraAttribute || new RegExp(extraAttribute, 'i').test(tag))
    .map((tag) => oneMatch(tag, /\bhref=["']([^"']+)["']/i))
    .filter(Boolean);
}

function canonicalToDistFile(url) {
  const parsed = new URL(url);
  const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
  return pathname === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, pathname.slice(1), 'index.html');
}

function collectHtmlFiles(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...collectHtmlFiles(full));
    } else if (entry.isFile() && entry.name === 'index.html') {
      found.push(full);
    }
  }
  return found;
}

if (!fs.existsSync(distDir)) {
  console.error('[seo-audit] dist/ bulunamadı. Önce npm run build:prerender çalıştırın.');
  process.exit(1);
}

const htmlFiles = collectHtmlFiles(distDir);
if (htmlFiles.length === 0) {
  console.error('[seo-audit] dist/ içinde prerender index.html bulunamadı. Önce üretim derlemesi alın.');
  process.exit(1);
}
const titleOwners = new Map();
const canonicalOwners = new Map();
const canonicalByFile = new Map();
const indexableCanonicals = new Set();
const pageSummaries = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const title = decodeEntities(oneMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  const descriptions = extractMetaContents(html, 'description').map(decodeEntities);
  const robots = extractMetaContents(html, 'robots')[0] || '';
  const canonicals = extractLink(html, 'canonical');
  const language = oneMatch(html, /<html\b[^>]*\blang=["']([^"']+)["']/i);
  const headings = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map(stripHtml).filter(Boolean);
  const visibleText = stripHtml(oneMatch(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i));
  const isIndexable = !/\bnoindex\b/i.test(robots);
  const jsonLdBlocks = allMatches(
    html,
    /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi,
  );

  if (!title) report(errors, file, 'title eksik');
  if (descriptions.length !== 1 || !descriptions[0]) {
    report(errors, file, `meta description sayısı ${descriptions.length} (1 olmalı)`);
  }
  if (canonicals.length !== 1) {
    report(errors, file, `canonical sayısı ${canonicals.length} (1 olmalı)`);
  }
  if (!robots) report(errors, file, 'meta robots eksik');
  if (!/^(tr|de)(-[A-Z]{2})?$/i.test(language)) report(errors, file, `html lang geçersiz veya eksik: "${language}"`);
  if (isIndexable && headings.length !== 1) {
    report(errors, file, `indexlenebilir sayfada görünür H1 sayısı ${headings.length} (1 olmalı)`);
  }
  if (isIndexable && visibleText.length < 280) {
    report(errors, file, `indexlenebilir sayfa çok ince içerik içeriyor (${visibleText.length} karakter)`);
  }

  const mojibake = html.match(
    /(?:\u00C3[\u0080-\u00BF]|\u00C2[\u0080-\u00BF]|\u00E2\u0080[\u0080-\u00BF]|\uFFFD)/u,
  );
  if (mojibake) report(errors, file, `bozuk UTF-8 dizisi bulundu: "${mojibake[0]}"`);
  if (/\b(?:Qruze\s*HD|StreamTR)\b/i.test(visibleText)) {
    report(errors, file, 'görünür içerikte önceki marka adı bulundu');
  }

  jsonLdBlocks.forEach((block, index) => {
    try {
      JSON.parse(decodeEntities(block));
    } catch (error) {
      report(errors, file, `JSON-LD #${index + 1} ayrıştırılamıyor: ${error.message}`);
    }
  });

  if (canonicals[0]) {
    const canonical = canonicals[0];
    canonicalByFile.set(file, canonical);
    try {
      const parsed = new URL(canonical);
      if (parsed.origin !== expectedOrigin) {
        report(errors, file, `canonical origin yanlış: ${parsed.origin}`);
      }
      if (parsed.search || parsed.hash) report(errors, file, 'canonical query/hash içeriyor');
      if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) {
        report(errors, file, 'canonical trailing slash içermiyor');
      }
      if (isIndexable) indexableCanonicals.add(canonical);
    } catch {
      report(errors, file, `canonical mutlak URL değil: "${canonical}"`);
    }
  }

  if (isIndexable && title) {
    titleOwners.set(title, [...(titleOwners.get(title) || []), file]);
  }
  if (isIndexable && canonicals[0]) {
    canonicalOwners.set(canonicals[0], [...(canonicalOwners.get(canonicals[0]) || []), file]);
  }

  const hreflangTags = [...html.matchAll(/<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["']([^"']+)["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)];
  for (const [, hreflang, href] of hreflangTags) {
    if (!['tr', 'de', 'x-default'].includes(hreflang.toLowerCase())) {
      report(warnings, file, `beklenmeyen hreflang: "${hreflang}"`);
    }
    try {
      const alternateFile = canonicalToDistFile(href);
      if (!fs.existsSync(alternateFile)) report(errors, file, `hreflang hedefi prerender edilmemiş: ${href}`);
    } catch {
      report(errors, file, `hreflang URL geçersiz: ${href}`);
    }
  }

  pageSummaries.push({ file, title, descriptions, robots, canonicals, language, headings, visibleText });
}

for (const [title, files] of titleOwners) {
  if (files.length > 1) {
    report(errors, files[0], `yinelenen title (${files.length} sayfa): "${title}"`);
  }
}
for (const [canonical, files] of canonicalOwners) {
  if (files.length > 1) {
    report(errors, files[0], `yinelenen canonical (${files.length} sayfa): ${canonical}`);
  }
}

if (!fs.existsSync(sitemapPath)) {
  report(errors, sitemapPath, 'sitemap.xml eksik');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locs = allMatches(sitemap, /<loc>([\s\S]*?)<\/loc>/gi).map(decodeEntities);
  const uniqueLocs = new Set(locs);
  if (locs.length !== uniqueLocs.size) report(errors, sitemapPath, 'yinelenen <loc> değerleri var');

  for (const loc of uniqueLocs) {
    try {
      const parsed = new URL(loc);
      if (parsed.origin !== expectedOrigin) report(errors, sitemapPath, `farklı origin: ${loc}`);
      if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) {
        report(errors, sitemapPath, `trailing slash eksik: ${loc}`);
      }
      if (!indexableCanonicals.has(loc)) {
        report(errors, sitemapPath, `indexlenebilir prerender canonical bulunamadı: ${loc}`);
      }
    } catch {
      report(errors, sitemapPath, `geçersiz URL: ${loc}`);
    }
  }

  for (const canonical of indexableCanonicals) {
    if (!uniqueLocs.has(canonical)) {
      const file = [...canonicalByFile].find(([, value]) => value === canonical)?.[0] || sitemapPath;
      report(warnings, file, `indexlenebilir canonical sitemap'te yok: ${canonical}`);
    }
  }
}

console.log(`[seo-audit] ${htmlFiles.length} prerender HTML denetlendi.`);
console.log(`[seo-audit] ${indexableCanonicals.size} indexlenebilir canonical bulundu.`);

if (warnings.length) {
  console.warn(`\n[seo-audit] ${warnings.length} uyarı:`);
  warnings.forEach((warning) => console.warn(`  - ${warning}`));
}

if (errors.length) {
  console.error(`\n[seo-audit] ${errors.length} hata:`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('[seo-audit] Başarılı — kritik SEO/GEO tutarsızlığı bulunmadı.');
