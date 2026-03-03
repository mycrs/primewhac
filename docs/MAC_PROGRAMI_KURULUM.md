# Maç Programı - Mackolik Tarzı

Süper Lig, Premier Lig, Ziraat Türkiye Kupası ve Avrupa liglerinde **güncel maç programı** gösterir.

## Kurulum

1. [API-Football](https://www.api-football.com/) üzerinden ücretsiz API key alın
2. `.env` dosyasına ekleyin:

```
VITE_FOOTBALL_API_KEY=your-api-key-here
```

3. Sayfa: `/mac-programi` veya `/spor-gundemi` (yönlendirme)

## Özellikler

- Tarih seçici (Bugün, dün, yarın + 4 gün)
- Lig bazlı gruplama (Türkiye, İngiltere, Avrupa)
- Maç saati, ev sahibi, deplasman takımı
- Tamamen güncel veri (API-Football)

## Haber Bölümü

Haber/RSS bölümü kaldırıldı. Sadece maç programı gösterilir.
