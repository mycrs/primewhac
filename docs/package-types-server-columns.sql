-- Sadece package_types sunucu/panel alanları (hızlı patch)
-- Supabase → SQL Editor → Run
-- Tam kurulum: docs/supabase-package-types-migration.sql

ALTER TABLE public.package_types
  ADD COLUMN IF NOT EXISTS customer_panel_url text,
  ADD COLUMN IF NOT EXISTS server_url text,
  ADD COLUMN IF NOT EXISTS server_port text;
