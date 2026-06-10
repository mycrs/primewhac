-- İsteğe bağlı moderasyon e-postası (yayında gösterilmez). Tablo zaten varsa çalıştırın.

ALTER TABLE public.customer_reviews
  ADD COLUMN IF NOT EXISTS reviewer_email TEXT;

ALTER TABLE public.customer_reviews
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.customer_reviews.reviewer_email IS 'Opsiyonel; yalnızca moderasyon. Sitede listelenmez.';

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
