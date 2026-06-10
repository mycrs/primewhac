import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'src');

const REPLACEMENTS = [
  ['rgba(168,85,247,', 'rgba(229,9,20,'],
  ['rgba(147,51,234,', 'rgba(229,9,20,'],
  ['rgba(192,38,211,', 'rgba(229,9,20,'],
  ['rgba(217,70,239,', 'rgba(229,9,20,'],
  ['rgba(79,70,229,', 'rgba(229,9,20,'],
  ['rgba(124,58,237,', 'rgba(229,9,20,'],
  ['rgba(99,102,241,', 'rgba(229,9,20,'],
  ['rgba(34,211,238,', 'rgba(229,9,20,'],
  ['rgba(6,182,212,', 'rgba(229,9,20,'],
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
  s = s.split('selection:bg-primary/30').join('selection:bg-white/20');
  if (s !== before) {
    fs.writeFileSync(file, s, 'utf8');
    changed.push(path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/'));
  }
}
console.log(JSON.stringify({ changedCount: changed.length, files: changed.sort() }, null, 2));
