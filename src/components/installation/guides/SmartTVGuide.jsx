import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const fallbackSteps = [
  {
    title: "TV'nizi Açın ve Mağazaya Girin",
    description: "Samsung (Tizen) veya LG (WebOS) televizyonunuzun uygulama mağazasını (Content Store / Smart Hub) açın.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulama Arayın",
    description: "Arama bölümüne 'IBO Player', 'Duplex Play' veya 'Smart IPTV' yazın. IBO Player önerilir.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Yükleyin",
    description: "Uygulamayı seçin ve 'Yükle' butonuna basarak televizyonunuza indirin.",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "MAC Adresini Alın",
    description: "Uygulamayı açtığınızda ekranda 'Device ID' ve 'Device Key' (veya MAC Address) görünecektir. Bu bilgileri not alın.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Bize İletin veya Yükleyin",
    description: "Bu bilgileri bize WhatsApp üzerinden iletin, kurulumu biz yapalım. Veya uygulamanın web sitesinden kendiniz yükleyin.",
    image: "https://images.unsplash.com/photo-1587560699334-cc4da63c24b9?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Yenileyin",
    description: "Kurulum yapıldıktan sonra TV kumandanızdan uygulamanın 'Reload' veya 'Refresh' tuşuna basın.",
    image: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Playlisti Kontrol Edin",
    description: "Kanal listenizin yüklendiğini göreceksiniz. 'Live TV' bölümüne girerek kontrol edin.",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İyi Seyirler",
    description: "Smart TV kurulumunuz tamamlandı. Keyifli seyirler dileriz.",
    image: "https://images.unsplash.com/photo-1522869635100-8f44d480631d?q=80&w=1200&auto=format&fit=crop"
  }
];

const SmartTVGuide = ({ dbData }) => {
  return (
    <InstallationGuideRenderer 
      data={dbData} 
      fallbackData={{ steps: fallbackSteps }} 
    />
  );
};

export default SmartTVGuide;