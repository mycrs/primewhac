import React, { useEffect, memo, useState } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import PremiumHeroDE from '@/components/PremiumHeroDE'; 
import TrendingContentSliderDE from '@/components/TrendingContentSliderDE';
import Packages from '@/components/Packages';
import ChatBot from '@/components/ChatBot';
import SEOHead from '@/components/SEOHead';
import { homePageSchemasDE } from '@/utils/seoSchema';
import { logPerformance } from '@/utils/performance';
import { defaultData } from '@/data/defaultSiteData';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import ErrorBoundary from '@/components/ErrorBoundary';
import WhyChooseUsSectionDE from '@/components/WhyChooseUsSectionDE';
import HomePageSeoContentDE from '@/components/HomePageSeoContentDE';
import HomePageVideoSection from '@/components/HomePageVideoSection';
import FeaturedReviewsCarousel from '@/components/FeaturedReviewsCarousel';
import LazySection from '@/components/LazySection';
import PremiumConversionStrip from '@/components/PremiumConversionStrip';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';
import { ShieldCheck, Lock, Film, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePageDE = ({ siteData }) => {
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    logPerformance('HomePageDE');
    initPerformanceMonitoring();
  }, []);

  const safeSiteData = siteData || defaultData;

  const handleRetry = () => {
    setRetryKey((prev) => prev + 1);
  };
  
  const metadata = {
    // prerenderSeo.js '/de' girişiyle birebir aynı — hydrate sonrası title/description değişmemeli
    title: "IPTV Deutschland 2026 — Premium 4K Anbieter & Test | QruzeTV",
    description: "Premium IPTV in Deutschland, Österreich & Schweiz: 10.000+ Live-Sender, Sport & VOD in 4K/FHD. Kompatibel mit Smart TV, Fire TV & iOS. Jetzt kostenlos testen!",
    keywords: ["IPTV Deutschland", "IPTV kaufen", "Premium IPTV Anbieter", "4K IPTV", "Stabile IPTV", "IPTV ohne Unterbrechung", "IPTV test"],
    ogType: "website",
  };
  const jsonLd = homePageSchemasDE(metadata, safeSiteData.videos);

  return (
    <div key={retryKey}>
      <SEOHead {...metadata} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white selection:bg-white/20">
        <ErrorBoundary onRetry={handleRetry}>
          <HeaderDE contactData={safeSiteData.contactData} />
        </ErrorBoundary>

        <main className="flex-grow w-full">
          <ErrorBoundary onRetry={handleRetry}>
            <PremiumHeroDE
              siteData={safeSiteData}
              mainTitle="IPTV Deutschland 2026 – 4K Streaming & Live-TV kostenlos testen"
              subTitle="Smart TV, Fire TV, Apple & Android – 10.000+ Sender, Sport & deutschsprachiger Support"
            />
          </ErrorBoundary>

          <section className="qruze-cinema-section premium-section-signature py-8 md:py-14 relative z-10">
            <ErrorBoundary onRetry={handleRetry}>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                <h2 className="text-2xl font-bold">Beliebte Inhalte in 4K IPTV</h2>
              </div>
              <TrendingContentSliderDE title="Beliebte Filme & Serien in 4K" />
            </ErrorBoundary>
          </section>

          <section
            id="packages-section"
            className="qruze-cinema-section premium-section-signature relative border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
          >
            <ErrorBoundary onRetry={handleRetry}>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                <h2 className="text-2xl font-bold">IPTV kaufen - Unsere Pakete</h2>
              </div>
              <Packages
                packages={safeSiteData.packagesData}
                title="IPTV kaufen - Unsere Pakete"
                showTierFilter
                hideRegions={['TR']}
                packagesPageContent={safeSiteData.packagesPageContent}
              />
            </ErrorBoundary>
          </section>

          <LazySection className="content-visibility-auto">
            <ErrorBoundary>
              <PremiumConversionStrip locale="de" contactData={safeSiteData.contactData} />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-20 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-12 flex flex-col items-center gap-3 text-center">
                  <span className="qruze-premium-seal">Qruze Hub Deutschland</span>
                  <h2 className="section-title text-3xl md:text-5xl font-black tracking-tight text-white">Streaming & Setup Station</h2>
                  <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    Maximale Einfachheit. Unsere riesige Film- & Serienmediathek und Schritt-für-Schritt-Anleitungen für alle Smart TVs.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {/* Bento Tile 1: Film & Serienarchiv */}
                  <Link
                    to="/de/was-soll-ich-schauen/"
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
                        Film- & Serienmediathek
                      </h3>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                        Beliebte Filme, Serien-Highlights und IMDb-Top-Titel in 4K UHD. Finden Sie in Sekunden den passenden Titel für Ihren Abend.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">4K UHD</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Dolby 5.1</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">IMDb 8+ Top</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Deutsche Tonspuren</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#ff3b45] transition-colors pt-4 border-t border-white/5">
                      <span>Mediathek durchsuchen</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
                  </Link>

                  {/* Bento Tile 2: Einrichtungsstation */}
                  <Link
                    to="/de/einrichtung/"
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#16161d] via-[#0d0d12] to-[#070709] p-8 md:p-10 transition-all duration-500 hover:border-emerald-500/60 hover:shadow-[0_20px_60px_rgba(16,185,129,0.2)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px]"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/20 via-emerald-950/5 to-transparent blur-3xl group-hover:from-emerald-500/35 transition-all duration-500" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-emerald-900/40 border border-emerald-500/40 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                          <Tv className="h-7 w-7 text-emerald-400" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase">
                          2 Min. Setup
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
                        Einrichtungsanleitungen
                      </h3>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                        Einfache Anleitungen mit Screenshots für Samsung Smart TV, LG webOS, Apple TV 4K, Fire TV Stick und Windows PC.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Samsung Tizen</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">LG webOS</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Apple TV 4K</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">Fire TV</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300">TiviMate & IBO</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-emerald-400 transition-colors pt-4 border-t border-white/5">
                      <span>Gerät wählen & starten</span>
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
                <HomePageVideoSection videos={safeSiteData.videos} lang="de" />
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-0 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <FeaturedReviewsCarousel locale="de" showViewAllLink className="border-b border-white/5" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section py-16 border-y border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <div className="luxury-glass mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl p-8 md:flex-row md:p-12">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/20 md:h-24 md:w-24">
                    <Lock className="h-10 w-10 text-primary md:h-12 md:w-12" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">Datenschutz und Sicherheit</h2>
                    <p className="text-lg leading-relaxed text-slate-200">
                      Ihre Daten und Ihre Sicherheit haben für uns oberste Priorität. Mit{' '}
                      <span className="text-primary/90">sicherer Zahlungsinfrastruktur</span> und{' '}
                      <span className="text-[#e50914]/90">verschlüsselten Verbindungen</span> können Sie IPTV
                      sorgenfrei nutzen.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                      <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <ShieldCheck className="h-4 w-4" /> Verschlüsselte Verbindung
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section premium-section-signature py-20 relative border-t border-white/5">
            <ErrorBoundary onRetry={handleRetry}>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Warum ist unsere IPTV stabil?</h2>
               </div>
              <WhyChooseUsSectionDE title="Warum ist unsere IPTV stabil?" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="qruze-cinema-section relative border-t border-white/5 z-20">
            <ErrorBoundary>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Premium IPTV Anbieter Deutschland</h2>
               </div>
              <HomePageSeoContentDE siteData={safeSiteData} />
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
          <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
        </ErrorBoundary>

        {safeSiteData.chatBotData?.enabled && (
          <ErrorBoundary>
            <ChatBot chatData={safeSiteData.chatBotData} contactData={safeSiteData.contactData} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default memo(HomePageDE);
