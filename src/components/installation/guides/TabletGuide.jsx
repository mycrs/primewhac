import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const fallbackSteps = [
  {
    title: "Uygulama Mağazasını Açın",
    description: "Tabletin markasına göre Play Store (Android) veya App Store (iPad) uygulamasını açın.",
    image: "https://images.unsplash.com/photo-1700665653601-aab7aebf9e11?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulama Arayın",
    description: "Arama çubuğuna 'IPTV Smarters Pro' veya 'XCIPTV Player' yazın.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bbc7c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Bulun",
    description: "Sonuçlardan en popüler olan uygulamayı seçin.",
    image: "https://images.unsplash.com/photo-1551651766-0639412d2509?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İndirin",
    description: "'Yükle' veya 'İndir' butonuna basarak kurulumu başlatın.",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Açın",
    description: "Kurulum bitince uygulamayı açın ve gerekli izinleri verin.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Xtream Codes API",
    description: "Giriş seçeneklerinden 'Login with Xtream Codes API' olanı seçin.",
    image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Bilgileri Girin",
    description: "Kullanıcı adı, şifre ve URL bilgilerini girerek 'Add User' butonuna tıklayın.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İyi Seyirler",
    description: "Tabletinizden dilediğiniz yerde yayınları izlemeye başlayabilirsiniz.",
    image: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d9d?q=80&w=1200&auto=format&fit=crop"
  }
];

const TabletGuide = ({ dbData }) => {
  return (
    <InstallationGuideRenderer 
      data={dbData} 
      fallbackData={{ steps: fallbackSteps }} 
    />
  );
};

export default TabletGuide;