import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import InstallationPageLayout from '@/components/installation/InstallationPageLayout';
import { useSetupPage } from '@/hooks/useSetupPage';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstallationPageDE = ({ siteData }) => {
  const { fetchSetupPage, setupData, loading } = useSetupPage();

  useEffect(() => {
    fetchSetupPage();
    window.scrollTo(0, 0);
  }, [fetchSetupPage]);

  const metadata = {
    title: "IPTV Installation Deutschland - Schritt für Schritt Anleitung",
    description: "Entdecken Sie unsere einfache IPTV Installation Deutschland Anleitung. In wenigen Schritten richten Sie Ihr Smart TV IPTV Setup ein und genießen stabile Streams.",
    keywords: ["IPTV Installation Deutschland", "IPTV einrichten", "Smart TV IPTV Setup", "stabile IPTV Verbindung", "4K IPTV Einrichtung", "IPTV Installationsanleitung"],
    ogType: "article"
  };

  const jsonLdData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "IPTV einrichten - So funktioniert's",
      "description": "Schritt-für-Schritt IPTV Installation Deutschland für alle Geräte",
      "step": [
        { "@type": "HowToStep", "name": "App herunterladen", "text": "Laden Sie die passende IPTV-Player-App für Ihr Gerät herunter." },
        { "@type": "HowToStep", "name": "Abonnementdaten eingeben", "text": "Geben Sie Ihren Benutzernamen, Ihr Passwort und die URL in die App ein." },
        { "@type": "HowToStep", "name": "Streaming starten", "text": "Warten Sie, bis die Kanäle geladen sind und beginnen Sie mit dem Ansehen." }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "IPTV Installation Deutschland - Schritt für Schritt Anleitung",
      "author": { "@type": "Organization", "name": "QruzeHD" }
    }
  ];

  if (loading && !setupData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLdData} />
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
        <HeaderDE contactData={siteData?.contactData} />
        
        <main className="flex-grow w-full">
          
          {/* Integrated Hero Section */}
          <section className="relative min-h-[50vh] lg:min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden pt-32">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-purple-900/40 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/101cce4586536aa0617e00725d4ba2bc.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
            
            <div className="container relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mb-6 flex justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    Anleitung & Richtlinien
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
                  IPTV Installation Deutschland - Schritt für Schritt Anleitung
                </h1>
                <p className="text-lg md:text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                  Entdecken Sie unsere einfache IPTV Installation Deutschland Anleitung. In wenigen Schritten richten Sie Ihr Smart TV IPTV Setup ein und genießen sofort stabile Streams in Premium-Qualität. Egal ob Sie Anfänger oder Technik-Experte sind, unsere detaillierten Leitfäden führen Sie sicher durch den gesamten Prozess, damit Sie schnellstmöglich Ihr Lieblingsprogramm in 4K erleben können.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 max-w-7xl relative z-10">
            <div className="mb-8">
              <BreadcrumbNavigation 
                customPaths={[
                  { label: 'Startseite', path: '/de' },
                  { label: 'Installation', path: '/de/einrichtung' }
                ]} 
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center text-white">IPTV einrichten - So funktioniert's</h2>
              <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
                Wählen Sie unten Ihr Gerät aus, um die spezifische Anleitung zu erhalten. Wir machen das IPTV einrichten so unkompliziert wie möglich, damit Sie in wenigen Minuten startklar sind.
              </p>
              <InstallationPageLayout siteData={siteData} pageContent={setupData} />
            </motion.div>

            {/* Comprehensive Guide Content */}
            <motion.article 
              className="mt-24 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Mit der sich entwickelnden Technologie haben sich auch unsere Fernsehgewohnheiten völlig verändert. Um ein hochwertiges, unterbrechungsfreies und stabiles Streaming-Erlebnis zu genießen, ist die richtige Konfiguration von großer Bedeutung. Diese umfassende IPTV Installation Deutschland Anleitung erklärt Schritt für Schritt, wie Sie das System auf all Ihren Geräten optimal einrichten können.
                </p>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-slate-800 pb-3">Smart TV IPTV Setup - Einfach und schnell</h2>
                <p className="text-slate-300 mb-6 font-light leading-relaxed">
                  Ein Smart TV IPTV Setup ist heutzutage die beliebteste Methode, um hochauflösendes Fernsehen zu genießen. Die Einrichtung auf Geräten wie Samsung Tizen, LG WebOS oder Android TV ist dank moderner Apps kinderleicht. Sie benötigen keine zusätzliche Hardware wie Receiver oder TV-Boxen. Laden Sie einfach eine der empfohlenen IPTV-Player-Apps aus dem jeweiligen App Store Ihres Fernsehers herunter. Beliebte und zuverlässige Anwendungen sind beispielsweise IBO Player, IPTV Smarters Pro oder Flix IPTV. Nach der Installation der App müssen Sie lediglich Ihre Zugangsdaten – meist in Form einer M3U-URL oder Xtream Codes API – eingeben. Unser System ist darauf ausgelegt, dass die IPTV Installation Deutschland reibungslos verläuft. Innerhalb weniger Minuten synchronisiert die App die Kanallisten, Live-TV-Sender, Filme und Serien direkt auf Ihren Bildschirm. Achten Sie darauf, dass Ihr Fernseher über ausreichend Speicherplatz verfügt und die Firmware stets auf dem neuesten Stand ist, um eine optimale und schnelle Performance beim Umschalten zu gewährleisten.
                </p>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-slate-800 pb-3">Stabile IPTV Verbindung garantiert</h2>
                <p className="text-slate-300 mb-6 font-light leading-relaxed">
                  Eine stabile IPTV Verbindung ist das absolute Herzstück für ein ungetrübtes Streaming-Erlebnis ohne lästiges Ruckeln oder Pufferungen (Buffering). Um dies zu gewährleisten, empfehlen wir dringend, Ihr Empfangsgerät – sei es der Smart TV oder eine Android Box – wenn möglich über ein Ethernet-Kabel (LAN) direkt mit dem Router zu verbinden. WLAN-Verbindungen können durch Wände, andere elektronische Geräte oder benachbarte Netzwerke gestört werden, was zu Aussetzern führen kann. Für reibungsloses Live-TV in Standardqualität reicht oft eine Internetgeschwindigkeit von 16 Mbit/s. Möchten Sie jedoch hochauflösende Inhalte genießen, empfehlen wir eine konstante Downloadrate von mindestens 50 Mbit/s. Überprüfen Sie regelmäßig Ihre Internetgeschwindigkeit und stellen Sie sicher, dass Ihr Internetanbieter (ISP) keine Drosselung für Streaming-Dienste anwendet. Gegebenenfalls kann die Nutzung eines hochwertigen VPN-Dienstes helfen, eine durchgehend stabile IPTV Verbindung zu erhalten und mögliche ISP-Blockaden zu umgehen. So sichern Sie sich stets die beste Übertragungsqualität.
                </p>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-slate-800 pb-3">4K IPTV Einrichtung für beste Qualität</h2>
                <p className="text-slate-300 mb-6 font-light leading-relaxed">
                  Erleben Sie Fernsehen in einer neuen Dimension mit unserer 4K IPTV Einrichtung für beste Qualität. Ultra High Definition (UHD) oder 4K bietet eine viermal höhere Auflösung als herkömmliches Full HD. Um diese atemberaubende Bildqualität zu genießen, muss Ihr gesamtes Setup darauf abgestimmt sein. Zunächst benötigen Sie einen 4K-fähigen Fernseher oder Monitor. Zweitens ist die Wahl der richtigen Player-App entscheidend, da nicht alle Anwendungen große 4K-Streams effizient verarbeiten können. Wir empfehlen leistungsstarke Apps wie TiviMate für Android-Geräte, die Hardware-Beschleunigung optimal nutzen. Stellen Sie in den Einstellungen Ihres Players sicher, dass das Decoding auf Hardware (HW) oder Auto eingestellt ist. Da 4K-Streams große Datenmengen übertragen, ist eine sehr schnelle und absolut stabile Internetverbindung von mindestens 100 Mbit/s unerlässlich. Wenn Sie diese 4K IPTV Einrichtung korrekt durchführen, werden Sie mit kristallklaren Bildern, lebendigen Farben und flüssigen Bewegungen bei Sportübertragungen und Blockbustern belohnt.
                </p>

                <div className="mt-16 p-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl text-center flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Sind Sie bereit für unbegrenztes Entertainment?</h3>
                  <p className="text-slate-300 mb-8 max-w-3xl font-light text-lg">
                    Ihre stabile IPTV Verbindung ist nun bereit. Genießen Sie jetzt die perfekte 4K IPTV Einrichtung und erleben Sie Premium Streaming auf einem völlig neuen Level. Haben Sie Ihr Smart TV IPTV Setup abgeschlossen? Dann wählen Sie jetzt Ihr passendes Paket und starten Sie sofort!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link 
                      to="/de/pakete" 
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                      Jetzt IPTV einrichten & Pakete ansehen <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      to="/de/sss" 
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700 shadow-lg flex items-center justify-center"
                    >
                      Häufig gestellte Fragen
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
            
          </div>
        </main>
        <FooterDE contactData={siteData?.contactData} siteData={siteData} />
      </div>
    </>
  );
};

export default InstallationPageDE;