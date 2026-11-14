import React, { useEffect } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  ServerOff,
  Layers,
  Scale,
  Lock,
  CreditCard,
  Zap,
  FileText,
  HelpCircle,
  AlertTriangle,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const TermsPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Nutzungsbedingungen und AGB | QruzeTV Rechtliche Hinweise",
    description: "Allgemeine Nutzungsbedingungen von QruzeTV: Erklärung zu KI-generierten Medien, keine Speicherung fremder TV-Inhalte, DMCA-Notice-and-Takedown und Haftungsgrenzen.",
    keywords: ["nutzungsbedingungen", "agb", "iptv rechtliches", "ki medien erklärung", "dmca notice takedown", "haftungsausschluss streaming"],
    ogType: "article"
  };

  const sections = [
    {
      icon: Cpu,
      title: "1. Dienstbeschreibung und KI-generierte Medien-Erklärung",
      subsections: [
        {
          subtitle: "Technologie- und Player-Plattform",
          content: "QruzeTV ist ein unabhängiger Technologie- und Softwareanbieter für Streaming-Player-Protokolle, M3U/Xtream-Schnittstellen und KI-gestützte digitale Mediensimulationen. Die Plattform dient der Verwaltung und Organisation nutzereigener Abspiellisten."
        },
        {
          subtitle: "Ausschließliche Nutzung von KI- und lizenzfreien Inhalten",
          content: "Alle auf dieser Plattform präsentierten Medienkataloge, Vorschauen, Bilder und Begleittexte wurden ausschließlich mittels künstlicher Intelligenz (KI) und unabhängigen lizenzfreien (Royalty-Free) Quellen generiert. Sie stellen originäre digitale Vermögenswerte von QruzeTV dar."
        }
      ]
    },
    {
      icon: ServerOff,
      title: "2. Keine Speicherung urheberrechtlich geschützter Inhalte (Zero-Hosting)",
      subsections: [
        {
          subtitle: "Ausschluss fremder Übertragungen",
          content: "Auf den Servern von QruzeTV werden zu keinem Zeitpunkt urheberrechtlich geschützte TV-Signale, verschlüsselte Satellitenübertragungen oder kommerzielle Film-/Serienproduktionen Dritter gespeichert, gehostet, weitergeleitet oder vervielfältigt."
        },
        {
          subtitle: "Reine Vermittler- und Host-Provider-Rolle",
          content: "QruzeTV fungiert gemäß internationalen E-Commerce- und Telemediengesetzen als reiner technischer Schnittstellen- und Protokolldienstleister (Host-Provider)."
        }
      ]
    },
    {
      icon: Layers,
      title: "3. Nutzergenerierte externe M3U-Streams & Haftungsausschluss",
      subsections: [
        {
          subtitle: "Eigenverantwortung für externe URLs",
          content: "Externe M3U-Wiedergabelisten, Server-URLs oder Streaming-Adressen, die der Nutzer eigenständig in seine Abspielsoftware einbindet, unterliegen der alleinigen Verantwortung des jeweiligen Nutzers."
        },
        {
          subtitle: "Keine Prüfung fremder Inhalte",
          content: "QruzeTV führt keine inhaltliche oder rechtliche Vorabprüfung externer, vom Nutzer eingebundener URLs durch und übernimmt hierfür keinerlei Haftung."
        }
      ]
    },
    {
      icon: Scale,
      title: "4. Urheberrecht (DMCA) & Notice-and-Takedown-Verfahren",
      subsections: [
        {
          subtitle: "Schutz des geistigen Eigentums",
          content: "QruzeTV respektiert das geistige Eigentum Dritter und befolgt die Grundsätze des Digital Millennium Copyright Act (DMCA) sowie der EU-Urheberrechtsrichtlinie im Rahmen des Notice-and-Takedown-Verfahrens."
        },
        {
          subtitle: "Meldung von Rechtsverletzungen",
          content: "Rechteinhaber können Beschwerden mit entsprechendem Berechtigungsnachweis an dmca@qruzetv.com senden. Berechtigte Hinweise werden innerhalb von 24 bis 48 Stunden geprüft und beanstandete Referenzen umgehend entfernt."
        }
      ]
    },
    {
      icon: Lock,
      title: "5. Kontosicherheit und persönliche Nutzung",
      subsections: [
        {
          subtitle: "Verbot der gewerblichen Weitergabe",
          content: "Die bereitgestellten Kontoparameter sind ausschließlich für den persönlichen, privaten Gebrauch bestimmt. Die öffentliche Vorführung in gastronomischen Betrieben oder der unautorisierte Weiterverkauf sind untersagt."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "6. Zahlungsbedingungen und Aktivierung",
      subsections: [
        {
          subtitle: "Digitale Bereitstellung",
          content: "Die Freischaltung der Software- und Protokollzugänge erfolgt unmittelbar nach Bestätigung der Zahlung. Widerrufsansprüche für vollständig digital erbrachte Dienstleistungen richten sich nach den gesetzlichen Bestimmungen."
        }
      ]
    },
    {
      icon: Zap,
      title: "7. Verfügbarkeit und Haftungsbeschränkung",
      subsections: [
        {
          subtitle: "Technische Verfügbarkeit",
          content: "Wir streben eine Serververfügbarkeit von 99,9% an. Für globale Netzstörungen, ISP-Drosselungen oder lokale Inkompatibilitäten der Hardware des Endnutzers kann keine Haftung übernommen werden."
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead {...metadata} />
      <div className="min-h-screen bg-[#070709] flex flex-col font-sans text-white selection:bg-[#e50914]/40">
        <HeaderDE contactData={safeSiteData.contactData} />
        
        <main className="flex-grow pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <BreadcrumbNavigation />
            
            {/* Hero Header */}
            <div className="mt-8 mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e50914]/10 border border-[#e50914]/30 text-[#ff4d58] mb-4">
                <ShieldCheck className="w-4 h-4 text-[#ff4d58]" />
                RECHTLICHE HINWEISE & AGB
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Allgemeine <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#ff4b55]">Nutzungsbedingungen</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
                Rechtliche Grundlagen der QruzeTV-Plattform: Bereitstellung von Streaming-Technologien, Erklärung zu KI-generierten Inhalten und der strikte Ausschluss der Speicherung fremder urheberrechtlich geschützter Medien.
              </p>
            </div>

            {/* Safe Harbor Banner */}
            <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#180a0c]/90 via-[#121217]/90 to-[#0d0d12]/90 border border-[#e50914]/30 shadow-xl shadow-[#e50914]/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-[#ff4b55]" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base mb-1.5">
                    Wichtige rechtliche Klarstellung (Zero-Hosting & KI-Medien)
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    QruzeTV ist eine unabhängige Streaming-Technologie- und Protokollplattform. <strong>Auf unseren Servern werden keine geschützten TV-Inhalte oder Satellitensignale Dritter gehostet.</strong> Sämtliche Demonstrationskataloge basieren ausschließlich auf generativer KI und lizenzfreien Quellen.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, idx) => {
                const IconComponent = section.icon;
                return (
                  <article 
                    key={idx}
                    className="p-6 sm:p-8 rounded-2xl bg-[#121218]/80 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
                      <div className="w-9 h-9 rounded-xl bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-[#ff4b55]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-black/40 p-4 sm:p-5 rounded-xl border border-white/5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#ff4b55] shrink-0" />
                            <span>{sub.subtitle}</span>
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed m-0 font-normal">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* DMCA Direct Box */}
            <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#15121e]/90 to-[#0e0c14]/90 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold block mb-1">
                  DMCA & URHEBERRECHT
                </span>
                <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1.5">
                  Notice-and-Takedown Anfragen
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Sollten Sie der Ansicht sein, dass Inhalte Ihre Urheberrechte berühren, senden Sie Ihre Mitteilung bitte direkt an unsere Rechtsabteilung.
                </p>
              </div>
              <a
                href="mailto:dmca@qruzetv.com"
                className="shrink-0 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>dmca@qruzetv.com</span>
              </a>
            </div>

            {/* Footer Links */}
            <div className="mt-10 p-6 rounded-2xl bg-[#121218]/60 border border-white/5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link to="/de/privacy/" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                🔒 Datenschutz
              </Link>
              <Link to="/de/sss/" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                ❓ FAQ
              </Link>
              <Link to="/de/pakete/" className="px-5 py-2.5 rounded-xl bg-[#e50914]/20 hover:bg-[#e50914]/30 text-[#ff4b55] text-xs sm:text-sm font-bold transition-all border border-[#e50914]/30">
                ⚡ Pakete
              </Link>
            </div>
          </div>
        </main>
        
        <FooterDE contactData={safeSiteData.contactData} />
      </div>
    </>
  );
};

export default TermsPageDE;
