import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Layers, Zap, Tv, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import AllChannels from '@/components/AllChannels';
import ChannelSlider from '@/components/ChannelSlider';
import ChannelsPageContent from '@/components/ChannelsPageContent';
import HomePageSeoContent from '@/components/HomePageSeoContent';
import ErrorBoundary from '@/components/ErrorBoundary';
import SEOHead from '@/components/SEOHead';
import { channelsPageSchemas } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';
import { Button } from '@/components/ui/button';
import { useTestModal } from '@/contexts/TestModalContext';

const ChannelsPage = ({ siteData }) => {
  const { contactData, siteTexts, chatBotData, seoData } = siteData;
  const { openTestModal } = useTestModal();
  
  // Apply smooth scrolling to the HTML element when this page mounts
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  
  const pageSeo = seoData?.channels || {};
  const metadata = {
    title: pageSeo.title || "10.000+ IPTV Kanal Listesi — Spor, Dizi, Film | QruzeTV",
    description: pageSeo.description || "QruzeTV kanal listesi: 10.000+ canlı kanal; haber, dizi, film, belgesel, çocuk ve müzik kategorileri. 4K/UHD destekli. Tüm kanalları hemen gör.",
    keywords: ["IPTV kanalları", "canlı TV", "spor kanalları", "HD yayın", "4K IPTV", "kanal listesi", "IPTV kalite"],
    ogImage: pageSeo.ogImage || `${SITE_URL}/og/kanallar.jpg`,
  };
  const jsonLd = channelsPageSchemas(metadata);

  const scrollToInfo = () => {
    const infoSection = document.getElementById('iptv-quality-info');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      
      <div className="min-h-screen bg-[#07080b] flex flex-col font-sans text-slate-200 selection:bg-red-500/30 selection:text-white">
        <Header contactData={contactData} siteTexts={siteTexts} />
        
        <main className="flex-grow pt-20">
          
          {/* ARTISAN OBSIDIAN HERO SECTION */}
          <section className="relative min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 py-16 md:py-24">
            {/* Ambient deep obsidian lighting */}
            <div className="absolute inset-0 bg-[#07080b]" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[25rem] bg-gradient-to-tr from-red-600/15 via-red-900/10 to-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-10 right-10 w-[30rem] h-[20rem] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative bg-[#0c0d12]/80 backdrop-blur-xl p-8 md:p-14 lg:p-16 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                {/* Live Stream Pulse Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-red-500/30 text-[11px] sm:text-xs md:text-sm font-mono font-medium text-slate-200 mb-6 sm:mb-8 cursor-pointer hover:bg-white/[0.08] hover:border-red-500/50 transition-all shadow-sm max-w-full"
                  onClick={scrollToInfo}
                >
                  <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="truncate">10.000+ KANAL & 4K ANYCAST YAYIN AĞI</span>
                  <ArrowDown className="w-3.5 h-3.5 text-red-400 ml-0.5 flex-shrink-0" />
                </motion.div>

                {/* SINGLE H1 FOR SEO - Main Page Title */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-sm">
                  IPTV Kanal Listesi — <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                    10.000+ Canlı Yayın
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
                  Dünyanın dört bir yanından ulusal kanallar, 4K sinema & VOD arşivleri, kesintisiz haber bültenleri ve belgesel serileri. Sıfır donma, 60 FPS Anycast CDN altyapısıyla anında yayında.
                </p>

                {/* 3 Reassurance Luxury Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">60 FPS & Sıfır Donma</p>
                      <p className="text-[11px] text-slate-400">Yüksek bit hızı, 4K desteği</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Tv className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Akıllı EPG & Hızlı Geçiş</p>
                      <p className="text-[11px] text-slate-400">Anlık yayın akışı & rehber</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">%99.9 Uptime Garantisi</p>
                      <p className="text-[11px] text-slate-400">Küresel yedekli sunucular</p>
                    </div>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    onClick={openTestModal}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 py-6 rounded-full text-base md:text-lg shadow-[0_0_35px_rgba(229,9,20,0.4)] hover:shadow-[0_0_50px_rgba(229,9,20,0.6)] transition-all duration-300"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Hemen Ücretsiz Test Et
                  </Button>

                  <Link to="/paketler/" className="w-full sm:w-auto">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-white/[0.03] hover:bg-white/[0.08] border-white/15 hover:border-white/30 text-white font-bold px-8 py-6 rounded-full text-base md:text-lg transition-all duration-300"
                    >
                      <Layers className="mr-2 h-5 w-5 text-red-400" />
                      Paketleri İncele
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 pointer-events-none"
            >
              <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-widest">Aşağı Kaydır</span>
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-9 border border-white/20 rounded-full flex justify-center p-1"
              >
                <div className="w-1 h-2 bg-red-500 rounded-full" />
              </motion.div>
            </motion.div>
          </section>

          {/* REALTIME CHANNEL SLIDER */}
          <ErrorBoundary>
            <ChannelSlider />
          </ErrorBoundary>

          {/* CHANNELS GRID SECTION WITH SEARCH & CATEGORY PILLS */}
          <ErrorBoundary>
            <AllChannels />
          </ErrorBoundary>
          
          {/* MIDDLE SEO CONTENT SECTION (IPTV Quality Info) */}
          <ChannelsPageContent />

          {/* BOTTOM SEO CONTENT SECTION */}
          <div className="bg-[#07080b] relative z-20 border-t border-white/5">
             <HomePageSeoContent />
          </div>

        </main>
        
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
        {chatBotData?.enabled && <ChatBot chatData={chatBotData} contactData={contactData} siteTexts={siteTexts} />}
      </div>
    </>
  );
};

export default ChannelsPage;
