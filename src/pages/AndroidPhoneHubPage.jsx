import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';
import Header from '@/components/Header';
import HeaderDE from '@/components/HeaderDE';
import Footer from '@/components/Footer';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ANDROID_PHONE_APPS } from '@/data/androidPhoneApps';
import { INSTALLATION_DEVICE_CONTENT } from '@/data/installationDeviceContent';
import { SITE_URL } from '@/constants/siteUrl';
import { useSetupPage } from '@/hooks/useSetupPage';
import { mergeHubAppsFromDb } from '@/utils/hubAppsConfig';

const AndroidPhoneHubPage = ({ siteData }) => {
  const { pathname } = useLocation();
  const isDe = pathname.startsWith('/de');
  const kurulumPath = isDe ? '/de/einrichtung' : '/kurulum';
  const { fetchSetupPage, setupData } = useSetupPage();

  useEffect(() => {
    fetchSetupPage();
    window.scrollTo(0, 0);
  }, [fetchSetupPage]);

  const hubConfig = setupData?.android_phone_config;
  const apps = useMemo(
    () => mergeHubAppsFromDb(hubConfig, ANDROID_PHONE_APPS),
    [hubConfig],
  );

  const hubContent = INSTALLATION_DEVICE_CONTENT['android-phone'];
  const keywords = hubContent
    ? (isDe ? hubContent.de?.keywords : hubContent.tr?.keywords)
    : ['Android telefon IPTV', 'Qruze Player XC', 'Qruze Player IBO', 'APK kurulum'];

  const metadata = {
    title: isDe
      ? 'Android Smartphone IPTV Einrichtung — App wählen | QruzeTV'
      : 'Android Telefon IPTV Kurulumu — Uygulama Seçin | QruzeTV',
    description: isDe
      ? 'Android Smartphone: Qruze Player XC oder IBO Player — wählen Sie die passende App für Ihr Paket.'
      : 'Android telefon için Qruze Player XC ve IBO Player kurulum rehberi. Paketinize uygun uygulamayı seçin.',
    keywords,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Ana Sayfa', item: `${SITE_URL}${isDe ? '/de' : ''}` },
      { '@type': 'ListItem', position: 2, name: isDe ? 'Einrichtung' : 'Kurulum', item: `${SITE_URL}${kurulumPath}` },
      { '@type': 'ListItem', position: 3, name: isDe ? 'Android Smartphone' : 'Android Telefon', item: `${SITE_URL}${kurulumPath}/android-phone` },
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
        canonicalUrl={`${SITE_URL}${kurulumPath}/android-phone`}
      />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200">
        {isDe ? (
          <HeaderDE contactData={siteData?.contactData} />
        ) : (
          <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        )}

        <main className="flex-grow w-full">
          <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/5 to-transparent" />
            <div className="container relative z-10 mx-auto max-w-5xl">
              <BreadcrumbNavigation
                customCrumbs={[
                  { name: isDe ? 'Startseite' : 'Ana Sayfa', path: isDe ? '/de' : '/' },
                  { name: isDe ? 'Einrichtung' : 'Kurulum', path: kurulumPath },
                  { name: isDe ? 'Android Smartphone' : 'Android Telefon', path: null },
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e50914] to-[#b20710] p-0.5 shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#0a0a0a]/90 flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-[#e50914]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
                    {isDe ? 'Android Smartphone IPTV Einrichtung' : 'Android Telefon IPTV Kurulumu'}
                  </h1>
                  <p className="text-slate-400 max-w-2xl leading-relaxed">
                    {(isDe ? hubConfig?.hub_intro_de : hubConfig?.hub_intro_tr) || (isDe
                      ? 'Qruze Player ist nicht im Play Store. Wählen Sie XC Player (APK/Xtream) oder IBO Player (mobil/APK) — passend zu Ihrem Paket.'
                      : 'Qruze Player Play Store\'da yok. Paketinize göre XC Player (APK/Xtream) veya IBO Player (mobil/APK) kurulum rehberini seçin.')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 px-4 pb-20">
            <div className="container mx-auto max-w-5xl">
              <div className="grid sm:grid-cols-2 gap-6">
                {apps.map((app, i) => {
                  const tagline = isDe ? app.tagline.de : app.tagline.tr;
                  const category = isDe ? app.categoryLabel.de : app.categoryLabel.tr;
                  const installSource = isDe ? app.installSource.de : app.installSource.tr;
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
                        <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-primary/90 mb-3 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                          {category}
                        </span>
                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-14 h-14 rounded-xl ${app.bg} border border-white/10 flex items-center justify-center shrink-0`}>
                            <span className={`text-xs font-black ${app.colorLight}`}>{app.logoInitials}</span>
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
                          <span className="text-xs text-slate-500 shrink-0">{installSource}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <p className="text-center text-sm text-slate-500 mt-10 max-w-2xl mx-auto">
                {isDe
                  ? 'Nicht sicher welche App? XC Player für Xtream/APK — IBO Player für mobile IBO-Kurulum.'
                  : 'Hangi uygulama? Xtream/APK kurulum → XC Player. Mobil IBO kurulum → IBO Player.'}
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

export default AndroidPhoneHubPage;
