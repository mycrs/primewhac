import React, { useEffect } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';

const TermsPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Nutzungsbedingungen | Rechtliche Informationen",
    description: "Nutzungsbedingungen und rechtliche Informationen für unseren IPTV Service.",
    keywords: ["nutzungsbedingungen", "agb", "iptv rechtliches"],
    ogType: "article"
  };

  const sections = [
    {
      title: "Servicebeschreibung",
      subsections: [
        { subtitle: "Umfang", content: "QruzeTV ist eine digitale Plattform, die Live-Fernsehübertragungen und VOD-Inhalte über das Internetprotokoll bereitstellt." },
        { subtitle: "Geräte", content: "Kompatibel mit Smart TV, Android, iOS, Windows und Mac." }
      ]
    },
    {
      title: "Verantwortung des Benutzers",
      subsections: [
        { subtitle: "Kontosicherheit", content: "Die Benutzer sind voll verantwortlich für die Sicherheit ihrer Kontoinformationen." }
      ]
    },
    {
      title: "Zahlungsbedingungen",
      subsections: [
        { subtitle: "Preise", content: "Die Paketpreise entsprechen den Angaben auf unserer Website." }
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
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 leading-tight">
                Nutzungsbedingungen
              </h1>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Willkommen auf der QruzeTV Plattform. Durch den Besuch unserer Website oder den Kauf unserer <strong>IPTV-Pakete</strong> stimmen Sie den folgenden <strong>Nutzungsbedingungen</strong> zu.
                </p>

                {sections.map((section, idx) => (
                  <div key={idx} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">
                      {section.title}
                    </h2>
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="mb-6 bg-[#0a0a0a]/20 p-4 rounded-xl border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-orange-300 mb-2">
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
                  <Link to="/de/privacy" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Datenschutzrichtlinie</Link>
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

export default TermsPageDE;