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

export const STABIL_FEATURES_DE = [
  'Anti-Freeze v4 Dedicated Server-Infrastruktur',
  '10.000+ Live-TV & Regionalsender (Ohne Ruckler)',
  'Full HD 1080p & Stabiler Live-Stream',
  '48-Stunden Catch-Up & Zeitversetztes Fernsehen',
  'Smart TV, Android, iOS, TV Box & PC 100% Kompatibel',
  '24/7 VIP-Support & Sofortige Aktivierung',
];

export const CINEMA_4K_FEATURES_DE = [
  '15.000+ Filme & Serien (Netflix, HBO, Disney+ VOD)',
  'Echtes 4K UHD & HDR10+ Hohe Bitrate Master-Qualität',
  'Dolby Atmos & 5.1 Raumklang-Audio-Unterstützung',
  'Wöchentlich neue Kinofilme & Mehrsprachige Untertitel',
  'Alle Live-TV-Kanäle + VIP-Highspeed-Kino-Server',
  'Optimiert für OLED, QLED & 4K Smart TVs',
];

export const GLOBAL_FEATURES_DE = [
  'Alle Welt- & Europakanäle (DE, UK, FR, NL, US usw.)',
  'Globales Anycast CDN (Weltweit ohne Latenz)',
  'Internationale Sportsender & Exklusive Turniere',
  'Originalton, Zweikanalton & Mehrsprachige Untertitel',
  'Keine Geoblockaden (Kein VPN erforderlich)',
  'Multi-Geräte-Support für In- & Ausland',
];

export const STATIC_PACKAGES_TR = [
  // 1. Premium Stabil
  { id: 'tr-stabil-3', name: 'Premium Stabil Paket', duration: '3 Ay', price: 750, original_price: 900, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 1 },
  { id: 'tr-stabil-6', name: 'Premium Stabil Paket', duration: '6 Ay', price: 1100, original_price: 1300, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 2 },
  { id: 'tr-stabil-12', name: 'Premium Stabil Paket', duration: '12 Ay', price: 1600, original_price: 1950, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 3 },
  { id: 'tr-stabil-15', name: 'Premium Stabil Paket', duration: '15 Ay', price: 1900, original_price: 2400, tier: 'stabil', features: STABIL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 4 },

  // 2. 4K Ultra İçerik & Sinema (Popüler)
  { id: 'tr-cinema-3', name: '4K Ultra İçerik & Sinema', duration: '3 Ay', price: 950, original_price: 1150, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 5 },
  { id: 'tr-cinema-6', name: '4K Ultra İçerik & Sinema', duration: '6 Ay', price: 1400, original_price: 1700, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 6 },
  { id: 'tr-cinema-12', name: '4K Ultra İçerik & Sinema', duration: '12 Ay', price: 2200, original_price: 2600, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 7 },
  { id: 'tr-cinema-15', name: '4K Ultra İçerik & Sinema', duration: '15 Ay', price: 2600, original_price: 3200, tier: 'cinema', features: CINEMA_4K_FEATURES_TR, popular: true, region: 'tr', enabled: true, currency: '₺', sort_order: 8 },

  // 3. Global & Dünya Kanalları
  { id: 'tr-global-3', name: 'Global & Dünya Kanalları', duration: '3 Ay', price: 1150, original_price: 1350, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 9 },
  { id: 'tr-global-6', name: 'Global & Dünya Kanalları', duration: '6 Ay', price: 1600, original_price: 2000, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 10 },
  { id: 'tr-global-12', name: 'Global & Dünya Kanalları', duration: '12 Ay', price: 2600, original_price: 3100, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 11 },
  { id: 'tr-global-15', name: 'Global & Dünya Kanalları', duration: '15 Ay', price: 3000, original_price: 3800, tier: 'global', features: GLOBAL_FEATURES_TR, popular: false, region: 'tr', enabled: true, currency: '₺', sort_order: 12 },
];

export const STATIC_PACKAGES_EU = [
  // 1. Stabil EU
  { id: 'eu-stabil-3', name: 'Premium Stabil-Paket', duration: '3 Ay', price: 35, original_price: 45, tier: 'stabil', features: STABIL_FEATURES_DE, popular: false, region: 'eu', enabled: true, currency: '€', sort_order: 13 },
  { id: 'eu-stabil-6', name: 'Premium Stabil-Paket', duration: '6 Ay', price: 55, original_price: 70, tier: 'stabil', features: STABIL_FEATURES_DE, popular: false, region: 'eu', enabled: true, currency: '€', sort_order: 14 },
  { id: 'eu-stabil-12', name: 'Premium Stabil-Paket', duration: '12 Ay', price: 85, original_price: 110, tier: 'stabil', features: STABIL_FEATURES_DE, popular: false, region: 'eu', enabled: true, currency: '€', sort_order: 15 },

  // 2. Cinema 4K EU (Beliebteste Wahl)
  { id: 'eu-cinema-3', name: '4K Ultra Kino & VOD', duration: '3 Ay', price: 45, original_price: 55, tier: 'cinema', features: CINEMA_4K_FEATURES_DE, popular: true, region: 'eu', enabled: true, currency: '€', sort_order: 16 },
  { id: 'eu-cinema-6', name: '4K Ultra Kino & VOD', duration: '6 Ay', price: 70, original_price: 85, tier: 'cinema', features: CINEMA_4K_FEATURES_DE, popular: true, region: 'eu', enabled: true, currency: '€', sort_order: 17 },
  { id: 'eu-cinema-12', name: '4K Ultra Kino & VOD', duration: '12 Ay', price: 105, original_price: 135, tier: 'cinema', features: CINEMA_4K_FEATURES_DE, popular: true, region: 'eu', enabled: true, currency: '€', sort_order: 18 },

  // 3. Global EU
  { id: 'eu-global-3', name: 'Global & Weltkanäle', duration: '3 Ay', price: 55, original_price: 70, tier: 'global', features: GLOBAL_FEATURES_DE, popular: false, region: 'eu', enabled: true, currency: '€', sort_order: 19 },
  { id: 'eu-global-6', name: 'Global & Weltkanäle', duration: '6 Ay', price: 85, original_price: 105, tier: 'global', features: GLOBAL_FEATURES_DE, popular: false, region: 'eu', enabled: true, currency: '€', sort_order: 20 },
  { id: 'eu-global-12', name: 'Global & Weltkanäle', duration: '12 Ay', price: 130, original_price: 160, tier: 'global', features: GLOBAL_FEATURES_DE, popular: false, region: 'eu', enabled: true, currency: '€', sort_order: 21 },
];
