
export const defaultData = {
  siteTexts: {
    brandName: "QruzeHD",
    welcomeTitle: "Sınırsız Eğlence Dünyasına Hoş Geldiniz",
    welcomeSubtitle: "Binlerce film, dizi ve canlı kanal en yüksek kalitede ekranlarınızda.",
    heroButtonText: "Hemen Başla",
    heroButtonLink: "/paketler",
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
    footerDescription: "QruzeHD ile yüksek kaliteli yayın hizmetleri, kesintisiz eğlence ve premium içerik dünyasına adım atın."
  },
  heroData: {
    titlePrefix: "QruzeHD",
    titleHighlight: "Premium IPTV",
    description: "Binlerce film, dizi ve canlı kanal keyfi tek platformda. 4K Ultra HD yayın kalitesi ve donmayan altyapı ile tanışın.",
    primaryButtonText: "Hemen Test Et",
    primaryButtonLink: "/test",
    secondaryButtonText: "Paketleri İncele",
    secondaryButtonLink: "/paketler",
    backgroundImage: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop",
    animationEnabled: true
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
    { id: 'channels', label: 'Kanal', baseNumber: 80000 }
  ],
  contactData: {
    phone: "+90 555 123 45 67",
    whatsapp: "905551234567",
    email: "info@qruzehd.com",
    address: "İstanbul, Türkiye",
    telegram: "qruzehd_support",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    instagram: "https://instagram.com/qruzehd",
    twitter: "https://twitter.com/qruzehd",
    facebook: "https://facebook.com/qruzehd"
  },
  seoData: {
    home: {
      title: "QruzeHD - Premium IPTV Hizmeti | 4K ve Donmayan Yayınlar",
      description: "Türkiye'nin en kaliteli IPTV sağlayıcısı. 4K UHD kalitesinde binlerce kanal, film ve dizi. Donma sorunu olmadan kesintisiz TV keyfi.",
      keywords: ["iptv", "premium iptv", "donmayan iptv", "4k iptv", "canlı maç izle", "film izle", "dizi izle", "iptv satın al"]
    },
    faq: {
      title: "SSS | QruzeHD",
      description: "Sıkça sorulan sorular ve cevapları."
    }
  },
  packagesData: {
    turkiye: [
      {
        id: "tr-1",
        title: "1 Aylık Paket",
        duration: "1 Ay",
        price: "150 TL",
        users: "1 Kullanıcı",
        features: ["4K/UHD Yayınlar", "Donmayan Sunucu", "7/24 Destek", "Mobil & Smart TV", "Geri Sarma Özelliği"],
        popular: false
      },
      {
        id: "tr-3",
        title: "3 Aylık Paket",
        duration: "3 Ay",
        price: "350 TL",
        users: "1 Kullanıcı",
        features: ["4K/UHD Yayınlar", "Donmayan Sunucu", "7/24 Destek", "Mobil & Smart TV", "Geri Sarma Özelliği"],
        popular: false
      },
      {
        id: "tr-6",
        title: "6 Aylık Paket",
        duration: "6 Ay",
        price: "600 TL",
        users: "1 Kullanıcı",
        features: ["4K/UHD Yayınlar", "Donmayan Sunucu", "7/24 Destek", "Mobil & Smart TV", "Geri Sarma Özelliği"],
        popular: true
      },
      {
        id: "tr-12",
        title: "12 Aylık Paket",
        duration: "12 Ay",
        price: "1000 TL",
        users: "1 Kullanıcı",
        features: ["4K/UHD Yayınlar", "Donmayan Sunucu", "7/24 Destek", "Mobil & Smart TV", "Geri Sarma Özelliği"],
        popular: false
      },
      {
        id: "eu-package",
        title: "Avrupa Paketi",
        duration: "12 Ay",
        price: "1200 TL",
        users: "1 Kullanıcı",
        features: ["Avrupa Kanalları", "TR + EU Seçeneği", "4K/UHD Yayınlar", "7/24 Destek", "Donmayan Sunucu"],
        popular: false,
        isRegionSelectable: true
      }
    ]
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
  }
};
