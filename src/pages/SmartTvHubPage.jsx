import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MonitorPlay, ExternalLink, Search, ShieldCheck, Tv } from 'lucide-react';
import Header from '@/components/Header';
import HeaderDE from '@/components/HeaderDE';
import Footer from '@/components/Footer';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SMART_TV_APPS } from '@/data/smartTvApps';
import { INSTALLATION_DEVICE_CONTENT } from '@/data/installationDeviceContent';
import { SITE_URL } from '@/constants/siteUrl';
import { TV_BRAND_GUIDES, getTvBrandAppRecommendation, localizeTvBrandGuide } from '@/data/tvBrandGuides';

const SmartTvHubPage = ({ siteData }) => {
  const { pathname } = useLocation();
  const isDe = pathname.startsWith('/de');
  const kurulumPath = isDe ? '/de/einrichtung' : '/kurulum';
  const lang = isDe ? 'de' : 'tr';
  const brandGuides = Object.values(TV_BRAND_GUIDES).map((guide) => localizeTvBrandGuide(guide, lang));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hubContent = INSTALLATION_DEVICE_CONTENT['smart-tv'];
  const keywords = hubContent
    ? (isDe ? hubContent.de?.keywords : hubContent.tr?.keywords)
    : ['Smart TV IPTV', 'Samsung TV', 'LG TV', '0 Player', 'IPTV Smarters Pro'];

  const metadata = {
    title: isDe
      ? 'Smart TV IPTV Einrichtung nach Marke | QruzeTV'
      : 'Smart TV IPTV Kurulumu — Marka Rehberleri | QruzeTV',
    description: isDe
      ? 'IPTV auf Samsung, LG, Philips, Vestel, Hisense und TCL einrichten. Betriebssystem erkennen, offiziellen Store wählen und M3U/Xtream konfigurieren.'
      : 'Samsung, LG, Philips, Vestel, Hisense ve TCL TV IPTV kurulumu. İşletim sistemini bulun, resmî mağazayı seçin ve M3U/Xtream ekleyin.',
    keywords: [...(keywords || []), ...brandGuides.map((guide) => `${guide.brand} TV IPTV`)],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Ana Sayfa', item: `${SITE_URL}${isDe ? '/de' : ''}` },
      { '@type': 'ListItem', position: 2, name: isDe ? 'Einrichtung' : 'Kurulum', item: `${SITE_URL}${kurulumPath}` },
      { '@type': 'ListItem', position: 3, name: 'Smart TV', item: `${SITE_URL}${kurulumPath}/smart-tv` },
    ],
  };

  const brandListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isDe ? 'Smart-TV IPTV Marken-Anleitungen' : 'Smart TV IPTV marka rehberleri',
    numberOfItems: brandGuides.length,
    itemListElement: brandGuides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}${kurulumPath}/${guide.slug}/`,
    })),
  };

  return (
    <ErrorBoundary>
      <SEOHead
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType="article"
        jsonLd={[breadcrumbSchema, brandListSchema]}
        canonicalUrl={`${SITE_URL}${kurulumPath}/smart-tv`}
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
                  { name: 'Smart TV', path: null },
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
                    <MonitorPlay className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
                    {isDe ? 'Smart TV IPTV Einrichtung' : 'Smart TV IPTV Kurulumu'}
                  </h1>
                  <p className="text-slate-400 max-w-2xl leading-relaxed">
                    {isDe
                      ? 'Wählen Sie zuerst Ihre TV-Marke. Der Leitfaden hilft Ihnen, das Betriebssystem zu erkennen und den passenden offiziellen App-Store zu nutzen.'
                      : 'Önce TV markanızı seçin. Rehber, işletim sisteminizi tanımanıza ve doğru resmî uygulama mağazasını kullanmanıza yardım etsin.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pb-16 pt-6">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                    <Search className="h-4 w-4" />
                    {isDe ? 'Marke auswählen' : 'Markanı seç'}
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
                    {isDe ? 'Welchen Smart TV verwenden Sie?' : 'Hangi Smart TV’yi kullanıyorsunuz?'}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    {isDe
                      ? 'Jede Seite enthält einen interaktiven System-Check, eine Kurzanleitung, Fehlerdiagnose und Herstellerquellen.'
                      : 'Her sayfada etkileşimli sistem kontrolü, kısa cevap, adım adım kurulum, sorun teşhisi ve üretici kaynakları bulunur.'}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  {isDe ? 'Modell und Region werden berücksichtigt' : 'Model ve bölge farkı gözetilir'}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {brandGuides.map((guide, index) => (
                  <motion.div
                    key={guide.slug}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      to={`${kurulumPath}/${guide.slug}`}
                      className="group block h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
                    >
                      <div className={`h-1 bg-gradient-to-r ${guide.accent}`} />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-5">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${guide.accentBg}`}>
                            <Tv className={`h-6 w-6 ${guide.accentText}`} />
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-white" />
                        </div>
                        <h3 className="mt-5 text-xl font-black text-white">{guide.brand}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                          {guide.summary}
                        </p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                          {guide.systems.slice(0, 3).map((system) => (
                            <span
                              key={system.id}
                              className="rounded-md border border-white/[0.07] bg-black/30 px-2 py-1 text-[11px] text-slate-500"
                            >
                              {system.label}
                            </span>
                          ))}
                      </div>
                      {getTvBrandAppRecommendation(guide.slug, guide.systems[0]?.id, lang) && (
                        <div className="mt-4 border-t border-white/[0.07] pt-3 text-xs text-slate-500">
                          <span className="font-bold text-primary">{isDe ? 'Empfehlung:' : 'Öneri:'}</span>{' '}
                          {getTvBrandAppRecommendation(guide.slug, guide.systems[0]?.id, lang).primary}
                        </div>
                      )}
                    </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-white/[0.07] bg-white/[0.02] px-4 py-16">
            <div className="container mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  {isDe ? 'Player-Anleitungen' : 'Oynatıcı rehberleri'}
                </span>
                <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
                  {isDe ? 'App bereits ausgewählt?' : 'Uygulamanız zaten belli mi?'}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  {isDe
                    ? 'Öffnen Sie die App-Anleitung nur, wenn der Player im offiziellen Store Ihres TV-Modells angezeigt wird.'
                    : 'Bu uygulama rehberlerini yalnızca oynatıcı TV modelinizin resmî mağazasında görünüyorsa kullanın.'}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {SMART_TV_APPS.map((app, i) => {
                  const tagline = isDe ? app.tagline.de : app.tagline.tr;
                  return (
                    <motion.div
                      key={app.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={`${kurulumPath}/${app.slug}`}
                        className="group block h-full rounded-2xl border border-slate-800 bg-[#0a0a0a]/60 hover:border-primary/40 hover:bg-[#0a0a0a]/80 transition-all p-6 md:p-8"
                      >
                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-16 h-16 rounded-xl ${app.bg} border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-2`}>
                            {app.logo ? (
                              <img src={app.logo} alt={app.name} className="w-full h-full object-contain rounded-xl" />
                            ) : (
                              <span className="text-lg font-black text-violet-300 text-center leading-tight px-1">
                                IPTV<br />S
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                              {isDe ? app.nameDe : app.name}
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">{tagline}</p>
                            <p className="text-xs text-slate-500 mt-2">{isDe ? app.platforms.de : app.platforms.tr}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            {isDe ? 'Anleitung öffnen' : 'Kurulum rehberi'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                          <a
                            href={app.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"
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
                  ? 'Die Verfügbarkeit einer App hängt von TV-Modell, Betriebssystem und Store-Region ab. Eine Player-App enthält normalerweise keine Sender.'
                  : 'Uygulama bulunabilirliği TV modeli, işletim sistemi ve mağaza bölgesine göre değişir. Oynatıcı uygulama genellikle kanal içermez.'}
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

export default SmartTvHubPage;
