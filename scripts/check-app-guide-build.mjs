import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { APP_GUIDES, APP_GUIDES_BASE, getAppGuideTitle } from '../src/data/appInstallationGuides.js';
import { getCanonicalAndHreflang } from '../src/utils/seoCanonicalHreflang.js';

const base = process.env.VITE_SITE_URL || 'https://cineverse.pro';
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const routes = [{ slug: '', title: 'IPTV Uygulama Kurulum Rehberleri | QruzeTV' }, ...APP_GUIDES.map((guide) => ({ ...guide, title: getAppGuideTitle(guide) }))];

for (const guide of routes) {
  const route = `${APP_GUIDES_BASE}${guide.slug ? `/${guide.slug}` : ''}/`;
  const html = fs.readFileSync(path.join('dist', route, 'index.html'), 'utf8');
  assert.ok(html.includes(`<title data-prerender-head="true">${guide.title}</title>`), `Missing title: ${route}`);
  assert.ok(html.includes(`rel="canonical" href="${base}${route}"`), `Missing canonical: ${route}`);
  assert.ok(sitemap.includes(`<loc>${base}${route}</loc>`), `Missing sitemap URL: ${route}`);
  assert.equal(getCanonicalAndHreflang(route, base).hreflangDe, null, `Unexpected German alternate: ${route}`);
  assert.ok(!html.includes('data-prerender-fallback="true"'), `Fallback instead of rendered guide: ${route}`);
  if (guide.slug) {
    assert.ok(html.includes('id="adimlar"') && html.includes('id="sss"'), `Missing guide body: ${route}`);
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const howTo = schemas.find((item) => item['@type'] === 'HowTo');
    const faq = schemas.find((item) => item['@type'] === 'FAQPage');
    assert.equal(howTo?.step?.length, guide.steps.length, `Missing HowTo steps: ${route}`);
    assert.equal(faq?.mainEntity?.length, guide.faqs.length, `Missing FAQs: ${route}`);
  }
}
console.log(`${routes.length} uygulama rehberi adresi, prerender, SEO ve site haritası doğrulandı.`);
