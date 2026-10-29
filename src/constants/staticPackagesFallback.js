/** Supabase boş / hata durumunda paket kartları için statik yedek (DB şemasına uyumlu). */

export const STABIL_FEATURES_TR = [
  'Anti-Freeze v4 Yük Dengelemeli Dedicated Altyapı',
  '10.000+ Canlı TV, Ulusal & Tematik Kanal (Sıfır Donma)',
  'Full HD & Yüksek Hızlı Kararlı Yayın Akışı',
  '48 Saat Geri Sar & Tekrar İzle (Catch-Up Desteği)',
  'Smart TV, Android, iOS, TV Box & PC Uyumlu',
  '7/24 Kesintisiz VIP Canlı Destek & Anında Aktivasyon',
];

export const CINEMA_4K_FEATURES_TR = [
  '15.000+ Film & Dizi (Netflix, HBO, Disney+ VOD Kütüphanesi)',
  'Gerçek 4K UHD & HDR10+ Yüksek Bitrate Master Yayınlar',
  'Dolby Atmos & 5.1 Çok Kanallı Çevresel Ses Desteği',
  'Her Hafta Eklenen Yeni Vizyon Filmleri & Dublaj/Altyazı',
  'Tüm Canlı TV Kanalları + VIP Hızlı Sinema Sunucusu',
  'OLED, QLED & 4K Smart TVler İçin Özel Optimize',
];

export const GLOBAL_FEATURES_TR = [
  'Tüm Dünya & Avrupa Kanalları (Almanya, UK, Fransa, Hollanda vb.)',
  'Küresel Anycast CDN (Dünyanın Her Yerinde Sıfır Gecikme)',
  'Uluslararası Spor Kanalları & Özel Turnuva Yayınları',
  'Orijinal Dil, Çift Dil & Çok Dilli Altyazı Desteği',
  'Coğrafi Kısıtlamasız (VPN Gerektirmez) Kesintisiz Erişim',
  'Yurt Dışı & Yurt İçi Çoklu Cihaz Desteği',
];

export const EU_FEATURES_STANDART = [
  '1 Kullanıcı',
  'Tüm Türk & Avrupa Kanalları',
  'Full HD ve 4K Canlı Yayınlar',
  'Geniş Film ve Dizi VOD Arşivi',
  'Donmayan Avrupa CDN Altyapısı',
  'Smart TV, Android, iOS, TV Box & PC Uyumlu',
  '7/24 Kesintisiz Teknik Destek'
];

export const EU_FEATURES_VIP = [
  '2 Cihaz / Çift Kullanıcı Desteği',
  'Gerçek 4K UHD & HDR Sinema Arşivi',
  'Tüm Avrupa, Almanya, İngiltere & Dünya Kanalları',
  'Uluslararası Canlı Spor ve Turnuva Yayınları',
  'VIP Hızlı Master Sunucu (Sıfır Gecikme)',
  'Dolby Audio Ses Kalitesi',
  '7/24 Öncelikli VIP Teknik Destek'
];

export const STATIC_PACKAGES_TR = [
  // 1. Premium Stabil: 1150, 1600, 2200, 2600
  { id: 'tr-stabil-3', name: 'Premium Stabil Paket', duration: '3 Ay', price: 1150, original_price: 1300, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 1 },
  { id: 'tr-stabil-6', name: 'Premium Stabil Paket', duration: '6 Ay', price: 1600, original_price: 1800, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 2 },
  { id: 'tr-stabil-12', name: 'Premium Stabil Paket', duration: '12 Ay', price: 2200, original_price: 2600, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 3 },
  { id: 'tr-stabil-15', name: 'Premium Stabil Paket', duration: '15 Ay', price: 2600, original_price: 3200, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 4 },

  // 2. 4K Ultra İçerik & Sinema: 1150, 1600, 2200, 2600 (Popüler)
  { id: 'tr-cinema-3', name: '4K Ultra İçerik & Sinema', duration: '3 Ay', price: 1150, original_price: 1300, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 5 },
  { id: 'tr-cinema-6', name: '4K Ultra İçerik & Sinema', duration: '6 Ay', price: 1600, original_price: 1800, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 6 },
  { id: 'tr-cinema-12', name: '4K Ultra İçerik & Sinema', duration: '12 Ay', price: 2200, original_price: 2600, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 7 },
  { id: 'tr-cinema-15', name: '4K Ultra İçerik & Sinema', duration: '15 Ay', price: 2600, original_price: 3200, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 8 },

  // 3. Global & Dünya Kanalları: 1300, 1750, 2400, 2800
  { id: 'tr-global-3', name: 'Global & Dünya Kanalları', duration: '3 Ay', price: 1300, original_price: 1500, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 9 },
  { id: 'tr-global-6', name: 'Global & Dünya Kanalları', duration: '6 Ay', price: 1750, original_price: 2100, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 10 },
  { id: 'tr-global-12', name: 'Global & Dünya Kanalları', duration: '12 Ay', price: 2400, original_price: 2900, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 11 },
  { id: 'tr-global-15', name: 'Global & Dünya Kanalları', duration: '15 Ay', price: 2800, original_price: 3400, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 12 },
];

export const STATIC_PACKAGES_EU = [
  // 1. 12 Aylık Avrupa Paketi - 85 Euro (1 Cihaz)
  {
    id: 'eu-standard-85',
    name: '12 Aylık Avrupa Paketi',
    duration: '12 Ay',
    price: 85,
    original_price: 110,
    tier: 'standard',
    features: EU_FEATURES_STANDART,
    popular: false,
    region: 'eu',
    enabled: true,
    currency: '€',
    sort_order: 13,
    campaign_label: '1 Cihaz • 85€',
  },
  // 2. 12 Aylık VIP 4K & Çift Kullanıcı - 100 Euro (2 Cihaz - Popüler)
  {
    id: 'eu-vip-100',
    name: '12 Aylık VIP 4K & Çift Kullanıcı',
    duration: '12 Ay',
    price: 100,
    original_price: 135,
    tier: 'cinema',
    features: EU_FEATURES_VIP,
    popular: true,
    region: 'eu',
    enabled: true,
    currency: '€',
    sort_order: 14,
    campaign_label: '2 Cihaz • 100€',
  },
];
