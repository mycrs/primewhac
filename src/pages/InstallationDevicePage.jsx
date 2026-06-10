import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import HeaderDE from '@/components/HeaderDE';
import Footer from '@/components/Footer';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import InstallationPageLayout from '@/components/installation/InstallationPageLayout';
import DeviceSeoContentSection from '@/components/installation/DeviceSeoContentSection';
import { useSetupPage } from '@/hooks/useSetupPage';
import { INSTALLATION_DEVICE_CONTENT } from '@/data/installationDeviceContent';
import {
  ArrowLeft, Tv, Smartphone, Monitor, AppWindow, MonitorPlay, Tablet,
  Gauge, Wifi, Download, Shield, ChevronDown, ChevronUp,
  CheckCircle2, Zap, Globe, FlaskConical, Package
} from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SITE_URL } from '@/constants/siteUrl';

const DEVICES = {
  'android-tv': {
    key: 'android_tv_config', name: 'Android TV', nameDe: 'Android TV', icon: Tv,
    color: 'from-green-500 to-[#b20710]', colorLight: 'text-green-400', bg: 'bg-green-500/10',
  },
  'ios': {
    key: 'ios_config', name: 'iOS ve iPhone', nameDe: 'iOS und iPhone', icon: Smartphone,
    color: 'from-[#e50914] to-[#b20710]', colorLight: 'text-white', bg: 'bg-[#e50914]/10',
  },
  'android-phone': {
    key: 'android_phone_config', name: 'Android Telefon', nameDe: 'Android Smartphone', icon: Smartphone,
    color: 'from-[#e50914] to-[#b20710]', colorLight: 'text-[#e50914]', bg: 'bg-[#e50914]/10',
  },
  'windows': {
    key: 'windows_pc_config', name: 'Windows PC', nameDe: 'Windows PC', icon: Monitor,
    color: 'from-[#e50914] to-[#b20710]', colorLight: 'text-blue-400', bg: 'bg-[#141414]/10',
  },
  'mac': {
    key: 'mac_config', name: 'Mac', nameDe: 'Mac', icon: AppWindow,
    color: 'from-[#0a0a0a] to-[#141414]', colorLight: 'text-slate-300', bg: 'bg-[#141414]/10',
  },
  'samsung-tv': {
    key: 'smart_tv_config', name: 'Samsung TV', nameDe: 'Samsung TV', icon: MonitorPlay,
    color: 'from-[#e50914] to-[#b20710]', colorLight: 'text-blue-400', bg: 'bg-[#141414]/10',
  },
  'lg-tv': {
    key: 'smart_tv_config', name: 'LG TV', nameDe: 'LG TV', icon: MonitorPlay,
    color: 'from-red-500 to-[#b20710]', colorLight: 'text-red-400', bg: 'bg-red-500/10',
  },
  'smart-tv': {
    key: 'smart_tv_config', name: 'Smart TV (Samsung/LG)', nameDe: 'Smart TV (Samsung/LG)', icon: MonitorPlay,
    color: 'from-[#e50914] to-rose-600', colorLight: 'text-pink-400', bg: 'bg-pink-500/10',
  },
  'tablet': {
    key: 'tablet_config', name: 'Tablet', nameDe: 'Tablet', icon: Tablet,
    color: 'from-orange-500 to-amber-600', colorLight: 'text-orange-400', bg: 'bg-orange-500/10',
  },
};

const CONTENT_ALIASES = {
  'samsung-tv': 'smart-tv',
  'lg-tv': 'smart-tv',
};

const InstallationDevicePage = ({ siteData }) => {
  const { device: deviceSlug } = useParams();
  const { pathname } = useLocation();
  const { fetchSetupPage, setupData, loading, error } = useSetupPage();
  const isDe = pathname.startsWith('/de');

  useEffect(() => {
    fetchSetupPage();
    window.scrollTo(0, 0);
  }, [fetchSetupPage]);

  const deviceInfo = useMemo(() => DEVICES[deviceSlug] || null, [deviceSlug]);
  const contentSlug = CONTENT_ALIASES[deviceSlug] || deviceSlug;
  const kurulumPath = isDe ? '/de/einrichtung' : '/kurulum';


  const metadata = useMemo(() => {
    const name = deviceInfo ? (isDe ? deviceInfo.nameDe : deviceInfo.name) : 'Cihaz';
    const contentData = INSTALLATION_DEVICE_CONTENT[contentSlug];
    const keywords = contentData ? (isDe ? contentData.de?.keywords : contentData.tr?.keywords) : ['IPTV kurulum', name, 'M3U', 'Xtream Codes', 'donmayan IPTV'];
    const baseDescription = isDe
      ? `Schritt-für-Schritt ${name} IPTV Einrichtung. Mit M3U und Xtream Codes.`
      : `Adım adım ${name} IPTV kurulumu. M3U ve Xtream Codes ile kurulum nasıl yapılır?`;
    return {
      title: `${name} IPTV Kurulum Rehberi | QruzeTV`,
      titleDe: `${name} IPTV Einrichtungsanleitung | QruzeTV`,
      description: baseDescription,
      keywords: Array.from(new Set([...(keywords || []), `${name} IPTV`, `${name} IPTV kurulum`, 'IPTV kurulum rehberi'])),
    };
  }, [contentSlug, deviceInfo, isDe]);

  const deviceConfig = useMemo(() => {
    const info = DEVICES[deviceSlug] || null;
    if (!info) return undefined;
    return setupData?.[info.key];
  }, [deviceSlug, setupData]);

  const appName = useMemo(() => {
    if (!deviceConfig) return null;
    if (Array.isArray(deviceConfig.app_links) && deviceConfig.app_links.length > 0) {
      return deviceConfig.app_links.map((l) => l.app_name).filter(Boolean).join(' / ') || null;
    }
    return deviceConfig.title || null;
  }, [deviceConfig]);

  if (!deviceInfo) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white">
          {isDe ? <HeaderDE contactData={siteData?.contactData} /> : <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />}
          <main className="flex-grow flex flex-col items-center justify-center px-4 py-20">
            <h1 className="text-2xl font-bold mb-4">{isDe ? 'Seite nicht gefunden' : 'Sayfa bulunamadı'}</h1>
            <p className="text-slate-400 mb-6">{isDe ? 'Ungültige Geräteadresse.' : 'Geçersiz cihaz adresi.'}</p>
            <Link to={kurulumPath} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> {isDe ? 'Zurück zur Einrichtung' : 'Kurulum sayfasına dön'}
            </Link>
          </main>
          {isDe ? <FooterDE contactData={siteData?.contactData} siteData={siteData} /> : <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} siteData={siteData} />}
        </div>
      </ErrorBoundary>
    );
  }

  const DeviceIcon = deviceInfo.icon;
  const basePath = isDe ? '/de/einrichtung' : '/kurulum';
  const testPath = isDe ? '/de/test' : '/test';
  const paketlerPath = isDe ? '/de/paketler' : '/paketler';
  const stepsCount = deviceConfig?.steps?.length || 0;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Ana Sayfa', item: `${SITE_URL}${isDe ? '/de' : ''}` },
      { '@type': 'ListItem', position: 2, name: isDe ? 'Einrichtung' : 'Kurulum', item: `${SITE_URL}${basePath}` },
      { '@type': 'ListItem', position: 3, name: isDe ? deviceInfo.nameDe : deviceInfo.name, item: `${SITE_URL}${basePath}/${deviceSlug}` },
    ],
  };

  const deviceFaqItems = {
    'android-tv': [
      { q: isDe ? 'Ist Tivimate kostenlos?' : 'Tivimate ücretsiz mi?', a: isDe ? 'Ja, die kostenlose Version bietet alle Grundfunktionen. Premium ist optional.' : 'Evet, ücretsiz sürüm tüm temel özellikleri sunar. Premium isteğe bağlıdır.' },
      { q: isDe ? 'Tivimate auf Fire TV Stick?' : "Fire TV Stick'te Tivimate var mı?", a: isDe ? 'Play Store fehlt; APK per Downloader sideloaden.' : "Play Store yok; Downloader ile APK sideload edin." },
      { q: isDe ? 'Wie viele Geräte gleichzeitig?' : 'Kaç cihazda aynı anda kullanılır?', a: isDe ? 'Abhängig von Ihrem Abonnement-Limit.' : 'Aboneliğinizin eşzamanlı izleme limitine bağlıdır.' },
    ],
    'ios': [
      { q: isDe ? 'Ist 000 Player kostenlos?' : '000 Player ücretsiz mi?', a: isDe ? 'Ja, Grundfunktionen sind kostenlos.' : 'Evet, temel özellikler ücretsiz.' },
      { q: isDe ? 'Läuft auf Apple TV?' : "Apple TV'de çalışır mı?", a: isDe ? 'Ja, im tvOS App Store erhältlich.' : 'Evet, tvOS App Store\'dan indirilebilir.' },
    ],
    'android-phone': [
      { q: isDe ? 'IPTV Smarters kostenlos?' : 'IPTV Smarters ücretsiz mi?', a: isDe ? 'Ja, mit Werbung. Premium ohne Werbung.' : 'Evet, reklamlı ücretsiz sürüm var.' },
      { q: isDe ? 'Chromecast unterstützt?' : 'Chromecast destekler mi?', a: isDe ? 'Ja, Streaming zum TV möglich.' : 'Evet, TV\'ye yansıtma yapabilirsiniz.' },
    ],
    'windows': [
      { q: isDe ? 'Ist VLC kostenlos?' : 'VLC ücretsiz mi?', a: isDe ? 'Ja, komplett kostenlos und Open Source.' : 'Evet, tamamen ücretsiz ve açık kaynak.' },
      { q: isDe ? 'Kodi oder VLC?' : 'Kodi mi VLC mi?', a: isDe ? 'VLC einfacher für M3U; Kodi für EPG und Aufnahme.' : 'M3U için VLC daha basit; EPG ve kayıt için Kodi.' },
    ],
    'mac': [
      { q: isDe ? 'IINA kostenlos?' : 'IINA ücretsiz mi?', a: isDe ? 'Ja, Open Source und kostenlos.' : 'Evet, açık kaynak ve ücretsiz.' },
      { q: isDe ? 'Apple Silicon unterstützt?' : 'Apple Silicon destekler mi?', a: isDe ? 'Ja, native Unterstützung.' : 'Evet, native destek.' },
    ],
    'smart-tv': [
      { q: isDe ? 'BOB Player kostenlos?' : 'BOB Player ücretsiz mi?', a: isDe ? '7 Tage Testversion; danach einmalige Gebühr.' : '7 gün deneme; sonrası ücretli.' },
      { q: isDe ? 'Philips/Sony unterstützt?' : "Philips/Sony'de var mı?", a: isDe ? 'Nein; bei Android TV Tivimate nutzen.' : 'Hayır; Android TV\'de Tivimate kullanın.' },
    ],
    'samsung-tv': [
      { q: isDe ? 'Funktioniert IPTV auf Samsung Tizen?' : 'Samsung Tizen TV\'de IPTV çalışır mı?', a: isDe ? 'Ja. BOB Player, SS IPTV und ähnliche Apps unterstützen Samsung Smart TVs.' : 'Evet. BOB Player, SS IPTV ve benzeri uygulamalar Samsung Smart TV\'lerde çalışır.' },
      { q: isDe ? 'Wie sende ich den M3U-Link an Samsung TV?' : 'M3U linkini Samsung TV\'ye nasıl gönderirim?', a: isDe ? 'Am einfachsten per SmartThings-App oder per Eingabe mit der Fernbedienung.' : 'En kolay yöntem SmartThings uygulaması veya uzaktan kumanda ile giriş yapmaktır.' },
    ],
    'lg-tv': [
      { q: isDe ? 'Funktioniert IPTV auf LG webOS?' : 'LG webOS TV\'de IPTV çalışır mı?', a: isDe ? 'Ja. LG Content Store bietet kompatible IPTV-Apps wie BOB Player.' : 'Evet. LG Content Store üzerinden BOB Player gibi uyumlu IPTV uygulamaları kullanılabilir.' },
      { q: isDe ? 'Welche LG Modelle werden unterstützt?' : 'Hangi LG modelleri desteklenir?', a: isDe ? 'In der Regel webOS 3.0 und neuere LG Modelle.' : 'Genellikle webOS 3.0 ve üzeri çalışan LG modeller desteklenir.' },
    ],
    'tablet': [
      { q: isDe ? 'iPad oder Android?' : 'iPad mi Android mi?', a: isDe ? 'Beide funktionieren; 000 Player auf iPad, IPTV Smarters auf Android.' : 'İkisi de çalışır; iPad\'de 000 Player, Android\'de IPTV Smarters.' },
    ],
  };

  const faqItems = deviceFaqItems[deviceSlug] || deviceFaqItems[contentSlug] || [];
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `${deviceInfo.name} IPTV Kurulumu`,
      description: metadata.description,
      estimatedCost: { '@type': 'MonetaryCost', currency: 'TRY', value: '0' },
      step: deviceConfig?.steps?.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title || `Adım ${i + 1}`,
        text: s.description || s.content || '',
      })) || [],
    },
    breadcrumbSchema,
    ...(faqSchema ? [faqSchema] : []),
  ];

  const quickStats = [
    { icon: Gauge, label: isDe ? 'Schritte' : 'Adım Sayısı', value: stepsCount > 0 ? `${stepsCount} ${isDe ? 'Schritte' : 'adım'}` : '-' },
    ...(appName ? [{ icon: Download, label: isDe ? 'App' : 'Uygulama', value: appName }] : []),
    { icon: Wifi, label: isDe ? 'Verbindung' : 'Bağlantı', value: isDe ? 'Internet erforderlich' : 'İnternet gerekli' },
    { icon: Shield, label: isDe ? 'Konto' : 'Hesap', value: isDe ? 'IPTV Abo nötig' : 'IPTV aboneliği gerekli' },
  ];

  const prerequisites = [
    {
      icon: Globe,
      title: isDe ? 'Aktive Internetverbindung' : 'Aktif İnternet Bağlantısı',
      desc: isDe ? 'Stabile Verbindung empfohlen' : 'Stabil bir bağlantı önerilir',
    },
    {
      icon: Shield,
      title: isDe ? 'IPTV Abonnement' : 'IPTV Aboneliği',
      desc: isDe ? 'M3U-Link oder Xtream Codes Daten' : 'M3U linki veya Xtream Codes bilgileri',
    },
    {
      icon: Download,
      title: appName
        ? (isDe ? `${appName} App` : `${appName} Uygulaması`)
        : (isDe ? 'IPTV App' : 'IPTV Uygulaması'),
      desc: isDe ? 'Wird im ersten Schritt installiert' : 'İlk adımda kurulacak',
    },
  ];

  return (
    <ErrorBoundary>
      <SEOHead
        title={isDe ? metadata.titleDe : metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType="article"
        jsonLd={jsonLd}
        canonicalUrl={`${SITE_URL}${isDe ? '/de/einrichtung' : '/kurulum'}/${deviceSlug}`}
      />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200">
        {isDe ? (
          <HeaderDE contactData={siteData?.contactData} />
        ) : (
          <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        )}

        <main className="flex-grow w-full">

          {/* ── Hero Section ── */}
          <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${deviceInfo.color} opacity-[0.07]`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#e50914]/10 to-transparent rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto max-w-5xl">
              <div className="mb-6">
                <BreadcrumbNavigation
                  customCrumbs={[
                    { name: isDe ? 'Startseite' : 'Ana Sayfa', path: isDe ? '/de' : '/' },
                    { name: isDe ? 'Einrichtung' : 'Kurulum', path: kurulumPath },
                    { name: isDe ? deviceInfo.nameDe : deviceInfo.name, path: null },
                  ]}
                />
              </div>

              <Link
                to={kurulumPath}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-8 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {isDe ? 'Alle Geräte' : 'Tüm cihazlara dön'}
              </Link>

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="shrink-0"
                >
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${deviceInfo.color} p-0.5 shadow-lg shadow-black/30`}>
                    <div className="w-full h-full rounded-[14px] bg-[#0a0a0a]/80 flex items-center justify-center backdrop-blur-sm">
                      <DeviceIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex-1"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stepsCount > 0 && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${deviceInfo.bg} ${deviceInfo.colorLight} border border-current/20`}>
                        <Zap className="w-3 h-3" />
                        {stepsCount} {isDe ? 'Schritte' : 'adım'}
                      </span>
                    )}
                    {appName && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        <Download className="w-3 h-3" />
                        {appName}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#141414]/10 text-blue-400 border border-blue-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {isDe ? 'Kostenlos' : 'Ücretsiz'}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#141414]">
                    {isDe ? `${deviceInfo.nameDe} IPTV Einrichtungsanleitung` : `${deviceInfo.name} IPTV Kurulum Rehberi`}
                  </h1>
                  <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
                    {isDe
                      ? `Schritt-für-Schritt Anleitung für die IPTV-Einrichtung auf Ihrem ${deviceInfo.nameDe}. Genießen Sie 10.000+ Kanäle in HD & 4K Qualität.`
                      : `${deviceInfo.name} cihazınızda adım adım IPTV kurulumu. 10.000+ kanala HD ve 4K kalitede ulaşın.`}
                  </p>
                </motion.div>
              </div>

              {/* Quick Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10"
              >
                {quickStats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <stat.icon className={`w-5 h-5 ${deviceInfo.colorLight} shrink-0`} />
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
                      <div className="text-sm font-bold text-white truncate">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* ── Prerequisites Section ── */}
          <section className="py-12 px-4 border-y border-slate-800/50 bg-[#0a0a0a]/30">
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${deviceInfo.color} flex items-center justify-center`}>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">
                  {isDe ? 'Bevor Sie beginnen' : 'Başlamadan Önce Gerekenler'}
                </h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {prerequisites.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#0a0a0a]/60 border border-slate-800/60"
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-lg ${deviceInfo.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${deviceInfo.colorLight}`} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Installation Steps ── */}
          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 max-w-7xl relative z-10">
            <InstallationPageLayout
              siteData={siteData}
              pageContent={setupData}
              isLoading={loading && !setupData}
              forceDevice={deviceSlug}
              hideDeviceSelector
            />
          </div>

          {/* ── FAQ Section (visible) ── */}
          {faqItems.length > 0 && (
            <DeviceFaqSection faqItems={faqItems} isDe={isDe} deviceInfo={deviceInfo} />
          )}

          {/* ── CTA Section ── */}
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 md:p-12 bg-gradient-to-br ${deviceInfo.color} overflow-hidden text-center shadow-2xl`}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <DeviceIcon className="w-12 h-12 text-white/80 mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {isDe ? 'Bereit loszulegen?' : 'Başlamaya Hazır mısınız?'}
                  </h3>
                  <p className="text-white/80 mb-8 max-w-lg mx-auto">
                    {isDe
                      ? 'Testen Sie unseren Service kostenlos oder wählen Sie direkt ein Paket.'
                      : 'Ücretsiz test ile kalitemizi deneyin veya hemen paket seçin.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      to={testPath}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-[#141414] transition-colors shadow-lg"
                    >
                      <FlaskConical className="w-5 h-5" />
                      {isDe ? 'Kostenlos testen' : 'Ücretsiz Test'}
                    </Link>
                    <Link
                      to={paketlerPath}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      {isDe ? 'Pakete ansehen' : 'Paketleri Gör'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── SEO Content Section ── */}
          <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-16 max-w-7xl">
            <DeviceSeoContentSection deviceSlug={deviceSlug} isDe={isDe} />
          </div>
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

/* ── FAQ Accordion Component ── */
const DeviceFaqSection = ({ faqItems, isDe, deviceInfo }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-16 px-4 bg-[#0a0a0a]/30 border-y border-slate-800/50">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${deviceInfo.bg} ${deviceInfo.colorLight} border border-current/20 mb-4`}>
            FAQ
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {isDe ? 'Häufig gestellte Fragen' : 'Sık Sorulan Sorular'}
          </h2>
          <p className="text-slate-400 mt-2">
            {isDe
              ? `${deviceInfo.nameDe} IPTV Einrichtung`
              : `${deviceInfo.name} IPTV kurulumu hakkında`}
          </p>
        </div>
        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border transition-colors ${isOpen ? 'bg-[#0a0a0a]/60 border-primary/30' : 'bg-[#0a0a0a]/40 border-slate-800/60 hover:border-slate-700'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-white text-sm md:text-base pr-4">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InstallationDevicePage;
