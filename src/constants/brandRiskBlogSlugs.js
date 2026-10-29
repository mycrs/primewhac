/**
 * Telif/marka riski nedeniyle yayından kaldırılan blog yazıları (2026-08-13).
 *
 * Bu yazılar belirli maç/lig yayınının hizmetimizde bulunduğunu ima ediyordu.
 * Asıl temizlik Supabase tarafında yapılır (bkz. supabase/brand_cleanup_2026-08-13.sql,
 * `published_at = NULL`). Buradaki liste ikinci bir emniyet katmanıdır: veritabanı
 * henüz temizlenmemişse bile bu slug'lar sitemap'e ve prerender kuyruğuna girmez.
 *
 * Yeni riskli içerik tespit edilirse önce buraya eklenmeli, sonra DB'de yayından
 * kaldırılmalıdır.
 */
export const BRAND_RISK_BLOG_SLUGS = new Set([
  'galatasaray-liverpool-maci',
  'galatasaray-liverpool-maci-nereden-izlenir-sampiyonlar-ligi-son-16-eslesmeleri-ve-yayin-rehberi',
  'galatasaray-trabzonspor-galatasaray-maci-4-nisan-2026-canli-izle',
  'galatasaray-fenerbahce-derbisi-ne-zaman-saat-kacta-kapsamli-analiz-ve-donmadan-izleme-rehberi',
  'besiktas-galatasaray-derbisi-nereden-izlenir-7-mart-2026-canli-izle',
  'juventus-galatasaray-mac-ozeti-goller-ve-onemli-anlar',
  'galatasaray-tarihe-kosuyor',
  'derbiyi-donmadan-izle',
  'sampiyonlar-ligi-son-16',
  'sampiyonlar-ligi-ceyrek-final-2026-maclari-nereden-izlenir',
  '2026-dunya-kupasi-maclari-nereden-izlenir',
]);

/** Sitemap/prerender filtreleri için yardımcı. */
export const isBrandRiskBlogSlug = (slug) => BRAND_RISK_BLOG_SLUGS.has(String(slug || ''));
