
import React, { memo, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Packages from '@/components/Packages';
import SEOHead from '@/components/SEOHead';
import { packagesPageSchemas, breadcrumbSchema } from '@/utils/seoSchema';
import { buildPackagesProductJsonLd } from '@/utils/packageProductSchema';
import { SITE_URL } from '@/constants/siteUrl';
import { resolvePackagesPageContent } from '@/utils/packagePageContent';
import PackagesPageSeoSections from '@/components/packages/PackagesPageSeoSections';
import { defaultData } from '@/data/defaultSiteData';
import ErrorBoundary from '@/components/ErrorBoundary';
import ChatBot from '@/components/ChatBot';
import { CheckCircle2 } from 'lucide-react';

const PACKAGES_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hangi IPTV paketini seçmeliyim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'İzleme alışkanlıklarınıza göre değişir. Kısa süreli deneme için 3 aylık, uzun vadeli tasarruf için 12 aylık premium paketlerimizi öneriyoruz.',
      },
    },
    {
      '@type': 'Question',
      name: 'Yayınlarda donma olur mu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Anti-freeze teknolojimiz ve güçlü sunucularımız sayesinde minimum 10 Mbps internet hızında kesintisiz yayın izleyebilirsiniz.',
      },
    },
  ],
};

const PackagesPage = ({ siteData }) => {
  const safeSiteData = siteData || defaultData;
  const pageContent = resolvePackagesPageContent(safeSiteData);

  const metadata = {
    title: 'QruzeTV IPTV Paketleri ve Fiyatları 2026 — 4K Abonelik | streamtr.eu',
    description:
      'QruzeTV IPTV paketleri: Standart ve Premium seçenekler, anında aktivasyon, ücretsiz test. streamtr.eu üzerinden güvenle inceleyin.',
    keywords: ['IPTV paketleri', 'QruzeTV', 'kesintisiz yayın', 'premium paketler', 'IPTV fiyatları', 'streamtr.eu'],
    ogType: 'website',
  };

  const jsonLd = useMemo(
    () => [
      ...packagesPageSchemas(metadata),
      breadcrumbSchema([
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Paketler', path: '/paketler' },
      ]),
      PACKAGES_FAQ_SCHEMA,
      ...buildPackagesProductJsonLd(safeSiteData.packagesData, {
        pageUrl: `${SITE_URL}/paketler`,
        locale: 'tr',
      }),
    ],
    [safeSiteData.packagesData],
  );

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/paketler`} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#0F0F1E] flex flex-col font-sans text-white selection:bg-purple-500/30">
        <Header contactData={safeSiteData.contactData} />

        <main className="flex-grow pt-24 pb-16">
          <section className="relative overflow-hidden py-12 md:py-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-pink-500/5 to-transparent -z-10" />

            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                {pageContent.page?.title || 'IPTV Paketleri'}
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
                {pageContent.page?.shortDescription ||
                  'İhtiyacınıza ve kullanım bölgenize göre Standart veya Premium IPTV paketlerinden birini seçebilirsiniz.'}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">Anında Teslimat</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">7/24 Canlı Destek</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">Tüm Cihazlarla Uyumlu</span>
                </div>
              </div>
            </div>
          </section>

          <section id="packages-list" className="relative z-10 py-8">
            <ErrorBoundary>
              <Packages
                packages={safeSiteData.packagesData}
                showTierFilter
                hideSectionHeader
                packagesPageContent={safeSiteData.packagesPageContent}
              />
            </ErrorBoundary>
          </section>

          <PackagesPageSeoSections siteData={safeSiteData} contactData={safeSiteData.contactData} lang="tr" />
        </main>

        <Footer contactData={safeSiteData.contactData} siteData={safeSiteData} />

        {safeSiteData.chatBotData?.enabled && (
          <ChatBot chatData={safeSiteData.chatBotData} contactData={safeSiteData.contactData} />
        )}
      </div>
    </>
  );
};

export default memo(PackagesPage);
