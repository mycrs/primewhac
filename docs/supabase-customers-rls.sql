-- customers: admin paneli listesi + herkese açık kayıt (musteri-kayit)
-- Liste boşsa: RLS açık ve SELECT politikası eksik olabilir — bu dosyayı SQL Editor'da çalıştırın.
--
-- Not: Anon kullanıcı insert sonrası portal_code için doğrudan SELECT kullanılmaz;
-- uygulama get_portal_code_after_register(username) RPC çağırır.

-- Önce gerekli kolonlar (yoksa fonksiyonlar hata verir)
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS portal_code text;

CREATE UNIQUE INDEX IF NOT EXISTS customers_portal_code_unique
  ON public.customers (portal_code)
  WHERE portal_code IS NOT NULL AND deleted_at IS NULL;

CREATE OR REPLACE FUNCTION public.is_customers_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.is_admin IS TRUE
      AND lower(trim(au.email)) = lower(trim(COALESCE(
        auth.jwt() ->> 'email',
        auth.jwt() #>> '{user_metadata,email}',
        ''
      )))
  );
$$;

-- Yeni kayıt sonrası portal_code (RLS SELECT kapalıyken; yalnızca çok yeni + beklemede satır)
CREATE OR REPLACE FUNCTION public.get_portal_code_after_register(p_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.portal_code
  FROM public.customers c
  WHERE lower(trim(c.username)) = lower(trim(COALESCE(p_username, '')))
    AND c.created_at > (now() - interval '5 minutes')
    AND COALESCE(c.status, '') = 'beklemede'
  ORDER BY c.created_at DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.is_customers_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_portal_code_after_register(text) TO anon, authenticated;

REVOKE ALL ON public.customers FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO anon, authenticated;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customers_insert_public ON public.customers;
DROP POLICY IF EXISTS customers_select_admin ON public.customers;
DROP POLICY IF EXISTS customers_update_admin ON public.customers;
DROP POLICY IF EXISTS customers_delete_admin ON public.customers;

CREATE POLICY customers_insert_public
  ON public.customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sadece admin_users'ta kayıtlı yöneticiler tüm satırları okur (admin panel)
CREATE POLICY customers_select_admin
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (public.is_customers_admin());

CREATE POLICY customers_update_admin
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

CREATE POLICY customers_delete_admin
  ON public.customers
  FOR DELETE
  TO authenticated
  USING (public.is_customers_admin());
