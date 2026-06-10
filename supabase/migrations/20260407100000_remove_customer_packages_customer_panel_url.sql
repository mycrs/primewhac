-- customer_packages.customer_panel_url kaldırıldı (kolon yok / kullanılmıyor).
-- Panel linki: package_types.server_url (lookup + admin aynı kaynak).

ALTER TABLE public.customer_packages DROP COLUMN IF EXISTS customer_panel_url;

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
