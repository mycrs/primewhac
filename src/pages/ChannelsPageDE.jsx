import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Tv, Film, Globe, Compass, CheckCircle2, Zap, ShieldCheck, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import ChatBot from '@/components/ChatBot';
import AllChannels from '@/components/AllChannels';
import ChannelSlider from '@/components/ChannelSlider';
import MassiveChannelArchiveSectionDE from '@/components/MassiveChannelArchiveSectionDE';
import HomePageSeoContent from '@/components/HomePageSeoContent';
import SEOHead from '@/components/SEOHead';
import ErrorBoundary from '@/components/ErrorBoundary';
import { channelsPageSchemasDE } from '@/utils/seoSchema';
import { turkishChannels } from '@/data/turkishChannels';
import { Button } from '@/components/ui/button';
import { useTestModal } from '@/contexts/TestModalContext';

const ChannelsPageDE = ({ siteData }) => {
  const { channelsData, contactData, siteTexts, chatBotData, seoData } = siteData;
  const { openTestModal } = useTestModal();
  
  // Smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  
  const pageSeo = seoData?.channels_de || {};

  // DE channel descriptions map
  const channelDescriptionsDe = useMemo(() => {
    const map = new Map();
    turkishChannels.forEach((c) => {
      if (c?.name && c?.description_de) map.set(c.name, c.description_de);
    });
    return map;
  }, []);

  const channelsWithGermanDescriptions = useMemo(() => {
    const list = Array.isArray(channelsData) && channelsData.length > 0 ? channelsData : turkishChannels;
    return list.map((ch) => ({
      ...ch,
      description: channelDescriptionsDe.get(ch?.name) || ch?.description_de || ch?.description,
      description_de: ch?.description_de || channelDescriptionsDe.get(ch?.name)
    }));
  }, [channelsData, channelDescriptionsDe]);

  const metadata = {
    title: pageSeo.title || '200+ Türkische Sender live — HD & 4K | QruzeTV',
    description:
      pageSeo.description ||
      'Entdecken Sie unsere Premium IPTV Kanäle für Deutschland und Europa. Von Live TV bis zu internationalen Sendern - alles in 4K Qualität und absolut stabil.',
    keywords: ['IPTV Kanäle', 'Live TV', 'Sport', 'HD', '4K IPTV', 'Kanalliste', 'Deutschland', 'QruzeTV'],
    ogType: 'website',
  };
  const jsonLd = channelsPageSchemasDE(metadata);

  const scrollToInfo = () => {
    const infoSection = document.getElementById('channel-categories-info');
    if (infoSection) {
      infoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#07080b] flex flex-col font-sans text-slate-200 selection:bg-red-500/30 selection:text-white">
        <HeaderDE contactData={contactData} />
        
        <main className="flex-grow pt-20">
          
          {/* ARTISAN OBSIDIAN HERO SECTION DE */}
          <section className="relative min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/5 py-16 md:py-24">
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
                  <span className="truncate">10.000+ SENDER & 4K ANYCAST NETZWERK</span>
                  <ArrowDown className="w-3.5 h-3.5 text-red-400 ml-0.5 flex-shrink-0" />
                </motion.div>

                {/* Main Page Title */}
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] drop-shadow-sm">
                  Premium IPTV Kanalliste — <br className="hidden md:block" />
                  <span className="bg-gradient-to-r from-white via-slate-100 to-red-400 bg-clip-text text-transparent">
                    10.000+ Live Sender
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto font-light">
                  Deutsche, türkische und internationale Sender in gestochen scharfer 4K UHD- und Full HD-Qualität. Keine Ruckler, ultra-niedrige Latenz und 99,9 % Server-Stabilität auf allen Ihren Endgeräten.
                </p>

                {/* 3 Reassurance Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">60 FPS & Ruckelfrei</p>
                      <p className="text-[11px] text-slate-400">Optimierte Bitraten & 4K</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Tv className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Live EPG & Schneller Wechsel</p>
                      <p className="text-[11px] text-slate-400">Echtzeit-Programmübersicht</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">99,9% Uptime Garantie</p>
                      <p className="text-[11px] text-slate-400">Europäische Hochleistungsserver</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg"
                    onClick={openTestModal}
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 py-6 rounded-full text-base md:text-lg shadow-[0_0_35px_rgba(229,9,20,0.4)] hover:shadow-[0_0_50px_rgba(229,9,20,0.6)] transition-all duration-300"
                  >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Kostenlos testen
                  </Button>
                  <Link to="/de/pakete" className="w-full sm:w-auto">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-white/[0.03] hover:bg-white/[0.08] border-white/15 hover:border-white/30 text-white font-bold px-8 py-6 rounded-full text-base md:text-lg transition-all duration-300"
                    >
                      <Layers className="mr-2 h-5 w-5 text-red-400" />
                      Premium IPTV Pakete
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* REALTIME CHANNEL SLIDER DE */}
          <ErrorBoundary>
            <ChannelSlider channels={channelsWithGermanDescriptions} />
          </ErrorBoundary>

          {/* CHANNELS GRID SECTION */}
          <ErrorBoundary>
            <AllChannels channels={channelsWithGermanDescriptions} />
          </ErrorBoundary>
          
          {/* GERMAN MASSIVE CHANNEL ARCHIVE SHOWCASE */}
          <MassiveChannelArchiveSectionDE />

          {/* COMPACT CHANNEL CATEGORIES SEO INFO SECTION */}
          <section id="channel-categories-info" className="py-16 bg-[#07080b] border-t border-white/5">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Die Vielfalt unserer Senderwelten</h2>
                <p className="text-slate-400 text-sm md:text-base">
                  Unsere <strong>IPTV Kanäle Deutschland</strong> bieten beste Unterhaltung, gestochen scharfe Bilder und eine gigantische Programmvielfalt.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sports */}
                <div className="bg-[#0c0d12]/70 p-6 rounded-2xl border border-white/10 hover:border-red-500/30 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 border border-red-500/20">
                    <Tv className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Sport & Live TV IPTV</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Erleben Sie packende Sportereignisse, europäische Ligen und Motorsport dank hochauflösender 60FPS-Qualität und stabiler Anycast-Infrastruktur.
                    </p>
                  </div>
                </div>

                {/* Movies */}
                <div className="bg-[#0c0d12]/70 p-6 rounded-2xl border border-white/10 hover:border-red-500/30 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 border border-red-500/20">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Filme & Serien in 4K</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Genießen Sie Hollywood-Blockbuster und preisgekrönte Serien auf dedizierten <strong>4K IPTV Kanälen</strong> mit Mehrkanal-Tonspuren.
                    </p>
                  </div>
                </div>

                {/* Documentary */}
                <div className="bg-[#0c0d12]/70 p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Dokumentationen & Wissen</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Erweitern Sie Ihren Horizont mit Premium-Kanälen für Natur, Geschichte und Wissenschaft in gestochen scharfer 4K Ultra HD Auflösung.
                    </p>
                  </div>
                </div>

                {/* International */}
                <div className="bg-[#0c0d12]/70 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-colors flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Internationale TV Sender</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Bleiben Sie mit der Heimat verbunden: Unbegrenzte Auswahl an Sendern aus Deutschland, der Türkei, Frankreich, Italien und der Welt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM CTA SECTION DE */}
          <section className="py-20 bg-gradient-to-b from-[#07080b] to-[#0a0a0d] relative overflow-hidden border-t border-white/5">
             <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div className="text-center bg-[#0c0d12]/90 backdrop-blur-xl p-8 md:p-14 rounded-3xl border border-white/10 shadow-2xl">
                   <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-6">
                     Bereit für die Zukunft des Fernsehens?
                   </h2>
                   <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                     Genießen Sie alle Premium-Sender und VOD-Inhalte mit unserem zuverlässigen und modernen Anycast-Streaming-Service ohne Vertragsbindung.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <Link to="/de/pakete" className="w-full sm:w-auto">
                        <Button 
                          className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 py-6 rounded-full text-base md:text-lg shadow-[0_0_30px_rgba(229,9,20,0.35)] transition-all duration-300 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Jetzt Premium IPTV Paket wählen
                        </Button>
                     </Link>
                     <Button 
                        variant="outline"
                        onClick={openTestModal}
                        className="w-full sm:w-auto bg-white/[0.03] hover:bg-white/[0.08] border-white/15 text-white font-bold px-8 py-6 rounded-full text-base md:text-lg transition-all duration-300 flex items-center justify-center"
                     >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Kostenlos testen
                     </Button>
                   </div>
                </div>
             </div>
          </section>

          {/* BOTTOM SEO CONTENT SECTION */}
          <div className="bg-[#07080b] relative z-20 border-t border-white/5">
             <HomePageSeoContent />
          </div>

        </main>
        
        <FooterDE contactData={contactData} siteData={siteData} />
        {chatBotData?.enabled && <ChatBot chatData={chatBotData} contactData={contactData} siteTexts={siteTexts} />}
      </div>
    </>
  );
};

export default ChannelsPageDE;
