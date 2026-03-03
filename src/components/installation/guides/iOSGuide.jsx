import React from 'react';
import InstallationGuideRenderer from '../InstallationGuideRenderer';

const fallbackSteps = [
  {
    title: "App Store'u Açın",
    description: "iPhone veya iPad cihazınızın ana ekranında bulunan App Store uygulamasını başlatın.",
    image: "https://images.unsplash.com/photo-1700665653601-aab7aebf9e11?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Arama Yapın",
    description: "Sağ alt köşedeki 'Ara' sekmesine tıklayın ve arama çubuğuna 'GSE Smart IPTV' veya 'Smarters Player Lite' yazın.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ce7d94?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Seçin",
    description: "Arama sonuçlarından en yüksek puanlı ve güncel olan uygulamayı seçin. Önerimiz 'Smarters Player Lite' uygulamasıdır.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İndirin",
    description: "'İndir' veya bulut simgesine tıklayarak uygulamayı cihazınıza yükleyin. Face ID veya Touch ID ile onaylayın.",
    image: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Uygulamayı Açın",
    description: "Yükleme tamamlandıktan sonra uygulamayı açın. 'Xtream Codes API' ile giriş seçeneğini seçin.",
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Bilgileri Girin",
    description: "Size sağlanan Yayın Adı (Herhangi bir isim), Kullanıcı Adı, Şifre ve URL bilgilerini kutucuklara girin.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Giriş Yapın",
    description: "'Add User' butonuna tıklayın. Liste başarıyla indirilecektir. Hata alırsanız internet bağlantınızı kontrol edin.",
    image: "https://images.unsplash.com/photo-1481487484168-9b930d5b7d9d?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "İzlemeye Başlayın",
    description: "Live TV, Movies ve Series kategorilerinden dilediğiniz içeriği seçerek yüksek kalitede izlemeye başlayın.",
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=1200&auto=format&fit=crop"
  }
];

const iOSGuide = ({ dbData }) => {
  return (
    <InstallationGuideRenderer 
      data={dbData} 
      fallbackData={{ steps: fallbackSteps }} 
    />
  );
};

export default iOSGuide;