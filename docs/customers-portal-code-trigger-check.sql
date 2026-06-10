-- portal_code otomatik üretilmiyorsa: trigger + fonksiyon var mı kontrol edin.
-- Supabase SQL Editor’da çalıştırın.

-- 1) public.customers üzerindeki trigger’lar (şema ile güvenli)
SELECT t.tgname AS trigger_name,
       t.tgenabled AS enabled,
       pg_get_triggerdef(t.oid, true) AS definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname = 'customers'
  AND NOT t.tgisinternal;

-- 2) Kısa liste (senin sorgunun şemalı hali)
SELECT tgname, tgenabled, pg_get_triggerdef(oid, true)
FROM pg_trigger
WHERE tgrelid = 'public.customers'::regclass
  AND NOT tgisinternal;

-- 3) Fonksiyon var mı
SELECT proname, prosrc IS NOT NULL AS has_body
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname = 'customers_set_portal_code';

-- --- Eksikse veya hatalıysa: aşağıdaki dosyayı uygulayın ---
-- docs/supabase-customer-portal.sql (fonksiyon + trigger)
--
-- PostgreSQL 14+: trigger satırında hata alırsanız şunu deneyin:
--   EXECUTE PROCEDURE → EXECUTE FUNCTION
-- CREATE TRIGGER trg_customers_portal_code
--   BEFORE INSERT ON public.customers
--   FOR EACH ROW
--   EXECUTE FUNCTION public.customers_set_portal_code();
