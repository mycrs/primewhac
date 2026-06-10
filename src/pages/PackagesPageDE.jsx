
import React, { useEffect, useMemo } from 'react';
import { Film, Tv, Radio, Globe } from 'lucide-react';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import Packages from '@/components/Packages';
import Contact from '@/components/Contact';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import SEOHead from '@/components/SEOHead';
import { packagesPageSchemasDE, breadcrumbSchema } from '@/utils/seoSchema';
import { buildPackagesProductJsonLd } from '@/utils/packageProductSchema';
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

  const metadata = {
    title: 'QruzeTV Premium IPTV Deutschland | Stabile 4K Pakete — streamtr.eu',
    description:
      'QruzeTV Premium IPTV Abo für Deutschland und Europa. Standart- und Premium-Pakete auf streamtr.eu.',
    keywords: ['Premium IPTV Deutschland', 'QruzeTV', 'IPTV Deutschland kaufen', '4K IPTV', 'streamtr.eu'],
    ogType: 'product',
    h1,
  };

  const jsonLd = useMemo(
    () => [
      ...packagesPageSchemasDE(metadata),
      breadcrumbSchema([
        { name: 'Startseite', path: '/de' },
        { name: 'Pakete', path: '/de/pakete' },
      ]),
      ...buildPackagesProductJsonLd(safeSiteData.packagesData, {
        pageUrl: `${SITE_URL}/de/pakete`,
        locale: 'de',
      }),
    ],
    [safeSiteData.packagesData, h1],
  );

  const features = [
    {
      icon: <Tv className="w-8 h-8 text-[#A855F7]" aria-hidden="true" />,
      title: 'Live-Übertragungen',
      desc: 'Nationale und internationale Kanäle, Premium-Sportereignisse und Nachrichten in stabiler 4K IPTV Qualität.',
      ariaLabel: 'Live-Stream Feature Icon',
    },
    {
      icon: <Film className="w-8 h-8 text-[#A855F7]" aria-hidden="true" />,
      title: 'Gigantisches Filmarchiv',
      desc: 'Blockbuster, Klassiker und 4K Ultra HD Inhalte direkt auf Abruf mit Ihrem Premium IPTV Abo.',
      ariaLabel: 'Filmarchiv Feature Icon',
    },
    {
      icon: <Radio className="w-8 h-8 text-[#A855F7]" aria-hidden="true" />,
      title: 'Serien & VOD',
      desc: 'Angesagte Serien und Dokumentationen an einem Ort für echtes Binge-Watching.',
      ariaLabel: 'Serien Feature Icon',
    },
    {
      icon: <Globe className="w-8 h-8 text-[#A855F7]" aria-hidden="true" />,
      title: 'IPTV für Europa & Weltweit',
      desc: 'Entertainment auf Smart-TVs, Smartphones, Tablets und PCs — überall in Europa.',
      ariaLabel: 'Multi-Geräte Feature Icon',
    },
  ];

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/de/pakete`} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#0F0F1E] flex flex-col text-slate-300">
        <HeaderDE contactData={safeSiteData.contactData} />

        <main className="flex-grow pt-20">
          <section className="py-12 bg-[#0F0F1E] border-b border-[#2a2a40]">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <BreadcrumbNavigation />
              </div>

              <div className="text-center max-w-4xl mx-auto mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{h1}</h1>
                <p className="text-lg text-gray-400 leading-relaxed">{heroDescription}</p>
              </div>

              <h2 className="sr-only">Premium IPTV Eigenschaften</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1a1a2e] border border-[#2a2a40] p-6 rounded-xl hover:border-purple-500 transition-all duration-300 shadow-lg"
                  >
                    <div
                      className="bg-[#2a2a40] w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-[#3a3a50]"
                      role="img"
                      aria-label={feature.ariaLabel}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="packages-list" className="py-8">
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

          <PackagesPageSeoSections siteData={safeSiteData} contactData={safeSiteData.contactData} lang="de" />

          <div className="container mx-auto px-4 py-8">
            <InternalLinkingOptimization currentPage="packages_de" />
          </div>

          <section className="bg-[#0F0F1E] py-16 border-t border-[#2a2a40]">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Kontaktieren Sie Ihren Premium IPTV Anbieter</h2>
            <Contact contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
          </section>
        </main>

        <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default PackagesPageDE;
