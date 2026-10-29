import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { createLogger, defineConfig } from 'vite';

const __viteDir = path.dirname(fileURLToPath(import.meta.url));

function generateSitemapBeforeBuildPlugin() {
	return {
		name: 'generate-sitemap-before-build',
		apply: 'build',
		buildStart() {
			execSync('node scripts/generate-sitemap.js', {
				stdio: 'inherit',
				cwd: __viteDir,
			});
		},
	};
}

/** VITE_TEST_MODE=true iken dist/robots.txt → Disallow: /; aksi halde public/robots.txt */
function robotsTxtByTestModePlugin() {
	const testMode = String(process.env.VITE_TEST_MODE || '').toLowerCase() === 'true';
	const disallowAll = `User-agent: *
Disallow: /
`;
	return {
		name: 'robots-txt-by-test-mode',
		apply: 'build',
		closeBundle() {
			const distRobots = path.join(__viteDir, 'dist', 'robots.txt');
			const srcRobots = path.join(__viteDir, 'public', 'robots.txt');
			const body = testMode ? disallowAll : fs.readFileSync(srcRobots, 'utf8');
			fs.writeFileSync(distRobots, body, 'utf8');
		},
	};
}
import prerender from '@prerenderer/rollup-plugin';
import { buildSeoExtras, prerenderRoutes, prerenderSeoByRoute } from './src/prerenderSeo.js';
import { getPrerenderJsonLdSchemas, renderJsonLdScriptsHtml } from './src/prerenderSchema.js';
import inlineEditPlugin from './plugins/visual-editor/vite-plugin-react-inline-editor.js';
import editModeDevPlugin from './plugins/visual-editor/vite-plugin-edit-mode.js';
import iframeRouteRestorationPlugin from './plugins/vite-plugin-iframe-route-restoration.js';
import selectionModePlugin from './plugins/selection-mode/vite-plugin-selection-mode.js';
import { getSiteGeoForLang } from './src/constants/siteGeo.js';

const isDev = process.env.NODE_ENV !== 'production';
const SITE_URL = process.env.VITE_SITE_URL || 'https://cineverse.pro';

function absoluteUrl(pathname) {
	return `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function normalizeRobotsContent(value) {
	const robots = String(value || 'index, follow').trim();
	if (/\bnoindex\b/i.test(robots)) return robots;
	const directives = robots.split(',').map((item) => item.trim()).filter(Boolean);
	[
		'index',
		'follow',
		'max-image-preview:large',
		'max-snippet:-1',
		'max-video-preview:-1',
	].forEach((directive) => {
		if (!directives.some((item) => item.toLowerCase() === directive)) directives.push(directive);
	});
	return directives.join(', ');
}

function extractRenderedMetaContent(html, attribute, value) {
	const tag = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${value}["'])[^>]*>`, 'i'))?.[0];
	return tag?.match(/\bcontent=["']([^"']+)["']/i)?.[1] || '';
}

function stripManagedSeoHead(html) {
	return html
		.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, '')
		.replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|author|geo\.region|geo\.placename|content-language|og:type|og:title|og:description|og:url|og:site_name|og:image|og:image:secure_url|og:image:alt|og:image:width|og:image:height|og:locale|og:locale:alternate|twitter:card|twitter:title|twitter:description|twitter:image|twitter:image:alt|twitter:site)["'][^>]*>\s*/gi, '')
		.replace(/<meta\b[^>]*http-equiv=["']content-language["'][^>]*>\s*/gi, '')
		.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, '')
		.replace(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'](?:tr|de(?:-[A-Za-z]{2})?|x-default)["'][^>]*>\s*/gi, '');
}

function stripJsonLdScripts(html) {
	return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function injectPrerenderJsonLd(html, route) {
	const block = renderJsonLdScriptsHtml(getPrerenderJsonLdSchemas(route));
	if (!block) return html;
	return html.replace(/<\/head>/i, `${block}\n  </head>`);
}

function injectPrerenderSeoHead(html, route) {
	const seo = prerenderSeoByRoute[route];
	if (!seo) return html;

	const canonicalUrl = absoluteUrl(seo.canonicalPath);
	const description = escapeHtml(seo.description);
	const title = escapeHtml(seo.title);
	const renderedOgImage = extractRenderedMetaContent(html, 'property', 'og:image');
	const renderedOgType = extractRenderedMetaContent(html, 'property', 'og:type');
	const ogImage = renderedOgImage || `${SITE_URL}/default-og-image.jpg`;
	const ogType = renderedOgType || 'website';
	// Çevrilmemiş /de/blog yazıları noHreflang: tr/de/x-default alternate basılmaz.
	const hreflangLinks = seo.noHreflang
		? ''
		: `
    <link data-prerender-head="true" rel="alternate" hreflang="tr" href="${absoluteUrl(seo.hreflangTr)}">
    ${seo.hreflangDe ? `<link data-prerender-head="true" rel="alternate" hreflang="de" href="${absoluteUrl(seo.hreflangDe)}">` : ''}
    ${seo.hreflangXDefault ? `<link data-prerender-head="true" rel="alternate" hreflang="x-default" href="${absoluteUrl(seo.hreflangXDefault)}">` : ''}`;
	const tags = `
    <title data-prerender-head="true">${title}</title>
    <meta data-prerender-head="true" name="description" content="${description}">
    <meta data-prerender-head="true" name="robots" content="${escapeHtml(normalizeRobotsContent(seo.robots))}">
    <meta data-prerender-head="true" name="author" content="QruzeTV">
    <link data-prerender-head="true" rel="canonical" href="${canonicalUrl}">${hreflangLinks}
    <meta data-prerender-head="true" property="og:type" content="${escapeHtml(ogType)}">
    <meta data-prerender-head="true" property="og:title" content="${title}">
    <meta data-prerender-head="true" property="og:description" content="${description}">
    <meta data-prerender-head="true" property="og:url" content="${canonicalUrl}">
    <meta data-prerender-head="true" property="og:site_name" content="QruzeTV">
    <meta data-prerender-head="true" property="og:image" content="${escapeHtml(ogImage)}">
    <meta data-prerender-head="true" property="og:image:secure_url" content="${escapeHtml(ogImage)}">
    <meta data-prerender-head="true" property="og:image:alt" content="${title}">
    <meta data-prerender-head="true" property="og:image:width" content="1200">
    <meta data-prerender-head="true" property="og:image:height" content="630">
    <meta data-prerender-head="true" property="og:locale" content="${seo.locale}">
    <meta data-prerender-head="true" property="og:locale:alternate" content="${seo.alternateLocale}">
    <meta data-prerender-head="true" name="twitter:card" content="summary_large_image">
    <meta data-prerender-head="true" name="twitter:title" content="${title}">
    <meta data-prerender-head="true" name="twitter:description" content="${description}">
    <meta data-prerender-head="true" name="twitter:image" content="${escapeHtml(ogImage)}">
    <meta data-prerender-head="true" name="twitter:image:alt" content="${title}">`;

	const stripped = stripManagedSeoHead(html);
	const pageHtmlLang = getSiteGeoForLang(seo.lang).htmlLang;
	return stripped
		.replace(/<html\b[^>]*>/i, `<html lang="${pageHtmlLang}">`)
		.replace(/(<meta\s+name=["']theme-color["'][^>]*>\s*)/i, `$1${tags}\n`);
}

function sanitizePrerenderArticleHtml(value) {
	let html = String(value || '');
	const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
	if (body?.[1]) html = body[1];
	return html
		.replace(/<!doctype[^>]*>/gi, '')
		.replace(/<head\b[\s\S]*?<\/head>/gi, '')
		.replace(/<\/?(?:html|body)\b[^>]*>/gi, '')
		.replace(/<script\b[\s\S]*?<\/script>/gi, '')
		.replace(/\son\w+\s*=\s*(["'])[\s\S]*?\1/gi, '')
		.replace(/\s(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '')
		.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
		.replace(/<\/h1>/gi, '</h2>')
		.replace(/QruzeHD|KaliteliIPTV|PrimeWatch TV/gi, 'QruzeTV');
}

function getPrerenderBlogFallback(route) {
	const match = route.match(/^\/(de\/)?blog\/([^/]+)$/);
	if (!match) return '';
	const post = (buildSeoExtras.blogPosts || []).find((item) => item?.slug === match[2]);
	if (!post) return '';
	const raw = match[1] ? post.content_de : post.content;
	return sanitizePrerenderArticleHtml(raw);
}

function ensurePrerenderBodyContent(html, route) {
	const seo = prerenderSeoByRoute[route];
	if (!seo || /\bnoindex\b/i.test(String(seo.robots || ''))) return html;
	const bodyHtml = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
	if (/<h1\b/i.test(bodyHtml)) return html;

	const article = getPrerenderBlogFallback(route);
	const isDe = seo.lang === 'de';
	const resources = isDe
		? `<p><a href="/de/test/">Kostenlos testen</a> · <a href="/de/einrichtung/">Einrichtung</a> · <a href="/de/sss/">FAQ</a></p>`
		: `<p><a href="/test/">Ücretsiz test</a> · <a href="/kurulum/">Kurulum rehberleri</a> · <a href="/sss/">Sık sorulan sorular</a></p>`;
	const fallback = `<main data-prerender-fallback="true" lang="${seo.lang}" style="max-width:960px;margin:96px auto 48px;padding:24px;color:#f8fafc;background:#0a0a0a">
      <h1 style="font-size:clamp(2rem,5vw,4rem);line-height:1.1;margin:0 0 1rem">${escapeHtml(seo.title)}</h1>
      <p style="font-size:1.125rem;line-height:1.7;color:#cbd5e1">${escapeHtml(seo.description)}</p>
      ${article ? `<article>${article}</article>` : resources}
    </main>`;
	return html.replace(/(<div\b[^>]*\bid=["']root["'][^>]*>)/i, `$1${fallback}`);
}

const configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) {
			if (
				addedNode.nodeType === Node.ELEMENT_NODE &&
				(
					addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
					addedNode.classList?.contains('backdrop')
				)
			) {
				handleViteOverlay(addedNode);
			}
		}
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

function handleViteOverlay(node) {
	if (!node.shadowRoot) {
		return;
	}

	const backdrop = node.shadowRoot.querySelector('.backdrop');

	if (backdrop) {
		const overlayHtml = backdrop.outerHTML;
		const parser = new DOMParser();
		const doc = parser.parseFromString(overlayHtml, 'text/html');
		const messageBodyElement = doc.querySelector('.message-body');
		const fileElement = doc.querySelector('.file');
		const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
		const fileText = fileElement ? fileElement.textContent.trim() : '';
		const error = messageText + (fileText ? ' File:' + fileText : '');

		window.parent.postMessage({
			type: 'horizons-vite-error',
			error,
		}, '*');
	}
}
`;

const configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
	const errorDetails = errorObj ? JSON.stringify({
		name: errorObj.name,
		message: errorObj.message,
		stack: errorObj.stack,
		source,
		lineno,
		colno,
	}) : null;

	window.parent.postMessage({
		type: 'horizons-runtime-error',
		message,
		error: errorDetails
	}, '*');
};
`;

const configHorizonsConsoleErrroHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
	originalConsoleError.apply(console, args);

	let errorString = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg instanceof Error) {
			errorString = arg.stack || \`\${arg.name}: \${arg.message}\`;
			break;
		}
	}

	if (!errorString) {
		errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
	}

	window.parent.postMessage({
		type: 'horizons-console-error',
		error: errorString
	}, '*');
};
`;

const configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = function(...args) {
	const url = args[0] instanceof Request ? args[0].url : args[0];

	// Skip WebSocket URLs
	if (url.startsWith('ws:') || url.startsWith('wss:')) {
		return originalFetch.apply(this, args);
	}

	return originalFetch.apply(this, args)
		.then(async response => {
			const contentType = response.headers.get('Content-Type') || '';

			// Exclude HTML document responses
			const isDocumentResponse =
				contentType.includes('text/html') ||
				contentType.includes('application/xhtml+xml');

			if (!response.ok && !isDocumentResponse) {
					const responseClone = response.clone();
					const errorFromRes = await responseClone.text();
					const requestUrl = response.url;
					console.error(\`Fetch error from \${requestUrl}: \${errorFromRes}\`);
			}

			return response;
		})
		.catch(error => {
			if (!url.match(/\.html?$/i)) {
				console.error(error);
			}

			throw error;
		});
};
`;

const configNavigationHandler = `
if (window.navigation && window.self !== window.top) {
	window.navigation.addEventListener('navigate', (event) => {
		const url = event.destination.url;

		try {
			const destinationUrl = new URL(url);
			const destinationOrigin = destinationUrl.origin;
			const currentOrigin = window.location.origin;

			if (destinationOrigin === currentOrigin) {
				return;
			}
		} catch (error) {
			return;
		}

		window.parent.postMessage({
			type: 'horizons-navigation-error',
			url,
		}, '*');
	});
}
`;

const addTransformIndexHtml = {
	name: 'add-transform-index-html',
	transformIndexHtml(html) {
		const tags = [];

		// Horizons dev/editor handler'lari yalnizca dev modunda enjekte edilir;
		// prod HTML'ine basilamaz (gereksiz inline script + window.onerror/fetch patch'i).
		if (isDev) {
			tags.push(
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsRuntimeErrorHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configHorizonsViteErrorHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: {type: 'module'},
					children: configHorizonsConsoleErrroHandler,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configWindowFetchMonkeyPatch,
					injectTo: 'head',
				},
				{
					tag: 'script',
					attrs: { type: 'module' },
					children: configNavigationHandler,
					injectTo: 'head',
				},
			);
		}

		if (!isDev && process.env.TEMPLATE_BANNER_SCRIPT_URL && process.env.TEMPLATE_REDIRECT_URL) {
			tags.push(
				{
					tag: 'script',
					attrs: {
						src: process.env.TEMPLATE_BANNER_SCRIPT_URL,
						'template-redirect-url': process.env.TEMPLATE_REDIRECT_URL,
					},
					injectTo: 'head',
				}
			);
		}

		return {
			html,
			tags,
		};
	},
};

console.warn = () => {};

const logger = createLogger()
const loggerError = logger.error

logger.error = (msg, options) => {
	if (options?.error?.toString().includes('CssSyntaxError: [postcss]')) {
		return;
	}

	loggerError(msg, options);
}

export default defineConfig({
	envDir: __viteDir,
	customLogger: logger,
	plugins: [
		...(isDev ? [inlineEditPlugin(), editModeDevPlugin(), iframeRouteRestorationPlugin(), selectionModePlugin()] : []),
		...(!isDev ? [generateSitemapBeforeBuildPlugin(), robotsTxtByTestModePlugin()] : []),
		react(),
		addTransformIndexHtml,
		...(!isDev
			? [
					prerender({
						routes: prerenderRoutes,
						renderer: '@prerenderer/renderer-puppeteer',
						rendererOptions: {
							// Supabase destekli sayfaların yükleme kabuğu yerine gerçek içeriğini yakala.
							renderAfterTime: 12000,
							timeout: 120000,
						},
						postProcess(renderedRoute) {
							let html = stripJsonLdScripts(renderedRoute.html);
							html = injectPrerenderSeoHead(html, renderedRoute.route);
							html = injectPrerenderJsonLd(html, renderedRoute.route);
							html = ensurePrerenderBodyContent(html, renderedRoute.route);
							renderedRoute.html = html;
							return renderedRoute;
						},
					}),
				]
			: []),
	],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		allowedHosts: true,
		proxy: {
			'/api/fixtures': {
				target: 'https://fixturedownload.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/fixtures/, '/feed/json'),
			},
			/** Yerel Express API — sabit 3001 (npm run dev:api / dev:all) */
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
			},
		},
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json', ],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			external: [
				'@babel/parser',
				'@babel/traverse',
				'@babel/generator',
				'@babel/types'
			],
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
					'vendor-motion': ['framer-motion'],
					'vendor-supabase': ['@supabase/supabase-js'],
					'vendor-carousel': ['embla-carousel-react', 'embla-carousel-autoplay'],
				}
			}
		}
	}
});
