-- =====================================================================
-- Dahili matematik doğrulaması (math-captcha) — Cloudflare Turnstile / hCaptcha yerine
-- Supabase Dashboard → SQL Editor'de bir kez çalıştırın.
-- İDEMPOTENT: tekrar çalıştırmak güvenlidir.
-- Edge Functions: math-captcha, public-customer-register (service role erişir)
-- =====================================================================

create table if not exists public.captcha_challenges (
  id uuid primary key default gen_random_uuid(),
  answer_hash text not null,              -- cevabın SHA-256 hash'i (trim + lowercase normalize)
  ip text,                                -- challenge üreten istemci IP'si (rate limit için)
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,        -- üretimden itibaren 10 dakika
  attempts integer not null default 0,    -- yanlış deneme sayısı (maks. 3)
  used boolean not null default false     -- tek kullanımlık
);

-- Süresi dolan kayıtların temizliği / geçerlilik kontrolü için
create index if not exists captcha_challenges_expires_at_idx
  on public.captcha_challenges (expires_at);

-- IP başına saatlik rate limit sayımı için
create index if not exists captcha_challenges_ip_created_at_idx
  on public.captcha_challenges (ip, created_at desc);

-- RLS AÇIK + HİÇBİR POLICY YOK → anon / authenticated erişemez.
-- Yalnızca service role (Edge Functions) okuyup yazabilir (RLS'i bypass eder).
alter table public.captcha_challenges enable row level security;

-- Varsa eski/yanlışlıkla eklenmiş public policy'leri temizle
drop policy if exists "captcha_challenges_public_read" on public.captcha_challenges;
drop policy if exists "captcha_challenges_public_insert" on public.captcha_challenges;
drop policy if exists "captcha_challenges_anon_all" on public.captcha_challenges;

-- Anon/authenticated rollerine tablo yetkisi verme (idempotent)
revoke all on public.captcha_challenges from anon, authenticated;
grant select, insert, update, delete on public.captcha_challenges to service_role;
