import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

// Fallback data if DB is empty
const fallbackSteps = [
  {
    title: "Google Play Store'u Açın",
    description: "Android TV cihazınızın ana ekranında bulunan uygulamalar listesinden Google Play Store uygulamasını bulun ve başlatın.",
    image: "https://images.unsplash.com/photo-1689956622251-dedbf3c722a8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Arama Bölümüne Girin",
    description: "Ekranın üst kısmında bulunan büyüteç simgesine (Arama) tıklayın veya kumandanızın sesli arama özelliğini kullanın.",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Bulun",
    description: "Arama çubuğuna 'Downloader', 'IPTV Smarters Pro' veya 'XCIPTV' yazın. Önerilen uygulamamız XCIPTV Player'dır.",
    image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İndirin ve Yükleyin",
    description: "Uygulama sayfasında 'Yükle' (Install) butonuna tıklayın ve indirme işleminin tamamlanmasını bekleyin.",
    image: "https://images.unsplash.com/photo-1605218456194-52d6a0b419e7?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Başlatın",
    description: "Yükleme tamamlandıktan sonra 'Aç' butonuna tıklayarak uygulamayı başlatın. Gerekli izinleri (dosya erişimi vb.) onaylayın.",
    image: "https://images.unsplash.com/photo-1542393545-facac42e67e8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Giriş Yapın",
    description: "Size gönderilen (WhatsApp/Email) Kullanıcı Adı, Şifre ve URL bilgilerini ilgili alanlara eksiksiz olarak girin.",
    image: "https://images.unsplash.com/photo-1616077168712-fc6c788cd4ee?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Kullanıcıyı Ekleyin",
    description: "Bilgileri girdikten sonra 'Add User' veya 'Login' butonuna tıklayın. Profiliniz başarıyla oluşturulacaktır.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İyi Seyirler!",
    description: "Oluşturduğunuz profile tıklayın. Canlı kanallar, filmler ve diziler otomatik olarak yüklenecektir. Artık izlemeye başlayabilirsiniz.",
    image: "https://images.unsplash.com/photo-1522869635100-8f44d480631d?q=80&w=1200&auto=format&fit=crop"
  }
];

const AndroidTVGuide = ({ dbData }) => {
  return (
    <InstallationGuideRenderer 
      data={dbData} 
      fallbackData={{ steps: fallbackSteps }} 
    />
  );
};

export default AndroidTVGuide;