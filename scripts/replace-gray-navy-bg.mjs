/**
 * Koyu mavi/lacivert görünen arka planlar: hex + gray/zinc/neutral 900/950 + gray gradients
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|jsx)$/.test(name)) out.push(p);
  }
  return out;
}

function transform(content) {
  let s = content;

  const to0a = [
    '0d1117',
    '0d1b2a',
    '1a1a2e',
    '0f172a',
    '1e293b',
    '0a0f1e',
    '111827',
    '0f0f1e',
  ];
  for (const h of to0a) {
    s = s.replace(new RegExp(`#${h}`, 'gi'), '#0a0a0a');
  }

  s = s.replace(/#131325/gi, '#141414');
  s = s.replace(/#16162a/gi, '#141414');

  s = s.replace(/\bbg-(gray|zinc|neutral)-(900|950)(\/[\d.]+)?\b/g, (_, __, ___, op) => `bg-[#0a0a0a]${op || ''}`);

  s = s.replace(/\bfrom-gray-(900|950)(\/[\d.]+)?\b/g, (_, __, op) => `from-[#0a0a0a]${op || ''}`);
  s = s.replace(/\bto-gray-(900|950)(\/[\d.]+)?\b/g, (_, __, op) => `to-[#141414]${op || ''}`);
  s = s.replace(/\bvia-gray-(900|950)(\/[\d.]+)?\b/g, (_, __, op) => `via-[#0a0a0a]${op || ''}`);

  return s;
}

const files = walk(path.join(ROOT, 'src'));
const changed = [];
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed.push(path.relative(ROOT, file).replace(/\\/g, '/'));
  }
}

console.log(JSON.stringify({ changedCount: changed.length, files: changed.sort() }, null, 2));
