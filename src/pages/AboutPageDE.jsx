import React from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Tv, Server, Zap, HeartHandshake, Headphones as HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPageDE = ({ siteData }) => {
  const metadata = {
    title: "Premium IPTV Anbieter Deutschland - Stabile & 4K IPTV Services",
    description: "Als führender Premium IPTV Anbieter Deutschland bieten wir stabile IPTV Verbindungen und 4K IPTV Service. Ihr Experte, wenn Sie IPTV kaufen Deutschland möchten.",
    keywords: ["Premium IPTV Anbieter Deutschland", "stabile IPTV", "4K IPTV Service", "IPTV kaufen Deutschland", "IPTV Europa", "QruzeTV"],
    ogType: "website"
  };

  const sections = [
    {
      id: "wer-wir-sind",
      title: "Wer wir sind - Premium IPTV Anbieter",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      content: "Wir sind QruzeTV – Ihr verlässlicher und langfristig ausgerichteter Premium IPTV Anbieter Deutschland, der sich darauf spezialisiert hat, klassisches Fernsehen in ein modernes, flexibles und grenzenloses Streaming-Erlebnis zu verwandeln. Schon seit vielen Jahren begleiten wir unsere Kundinnen und Kunden in Deutschland, Europa und weltweit mit stabilen IPTV Lösungen und haben auf diesem Weg eine starke, stetig wachsende Community aufgebaut. Von Beginn an war unsere Vision klar: Wir möchten nicht einfach nur ein weiterer IPTV Dienst sein, sondern der Partner, auf den sich deutschsprachige und insbesondere türkischsprachige Zuschauer jederzeit verlassen können, egal ob sie in Deutschland, in der Türkei oder im Ausland leben. Unser interdisziplinäres Expertenteam aus Netzwerkingenieuren, Content-Spezialisten und Support-Profis arbeitet Tag und Nacht daran, unser Angebot weiter zu perfektionieren, unsere Serverinfrastruktur zu stärken und die Benutzerfreundlichkeit kontinuierlich zu verbessern. Vertrauen, Transparenz, Datensicherheit und technische Exzellenz bilden die vier Säulen unserer Unternehmensphilosophie – genau darum entscheiden sich immer mehr Haushalte bewusst für QruzeTV als ihren bevorzugten Premium IPTV Anbieter."
    },
    {
      id: "stabile-verbindung",
      title: "Stabile IPTV Verbindung - Unsere Garantie",
      icon: <Zap className="w-8 h-8 text-primary" />,
      content: "Eine konstant stabile IPTV Verbindung ist das Herzstück unseres Angebots und die Basis für jedes überzeugende Erlebnis mit QruzeTV. Wir wissen aus Erfahrung, wie ärgerlich Ruckler, Bildausfälle oder plötzliche Unterbrechungen beim entscheidenden Tor, beim Finale einer Serie oder während eines Familienabends sind. Deshalb investieren wir gezielt in modernste Anti-Freeze-Technologien, intelligentes Server-Load-Balancing und redundante, europaweit verteilte Netzwerke, um eine dauerhaft stabile IPTV Übertragung sicherzustellen. Unsere Monitoring-Systeme analysieren den Datenverkehr in Echtzeit, erkennen Engpässe proaktiv und leiten die Streams automatisch über die optimalen Routen um, noch bevor Sie als Nutzer etwas davon bemerken. Das Ergebnis ist eine stabile IPTV Verbindung mit einer angestrebten Verfügbarkeit von über 99 %, die auch zu Stoßzeiten – etwa an Wochenenden oder bei großen Sportereignissen – zuverlässig funktioniert. Genau diese technische Konsequenz unterscheidet QruzeTV von vielen kurzfristigen Anbietern am Markt."
    },
    {
      id: "4k-service",
      title: "4K IPTV Service - Höchste Qualität",
      icon: <Tv className="w-8 h-8 text-primary" />,
      content: "Mit unserem 4K IPTV Service heben wir Ihr Fernseherlebnis auf ein völlig neues Niveau. QruzeTV bietet Ihnen Zugriff auf eine umfangreiche Auswahl an nationalen und internationalen HD Kanal Angeboten, Live-Sport, Nachrichten, Serien, Dokumentationen und Filmen – und das in brillanter 4K-, Full-HD- und HD-Qualität, sofern Ihr Endgerät und Ihre Internetverbindung dies unterstützen. Dank moderner Encoding- und Transcoding-Verfahren liefern wir gestochen scharfe Bilder, satte Farben und flüssige Bewegungen, die Ihr Wohnzimmer in ein echtes Heimkino verwandeln. Gleichzeitig sorgt adaptives Streaming dafür, dass sich die Bildqualität dynamisch an Ihre verfügbare Bandbreite anpasst, sodass Sie auch bei schwankender Verbindung ein möglichst stabiles und angenehmes Seherlebnis genießen. Unser Ziel ist es, den Begriff „Premium IPTV Anbieter Deutschland“ mit authentisch hochwertiger Bild- und Tonqualität zu füllen – und diese Qualität Tag für Tag reproduzierbar zu machen."
    },
    {
      id: "warum-wir",
      title: "Warum IPTV kaufen Deutschland bei uns?",
      icon: <Target className="w-8 h-8 text-primary" />,
      content: "Wenn Sie den Kauf eines IPTV-Abos in Deutschland in Erwägung ziehen, sollten Sie bei der Auswahl Ihres Anbieters keine Kompromisse eingehen. Es geht nicht nur um den günstigsten Preis, sondern vor allem um Stabilität, Servicequalität, Datensicherheit und langfristige Zuverlässigkeit. QruzeTV vereint diese Faktoren in einem durchdachten Gesamtkonzept: Wir bieten Ihnen eine große Senderauswahl mit vielen deutschsprachigen und internationalen Inhalten, eine klar strukturierte und leicht verständliche Plattform sowie einen Kundenservice, der diesen Namen auch verdient. Versteckte Kosten, intransparente Vertragsklauseln oder unangenehme Überraschungen auf der Rechnung lehnen wir konsequent ab. Stattdessen setzen wir auf nachvollziehbare Pakete, faire Konditionen und eine Nutzungsphilosophie, die auf Vertrauen und Partnerschaft basiert. Der Kauf eines IPTV-Abos bei QruzeTV bedeutet: Einloggen, wohlfühlen und hochwertiges Entertainment genießen – ohne Kopfschmerzen, ohne Kleingedrucktes, ohne Umwege."
    },
    {
      id: "unsere-werte",
      title: "Unsere Werte und Verpflichtungen",
      icon: <HeartHandshake className="w-8 h-8 text-primary" />,
      content: "Unsere Werte sind der Kompass für jede Entscheidung, die wir bei QruzeTV treffen. Wir verstehen uns nicht als anonymer Massenanbieter, sondern als langfristiger Partner für alle, die eine stabile und hochwertige IPTV Lösung suchen. Deshalb setzen wir auf Ehrlichkeit, Fairness und Respekt im Umgang mit unseren Kunden – unabhängig davon, ob es sich um einen neuen Interessenten oder einen langjährigen Stammkunden handelt. Ihr Feedback ist uns besonders wichtig: Wir analysieren regelmäßig Rückmeldungen aus Deutschland, Europa und der türkischen Community im Ausland, um unsere Kanallisten, unsere Serverperformance und neue Funktionen gezielt zu verbessern. So stellen wir sicher, dass unser 4K IPTV Service nicht nur heute, sondern auch in Zukunft den steigenden Anforderungen moderner Zuschauer gerecht wird. Jeder Kunde ist für uns mehr als eine Vertragsnummer – er ist Teil einer Community, die QruzeTV gemeinsam stark macht."
    },
    {
      id: "infrastruktur",
      title: "Europäische Server-Infrastruktur",
      icon: <Server className="w-8 h-8 text-primary" />,
      content: "Als Premium IPTV Anbieter Deutschland betreiben wir eine moderne, europäisch ausgerichtete Server-Infrastruktur, die speziell auf die Anforderungen von IPTV Streaming optimiert ist. Wir nutzen dedizierte Hochleistungsserver an strategischen Standorten in Europa, um Latenzzeiten zu reduzieren, Umschaltzeiten zu verkürzen und Ausfallsicherheit zu erhöhen. Durch diese Nähe zu unseren Nutzern – sowohl in Deutschland als auch im restlichen Europa – stellen wir sicher, dass Streams schnell aufgebaut und stabil übertragen werden können. Redundante Systeme, regelmäßige Wartungsfenster und vorausschauende Kapazitätsplanung sorgen dafür, dass QruzeTV auch in Spitzenzeiten leistungsfähig bleibt. Für unsere Nutzer bedeutet das: Eine technische Basis, der sie mit gutem Gewissen vertrauen können."
    },
    {
      id: "24-7-support",
      title: "Exzellenter Kundenservice",
      icon: <HeadphonesIcon className="w-8 h-8 text-primary" />,
      content: "Ein hochwertiger 4K IPTV Service endet nicht bei der Technik – er steht und fällt mit dem Service dahinter. Unser mehrsprachiges Support-Team steht Ihnen deshalb 24/7 zur Seite, um Sie bei allen Fragen rund um Einrichtung, Gerätelage, Paketwahl und Fehlerbehebung zu unterstützen. Ganz gleich, ob Sie gerade erst den Kauf eines IPTV-Abos planen oder bereits seit Jahren zufriedener QruzeTV Kunde sind: Wir nehmen uns Zeit für Ihre Anliegen, erklären verständlich und suchen nach pragmatischen Lösungen. Sie erreichen uns über verschiedene Kanäle, damit Sie den Kommunikationsweg wählen können, der am besten zu Ihrem Alltag passt. Unser Anspruch ist es, dass Sie sich bei uns nicht wie eine Nummer im System fühlen, sondern wie ein Partner, dessen Zufriedenheit im Zentrum unseres Handelns steht."
    }
  ];

  return (
    <>
      <SEOHead 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType={metadata.ogType}
      />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans overflow-x-hidden text-white">
        <HeaderDE contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        
        <main id="main-content" className="flex-grow pt-24 pb-16">
          {/* Hero Section - Contains the single H1 for the page */}
          <section className="relative py-16 md:py-24 overflow-hidden" aria-label="Giriş Bölümü">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e50914]/20 via-[#0a0a0a] to-[#0a0a0a] z-0"></div>
             <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                        <span className="text-primary font-bold text-sm tracking-widest uppercase">QruzeTV Corporate</span>
                    </div>
                    {/* Primary H1: This is the ONLY H1 on the page */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-lg">
                        Premium IPTV Anbieter Deutschland - <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">Stabile & 4K IPTV Services</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                        Als führender Premium IPTV Anbieter in Deutschland bieten wir stabile IPTV Verbindungen und 4K IPTV Service auf höchstem Niveau. Wenn Sie ein zuverlässiges IPTV-Abo in Deutschland suchen, sind Sie bei uns genau richtig. Mit jahrelanger Erfahrung und modernster Technologie garantieren wir Ihnen absolut zuverlässige Streaming-Erlebnisse in kristallklarer 4K-Qualität. Unser Fokus liegt darauf, Ihnen grenzenloses Entertainment ohne Kompromisse zu liefern – sicher, extrem schnell und jederzeit verfügbar.
                    </p>
                </motion.div>
             </div>
          </section>

          {/* Content Sections */}
          <section className="container mx-auto px-4 relative z-10 max-w-5xl">
            <div className="space-y-12 md:space-y-16">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#0a0a0a]/50 border border-white/5 rounded-2xl p-6 md:p-10 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 bg-primary/30 p-4 rounded-2xl border border-primary/20">
                      {section.icon}
                    </div>
                    <div>
                      {/* Section titles correctly use H2 for hierarchy */}
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{section.title}</h2>
                      <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Section (Conclusion/CTA) */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 bg-gradient-to-br from-[#e50914]/40 to-[#0a0a0a] border border-primary/30 rounded-2xl p-8 md:p-12 text-center shadow-2xl"
            >
                {/* Conclusion title correctly uses H2 */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ihr Entertainment, unsere Leidenschaft</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
                    Bereit für das ultimative Fernseherlebnis? Vertrauen Sie unserem Premium IPTV Service in Deutschland für garantierte stabile IPTV Übertragungen und einen atemberaubenden 4K IPTV Service, der all Ihre Erwartungen übertreffen wird. Der Kauf eines IPTV-Abos in Deutschland war noch nie so einfach, sicher und absolut zuverlässig wie heute. Schließen Sie sich jetzt unseren Tausenden rundum zufriedener Kunden an und revolutionieren Sie Ihr tägliches Entertainment-Erlebnis noch heute mit der besten Qualität auf dem gesamten Markt!
                </p>
                <Link to="/de/pakete" className="inline-block px-8 py-4 bg-primary hover:bg-primary text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/50">
                    Premium Pakete entdecken
                </Link>
            </motion.div>

          </section>
        </main>

        <FooterDE contactData={siteData?.contactData} siteData={siteData} />
      </div>
    </>
  );
};

export default AboutPageDE;