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
    title: "IPTV Deutschland 2026 — Türkische Sender & Test | QruzeTV",
    description: "Türkische Sender per IPTV in Deutschland: auf Smart TV, Fire TV und Mobilgeräten in HD/4K streamen. QruzeTV jetzt kostenlos testen.",
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
              mainTitle="IPTV Deutschland 2026 – türkische Sender kostenlos testen"
              subTitle="Smart TV, Fire TV, Mobilgeräte und deutschsprachiger Support"
            />
          </ErrorBoundary>

          <LazySection className="qruze-cinema-section premium-section-signature py-16 relative z-10 content-visibility-auto">
            <ErrorBoundary onRetry={handleRetry}>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                <h2 className="text-2xl font-bold">Beliebte Inhalte in 4K IPTV</h2>
              </div>
              <TrendingContentSliderDE title="Beliebte Filme & Serien in 4K" />
            </ErrorBoundary>
          </LazySection>

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

          <LazySection className="qruze-cinema-section py-16 border-t border-white/5 content-visibility-auto">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                  <span className="qruze-premium-seal mb-3">Qruze Experience</span>
                  <h2 className="text-xl font-bold text-white">Zuschauer-Guide & Entdeckung</h2>
                  <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Filme, Serien und Schritt-für-Schritt-Einrichtung für alle gängigen Smart TVs und Streaming-Geräte.</p>
                </div>
                <div className="space-y-4 max-w-2xl mx-auto">
                <Link
                  to="/de/was-soll-ich-schauen"
                  className="qruze-cinema-link group flex w-full items-center gap-4 rounded-2xl border-2 border-[#e50914]/45 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#e50914]/65 hover:shadow-[0_0_64px_rgba(229,9,20,0.24)]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_18%,rgba(255,255,255,0.12)_50%,transparent_82%)] transition-transform duration-700 group-hover:translate-x-[100%]"
                    aria-hidden
                  />
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#e50914]/40 to-[#b20710]/50 shadow-[0_0_24px_rgba(229,9,20,0.35)] ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                    <Film className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                  <div className="relative z-10 min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#e50914]">
                      Film- & Serienarchiv
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Top-bewertete Filme, Serien-Highlights und IMDb-Empfehlungen. <span className="font-medium text-[#e50914]/95">Ständig aktualisiert</span>.
                    </p>
                  </div>
                  <span className="relative z-10 shrink-0 text-sm font-semibold text-[#e50914] transition-transform duration-300 group-hover:translate-x-1">
                    Entdecken →
                  </span>
                </Link>
                <Link
                  to="/de/einrichtung"
                  className="qruze-cinema-link flex items-center gap-4 w-full p-6 rounded-2xl border border-white/15 hover:border-primary/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Tv className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Einrichtungsanleitungen</h3>
                    <p className="text-slate-300 text-sm mt-1">Einfache Schritt-für-Schritt-Anleitung für Samsung, LG webOS, Android TV, Apple TV und PC.</p>
                  </div>
                  <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform shrink-0">Anleitung →</span>
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
