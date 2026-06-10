-- Paket yönetimi: tier, bölge, sıralama, rozet, kart alanları
-- Supabase → SQL Editor → Run
--
-- SQL yokken: admin kayıt çalışır (eksik sütunlar otomatik düşülür); sitede tier paket adından çıkarılır.
-- SQL sonrası: /paketler tier filtresi, sort_order sıralaması ve rozet alanları tam çalışır.

ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT '₺',
  ADD COLUMN IF NOT EXISTS badge_text text,
  ADD COLUMN IF NOT EXISTS badge_enabled boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS button_text text,
  ADD COLUMN IF NOT EXISTS card_description text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

COMMENT ON COLUMN public.packages.tier IS 'economic | standard | premium | ultra';
COMMENT ON COLUMN public.packages.sort_order IS 'Küçük numara önce listelenir';
COMMENT ON COLUMN public.packages.currency IS '₺ | € | $';
COMMENT ON COLUMN public.packages.badge_text IS 'Kart rozeti: En Popüler, Avantajlı vb.';
COMMENT ON COLUMN public.packages.featured IS 'Öne çıkan paket (popular ile birlikte kullanılabilir)';

-- Mevcut kayıtlar için tier çıkarımı (isteğe bağlı)
UPDATE public.packages
SET tier = CASE
  WHEN lower(name) LIKE '%premium%' OR lower(name) LIKE '%vip%' THEN 'premium'
  ELSE 'standard'
END
WHERE tier IS NULL OR tier = 'standard';

UPDATE public.packages SET currency = '€' WHERE upper(region) = 'EU' AND (currency IS NULL OR currency = '₺');
UPDATE public.packages SET currency = '₺' WHERE upper(region) = 'TR' AND currency IS NULL;

-- site_content: packagesPageContent anahtarı admin panelden kaydedilir (JSON).
-- Örnek: INSERT INTO site_content (key, value) VALUES ('packagesPageContent', '{...}');
