-- =====================================================================
-- TELİF TEMİZLİĞİ — 2. TUR  (part2)
-- =====================================================================
-- 1. tur (brand_cleanup_2026-08-13.sql) çalıştırıldıktan SONRA uygulanır.
--
-- NEDEN: 1. turda "yayında kalabilir, sadece marka geçişleri temizlensin"
-- diye işaretlenen yazıların gövdesi incelendiğinde, geçişlerin basit
-- anımsatma değil DOĞRUDAN TAŞIMA İDDİASI olduğu görüldü:
--     "beIN Sports, S Sport, Tivibu Spor gibi kanalların TAMAMI DAHİL"
--     "Şampiyonlar Ligi dahil TÜM SPOR YAYINLARI"
--     "TRT 1'den beIN Sports'a ... her şey sizi bekliyor"
-- Bunlar düzeltilmeden yayında kalmamalı.
--
-- Ayrıca: bu yazılarda eski marka adları (PrimeWatch, QruzeHD) ve bir
-- yazıda doldurulmamış schema placeholder'ı (SENIN-DOMAININ.com) var.
--
-- Yine hiçbir satır SİLİNMEZ.
-- =====================================================================


-- =====================================================================
-- BÖLÜM 0 — ÖNİZLEME
-- =====================================================================

SELECT slug, title, published_at,
       (content ILIKE '%bein%')            AS bein_var,
       (content ILIKE '%şampiyonlar lig%') AS sampiyonlar_var,
       (content ILIKE '%primewatch%')      AS primewatch_var,
       (content ILIKE '%qruzehd%')         AS qruzehd_var,
       (content ILIKE '%SENIN-DOMAININ%')  AS placeholder_var
FROM blog_posts
WHERE slug IN (
        'iptv-satin-ai',
        'avrupadan-turk-kanallari-nasil-izlenir',
        '2026-vizyon-filmleri-diziler',
        'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey'
      );


-- =====================================================================
-- BÖLÜM 1 — YEDEK
-- =====================================================================

CREATE TABLE IF NOT EXISTS blog_posts_backup_20260813_p2 AS
SELECT * FROM blog_posts
WHERE slug IN (
        'iptv-satin-ai',
        'avrupadan-turk-kanallari-nasil-izlenir',
        '2026-vizyon-filmleri-diziler',
        'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey'
      );


-- =====================================================================
-- BÖLÜM 2 — TAŞIMA İDDİASI İÇEREN 3 YAZIYI TASLAĞA AL
-- =====================================================================
-- Gövde elden geçirilip iddialar kaldırılana kadar yayında kalmamalı.
-- Düzeltme sonrası published_at'i geri vererek tekrar yayınlayabilirsiniz.

UPDATE blog_posts
SET published_at = NULL
WHERE slug IN (
        'iptv-satin-ai',                          -- "kanalların tamamı dahil"
        'avrupadan-turk-kanallari-nasil-izlenir', -- "TRT 1'den beIN Sports'a her şey sizi bekliyor"
        '2026-vizyon-filmleri-diziler'            -- "Şampiyonlar Ligi dahil tüm spor yayınları"
      );


-- =====================================================================
-- BÖLÜM 3 — KALAN YAZILARDA METİN DÜZELTMELERİ
-- =====================================================================

-- 3.1  Doldurulmamış schema placeholder'ı -> gerçek domain
--      (derbi-gunu yazısının JSON-LD'sinde 6 adet SENIN-DOMAININ.com var;
--       Search Console'da geçersiz URL hatası üretir.)
UPDATE blog_posts
SET content = replace(content, 'https://SENIN-DOMAININ.com', 'https://satinaliptv.sbs')
WHERE content ILIKE '%SENIN-DOMAININ%';

-- 3.2  Eski marka adları -> güncel marka
UPDATE blog_posts
SET content         = replace(replace(content,         'PrimeWatch', 'QruzeTV'), 'QruzeHD', 'QruzeTV'),
    excerpt         = replace(replace(excerpt,         'PrimeWatch', 'QruzeTV'), 'QruzeHD', 'QruzeTV'),
    title           = replace(replace(title,           'PrimeWatch', 'QruzeTV'), 'QruzeHD', 'QruzeTV'),
    seo_title       = replace(replace(seo_title,       'PrimeWatch', 'QruzeTV'), 'QruzeHD', 'QruzeTV'),
    seo_description = replace(replace(seo_description, 'PrimeWatch', 'QruzeTV'), 'QruzeHD', 'QruzeTV')
WHERE content ILIKE '%primewatch%' OR content ILIKE '%qruzehd%'
   OR title   ILIKE '%primewatch%' OR title   ILIKE '%qruzehd%';


-- =====================================================================
-- BÖLÜM 4 — DOĞRULAMA (hepsi 0 dönmeli)
-- =====================================================================

SELECT 'yayinda marka iddiasi' AS kontrol, count(*) AS adet
FROM blog_posts
WHERE published_at IS NOT NULL
  AND (content ILIKE '%bein%' OR content ILIKE '%digiturk%'
    OR content ILIKE '%s sport%' OR content ILIKE '%tivibu%'
    OR content ILIKE '%şampiyonlar lig%' OR content ILIKE '%süper lig%')
UNION ALL
SELECT 'placeholder domain', count(*)
FROM blog_posts WHERE content ILIKE '%SENIN-DOMAININ%'
UNION ALL
SELECT 'eski marka adi', count(*)
FROM blog_posts WHERE content ILIKE '%primewatch%' OR content ILIKE '%qruzehd%'
UNION ALL
SELECT 'eski domain', count(*)
FROM blog_posts WHERE content ILIKE '%iptvsatinal.sbs%';


-- =====================================================================
-- GERİ ALMA
-- =====================================================================
-- UPDATE blog_posts p
--   SET published_at = b.published_at, content = b.content, title = b.title,
--       excerpt = b.excerpt, seo_title = b.seo_title, seo_description = b.seo_description
--   FROM blog_posts_backup_20260813_p2 b WHERE p.id = b.id;
