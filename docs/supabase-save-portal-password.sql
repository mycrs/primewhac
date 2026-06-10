-- Portal: IPTV şifresini customers.iptv_password kolonuna yaz (anon RPC)
-- Supabase → SQL Editor → Run
--
-- Tam kurulum için önce docs/supabase-customer-portal.sql (bu fonksiyon orada da tanımlı).
-- Yalnızca save_portal_customer_password güncellemek için bu dosyayı tek başına çalıştırabilirsiniz.
--
-- Önkoşul: ALTER TABLE customers ADD COLUMN IF NOT EXISTS iptv_password text;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS iptv_password text;

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
