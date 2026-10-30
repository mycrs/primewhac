import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import DeviceSelectionSection from '@/components/installation/DeviceSelectionSection';
import InstallationPageSeoSection from '@/components/installation/InstallationPageSeoSection';
import {
  Wifi,
  Tv,
  KeyRound,
  DownloadCloud,
  Zap,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SetupPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const metadata = {
    title: "IPTV einrichten — Alle TVs und Geräte | QruzeTV",
    description: "Anleitungen für Samsung, LG, Philips, Vestel, Hisense, TCL, Android TV, Fire TV, iPhone und Computer – passend zum Betriebssystem.",
    keywords: ["IPTV Einrichtungsanleitung", "IPTV Setup Deutschland", "Samsung TV IPTV", "LG TV IPTV", "Philips TV IPTV", "Vestel TV IPTV", "Hisense TV IPTV", "TCL TV IPTV"],
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
          "text": "IPTV kann auf unterstützten Samsung-, LG-, Philips-, Vestel-, Hisense- und TCL-Modellen sowie Android TV, Fire TV Stick, iPhone, iPad, Android-Smartphone, Windows PC, Mac und Tablets genutzt werden. Die App-Verfügbarkeit hängt von Modell, Betriebssystem und Region ab."
        }
      }
    ]
  };

  return (
    <>
      <SEOHead {...metadata} jsonLd={[faqSchema]} />
      <div className="min-h-screen bg-[#070709] flex flex-col font-sans text-slate-200 selection:bg-primary/40">
        <HeaderDE contactData={siteData?.contactData} />
        
        <main className="flex-grow w-full pt-20">
          {/* Artisan Hero Section */}
          <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e50914]/15 via-[#180a0c]/30 to-transparent pointer-events-none -z-10" />

            <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/30 text-[#ff4d58] mb-5 shadow-[0_0_25px_rgba(229,9,20,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  SCHRITT-FÜR-SCHRITT SETUP & ANLEITUNGEN
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight text-white drop-shadow-sm leading-tight">
                  IPTV Einrichtungsanleitung <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ff4b55]">Deutschland</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl font-normal max-w-3xl mx-auto leading-relaxed text-slate-300">
                  Schritt-für-Schritt Setup für Smart TVs, Fire TV, Android, Apple und PCs. In wenigen Minuten 4K Streaming starten.
                </p>
              </motion.div>

              {/* Bespoke Obsidian Reassurance Pills */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-[#121217]/85 border border-white/10 hover:border-primary/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-md">
                  <Zap className="w-4 h-4 text-[#ff4b55]" />
                  <span className="text-white text-xs sm:text-sm font-medium">5 Min. Schnelleinrichtung</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">Alle Smart-TVs & Boxen</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-blue-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-md">
                  <Headphones className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">24/7 Persönlicher Support</span>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16 max-w-7xl relative z-10">
            <div className="mb-8">
              <BreadcrumbNavigation 
                customCrumbs={[
                  { name: 'Startseite', path: '/de' },
                  { name: 'Einrichtung', path: null }
                ]} 
              />
            </div>

            {/* Prerequisites Section (DE) */}
            <motion.div
              className="mb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {[
                {
                  icon: Wifi,
                  title: 'Internetverbindung',
                  desc: 'Min. 16 Mbit/s stabil (LAN-Verbindung für 4K UHD empfohlen)',
                  badge: 'Min 16 Mbit/s',
                  badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                },
                {
                  icon: Tv,
                  title: 'Endgerät',
                  desc: 'Samsung, LG, Philips, Fire TV, Android TV, iOS, Windows, Mac',
                  badge: 'Breite Kompatibilität',
                  badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
                },
                {
                  icon: KeyRound,
                  title: 'Zugangsdaten',
                  desc: 'M3U-Playlist-URL oder Xtream-Codes-API via WhatsApp / E-Mail',
                  badge: 'Sofortige Übermittlung',
                  badgeColor: 'text-[#ff4b55] border-primary/30 bg-primary/10',
                },
                {
                  icon: DownloadCloud,
                  title: 'Player-App',
                  desc: 'Offizielle App wie TiviMate, IBO Player, Smarters Pro oder NEXT+',
                  badge: 'Offizieller Store',
                  badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#121217]/80 border border-white/10 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                          <Icon className="w-5 h-5 text-slate-200" />
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
            
            {/* Device showroom */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden bg-[#101015]/60 border border-white/10 shadow-2xl p-2 sm:p-4 mb-16"
            >
              <DeviceSelectionSection selectedDevice="" onSelect={() => {}} asLinks />
            </motion.div>

            {/* Articles and guide content */}
            <motion.article 
              className="mt-16 md:mt-24 bg-[#101015]/75 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="prose prose-invert prose-lg max-w-none">
                <span className="text-xs uppercase tracking-widest text-[#ff4b55] font-semibold mb-2 block not-prose">
                  DETAILLIERTER LEITFADEN
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 border-b border-white/10 pb-3">
                  Smart TV IPTV installieren - Detaillierte Anleitung
                </h2>
                <p className="text-slate-300 mb-8 leading-relaxed font-light text-sm sm:text-base">
                  Die Einrichtung von IPTV auf einem Smart TV (wie Samsung, LG oder Android TV) ist der komfortabelste Weg, um sofort in die Welt des modernen Fernsehens einzutauchen. Für ein erfolgreiches Smart TV IPTV Setup benötigen Sie lediglich eine kompatible Player-App aus dem jeweiligen App Store (z. B. IBO Player, IPTV Smarters, Flix IPTV) und Ihre persönlichen Zugangsdaten. Laden Sie die App herunter, öffnen Sie diese und geben Sie die M3U-URL oder die Xtream Codes API ein. Sobald die Verbindung hergestellt ist, lädt die App automatisch alle verfügbaren Sender, Filme und Serien.
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-6 border-b border-white/10 pb-3">
                  Stabile IPTV Verbindung einrichten & 4K Streaming
                </h2>
                <p className="text-slate-300 mb-8 font-light leading-relaxed text-sm sm:text-base">
                  Eine stabile IPTV Verbindung ist essenziell, um Pufferungen und Verbindungsabbrüche beim Streaming zu vermeiden. Für die bestmögliche Stabilität empfehlen wir dringend, Ihr Endgerät direkt per LAN-Kabel mit dem Router zu verbinden. Für Standard-HD-Streaming sind mindestens 16 Mbit/s erforderlich, während für hochauflösende 4K-Inhalte eine konstante Downloadrate von 25-50 Mbit/s ideal ist.
                </p>

                {/* Artisan DE CTA Lounge */}
                <div className="mt-12 p-8 sm:p-10 bg-gradient-to-b from-[#180f12]/95 to-[#0b0809]/98 rounded-2xl border border-primary/30 shadow-2xl text-center flex flex-col items-center not-prose">
                  <span className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mb-4">
                    <Flame className="w-5 h-5 text-[#ff4b55]" />
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">
                    Bereit für erstklassiges Entertainment?
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mb-8 leading-relaxed font-light">
                    Wählen Sie jetzt das für Sie passende Europa-Paket oder testen Sie unsere 4K Streaming-Qualität unverbindlich auf Ihrem eigenen Gerät.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center max-w-md">
                    <Link 
                      to="/de/pakete" 
                      className="px-6 py-3.5 bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white font-bold rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                    >
                      Pakete ansehen <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                      to="/de/test" 
                      className="px-6 py-3.5 bg-[#141419] hover:bg-[#1c1c24] text-white font-semibold rounded-xl text-sm transition-all duration-300 border border-white/15 flex items-center justify-center"
                    >
                      Kostenlos testen
                    </Link>
                    <Link 
                      to="/de/sss" 
                      className="px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all duration-300 border border-white/10 flex items-center justify-center"
                    >
                      Häufige Fragen
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
