#!/usr/bin/env node
/**
 * Tek komutla tam build: pre-adimlar hata verse bile devam eder,
 * vite build ve postbuild basarisiz olursa cikis kodu 1 doner.
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function run(name, cmd, args = []) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: true });
  return r.status;
}

const steps = [
  ['generate-sitemap', 'node', ['scripts/generate-sitemap.js']],
  ['generate-llms', 'node', ['tools/generate-llms.js']],
  ['sync-seo-routes', 'node', ['scripts/sync-seo-routes.mjs']],
];

for (const [name, cmd, args] of steps) {
  const code = run(name, cmd, args);
  if (code !== 0) console.warn(`[build] ${name} cikis kodu ${code}, devam ediliyor.`);
}

let code = run('vite build', 'npx', ['vite', 'build']);
if (code !== 0) {
  console.error('[build] vite build basarisiz.');
  process.exit(1);
}

code = run('postbuild-copy-seo-assets', 'node', ['scripts/postbuild-copy-seo-assets.js']);
if (code !== 0) {
  console.error('[build] postbuild basarisiz.');
  process.exit(1);
}

console.log('[build] Tamamlandi.');
