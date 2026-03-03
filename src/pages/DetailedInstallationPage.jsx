import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { seoMetadata } from '@/data/seoMetadata';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const DetailedInstallationPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Detaylı IPTV Rehberleri | Kurulum, Sorun Giderme, Eğitim",
    description: "IPTV detaylı rehberleri ve eğitim materyalleri. Kurulum, sorun giderme, optimizasyon ve daha fazlası.",
    keywords: ["IPTV rehberi", "IPTV eğitim", "IPTV kurulumu", "IPTV sorun giderme", "IPTV optimizasyonu"],
    ogType: "article"
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Detaylı IPTV Rehberleri ve Eğitim Materyalleri",
    "description": metadata.description,
    "author": {
      "@type": "Organization",
      "name": "QruzeHD"
    }
  };

  const sections = [
    {
      title: "IPTV Başlangıç Rehberi",
      subsections: [
        { subtitle: "IPTV'nin Temelleri", content: "IPTV (Internet Protocol Television), televizyon yayınlarının geleneksel uydu çanakları yerine internet üzerinden iletilmesidir. Bu teknoloji ile binlerce kanala anında erişebilirsiniz." },
        { subtitle: "İlk Kez Kullanacaklar İçin", content: "Sisteme giriş yapmak için size verilen M3U URL, kullanıcı adı ve şifre bilgilerini, uyumlu bir oynatıcı uygulamasına (Smarters, XCIPTV vb.) girmeniz yeterlidir." }
      ]
    },
    {
      title: "IPTV Kurulum Adım Adım",
      subsections: [
        { subtitle: "Genel Kurulum Mantığı", content: "Tüm cihazlarda IPTV kurulumu temel olarak 3 adımdan oluşur: Uygulamayı indirmek, abonelik bilgilerini girmek ve kanal listesini (playlist) yüklemek." },
        { subtitle: "Farklı Cihazlarda Kurulum", content: "Smart TV, Android, iOS ve bilgisayarlar için özel hazırlanmış detaylı görsel rehberlerimizi ana kurulum sayfamızdan inceleyebilirsiniz." }
      ]
    },
    {
      title: "IPTV Sorun Giderme Rehberi",
      subsections: [
        { subtitle: "Donma ve Takılma Sorunları", content: "Yayınlarda donma yaşıyorsanız, IPTV sorun giderme adımları kapsamında ilk olarak internet hızınızı (Speedtest ile) kontrol edin. Gerekirse modeminizi yeniden başlatın." },
        { subtitle: "Kanal Listesi Yüklenmeme Hatası", content: "Uygulama önbelleğini temizlemek veya playlist URL'sini tekrar girmek genellikle bu sorunu çözer. VPN kullanıyorsanız kapatmayı deneyin." }
      ]
    },
    {
      title: "IPTV Performans Optimizasyonu",
      subsections: [
        { subtitle: "Ağ Optimizasyonu", content: "Wi-Fi yerine mümkünse ethernet (kablolu) bağlantı kullanmak, ping sürelerini düşürür ve IPTV optimizasyonu için en etkili yöntemdir." },
        { subtitle: "Cihaz ve Uygulama Ayarları", content: "Kullandığınız uygulamada 'Hardware Decoder' ayarını aktif etmek, görüntü kalitesini ve akıcılığını artırabilir." }
      ]
    },
    {
      title: "IPTV Güvenlik ve Gizlilik",
      subsections: [
        { subtitle: "Güvenli Bağlantı", content: "Hizmetlerimiz güvenli sunucular üzerinden sağlanır. Müşteri bilgileri katı veri politikalarımız çerçevesinde korunur." }
      ]
    },
    {
      title: "IPTV Cihaz Uyumluluğu",
      subsections: [
        { subtitle: "Desteklenen Cihazlar", content: "Platformumuz LG, Samsung Smart TV'ler, Android TV Box, Apple TV, iPhone, iPad ve Windows/Mac bilgisayarlarla %100 uyumludur." }
      ]
    },
    {
      title: "IPTV Ağ Ayarları",
      subsections: [
        { subtitle: "DNS Ayarları", content: "Servis sağlayıcınızın varsayılan DNS'leri yavaşsa, Google DNS (8.8.8.8) veya Cloudflare DNS (1.1.1.1) kullanarak yanıt süresini iyileştirebilirsiniz." }
      ]
    },
    {
      title: "IPTV Sık Sorulan Sorular",
      subsections: [
        { subtitle: "En Çok Merak Edilenler", content: "Kurulum, ödeme veya yayın içerikleriyle ilgili tüm detaylı soruların yanıtlarını geniş kapsamlı SSS sayfamızda bulabilirsiniz." }
      ]
    },
    {
      title: "IPTV Video Eğitimler",
      subsections: [
        { subtitle: "Görsel Rehberler", content: "Adım adım kurulum videolarımız ile yazılı talimatları okumak yerine izleyerek çok daha hızlı bir şekilde kurulumu tamamlayabilirsiniz." }
      ]
    },
    {
      title: "IPTV Destek ve İletişim",
      subsections: [
        { subtitle: "7/24 Teknik Destek", content: "Oluşabilecek her türlü teknik sorun ve IPTV eğitim talebiniz için canlı destek ekibimiz kesintisiz hizmet vermektedir." }
      ]
    }
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col font-sans text-white">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <BreadcrumbNavigation />
            
            <article className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <BookOpen className="w-12 h-12 text-green-400" />
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  Detaylı IPTV Rehberleri ve Eğitim Materyalleri
                </h1>
              </div>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-8">
                  Kapsamlı <strong>IPTV rehberi</strong> sayfamıza hoş geldiniz. Bu bölüm, <strong>IPTV kurulumu</strong>, teknik ayarlar, <strong>IPTV sorun giderme</strong> ve <strong>IPTV optimizasyonu</strong> gibi konularda sizlere rehberlik edecek derinlemesine bir <strong>IPTV eğitim</strong> kaynağıdır.
                </p>

                {sections.map((section, idx) => (
                  <div key={idx} className="mb-10">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
                      {section.title}
                    </h2>
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="mb-4">
                        <h3 className="text-xl font-semibold text-green-300 mb-2">
                          {sub.subtitle}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-4">Daha Fazla Bilgi İçin</h3>
                  <ul className="flex flex-col sm:flex-row gap-4">
                    <li><Link to="/installation" className="text-green-400 hover:text-green-300 underline">Cihaz Bazlı Kurulum</Link></li>
                    <li><Link to="/faq" className="text-green-400 hover:text-green-300 underline">Sık Sorulan Sorular</Link></li>
                    <li><Link to="/gizlilik" className="text-green-400 hover:text-green-300 underline">Gizlilik ve Güvenlik</Link></li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </main>
        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default DetailedInstallationPage;