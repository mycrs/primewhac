
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import SearchBarDE from '@/components/what-to-watch-de/SearchBarDE';
import FilterAndSortDE from '@/components/what-to-watch-de/FilterAndSortDE';
import TVShowsGridDE from '@/components/what-to-watch-de/TVShowsGridDE';
import MoviesGridDE from '@/components/what-to-watch-de/MoviesGridDE';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Film, Tv, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatToWatchPageDE = ({ siteData }) => {
  const [activeTab, setActiveTab] = useState('tv');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    if (type) setActiveTab(type);
  };

  const metadata = {
    title: "Was soll ich schauen? - Serien und Filme entdecken",
    description: "Entdecke die besten Serien und Filme. Finde neue Inhalte basierend auf Genre, Jahr und Bewertung.",
    keywords: ["Was soll ich schauen", "Filme", "Serien", "Streaming", "Empfehlungen"],
    ogType: "website"
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-pink-500/30 selection:text-pink-200">
      <SEOHead {...metadata} />
      <HeaderDE contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

      <style>
        {`
          .premium-seo-container-de {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
            opacity: 0.95;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border-radius: 30px;
            background-blend-mode: overlay;
            max-width: 900px;
            margin: 60px auto;
            transition: all 0.3s ease;
            padding: 80px 40px;
          }
          @media (max-width: 767px) {
            .premium-seo-container-de { padding: 40px 20px; margin: 40px 15px; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .premium-seo-container-de { padding: 60px 30px; margin: 50px 20px; }
          }
          
          .premium-h1-de {
            color: #ffffff;
            font-size: 42px;
            font-weight: 800;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
            margin-bottom: 30px;
            text-align: center;
          }
          @media (max-width: 767px) {
             .premium-h1-de { font-size: 32px; }
          }
          
          .premium-h2-de {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            margin-top: 40px;
            margin-bottom: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 15px;
          }
          @media (max-width: 767px) {
             .premium-h2-de { font-size: 24px; }
          }
          
          .premium-h3-de {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            margin-top: 25px;
            margin-bottom: 15px;
          }
          @media (max-width: 767px) {
             .premium-h3-de { font-size: 18px; }
          }
          
          .premium-p-de {
            color: rgba(255, 255, 255, 0.95);
            font-size: 16px;
            line-height: 1.9;
            margin-bottom: 20px;
            text-align: justify;
            font-weight: 400;
          }
          
          .premium-link-de {
            color: #ffffff;
            text-decoration: underline;
            font-weight: 600;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: color 0.3s ease, text-shadow 0.3s ease;
          }
          .premium-link-de:hover {
            color: #ffd700;
          }
          
          .premium-btn-de {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #333333;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            text-decoration: none;
          }
          .premium-btn-de:hover {
            background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
            box-shadow: 0 12px 35px rgba(255, 215, 0, 0.6);
            transform: translateY(-2px);
          }
        `}
      </style>

      <main className="pt-32 pb-20">
        <section className="container mx-auto px-4 mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Was soll ich schauen?
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Entdecke die besten Serien und Filme. Finde deinen nächsten Lieblingsinhalt ganz einfach.
            </p>
            <SearchBarDE onSearch={handleSearch} />
          </motion.div>
        </section>

        <section className="container mx-auto px-4 relative z-10">
          <Tabs defaultValue="tv" value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQuery(''); }} className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-slate-900 border border-slate-800 rounded-full p-1.5 h-auto shadow-xl">
                <TabsTrigger value="tv" className="data-[state=active]:bg-pink-600 px-8 py-3 rounded-full text-base font-bold data-[state=active]:text-white text-slate-400 transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-pink-600/30">
                  <Tv className="w-5 h-5 mr-2" /> Beliebte Serien
                </TabsTrigger>
                <TabsTrigger value="movie" className="data-[state=active]:bg-pink-600 px-8 py-3 rounded-full text-base font-bold data-[state=active]:text-white text-slate-400 transition-all data-[state=active]:shadow-lg data-[state=active]:shadow-pink-600/30">
                  <Film className="w-5 h-5 mr-2" /> Beliebte Filme
                </TabsTrigger>
              </TabsList>
            </div>

            {!searchQuery && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <FilterAndSortDE type={activeTab} onFilterChange={setFilters} />
              </motion.div>
            )}

            <TabsContent value="tv" className="mt-0 outline-none">
              <TVShowsGridDE filters={filters} searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="movie" className="mt-0 outline-none">
              <MoviesGridDE filters={filters} searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </section>

        {/* Premium SEO Text Section - BOTTOM */}
        <section className="container mx-auto px-4 mt-16 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="premium-seo-container-de"
          >
            <h2 className="premium-h1-de">
              Was soll ich schauen? Die besten Serien und Filme auf IPTV
            </h2>
            
            <p className="premium-p-de">
              Wer kennt es nicht? Nach einem langen, anstrengenden Tag möchte man sich einfach nur auf der Couch entspannen, den Fernseher einschalten und abschalten. Doch dann stellt sich immer wieder dieselbe Frage: „Was soll ich schauen?“. Bei der schier endlosen Auswahl an Streaming-Diensten, Mediatheken und Live-TV-Sendern verbringt man oft mehr Zeit mit Suchen als mit dem eigentlichen Ansehen. Genau hier bietet IPTV die perfekte Lösung. Mit einer riesigen, gut sortierten Bibliothek an Inhalten aus aller Welt haben Sie die besten Serien- und Filmempfehlungen stets griffbereit.
            </p>

            <h2 className="premium-h2-de">
              Beliebte Serien entdecken
            </h2>
            <p className="premium-p-de">
              Für Serienjunkies ist IPTV ein wahres Paradies. Von weltweiten Erfolgsformaten bis hin zu lokalen Geheimtipps finden Sie alles auf einem Bildschirm vereint. Doch welche Genres lohnen sich besonders? Hier sind einige Kategorien, die Ihnen bei der Entscheidung helfen:
            </p>

            <h3 className="premium-h3-de">
              Internationale Top-Serien
            </h3>
            <p className="premium-p-de">
              Verfolgen Sie die globalen TV-Trends hautnah. Emmy-prämierte Dramen, fesselnde Sci-Fi-Epen, atemberaubende Thriller und urkomische Sitcoms warten auf Sie. Mit IPTV können Sie die beliebtesten internationalen Serien oft zeitgleich mit der US-Premiere oder als kompletten Binge-Watching-Marathon genießen. Ob mit Untertiteln oder in der Synchronfassung – erstklassiges Entertainment ist garantiert.
            </p>

            <h3 className="premium-h3-de">
              Fesselnde Dokumentationen
            </h3>
            <p className="premium-p-de">
              Für all jene, die Unterhaltung mit Wissen verbinden möchten, bieten Dokumentarserien faszinierende Einblicke. Entdecken Sie packende True-Crime-Geschichten, atemberaubende Naturdokumentationen oder tiefgründige historische Analysen. Erstklassige Doku-Sender stehen Ihnen rund um die Uhr zur Verfügung.
            </p>

            <h2 className="premium-h2-de">
              Die besten Filmempfehlungen für jeden Geschmack
            </h2>
            <p className="premium-p-de">
              Holen Sie sich das Kinoerlebnis direkt ins Wohnzimmer. Unsere Filmempfehlungen lassen keine Wünsche offen – von aktuellen Blockbustern frisch aus dem Kino bis hin zu zeitlosen Klassikern der Filmgeschichte.
            </p>

            <h3 className="premium-h3-de">
              Actionfilme voller Adrenalin
            </h3>
            <p className="premium-p-de">
              Drehen Sie die Soundanlage auf und erleben Sie explosive Action, rasante Verfolgungsjagden und epische Superhelden-Kämpfe. Mit hochauflösenden Actionfilmen wird Ihr Heimkino zum ultimativen Erlebnisort.
            </p>

            <h3 className="premium-h3-de">
              Komödien für die ganze Familie
            </h3>
            <p className="premium-p-de">
              Um den Alltagsstress zu vergessen, gibt es nichts Besseres als ein herzhaftes Lachen. Von romantischen Komödien bis hin zu tiefschwarzem Humor finden Sie garantiert den passenden Film für einen unterhaltsamen Abend mit Freunden oder der Familie.
            </p>

            <h2 className="premium-h2-de">
              4K und UHD Inhalte in Spitzenqualität
            </h2>
            <p className="premium-p-de">
              Nicht nur die Auswahl, sondern auch die Bildqualität ist entscheidend für den perfekten TV-Abend. Mit 4K- und UHD-IPTV-Streams nutzen Sie das volle Potenzial Ihres modernen Fernsehers. Erleben Sie viermal mehr Details als bei Standard-HD, tiefere Farben und flüssigere Bewegungen – ideal für Sportübertragungen, bildgewaltige Filme und anspruchsvolle Serien.
            </p>

            <h2 className="premium-h2-de">
              IPTV Pakete für grenzenloses Streaming
            </h2>
            <p className="premium-p-de">
              Machen Sie Schluss mit der endlosen Suche und der Frage "Was soll ich schauen?". Mit unserer fortschrittlichen Server-Technologie, Anti-Freeze-Funktion und einem gigantischen VOD- und Live-TV-Archiv bieten wir Ihnen unvergleichliches digitales Entertainment. Sport, Dokus, Kino, Kinderkanäle und vieles mehr – alles vereint in einem einzigen Abonnement.
            </p>
            <p className="premium-p-de mb-8">
              Finden Sie jetzt die passende Lösung für Ihr Budget und Ihre Bedürfnisse. Besuchen Sie unsere <Link to="/packages" className="premium-link-de">IPTV Pakete</Link>-Seite und verwandeln Sie Ihren Fernseher, Ihr Tablet oder Ihr Smartphone in das ultimative Entertainment-Center.
            </p>

            <div className="text-center mt-10">
              <Link 
                to="/packages" 
                className="premium-btn-de"
              >
                <Play className="w-5 h-5 fill-current" /> Pakete ansehen
              </Link>
            </div>
          </motion.div>
        </section>

      </main>

      <FooterDE contactData={siteData?.contactData} siteData={siteData} />
    </div>
  );
};

export default WhatToWatchPageDE;
