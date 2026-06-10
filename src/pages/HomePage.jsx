
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
import HomePageVideoSection from '@/components/HomePageVideoSection';
import FeaturedReviewsCarousel from '@/components/FeaturedReviewsCarousel';
import LazySection from '@/components/LazySection';
import PremiumConversionStrip from '@/components/PremiumConversionStrip';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';
import { ShieldCheck, Lock, Calendar, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homePageSchemas } from '@/utils/seoSchema';
const HomePage = ({ siteData }) => {
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    logPerformance('HomePage');
    initPerformanceMonitoring();
  }, []);

  const safeSiteData = siteData || defaultData;
  
  const metadata = {
    title: "IPTV Satın Al 2026 — Donmayan 4K Yayın | QruzeTV",
    description:
      "20.000+ kanal, canlı spor, film ve dizi tek abonelikte. 4K kalitede donmayan yayın, ücretsiz test, anında teslimat ve 7/24 destek.",
    keywords: [
      "IPTV satın al",
      "IPTV server",
      "Premium IPTV",
      "4K IPTV",
      "Kesintisiz IPTV",
      "IPTV test",
      "iptv al",
      "ip tv satın al",
      "ip tv al",
      "kaliteli iptv",
      "iptv türkiye",
      "türkiye iptv",
    ],
    ogType: "website",
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
              mainTitle="Premium IPTV - Kesintisiz 4K IPTV Satın Al"
              subTitle="Neden Bizi Seçmelisiniz?"
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
          
          <LazySection id="packages-section" className="qruze-cinema-section premium-section-signature py-20 relative border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
              <Packages packages={safeSiteData.packagesData} title="IPTV Paketleri ve Fiyatları" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="content-visibility-auto">
            <ErrorBoundary>
              <PremiumConversionStrip locale="tr" contactData={safeSiteData.contactData} />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-16 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                  <span className="qruze-premium-seal mb-3">Qruze Experience</span>
                  <h2 className="text-xl font-bold text-white">İzleme Rehberi</h2>
                </div>
                <div className="space-y-4 max-w-2xl mx-auto">
                <Link
                  to="/mac-programi"
                  className="qruze-cinema-link group flex w-full items-center gap-4 rounded-2xl border-2 border-[#e50914]/45 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#e50914]/65 hover:shadow-[0_0_64px_rgba(229,9,20,0.24)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.12)_50%,transparent_82%)] transition-transform duration-700 group-hover:translate-x-[100%]"
                    aria-hidden
                  />
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center gap-0.5 rounded-xl bg-gradient-to-br from-[#e50914]/40 to-[#b20710]/50 shadow-[0_0_24px_rgba(16,185,129,0.45)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-xl drop-shadow-md" aria-hidden>
                      ⚽
                    </span>
                    <Calendar className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-colors group-hover:text-[#e50914]">
                      Maç Takvimi & Fikstür
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Süper Lig, Premier Lig, La Liga. <span className="font-medium text-[#e50914]/95">Hangi kanalda, saat kaçta?</span> Güncel program.
                    </p>
                  </div>
                  <span className="relative z-10 shrink-0 text-sm font-semibold text-[#e50914] transition-transform duration-300 group-hover:translate-x-1">
                    Program →
                  </span>
                </Link>
                <Link
                  to="/ne-izlesem"
                  className="qruze-cinema-link flex items-center gap-4 w-full p-6 rounded-2xl border-primary/20 hover:border-primary/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Film className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Ne İzlesem?</h3>
                    <p className="text-slate-300 text-sm mt-1">Film ve dizi önerileri. <span className="text-primary/90">IPTV&apos;de izleyebileceğiniz</span> popüler içerikler.</p>
                  </div>
                  <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform shrink-0">Öneriler →</span>
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
                        <ShieldCheck className="w-4 h-4" /> %100 Güvenli Altyapı
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
