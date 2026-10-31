import React, { useEffect } from 'react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { BookOpen, Tv, Smartphone, Monitor } from 'lucide-react';
import { breadcrumbSchema } from '@/utils/seoSchema';

const DEVICE_LINKS = [
  { to: '/de/einrichtung/android-tv/', label: 'Android TV' },
  { to: '/de/einrichtung/smart-tv/', label: 'Smart TV (Samsung/LG)' },
  { to: '/de/einrichtung/ios/', label: 'iOS / Apple TV' },
  { to: '/de/einrichtung/android-phone/', label: 'Android Smartphone' },
  { to: '/de/einrichtung/windows/', label: 'Windows PC' },
  { to: '/de/einrichtung/mac/', label: 'Mac' },
  { to: '/de/einrichtung/tablet/', label: 'Tablet' },
];

const DetailedGuidesPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: 'IPTV Anleitung | Einrichtung und Nutzung auf Deutsch',
    description:
      'Wie funktioniert IPTV? Schritt-für-Schritt Einrichtung, Geräte-Tipps und Nutzungshilfen für stabiles Streaming in Deutschland und Europa.',
    keywords: [
      'IPTV Anleitung',
      'IPTV einrichten',
      'IPTV Deutschland',
      'Smart TV IPTV',
      'stabile IPTV',
      'IPTV Nutzung',
    ],
    ogType: 'article',
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Startseite', path: '/de' },
    { name: 'Einrichtung', path: '/de/einrichtung' },
    { name: 'Detaillierte Anleitungen', path: '/de/detaillierte-anleitungen' },
  ]);
  const jsonLd = [
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metadata.title,
      description: metadata.description,
      author: { '@type': 'Organization', name: 'QruzeTV' },
    },
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <HeaderDE contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />

        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <BreadcrumbNavigation
              customCrumbs={[
                { name: 'Startseite', path: '/de/' },
                { name: 'Einrichtung', path: '/de/einrichtung/' },
                { name: 'Detaillierte Anleitungen', path: null },
              ]}
            />

            <article className="mt-8 bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
                <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">
                  IPTV Anleitung — Einrichtung und Nutzung
                </h1>
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6 mb-12">
                <p>
                  Diese <strong>IPTV Anleitung</strong> erklärt, wie Sie Internet-Fernsehen auf Ihren Geräten einrichten und <strong>stabile IPTV</strong>-Streams genießen. Ob Smart TV, Fire TV Stick, Smartphone oder PC — mit den richtigen Zugangsdaten (M3U oder Xtream Codes) und einer passenden Player-App sind Sie in wenigen Minuten startklar.
                </p>
                <p>
                  Für <strong>IPTV Deutschland</strong> empfehlen wir eine kabelgebundene Verbindung oder ein starkes 5-GHz-WLAN, mindestens 25 Mbit/s für Full HD und 50+ Mbit/s für 4K. Unsere Server nutzen Load-Balancing und Anti-Freeze-Technik, damit Spitzenlasten beim Sport weniger spürbar sind.
                </p>
              </div>

              <section className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-slate-700/50 pb-3 flex items-center gap-2">
                  <Tv className="w-7 h-7 text-primary" />
                  Geräte-spezifische Einrichtung
                </h2>
                <p className="text-slate-300 mb-6">
                  Wählen Sie Ihr Gerät — jede Anleitung führt Sie Schritt für Schritt durch Installation, Login und erste Kanalliste:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {DEVICE_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center justify-center p-4 bg-[#0a0a0a]/80 hover:bg-[#141414]/40 border border-slate-700 hover:border-primary/50 rounded-xl transition-all font-semibold text-slate-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2 flex items-center gap-2">
                  <Monitor className="w-6 h-6 text-blue-400" />
                  Stabile Streams — Praxis-Tipps
                </h2>
                <ul className="list-disc pl-6 text-slate-300 space-y-3">
                  <li>Router nah am TV oder Ethernet nutzen; VPN nur wenn nötig (kann Latenz erhöhen).</li>
                  <li>Player-Cache in der App moderat einstellen — zu hohe Werte verzögern den Kanalwechsel.</li>
                  <li>Bei Rucklern zuerst Internetgeschwindigkeit prüfen, dann Gerät neu starten.</li>
                  <li>Favoritenlisten anlegen, um schneller zu den wichtigsten Sendern zu wechseln.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-emerald-400" />
                  Support & weitere Ressourcen
                </h2>
                <p className="text-slate-300 mb-4">
                  Unser Support ist per WhatsApp und E-Mail erreichbar. Für häufige Fragen zu Zahlung, Geräten und Verlängerung siehe die FAQ. Ausführlicher Blog-Leitfaden:
                </p>
                <Link
                  to="/de/guide/iptv-kurulum-rehberi/"
                  className="text-primary hover:underline font-semibold"
                >
                  IPTV Einrichtungsanleitung (Deutsch) →
                </Link>
              </section>

              <div className="mt-12 p-8 bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20 rounded-2xl border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Nützliche Links</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Link
                    to="/de/einrichtung/"
                    className="flex items-center justify-center p-4 bg-[#0a0a0a]/80 hover:bg-[#141414]/20 border border-slate-700 rounded-xl transition-all font-semibold"
                  >
                    Einrichtungsübersicht
                  </Link>
                  <Link
                    to="/de/sss/"
                    className="flex items-center justify-center p-4 bg-[#0a0a0a]/80 hover:bg-[#141414]/20 border border-slate-700 rounded-xl transition-all font-semibold"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/de/privacy/"
                    className="flex items-center justify-center p-4 bg-[#0a0a0a]/80 hover:bg-[#141414]/20 border border-slate-700 rounded-xl transition-all font-semibold"
                  >
                    Datenschutz
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </main>
        <FooterDE contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default DetailedGuidesPageDE;
