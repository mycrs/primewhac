
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown } from 'lucide-react';
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
      
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 selection:bg-white/20">
        <Header contactData={contactData} siteTexts={siteTexts} />
        
        <main className="flex-grow pt-20">
          
          {/* HERO SECTION */}
          <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-screen flex items-center justify-center overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a]" />
            
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#e50914]/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"
            />

            <div className="container mx-auto px-4 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto bg-[#0a0a0a]/40 backdrop-blur-md p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#e50914]/30 text-sm font-medium text-white mb-8 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={scrollToInfo}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e50914]"></span>
                  </span>
                  Yayın Kalitemizi İnceleyin <ArrowDown className="w-3 h-3 ml-1" />
                </motion.div>

                {/* SINGLE H1 FOR SEO - Main Page Title */}
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm leading-tight">
                  IPTV Kanal Listesi — <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-[#ff2430] via-[#e50914] to-[#b20710] bg-clip-text text-transparent">10.000+ Canlı Kanal</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                  Dünyanın dört bir yanından 10.000+ premium kanala, 4K ve HD kalitesiyle, donma veya takılma yaşamadan anında ulaşın.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    onClick={openTestModal}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold px-8 py-6 rounded-full text-lg shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:shadow-[0_0_40px_rgba(229,9,20,0.45)] transition-all duration-300"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Hemen Test Et
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Kanalları Keşfet</span>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center p-1"
              >
                <div className="w-1.5 h-3 bg-white/50 rounded-full" />
              </motion.div>
            </motion.div>
          </section>

          {/* REALTIME CHANNEL SLIDER */}
          <ErrorBoundary>
            <ChannelSlider />
          </ErrorBoundary>

          {/* CHANNELS GRID SECTION WITH REAL-TIME */}
          <ErrorBoundary>
            <AllChannels />
          </ErrorBoundary>
          
          {/* MIDDLE SEO CONTENT SECTION (IPTV Quality Info) */}
          <ChannelsPageContent />

          {/* BOTTOM SEO CONTENT SECTION */}
          <div className="bg-[#0a0a0a] relative z-20 border-t border-white/5">
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
