
import React, { useEffect, memo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PremiumHero from '@/components/PremiumHero'; 
import TrendingContentSlider from '@/components/TrendingContentSlider';
import Packages from '@/components/Packages';
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
import { ShieldCheck, Lock, Film, Tv } from 'lucide-react';
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
      "4k film dizi arşivi",
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
          
          <section className="qruze-cinema-section premium-section-signature py-8 md:py-14 relative z-10">
            <ErrorBoundary onRetry={handleRetry}>
               <TrendingContentSlider title="Haftanın Popüler Film & Dizi Arşivi" />
            </ErrorBoundary>
          </section>
          
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

          <LazySection className="qruze-cinema-section py-20 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-12 flex flex-col items-center gap-3 text-center">
                  <span className="qruze-premium-seal">Qruze Intelligence & Hub</span>
                  <h2 className="section-title text-3xl md:text-5xl font-black tracking-tight text-white">İzleme & Kurulum İstasyonu</h2>
                  <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Sıfır karmaşa, maksimum konfor. Geniş sinema arşivimiz ve tüm akıllı cihazlara özel 2 dakikalık kurulum rehberimiz tek tık uzağınızda.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {/* Bento Tile 1: Film & Dizi Keşif Evreni */}
                  <Link
                    to="/ne-izlesem/"
                    title="Film ve dizi arşivi keşif rehberi"
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#16161d] via-[#0d0d12] to-[#070709] p-8 md:p-10 transition-all duration-500 hover:border-[#e50914]/60 hover:shadow-[0_20px_60px_rgba(229,9,20,0.25)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px]"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-[#e50914]/20 via-[#b20710]/5 to-transparent blur-3xl group-hover:from-[#e50914]/35 transition-all duration-500" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e50914]/30 to-[#b20710]/40 border border-[#e50914]/40 text-white shadow-lg shadow-[#e50914]/20 group-hover:scale-110 transition-transform duration-300">
                          <Film className="h-7 w-7 text-white" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 text-[#ff4b55] text-xs font-black tracking-wider uppercase">
                          15.000+ VOD
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-[#ff3b45] transition-colors tracking-tight">
                        Sinema & Dizi Arşivi
                      </h3>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                        Haftanın en çok izlenen yapımları, IMDb puanı yüksek başyapıtlar ve zengin kategori filtreleri. Ne izleyeceğinizi anında bulun.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">4K UHD</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Dolby Atmos</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">IMDb 8+ Seçkiler</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">TR Dublaj & Altyazı</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#ff3b45] transition-colors pt-4 border-t border-white/5">
                      <span>Kataloğu Keşfet</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
                  </Link>

                  {/* Bento Tile 2: Akıllı Cihaz Kurulum İstasyonu */}
                  <Link
                    to="/kurulum/"
                    title="Cihaz kurulum rehberlerini inceleyin"
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#16161d] via-[#0d0d12] to-[#070709] p-8 md:p-10 transition-all duration-500 hover:border-emerald-500/60 hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px]"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/20 via-emerald-950/5 to-transparent blur-3xl group-hover:from-emerald-500/35 transition-all duration-500" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-900/40 border border-emerald-500/40 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                          <Tv className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase">
                          2 Dk Kurulum
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
                        Cihaz Kurulum Rehberleri
                      </h3>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                        Samsung, LG webOS, Apple TV 4K, Android TV, Fire TV ve Windows PC için adım adım, ekran görüntülü kolay kurulum rehberi.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Samsung Tizen</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">LG webOS</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Apple TV 4K</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Fire TV Stick</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">TiviMate & IBO</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-emerald-400 transition-colors pt-4 border-t border-white/5">
                      <span>Cihazını Seç & Kuruluma Başla</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
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
