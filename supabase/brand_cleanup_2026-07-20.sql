-- ============================================================================
-- brand_cleanup_2026-07-20.sql
-- QruzeTV | Blog tablosu marka + slug + kesik title temizliği
-- ----------------------------------------------------------------------------
-- AMAÇ:
--   1) Eski marka adı kalıntılarını temizlemek:
--        'QruzeHD'       -> 'QruzeTV'
--        'KaliteliIPTV'  -> 'QruzeTV'
--        'PrimeWatch TV' -> 'QruzeTV'
--        'Satın AI'      -> 'Satın Al'   (yazım hatası)
--   2) Kesik kalmış başlığı tam hâline getirmek:
--        'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri...'
--        -> 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta (Kaliteli Yayın Rehberi)'
--   3) Bozuk slug'ı düzeltmek:
--        '-derbi-gn-iptv-donmamas-iin-bilmeniz-gereken-her-ey'
--        -> 'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey'
--
-- ŞEMA DOĞRULAMA NOTU (ÖNEMLİ):
--   Bu depoda blog_posts için CREATE TABLE migration'ı BULUNAMADI (supabase/migrations
--   içinde yok; tablo büyük olasılıkla Supabase Dashboard üzerinden yönetiliyor).
--   Kolon adları kod tabanındaki insert/update/select çağrılarından doğrulandı:
--     id, slug, title, content, excerpt, seo_title, seo_description, focus_keyword,
--     category, tags, cover_image_url, published_at, updated_at, author,
--     allow_comments, featured
--   DİKKAT: Görevde geçen 'description' adlı kolon kod tabanında YOK; onun yerine
--   'seo_description' ve 'excerpt' kolonları kapsandı. Bölüm 0'daki kontrol sorgusunu
--   UPDATE'lerden ÖNCE çalıştırıp kolon adlarını doğrulayın; bir kolon yoksa ilgili
--   UPDATE'i çalıştırmayın (PostgREST/SQL "column does not exist" hatası verir).
--
-- ÇALIŞTIRMA:
--   - Supabase Dashboard > SQL Editor'de tüm dosyayı tek seferde çalıştırın.
--   - Script BEGIN..COMMIT transaction'ı içindedir; herhangi bir hata tüm
--     değişiklikleri geri alır.
--   - Her UPDATE'in üzerindeki SELECT, etkilenecek satırları ÖNCEDEN gösterir.
--     İsterseniz UPDATE'lere geçmeden önce bu SELECT'leri tek tek çalıştırıp
--     etki kapsamını doğrulayın.
--   - updated_at bilinçli olarak ELLE güncellenmiyor (dateModified şişirilmesin);
--     tabloda trigger varsa kendisi günceller.
--   - Eş zamanlı uygulama tarafı güvenlik ağı: src/pages/BlogPostPage.jsx içindeki
--     render-zamanı sanitize (BRAND_TEXT_FIXES) aynı replace'leri gösterimde de uygular.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- BÖLÜM 0 — Şema kolon kontrolü (read-only; UPDATE'lerden önce göz atın)
-- ----------------------------------------------------------------------------
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- ----------------------------------------------------------------------------
-- BÖLÜM 1 — Eski marka / yazım kalıntıları: title, seo_title, seo_description, excerpt
-- ----------------------------------------------------------------------------

-- 1a) ÖNİZLEME: title alanında etkilenecek satırlar
SELECT id, slug, title
FROM blog_posts
WHERE title LIKE '%QruzeHD%'
   OR title LIKE '%KaliteliIPTV%'
   OR title LIKE '%PrimeWatch TV%'
   OR title LIKE '%Satın AI%';

UPDATE blog_posts
SET title = replace(
              replace(
                replace(
                  replace(title, 'QruzeHD', 'QruzeTV'),
                  'KaliteliIPTV', 'QruzeTV'),
                'PrimeWatch TV', 'QruzeTV'),
              'Satın AI', 'Satın Al')
WHERE title LIKE '%QruzeHD%'
   OR title LIKE '%KaliteliIPTV%'
   OR title LIKE '%PrimeWatch TV%'
   OR title LIKE '%Satın AI%';

-- 1b) ÖNİZLEME: seo_title alanında etkilenecek satırlar
SELECT id, slug, seo_title
FROM blog_posts
WHERE seo_title LIKE '%QruzeHD%'
   OR seo_title LIKE '%KaliteliIPTV%'
   OR seo_title LIKE '%PrimeWatch TV%'
   OR seo_title LIKE '%Satın AI%';

UPDATE blog_posts
SET seo_title = replace(
                  replace(
                    replace(
                      replace(seo_title, 'QruzeHD', 'QruzeTV'),
                      'KaliteliIPTV', 'QruzeTV'),
                    'PrimeWatch TV', 'QruzeTV'),
                  'Satın AI', 'Satın Al')
WHERE seo_title LIKE '%QruzeHD%'
   OR seo_title LIKE '%KaliteliIPTV%'
   OR seo_title LIKE '%PrimeWatch TV%'
   OR seo_title LIKE '%Satın AI%';

-- 1c) ÖNİZLEME: seo_description alanında etkilenecek satırlar
SELECT id, slug, seo_description
FROM blog_posts
WHERE seo_description LIKE '%QruzeHD%'
   OR seo_description LIKE '%KaliteliIPTV%'
   OR seo_description LIKE '%PrimeWatch TV%'
   OR seo_description LIKE '%Satın AI%';

UPDATE blog_posts
SET seo_description = replace(
                        replace(
                          replace(
                            replace(seo_description, 'QruzeHD', 'QruzeTV'),
                            'KaliteliIPTV', 'QruzeTV'),
                          'PrimeWatch TV', 'QruzeTV'),
                        'Satın AI', 'Satın Al')
WHERE seo_description LIKE '%QruzeHD%'
   OR seo_description LIKE '%KaliteliIPTV%'
   OR seo_description LIKE '%PrimeWatch TV%'
   OR seo_description LIKE '%Satın AI%';

-- 1d) ÖNİZLEME: excerpt alanında etkilenecek satırlar
SELECT id, slug, excerpt
FROM blog_posts
WHERE excerpt LIKE '%QruzeHD%'
   OR excerpt LIKE '%KaliteliIPTV%'
   OR excerpt LIKE '%PrimeWatch TV%'
   OR excerpt LIKE '%Satın AI%';

UPDATE blog_posts
SET excerpt = replace(
                replace(
                  replace(
                    replace(excerpt, 'QruzeHD', 'QruzeTV'),
                    'KaliteliIPTV', 'QruzeTV'),
                  'PrimeWatch TV', 'QruzeTV'),
                'Satın AI', 'Satın Al')
WHERE excerpt LIKE '%QruzeHD%'
   OR excerpt LIKE '%KaliteliIPTV%'
   OR excerpt LIKE '%PrimeWatch TV%'
   OR excerpt LIKE '%Satın AI%';

-- ----------------------------------------------------------------------------
-- BÖLÜM 2 — Kesik title düzeltmesi
--   Canlı kanıt: <title>IPTV Alırken Dikkat Edilmesi Gereken 7 Kri... | KaliteliIPTV</title>
--   Kart başlığındaki tam hâl: 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta
--   (Kaliteli Yayın Rehberi)'. seo_title site formatına uygun olarak '... | QruzeTV'
--   ekiyle yazılır (uygulama: seo_title || `${title} | QruzeTV`).
-- ----------------------------------------------------------------------------

-- 2a) ÖNİZLEME: kesik başlık taşıyan satır(lar)
SELECT id, slug, title, seo_title
FROM blog_posts
WHERE slug = 'iptv-alrken-dikkat-edilmesi-gereken-7-kritik-nokta-kaliteli-yayn-rehberi'
   OR title LIKE 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri%'
   OR seo_title LIKE 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri%';

-- 2b) title tam hâline (yalnızca gerçekten kesik/eksik olan satırlar)
UPDATE blog_posts
SET title = 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta (Kaliteli Yayın Rehberi)'
WHERE title LIKE 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri%'
  AND title <> 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta (Kaliteli Yayın Rehberi)';

-- 2c) seo_title tam hâline + yeni marka eki (yalnızca kesik olan satırlar)
UPDATE blog_posts
SET seo_title = 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta (Kaliteli Yayın Rehberi) | QruzeTV'
WHERE seo_title LIKE 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri%'
  AND seo_title <> 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta (Kaliteli Yayın Rehberi) | QruzeTV';

-- ----------------------------------------------------------------------------
-- BÖLÜM 3 — Bozuk slug düzeltmesi
--   '-derbi-gn-iptv-donmamas-iin-bilmeniz-gereken-her-ey'
--   -> 'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey'
-- ----------------------------------------------------------------------------

-- 3a) ÖNİZLEME: bozuk slug'lı satır + yeni slug çakışma kontrolü
--     (ikinci sorgu satır döndürürse UPDATE unique ihlali riski taşır — önce o
--     satırı manuel inceleyin!)
SELECT id, slug, title FROM blog_posts
WHERE slug = '-derbi-gn-iptv-donmamas-iin-bilmeniz-gereken-her-ey';

SELECT id, slug, title FROM blog_posts
WHERE slug = 'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey';

UPDATE blog_posts
SET slug = 'derbi-gunu-iptv-donmamasi-icin-bilmeniz-gereken-her-sey'
WHERE slug = '-derbi-gn-iptv-donmamas-iin-bilmeniz-gereken-her-ey';

-- ----------------------------------------------------------------------------
-- BÖLÜM 4 — (OPSİYONEL, kapalı) content gövdesi için aynı marka replace'leri
--   Görev kapsamı dışında bırakıldı; gövdedeki eski markalar uygulama tarafında
--   render-zamanı sanitize ile maskeleniyor (BlogPostPage.jsx > BRAND_TEXT_FIXES).
--   Kalıcı temizlik isterseniz aşağıdaki bloğu yorumdan çıkarın:
--
-- SELECT id, slug
-- FROM blog_posts
-- WHERE content LIKE '%QruzeHD%'
--    OR content LIKE '%KaliteliIPTV%'
--    OR content LIKE '%PrimeWatch TV%'
--    OR content LIKE '%Satın AI%';
--
-- UPDATE blog_posts
-- SET content = replace(
--                 replace(
--                   replace(
--                     replace(content, 'QruzeHD', 'QruzeTV'),
--                     'KaliteliIPTV', 'QruzeTV'),
--                   'PrimeWatch TV', 'QruzeTV'),
--                 'Satın AI', 'Satın Al')
-- WHERE content LIKE '%QruzeHD%'
--    OR content LIKE '%KaliteliIPTV%'
--    OR content LIKE '%PrimeWatch TV%'
--    OR content LIKE '%Satın AI%';

-- ----------------------------------------------------------------------------
-- BÖLÜM 5 — DOĞRULAMA (COMMIT öncesi son kontrol; tüm sorgular 0 satır dönmeli
--           — Bölüm 4 kapalıysa content kontrolü satır döndürebilir)
-- ----------------------------------------------------------------------------
SELECT 'title_kalinti' AS kontrol, count(*) AS adet FROM blog_posts
WHERE title LIKE '%QruzeHD%' OR title LIKE '%KaliteliIPTV%' OR title LIKE '%PrimeWatch TV%' OR title LIKE '%Satın AI%'
UNION ALL
SELECT 'seo_title_kalinti', count(*) FROM blog_posts
WHERE seo_title LIKE '%QruzeHD%' OR seo_title LIKE '%KaliteliIPTV%' OR seo_title LIKE '%PrimeWatch TV%' OR seo_title LIKE '%Satın AI%'
UNION ALL
SELECT 'seo_description_kalinti', count(*) FROM blog_posts
WHERE seo_description LIKE '%QruzeHD%' OR seo_description LIKE '%KaliteliIPTV%' OR seo_description LIKE '%PrimeWatch TV%' OR seo_description LIKE '%Satın AI%'
UNION ALL
SELECT 'excerpt_kalinti', count(*) FROM blog_posts
WHERE excerpt LIKE '%QruzeHD%' OR excerpt LIKE '%KaliteliIPTV%' OR excerpt LIKE '%PrimeWatch TV%' OR excerpt LIKE '%Satın AI%'
UNION ALL
SELECT 'kesik_title_kalinti', count(*) FROM blog_posts
WHERE (title LIKE 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri%'
    OR seo_title LIKE 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kri%')
  AND title <> 'IPTV Alırken Dikkat Edilmesi Gereken 7 Kritik Nokta (Kaliteli Yayın Rehberi)'
UNION ALL
SELECT 'bozuk_slug_kalinti', count(*) FROM blog_posts
WHERE slug = '-derbi-gn-iptv-donmamas-iin-bilmeniz-gereken-her-ey';

COMMIT;

-- ============================================================================
-- SON NOT: Bu script yalnızca blog_posts tablosunu etkiler. Uygulama kodunda,
-- sitemap'te veya başka tablolarda (örn. customer_reviews) eski marka kalıntıları
-- varsa ayrı çalışma gerekir.
-- ============================================================================

-- ============================================================================
-- BÖLÜM 6 — channels.description_de (DE kanal sayfası Almanca açıklamaları)
-- ----------------------------------------------------------------------------
-- Mevcut transaction (BEGIN..COMMIT) yukarıda kapandı; bu bölüm ayrı çalışır.
-- /de/kanale sayfası kanal kartlarında description_de || description basar.
-- Değerler src/data/turkishChannels.js içindeki description_de alanlarından
-- AYNEN alınmıştır (name eşleşmesiyle).
-- ----------------------------------------------------------------------------
BEGIN;

ALTER TABLE public.channels ADD COLUMN IF NOT EXISTS description_de text;

UPDATE public.channels SET description_de = 'Der erste nationale Fernsehsender der Türkei.' WHERE name = 'TRT 1';
UPDATE public.channels SET description_de = 'Beliebte Serien und Unterhaltungsshows.' WHERE name = 'ATV';
UPDATE public.channels SET description_de = 'Unterhaltungs- und Seriensender.' WHERE name = 'Show TV';
UPDATE public.channels SET description_de = 'National ausstrahlender Fernsehsender.' WHERE name = 'Kanal D';
UPDATE public.channels SET description_de = 'Der erste private Fernsehsender der Türkei.' WHERE name = 'Star TV';
UPDATE public.channels SET description_de = 'Sender mit Fokus auf Unterhaltung und Shows.' WHERE name = 'TV8';
UPDATE public.channels SET description_de = 'Sport- und Unterhaltungssendungen.' WHERE name = 'TV8.5';
UPDATE public.channels SET description_de = 'Sportnachrichten und Spielzusammenfassungen rund um die Uhr.' WHERE name = 'A Spor';
UPDATE public.channels SET description_de = 'Der nationale Sportsender von TRT.' WHERE name = 'TRT Spor';
UPDATE public.channels SET description_de = 'Nationaler und internationaler Nachrichtensender.' WHERE name = 'CNN Türk';
UPDATE public.channels SET description_de = 'Der erste Nachrichtensender der Türkei.' WHERE name = 'NTV';
UPDATE public.channels SET description_de = 'Nachrichten und Diskussionssendungen.' WHERE name = 'HaberTürk';
UPDATE public.channels SET description_de = 'Der 24-Stunden-Nachrichtensender von TRT.' WHERE name = 'TRT Haber';
UPDATE public.channels SET description_de = 'Lifestyle, Unterhaltung und Dokumentationen.' WHERE name = 'DMAX';
UPDATE public.channels SET description_de = 'Dokumentationen über Geschichte, Kultur und Natur.' WHERE name = 'TRT Belgesel';
UPDATE public.channels SET description_de = 'Der Kindersender von TRT.' WHERE name = 'TRT Çocuk';
UPDATE public.channels SET description_de = 'Zeichentrickserien für Kinder von 3 bis 8 Jahren.' WHERE name = 'Minika Çocuk';
UPDATE public.channels SET description_de = 'Animationsserien für Kinder von 7 bis 14 Jahren.' WHERE name = 'Minika GO';
UPDATE public.channels SET description_de = 'Deutscher nationaler Fernsehsender.' WHERE name = 'Das Erste';
UPDATE public.channels SET description_de = 'Der zweite nationale Fernsehsender Deutschlands.' WHERE name = 'ZDF';

-- Doğrulama: 20 satır dolu olmalı
SELECT count(*) AS description_de_dolu FROM public.channels WHERE description_de IS NOT NULL;

COMMIT;

-- ============================================================================
-- BÖLÜM 7 — Keyword cannibalization düzeltmesi + web_vitals tablosu
-- ----------------------------------------------------------------------------
-- Bu bölüm iki bağımsız iş içerir; kendi transaction bloğuyla ayrı çalışır.
-- Dosyanın daha önce çalıştırılmış olması bu bölümü etkilemez (idempotent).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 7a) blog_posts: 'iptv-satin-ai' yazısının title/seo_title çakışması
-- ----------------------------------------------------------------------------
-- SORUN: Ana satış sayfası '/iptv-satin-al' ile blog yazısı 'iptv-satin-ai'
-- aynı anahtar kelimeyi hedefliyor (keyword cannibalization). Blog başlığı
-- "satın almadan önce bilmeniz gerekenler" açısına çekilerek sayfaların
-- arama niyeti birbirinden ayrıştırılıyor.
-- NOT: slug bilinçli olarak DEĞİŞTİRİLMİYOR (mevcut indeks + geri bağlantılar
-- korunur); yalnızca title ve seo_title güncellenir.
-- ----------------------------------------------------------------------------

BEGIN;

-- 7a-ÖNİZLEME: güncellenecek satırı önce görün
SELECT id, slug, title, seo_title
FROM public.blog_posts
WHERE slug = 'iptv-satin-ai';

UPDATE public.blog_posts
SET title = 'IPTV Satın Almadan Önce Bilmeniz Gerekenler (2026 Rehberi) | QruzeTV',
    seo_title = 'IPTV Satın Almadan Önce Bilmeniz Gerekenler (2026 Rehberi) | QruzeTV'
WHERE slug = 'iptv-satin-ai';

-- 7a-DOĞRULAMA: tek satır ve yeni başlık dönmeli
SELECT id, slug, title, seo_title
FROM public.blog_posts
WHERE slug = 'iptv-satin-ai';

COMMIT;

-- ----------------------------------------------------------------------------
-- 7b) public.web_vitals — istemci tarafı Core Web Vitals ölçümleri
-- ----------------------------------------------------------------------------
-- AMAÇ: src/utils/performanceMetrics.js içindeki gerçek kullanıcı ölçümlerini
-- (CLS, FCP, LCP, TTFB, INP) saklamak. Yalnızca anon INSERT'e izin verilir;
-- SELECT politikası YOKTUR (raporlama service_role / Dashboard üzerinden).
-- ----------------------------------------------------------------------------
-- NOT: CREATE TABLE + RLS/politika tanımı transaction dışında da güvenlidir;
-- hepsi idempotent (IF NOT EXISTS / CREATE OR REPLACE benzeri koruma) olacak
-- şekilde yazıldı, tekrar çalıştırılabilir.

CREATE TABLE IF NOT EXISTS public.web_vitals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  metric text,
  value double precision,
  path text,
  user_agent text
);

-- RLS'i aç (idempotent)
ALTER TABLE public.web_vitals ENABLE ROW LEVEL SECURITY;

-- Anon + authenticated INSERT politikası: önce varsa düşür, sonra kur.
-- SELECT politikası bilerek tanımlanmıyor (veri okunamaz, sadece yazılır).
DROP POLICY IF EXISTS web_vitals_insert_anon ON public.web_vitals;
DROP POLICY IF EXISTS "web_vitals insert for all" ON public.web_vitals;

CREATE POLICY web_vitals_insert_anon
ON public.web_vitals
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 7b-DOĞRULAMA: tablo ve politika oluştu mu
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'web_vitals';


-- ============================================================================
-- BÖLÜM 8 — blog_posts content / excerpt içindeki eski DOMAIN link temizliği
-- ----------------------------------------------------------------------------
-- AMAÇ: Gövde (content) ve özet (excerpt) alanlarında eski markalara ait
-- mutlak linklerin yeni canonical domain'e çevrilmesi:
--   'https://kaliteliiptv.com' -> 'https://satinaliptv.sbs'
--   'http://kaliteliiptv.com'  -> 'https://satinaliptv.sbs'
--   'https://primewatch.tv'    -> 'https://satinaliptv.sbs'
--   'http://primewatch.tv'     -> 'https://satinaliptv.sbs'
-- NOTLAR:
--   - Path'ler korunur: 'https://kaliteliiptv.com/blog/x' ->
--     'https://satinaliptv.sbs/blog/x' olur. Eski path'lerin canonical
--     hedeflere 301 yönlendirmesi sunucu tarafında public/.htaccess ile yapılır.
--   - http ve https varyantları bağımsızdır ('https://...' metni 'http://...'
--     kalıbını içermez); replace sırası sonucu değiştirmez.
--   - IDEMPOTENT: WHERE koşulları yalnızca eski domain URL'si içeren satırları
--     seçer; script ikinci kez çalıştırılırsa 0 satır güncellenir.
--   - Kendi BEGIN..COMMIT bloğundadır; önceki bölümlerden bağımsız çalışır.
--   - 'excerpt' kolonu Bölüm 0'daki şema kontrolünde doğrulanmıştı; yine de
--     kolon yoksa 8c UPDATE'ini çalıştırmayın.
--   - Şema öneki (http/https) OLMAYAN yalın domain geçmeleri (ör. düz metinde
--     'kaliteliiptv.com') bu bölümün kapsamı dışındadır.
-- ============================================================================

BEGIN;

-- 8a-ÖNİZLEME (content): kalıp bazında etkilenecek satır sayıları
SELECT 'content_https_kaliteliiptv' AS kalip, count(*) AS etkilenen_satir FROM public.blog_posts WHERE content LIKE '%https://kaliteliiptv.com%'
UNION ALL
SELECT 'content_http_kaliteliiptv', count(*) FROM public.blog_posts WHERE content LIKE '%http://kaliteliiptv.com%'
UNION ALL
SELECT 'content_https_primewatch', count(*) FROM public.blog_posts WHERE content LIKE '%https://primewatch.tv%'
UNION ALL
SELECT 'content_http_primewatch', count(*) FROM public.blog_posts WHERE content LIKE '%http://primewatch.tv%';

-- 8b-ÖNİZLEME (excerpt): kalıp bazında etkilenecek satır sayıları
SELECT 'excerpt_https_kaliteliiptv' AS kalip, count(*) AS etkilenen_satir FROM public.blog_posts WHERE excerpt LIKE '%https://kaliteliiptv.com%'
UNION ALL
SELECT 'excerpt_http_kaliteliiptv', count(*) FROM public.blog_posts WHERE excerpt LIKE '%http://kaliteliiptv.com%'
UNION ALL
SELECT 'excerpt_https_primewatch', count(*) FROM public.blog_posts WHERE excerpt LIKE '%https://primewatch.tv%'
UNION ALL
SELECT 'excerpt_http_primewatch', count(*) FROM public.blog_posts WHERE excerpt LIKE '%http://primewatch.tv%';

-- 8c) content alanı: 4 eski domain varyantını tek seferde yeni domain'e çevir
UPDATE public.blog_posts
SET content = replace(
                replace(
                  replace(
                    replace(content, 'https://kaliteliiptv.com', 'https://satinaliptv.sbs'),
                    'http://kaliteliiptv.com', 'https://satinaliptv.sbs'),
                  'https://primewatch.tv', 'https://satinaliptv.sbs'),
                'http://primewatch.tv', 'https://satinaliptv.sbs')
WHERE content LIKE '%https://kaliteliiptv.com%'
   OR content LIKE '%http://kaliteliiptv.com%'
   OR content LIKE '%https://primewatch.tv%'
   OR content LIKE '%http://primewatch.tv%';

-- 8d) excerpt alanı: aynı 4 varyant
UPDATE public.blog_posts
SET excerpt = replace(
                replace(
                  replace(
                    replace(excerpt, 'https://kaliteliiptv.com', 'https://satinaliptv.sbs'),
                    'http://kaliteliiptv.com', 'https://satinaliptv.sbs'),
                  'https://primewatch.tv', 'https://satinaliptv.sbs'),
                'http://primewatch.tv', 'https://satinaliptv.sbs')
WHERE excerpt LIKE '%https://kaliteliiptv.com%'
   OR excerpt LIKE '%http://kaliteliiptv.com%'
   OR excerpt LIKE '%https://primewatch.tv%'
   OR excerpt LIKE '%http://primewatch.tv%';

-- 8e-DOĞRULAMA: COMMIT öncesi son kontrol — tüm sayaçlar 0 dönmeli
SELECT 'content_https_kaliteliiptv' AS kontrol, count(*) AS kalan FROM public.blog_posts WHERE content LIKE '%https://kaliteliiptv.com%'
UNION ALL
SELECT 'content_http_kaliteliiptv', count(*) FROM public.blog_posts WHERE content LIKE '%http://kaliteliiptv.com%'
UNION ALL
SELECT 'content_https_primewatch', count(*) FROM public.blog_posts WHERE content LIKE '%https://primewatch.tv%'
UNION ALL
SELECT 'content_http_primewatch', count(*) FROM public.blog_posts WHERE content LIKE '%http://primewatch.tv%'
UNION ALL
SELECT 'excerpt_https_kaliteliiptv', count(*) FROM public.blog_posts WHERE excerpt LIKE '%https://kaliteliiptv.com%'
UNION ALL
SELECT 'excerpt_http_kaliteliiptv', count(*) FROM public.blog_posts WHERE excerpt LIKE '%http://kaliteliiptv.com%'
UNION ALL
SELECT 'excerpt_https_primewatch', count(*) FROM public.blog_posts WHERE excerpt LIKE '%https://primewatch.tv%'
UNION ALL
SELECT 'excerpt_http_primewatch', count(*) FROM public.blog_posts WHERE excerpt LIKE '%http://primewatch.tv%';

COMMIT;
