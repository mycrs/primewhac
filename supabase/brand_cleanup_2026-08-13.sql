-- =====================================================================
-- TELİF / MARKA TEMİZLİĞİ + DOMAIN GEÇİŞİ  —  2026-08-13
-- =====================================================================
-- Bu script Supabase veritabanındaki (koddan yönetilemeyen) içeriği temizler:
--   1) Markalı TV kanalları ve lisanssız üçüncü taraf logoları
--   2) Belirli maç/lig yayınını ima eden blog yazıları
--   3) Eski domain (iptvsatinal.sbs) -> yeni domain (satinaliptv.sbs)
--
-- ÖNEMLİ — ÇALIŞTIRMADAN ÖNCE OKUYUN:
--   * ÖNCE "BÖLÜM 0" önizleme sorgularını çalıştırın; neyin etkileneceğini görün.
--   * Script HİÇBİR SATIRI SİLMEZ. Kanallar is_active=false yapılır,
--     blog yazıları published_at=NULL (taslak) yapılır. Her ikisi de geri alınabilir.
--   * BÖLÜM 1 yedek tablolar oluşturur; geri dönüş bunlardan yapılır.
--   * Adımları tek tek, sırayla çalıştırın. Toplu çalıştırmayın.
-- =====================================================================


-- =====================================================================
-- BÖLÜM 0 — ÖNİZLEME (hiçbir şeyi değiştirmez, önce bunu çalıştırın)
-- =====================================================================

-- 0.1  Markalı olabilecek kanallar
SELECT id, name, category, is_active,
       (logo_url IS NOT NULL)               AS has_logo,
       (background_image_url IS NOT NULL)   AS has_bg
FROM channels
WHERE name ILIKE ANY (ARRAY[
        '%bein%', '%digiturk%', '%s sport%', '%s-sport%', '%d-smart%', '%dsmart%',
        '%netflix%', '%exxen%', '%blutv%', '%disney%', '%hbo%', '%amazon prime%',
        '%tabii%', '%gain%', '%todtv%', '%tivibu%', '%sky sport%', '%dazn%',
        '%eurosport%', '%discovery%', '%tnt spor%'
      ])
ORDER BY name;

-- 0.2  Logosu üçüncü taraf kaynaktan çekilen kanallar (wikipedia vb.)
SELECT id, name, logo_url
FROM channels
WHERE logo_url ILIKE '%wikimedia.org%'
   OR logo_url ILIKE '%wikipedia.org%'
   OR logo_url ILIKE '%logos-world%'
   OR logo_url ILIKE '%seeklogo%'
   OR logo_url ILIKE '%brandsoftheworld%';

-- 0.3  Riskli blog yazıları
SELECT id, slug, title, published_at
FROM blog_posts
WHERE slug IN (
        'galatasaray-liverpool-maci',
        'galatasaray-trabzonspor-galatasaray-maci-4-nisan-2026-canli-izle',
        'galatasaray-fenerbahce-derbisi-ne-zaman-saat-kacta-kapsamli-analiz-ve-donmadan-izleme-rehberi',
        'derbiyi-donmadan-izle',
        'galatasaray-liverpool-maci-nereden-izlenir-sampiyonlar-ligi-son-16-eslesmeleri-ve-yayin-rehberi',
        'besiktas-galatasaray-derbisi-nereden-izlenir-7-mart-2026-canli-izle',
        'sampiyonlar-ligi-son-16',
        'galatasaray-tarihe-kosuyor',
        'sampiyonlar-ligi-ceyrek-final-2026-maclari-nereden-izlenir',
        'juventus-galatasaray-mac-ozeti-goller-ve-onemli-anlar',
        '2026-dunya-kupasi-maclari-nereden-izlenir'
      )
ORDER BY slug;

-- 0.4  Eski domain hâlâ geçen kayıtlar
SELECT 'blog_posts' AS tablo, count(*) AS adet FROM blog_posts
WHERE content ILIKE '%iptvsatinal.sbs%' OR excerpt ILIKE '%iptvsatinal.sbs%'
   OR seo_description ILIKE '%iptvsatinal.sbs%' OR seo_title ILIKE '%iptvsatinal.sbs%';


-- =====================================================================
-- BÖLÜM 1 — YEDEK (geri dönüş için ZORUNLU)
-- =====================================================================

CREATE TABLE IF NOT EXISTS channels_backup_20260813    AS SELECT * FROM channels;
CREATE TABLE IF NOT EXISTS blog_posts_backup_20260813  AS SELECT * FROM blog_posts;

-- Doğrulama: yedekler dolu mu?
SELECT (SELECT count(*) FROM channels_backup_20260813)   AS kanal_yedek,
       (SELECT count(*) FROM blog_posts_backup_20260813) AS blog_yedek;


-- =====================================================================
-- BÖLÜM 2 — KANALLAR: markalı kanalları pasifleştir, logoları kaldır
-- =====================================================================

-- 2.1  Markalı kanalları yayından kaldır (satır silinmez)
UPDATE channels
SET is_active = false
WHERE name ILIKE ANY (ARRAY[
        '%bein%', '%digiturk%', '%s sport%', '%s-sport%', '%d-smart%', '%dsmart%',
        '%netflix%', '%exxen%', '%blutv%', '%disney%', '%hbo%', '%amazon prime%',
        '%tabii%', '%gain%', '%todtv%', '%tivibu%', '%sky sport%', '%dazn%',
        '%eurosport%', '%discovery%', '%tnt spor%'
      ]);

-- 2.2  Lisansı olmayan üçüncü taraf logolarını TÜM kanallardan kaldır.
--      Kart bileşenleri (ColorfulChannelCard / DynamicChannelCard) logo yoksa
--      isim/baş harf görünümüne düşer — tasarım bozulmaz.
UPDATE channels
SET logo_url = NULL
WHERE logo_url IS NOT NULL
  AND (logo_url ILIKE '%wikimedia.org%'
    OR logo_url ILIKE '%wikipedia.org%'
    OR logo_url ILIKE '%logos-world%'
    OR logo_url ILIKE '%seeklogo%'
    OR logo_url ILIKE '%brandsoftheworld%');

-- 2.3  Kanal açıklamalarındaki marka/lig ifadelerini temizleyin (manuel inceleme).
SELECT id, name, description, description_de
FROM channels
WHERE description    ILIKE ANY (ARRAY['%bein%','%süper lig%','%digiturk%','%premier lig%','%la liga%'])
   OR description_de ILIKE ANY (ARRAY['%bein%','%süper lig%','%digiturk%','%premier league%','%la liga%']);


-- =====================================================================
-- BÖLÜM 3 — BLOG: belirli maç/lig yayını vaat eden yazıları taslağa al
-- =====================================================================
-- published_at = NULL  ->  yazı yayından kalkar, veri korunur.
-- Bu 11 yazının KONUSU riskin kendisidir (belirli maçın nereden izleneceği);
-- düzenleyerek kurtarmak mümkün değil, bu yüzden tamamen yayından kaldırılır.

UPDATE blog_posts
SET published_at = NULL
WHERE slug IN (
        'galatasaray-liverpool-maci',
        'galatasaray-trabzonspor-galatasaray-maci-4-nisan-2026-canli-izle',
        'galatasaray-fenerbahce-derbisi-ne-zaman-saat-kacta-kapsamli-analiz-ve-donmadan-izleme-rehberi',
        'derbiyi-donmadan-izle',
        'galatasaray-liverpool-maci-nereden-izlenir-sampiyonlar-ligi-son-16-eslesmeleri-ve-yayin-rehberi',
        'besiktas-galatasaray-derbisi-nereden-izlenir-7-mart-2026-canli-izle',
        'sampiyonlar-ligi-son-16',
        'galatasaray-tarihe-kosuyor',
        'sampiyonlar-ligi-ceyrek-final-2026-maclari-nereden-izlenir',
        'juventus-galatasaray-mac-ozeti-goller-ve-onemli-anlar',
        '2026-dunya-kupasi-maclari-nereden-izlenir'
      );

-- 3.1  ELDEN GEÇİRİLECEK (yayında kalabilir, sadece marka geçişleri temizlenmeli).
--      Konu güvenli; içeride tek tük "beIN" / "Şampiyonlar Ligi" geçiyor.
--      Admin panelinden düzenleyip jenerik ifadeyle değiştirin.
SELECT id, slug, title
FROM blog_posts
WHERE slug IN (
        'iptv-satin-ai',                                        -- 1x beIN
        'avrupadan-turk-kanallari-nasil-izlenir',               -- 1x beIN
        '2026-vizyon-filmleri-diziler',                         -- 1x Şampiyonlar Ligi
        'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey' -- başlık "derbi günü"
      );

-- 3.2  Kalan tüm blog içeriğinde marka taraması (temizlik sonrası boş dönmeli)
SELECT id, slug, title
FROM blog_posts
WHERE published_at IS NOT NULL
  AND (content ILIKE '%bein%' OR content ILIKE '%digiturk%'
    OR content ILIKE '%süper lig%' OR content ILIKE '%premier lig%'
    OR content ILIKE '%la liga%'   OR content ILIKE '%şampiyonlar lig%');


-- =====================================================================
-- BÖLÜM 4 — DOMAIN GEÇİŞİ: iptvsatinal.sbs -> satinaliptv.sbs
-- =====================================================================

UPDATE blog_posts
SET content         = replace(content,         'iptvsatinal.sbs', 'satinaliptv.sbs'),
    excerpt         = replace(excerpt,         'iptvsatinal.sbs', 'satinaliptv.sbs'),
    seo_title       = replace(seo_title,       'iptvsatinal.sbs', 'satinaliptv.sbs'),
    seo_description = replace(seo_description, 'iptvsatinal.sbs', 'satinaliptv.sbs')
WHERE content         ILIKE '%iptvsatinal.sbs%'
   OR excerpt         ILIKE '%iptvsatinal.sbs%'
   OR seo_title       ILIKE '%iptvsatinal.sbs%'
   OR seo_description ILIKE '%iptvsatinal.sbs%';


-- =====================================================================
-- BÖLÜM 5 — SON DOĞRULAMA (hepsi 0 dönmeli)
-- =====================================================================

SELECT 'aktif markalı kanal' AS kontrol, count(*) AS adet
FROM channels
WHERE is_active = true
  AND name ILIKE ANY (ARRAY['%bein%','%digiturk%','%netflix%','%exxen%','%blutv%','%s sport%'])
UNION ALL
SELECT 'ucuncu taraf logo', count(*)
FROM channels
WHERE logo_url ILIKE '%wikimedia.org%' OR logo_url ILIKE '%wikipedia.org%'
UNION ALL
SELECT 'yayindaki riskli blog', count(*)
FROM blog_posts
WHERE published_at IS NOT NULL
  AND (slug ILIKE '%galatasaray%' OR slug ILIKE '%fenerbahce%'
    OR slug ILIKE '%derbi%'       OR slug ILIKE '%sampiyonlar-ligi%')
UNION ALL
SELECT 'eski domain', count(*)
FROM blog_posts
WHERE content ILIKE '%iptvsatinal.sbs%';


-- =====================================================================
-- GERİ ALMA (gerekirse)
-- =====================================================================
-- UPDATE channels c   SET is_active = b.is_active, logo_url = b.logo_url
--   FROM channels_backup_20260813 b   WHERE c.id = b.id;
-- UPDATE blog_posts p SET published_at = b.published_at
--   FROM blog_posts_backup_20260813 b WHERE p.id = b.id;
