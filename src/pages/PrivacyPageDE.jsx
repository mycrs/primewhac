import React, { useEffect } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';

const PrivacyPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Datenschutzrichtlinie | IPTV Datenschutz und Sicherheit",
    description: "Unsere IPTV-Datenschutzrichtlinie. Erfahren Sie, wie Ihre Daten geschützt und verarbeitet werden.",
    keywords: ["datenschutz", "iptv sicherheit", "datenschutzrichtlinie"],
    ogType: "article"
  };

  const sections = [
    {
      title: "Was ist die Datenschutzrichtlinie?",
      subsections: [
        { subtitle: "Unser Ziel", content: "Wir von QruzeTV respektieren die Privatsphäre aller Besucher. Diese Datenschutzrichtlinie erklärt transparent, wie die bei der Nutzung unserer Dienste erhobenen Daten verarbeitet und geschützt werden." }
      ]
    },
    {
      title: "Erfasste Daten",
      subsections: [
        { subtitle: "Persönliche Daten", content: "Während des Registrierungsprozesses erfassen wir nur grundlegende Informationen wie Ihren Namen, Ihre E-Mail-Adresse und Ihre Telefonnummer." },
        { subtitle: "Technische Daten", content: "Um IPTV-Sicherheit zu gewährleisten, werden technische Metriken wie Ihre IP-Adresse und Ihr Gerätemodell automatisch vom System aufgezeichnet." }
      ]
    },
    {
      title: "Datennutzung",
      subsections: [
        { subtitle: "Dienstbereitstellung", content: "Ihre Daten werden in erster Linie verwendet, um Ihre Abonnementtransaktionen schnell abzuschließen und Ihnen technischen Support zu bieten." }
      ]
    }
  ];

  return (
    <>
      <SEOHead {...metadata} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <HeaderDE contactData={safeSiteData.contactData} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <BreadcrumbNavigation />
            
            <article className="mt-8 bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] leading-tight">
                Datenschutzrichtlinie
              </h1>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-10 leading-relaxed">
                  QruzeTV wendet in Bezug auf <strong>Datenschutz</strong> und <strong>IPTV-Sicherheit</strong> die höchsten Standards der Branche an.
                </p>

                {sections.map((section, idx) => (
                  <div key={idx} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">
                      {section.title}
                    </h2>
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="mb-6 bg-[#0a0a0a]/20 p-4 rounded-xl border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {sub.subtitle}
                        </h3>
                        <p className="text-slate-300 leading-relaxed m-0">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="mt-12 p-8 bg-[#0a0a0a]/50 rounded-2xl border border-slate-700 flex flex-wrap gap-4">
                  <Link to="/de/terms" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Nutzungsbedingungen</Link>
                  <Link to="/de/sss" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">FAQ</Link>
                </div>
              </div>
            </article>
          </div>
        </main>
        <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default PrivacyPageDE;