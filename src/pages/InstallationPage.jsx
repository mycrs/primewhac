
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import InstallationPageLayout from '@/components/installation/InstallationPageLayout';
import InstallationPageSeoSection from '@/components/installation/InstallationPageSeoSection';
import { useSetupPage } from '@/hooks/useSetupPage';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

const InstallationPage = ({ siteData }) => {
  const { fetchSetupPage, setupData, loading, error } = useSetupPage();

  useEffect(() => {
    fetchSetupPage();
    window.scrollTo(0, 0);
  }, [fetchSetupPage]);

  const metadata = {
    title: "IPTV Kurulum Rehberi 2024 | Smart TV, Android, iOS Kurulumu",
    description: "Adım adım IPTV kurulum rehberi. Smart TV, Android, iOS cihazlarda IPTV kurulumu nasıl yapılır? Sorun giderme ve ipuçları detayları ile.",
    keywords: ["IPTV kurulumu", "IPTV kurulum rehberi", "Smart TV IPTV", "Android IPTV", "iOS IPTV", "donmayan IPTV", "IPTV sorunları", "kaliteli IPTV"],
    ogType: "article"
  };

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "IPTV Nasıl Kurulur?",
      "description": "Tüm cihazlar için adım adım IPTV kurulumu",
      "step": [
        { "@type": "HowToStep", "name": "Uygulama İndirme", "text": "Cihazınıza uygun IPTV oynatıcı uygulamasını indirin." },
        { "@type": "HowToStep", "name": "Abonelik Bilgilerini Girme", "text": "Kullanıcı adı, şifre ve URL bilgilerinizi uygulamaya girin." },
        { "@type": "HowToStep", "name": "İzlemeye Başlama", "text": "Kanalların yüklenmesini bekleyin ve izlemeye başlayın." }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "IPTV Kurulum Rehberi - Adım Adım Talimatlar ve Sorun Giderme",
      "author": { "@type": "Organization", "name": "QruzeHD" }
    }
  ];

  if (error) {
     console.error("InstallationPage error loading data:", error);
  }

  return (
    <ErrorBoundary>
      <SEOHead {...metadata} jsonLd={jsonLdData} />
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
        <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        
        <main className="flex-grow w-full">
          {/* Integrated Hero Section */}
          <section className="relative min-h-[50vh] lg:min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden pt-32">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-purple-900/40 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/101cce4586536aa0617e00725d4ba2bc.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            
            <div className="container relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mb-6 flex justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    Rehber & Yönergeler
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
                  IPTV Kurulum Rehberi
                </h1>
                <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                  Adım adım kurulum talimatları ile cihazınızı dakikalar içinde hazırlayın.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 max-w-7xl relative z-10">
            <div className="mb-8">
              <BreadcrumbNavigation />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-10 text-center text-white">İnteraktif Cihaz Seçim Asistanı</h2>
              <InstallationPageLayout 
                siteData={siteData} 
                pageContent={setupData} 
                isLoading={loading && !setupData}
              />
            </motion.div>

            {/* Comprehensive Guide Content */}
            <motion.article 
              className="mt-24 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white leading-tight">
                Kurulum Hakkında Ek Bilgiler
              </h2>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Gelişen teknoloji ile birlikte televizyon izleme alışkanlıklarımız da tamamen değişti. Kaliteli, kesintisiz ve <strong>donmayan IPTV</strong> deneyimi yaşamak için doğru kurulum büyük önem taşır. Bu kapsamlı <strong>IPTV kurulum rehberi</strong>, sahip olduğunuz tüm cihazlarda <strong>IPTV kurulumu</strong> işlemini nasıl gerçekleştireceğinizi adım adım anlatmaktadır.
                </p>

                <h3 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800 pb-3">IPTV Nedir ve Nasıl Çalışır?</h3>
                <p className="text-slate-300 mb-6 font-light">IPTV, televizyon yayınlarını çanak anten veya kablo yerine internet protokolü üzerinden cihazınıza iletir. Size sağlanan M3U linki veya Xtream Codes API bilgileri sayesinde, cihazınızdaki oynatıcı uygulama (player) yayın sunucularımızla iletişim kurar. Yüksek hızlı fiber sunucularımız, <strong>kaliteli IPTV</strong> deneyimini donma olmadan ekranınıza yansıtır.</p>

                <h3 className="text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800 pb-3">Kurulum Öncesi Gereksinimler</h3>
                <p className="text-slate-300 mb-6 font-light">Kusursuz bir izleme deneyimi için donanımsal ve ağ gereksinimlerini sağlamalısınız. Minimum 16 Mbps indirme (download) hızına sahip stabil bir internet bağlantısı önerilir. Eğer Wi-Fi kullanıyorsanız, modeme yakın olmalı veya mümkünse ethernet kablosu tercih etmelisiniz.</p>

                <div className="mt-16 p-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl text-center flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Eğlenceye Hazır Mısınız?</h3>
                  <p className="text-slate-300 mb-8 max-w-2xl font-light">Tüm kurulum adımlarını tamamladınız veya kuruluma başlamadan önce bir pakete ihtiyacınız varsa, hemen paketlerimizi inceleyin.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link 
                      to="/paketler" 
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                      Paketleri İncele <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      to="/sss" 
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700 shadow-lg flex items-center justify-center"
                    >
                      Sık Sorulan Sorular
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Alt bölüm: açıklamalar, iç linkler, anahtar kelimeler, animasyonlar */}
            <InstallationPageSeoSection />
            
          </div>
        </main>
        <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
      </div>
    </ErrorBoundary>
  );
};

export default InstallationPage;
