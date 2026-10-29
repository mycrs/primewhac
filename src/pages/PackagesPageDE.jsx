import React, { useEffect, useMemo } from 'react';
import { Film, Tv, Radio, Globe, Zap, ShieldCheck, Headphones, CheckCircle2 } from 'lucide-react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import Packages from '@/components/Packages';
import Contact from '@/components/Contact';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import SEOHead from '@/components/SEOHead';
import { packagesPageSchemasDE, breadcrumbSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';
import {
  resolvePackagesPageContent,
  getPageTitle,
  getPageShortDescription,
} from '@/utils/packagePageContent';
import PackagesPageSeoSections from '@/components/packages/PackagesPageSeoSections';
import { defaultData } from '@/data/defaultSiteData';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';

const PackagesPageDE = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || defaultData;
  const pageContent = resolvePackagesPageContent(safeSiteData);
  const h1 = getPageTitle(pageContent, true);
  const heroDescription = getPageShortDescription(pageContent, true);

  const metadata = useMemo(() => ({
    title: 'IPTV Pakete für Deutschland — 4K & Test | QruzeTV',
    description:
      'IPTV-Pakete für Deutschland und Europa nach Laufzeit, Nutzerzahl und Preis vergleichen. 4K/UHD vor dem Kauf kostenlos auf dem eigenen Gerät testen.',
    keywords: ['Premium IPTV Deutschland', 'QruzeTV', 'IPTV Deutschland kaufen', 'IPTV Pakete Preise', '4K IPTV'],
    ogType: 'product',
    h1,
  }), [h1]);

  const jsonLd = useMemo(
    () => [
      ...packagesPageSchemasDE(metadata),
      breadcrumbSchema([
        { name: 'Startseite', path: '/de' },
        { name: 'Pakete', path: '/de/pakete' },
      ]),
    ],
    [metadata],
  );

  const features = [
    {
      icon: <Tv className="w-6 h-6 text-[#ff4b55]" aria-hidden="true" />,
      title: 'Live-Übertragungen',
      desc: 'Nationale und internationale Kanäle, Premium-Events und Nachrichten in stabiler 4K IPTV Qualität.',
      ariaLabel: 'Live-Stream Feature Icon',
    },
    {
      icon: <Film className="w-6 h-6 text-[#ff4b55]" aria-hidden="true" />,
      title: 'Gigantisches Filmarchiv',
      desc: 'Blockbuster, Klassiker und 4K Ultra HD Inhalte direkt auf Abruf mit Ihrem Premium IPTV Abo.',
      ariaLabel: 'Filmarchiv Feature Icon',
    },
    {
      icon: <Radio className="w-6 h-6 text-[#ff4b55]" aria-hidden="true" />,
      title: 'Serien & VOD',
      desc: 'Angesagte Serien und Dokumentationen an einem Ort für echtes Binge-Watching.',
      ariaLabel: 'Serien Feature Icon',
    },
    {
      icon: <Globe className="w-6 h-6 text-[#ff4b55]" aria-hidden="true" />,
      title: 'Europa & Weltweit',
      desc: 'Entertainment auf Smart-TVs, Smartphones, Tablets und PCs — überall in Europa & weltweit.',
      ariaLabel: 'Multi-Geräte Feature Icon',
    },
  ];

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/de/pakete`} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#070709] flex flex-col text-slate-300 selection:bg-primary/40 font-sans">
        <HeaderDE contactData={safeSiteData.contactData} />

        <main className="flex-grow pt-20">
          {/* Artisan Hero Section */}
          <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16 border-b border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e50914]/15 via-[#180a0c]/30 to-transparent pointer-events-none -z-10" />

            <div className="container mx-auto px-4">
              <div className="mb-6">
                <BreadcrumbNavigation />
              </div>

              <div className="text-center max-w-4xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/30 text-[#ff4d58] mb-4 shadow-[0_0_25px_rgba(229,9,20,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  PREMIUM IPTV LOUNGE • DEUTSCHLAND & EUROPA
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
                  {h1}
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                  {heroDescription}
                </p>
              </div>

              <h2 className="sr-only">Premium IPTV Eigenschaften</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#121217]/80 border border-white/10 hover:border-primary/40 transition-all duration-300 shadow-md flex flex-col"
                  >
                    <div
                      className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-white/10"
                      role="img"
                      aria-label={feature.ariaLabel}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Core Packages Showcase */}
          <section id="packages-list" className="py-6 md:py-8">
            <Packages
              packages={safeSiteData.packagesData}
              contactData={safeSiteData.contactData}
              siteTexts={safeSiteData.siteTexts}
              appsData={safeSiteData.appsData}
              hideRegions={['TR']}
              showTierFilter
              hideSectionHeader
              packagesPageContent={safeSiteData.packagesPageContent}
            />
          </section>

          {/* Artisan 3-Pillar Reassurance Strip (DE) */}
          <section className="py-8 border-y border-white/5 bg-[#0a0a0f]/60">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-white/5 hover:border-primary/30 transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-[#ff4b55]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">Sofortige Freischaltung</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Zugangsdaten und M3U-Links werden direkt nach Zahlungsbestätigung via WhatsApp und E-Mail übermittelt.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">Anycast CDN & 0 Ruckler</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Hochverfügbare europäische Server-Cluster garantieren flüssiges 4K Streaming auch zur Prime-Time.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-white/5 hover:border-blue-500/30 transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Headphones className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">Persönlicher Support 24/7</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Schritt-für-Schritt Einrichtungshilfe für Samsung, LG, Fire TV, Android und Apple-Geräte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PackagesPageSeoSections siteData={safeSiteData} contactData={safeSiteData.contactData} lang="de" />

          <div className="container mx-auto px-4 py-8">
            <InternalLinkingOptimization currentPage="packages_de" />
          </div>

          <section className="bg-[#0a0a0f] py-16 border-t border-white/5">
            <h2 className="section-title text-2xl md:text-3xl text-center mb-8 text-white">Kontaktieren Sie Ihren Premium IPTV Anbieter</h2>
            <Contact contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
          </section>
        </main>

        <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default PackagesPageDE;
