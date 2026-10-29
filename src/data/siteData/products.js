export const defaultProducts = {
    moviesData: [
        { id: 1, title: "Aşk Aaj Kal", rating: "8.5", genre: "Romantik", image: "https://images.unsplash.com/photo-1610616817237-dff4b556cce6?q=80&w=200", releaseDate: "2020" },
        { id: 2, title: "Yakaloci", rating: "9.2", genre: "Aksiyon", image: "https://images.unsplash.com/photo-1594904533828-78a51563a653?q=80&w=200", releaseDate: "2023" },
        { id: 3, title: "Killers of the Flower Moon", rating: "8.8", genre: "Drama", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200", releaseDate: "2023" },
        { id: 4, title: "The Batman", rating: "9.0", genre: "Aksiyon", image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=200", releaseDate: "2022" },
        { id: 5, title: "Dune: Part Two", rating: "9.4", genre: "Bilim Kurgu", image: "https://images.unsplash.com/photo-1608178388331-01c9b655a536?q=80&w=200", releaseDate: "2024" },
        { id: 6, title: "Oppenheimer", rating: "9.6", genre: "Biyografi", image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?q=80&w=200", releaseDate: "2023" },
        { id: 7, title: "Barbie", rating: "8.0", genre: "Komedi", image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=200", releaseDate: "2023" },
        { id: 8, title: "Poor Things", rating: "8.5", genre: "Fantastik", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200", releaseDate: "2023" },
        { id: 9, title: "Spider-Man: Across the Spider-Verse", rating: "9.5", genre: "Animasyon", image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=200", releaseDate: "2023" }
    ],
    // Telif temizliği: üçüncü taraf kanal markaları ve logoları kaldırıldı.
    // Bu dizi yalnızca Supabase erişilemediğinde gösterilen jenerik kategori fallback'idir.
    // logoUrl bilinçli olarak yok — kartlar isim/baş harf görünümüne düşer.
    channelsData: [
        { id: 1, name: "Ulusal Kanallar", category: "Ulusal", country: "TR" },
        { id: 2, name: "Haber", category: "Haber", country: "TR" },
        { id: 3, name: "Dizi", category: "Dizi", country: "TR" },
        { id: 4, name: "Film", category: "Film", country: "TR" },
        { id: 5, name: "Belgesel", category: "Belgesel", country: "TR" },
        { id: 6, name: "Çocuk", category: "Çocuk", country: "TR" },
        { id: 7, name: "Müzik", category: "Müzik", country: "TR" },
        { id: 8, name: "Yaşam", category: "Yaşam", country: "TR" },
        { id: 9, name: "Kültür", category: "Kültür", country: "TR" },
        { id: 10, name: "4K / UHD", category: "4K", country: "TR" },
        { id: 11, name: "Uluslararası", category: "Uluslararası", country: "INT" },
        { id: 12, name: "Almanca Kanallar", category: "Uluslararası", country: "DE" }
    ],
    packagesData: {
        turkiye: [
          { id: 'tr1', duration: '3 AY', price: '₺600', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 3 Aylık Türkiye Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'tr2', duration: '6 AY', price: '₺900', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 6 Aylık Türkiye Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'tr3', duration: '12 AY', price: '₺1400', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: true, whatsappMessage: "Merhaba, 12 Aylık Türkiye Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'tr4', duration: '12 AY', price: '₺2200', users: '2 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 12 Aylık 2 Kullanıcılı Türkiye Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'tr5', duration: '24 AY', price: '₺2600', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 24 Aylık Türkiye Kaliteli IPTV paketiyle ilgileniyorum." }
        ],
        avrupa: [
          { id: 'av1', duration: '3 AY', price: '€35', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 3 Aylık Avrupa Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'av2', duration: '6 AY', price: '€60', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: true, whatsappMessage: "Merhaba, 6 Aylık Avrupa Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'av3', duration: '12 AY', price: '€100', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 12 Aylık Avrupa Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'av4', duration: '12 AY', price: '€150', users: '2 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 12 Aylık 2 Kullanıcılı Avrupa Kaliteli IPTV paketiyle ilgileniyorum." },
          { id: 'av5', duration: '24 AY', price: '€180', users: '1 KULLANICI', enabled: true, features: ["Kararlı Yayın İçin Optimize Edilmiş Altyapı", "Full HD, 4K UHD Kaliteli Yayınlar", "+18.000 Canlı TV Kanalı", "Sürekli Güncellenen Film ve Dizi Arşivi", "Tüm Spor, Belgesel ve Çocuk Kanalları", "7/24 Anında Teknik Destek", "Tüm Cihazlarla Uyumlu", "Anında Aktivasyon"], popular: false, whatsappMessage: "Merhaba, 24 Aylık Avrupa Kaliteli IPTV paketiyle ilgileniyorum." }
        ]
    }
};
