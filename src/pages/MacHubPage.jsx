import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, AppWindow, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import HeaderDE from '@/components/HeaderDE';
import Footer from '@/components/Footer';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { MAC_APPS } from '@/data/macApps';
import { INSTALLATION_DEVICE_CONTENT } from '@/data/installationDeviceContent';
import { SITE_URL } from '@/constants/siteUrl';

const MacHubPage = ({ siteData }) => {
  const { pathname } = useLocation();
  const isDe = pathname.startsWith('/de');
  const kurulumPath = isDe ? '/de/einrichtung' : '/kurulum';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hubContent = INSTALLATION_DEVICE_CONTENT.mac;
  const keywords = hubContent
    ? (isDe ? hubContent.de?.keywords : hubContent.tr?.keywords)
    : ['Mac IPTV', 'NEXT+ Mac', 'CASTORA Mac', 'Mac App Store IPTV', 'Apple Silicon'];

  const metadata = {
    title: isDe
      ? 'Mac IPTV Einrichtung — App wählen | QruzeTV'
      : 'Mac IPTV Kurulumu — Uygulama Seçin | QruzeTV',
    description: isDe
      ? 'Mac & MacBook: NEXT+ oder CASTORA — wählen Sie Ihre App und folgen Sie der Schritt-für-Schritt-Anleitung.'
      : 'Mac ve MacBook için NEXT+ ve CASTORA kurulum rehberi. Uygulamanızı seçin, adım adım kurun.',
    keywords,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Ana Sayfa', item: `${SITE_URL}${isDe ? '/de' : ''}` },
      { '@type': 'ListItem', position: 2, name: isDe ? 'Einrichtung' : 'Kurulum', item: `${SITE_URL}${kurulumPath}` },
      { '@type': 'ListItem', position: 3, name: 'Mac', item: `${SITE_URL}${kurulumPath}/mac` },
    ],
  };

  return (
    <ErrorBoundary>
      <SEOHead
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType="article"
        jsonLd={[breadcrumbSchema]}
        canonicalUrl={`${SITE_URL}${kurulumPath}/mac`}
      />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200">
        {isDe ? (
          <HeaderDE contactData={siteData?.contactData} />
        ) : (
          <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        )}

        <main className="flex-grow w-full">
          <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent" />
            <div className="container relative z-10 mx-auto max-w-5xl">
              <BreadcrumbNavigation
                customCrumbs={[
                  { name: isDe ? 'Startseite' : 'Ana Sayfa', path: isDe ? '/de' : '/' },
                  { name: isDe ? 'Einrichtung' : 'Kurulum', path: kurulumPath },
                  { name: 'Mac', path: null },
                ]}
              />
              <Link
                to={kurulumPath}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mt-6 mb-8 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {isDe ? 'Alle Geräte' : 'Tüm cihazlara dön'}
              </Link>

              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#0a0a0a]/90 flex items-center justify-center">
                    <AppWindow className="w-8 h-8 text-slate-200" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
                    {isDe ? 'Mac IPTV Einrichtung' : 'Mac IPTV Kurulumu'}
                  </h1>
                  <p className="text-slate-400 max-w-2xl leading-relaxed">
                    {isDe
                      ? 'Mac und MacBook: NEXT+ für Playlist/Xtream oder CASTORA mit Xtream und Server **8811** — beide im Mac App Store.'
                      : 'Mac ve MacBook\'ta NEXT+ (M3U/Xtream) veya CASTORA (Xtream, sunucu **8811**) kullanın. İkisi de Mac App Store\'dan indirilebilir.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 px-4 pb-20">
            <div className="container mx-auto max-w-4xl">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MAC_APPS.map((app, i) => {
                  const tagline = isDe ? app.tagline.de : app.tagline.tr;
                  return (
                    <motion.div
                      key={app.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        to={`${kurulumPath}/${app.slug}`}
                        className="group block h-full rounded-2xl border border-slate-800 bg-[#0a0a0a]/60 hover:border-primary/40 hover:bg-[#0a0a0a]/80 transition-all p-6 md:p-7"
                      >
                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-14 h-14 rounded-xl ${app.bg} border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-2`}>
                            {app.logo ? (
                              <img src={app.logo} alt={app.name} className="w-full h-full object-contain rounded-xl" />
                            ) : (
                              <span className={`text-sm font-black ${app.colorLight}`}>{app.logoInitials}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                              {isDe ? app.nameDe : app.name}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">{tagline}</p>
                            <p className="text-xs text-slate-500 mt-2">{isDe ? app.platforms.de : app.platforms.tr}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            {isDe ? 'Anleitung öffnen' : 'Kurulum rehberi'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <a
                            href={app.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 shrink-0"
                          >
                            {isDe ? 'Offizielle Seite' : 'Resmi site'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-center text-sm text-slate-500 mt-10 max-w-xl mx-auto">
                {isDe
                  ? 'NEXT+ und CASTORA laufen nativ auf Apple Silicon (M1/M2/M3). CASTORA: Xtream mit Server-Feld **8811**.'
                  : 'NEXT+ ve CASTORA Apple Silicon (M1/M2/M3) ile uyumludur. CASTORA\'da sunucu alanına **8811** yazın.'}
              </p>
            </div>
          </section>
        </main>

        {isDe ? (
          <FooterDE contactData={siteData?.contactData} siteData={siteData} />
        ) : (
          <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} siteData={siteData} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MacHubPage;
