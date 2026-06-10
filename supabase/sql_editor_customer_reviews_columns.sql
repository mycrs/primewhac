-- ÖNEMLİ: Sadece bu dosyanın İÇİNDEKİ SQL satırlarını kopyalayıp Supabase SQL Editor'e yapıştırın.
-- "supabase/..." dosya yolunu asla SQL kutusuna yazmayın; o bir dosya konumudur, SQL değildir.

ALTER TABLE public.customer_reviews
  ADD COLUMN IF NOT EXISTS reviewer_email TEXT;

ALTER TABLE public.customer_reviews
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.customer_reviews.reviewer_email IS 'Opsiyonel; yalnızca moderasyon. Sitede listelenmez.';
COMMENT ON COLUMN public.customer_reviews.is_featured IS 'Yayında ve onaylı; ana sayfa/yorumlar slaytında gösterilir.';

ALTER TABLE public.customer_reviews
  DROP CONSTRAINT IF EXISTS customer_reviews_featured_when_approved;

ALTER TABLE public.customer_reviews
  ADD CONSTRAINT customer_reviews_featured_when_approved
  CHECK (NOT is_featured OR status = 'approved');

CREATE INDEX IF NOT EXISTS idx_customer_reviews_featured_locale
  ON public.customer_reviews (locale, moderated_at DESC NULLS LAST)
  WHERE status = 'approved' AND is_featured = true;

NOTIFY pgrst, 'reload schema';
