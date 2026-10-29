
import React, { useEffect, memo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PremiumHero from '@/components/PremiumHero'; 
import TrendingContentSlider from '@/components/TrendingContentSlider';
import ChannelSlider from '@/components/ChannelSlider';
import Packages from '@/components/Packages';
import MassiveChannelArchiveSection from '@/components/MassiveChannelArchiveSection';
import ChatBot from '@/components/ChatBot';
import SEOHead from '@/components/SEOHead';
import { logPerformance } from '@/utils/performance';
import { defaultData } from '@/data/defaultSiteData';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import ErrorBoundary from '@/components/ErrorBoundary';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import HomePageSeoContent from '@/components/HomePageSeoContent';
import HomeGeoSection from '@/components/home/HomeGeoSection';
import HomeSpotlightCards from '@/components/home/HomeSpotlightCards';
import HomePageVideoSection from '@/components/HomePageVideoSection';
import FeaturedReviewsCarousel from '@/components/FeaturedReviewsCarousel';
import LazySection from '@/components/LazySection';
import PremiumConversionStrip from '@/components/PremiumConversionStrip';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';
import { ShieldCheck, Lock, Calendar, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homePageSchemas } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';
const HomePage = ({ siteData }) => {
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    logPerformance('HomePage');
    initPerformanceMonitoring();
  }, []);

  const safeSiteData = siteData || defaultData;
  
  const metadata = {
    title: "IPTV Satın Al — 4K Türk Kanalları | QruzeTV",
    description:
      "Yurt dışından Türk kanallarını izlemek için IPTV satın alın: 10.000+ canlı kanal, 4K/UHD yayın, ücretsiz test ve 7/24 Türkçe destek.",
    keywords: [
      "IPTV satın al",
      "premium IPTV",
      "4K IPTV",
      "kesintisiz IPTV",
      "IPTV test",
      "iptv türkiye",
      "avrupa iptv",
      "yurt dışından türk kanalları izle",
      "almanya türk kanalları izle",
      "gurbetçi iptv",
      "canlı maç programı",
    ],
    ogType: "website",
    ogImage: `${SITE_URL}/og/home.jpg`,
  };
  const jsonLd = homePageSchemas(metadata, safeSiteData.videos);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <div key={retryKey}>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white selection:bg-white/20">
        <ErrorBoundary onRetry={handleRetry}>
          <Header contactData={safeSiteData.contactData} />
        </ErrorBoundary>

        <main className="flex-grow w-full">
          <ErrorBoundary onRetry={handleRetry}>
            <PremiumHero 
              siteData={safeSiteData} 
              mainTitle="IPTV Satın Al – 4K Türk Kanalları"
              subTitle="Gerçek Eğlenceyi Keşfedin"
            />
          </ErrorBoundary>
          
          <LazySection className="qruze-cinema-section premium-section-signature py-16 relative z-10 content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
               <TrendingContentSlider title="4K Kalitesinde Popüler İçerikler" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section relative border-t border-white/5 content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
               <ChannelSlider />
            </ErrorBoundary>
          </LazySection>
          
          <section id="packages-section" className="qruze-cinema-section premium-section-signature relative border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            <ErrorBoundary onRetry={handleRetry}>
              <Packages
                packages={safeSiteData.packagesData}
                title="IPTV Paketleri ve Fiyatları"
                showTierFilter
                packagesPageContent={safeSiteData.packagesPageContent}
              />
            </ErrorBoundary>
          </section>

          <LazySection className="content-visibility-auto">
            <ErrorBoundary>
              <PremiumConversionStrip locale="tr" contactData={safeSiteData.contactData} />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-16 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <div className="mb-10 flex flex-col items-center gap-3 text-center">
                  <span className="qruze-premium-seal">Qruze Experience</span>
                  <h2 className="section-title text-2xl md:text-4xl">İzleme Rehberi</h2>
                  <p className="section-lead text-center">Ne izleyeceğinize karar veremediniz mi? Güncel maç programı ve içerik önerileri tek tık uzağınızda.</p>
                </div>
                <div className="space-y-4 max-w-2xl mx-auto">
                <Link
                  to="/mac-programi"
                  title="Güncel maç programı ve yayın kanalları"
                  className="qruze-cinema-link group flex w-full items-center gap-4 rounded-2xl border border-[#e50914]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e50914]/65 hover:shadow-[0_0_64px_rgba(229,9,20,0.24)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.12)_50%,transparent_82%)] transition-transform duration-700 group-hover:translate-x-[100%]"
                    aria-hidden
                  />
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center gap-0.5 rounded-xl bg-gradient-to-br from-[#e50914]/40 to-[#b20710]/50 shadow-[0_0_24px_rgba(229,9,20,0.35)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-xl drop-shadow-md" aria-hidden>
                      ⚽
                    </span>
                    <Calendar className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="text-xl font-bold text-white transition-colors group-hover:text-[#ff3b45]">
                      Maç Takvimi & Fikstür
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Günlük fikstür ve başlama saatleri. <span className="font-medium text-[#e50914]/95">Haftanın programı</span> tek ekranda.
                    </p>
                  </div>
                  <span className="relative z-10 shrink-0 text-sm font-semibold text-[#e50914] transition-transform duration-300 group-hover:translate-x-1">
                    Program →
                  </span>
                </Link>
                <Link
                  to="/ne-izlesem"
                  title="Film ve dizi önerilerini keşfedin"
                  className="qruze-cinema-link group flex w-full items-center gap-4 rounded-2xl border border-[#e50914]/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e50914]/65 hover:shadow-[0_0_64px_rgba(229,9,20,0.24)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.12)_50%,transparent_82%)] transition-transform duration-700 group-hover:translate-x-[100%]"
                    aria-hidden
                  />
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e50914]/40 to-[#b20710]/50 shadow-[0_0_24px_rgba(229,9,20,0.35)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                    <Film className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="text-xl font-bold text-white transition-colors group-hover:text-[#ff3b45]">Ne İzlesem?</p>
                    <p className="mt-1 text-sm text-slate-300">Film ve dizi önerileri. <span className="font-medium text-[#e50914]/95">IPTV&apos;de izleyebileceğiniz</span> popüler içerikler.</p>
                  </div>
                  <span className="relative z-10 shrink-0 text-sm font-semibold text-[#e50914] transition-transform duration-300 group-hover:translate-x-1">Öneriler →</span>
                </Link>
                </div>
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-16 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <HomePageVideoSection videos={safeSiteData.videos} lang="tr" />
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-0 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <FeaturedReviewsCarousel locale="tr" showViewAllLink className="border-b border-white/5" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-16 border-y border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <div className="luxury-glass max-w-4xl mx-auto p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Lock className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Gizlilik ve Güvenlik</h2>
                    <p className="text-slate-200 text-lg leading-relaxed">
                      Veri gizliliğiniz ve güvenliğiniz en büyük önceliğimizdir. <span className="text-primary/90">Güvenli ödeme altyapısı</span> ve <span className="text-[#e50914]/90">şifreli bağlantılar</span> ile IPTV keyfinizi güvenle sürdürebilirsiniz.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                      <span className="flex items-center gap-2 text-sm text-primary font-medium px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <ShieldCheck className="w-4 h-4" /> Şifreli Bağlantı Altyapısı
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section premium-section-signature py-20 relative border-t border-white/5">
            <ErrorBoundary onRetry={handleRetry}>
              <WhyChooseUsSection title="Neden Bizi Tercih Etmelisiniz?" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-20 relative border-t border-white/5">
            <ErrorBoundary onRetry={handleRetry}>
              <MassiveChannelArchiveSection title="Kesintisiz ve Dev Arşivli IPTV" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section relative border-t border-white/5 z-20">
            <ErrorBoundary>
              <HomeSpotlightCards />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section relative border-t border-white/5 z-20">
            <ErrorBoundary>
              <HomeGeoSection />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section relative border-t border-white/5 z-20">
            <ErrorBoundary>
              <HomePageSeoContent siteData={safeSiteData} />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-16 relative border-t border-white/5">
            <ErrorBoundary>
              <div className="container mx-auto px-4 mt-8">
                <InternalLinkingOptimization currentPage="home" />
              </div>
            </ErrorBoundary>
          </LazySection>
        </main>
        
        <ErrorBoundary>
          <Footer 
            contactData={safeSiteData.contactData} 
            siteData={safeSiteData} 
          />
        </ErrorBoundary>
        
        {safeSiteData.chatBotData?.enabled && (
             <ErrorBoundary>
               <ChatBot 
                  chatData={safeSiteData.chatBotData} 
                  contactData={safeSiteData.contactData} 
               />
             </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default memo(HomePage);
