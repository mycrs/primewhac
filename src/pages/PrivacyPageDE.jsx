import React, { useEffect } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  EyeOff,
  Lock,
  Cpu,
  Server,
  UserCheck,
  Cookie,
  Trash2,
  FileCheck,
  HelpCircle,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const PrivacyPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Datenschutzrichtlinie | QruzeTV DSGVO & Datensicherheit",
    description: "Datenschutzerklärung von QruzeTV: Strikte Zero-Log-Richtlinie, DSGVO-Konformität, 256-Bit-SSL-Verschlüsselung und Recht auf Löschung persönlicher Daten.",
    keywords: ["datenschutz", "dsgvo streaming", "zero log iptv", "datensicherheit", "recht auf vergessenwerden"],
    ogType: "article"
  };

  const sections = [
    {
      icon: ShieldCheck,
      title: "1. Datenschutzverpflichtung (DSGVO-Konformität)",
      subsections: [
        {
          subtitle: "Schutz Ihrer Privatsphäre",
          content: "QruzeTV respektiert die digitale Privatsphäre seiner Nutzer als grundlegendes Recht. Sämtliche Verarbeitungen personenbezogener Daten erfolgen in strikter Übereinstimmung mit der europäischen Datenschutz-Grundverordnung (DSGVO)."
        }
      ]
    },
    {
      icon: EyeOff,
      title: "2. Strikte Zero-Log-Richtlinie (Keine Protokollierung des Sehverhaltens)",
      subsections: [
        {
          subtitle: "Vollständige Anonymität beim Streaming",
          content: "Auf der QruzeTV-Plattform werden zu keinem Zeitpunkt Protokolle darüber geführt, welche Medieninhalte oder Streams der Nutzer aufruft. Ihr Seh- und Nutzungsverhalten wird WEDER PROTOKOLLIERT, NOCH GESPEICHERT ODER PROFILIERT."
        },
        {
          subtitle: "Direkte Protokollverbindung",
          content: "Die Datenübertragung erfolgt direkt zwischen dem Endgerät des Nutzers und dem jeweiligen Protokoll; unsere Plattform greift nicht in den Datenstrom ein."
        }
      ]
    },
    {
      icon: Lock,
      title: "3. Erhobene Daten und Verwendungszwecke",
      subsections: [
        {
          subtitle: "Aktivierungs- und Kontaktdaten",
          content: "Für die Kontobereitstellung und den technischen Kundendienst erheben wir ausschließlich erforderliche Kontaktdaten wie Name, E-Mail-Adresse und ggf. WhatsApp/Telefonnummer."
        },
        {
          subtitle: "Technische Verbindungssicherheit",
          content: "Zur Gewährleistung der Serversicherheit und zur Abwehr unbefugter Zugriffe werden anonymisierte IP-Adressen und Gerätetypen (Smart TV, Android, iOS) auf technischer Ebene temporär erfasst."
        }
      ]
    },
    {
      icon: Cpu,
      title: "4. Künstliche Intelligenz (KI) & Anonyme Telemetrie",
      subsections: [
        {
          subtitle: "Verarbeitung ohne Personenbezug",
          content: "Die in unserer Plattform eingesetzten KI-Algorithmen verarbeiten keinerlei personenbezogene Daten. Sie dienen ausschließlich der hardwarebeschleunigten Wiedergabeoptimierung und der Fehlererkennung im Schnittstellenbetrieb."
        }
      ]
    },
    {
      icon: Server,
      title: "5. Datensicherheit & 256-Bit-SSL-Verschlüsselung",
      subsections: [
        {
          subtitle: "Ende-zu-Ende-Sicherheit",
          content: "Sämtliche Web- und Bestellprozesse werden durch moderne 256-Bit-SSL/TLS-Verschlüsselung geschützt. Unsere Server werden durch Web Application Firewalls (WAF) gegen Angriffe geschirmt."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "6. Kein Datenverkauf an Dritte",
      subsections: [
        {
          subtitle: "Ausschluss kommerzieller Weitergabe",
          content: "Nutzerdaten werden unter keinen Umständen an Werbenetzwerke, Datenhändler oder externe Marketingagenturen verkauft, vermietet oder weitergegeben."
        }
      ]
    },
    {
      icon: Trash2,
      title: "7. Nutzerrechte: Auskunft & Recht auf Vergessenwerden",
      subsections: [
        {
          subtitle: "Vollständige Löschung auf Anfrage",
          content: "Sie haben gemäß Art. 17 DSGVO jederzeit das Recht, unentgeltlich Auskunft über Ihre gespeicherten Daten zu erhalten oder deren vollständige, unwiderrufliche Löschung ('Recht auf Vergessenwerden') zu verlangen."
        }
      ]
    },
    {
      icon: HelpCircle,
      title: "8. Kontakt zum Datenschutzbeauftragten",
      subsections: [
        {
          subtitle: "Direkter Ansprechpartner",
          content: "Bei Fragen zur Erhebung, Verarbeitung oder Löschung Ihrer Daten erreichen Sie unser Datenschutz-Team jederzeit unter privacy@qruzetv.com."
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                DSGVO-KONFORME DATENSCHUTZRICHTLINIE
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Datenschutz und <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">Datensicherheit</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
                QruzeTV garantiert eine strikte <strong>Zero-Log-Richtlinie</strong>. Wir protokollieren Ihr Sehverhalten nicht; die Erhebung technischer Daten erfolgt ausschließlich nach den Grundsätzen der europäischen DSGVO.
              </p>
            </div>

            {/* Zero-Log Banner */}
            <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0d1813]/90 via-[#101915]/90 to-[#0c120f]/90 border border-emerald-500/30 shadow-xl shadow-emerald-500/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <EyeOff className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base mb-1.5">
                    Garantierte Zero-Log-Privatsphäre
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Unsere Server erfassen <strong>keine Streaming-Historie, keine Nutzungszeiten und keine individuellen Sehgewohnheiten</strong>. Technische KI-Telemetrie dient ausschließlich der Stabilität der Schnittstellen.
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
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-black/40 p-4 sm:p-5 rounded-xl border border-white/5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

            {/* Privacy Contact Direct Box */}
            <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0f1814]/90 to-[#0a100d]/90 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  DSGVO-DATENSCHUTZANFRAGEN
                </span>
                <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1.5">
                  Auskunfts- und Löschanfragen
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Für die Löschung oder Einsichtnahme in Ihre bei uns geführten Stammdaten wenden Sie sich bitte an unsere Datenschutzstelle.
                </p>
              </div>
              <a
                href="mailto:privacy@qruzetv.com"
                className="shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>privacy@qruzetv.com</span>
              </a>
            </div>

            {/* Footer Links */}
            <div className="mt-10 p-6 rounded-2xl bg-[#121218]/60 border border-white/5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link to="/de/terms/" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                📄 AGB & Nutzungsbedingungen
              </Link>
              <Link to="/de/sss/" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                ❓ FAQ
              </Link>
              <Link to="/de/pakete/" className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold transition-all border border-emerald-500/30">
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

export default PrivacyPageDE;
