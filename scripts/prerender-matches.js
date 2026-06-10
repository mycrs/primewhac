#!/usr/bin/env node
/**
 * Maç programı ana sayfalarını prerender eder (TR + DE). Detay sayfaları kaldırıldı.
 * Build sonrası: npm run build && node scripts/prerender-matches.js
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

  console.log('[prerender] Maç programı sayfaları (TR + DE) prerender edilecek');

  const server = await startStaticServer();
  const browser = await puppeteer.launch({ headless: true });

  // 1. TR: /mac-programi
  const outDirTr = path.join(DIST, 'mac-programi');
  fs.mkdirSync(outDirTr, { recursive: true });
  try {
    const pageTr = await browser.newPage();
    await pageTr.goto(`${BASE}/mac-programi`, { waitUntil: 'networkidle2', timeout: 30000 });
    await pageTr.waitForSelector('article', { timeout: 15000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 3000));
    const htmlTr = await pageTr.content();
    const titleTr = await pageTr.title();
    await pageTr.close();
    if (!titleTr.includes('404') && !titleTr.includes('Sayfa Bulunamadı')) {
      fs.writeFileSync(path.join(outDirTr, 'index.html'), htmlTr, 'utf8');
      console.log('  ✓ /mac-programi prerender edildi');
    }
  } catch (err) {
    console.warn('  ✗ /mac-programi:', err.message);
  }

  // 2. DE: /de/spielplan
  const outDirDe = path.join(DIST, 'de', 'spielplan');
  fs.mkdirSync(outDirDe, { recursive: true });
  try {
    const pageDe = await browser.newPage();
    await pageDe.goto(`${BASE}/de/spielplan`, { waitUntil: 'networkidle2', timeout: 30000 });
    await pageDe.waitForSelector('article', { timeout: 15000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 3000));
    const htmlDe = await pageDe.content();
    const titleDe = await pageDe.title();
    await pageDe.close();
    if (!titleDe.includes('404') && !titleDe.includes('Seite')) {
      fs.writeFileSync(path.join(outDirDe, 'index.html'), htmlDe, 'utf8');
      console.log('  ✓ /de/spielplan prerender edildi');
    }
  } catch (err) {
    console.warn('  ✗ /de/spielplan:', err.message);
  }

  await browser.close();
  server.close();
  console.log('[prerender] Bitti.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
