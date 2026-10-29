-- =====================================================================
-- ESKİ MARKA ADI TEMİZLİĞİ — 3. TUR (part3)
-- =====================================================================
-- part2'de 2 kayıt temizlenemedi. İki ayrı nedeni var:
--
--   1) ALAN KAPSAMI: part2'nin WHERE koşulu yalnızca content ve title'a
--      bakıyordu. 'iptv-nereden-alinir' yazısında "QruzeHD" SADECE
--      seo_title alanında geçiyor -> satır hiç seçilmedi.
--
--   2) BÜYÜK/KÜÇÜK HARF: Postgres'te replace() harf duyarlıdır, ILIKE değildir.
--      'smart-tvde-iptv-izlemek-mantikli-mi' yazısında "qruzehd" (küçük) ve
--      "Qruze HD" (boşluklu) varyantları var -> ILIKE buldu, replace() atladı.
--      Bu tur regexp_replace(..., 'gi') kullanır.
--
-- ⚠️ ÖNEMLİ — DOKUNULMAYAN ADRES:
--      'smart-tvde-iptv-izlemek-mantikli-mi' içinde şu M3U örneği var:
--          http://sunucu.qruzehd.com/get.php?username=...&password=...
--      Bu bir HOST ADI. Metin değiştirir gibi ezilirse çalışan bir adres
--      bozulabilir. Aşağıdaki sorgu bu host'u KORUR (token ile maskeleyip
--      geri koyar) ve yalnızca marka METNİNİ düzeltir.
--      Adres artık kullanılmıyorsa BÖLÜM 4'teki isteğe bağlı adımı çalıştırın.
-- =====================================================================


-- =====================================================================
-- BÖLÜM 0 — ÖNİZLEME: hangi alanda, hangi varyant?
-- =====================================================================

SELECT slug,
       (title           ~* 'qruze\s*hd|prime\s*watch') AS title_var,
       (seo_title       ~* 'qruze\s*hd|prime\s*watch') AS seo_title_var,
       (excerpt         ~* 'qruze\s*hd|prime\s*watch') AS excerpt_var,
       (seo_description ~* 'qruze\s*hd|prime\s*watch') AS seo_desc_var,
       (content         ~* 'qruze\s*hd|prime\s*watch') AS content_var,
       (content ILIKE '%qruzehd.com%')                 AS host_var
FROM blog_posts
WHERE title           ~* 'qruze\s*hd|prime\s*watch'
   OR seo_title       ~* 'qruze\s*hd|prime\s*watch'
   OR excerpt         ~* 'qruze\s*hd|prime\s*watch'
   OR seo_description ~* 'qruze\s*hd|prime\s*watch'
   OR content         ~* 'qruze\s*hd|prime\s*watch';


-- =====================================================================
-- BÖLÜM 1 — YEDEK
-- =====================================================================

CREATE TABLE IF NOT EXISTS blog_posts_backup_20260813_p3 AS
SELECT * FROM blog_posts
WHERE title           ~* 'qruze\s*hd|prime\s*watch'
   OR seo_title       ~* 'qruze\s*hd|prime\s*watch'
   OR excerpt         ~* 'qruze\s*hd|prime\s*watch'
   OR seo_description ~* 'qruze\s*hd|prime\s*watch'
   OR content         ~* 'qruze\s*hd|prime\s*watch';


-- =====================================================================
-- BÖLÜM 2 — TÜM ALANLARDA, TÜM VARYANTLARDA DÜZELTME
-- =====================================================================
-- content: önce qruzehd.com host'u maskelenir, marka düzeltilir, host geri konur.
-- Diğer alanlarda host geçmediği için doğrudan regexp_replace yeterli.

UPDATE blog_posts
SET content = regexp_replace(
                regexp_replace(
                  regexp_replace(content, 'qruzehd\.com', '@@KEEP_HOST@@', 'gi'),
                  'qruze\s*hd|prime\s*watch', 'QruzeTV', 'gi'),
                '@@KEEP_HOST@@', 'qruzehd.com', 'gi'),
    title           = regexp_replace(title,           'qruze\s*hd|prime\s*watch', 'QruzeTV', 'gi'),
    seo_title       = regexp_replace(seo_title,       'qruze\s*hd|prime\s*watch', 'QruzeTV', 'gi'),
    excerpt         = regexp_replace(excerpt,         'qruze\s*hd|prime\s*watch', 'QruzeTV', 'gi'),
    seo_description = regexp_replace(seo_description, 'qruze\s*hd|prime\s*watch', 'QruzeTV', 'gi')
WHERE title           ~* 'qruze\s*hd|prime\s*watch'
   OR seo_title       ~* 'qruze\s*hd|prime\s*watch'
   OR excerpt         ~* 'qruze\s*hd|prime\s*watch'
   OR seo_description ~* 'qruze\s*hd|prime\s*watch'
   OR content         ~* 'qruze\s*hd|prime\s*watch';


-- =====================================================================
-- BÖLÜM 3 — DOĞRULAMA (marka_metni 0 dönmeli; korunan_host 1 kalabilir)
-- =====================================================================

SELECT 'marka metni' AS kontrol, count(*) AS adet
FROM blog_posts
WHERE title           ~* 'qruze\s*hd|prime\s*watch'
   OR seo_title       ~* 'qruze\s*hd|prime\s*watch'
   OR excerpt         ~* 'qruze\s*hd|prime\s*watch'
   OR seo_description ~* 'qruze\s*hd|prime\s*watch'
   OR (content ~* 'qruze\s*hd|prime\s*watch' AND content NOT ILIKE '%qruzehd.com%')
UNION ALL
SELECT 'korunan host (qruzehd.com)', count(*)
FROM blog_posts WHERE content ILIKE '%qruzehd.com%';


-- =====================================================================
-- BÖLÜM 4 — İSTEĞE BAĞLI: sunucu adresi artık kullanılmıyorsa
-- =====================================================================
-- Kodda bu host hiç geçmiyor; M3U örneklerinde jenerik adresler kullanılıyor
-- (ör. M3uConverterPage.jsx -> http://vip.sunucu.com).
-- Adres ölüyse aşağıyı çalıştırıp örneği jenerikleştirin.
-- Adres CANLIYSA bu bölümü ÇALIŞTIRMAYIN.
--
-- UPDATE blog_posts
-- SET content = regexp_replace(content, 'sunucu\.qruzehd\.com', 'vip.sunucu.com', 'gi')
-- WHERE content ILIKE '%qruzehd.com%';


-- =====================================================================
-- GERİ ALMA
-- =====================================================================
-- UPDATE blog_posts p
--   SET content = b.content, title = b.title, seo_title = b.seo_title,
--       excerpt = b.excerpt, seo_description = b.seo_description
--   FROM blog_posts_backup_20260813_p3 b WHERE p.id = b.id;
