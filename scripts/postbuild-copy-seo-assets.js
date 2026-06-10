#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const filesToCopy = ['sitemap.xml', 'robots.txt', 'llms.txt', '.htaccess'];

function stampAppDeployMeta(html) {
  if (html.includes('name="app-deploy"')) return html;
  return html.replace(
    /<head(\s[^>]*)?>/i,
    `<head$1><meta name="app-deploy" content="${new Date().toISOString()}" />`,
  );
}

function walkStampHtml(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkStampHtml(full);
    else if (e.name === 'index.html') {
      const raw = fs.readFileSync(full, 'utf8');
      const next = stampAppDeployMeta(raw);
      if (next !== raw) {
        fs.writeFileSync(full, next, 'utf8');
        console.log(`[postbuild-copy-seo-assets] app-deploy eklendi: ${path.relative(projectRoot, full)}`);
      }
    }
  }
}

if (!fs.existsSync(distDir)) {
  console.log('[postbuild-copy-seo-assets] dist klasoru bulunamadi, kopyalama atlandi.');
  process.exit(0);
}

for (const fileName of filesToCopy) {
  const source = path.join(projectRoot, 'public', fileName);
  const destination = path.join(distDir, fileName);

  if (!fs.existsSync(source)) {
    console.warn(`[postbuild-copy-seo-assets] Kaynak bulunamadi: public/${fileName}`);
    continue;
  }

  fs.copyFileSync(source, destination);
  console.log(`[postbuild-copy-seo-assets] public/${fileName} -> dist/${fileName}`);
}

walkStampHtml(distDir);
