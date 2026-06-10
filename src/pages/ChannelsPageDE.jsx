import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Tv, Film, Globe, Compass, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import ChatBot from '@/components/ChatBot';
import AllChannels from '@/components/AllChannels';
import ChannelsPageContent from '@/components/ChannelsPageContent';
import HomePageSeoContent from '@/components/HomePageSeoContent';
import SEOHead from '@/components/SEOHead';
import { channelsPageSchemasDE } from '@/utils/seoSchema';
import { Button } from '@/components/ui/button';
import { useTestModal } from '@/contexts/TestModalContext';

const ChannelsPageDE = ({ siteData }) => {
  const { channelsData, contactData, siteTexts, chatBotData, seoData } = siteData;
  const { openTestModal } = useTestModal();
  
  // Apply smooth scrolling to the HTML element when this page mounts
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  
  const pageSeo = seoData?.channels_de || {};
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

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 selection:bg-white/20">
        <HeaderDE contactData={contactData} />
        
        <main className="flex-grow pt-20">
          
          {/* HERO SECTION */}
          <section className="relative min-h-[70vh] lg:min-h-screen flex items-center justify-center overflow-hidden border-b border-white/10 pt-10 pb-20">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a]" />
            
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#141414]/25 rounded-full blur-[120px] mix-blend-screen pointer-events-none"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-[#141414]/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"
            />

            <div className="container mx-auto px-4 relative z-10 text-center mt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-md p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
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
                  Entdecken Sie unsere Sender <ArrowDown className="w-3 h-3 ml-1" />
                </motion.div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 drop-shadow-sm leading-tight">
                  Premium IPTV Kanäle Deutschland <br className="hidden md:block" />
                  <span className="text-[#e50914]">Live TV in 4K Qualität</span>
                </h1>
                
                <div className="text-base md:text-xl text-slate-300 mb-10 leading-relaxed max-w-4xl mx-auto font-light space-y-4 text-justify md:text-center">
                  <p>
                    Entdecken Sie unsere umfangreiche Auswahl an <strong>Premium IPTV Kanälen</strong> für Deutschland und Europa. Von packendem <strong>Live TV IPTV</strong> bis zu faszinierenden <strong>internationalen TV Sendern</strong> – wir bieten Ihnen alles in atemberaubender <strong>4K Qualität</strong>. Wenn Sie nach der besten Möglichkeit suchen, <strong>IPTV Kanäle Deutschland</strong> zu erleben, sind Sie bei uns genau richtig. Unser Service garantiert Ihnen nicht nur eine gigantische Sendervielfalt, sondern auch absolute Stabilität ohne lästiges Ruckeln oder Ausfälle.
                  </p>
                  <p>
                    Genießen Sie exklusive <strong>Premium IPTV Sender</strong> aus den Bereichen Sport, Film, Dokumentation und Unterhaltung direkt auf Ihrem Smart-TV, Smartphone oder Tablet. Unsere <strong>4K IPTV Kanäle</strong> setzen neue Maßstäbe in der Bildqualität und bringen das Kinoerlebnis direkt in Ihr Wohnzimmer. Verabschieden Sie sich von teuren Kabelverträgen und erleben Sie die Zukunft des Fernsehens. Ob nationale Highlights, spannende Live-Sport-Events oder eine riesige Auswahl an <strong>internationalen TV Sendern</strong> für Expats und Sprachbegeisterte – unser IPTV-Service deckt jeden Bedarf ab.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                  <Button 
                    size="lg"
                    onClick={openTestModal}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold px-10 py-7 rounded-full text-lg shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:shadow-[0_0_40px_rgba(229,9,20,0.45)] transition-all duration-300"
                  >
                    <Play className="mr-2 h-6 w-6 fill-current" />
                    Kostenlos testen
                  </Button>
                  <Link to="/de/pakete" className="w-full sm:w-auto">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 text-white font-bold px-10 py-7 rounded-full text-lg transition-all duration-300"
                    >
                      Premium IPTV Paket wählen
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CHANNELS GRID SECTION */}
          <AllChannels channels={channelsData} siteTexts={siteTexts} />
          
          {/* COMPACT CHANNEL CATEGORIES SEO INFO SECTION (MOVED TO BOTTOM) */}
          <section id="channel-categories-info" className="py-12 bg-[#0a0a0a] border-b border-t border-white/5">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Die unglaubliche Vielfalt unserer Sender</h2>
                <p className="text-slate-400 text-sm md:text-base">
                  Unsere <strong>IPTV Kanäle Deutschland</strong> bieten beste Unterhaltung, gestochen scharfe Bilder und eine gigantische Auswahl.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                {/* Sports */}
                <div className="bg-[#0a0a0a]/50 p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Tv className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Sport & Live TV IPTV</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Erleben Sie pure Spannung mit erstklassigen Sport- und <strong>Live TV IPTV</strong> Sendern. Verpassen Sie kein wichtiges Sportereignis dank hochauflösender Qualität und absoluter Zuverlässigkeit.
                    </p>
                  </div>
                </div>

                {/* Movies */}
                <div className="bg-[#0a0a0a]/50 p-5 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <Film className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Filme & Serien in 4K</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Genießen Sie Hollywood-Blockbuster und Serien auf unseren dedizierten <strong>4K IPTV Kanälen</strong>. Entdecken Sie erstklassiges Entertainment in brillanter Bildqualität direkt in Ihrem Heimkino.
                    </p>
                  </div>
                </div>

                {/* Documentary */}
                <div className="bg-[#0a0a0a]/50 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#141414]/20 rounded-xl flex items-center justify-center">
                    <Compass className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Dokumentationen & Wissen</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Erweitern Sie Ihren Horizont mit unseren <strong>Premium IPTV Kanälen</strong> für Dokumentationen und Wissenschaft. Die brillante Schärfe lässt Sie tief in faszinierende Geschichten eintauchen.
                    </p>
                  </div>
                </div>

                {/* International */}
                <div className="bg-[#0a0a0a]/50 p-5 rounded-2xl border border-white/5 hover:border-[#e50914]/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#e50914]/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#e50914]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Internationale TV Sender</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Bleiben Sie mit der Heimat verbunden durch unsere riesige Auswahl an <strong>internationalen TV Sendern</strong>. Wir bieten Ihnen <strong>IPTV Kanäle Deutschland</strong> und aus der ganzen Welt in höchster Qualität.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM CTA SECTION */}
          <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#e50914] to-transparent opacity-50"></div>
             
             <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center bg-[#0a0a0a]/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-primary/20 shadow-2xl">
                   <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Bereit für die Zukunft des Fernsehens?</h2>
                   <div className="text-lg text-slate-300 mb-10 leading-relaxed space-y-4 text-justify md:text-center">
                     <p>
                       Genießen Sie alle <strong>Premium IPTV Sender</strong> mit unserem absolut zuverlässigen und hochmodernen Service. Die Zeiten von schlechtem Empfang und begrenzter Programmauswahl sind endgültig vorbei. Mit unserem Angebot an <strong>IPTV Kanälen Deutschland</strong> und unzähligen <strong>internationalen TV Sendern</strong> sichern Sie sich die Zukunft des Entertainments.
                     </p>
                     <p>
                       Egal, ob Sie packendes <strong>Live TV IPTV</strong> für das nächste große Derby suchen oder entspannte Abende mit unseren <strong>4K IPTV Kanälen</strong> verbringen möchten – wir haben das perfekte Angebot für Sie. Überzeugen Sie sich von der erstklassigen Qualität, der enormen Sendervielfalt und unserem engagierten Kundenservice. Warten Sie nicht länger und machen Sie den Schritt in eine neue Dimension des Fernsehens. Wählen Sie jetzt Ihr Paket für dauerhaften Genuss oder testen Sie kostenlos und völlig unverbindlich unsere überragende Streaming-Qualität. Starten Sie noch heute!
                     </p>
                   </div>
                   
                   <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                     <Link to="/de/pakete" className="w-full sm:w-auto">
                        <Button 
                          className="w-full sm:w-auto bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold px-10 py-7 rounded-full text-lg shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:shadow-[0_0_40px_rgba(229,9,20,0.45)] transition-all duration-300 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Jetzt Premium IPTV Paket wählen
                        </Button>
                     </Link>
                     <Button 
                        variant="outline"
                        onClick={openTestModal}
                        className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 text-white font-bold px-10 py-7 rounded-full text-lg transition-all duration-300 flex items-center justify-center"
                     >
                        <Play className="w-5 h-5 mr-2" />
                        Kostenlos testen
                     </Button>
                   </div>
                </div>
             </div>
          </section>

          {/* MIDDLE SEO CONTENT SECTION (IPTV Quality Info) */}
          <ChannelsPageContent />

          {/* BOTTOM SEO CONTENT SECTION */}
          <div className="bg-[#0a0a0a] relative z-20 border-t border-white/5">
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