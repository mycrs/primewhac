# QruzeTV — Yayın ve Production Rehberi

Canlı site: **https://cineverse.pro** (statik `dist/` + Supabase runtime).

## Mimari özeti

| Bileşen | Nerede çalışır |
|---------|----------------|
| React/Vite sitesi | Hostinger `public_html` (`dist/` FTP) |
| Supabase (auth, DB, Edge Functions) | Supabase Cloud |
| Express API (`server/`, port 3001) | **Yalnızca yerel geliştirme** veya ayrı Node sunucusu; Hostinger statik hosting’de çalışmaz |
| Müşteri kayıt (production) | Supabase Edge Function `public-customer-register` |
| Turnstile doğrulama (production) | Edge Function `verify-turnstile` |

Yerelde tam yığın: `npm run dev:all` (Vite :3000 + API :3001).

```bash
npm run check:env    # .env kontrolü
npm run smoke:api    # API ayakta mı (önce dev:api veya dev:all)
npm run smoke:all    # check:env + smoke:api
```

## Yerel geliştirme

1. Proje kökünde `.env` oluşturun (şablon: `.env.example`).
2. `npm run check:env` — zorunlu anahtarları kontrol eder.
3. `npm install` → `npm run dev:all`.

Geliştirmede Turnstile otomatik test anahtarı kullanılır; production’da gerçek site/secret key gerekir.

## Build ve FTP deploy

```bash
npm run build
# veya prerender ile:
npm run build:prerender
```

Ardından:

```bash
npm run deploy          # mevcut dist/ yükle
npm run deploy:build    # build + deploy
npm run deploy:dry      # yüklemeden önizleme
```

FTP değişkenleri `.env` içinde (`FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR`). **Git’e commit etmeyin.**

Build sonrası `public/sitemap.xml` güncellemek için:

```bash
npm run generate:sitemap
```

`VITE_SITE_URL=https://cineverse.pro` production build’de ayarlı olmalı.

## Production SQL (sıra önemli)

Supabase → SQL Editor’da sırayla çalıştırın. Kod, SQL yokken mümkün olduğunca düşer (admin API fallback, portal bakım mesajı).

**Tek sayfa özet:** `docs/00-production-sql-sirasi.sql` (yorum rehberi — çalıştırmanız gerekmez).

| Sıra | Dosya | Ne için |
|------|-------|---------|
| 1 | `docs/supabase-customers-rls.sql` | `is_customers_admin()` — admin RLS temeli |
| 2 | `docs/supabase-customers-groups-softdelete.sql` | Müşteri grupları / soft delete (gerekirse) |
| 3 | `docs/supabase-package-types-migration.sql` | `package_types` + `server_url` / panel (M3U portal) |
| 4 | `docs/supabase-package-types-rls-admin.sql` | Paket grubu admin yazma RLS |
| 5 | `docs/supabase-packages-tier-migration.sql` | Paket `tier`, `sort_order`, `currency` |
| 6 | `docs/supabase-notifications-rls.sql` | Duyuru admin yazma (1. adım zorunlu) |
| 7 | `docs/supabase-customer-portal.sql` | `portal_code`, `iptv_password`, lookup + şifre RPC |
| 8 | `docs/supabase-save-portal-password.sql` | Yalnızca şifre RPC güncellemesi (7. adım yeterliyse atlanabilir) |
| 9 | `docs/supabase-portal-attempts.sql` | Eski sürüm deneme logu (isteğe bağlı, güncel site kullanmaz) |

Admin e-postanız `admin_users` tablosunda kayıtlı olmalı (müşteri RLS SQL’inde tanımlı).

## Ortam değişkenleri

### Vite (build + tarayıcı) — zorunlu

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL` — canonical, schema, sitemap
WhatsApp destek numarasını herhangi bir `VITE_*` değişkenine yazmayın. Numara,
admin panelindeki **İletişim Bilgileri** alanından Supabase'e kaydedilir ve yalnızca
test/sipariş formu gönderilirken runtime'da kullanılır.

### Vite — önerilen / production

- `VITE_TURNSTILE_SITE_KEY` — yönetici girişi + müşteri portalı
- `VITE_TMDB_API_KEY` — Ne İzlesem / TMDB içerik
- `VITE_TEST_MODE=false` — canlıda robots engeli kapalı

### Node API (yalnızca `npm run dev:api` / ayrı sunucu)

- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY` — müşteri kayıt API
- `GEMINI_API_KEY` — maç içeriği AI (isteğe bağlı)
- `API_PORT` — varsayılan `3001`

`SUPABASE_*` boşsa API, `VITE_*` değerlerine düşer.

### FTP deploy

- `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR`

## Deploy sonrası kontrol listesi

- [ ] `/yonetim/giris` — admin girişi
- [ ] `/yonetim/notifications` — duyuru CRUD (SQL #6 sonrası)
- [ ] `/yonetim/customers/packages` — paket grubu `server_url` (SQL #3–4)
- [ ] `/yonetim/packages` — tier + sayfa içeriği sekmesi (SQL #5)
- [ ] `/paketler` — tier filtresi (SQL #5 sonrası)
- [ ] `/musteri-kayit` — kayıt + portal sorgusu + M3U (SQL #6–7)
- [ ] `/de/vergleich`, `/de/detaillierte-anleitungen` — DE sayfaları
- [ ] `sitemap.xml` — Search Console’a gönder
- [ ] Duyuru bandı (~3 sn) ve ExitIntent popup (~35 sn) — değişmediğini doğrula

## Maç içeriği

Maç metinleri varsayılan olarak `public/data/` JSON + runtime Supabase’ten okunur. Build sırasında tabloya yazmak için: `SUPABASE_SYNC_MATCH_CONTENT=1` ve service role key.

Günlük GitHub Actions workflow kaldırıldı; içerik güncellemesi manuel `npm run pregenerate:content` veya admin araçları ile yapılır.
