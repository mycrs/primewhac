/**
 * Agent transcript jsonl içinden kullanıcı mesajındaki TSV bloğunu çıkarır.
 * Kullanım: node scripts/extract-qruzebayi-from-transcript.mjs <dosya.jsonl> [çıktı.tsv]
 */
import fs from 'fs';
import readline from 'readline';

const jsonlPath = process.argv[2];
const outPath = process.argv[3] || 'data/qruzebayi.tsv';

if (!jsonlPath || !fs.existsSync(jsonlPath)) {
  console.error('Kullanım: node scripts/extract-qruzebayi-from-transcript.mjs <transcript.jsonl> [çıktı.tsv]');
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(jsonlPath, { encoding: 'utf8' }),
  crlfDelay: Infinity,
});

let written = false;
for await (const line of rl) {
  if (!line.includes('"role":"user"') || !line.includes('544822') || !line.includes('EgeKRKRT')) continue;
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  const text = obj?.message?.content?.[0]?.text;
  if (typeof text !== 'string') continue;
  let idx = text.indexOf('544822\t');
  if (idx === -1) idx = text.indexOf('544822');
  if (idx === -1) continue;
  let tsv = text.slice(idx);
  const endTag = tsv.indexOf('</user_query>');
  if (endTag !== -1) tsv = tsv.slice(0, endTag);
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(outPath, tsv.trimEnd() + '\n', 'utf8');
  written = true;
  console.error(`Yazıldı: ${outPath} (${tsv.length} karakter)`);
  break;
}

if (!written) {
  console.error('Uygun satır bulunamadı (544822 ile başlayan kullanıcı mesajı).');
  process.exit(1);
}
