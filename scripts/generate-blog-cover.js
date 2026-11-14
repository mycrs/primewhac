/**
 * Blog kapak görseli üretici — %100 özgün, markalı afiş.
 *
 * AI görselleri telif riski taşıyabileceğinden (gerçek karakterlere,
 * posterlere benzerlik) kapak; koyu sinematik zemin, kırmızı gradyan,
 * QruzeTV logosu ve yazı başlığından oluşan özgün bir şablondan
 * Puppeteer ile render edilir. Hiçbir telifli görsel kullanılmaz.
 *
 * Kullanım:
 *   node scripts/generate-blog-cover.js <slug> "<başlık>" [kategori]
 *
 * Çıktı: public/blog-covers/<slug>.jpg (1200x630, og:image uyumlu)
 */
import puppeteer from 'puppeteer';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'blog-covers');
const LOGO_PATH = path.join(ROOT, 'public', 'logo.png');

// about:blank sayfaları file:// alt kaynaklarını engellediği için logo base64 gömülür
function loadLogoDataUri() {
  try {
    if (!existsSync(LOGO_PATH)) return '';
    const b64 = readFileSync(LOGO_PATH).toString('base64');
    return `data:image/png;base64,${b64}`;
  } catch {
    return '';
  }
}
const LOGO_DATA_URI = loadLogoDataUri();

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function fitFontSize(title) {
  const len = title.length;
  if (len <= 40) return 72;
  if (len <= 60) return 62;
  if (len <= 85) return 54;
  if (len <= 110) return 46;
  return 40;
}

function buildHtml(title, category) {
  const fontSize = fitFontSize(title);
  const catChip = category
    ? `<div style="display:inline-block;padding:10px 22px;border-radius:999px;background:rgba(229,9,20,0.18);border:1.5px solid rgba(229,9,20,0.55);color:#ff8a8f;font-size:22px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:34px;">${escapeHtml(category)}</div>`
    : '';
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; overflow:hidden; font-family:'Segoe UI',Arial,Helvetica,sans-serif; background:#0a0a0a; }
  .stage { position:relative; width:1200px; height:630px; background:
      radial-gradient(900px 500px at 85% 15%, rgba(229,9,20,0.30), transparent 60%),
      radial-gradient(700px 500px at 10% 90%, rgba(178,7,16,0.25), transparent 60%),
      linear-gradient(160deg, #101010 0%, #0a0a0a 55%, #140708 100%); }
  .grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse at center, black 30%, transparent 78%); }
  .bar { position:absolute; left:0; top:0; width:14px; height:100%; background:linear-gradient(180deg,#e50914,#b20710); box-shadow:0 0 40px rgba(229,9,20,0.6); }
  .content { position:absolute; inset:0; padding:64px 72px 56px 88px; display:flex; flex-direction:column; justify-content:space-between; }
  .title { color:#ffffff; font-weight:800; font-size:${fontSize}px; line-height:1.18; letter-spacing:-1px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; text-shadow:0 4px 30px rgba(0,0,0,0.6); }
  .accent { color:#ff4d55; }
  .footer { display:flex; align-items:center; justify-content:space-between; }
  .brand { display:flex; align-items:center; gap:16px; }
  .brand img { width:52px; height:52px; border-radius:12px; }
  .brandname { color:#ffffff; font-size:30px; font-weight:800; letter-spacing:0.5px; }
  .brandname span { color:#e50914; }
  .site { color:#9ca3af; font-size:22px; font-weight:600; letter-spacing:1px; }
  .glow { position:absolute; right:-120px; bottom:-120px; width:420px; height:420px; border-radius:50%; background:radial-gradient(circle, rgba(229,9,20,0.35), transparent 65%); }
</style>
</head>
<body>
  <div class="stage">
    <div class="grid"></div>
    <div class="bar"></div>
    <div class="glow"></div>
    <div class="content">
      <div>
        ${catChip}
        <div class="title">${escapeHtml(title)}</div>
      </div>
      <div class="footer">
        <div class="brand">
          ${LOGO_DATA_URI ? `<img src="${LOGO_DATA_URI}" alt="">` : ''}
          <div class="brandname">Qruze<span>TV</span></div>
        </div>
        <div class="site">cineverse.pro/blog</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  const [slug, title, category] = process.argv.slice(2);
  if (!slug || !title) {
    console.error('Kullanım: node scripts/generate-blog-cover.js <slug> "<başlık>" [kategori]');
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${slug}.jpg`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(buildHtml(title, category || ''), { waitUntil: 'networkidle0' });
    await page.screenshot({ path: outFile, type: 'jpeg', quality: 85 });
  } finally {
    await browser.close();
  }

  console.log(`Kapak oluşturuldu: public/blog-covers/${slug}.jpg`);
}

main().catch((err) => {
  console.error(`Kapak üretimi başarısız: ${err.message}`);
  process.exit(1);
});
