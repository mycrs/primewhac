-- package_types: müşteri formu aktif satırları okur; yalnızca panel adminleri ekler/günceller/siler.
-- Önce docs/supabase-customers-rls.sql ile public.is_customers_admin() tanımlı olmalı.
--
-- Belirti: /admin/customers/packages "Paket grubu" Kaydet çalışmıyor, toast veya konsolda
--   new row violates row-level security policy / 42501

ALTER TABLE public.package_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read package_types" ON public.package_types;
CREATE POLICY "Public read package_types"
  ON public.package_types
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin all package_types" ON public.package_types;

CREATE POLICY "package_types_select_admin"
  ON public.package_types
  FOR SELECT
  TO authenticated
  USING (public.is_customers_admin());

CREATE POLICY "package_types_insert_admin"
  ON public.package_types
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_customers_admin());

CREATE POLICY "package_types_update_admin"
  ON public.package_types
  FOR UPDATE
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

CREATE POLICY "package_types_delete_admin"
  ON public.package_types
  FOR DELETE
  TO authenticated
  USING (public.is_customers_admin());
