-- Öne çıkan yorumlar (ana sayfa + yorumlar sayfası slaytı). Admin yalnızca onaylı kayıtlarda işaretler.

ALTER TABLE public.customer_reviews
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.customer_reviews.is_featured IS 'Yayında ve onaylı; ana sayfa/yorumlar slaytında gösterilir.';

ALTER TABLE public.customer_reviews
  DROP CONSTRAINT IF EXISTS customer_reviews_featured_when_approved;
ALTER TABLE public.customer_reviews
  ADD CONSTRAINT customer_reviews_featured_when_approved
  CHECK (NOT is_featured OR status = 'approved');

CREATE INDEX IF NOT EXISTS idx_customer_reviews_featured_locale
  ON public.customer_reviews (locale, moderated_at DESC NULLS LAST)
  WHERE status = 'approved' AND is_featured = true;

DROP POLICY IF EXISTS customer_reviews_insert_public ON public.customer_reviews;

CREATE POLICY customer_reviews_insert_public
  ON public.customer_reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND consent_accepted IS TRUE
    AND char_length(trim(author_display_name)) BETWEEN 2 AND 80
    AND char_length(trim(body)) BETWEEN 20 AND 2000
    AND rating BETWEEN 1 AND 5
    AND locale IN ('tr', 'de')
    AND subscription_months IS NOT NULL
    AND subscription_months BETWEEN 1 AND 60
    AND customer_since_months IS NOT NULL
    AND customer_since_months BETWEEN 1 AND 120
    AND COALESCE(is_featured, false) = false
    AND (
      reviewer_email IS NULL
      OR trim(reviewer_email) = ''
      OR (
        char_length(trim(reviewer_email)) BETWEEN 5 AND 254
        AND trim(reviewer_email) ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
      )
    )
  );
