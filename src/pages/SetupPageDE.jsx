import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import DeviceSelectionSection from '@/components/installation/DeviceSelectionSection';
import InstallationPageSeoSection from '@/components/installation/InstallationPageSeoSection';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SetupPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const metadata = {
    title: "IPTV einrichten in 5 Min — Samsung, LG, Fire TV | QruzeTV",
    description: "Türkisches IPTV auf Samsung, LG, Fire TV Stick, Apple TV & Android einrichten — Schritt für Schritt auf Deutsch, in 5 Minuten live.",
    keywords: ["IPTV Einrichtungsanleitung", "IPTV Setup Deutschland", "Smart TV IPTV", "stabile IPTV Verbindung", "4K IPTV Einrichtung"],
    ogType: "website"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wie richtet man IPTV ein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Laden Sie die passende IPTV-App (Tivimate, 000 Player, IPTV Smarters, VLC) herunter. Geben Sie Ihren M3U-Link oder Xtream-Codes-Daten ein. Die Kanäle werden automatisch geladen."
        }
      },
      {
        "@type": "Question",
        "name": "Auf welchen Geräten funktioniert IPTV?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IPTV funktioniert auf Android TV, Fire TV Stick, iPhone, iPad, Android-Smartphone, Windows PC, Mac, Samsung/LG Smart TV und Tablets."
        }
      }
    ]
  };

  return (
    <>
      <SEOHead {...metadata} jsonLd={[faqSchema]} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200">
        <HeaderDE contactData={siteData?.contactData} />
        
        <main className="flex-grow w-full">
          
          <section className="relative min-h-[50vh] lg:min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 overflow-hidden pt-32">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/40 via-[#0a0a0a] to-[#b20710]/40 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-cover bg-center opacity-[0.03] mix-blend-overlay"></div>
            
            <div className="container relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mb-6 flex justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(229,9,20,0.15)]">
                    Anleitungen & Richtlinien
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] tracking-tight">
                  IPTV Einrichtungsanleitung Deutschland - Schritt für Schritt Setup
                </h1>
                <p className="text-lg md:text-xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                  Entdecken Sie unsere umfassende IPTV Einrichtungsanleitung für Deutschland. In wenigen Schritten richten Sie Ihr Smart TV IPTV ein und genießen stabile Streams in 4K Qualität. Unsere detaillierte Anleitung führt Sie durch jeden Schritt der IPTV Setup Deutschland - von der Geräteauswahl bis zur Fehlerbehebung. Egal ob Android TV, Smart TV oder andere Geräte: Mit dieser IPTV Einrichtungsanleitung meistern Sie die Installation problemlos.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 max-w-7xl relative z-10">
            <div className="mb-8">
              <BreadcrumbNavigation 
                customCrumbs={[
                  { name: 'Startseite', path: '/de' },
                  { name: 'Einrichtung', path: null }
                ]} 
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center text-white">IPTV Setup Deutschland - Geräte auswählen</h2>
              <p className="text-slate-400 text-center mb-10 max-w-3xl mx-auto leading-relaxed">
                Wählen Sie Ihr Gerät aus unserer umfassenden Liste. Jedes Gerät hat spezifische Anforderungen für die IPTV Einrichtung. Unsere IPTV Setup Deutschland Anleitung ist für alle gängigen Geräte optimiert - von Smart TVs über Android Boxen bis zu Tablets und Smartphones.
              </p>
              
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-slate-800 p-2">
                <DeviceSelectionSection selectedDevice="" onSelect={() => {}} asLinks />
              </div>
            </motion.div>

            <motion.article 
              className="mt-24 bg-[#0a0a0a]/60 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="prose prose-invert prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-white mb-6 border-b border-slate-800 pb-3">Smart TV IPTV installieren - Detaillierte Anleitung</h2>
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  Die Einrichtung von IPTV auf einem Smart TV (wie Samsung, LG oder Android TV) ist der komfortabelste Weg, um sofort in die Welt des modernen Fernsehens einzutauchen. Für ein erfolgreiches Smart TV IPTV Setup benötigen Sie lediglich eine kompatible Player-App aus dem jeweiligen App Store (z. B. IBO Player, IPTV Smarters, Flix IPTV) und Ihre persönlichen Zugangsdaten. Laden Sie die App herunter, öffnen Sie diese und geben Sie die M3U-URL oder die Xtream Codes API ein. Sobald die Verbindung hergestellt ist, lädt die App automatisch alle verfügbaren Sender, Filme und Serien. Achten Sie darauf, dass Ihr Fernseher über ausreichend Speicherplatz verfügt und immer die aktuellste Firmware installiert ist, um eine reibungslose Leistung zu garantieren.
                </p>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-slate-800 pb-3">Stabile IPTV Verbindung einrichten</h2>
                <p className="text-slate-300 mb-8 font-light leading-relaxed">
                  Eine stabile IPTV Verbindung ist essenziell, um Pufferungen und Verbindungsabbrüche beim Streaming zu vermeiden. Für die bestmögliche Stabilität empfehlen wir dringend, Ihr Endgerät direkt per LAN-Kabel mit dem Router zu verbinden, da WLAN-Signale oft durch Wände oder andere elektronische Geräte gestört werden. Stellen Sie sicher, dass Ihre Internetgeschwindigkeit für Ihre Bedürfnisse ausreicht: Für Standard-HD-Streaming sind mindestens 16 Mbit/s erforderlich, während für hochauflösende 4K-Inhalte eine konstante Downloadrate von 50 Mbit/s oder mehr ideal ist. Überprüfen Sie zudem, ob Ihr Internetdienstanbieter (ISP) Streaming-Dienste drosselt. Ein zuverlässiger VPN-Dienst kann helfen, mögliche Drosselungen zu umgehen und eine dauerhaft stabile IPTV Verbindung aufrechtzuerhalten.
                </p>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-slate-800 pb-3">4K IPTV Einrichtung - Anforderungen und Tipps</h2>
                <p className="text-slate-300 mb-8 font-light leading-relaxed">
                  Die 4K IPTV Einrichtung erfordert eine zuverlässige Internetverbindung und kompatible Hardware, um das maximale visuelle Erlebnis zu gewährleisten. Sie benötigen einen 4K-fähigen Fernseher oder Monitor sowie ein leistungsstarkes Endgerät, das große Datenmengen in Echtzeit verarbeiten kann. Player-Apps wie TiviMate für Android bieten exzellente Unterstützung für 4K-Streams und nutzen Hardware-Beschleunigung effektiv. Stellen Sie in den App-Einstellungen sicher, dass Hardware-Decoding aktiviert ist. Da 4K-Inhalte eine extrem hohe Bandbreite beanspruchen, ist eine schnelle und unterbrechungsfreie Internetverbindung (idealerweise über 100 Mbit/s) Pflicht. Wenn Sie diese Faktoren berücksichtigen, genießen Sie gestochen scharfe Bilder, brillante Farben und flüssige Bewegungen bei jedem Stream.
                </p>

                <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-b border-slate-800 pb-3">Vor der Installation & Fehlerbehebung</h2>
                <p className="text-slate-300 mb-8 font-light leading-relaxed">
                  Mit unserer IPTV Einrichtungsanleitung haben Sie alle notwendigen Informationen für eine stabile IPTV Verbindung. Bevor Sie mit der Installation beginnen, stellen Sie sicher, dass Sie Ihre Zugangsdaten (M3U-Link oder Benutzername/Passwort) griffbereit haben. Sollten Sie nach der Einrichtung Probleme wie schwarze Bildschirme oder asynchronen Ton feststellen, starten Sie zunächst Ihren Router und das Endgerät neu. Oft hilft es auch, den Cache der IPTV-App zu leeren oder eine alternative Player-App zu testen. Unser IPTV Setup Deutschland Service bietet Ihnen vollständige Unterstützung bei jedem Schritt. Bei hartnäckigen Fragen zur Installation oder Fehlerbehebung konsultieren Sie unsere FAQ oder kontaktieren Sie direkt unseren kompetenten Support.
                </p>

                <div className="mt-16 p-10 bg-gradient-to-br from-[#0a0a0a] to-[#141414] rounded-2xl border border-slate-700 shadow-xl text-center flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Bereit für erstklassiges Entertainment?</h3>
                  <p className="text-slate-300 mb-8 max-w-3xl font-light text-lg">
                    Wenn Sie alle Schritte der IPTV Einrichtungsanleitung abgeschlossen haben und Ihr System bereit ist, können Sie nun in die Welt des grenzenlosen Streamings eintauchen. Wählen Sie jetzt das für Sie passende Paket und erleben Sie Entertainment pur.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link 
                      to="/de/pakete" 
                      className="px-8 py-4 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                      Pakete ansehen <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      to="/de/sss" 
                      className="px-8 py-4 bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700 shadow-lg flex items-center justify-center"
                    >
                      Häufig gestellte Fragen
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>

            <InstallationPageSeoSection isDe={true} />
            
          </div>
        </main>
        <FooterDE contactData={siteData?.contactData} siteData={siteData} />
      </div>
    </>
  );
};

export default SetupPageDE;