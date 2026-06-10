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
import { prerenderRoutes, prerenderSeoByRoute } from './src/prerenderSeo.js';
import { getPrerenderJsonLdSchemas, renderJsonLdScriptsHtml } from './src/prerenderSchema.js';
import inlineEditPlugin from './plugins/visual-editor/vite-plugin-react-inline-editor.js';
import editModeDevPlugin from './plugins/visual-editor/vite-plugin-edit-mode.js';
import iframeRouteRestorationPlugin from './plugins/vite-plugin-iframe-route-restoration.js';
import selectionModePlugin from './plugins/selection-mode/vite-plugin-selection-mode.js';
import { geoHeadMetaHtml } from './src/constants/siteGeo.js';

const isDev = process.env.NODE_ENV !== 'production';
const SITE_URL = process.env.VITE_SITE_URL || 'https://streamtr.eu';

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

function stripManagedSeoHead(html) {
	return html
		.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, '')
		.replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|author|geo\.region|geo\.placename|content-language|og:type|og:title|og:description|og:url|og:site_name|og:image|og:image:width|og:image:height|og:locale|og:locale:alternate|twitter:card|twitter:title|twitter:description|twitter:image)["'][^>]*>\s*/gi, '')
		.replace(/<meta\b[^>]*http-equiv=["']content-language["'][^>]*>\s*/gi, '')
		.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, '')
		.replace(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'](?:tr|de|x-default)["'][^>]*>\s*/gi, '');
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
	const geoTags = geoHeadMetaHtml(seo.lang);
	const tags = `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="QruzeTV">
    ${geoTags}
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="alternate" hreflang="tr" href="${absoluteUrl(seo.hreflangTr)}">
    ${seo.hreflangDe ? `<link rel="alternate" hreflang="de" href="${absoluteUrl(seo.hreflangDe)}">` : ''}
    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(seo.xDefault)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="QruzeTV">
    <meta property="og:image" content="${SITE_URL}/default-og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="${seo.locale}">
    <meta property="og:locale:alternate" content="${seo.alternateLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${SITE_URL}/default-og-image.jpg">`;

	const stripped = stripManagedSeoHead(html);
	return stripped
		.replace(/<html\b[^>]*>/i, `<html lang="${seo.lang}">`)
		.replace(/(<meta\s+name=["']theme-color["'][^>]*>\s*)/i, `$1${tags}\n`);
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
		const tags = [
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
		];

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
							renderAfterTime: 4000,
							timeout: 120000,
						},
						postProcess(renderedRoute) {
							let html = stripJsonLdScripts(renderedRoute.html);
							html = injectPrerenderSeoHead(html, renderedRoute.route);
							html = injectPrerenderJsonLd(html, renderedRoute.route);
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
			]
		}
	}
});
