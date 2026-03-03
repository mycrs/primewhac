import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const fallbackSteps = [
  {
    title: "Web Tarayıcısını Açın",
    description: "Bilgisayarınızda Chrome, Edge veya Firefox tarayıcısını açın.",
    image: "https://images.unsplash.com/photo-1584724478296-0dc4cd63b572?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulama İndirin",
    description: "IPTV Smarters Pro PC sürümünü veya VLC Media Player'ı resmi web sitesinden indirin.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Kurulum Dosyasını Çalıştırın",
    description: "İndirilen .exe uzantılı dosyaya çift tıklayın ve kurulum sihirbazını başlatın.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Kurulumu Tamamlayın",
    description: "'Next' butonlarına tıklayarak kurulumu tamamlayın ve 'Finish' diyerek uygulamayı başlatın.",
    image: "https://images.unsplash.com/photo-1606778303083-7369550943c1?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Giriş Yöntemi",
    description: "Uygulama açıldığında 'Login with Xtream Codes API' seçeneğini seçin. Bu en stabil yöntemdir.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Bilgileri Girin",
    description: "Size gönderilen Kullanıcı Adı, Şifre ve URL bilgilerini ilgili alanlara yapıştırın.",
    image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Kanalları Yükleyin",
    description: "Giriş yaptıktan sonra kanalların ve içeriklerin yüklenmesini bekleyin. Bu işlem internet hızınıza göre 1-2 dakika sürebilir.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İyi Seyirler",
    description: "Sol menüden Live TV (Canlı Yayınlar) veya VOD (Filmler) seçerek izlemeye başlayabilirsiniz.",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1200&auto=format&fit=crop"
  }
];

const WindowsPCGuide = ({ dbData }) => {
  return (
    <InstallationGuideRenderer 
      data={dbData} 
      fallbackData={{ steps: fallbackSteps }} 
    />
  );
};

export default WindowsPCGuide;