
import React, { useEffect, memo } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import PremiumHeroDE from '@/components/PremiumHeroDE'; 
import TrendingContentSliderDE from '@/components/TrendingContentSliderDE';
import ChannelSliderDE from '@/components/ChannelSliderDE';
import PackagesDE from '@/components/PackagesDE';
import MassiveChannelArchiveSectionDE from '@/components/MassiveChannelArchiveSectionDE';
import ChatBot from '@/components/ChatBot';
import SEOHead from '@/components/SEOHead';
import { logPerformance } from '@/utils/performance';
import { defaultData } from '@/data/defaultSiteData';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import ErrorBoundary from '@/components/ErrorBoundary';
import WhyChooseUsSectionDE from '@/components/WhyChooseUsSectionDE';
import HomePageSeoContentDE from '@/components/HomePageSeoContentDE';
import LazySection from '@/components/LazySection';
import { initPerformanceMonitoring } from '@/utils/performanceMonitoring';
import { ShieldCheck, Lock, Calendar, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePageDE = ({ siteData }) => {
  useEffect(() => {
    logPerformance('HomePageDE');
    initPerformanceMonitoring();
  }, []);

  const safeSiteData = siteData || defaultData;
  
  const metadata = {
    title: "Premium IPTV Deutschland | Stabile 4K IPTV ohne Unterbrechung",
    description: "Entdecken Sie Premium IPTV in Deutschland. Stabile 4K IPTV ohne Unterbrechung. Kaufen Sie jetzt IPTV von unserem zuverlässigen Anbieter. Kostenlos testen!",
    keywords: ["IPTV Deutschland", "IPTV kaufen", "Premium IPTV Anbieter", "4K IPTV", "Stabile IPTV", "IPTV ohne Unterbrechung", "IPTV test"],
    ogType: "website"
  };

  return (
    <>
      <SEOHead {...metadata} />
      
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col font-sans text-white selection:bg-purple-500/30">
        <HeaderDE contactData={safeSiteData.contactData} />
        
        <main className="flex-grow w-full">
          {/* Main H1 is perfectly placed inside PremiumHeroDE for SEO */}
          <PremiumHeroDE 
            siteData={safeSiteData} 
          />
          
          <LazySection className="py-16 bg-gradient-to-b from-[#0F0F1E] to-[#131325] relative z-10">
            <ErrorBoundary>
               <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Beliebte Inhalte in 4K IPTV</h2>
               </div>
               <TrendingContentSliderDE title="Beliebte Inhalte in 4K IPTV" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="bg-gradient-to-b from-[#131325] to-[#16162a] relative border-t border-white/5">
            <ErrorBoundary>
               <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Umfangreiche Kanäle für Premium IPTV</h2>
               </div>
               <ChannelSliderDE channels={safeSiteData.channelsData} title="Umfangreiche Kanäle für Premium IPTV" />
            </ErrorBoundary>
          </LazySection>
          
          <LazySection id="packages-section" className="py-20 bg-[#16162a] relative border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
            <ErrorBoundary>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">IPTV kaufen - Unsere Pakete</h2>
               </div>
              <PackagesDE packages={safeSiteData.packagesData} title="IPTV kaufen - Unsere Pakete" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-16 bg-gradient-to-b from-[#16162a] to-[#131325] border-t border-white/5">
            <ErrorBoundary>
              <div className="container mx-auto px-4">
                <h2 className="text-xl font-bold text-white text-center mb-8">Zuschauer-Guide</h2>
                <div className="space-y-4 max-w-2xl mx-auto">
                <Link
                  to="/de/spielplan"
                  className="flex items-center gap-4 w-full bg-gradient-to-r from-emerald-900/30 to-slate-900/60 hover:from-emerald-800/40 hover:to-slate-800/60 p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-emerald-600/20 flex items-center justify-center gap-0.5 group-hover:bg-emerald-600/30 transition-colors">
                    <span className="text-xl" aria-hidden>⚽</span>
                    <Calendar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">Spielplan & Fixture</h2>
                    <p className="text-slate-300 text-sm mt-1">Super Lig, Premier League, La Liga. <span className="text-emerald-300/90">Welcher Sender, wann?</span> Aktuelles Programm.</p>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform shrink-0">Spielplan →</span>
                </Link>
                <Link
                  to="/de/was-soll-ich-schauen"
                  className="flex items-center gap-4 w-full bg-gradient-to-r from-purple-900/30 to-slate-900/60 hover:from-purple-800/40 hover:to-slate-800/60 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                    <Film className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Was soll ich schauen?</h2>
                    <p className="text-slate-300 text-sm mt-1">Film- und Serienempfehlungen. <span className="text-purple-300/90">Beliebte Inhalte</span> für Ihr IPTV.</p>
                  </div>
                  <span className="text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform shrink-0">Empfehlungen →</span>
                </Link>
                </div>
              </div>
            </ErrorBoundary>
          </LazySection>

          {/* Neutralized Privacy & Security Section */}
          <LazySection className="py-16 bg-[#16162a] border-y border-white/5">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/60 to-purple-900/20 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <Lock className="w-10 h-10 md:w-12 md:h-12 text-purple-400" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Datenschutz und Sicherheit</h2>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Datenschutz und Sicherheit haben Priorität. Die Verbindung ist verschlüsselt und wir legen Wert auf eine sichere Nutzung.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-2 text-sm text-purple-300 font-medium px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                      <ShieldCheck className="w-4 h-4" /> Verschlüsselte Verbindung
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </LazySection>

          <LazySection className="py-20 bg-gradient-to-b from-[#16162a] to-[#0F0F1E] relative border-t border-white/5">
            <ErrorBoundary>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Warum ist unsere IPTV stabil?</h2>
               </div>
              <WhyChooseUsSectionDE title="Warum ist unsere IPTV stabil?" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="py-20 bg-[#0F0F1E] relative border-t border-white/5">
            <ErrorBoundary>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Stabile IPTV ohne Unterbrechung</h2>
               </div>
              <MassiveChannelArchiveSectionDE title="Stabile IPTV ohne Unterbrechung" />
            </ErrorBoundary>
          </LazySection>

          <LazySection className="bg-[#0F0F1E] relative border-t border-white/5 z-20">
            <ErrorBoundary>
              <div className="container mx-auto px-4 mb-8 text-center sr-only">
                 <h2 className="text-2xl font-bold">Premium IPTV Anbieter Deutschland</h2>
               </div>
              <HomePageSeoContentDE title="Premium IPTV Anbieter Deutschland" />
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
        
        <FooterDE 
          contactData={safeSiteData.contactData} 
          siteData={safeSiteData} 
        />
        
        {safeSiteData.chatBotData?.enabled && (
             <ChatBot 
                chatData={safeSiteData.chatBotData} 
                contactData={safeSiteData.contactData} 
             />
        )}
      </div>
    </>
  );
};

export default memo(HomePageDE);
