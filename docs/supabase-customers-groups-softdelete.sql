-- Müşteri takip: süre → paket grubu bağlantısı + soft delete
-- customer_packages.group_id → package_types.id (QruzeHD, QruzeTV vb.)

ALTER TABLE customer_packages
  ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES package_types(id),
  ADD COLUMN IF NOT EXISTS group_name text;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- İsteğe bağlı: mevcut süreleri bir gruba bağlamak için (grup id’yi kendi UUID’nizle değiştirin):
-- UPDATE customer_packages SET group_id = '...package_types.uuid...', group_name = 'QruzeHD' WHERE group_id IS NULL;
