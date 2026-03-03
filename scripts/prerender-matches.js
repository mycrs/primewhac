#!/usr/bin/env node
/**
 * Maç programı ana sayfası + maç detay sayfalarını prerender eder (SSG - SEO için HTML'de içerik).
 * Build sonrası çalıştırılır: npm run build && node scripts/prerender-matches.js
 */
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(process.cwd(), 'dist');
const PORT = 4178;
const BASE = `http://localhost:${PORT}`;

const LEAGUES = ['super-lig-2025', 'epl-2024', 'la-liga-2025', 'champions-league-2025', 'bundesliga-2025', 'serie-a-2025'];
const FIXTURE_BASE = 'https://fixturedownload.com/feed/json';

function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  const tr = { ç: 'c', ğ: 'g', ş: 's', ü: 'u', ö: 'o', ı: 'i', Ç: 'c', Ğ: 'g', Ş: 's', Ü: 'u', Ö: 'o', İ: 'i' };
  return str.toLowerCase().split('').map((c) => tr[c] || c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function makeSlug(home, away, date) {
  return `${slugify(home)}-vs-${slugify(away)}-${date}`;
}

async function getMatchSlugs() {
  const slugs = new Set();
  const dates = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  for (const league of LEAGUES) {
    try {
      const res = await fetch(`${FIXTURE_BASE}/${league}`);
      if (!res.ok) continue;
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.matches || []);
      for (const m of list) {
        const matchDate = (m.DateUtc || m.date || '').toString().split(' ')[0].split('T')[0];
        if (!dates.includes(matchDate)) continue;
        const home = (m.HomeTeam || m.team1 || m.homeTeam?.name || '-').toString();
        const away = (m.AwayTeam || m.team2 || m.awayTeam?.name || '-').toString();
        slugs.add(makeSlug(home, away, matchDate));
      }
    } catch (_) {}
  }
  return [...slugs];
}

function startStaticServer() {
  const app = express();
  app.use(express.static(DIST));
  app.get('/', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
  app.get('/{*any}', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => resolve(server));
  });
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ bulunamadı. Önce npm run build çalıştırın.');
    process.exit(1);
  }

  const slugs = await getMatchSlugs();
  console.log(`[prerender] Ana sayfa + ${slugs.length} maç sayfası prerender edilecek`);

  const outDir = path.join(DIST, 'mac-programi');
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }

  const server = await startStaticServer();
  const browser = await puppeteer.launch({ headless: true });

  fs.mkdirSync(outDir, { recursive: true });

  // 1. Ana maç programı sayfası (/mac-programi)
  try {
    const mainPage = await browser.newPage();
    await mainPage.goto(`${BASE}/mac-programi`, { waitUntil: 'networkidle2', timeout: 30000 });
    await mainPage.waitForSelector('article', { timeout: 15000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 4000));
    const mainHtml = await mainPage.content();
    const mainTitle = await mainPage.title();
    await mainPage.close();
    if (!mainTitle.includes('404') && !mainTitle.includes('Sayfa Bulunamadı')) {
      fs.writeFileSync(path.join(outDir, 'index.html'), mainHtml, 'utf8');
      console.log(`  ✓ Ana sayfa (/mac-programi) prerender edildi`);
    }
  } catch (err) {
    console.warn(`  ✗ Ana sayfa:`, err.message);
  }

  let done = 0;
  for (const slug of slugs) {
    try {
      const page = await browser.newPage();
      await page.goto(`${BASE}/mac-programi/${slug}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('article p', { timeout: 20000 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 800));
      const html = await page.content();
      const title = await page.title();
      await page.close();

      if (title.includes('404') || title.includes('Sayfa Bulunamadı') || html.includes('Maç bulunamadı')) {
        console.warn(`  ✗ ${slug}: maç bulunamadı veya 404, atlanıyor`);
        continue;
      }

      const slugDir = path.join(outDir, slug);
      if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
      fs.writeFileSync(path.join(slugDir, 'index.html'), html, 'utf8');
      done++;
      if (done % 5 === 0) console.log(`  ${done}/${slugs.length}`);
    } catch (err) {
      console.warn(`  ✗ ${slug}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log(`[prerender] Bitti. Ana sayfa + ${done} maç detay sayfası oluşturuldu.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
