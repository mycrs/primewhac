-- customer_packages: müşteri kayıt formu aktif süreleri okuyabilsin; yönetim yazma kalsın.
-- Önkoşul: public.is_customers_admin() (docs/supabase-customers-rls.sql)

ALTER TABLE public.customer_packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active customer_packages" ON public.customer_packages;
CREATE POLICY "Public read active customer_packages"
  ON public.customer_packages
  FOR SELECT
  TO anon, authenticated
  USING (COALESCE(is_active, true) = true);

DROP POLICY IF EXISTS "customer_packages_select_admin" ON public.customer_packages;
DROP POLICY IF EXISTS "customer_packages_insert_admin" ON public.customer_packages;
DROP POLICY IF EXISTS "customer_packages_update_admin" ON public.customer_packages;
DROP POLICY IF EXISTS "customer_packages_delete_admin" ON public.customer_packages;

CREATE POLICY "customer_packages_select_admin"
  ON public.customer_packages
  FOR SELECT
  TO authenticated
  USING (public.is_customers_admin());

CREATE POLICY "customer_packages_insert_admin"
  ON public.customer_packages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_customers_admin());

CREATE POLICY "customer_packages_update_admin"
  ON public.customer_packages
  FOR UPDATE
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

CREATE POLICY "customer_packages_delete_admin"
  ON public.customer_packages
  FOR DELETE
  TO authenticated
  USING (public.is_customers_admin());
