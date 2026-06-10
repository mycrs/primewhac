-- Müşteri portalı deneme günlüğü (İSTEĞE BAĞLI — artık kullanılmıyor)
-- Önceki sürümde uygulama buraya insert ediyordu; güncel istemci yazmaz.
-- Tabloyu kaldırmak için: DROP TABLE IF EXISTS public.portal_attempts;

CREATE TABLE IF NOT EXISTS portal_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address text,
  customer_code text,
  attempted_at timestamptz DEFAULT now(),
  success boolean DEFAULT false
);

ALTER TABLE portal_attempts ENABLE ROW LEVEL SECURITY;

-- Tekrar çalıştırmada 42710 hatası olmaması için önce kaldır
DROP POLICY IF EXISTS "Public insert attempts" ON portal_attempts;
DROP POLICY IF EXISTS "Admin read attempts" ON portal_attempts;

CREATE POLICY "Public insert attempts" ON portal_attempts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read attempts" ON portal_attempts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- İsteğe bağlı: indeks (dashboard sorgusu için)
CREATE INDEX IF NOT EXISTS portal_attempts_attempted_at_idx ON portal_attempts (attempted_at DESC);
CREATE INDEX IF NOT EXISTS portal_attempts_success_attempted_idx ON portal_attempts (success, attempted_at DESC);
