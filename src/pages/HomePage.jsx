
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
import LazySection from '@/components/LazySection';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';
import { ShieldCheck, Lock, Calendar, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
const HomePage = ({ siteData }) => {
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    logPerformance('HomePage');
    initPerformanceMonitoring();
  }, []);

  const safeSiteData = siteData || defaultData;
  
  const metadata = {
    title: "Premium IPTV Satın Al | Kesintisiz 4K IPTV Sağlayıcısı",
    description: "Türkiye'nin en iyi Premium IPTV hizmeti. Kesintisiz 4K kalite, anında teslimat ve binlerce kanal. Güvenilir IPTV satın al ve hemen izlemeye başla. Ücretsiz test et!",
    keywords: ["IPTV satın al", "IPTV server", "Premium IPTV", "4K IPTV", "Kesintisiz IPTV", "IPTV test"],
    ogType: "website"
  };

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  return (
    <div key={retryKey}>
      <SEOHead {...metadata} />
      
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col font-sans text-white selection:bg-purple-500/30">
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
          
          <LazySection className="py-16 bg-gradient-to-b from-[#0F0F1E] to-[#131325] relative z-10 content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
               <TrendingContentSlider title="4K Kalitesinde Popüler İçerikler" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="bg-gradient-to-b from-[#131325] to-[#16162a] relative border-t border-white/5 content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
               <ChannelSlider />
            </ErrorBoundary>
          </LazySection>
          
          <LazySection id="packages-section" className="py-20 bg-[#0F0F1E] relative border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
              <Packages packages={safeSiteData.packagesData} title="IPTV Paketleri ve Fiyatları" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-16 bg-gradient-to-b from-[#0F0F1E] to-[#131325] border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold text-white text-center mb-8">İzleme Rehberi</h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                <Link
                  to="/mac-programi"
                  className="flex items-center gap-4 w-full bg-gradient-to-r from-emerald-900/30 to-slate-900/60 hover:from-emerald-800/40 hover:to-slate-800/60 p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-600/20 flex items-center justify-center gap-0.5 group-hover:bg-emerald-600/30 transition-colors">
                    <span className="text-xl" aria-hidden>⚽</span>
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">Maç Takvimi & Fikstür</h2>
                    <p className="text-slate-300 text-sm mt-1">Süper Lig, Premier Lig, La Liga. <span className="text-emerald-300/90">Hangi kanalda, saat kaçta?</span> Güncel program.</p>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform shrink-0">Program →</span>
                </Link>
                <Link
                  to="/ne-izlesem"
                  className="flex items-center gap-4 w-full bg-gradient-to-r from-purple-900/30 to-slate-900/60 hover:from-purple-800/40 hover:to-slate-800/60 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                    <Film className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Ne İzlesem?</h2>
                    <p className="text-slate-300 text-sm mt-1">Film ve dizi önerileri. <span className="text-purple-300/90">IPTV&apos;de izleyebileceğiniz</span> popüler içerikler.</p>
                  </div>
                  <span className="text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform shrink-0">Öneriler →</span>
                </Link>
                </div>
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-16 bg-[#0F0F1E] border-y border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/60 to-purple-900/20 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                    <Lock className="w-10 h-10 md:w-12 md:h-12 text-purple-400" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Gizlilik ve Güvenlik</h2>
                    <p className="text-slate-200 text-lg leading-relaxed">
                      Veri gizliliğiniz ve güvenliğiniz en büyük önceliğimizdir. <span className="text-purple-200/90">Güvenli ödeme altyapısı</span> ve <span className="text-emerald-200/90">şifreli bağlantılar</span> ile IPTV keyfinizi güvenle sürdürebilirsiniz.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                      <span className="flex items-center gap-2 text-sm text-purple-300 font-medium px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                        <ShieldCheck className="w-4 h-4" /> %100 Güvenli Altyapı
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-20 bg-gradient-to-b from-[#0F0F1E] to-[#16162a] relative border-t border-white/5">
            <ErrorBoundary onRetry={handleRetry}>
              <WhyChooseUsSection title="Neden Bizi Tercih Etmelisiniz?" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-20 bg-[#16162a] relative border-t border-white/5">
            <ErrorBoundary onRetry={handleRetry}>
              <MassiveChannelArchiveSection title="Kesintisiz ve Dev Arşivli IPTV" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="bg-[#16162a] relative border-t border-white/5 z-20">
            <ErrorBoundary>
              <HomePageSeoContent title="Premium IPTV Hakkında Her Şey" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-16 bg-slate-950 relative border-t border-white/5">
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
