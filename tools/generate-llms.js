#!/usr/bin/env node
/**
 * llms.txt — statik public/llms.txt korunur; otomatik route taraması devre dışı.
 * Güncelleme: public/llms.txt dosyasını doğrudan düzenleyin.
 * Zorla yeniden yazmak için: node tools/generate-llms.js --check
 */
import fs from 'fs';
import path from 'path';

const outputPath = path.join(process.cwd(), 'public', 'llms.txt');

function main() {
  if (!fs.existsSync(outputPath)) {
    console.error('[generate-llms] public/llms.txt bulunamadı — dosyayı elle oluşturun.');
    process.exit(1);
  }

  const stat = fs.statSync(outputPath);
  const preview = fs.readFileSync(outputPath, 'utf8').split('\n')[0]?.trim() || '';
  console.log(
    `[generate-llms] Statik public/llms.txt korunuyor (${stat.size} bayt, başlık: ${preview}). Otomatik üretim kapalı.`
  );
}

const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;

if (isMainModule) {
  main();
}
