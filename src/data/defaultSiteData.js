import { DEFAULT_IPTV_FLOW_DEVICES_DATA } from '@/constants/iptvFlowDevices';
import { DEFAULT_PACKAGES_PAGE_CONTENT } from '@/data/defaultPackagesPageContent';

export const defaultData = {
  siteTexts: {
    brandName: "QruzeTV",
    welcomeTitle: "Sınırsız Eğlence Dünyasına Hoş Geldiniz",
    welcomeSubtitle: "Ulusal kanallar, kesintisiz canlı spor akışı ve zengin tematik yayınlar en yüksek kalitede ekranlarınızda.",
    heroButtonText: "Hemen Başla",
    heroButtonLink: "/paketler/",
    contact: {
      title: "İletişim",
      subtitle: "7/24 Destek Hattı",
      whatsappDesc: "Hızlı yanıt için WhatsApp hattımızdan bize ulaşabilirsiniz.",
      phoneDesc: "Acil durumlar için telefon hattımızdan arayabilirsiniz.",
      emailDesc: "Detaylı bilgi ve teklifler için e-posta gönderebilirsiniz.",
      ctaTitle: "Hemen İletişime Geçin",
      ctaSubtitle: "Size en uygun paketi belirlemek için yardımcı olalım.",
      ctaWhatsappButton: "WhatsApp'tan Yaz",
      ctaCallButton: "Hemen Ara"
    },
    footerDescription: "QruzeTV ile yüksek kaliteli yayın hizmetleri, kesintisiz eğlence ve premium içerik dünyasına adım atın."
  },
  heroData: {
    titlePrefix: "QruzeTV",
    titleHighlight: "Premium IPTV",
    description: "Ulusal kanallar, canlı spor fikstürü ve tematik yayınlar tek platformda. 4K/60FPS seçeneklerini ücretsiz test edin, cihazınıza uygun kurulum desteği alın.",
    primaryButtonText: "Hemen Test Et",
    primaryButtonLink: "/test/",
    secondaryButtonText: "Paketleri İncele",
    secondaryButtonLink: "/paketler/",
    backgroundImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop",
    animationEnabled: true,
    premiumHeroUseCustomBackdrops: true,
    premiumHeroBackdropUrls: [],
    premiumHeroCustomSlideCaption: ''
  },
  globalAlert: {
    enabled: false,
    message: "🎉 Yeni kampanyamızı kaçırmayın! Tüm paketlerde %20 indirim fırsatı.",
    type: "info",
    closable: true
  },
  contentStats: [
    { id: 'users', label: 'Mutlu Müşteri', baseNumber: 1500 },
    { id: 'films', label: 'Film', baseNumber: 49999 },
    { id: 'series', label: 'Dizi', baseNumber: 36852 },
    { id: 'channels', label: 'Kanal', baseNumber: 10000 }
  ],
  contactData: {
    // phone / whatsapp bilerek BOŞ: bu dosya prerender edilmiş HTML'e ve JS
    // bundle'ına giriyor; numara statik çıktıda görünürse spam botları hasat ediyor.
    // Gerçek numara yalnızca runtime'da Supabase'den gelir
    // (admin panel > İletişim Bilgileri). Bkz. src/utils/supportChannel.js
    phone: "",
    whatsapp: "",
    whatsapp_enabled: true,
    whatsapp_message: "Merhaba, paketler hakkında bilgi almak istiyorum.",
    email: "info@qruzetv.com",
    address: "İstanbul, Türkiye",
    telegram: "qruzetv_support",
    telegram_enabled: true,
    telegram_message: "Merhaba, bilgi almak istiyorum.",
    order_channel: "whatsapp",
    floating_actions: {
      enabled: true,
      show_whatsapp: true,
      show_telegram: true,
      show_buy: true,
      show_test: true,
    },
    logoUrl: "/logo.png",
    instagram: "https://instagram.com/qruzetv",
    twitter: "https://twitter.com/qruzetv",
    facebook: "https://facebook.com/qruzetv"
  },
  seoData: {
    home: {
      title: "IPTV Satın Al — 4K Türk Kanalları | QruzeTV",
      description: "Yurt dışından Türk kanallarını izlemek için IPTV satın alın: 10.000+ canlı kanal, 4K/UHD yayın, ücretsiz test ve 7/24 Türkçe destek.",
      keywords: ["iptv", "premium iptv", "4k iptv", "türk kanalları", "film izle", "dizi izle", "iptv satın al"]
    },
    faq: {
      title: "SSS | QruzeTV",
      description: "Sıkça sorulan sorular ve cevapları."
    }
  },
  packagesData: {
    turkiye: [
      {
        id: 'static-tr-3',
        name: '3 AY',
        title: '3 AY',
        duration: '3 Ay',
        price: '750',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı / Tek Giriş',
          'Full HD & Canlı TV Akışı',
          'Tüm Ulusal, Spor & Haber Kanalları',
          'Temel VOD Film ve Dizi Arşivi',
          'Tüm Akıllı Cihazlarla Tam Uyum',
          '7/24 Hızlı WhatsApp Destek',
          'Anında Otomatik Aktivasyon'
        ],
        popular: false
      },
      {
        id: 'static-tr-6',
        name: '6 AY',
        title: '6 AY',
        duration: '6 Ay',
        price: '1100',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı / Tek Giriş',
          'Full HD & 4K UHD Seçenekli Yayın',
          'Tüm Spor Karşılaşmaları (60 FPS)',
          'Genişletilmiş VOD Film & Dizi Arşivi',
          '24 Saat Geri Sarma (Catch-Up)',
          'Smart TV, Android, iOS & PC Desteği',
          '7/24 Kesintisiz Teknik Destek'
        ],
        popular: false
      },
      {
        id: 'static-tr-12-cinema',
        name: '4K Ultra İçerik & Sinema',
        title: '4K Ultra İçerik & Sinema',
        duration: '12 Ay',
        price: '2200',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı (Opsiyonel Çift Giriş)',
          '15.000+ Film & Dizi (Geniş VOD Kütüphanesi)',
          'Gerçek 4K UHD & HDR10+ Yayın',
          'Dolby Atmos & 5.1 Çok Kanallı Ses',
          'Her Hafta Eklenen Yeni Vizyon Filmleri',
          '48 Saat Canlı Geri Sarma & Tekrar İzle',
          '7/24 Kesintisiz VIP Canlı Destek'
        ],
        popular: true
      },
      {
        id: 'static-tr-12-global',
        name: 'Global & Dünya Kanalları',
        title: 'Global & Dünya Kanalları',
        duration: '12 Ay',
        price: '2400',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı (Opsiyonel Çift Giriş)',
          'Tüm Dünya & 50+ Ülke Yayını (Almanya, ABD, UK)',
          'Küresel Anycast CDN Ağı',
          'Uluslararası Spor Kanalları & Özel Turnuvalar',
          'Orijinal Dil, Çift Dil & Altyazı Seçenekleri',
          'Coğrafi Kısıtlamasız Altyapı',
          '7/24 Öncelikli VIP Teknik Destek'
        ],
        popular: true
      },
    ],
    avrupa: [
      {
        id: 'static-eu-3',
        name: '3 Aylık Avrupa Paketi',
        title: '3 Aylık Avrupa Paketi',
        duration: '3 Ay',
        price: '30',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı / Tek Giriş',
          'Avrupa & Türkiye Canlı Kanalları',
          'Full HD Yüksek Kalite Akış',
          'VPN Gerektirmeyen Özel Hatlar',
          'Tüm Cihazlarla Anında Uyum',
          '7/24 WhatsApp Destek'
        ],
        popular: false
      },
      {
        id: 'static-eu-6',
        name: '6 Aylık Avrupa Paketi',
        title: '6 Aylık Avrupa Paketi',
        duration: '6 Ay',
        price: '45',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı / Tek Giriş',
          'Avrupa & Küresel 50+ Ülke Yayını',
          'Full HD & 4K UHD Akış Standartları',
          'Frankfurt (DE-CIX) Doğrudan Peering',
          'VPN Gerektirmeyen Kesintisiz Altyapı',
          '24 Saat Geri Sarma (Catch-Up)',
          '7/24 VIP Destek'
        ],
        popular: false
      },
      {
        id: 'static-eu-12-standard',
        name: '12 Aylık Avrupa Standart',
        title: '12 Aylık Avrupa Standart',
        duration: '12 Ay',
        price: '65',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı (Opsiyonel Çift Giriş: 110€)',
          'Avrupa & Dünya Geneli 50+ Ülke Yayını',
          'Küresel Anycast CDN Altyapısı',
          'VPN Olmadan Kesintisiz & Donmasız Yayın',
          'Tüm Canlı Spor & Tematik Kanallar',
          '48 Saat Geri Sarma (Catch-Up)',
          '7/24 Öncelikli Teknik Destek'
        ],
        popular: false
      },
      {
        id: 'static-eu-12-premium',
        name: '12 Aylık Avrupa 4K Premium',
        title: '12 Aylık Avrupa 4K Premium',
        duration: '12 Ay',
        price: '110',
        users: '1 Kullanıcı',
        features: [
          '1 Kullanıcı (Opsiyonel Çift Giriş: 185€)',
          'Gerçek 4K UHD & 60 FPS Spor Yayınları',
          '15.000+ Film & Dizi Kapsamlı VOD Arşivi',
          'Dolby Atmos & Çok Dilli Ses/Altyazı',
          'Frankfurt & Amsterdam DE-CIX Dedike Hatlar',
          '72 Saat Geri Sarma (Catch-Up)',
          '7/24 Birebir VIP Teknik Destek'
        ],
        popular: true
      },
    ],
  },
  appsData: [
    {
      id: "app-smarters",
      name: "IPTV Smarters Pro",
      description: "En popüler ve kullanıcı dostu IPTV oynatıcısı.",
      platforms: ["smarttv", "ios", "android", "pc", "tablet"],
      recommended: true
    },
    {
      id: "app-siptv",
      name: "Smart IPTV",
      description: "Smart TV'ler için klasik ve stabil oynatıcı.",
      platforms: ["smarttv"],
      recommended: false
    }
  ],
  moviesData: [
    { id: 1, title: "Oppenheimer", genre: "Biyografi, Dram", rating: "8.6", image: "https://images.unsplash.com/photo-1694429936848-eeb39d0591ed" },
    { id: 2, title: "Barbie", genre: "Komedi, Macera", rating: "7.2", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6" }
  ],
  channelsData: [
    { name: "Sports 1", category: "Spor", logoUrl: "https://cdn-icons-png.flaticon.com/512/3363/3363497.png", image_url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e" },
    { name: "News 24", category: "Haber", logoUrl: "https://cdn-icons-png.flaticon.com/512/2965/2965879.png", image_url: "https://images.unsplash.com/photo-1495020689067-958852a7765e" },
    { name: "Movies HD", category: "Sinema", logoUrl: "https://cdn-icons-png.flaticon.com/512/3163/3163478.png", image_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba" },
    { name: "Kids TV", category: "Çocuk", logoUrl: "https://cdn-icons-png.flaticon.com/512/3076/3076134.png", image_url: "https://images.unsplash.com/photo-1560506840-085b12c8e31a" },
    { name: "Docu Life", category: "Belgesel", logoUrl: "https://cdn-icons-png.flaticon.com/512/3026/3026049.png", image_url: "https://images.unsplash.com/photo-1516934825964-b0db4350d750" },
    { name: "Music Hits", category: "Müzik", logoUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075904.png", image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
    { name: "Action Max", category: "Eğlence", logoUrl: "https://cdn-icons-png.flaticon.com/512/3163/3163478.png", image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819" }
  ],
  welcome_images: [
     { id: '1', order: 1, url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop", title: "Sinema Keyfi", description: "En yeni filmler evinizde" }
  ],
  chatBotData: {
      enabled: true,
      welcomeMessage: "Merhaba! Size nasıl yardımcı olabilirim?",
      botName: "Asistan",
      primaryColor: "#9333ea"
  },
  faqData: {
    title: "Sıkça Sorulan Sorular",
    items: [
      { question: "Kurulum ücretli mi?", answer: "Hayır, kurulum tamamen ücretsizdir ve teknik ekibimiz tarafından uzaktan destek ile yapılır." }
    ]
  },
  videos: {
    iptv_nedir: '/videos/iptv.nedir.mp4',
    icerik_bilgisi: '/videos/icerikbilgisi.mp4',
    iptv_nedir_youtube: '',
    icerik_bilgisi_youtube: ''
  },
  /** Admin: /admin/team-logos — maç programı takım logoları */
  team_logos: { entries: [] },
  /** Admin: /admin/iptv-cihazlari — test & sipariş modalı cihaz butonları */
  iptvFlowDevicesData: structuredClone(DEFAULT_IPTV_FLOW_DEVICES_DATA),
  /** Admin: Paketler → Sayfa İçeriği — tier/bölge/SEO metinleri */
  packagesPageContent: structuredClone(DEFAULT_PACKAGES_PAGE_CONTENT),
};
