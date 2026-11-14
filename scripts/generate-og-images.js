#!/usr/bin/env node
/**
 * Marka kimliğine uygun (logo + kırmızı/siyah gradient) statik og:image kartları üretir.
 * Dış stok görsel kullanmaz; mevcut public/logo.png ve site renk paletiyle çalışır.
 *
 * Kullanım: node scripts/generate-og-images.js
 * package.json: npm run generate:og
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'og');
const LOGO_PATH = path.join(ROOT, 'public', 'logo.png');

const CARDS = [
  { file: 'home.jpg', title: 'Türkiye ve Yurt Dışı İçin 4K IPTV' },
  { file: 'paketler.jpg', title: 'IPTV Paketleri ve Fiyatları 2026' },
  { file: 'kanallar.jpg', title: '10.000+ Kanal — Spor, Film, Dizi' },
  { file: 'sss.jpg', title: 'IPTV Sıkça Sorulan Sorular' },
  { file: 'karsilastirma.jpg', title: 'IPTV Paket Karşılaştırması' },
  { file: 'hakkimizda.jpg', title: 'QruzeTV Hakkında' },
  { file: 'bayilik.jpg', title: 'IPTV Bayilik Programı' },
  { file: 'test.jpg', title: 'Ücretsiz IPTV Test Yayını' },
  { file: 'kurulum-android-tv.jpg', title: 'Android TV Kurulum Rehberi' },
  { file: 'kurulum-ios.jpg', title: 'iPhone & iPad Kurulum Rehberi' },
  { file: 'kurulum-mac.jpg', title: 'Mac Kurulum Rehberi' },
  { file: 'kurulum-windows.jpg', title: 'Windows PC Kurulum Rehberi' },
  { file: 'kurulum-tablet.jpg', title: 'Tablet Kurulum Rehberi' },
  { file: 'kurulum-android-phone.jpg', title: 'Android Telefon Kurulum Rehberi' },
  { file: 'kurulum-genel.jpg', title: 'IPTV Kurulum Rehberi' },
  { file: 'titan-iptv.jpg', title: 'Titan IPTV Satın Al | Orijinal Paketler' },
  { file: 'timsah-iptv.jpg', title: 'Timsah Panel IPTV Satın Al | Orijinal Sunucu' },
  { file: 'mpremium-iptv.jpg', title: 'MPremium IPTV Satın Al | Orijinal Paketler' },
  { file: 'vera-iptv.jpg', title: 'Vera IPTV Satın Al | Orijinal Sunucu' },
];

function buildHtml(title, logoDataUri) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; overflow:hidden; font-family:Arial, Helvetica, sans-serif; background:#0a0a0a; position:relative; }
  .glow { position:absolute; width:900px; height:900px; left:-260px; top:-320px; background:radial-gradient(circle, rgba(229,9,20,0.45) 0%, rgba(229,9,20,0) 70%); }
  .glow2 { position:absolute; width:700px; height:700px; right:-200px; bottom:-280px; background:radial-gradient(circle, rgba(229,9,20,0.28) 0%, rgba(229,9,20,0) 70%); }
  .frame { position:absolute; inset:0; border:2px solid rgba(229,9,20,0.35); margin:28px; border-radius:28px; }
  .brand { position:absolute; top:56px; left:64px; display:flex; align-items:center; gap:16px; }
  .brand img { width:56px; height:56px; border-radius:14px; }
  .brand span { font-weight:800; font-size:30px; color:#fff; letter-spacing:0.5px; }
  .title { position:absolute; left:64px; right:64px; top:230px; font-weight:800; font-size:62px; line-height:1.15; color:#fff; text-shadow: 0 4px 30px rgba(229,9,20,0.4); }
  .url { position:absolute; bottom:48px; left:64px; font-size:24px; color:#ff5b62; font-weight:700; letter-spacing:1px; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="glow2"></div>
  <div class="frame"></div>
  <div class="brand"><img src="${logoDataUri}" /><span>QruzeTV</span></div>
  <div class="title">${title}</div>
  <div class="url">cineverse.pro</div>
</body></html>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const logoDataUri = `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`;

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

    for (const card of CARDS) {
      await page.setContent(buildHtml(card.title, logoDataUri), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(OUT_DIR, card.file), type: 'jpeg', quality: 92 });
      console.log(`[generate-og-images] ${card.file} ✓`);
    }
  } finally {
    await browser.close();
  }
  console.log(`[generate-og-images] ${CARDS.length} görsel → public/og/`);
}

main().catch((err) => {
  console.error('[generate-og-images] Hata:', err?.message || err);
  process.exit(1);
});
