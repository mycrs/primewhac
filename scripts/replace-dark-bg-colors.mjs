/**
 * bg-blue/slate/indigo/navy → #0a0a0a / #141414
 * from/to/via blue/slate/indigo/navy gradients
 * hardcoded navy-ish hex → brand blacks
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
    else if (/\.(tsx|jsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

function bgHex(color, shadeStr) {
  if (color === 'navy') return '#0a0a0a';
  const s = parseInt(shadeStr, 10);
  if (Number.isNaN(s)) return '#0a0a0a';
  if (s <= 600) return '#141414';
  return '#0a0a0a';
}

function viaHex(shadeStr) {
  const s = parseInt(shadeStr, 10);
  if (Number.isNaN(s)) return '#0a0a0a';
  return s <= 600 ? '#141414' : '#0a0a0a';
}

function transform(content) {
  let s = content;

  s = s.replace(/\bbg-(blue|slate|indigo|navy)-(\d+)(\/[\d.]+)?\b/g, (_, color, shade, op) => {
    return `bg-[${bgHex(color, shade)}]${op || ''}`;
  });

  s = s.replace(/\bfrom-(blue|slate|indigo|navy)-(\d+)(\/[\d.]+)?\b/g, (_, _c, _s, op) => `from-[#0a0a0a]${op || ''}`);

  s = s.replace(/\bto-(blue|slate|indigo|navy)-(\d+)(\/[\d.]+)?\b/g, (_, _c, _s, op) => `to-[#141414]${op || ''}`);

  s = s.replace(/\bvia-(blue|slate|indigo|navy)-(\d+)(\/[\d.]+)?\b/g, (_, _c, shade, op) => `via-[${viaHex(shade)}]${op || ''}`);

  const to0a = ['#1e293b', '#0f172a', '#1a1a2e', '#16213e', '#0d1b2a'];
  const to14 = ['#1e3a5f', '#1a2744', '#0a1628'];

  for (const h of to0a) {
    s = s.replace(new RegExp(h.replace('#', '#'), 'gi'), '#0a0a0a');
  }
  for (const h of to14) {
    s = s.replace(new RegExp(h.replace('#', '#'), 'gi'), '#141414');
  }

  return s;
}

const fileList = walk(path.join(ROOT, 'src'));
const changed = [];
for (const file of fileList) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed.push(path.relative(ROOT, file).replace(/\\/g, '/'));
  }
}

console.log(JSON.stringify({ changedCount: changed.length, files: changed.sort() }, null, 2));
