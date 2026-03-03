import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const fallbackSteps = [
  {
    title: "App Store'u Açın",
    description: "Mac bilgisayarınızda App Store uygulamasını açın.",
    image: "https://images.unsplash.com/photo-1680012179263-bf70ff6d4c55?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulama Arayın",
    description: "Arama çubuğuna 'IPTV Smarters Pro' veya 'GSE Smart IPTV' yazın.",
    image: "https://images.unsplash.com/photo-1531297461136-82lw9z1s19?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İndirin",
    description: "Uygulamayı indirmek için 'Get' veya bulut simgesine tıklayın.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Başlatın",
    description: "Launchpad'den veya Uygulamalar klasöründen indirdiğiniz uygulamayı açın.",
    image: "https://images.unsplash.com/photo-1527690789675-4ea7d8f69428?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Xtream Codes Girişi",
    description: "Giriş ekranında 'Xtream Codes API' seçeneğini seçin.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Bilgileri Girin",
    description: "Size WhatsApp üzerinden iletilen kullanıcı adı, şifre ve sunucu URL adresini girin.",
    image: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Oturum Açın",
    description: "Bilgileri kontrol ettikten sonra 'Login' butonuna basın.",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İyi Seyirler",
    description: "Kurulum tamamlandı. Artık Mac bilgisayarınızdan tüm yayınları izleyebilirsiniz.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop"
  }
];

const MacGuide = ({ dbData }) => {
  return (
    <InstallationGuideRenderer 
      data={dbData} 
      fallbackData={{ steps: fallbackSteps }} 
    />
  );
};

export default MacGuide;