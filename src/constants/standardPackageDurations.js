/**
 * Tüm paket gruplarına tek tıkla eklenecek standart süreler (gün = yaygın IPTV pratiği).
 * 3·6·9 ay ≈ 30 günlük ay; 12 takvim yılı; 15 → 450 gün (15×30); 24 → 730 gün (2×365).
 */
export const STANDARD_PACKAGE_DURATION_TEMPLATES = [
  { name: '3 Ay', days: 90, sort_order: 1, price: 0 },
  { name: '6 Ay', days: 180, sort_order: 2, price: 0 },
  { name: '9 Ay', days: 270, sort_order: 3, price: 0 },
  { name: '12 Ay', days: 365, sort_order: 4, price: 0 },
  { name: '15 Ay', days: 450, sort_order: 5, price: 0 },
  { name: '24 Ay', days: 730, sort_order: 6, price: 0 },
];
