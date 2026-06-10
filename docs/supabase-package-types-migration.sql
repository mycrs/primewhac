-- Müşteri takip: paket türleri + müşteri alanları
-- Supabase → SQL Editor → Run
--
-- ÖNKOŞUL: docs/supabase-customers-rls.sql (admin yazma için package-types-rls-admin.sql)
-- Portal M3U: server_url + server_port — /yonetim/musteri-paketleri → Paket grupları

CREATE TABLE IF NOT EXISTS package_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Müşteri portalı / admin paket grubu: panel + IPTV sunucu (customer-portal.sql ile uyumlu)
ALTER TABLE package_types
  ADD COLUMN IF NOT EXISTS customer_panel_url text,
  ADD COLUMN IF NOT EXISTS server_url text,
  ADD COLUMN IF NOT EXISTS server_port text;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS package_type_id uuid REFERENCES package_types(id),
  ADD COLUMN IF NOT EXISTS package_type_name text,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'TRY',
  ADD COLUMN IF NOT EXISTS country_code text DEFAULT '+90';

ALTER TABLE package_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read package_types" ON package_types;
CREATE POLICY "Public read package_types" ON package_types
  FOR SELECT USING (is_active = true);

-- Yazma izni yoksa /admin/customers/packages kayıt almaz → docs/supabase-package-types-rls-admin.sql
DROP POLICY IF EXISTS "Admin all package_types" ON package_types;
CREATE POLICY "Admin all package_types" ON package_types
  FOR ALL USING (auth.role() = 'authenticated');

-- Örnek türler (tablo boşsa ekle)
INSERT INTO package_types (name, sort_order)
SELECT v.name, v.sort_order
FROM (
  VALUES
    ('Türkiye Standart', 1),
    ('Türkiye HD', 2),
    ('Avrupa Standart', 3),
    ('Avrupa HD', 4)
) AS v(name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM package_types LIMIT 1);
