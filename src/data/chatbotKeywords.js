/**
 * IPTV satıcısı için kapsamlı chatbot anahtar kelimeleri.
 * Müşteri soruları, yazım hataları, kısaltmalar dahil.
 * Virgülle ayrılmış kelimelerden biri mesajda geçerse cevap tetiklenir.
 */

export const CHATBOT_DEFAULT_KEYWORDS = [
  // === PAKET / FİYAT / ÜCRET ===
  {
    keyword: 'paket, paketler, fiyat, fiyatlar, ücret, ücretler, ne kadar, kaç para, fiyatı, paket fiyatı, abonelik ücreti, aylık ne kadar, yıllık fiyat, 1 aylık, 3 aylık, 12 aylık, pkt, pkts, paketler ne kadar, fiyat listesi, fiyat bilgisi',
    response: 'Paketlerimiz ve güncel fiyatlar için Paketler sayfamızı inceleyebilirsiniz. 1 aylık, 3 aylık ve 12 aylık seçeneklerimiz mevcuttur. Uzun süreli paketlerde indirim uygulanmaktadır.',
    redirect_url: '/paketler/',
  },
  {
    keyword: 'abonelik, abone olmak, abone ol, nasıl abone, satın al, satın alma, almak istiyorum, sipariş, sipariş vermek',
    response: 'Abone olmak için Paketler sayfamızdan size uygun paketi seçin. Ödeme sonrası hesap bilgileriniz e-posta veya WhatsApp ile iletilecektir.',
    redirect_url: '/paketler/',
  },
  {
    keyword: 'indirim, kampanya, promosyon, özel fiyat, ucuz, ekonomik, avantajlı',
    response: '12 aylık paketlerde en avantajlı fiyatlar geçerlidir. Güncel kampanyalar için Paketler sayfamızı kontrol edebilirsiniz.',
    redirect_url: '/paketler/',
  },

  // === KURULUM ===
  {
    keyword: 'kurulum, kurulum yardımı, nasıl kurulur, kurulum rehberi, kurulum nasıl, nasıl kurarım, kurulum yapmak, kurulum adımları, kurulum talimatı, setup, set up, kurulum ücretsiz mi',
    response: 'Kurulum tamamen ücretsizdir. Kurulum rehberimizde Smart TV, Android, iOS, MAG ve diğer cihazlar için adım adım talimatlar bulabilirsiniz. Teknik ekibimiz uzaktan destek de sağlamaktadır.',
    redirect_url: '/kurulum/',
  },
  {
    keyword: 'smart tv, samsung, lg, televizyon, tv kurulum, televizyonda nasıl',
    response: 'Smart TV kurulumu için rehberimizi inceleyin. Samsung, LG ve diğer markalar için ayrı adımlar mevcuttur. Gerekirse WhatsApp üzerinden görüntülü destek veriyoruz.',
    redirect_url: '/kurulum/',
  },
  {
    keyword: 'android, android tv, telefon, tablet kurulum',
    response: 'Android cihazlar için IPTV kurulumu oldukça basittir. Kurulum sayfamızdan uygulama indirme linki ve adımları bulabilirsiniz.',
    redirect_url: '/kurulum/',
  },
  {
    keyword: 'mag, mag box, stb, set top box, kutu',
    response: 'MAG ve STB cihazlar için portal adresi ve kurulum bilgileri hesabınızla birlikte gönderilir. Detaylı kurulum rehberi sitemizde mevcuttur.',
    redirect_url: '/kurulum/',
  },
  {
    keyword: 'm3u, m3u link, m3u url, m3u dosyası, m3u oluştur',
    response: 'M3U linkiniz hesap oluşturulduktan sonra size iletilecektir. M3U dönüştürücü aracımızı da kullanabilirsiniz.',
    redirect_url: '/m3u-converter/',
  },

  // === ÖDEME ===
  {
    keyword: 'ödeme, ödeme yöntemi, nasıl ödeme, ne ile ödeyebilirim, kredi kartı, banka kartı, havale, eft, papara, paypal, kripto, bitcoin',
    response: 'Kredi kartı, havale/EFT, Papara ve diğer ödeme yöntemleri kabul edilmektedir. Ödeme detayları paket seçiminizden sonra gösterilir. Güvenli ödeme altyapısı kullanıyoruz.',
    redirect_url: null,
  },
  {
    keyword: 'taksit, taksitli ödeme, taksit imkanı',
    response: 'Kredi kartı ile taksit imkanı mevcuttur. Banka kampanyalarına göre 2, 3 veya daha fazla taksit seçenekleri sunulmaktadır.',
    redirect_url: null,
  },
  {
    keyword: 'fatura, fatura kesilir mi, fatura alabilir miyim',
    response: 'E-fatura veya e-arşiv fatura talep edebilirsiniz. Ödeme sonrası fatura bilgilerinizi iletebilirsiniz.',
    redirect_url: null,
  },

  // === TEST / DENEME ===
  {
    keyword: 'test, deneme, ücretsiz test, deneme paketi, denemek istiyorum, önce denemek, test süresi, trial, free trial',
    response: 'Ücretsiz test paketimizi deneyebilirsiniz. Test süresi ve koşulları için Paketler sayfamızı ziyaret edin. Memnun kalmazsanız ödeme yapmadan ayrılabilirsiniz.',
    redirect_url: '/paketler/',
  },

  // === MAÇ / SPOR ===
  {
    keyword: 'maç, maç programı, fikstür, futbol, maç saatleri, karşılaşma',
    response: 'Maç programı sayfamızda günlük fikstürü ve başlama saatlerini görebilirsiniz. Tarih çubuğundan istediğiniz günü seçerek o günün karşılaşmalarını listeleyebilirsiniz.',
    redirect_url: '/mac-programi/',
  },
  {
    keyword: 'kanal kategorileri, kategoriler, içerik kategorileri',
    response: 'Paketlerimizde canlı TV, film ve dizi kategorileri, belgesel, çocuk ve müzik içerikleri yer alır. 4K/UHD seçenekleri ve çoklu cihaz desteği mevcuttur.',
    redirect_url: '/channels/',
  },

  // === KANAL ===
  {
    keyword: 'kanal, kanallar, kanal listesi, kaç kanal, hangi kanallar, kanal sayısı, kanallar neler',
    response: '10.000+ kanal sunuyoruz: yerli ve yabancı TV, spor, film, dizi, belgesel, çocuk kanalları. Tam kanal listesi için Kanallar sayfamızı inceleyebilirsiniz.',
    redirect_url: '/channels/',
  },
  {
    keyword: 'türk kanalları, yerli kanallar, trt, atv, show tv, star, fox',
    response: 'Tüm Türk kanalları (TRT, ATV, Show TV, Star, Fox vb.) paketlerimizde mevcuttur. Yerel kanallar da dahildir.',
    redirect_url: '/channels/',
  },
  {
    keyword: 'yabancı kanallar, ingiliz, almanca, fransız kanallar',
    response: 'İngilizce, Almanca, Fransızca ve diğer dillerde yüzlerce yabancı kanal sunuyoruz. Avrupa ve Amerika kanalları dahildir.',
    redirect_url: '/channels/',
  },

  // === KALİTE / 4K / HD ===
  {
    keyword: '4k, 4k uhd, uhd, full hd, hd, kalite, yayın kalitesi, çözünürlük, görüntü kalitesi',
    response: '4K UHD ve Full HD kalitede yayın sunuyoruz. İnternet hızınıza göre en uygun kalite otomatik seçilir. Minimum 10 Mbps önerilir.',
    redirect_url: null,
  },
  {
    keyword: 'donma, donuyor, kesiliyor, takılıyor, sızıntı, buffering, yavaş',
    response: 'Sunucularımız yüksek kapasiteli ve stabil çalışmaktadır. Donma yaşarsanız: 1) İnternet hızınızı kontrol edin (min 10 Mbps) 2) WiFi yerine kablolu bağlantı deneyin 3) Destek ekibimize yazın, uzaktan kontrol edelim.',
    redirect_url: null,
  },
  {
    keyword: 'internet hızı, hız gereksinimi, kaç mbps, minimum hız',
    response: 'HD için minimum 10 Mbps, 4K için 25+ Mbps internet hızı önerilir. Kablolu bağlantı daha stabil olur.',
    redirect_url: null,
  },

  // === IPTV NEDİR ===
  {
    keyword: 'iptv nedir, iptv ne, iptv ne işe yarar, iptv açıklama, iptv tanım, ıptv nedir, ip tv nedir',
    response: 'IPTV (Internet Protocol Television), internet üzerinden TV kanallarını izlemenizi sağlayan bir hizmettir. Klasik uydu/anten yerine internet bağlantısı kullanır. 10.000+ kanal, film ve dizi tek abonelikle.',
    redirect_url: null,
  },
  {
    keyword: 'yasal mı, yasal, legal, güvenli mi, güvenilir mi',
    response: 'Hizmetimiz yasal lisanslı içerik sağlayıcılarla çalışmaktadır. Ödeme ve kişisel verileriniz güvenli altyapı ile korunmaktadır.',
    redirect_url: null,
  },

  // === DESTEK / İLETİŞİM ===
  {
    keyword: 'destek, yardım, iletişim, nasıl ulaşırım, nereye yazacağım, whatsapp, telefon, mail, e-posta, müşteri hizmetleri',
    response: 'WhatsApp veya sitemizdeki iletişim formu üzerinden bize ulaşabilirsiniz. Destek ekibimiz 7/24 yanıt vermektedir. Hızlı çözüm için WhatsApp tercih edin.',
    redirect_url: null,
  },
  {
    keyword: 'sorun, problem, hata, çalışmıyor, açılmıyor',
    response: 'Sorun yaşıyorsanız WhatsApp üzerinden bize ulaşın. Teknik ekibimiz uzaktan bağlanarak sorununuzu çözebilir. Hesap bilgilerinizi de kontrol ederiz.',
    redirect_url: null,
  },
  {
    keyword: 'sss, sıkça sorulan, sık sorulan sorular, faq',
    response: 'Sıkça sorulan sorular ve detaylı cevaplar için SSS sayfamızı ziyaret edin.',
    redirect_url: '/sss/',
  },

  // === HESAP / GİRİŞ ===
  {
    keyword: 'hesap, kullanıcı adı, şifre, giriş bilgileri, username, password, nasıl giriş',
    response: 'Hesap bilgileriniz (kullanıcı adı, şifre, M3U link) ödeme onayından sonra e-posta veya WhatsApp ile iletilir. Giriş yapamıyorsanız destek ekibimize yazın.',
    redirect_url: null,
  },
  {
    keyword: 'şifremi unuttum, şifre sıfırlama, hesap sıfırlama',
    response: 'Şifre veya hesap sorunları için WhatsApp üzerinden bize ulaşın. Kimlik doğrulaması sonrası hesabınızı güncelleyebiliriz.',
    redirect_url: null,
  },
  {
    keyword: 'cihaz sınırı, kaç cihaz, birden fazla cihaz, aynı anda izleme',
    response: 'Paketlere göre eşzamanlı cihaz sayısı değişir. Detaylar için Paketler sayfamızı inceleyin. Genelde 1-2 cihaz aynı anda desteklenir.',
    redirect_url: '/paketler/',
  },

  // === İPTAL / İADE ===
  {
    keyword: 'iptal, iptal etmek, abonelik iptali, nasıl iptal',
    response: 'Aboneliğinizi iptal etmek isterseniz destek ekibimize yazın. Otomatik yenileme yapmıyoruz; süre bitince hesap kapanır. Zorunlu sözleşme yok.',
    redirect_url: null,
  },
  {
    keyword: 'iade, para iadesi, geri ödeme, refund',
    response: 'İade politikamız hakkında detaylı bilgi için destek ekibimize yazın. Memnuniyetsizlik durumunda değerlendirme yapılmaktadır.',
    redirect_url: null,
  },

  // === VOD / FİLM / DİZİ ===
  {
    keyword: 'film, dizi, vod, video on demand, film izle, dizi izle, ne izlesem',
    response: 'Binlerce film ve dizi VOD kütüphanemizde mevcuttur. Ne İzlesem sayfamızdan güncel önerileri görebilirsiniz.',
    redirect_url: '/ne-izlesem/',
  },

  // === VPN / ERİŞİM ===
  {
    keyword: 'vpn, vpn gerekli mi, vpn kullanmalı mıyım',
    response: 'Türkiye içi kullanımda VPN gerekmez. Yurtdışındaysanız veya erişim sorunu yaşıyorsanız VPN kullanabilirsiniz.',
    redirect_url: null,
  },

  // === YAZIM HATALARI / KISALTMALAR ===
  {
    keyword: 'pkt, pkts, fyt, ucret, ucretler, kurulm, kurulumu, odeme, odeme yontemi',
    response: 'Paketler ve fiyatlar için /paketler, kurulum için /kurulum sayfamızı ziyaret edin. Detaylı bilgi için WhatsApp üzerinden de yazabilirsiniz.',
    redirect_url: '/paketler/',
  },
  {
    keyword: 'merhaba, selam, meraba, mrb, slm, iyi günler, günaydın',
    response: 'Merhaba! Size nasıl yardımcı olabilirim? Paketler, kurulum, ödeme veya başka bir konuda sorunuz varsa yazabilirsiniz.',
    redirect_url: null,
  },
  {
    keyword: 'teşekkür, sağol, saol, tşk, eyvallah',
    response: 'Rica ederim! Başka bir sorunuz olursa buradayız. İyi seyirler!',
    redirect_url: null,
  },

  // === EK KONULAR ===
  {
    keyword: 'bayi, bayilik, toplu satış, toplu alım, iş ortağı',
    response: 'Bayilik ve toplu satış programımız hakkında bilgi için Reseller sayfamızı inceleyebilir veya destek ekibimize yazabilirsiniz.',
    redirect_url: '/reseller/',
  },
  {
    keyword: 'yenileme, abonelik yenileme, süre uzatma, uzatmak',
    response: 'Aboneliğinizi yenilemek için aynı paketi tekrar satın alabilir veya destek ekibimize yazarak süre uzatması yapabilirsiniz.',
    redirect_url: null,
  },
  {
    keyword: 'güncelleme, uygulama güncellemesi, yeni sürüm',
    response: 'Uygulamalar kendi mağazalarından güncellenir. Sunucu tarafında güncelleme gerektiğinde sizi bilgilendiririz.',
    redirect_url: null,
  },
  {
    keyword: 'çalışmıyor, açılmıyor, bağlanamıyorum, hata veriyor',
    response: 'Önce internet bağlantınızı kontrol edin. Sorun devam ederse WhatsApp üzerinden bize ulaşın; uzaktan kontrol ile çözüm sağlayabiliriz.',
    redirect_url: null,
  },
  {
    keyword: 'geç ödeme, ödemeyi geç yaptım, geç kaldım',
    response: 'Ödeme gecikmesinde hesabınız askıya alınmış olabilir. Ödemenizi yaptıktan sonra destek ekibimize yazın, hesabınızı hemen aktif edelim.',
    redirect_url: null,
  },
  {
    keyword: 'iptv, iptv satın al, iptv almak, iptv abone',
    response: 'IPTV aboneliği için Paketler sayfamızdan size uygun paketi seçin. Ücretsiz test imkanı da mevcuttur.',
    redirect_url: '/paketler/',
  },
];
