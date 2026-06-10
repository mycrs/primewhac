import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'src');

const REPLACEMENTS = [
  ['#A855F7', '#e50914'],
  ['#a855f7', '#e50914'],
  ['#9333EA', '#b20710'],
  ['#9333ea', '#b20710'],
  ['#7E22CE', '#b20710'],
  ['#7e22ce', '#b20710'],
  ['#6D28D9', '#b20710'],
  ['#6d28d9', '#b20710'],
  ['#7c3aed', '#e50914'],
  ['#4f46e5', '#b20710'],
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx|tsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const changed = [];
for (const file of files) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s;
  for (const [a, b] of REPLACEMENTS) {
    s = s.split(a).join(b);
  }
  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8');
    changed.push(path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/'));
  }
}
console.log(JSON.stringify({ changedCount: changed.length, files: changed.sort() }, null, 2));
