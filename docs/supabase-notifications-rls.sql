-- Bildirimler (notifications) — admin yazma, herkese açık okuma (aktif)
-- Supabase → SQL Editor → Run
--
-- ÖNKOŞUL (sıra önemli):
--   1) docs/supabase-customers-rls.sql  → is_customers_admin() + admin_users
--   2) Bu dosya
-- Tam liste: docs/00-production-sql-sirasi.sql
--
-- Yerel geliştirme (SQL yokken): npm run dev:all + SUPABASE_SERVICE_ROLE_KEY
-- Production (statik hosting): bu SQL zorunlu; Express API yok.

-- Banner görsel teması (info | warning | campaign | urgent | success)
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS theme text DEFAULT 'info';

UPDATE public.notifications
SET theme = 'info'
WHERE theme IS NULL OR trim(theme) = '';

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS notifications_select_public ON public.notifications;
DROP POLICY IF EXISTS notifications_select_admin ON public.notifications;
DROP POLICY IF EXISTS notifications_insert_admin ON public.notifications;
DROP POLICY IF EXISTS notifications_update_admin ON public.notifications;
DROP POLICY IF EXISTS notifications_delete_admin ON public.notifications;

-- Ziyaretçi: aktif + tarih aralığında olan bildirimler
CREATE POLICY notifications_select_public ON public.notifications
  FOR SELECT
  TO anon, authenticated
  USING (
    active = true
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

-- Admin: tüm bildirimleri okuyabilir
CREATE POLICY notifications_select_admin ON public.notifications
  FOR SELECT
  TO authenticated
  USING (public.is_customers_admin());

CREATE POLICY notifications_insert_admin ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_customers_admin());

CREATE POLICY notifications_update_admin ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (public.is_customers_admin())
  WITH CHECK (public.is_customers_admin());

CREATE POLICY notifications_delete_admin ON public.notifications
  FOR DELETE
  TO authenticated
  USING (public.is_customers_admin());

-- Doğrulama (isteğe bağlı):
-- SELECT id, title, active, theme, start_date, end_date FROM public.notifications ORDER BY created_at DESC LIMIT 5;
-- SELECT public.is_customers_admin();  -- admin oturumunda true dönmeli
