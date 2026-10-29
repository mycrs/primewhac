/**
 * Vite build sırasında @prerenderer/rollup-plugin ile statik HTML üretilecek rotalar.
 */
import { prerenderRoutes as basePrerenderRoutes } from './prerenderSeo.js';

/**
 * Yeni DE rehber sayfaları.
 * Not: Bu rotaların meta girişleri (title/description) entegrasyon aşamasında
 * prerenderSeo.js içindeki STATIC_SEO haritasına merkezi olarak eklenecek.
 * Girişler eklendikten sonra basePrerenderRoutes bu rotaları zaten içereceği
 * için aşağıdaki filtre çift kayıt oluşmasını engeller.
 */
const EXTRA_PRERENDER_ROUTES = [
  '/de/tuerkische-sender-in-deutschland',
  '/almanyada-turk-kanallari',
  '/iletisim',
];

export const prerenderRoutes = [
  ...basePrerenderRoutes,
  ...EXTRA_PRERENDER_ROUTES.filter((route) => !basePrerenderRoutes.includes(route)),
];
