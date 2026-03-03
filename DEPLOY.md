# Yayın ve Günlük Güncelleme

## Supabase + Runtime İçerik

Maç içerikleri artık Supabase'te saklanıyor. Site ziyaret edildiğinde güncel içerik çekilir (Ne izlesem gibi).

## Yerel Geliştirme (.env)

Pregenerate çalıştırmak için ekle:

```
SUPABASE_URL=https://pkppewdtnuchwjtmulev.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Service Role Key: Supabase → Project Settings → API → service_role (Reveal)

## GitHub Secrets (Günlük Otomatik Güncelleme)

Repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Adı | Açıklama |
|------------|----------|
| GEMINI_API_KEY | Gemini API anahtarı |
| SUPABASE_URL | https://pkppewdtnuchwjtmulev.supabase.co |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service_role key |

Bu 3 secret eklendikten sonra her gün 00:01 UTC'de (Türkiye 03:01) maç içerikleri otomatik güncellenir.

## Deploy

1. `npm run build` veya `npm run build:prerender`
2. `dist/` klasörünü Hostinger'a yükle
3. Bir kez yeterli – içerik Supabase'ten runtime'da gelir
