-- IPTV şifresi ayrı kolon; portal lookup iptv_password + notes (eski "şifre:" satırı) döner
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS iptv_password text;

CREATE OR REPLACE FUNCTION public.lookup_customer_portal(p_code text)
RETURNS TABLE (
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

-- Eski RPC kullanan kurulumlar: notes yerine iptv_password
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
