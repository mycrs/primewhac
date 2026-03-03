# Maç İçeriği Cache Kurulumu

## 1. JSON Dosya Cache

İçerikler `public/data/match-contents/` klasöründe JSON dosyaları olarak saklanır. Her maç için: `galatasaray-vs-fenerbahce-2025-03-15.json`

Build sırasında bu dosyalar `dist/` içine kopyalanır, statik olarak sunulur.

## 2. Ön Üretim (Kaydetme)

AI içeriği önceden üretmek için (GEMINI_API_KEY gerekli):

```bash
npm run pregenerate:content
```

Bu komut bugünden itibaren 7 günlük maçlar için içerik üretir ve `public/data/match-contents/` altına kaydeder.

**Deploy öncesi:** `npm run pregenerate:content && npm run build`

**Cron** (her 12 saatte bir):
```
0 */12 * * * cd /path/to/primewhac && npm run pregenerate:content
```

## 3. Akış

1. **Maç listesinden tıklayınca** → Maç verisi state ile geçer, anında açılır (fetch yok)
2. **Doğrudan URL ile** → 6 lig paralel fetch, daha hızlı
3. **İçerik** → Önce `/data/match-contents/{slug}.json` (statik), yoksa şablon
4. **API gerekmez** → Ziyaretçi tarafında sadece statik dosya veya şablon

## 4. Hız

- Maç listesinden tıklama: Anında (state ile geçiş)
- Paralel lig fetch: 6 istek aynı anda
- İçerik: Statik JSON veya şablon, API yok
