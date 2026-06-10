-- Web müşteri paneli giriş URL'i (IPTV sunucu / M3U adresinden ayrı).
ALTER TABLE public.package_types
  ADD COLUMN IF NOT EXISTS customer_panel_url text;

-- Portal lookup / müşteri formu için (eski projelerde eksik olabiliyor)
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS iptv_password text;

-- Dönüş kolonları değiştiği için REPLACE yetmez; önce kaldır.
DROP FUNCTION IF EXISTS public.lookup_customer_portal(text);

CREATE FUNCTION public.lookup_customer_portal(p_code text)
RETURNS TABLE (
  full_name text,
  package_name text,
  end_date date,
  username text,
  server_url text,
  server_port text,
  customer_panel_url text,
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
    COALESCE(
      (SELECT pt.customer_panel_url FROM package_types pt WHERE pt.id = c.package_type_id LIMIT 1),
      (
        SELECT pt.customer_panel_url
        FROM package_types pt
        WHERE c.package_type_name IS NOT NULL
          AND trim(c.package_type_name) <> ''
          AND lower(trim(pt.name)) = lower(trim(c.package_type_name))
        LIMIT 1
      )
    ) AS customer_panel_url,
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
