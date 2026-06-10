-- =============================================================================
-- SUPABASE SQL EDITOR: Bu dosyanin TAMAMINI kopyalayip yapistirin.
-- Dosya adini degil, asagidaki SQL'i calistirin.
--
-- "customer_reviews iliskisi yok" hatasi = bu script henuz calismamis demektir.
-- Once bunu calistirin; sadece sutun ekleyen ikinci script'i SONRA kullanin
-- (tablo zaten bu script'te tam haliyle olusur).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_display_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'de')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  consent_accepted BOOLEAN NOT NULL DEFAULT false,
  subscription_months SMALLINT,
  customer_since_months SMALLINT,
  reviewer_email TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  moderated_at TIMESTAMPTZ,
  CONSTRAINT customer_reviews_featured_when_approved CHECK (NOT is_featured OR status = 'approved')
);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_status_created
  ON public.customer_reviews (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_locale_status
  ON public.customer_reviews (locale, status);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_featured_locale
  ON public.customer_reviews (locale, moderated_at DESC NULLS LAST)
  WHERE status = 'approved' AND is_featured = true;

COMMENT ON TABLE public.customer_reviews IS 'First-party customer reviews; moderator approves via admin_users.';
COMMENT ON COLUMN public.customer_reviews.subscription_months IS 'Satın alınan paket süresi (ay)';
COMMENT ON COLUMN public.customer_reviews.customer_since_months IS 'Hizmeti kaç aydır kullandığı';
COMMENT ON COLUMN public.customer_reviews.reviewer_email IS 'Opsiyonel; yalnızca moderasyon, sitede gösterilmez';
COMMENT ON COLUMN public.customer_reviews.is_featured IS 'Onaylı yorumlar için slayt / öne çıkan';

CREATE OR REPLACE FUNCTION public.is_customer_review_moderator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.is_admin IS TRUE
      AND lower(trim(au.email)) = lower(trim(COALESCE(auth.jwt() ->> 'email', '')))
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_customer_review_moderator() TO anon, authenticated;

REVOKE ALL ON public.customer_reviews FROM PUBLIC;
GRANT SELECT, INSERT ON public.customer_reviews TO anon, authenticated;
GRANT UPDATE, DELETE ON public.customer_reviews TO authenticated;

ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customer_reviews_select_public ON public.customer_reviews;
DROP POLICY IF EXISTS customer_reviews_insert_public ON public.customer_reviews;
DROP POLICY IF EXISTS customer_reviews_update_moderator ON public.customer_reviews;
DROP POLICY IF EXISTS customer_reviews_delete_moderator ON public.customer_reviews;

CREATE POLICY customer_reviews_select_public
  ON public.customer_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR public.is_customer_review_moderator());

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

CREATE POLICY customer_reviews_update_moderator
  ON public.customer_reviews
  FOR UPDATE
  TO authenticated
  USING (public.is_customer_review_moderator())
  WITH CHECK (public.is_customer_review_moderator());

CREATE POLICY customer_reviews_delete_moderator
  ON public.customer_reviews
  FOR DELETE
  TO authenticated
  USING (public.is_customer_review_moderator());
