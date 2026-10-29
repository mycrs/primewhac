export const defaultChatbot = {
  enabled: true,
  title: "QruzeTV Yardımcı Bot",
  welcomeMessage: "Merhaba! Size nasıl yardımcı olabilirim? Paketler, kurulum veya diğer konular hakkında soru sorabilirsiniz.",
  inputPlaceholder: "Mesajınızı buraya yazın...",
  qna: [
    { 
      id: 1, 
      question: "paket, paketler, fiyat, fiyatlar, üyelik, satın al", 
      answer: "Tüm güncel paketlerimizi ve fiyatlarımızı görmek için menüden 'PAKETLER' sayfasını ziyaret edebilirsiniz. Size en uygun paketi seçip hemen satın alabilirsiniz." 
    },
    { 
      id: 2, 
      question: "kurulum, nasıl kurarım, kurmak, yükleme, ayarlar", 
      answer: "Cihazınıza nasıl kurulum yapacağınızı öğrenmek için menüdeki 'KURULUM' sayfamızı ziyaret edebilirsiniz. Orada tüm platformlar için adım adım rehberler bulunmaktadır." 
    },
    { 
      id: 3, 
      question: "test, deneme, denemek istiyorum", 
      answer: "Ücretsiz deneme yayını için /test sayfasındaki formu doldurmanız yeterli. Ekip arkadaşlarımız hemen sizinle iletişime geçer."
    },
    { 
      id: 4, 
      question: "iletişim, whatsapp, telefon, müşteri hizmetleri", 
      answer: "Bize /paketler sayfasındaki sipariş formu veya /test sayfasındaki deneme formu üzerinden 7/24 ulaşabilirsiniz."
    }
  ]
};