-- Müşteri portalı (CustomerPortalSection): IPTV şifresi → customers.notes
-- İstemci: UPDATE ... SET notes = 'şifre: ' || şifre WHERE portal_code = ...
-- UYARI: USING (true) tüm satırlarda UPDATE’e izin verir; yalnızca istemci hangi satırı
-- güncellediğini WHERE ile sınırlar. Güvenlik riski — prod’da daraltmayı düşünün.

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public update notes" ON public.customers;

CREATE POLICY "Public update notes" ON public.customers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
