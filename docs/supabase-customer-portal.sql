-- Müşteri portalı: kod + sunucu bilgisi (/musteri-kayit → "Bilgilerimi Getir")
-- Supabase → SQL Editor → Run
--
-- ÖNKOŞUL: customers tablosu ve package_types (docs/supabase-customers-rls.sql sonrası)
-- Bu dosya: portal_code, iptv_password, lookup_customer_portal, save_portal_customer_password
-- İsteğe bağlı: docs/supabase-portal-attempts.sql (eski sürüm; güncel istemci kullanmaz)
--
-- Production: statik hosting — portal yalnızca bu RPC ile çalışır (Express API gerekmez).

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS iptv_password text;

ALTER TABLE package_types
  ADD COLUMN IF NOT EXISTS server_url text,
  ADD COLUMN IF NOT EXISTS server_port text;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS portal_code text;

CREATE UNIQUE INDEX IF NOT EXISTS customers_portal_code_unique
  ON customers (portal_code)
  WHERE portal_code IS NOT NULL AND deleted_at IS NULL;

-- Yeni kayıtta otomatik kod: QRZ-2847 (4 haneli)
CREATE OR REPLACE FUNCTION public.customers_set_portal_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  try text;
  n int := 0;
BEGIN
  IF NEW.portal_code IS NOT NULL AND trim(NEW.portal_code) <> '' THEN
    RETURN NEW;
  END IF;
  LOOP
    try := 'QRZ-' || lpad((floor(random() * 10000))::int::text, 4, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM customers c WHERE c.portal_code = try AND c.deleted_at IS NULL
    );
    n := n + 1;
    EXIT WHEN n > 30;
  END LOOP;
  NEW.portal_code := try;
  RETURN NEW;
END;
$$;

-- PostgreSQL 14+: EXECUTE FUNCTION … da kullanılabilir. Hata alırsanız PROCEDURE / FUNCTION satırını değiştirin.
DROP TRIGGER IF EXISTS trg_customers_portal_code ON customers;
CREATE TRIGGER trg_customers_portal_code
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE PROCEDURE public.customers_set_portal_code();

-- Anon: sınırlı alan + iptv_password / notes (otomatik doldurma; customers.iptv_password kolonu gerekir)
-- Güncel tanım: supabase/migrations/20260407100000_remove_customer_packages_customer_panel_url.sql
CREATE OR REPLACE FUNCTION public.lookup_customer_portal(p_code text)
RETURNS TABLE (
  portal_code text,
  full_name text,
  package_name text,
  end_date date,
  username text,
  server_url text,
  server_port text,
  status text,
  iptv_password text,
  notes text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.portal_code,
    c.full_name,
    c.package_name,
    c.end_date,
    c.username,
    COALESCE(
      (SELECT pt.server_url FROM package_types pt WHERE pt.id = c.package_type_id LIMIT 1),
      (
        SELECT pt.server_url
        FROM package_types pt
        WHERE c.package_type_name IS NOT NULL
          AND trim(c.package_type_name) <> ''
          AND lower(trim(pt.name)) = lower(trim(c.package_type_name))
        LIMIT 1
      )
    ) AS server_url,
    COALESCE(
      (SELECT pt.server_port FROM package_types pt WHERE pt.id = c.package_type_id LIMIT 1),
      (
        SELECT pt.server_port
        FROM package_types pt
        WHERE c.package_type_name IS NOT NULL
          AND trim(c.package_type_name) <> ''
          AND lower(trim(pt.name)) = lower(trim(c.package_type_name))
        LIMIT 1
      )
    ) AS server_port,
    c.status::text AS status,
    c.iptv_password,
    c.notes
  FROM customers c
  WHERE c.deleted_at IS NULL
    AND c.portal_code IS NOT NULL
    AND upper(replace(trim(c.portal_code), ' ', '')) = upper(replace(trim(p_code), ' ', ''))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_customer_portal(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_customer_portal(text) TO anon;
GRANT EXECUTE ON FUNCTION public.lookup_customer_portal(text) TO authenticated;

-- Portal şifre → iptv_password (anon; ayrıca supabase-save-portal-password.sql)
CREATE OR REPLACE FUNCTION public.save_portal_customer_password(p_code text, p_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n int;
BEGIN
  IF p_password IS NULL OR trim(p_password) = '' THEN
    RETURN false;
  END IF;
  IF length(p_password) > 512 THEN
    RETURN false;
  END IF;

  UPDATE customers
  SET iptv_password = p_password
  WHERE deleted_at IS NULL
    AND portal_code IS NOT NULL
    AND upper(replace(trim(portal_code), ' ', '')) = upper(replace(trim(p_code), ' ', ''));

  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.save_portal_customer_password(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_portal_customer_password(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.save_portal_customer_password(text, text) TO authenticated;
