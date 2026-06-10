import React, { useEffect } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { Check, X, Star, Zap } from 'lucide-react';
import { breadcrumbSchema } from '@/utils/seoSchema';

const ComparisonPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: 'IPTV Pakete im Vergleich | Welches Abo passt zu Ihnen?',
    description:
      'Vergleichen Sie IPTV-Pakete: Basis, Standard und Premium. Funktionen, Preise, Vorteile und alle Details auf einen Blick — für Deutschland und Europa.',
    keywords: ['IPTV Pakete', 'IPTV Preise', 'IPTV Vergleich', 'bestes IPTV', 'Premium IPTV Deutschland'],
    ogType: 'article',
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Startseite', path: '/de' },
    { name: 'Pakete', path: '/de/pakete' },
    { name: 'Vergleich', path: '/de/vergleich' },
  ]);
  const jsonLd = [
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'IPTV Pakete im Vergleich — Welches Abo passt zu Ihnen?',
      author: { '@type': 'Organization', name: 'QruzeTV' },
    },
  ];

  const features = [
    { name: 'Live-Sender', basic: '10.000+', standard: '10.000+', premium: '10.000+' },
    { name: 'Film- & Serienarchiv (VOD)', basic: 'Begrenzt', standard: 'Umfangreich', premium: 'Unbegrenzt (VIP VOD)' },
    { name: 'Stream-Auflösung', basic: 'SD & HD', standard: 'Full HD', premium: '4K & UHD' },
    { name: 'Anti-Freeze-Infrastruktur', basic: false, standard: true, premium: true },
    { name: 'Catch-up (Zeitversetzt)', basic: false, standard: '24 Stunden', premium: '72 Stunden' },
    { name: 'Gleichzeitige Geräte', basic: '1', standard: '1', premium: '2' },
    { name: 'Erwachsenenkanäle', basic: 'Nein', standard: 'Optional', premium: 'Passwortgeschützt' },
    { name: 'Prioritäts-Support (WhatsApp)', basic: false, standard: false, premium: true },
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <HeaderDE contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />

        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <BreadcrumbNavigation
              customCrumbs={[
                { name: 'Startseite', path: '/de' },
                { name: 'Pakete', path: '/de/pakete' },
                { name: 'Vergleich', path: null },
              ]}
            />

            <article className="mt-8 bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] leading-tight">
                IPTV Pakete im Vergleich — Welches Abo passt zu Ihnen?
              </h1>

              <div className="prose prose-invert prose-lg max-w-none mb-12">
                <p className="text-slate-300 leading-relaxed">
                  Das passende <strong>IPTV Abo</strong> zu finden, das zu Ihrem Budget und Ihren Gewohnheiten passt, ist nicht immer einfach. In diesem Vergleich zeigen wir die Unterschiede zwischen unseren <strong>IPTV Paketen</strong> in Tabellen und kurzen Erklärungen — damit Sie eine fundierte Entscheidung für <strong>stabiles Premium IPTV</strong> in Deutschland treffen können.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-2">Warum ein Paketvergleich wichtig ist</h2>
              <p className="text-slate-300 mb-10">
                Nicht jeder schaut gleich viel Sport, Serien oder Filme. Ein Vergleich hilft, nicht für Funktionen zu zahlen, die Sie nicht nutzen — und trotzdem die richtige Qualität (HD, Full HD oder 4K) zu wählen.
              </p>

              <div className="overflow-x-auto mb-16 rounded-xl border border-slate-700">
                <table className="w-full text-left border-collapse bg-[#0a0a0a]/30">
                  <thead>
                    <tr>
                      <th className="p-4 bg-[#0a0a0a] text-slate-300 font-bold border-b border-slate-700">Funktionen</th>
                      <th className="p-4 bg-[#0a0a0a] text-center font-bold border-b border-slate-700 text-slate-300">Basis</th>
                      <th className="p-4 bg-[#0a0a0a] text-center font-bold border-b border-slate-700 text-blue-400">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="w-4 h-4" /> Standard
                        </div>
                      </th>
                      <th className="p-4 bg-[#0a0a0a] text-center font-bold border-b border-slate-700 text-yellow-400">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4" /> Premium VIP
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-[#0a0a0a]/50 transition-colors">
                        <td className="p-4 text-slate-300 font-medium">{feature.name}</td>
                        <td className="p-4 text-center text-slate-400">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            feature.basic
                          )}
                        </td>
                        <td className="p-4 text-center text-slate-200">
                          {typeof feature.standard === 'boolean' ? (
                            feature.standard ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            feature.standard
                          )}
                        </td>
                        <td className="p-4 text-center font-bold text-yellow-100">
                          {typeof feature.premium === 'boolean' ? (
                            feature.premium ? (
                              <Check className="w-5 h-5 text-yellow-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            feature.premium
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Basis-Paket</h2>
              <p className="text-slate-300 mb-8">
                Ideal für Einsteiger mit begrenztem Budget: nationale Sender und Sport im Fokus. VOD ist eingeschränkter, 4K ist nicht enthalten.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Standard-Paket</h2>
              <p className="text-slate-300 mb-8">
                Unser meistgewähltes Paket: Full HD, Anti-Freeze-Server und 24 Stunden Catch-up für verpasste Sendungen.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Premium VIP</h2>
              <p className="text-slate-300 mb-8">
                Für maximale Qualität: zwei Geräte gleichzeitig, großes 4K-VOD-Archiv, 72 Stunden Catch-up und priorisierter Support.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Welches Paket passt zu Ihnen?</h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-2 mb-8">
                <li>Nur Nachrichten und Basis-Sport: <strong>Basis</strong></li>
                <li>Full HD auf dem Smart TV ohne Ruckler: <strong>Standard</strong></li>
                <li>Mehrere Nutzer oder Geräte parallel: <strong>Premium VIP</strong></li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Upgrade & Downgrade</h2>
              <p className="text-slate-300 mb-8">
                Ein Upgrade (z. B. von Basis auf Standard) ist jederzeit gegen Aufpreis möglich. Downgrades erfolgen in der Regel bei der Verlängerung. Kontaktieren Sie unseren WhatsApp-Support für Änderungen.
              </p>

              <div className="mt-12 p-8 bg-[#0a0a0a]/50 rounded-2xl border border-slate-700 flex flex-wrap gap-4">
                <Link to="/de/pakete" className="px-6 py-3 bg-primary hover:bg-primary text-white font-bold rounded-lg transition-colors">
                  Pakete kaufen
                </Link>
                <Link
                  to="/de/einrichtung"
                  className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600"
                >
                  Einrichtung
                </Link>
                <Link
                  to="/de/sss"
                  className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600"
                >
                  FAQ
                </Link>
              </div>
            </article>
          </div>
        </main>
        <FooterDE contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default ComparisonPageDE;
