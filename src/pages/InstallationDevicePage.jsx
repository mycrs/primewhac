import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation, Navigate } from 'react-router-dom';
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
import SmartTvHubPage from '@/pages/SmartTvHubPage';
import IosHubPage from '@/pages/IosHubPage';
import MacHubPage from '@/pages/MacHubPage';
import WindowsHubPage from '@/pages/WindowsHubPage';
import TabletHubPage from '@/pages/TabletHubPage';
import AndroidPhoneHubPage from '@/pages/AndroidPhoneHubPage';
import TvBrandGuidePage from '@/pages/TvBrandGuidePage';
import { getTvBrandGuide } from '@/data/tvBrandGuides';
import {
  buildAndroidPhoneAppDevices,
  LEGACY_ANDROID_PHONE_REDIRECTS,
  ANDROID_PHONE_APPS,
} from '@/data/androidPhoneApps';
import { buildAndroidPhoneAppSteps } from '@/components/installation/guides/androidPhoneAppSteps';
import {
  resolveHubAppBySlug,
  buildDeviceEntryFromHubApp,
  mapDbStepsToGuide,
} from '@/utils/hubAppsConfig';
import {
  LEGACY_SMART_TV_REDIRECTS,
  buildSmartTvAppDevices,
  getSmartTvAppBySlug,
} from '@/data/smartTvApps';
import {
  buildIosAppDevices,
  getIosAppBySlug,
} from '@/data/iosApps';
import {
  buildMacAppDevices,
  getMacAppBySlug,
  LEGACY_MAC_REDIRECTS,
} from '@/data/macApps';
import {
  buildWindowsAppDevices,
  LEGACY_WINDOWS_REDIRECTS,
  WINDOWS_APPS,
} from '@/data/windowsApps';
import {
  buildTabletAppDevices,
  TABLET_APPS,
} from '@/data/tabletApps';
import {
  buildAndroidAppDevices,
  getAndroidAppBySlug,
} from '@/data/androidApps';
import { smartTvFallbackStepsTr, smartTvFallbackStepsDe } from '@/components/installation/guides/SmartTVGuide';
import { smartersFallbackStepsTr, smartersFallbackStepsDe } from '@/components/installation/guides/SmartTVSmartersGuide';
import { resolveAndroidTvGuideSteps } from '@/components/installation/guides/AndroidTVGuide';
import { buildIosAppSteps } from '@/components/installation/guides/iosAppSteps';
import { buildMacAppSteps } from '@/components/installation/guides/macAppSteps';
import { buildWindowsAppSteps } from '@/components/installation/guides/windowsAppSteps';
import { buildTabletAppSteps } from '@/components/installation/guides/tabletAppSteps';

function getSmartTvGuideSteps(smartTvApp, isDe) {
  if (!smartTvApp) return [];
  if (smartTvApp.appId === '0-player') return isDe ? smartTvFallbackStepsDe : smartTvFallbackStepsTr;
  if (smartTvApp.appId === 'smarters-pro') return isDe ? smartersFallbackStepsDe : smartersFallbackStepsTr;
  return [];
}

function getMacGuideSteps(macApp, isDe) {
  if (!macApp) return [];
  return buildMacAppSteps(isDe, macApp.appId);
}

function getWindowsGuideSteps(windowsApp, deviceConfig, isDe) {
  return getHubAppGuideSteps(windowsApp, deviceConfig, isDe, buildWindowsAppSteps);
}

function getTabletGuideSteps(tabletApp, deviceConfig, isDe) {
  return getHubAppGuideSteps(tabletApp, deviceConfig, isDe, buildTabletAppSteps);
}

function getHubAppGuideSteps(hubApp, dbConfig, isDe, fallbackBuilder) {
  if (!hubApp) return [];
  const dbApp = dbConfig?.apps?.find((a) => a.slug === hubApp.slug);
  if (dbApp?.steps?.length) {
    return mapDbStepsToGuide(dbApp.steps, hubApp.theme);
  }
  if (hubApp.steps?.length) {
    return mapDbStepsToGuide(hubApp.steps, hubApp.theme);
  }
  if (fallbackBuilder) return fallbackBuilder(isDe, hubApp.appId);
  return [];
}

function getAndroidPhoneGuideSteps(androidPhoneApp, deviceConfig, isDe) {
  return getHubAppGuideSteps(androidPhoneApp, deviceConfig, isDe, buildAndroidPhoneAppSteps);
}

function getIosGuideSteps(iosApp, isDe) {
  if (!iosApp) return [];
  return buildIosAppSteps(isDe, iosApp.appId);
}

const DEVICES = {
  ...Object.fromEntries(
    Object.entries(buildAndroidAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: Tv },
    ])
  ),
  'android-phone': {
    key: 'android_phone_config',
    name: 'Android Telefon',
    nameDe: 'Android Smartphone',
    icon: Smartphone,
    color: 'from-[#e50914] to-[#b20710]',
    colorLight: 'text-[#e50914]',
    bg: 'bg-[#e50914]/10',
  },
  ...Object.fromEntries(
    Object.entries(buildAndroidPhoneAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: Smartphone },
    ])
  ),
  'ios': {
    key: 'ios_config', name: 'iOS ve iPhone', nameDe: 'iOS und iPhone', icon: Smartphone,
    color: 'from-slate-400 to-slate-600', colorLight: 'text-slate-200', bg: 'bg-slate-500/10',
  },
  'windows': {
    key: 'windows_pc_config', name: 'Windows PC', nameDe: 'Windows PC', icon: Monitor,
    color: 'from-sky-400 to-blue-600', colorLight: 'text-sky-300', bg: 'bg-sky-500/10',
  },
  ...Object.fromEntries(
    Object.entries(buildWindowsAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: Monitor },
    ])
  ),
  'mac': {
    key: 'mac_config', name: 'Mac', nameDe: 'Mac', icon: AppWindow,
    color: 'from-slate-400 to-slate-600', colorLight: 'text-slate-200', bg: 'bg-slate-500/10',
  },
  ...Object.fromEntries(
    Object.entries(buildMacAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: AppWindow },
    ])
  ),
  ...Object.fromEntries(
    Object.entries(buildSmartTvAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: MonitorPlay },
    ])
  ),
  ...Object.fromEntries(
    Object.entries(buildIosAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: Smartphone },
    ])
  ),
  'tablet': {
    key: 'tablet_config', name: 'Tablet', nameDe: 'Tablet', icon: Tablet,
    color: 'from-orange-500 to-amber-600', colorLight: 'text-orange-400', bg: 'bg-orange-500/10',
  },
  ...Object.fromEntries(
    Object.entries(buildTabletAppDevices()).map(([slug, device]) => [
      slug,
      { ...device, icon: Tablet },
    ])
  ),
};

const CONTENT_ALIASES = {
  'android-phone-xc': 'android-phone',
  'android-phone-ibo': 'android-phone',
};

const InstallationDevicePage = ({ siteData }) => {
  const { device: deviceSlug } = useParams();
  const { pathname } = useLocation();
  const { fetchSetupPage, setupData, loading, error } = useSetupPage();
  const isDe = pathname.startsWith('/de');
  const kurulumPath = isDe ? '/de/einrichtung' : '/kurulum';
  const tvBrandGuide = getTvBrandGuide(deviceSlug);

  useEffect(() => {
    fetchSetupPage();
    window.scrollTo(0, 0);
  }, [fetchSetupPage, deviceSlug]);

  const smartTvApp = getSmartTvAppBySlug(deviceSlug);
  const iosApp = getIosAppBySlug(deviceSlug);
  const macApp = getMacAppBySlug(deviceSlug);
  const windowsApp = useMemo(
    () => resolveHubAppBySlug(deviceSlug, setupData?.windows_pc_config, WINDOWS_APPS),
    [deviceSlug, setupData],
  );
  const tabletApp = useMemo(
    () => resolveHubAppBySlug(deviceSlug, setupData?.tablet_config, TABLET_APPS),
    [deviceSlug, setupData],
  );
  const androidPhoneApp = useMemo(
    () => resolveHubAppBySlug(deviceSlug, setupData?.android_phone_config, ANDROID_PHONE_APPS),
    [deviceSlug, setupData],
  );
  const androidApp = getAndroidAppBySlug(deviceSlug);

  const deviceInfo = useMemo(() => {
    if (DEVICES[deviceSlug]) return DEVICES[deviceSlug];
    const hubApp = androidPhoneApp || windowsApp || tabletApp;
    if (hubApp) {
      const icon = androidPhoneApp ? Smartphone : tabletApp ? Tablet : Monitor;
      return { ...buildDeviceEntryFromHubApp(hubApp), icon };
    }
    return null;
  }, [deviceSlug, androidPhoneApp, windowsApp, tabletApp]);
  const contentSlug = smartTvApp?.contentSlug || iosApp?.contentSlug || macApp?.contentSlug || windowsApp?.contentSlug || tabletApp?.contentSlug || androidPhoneApp?.contentSlug || androidApp?.contentSlug || CONTENT_ALIASES[deviceSlug] || deviceSlug;

  const metadata = useMemo(() => {
    const name = deviceInfo ? (isDe ? deviceInfo.nameDe : deviceInfo.name) : 'Cihaz';
    const contentData = INSTALLATION_DEVICE_CONTENT[contentSlug];
    const keywords = contentData ? (isDe ? contentData.de?.keywords : contentData.tr?.keywords) : ['IPTV kurulum', name, 'M3U', 'Xtream Codes', 'donmayan IPTV'];
    const appLabel = smartTvApp
      ? (isDe ? smartTvApp.nameDe : smartTvApp.name)
      : iosApp
        ? (isDe ? iosApp.nameDe : iosApp.name)
        : macApp
          ? (isDe ? macApp.nameDe : macApp.name)
          : windowsApp
            ? (isDe ? windowsApp.nameDe : windowsApp.name)
            : tabletApp
              ? (isDe ? tabletApp.nameDe : tabletApp.name)
              : androidPhoneApp
                ? (isDe ? androidPhoneApp.nameDe : androidPhoneApp.name)
              : androidApp
                ? (isDe ? androidApp.nameDe : androidApp.name)
            : null;
    const baseDescription = smartTvApp
      ? (isDe
        ? `${appLabel} auf Smart TV einrichten — Schritt für Schritt mit M3U und Xtream Codes.`
        : `${appLabel} ile Smart TV IPTV kurulumu — M3U ve Xtream Codes adım adım.`)
      : iosApp
        ? (isDe
          ? `${appLabel} auf iPhone & iPad einrichten — Schritt für Schritt mit M3U und Xtream Codes.`
          : `${appLabel} ile iPhone ve iPad IPTV kurulumu — M3U ve Xtream Codes adım adım.`)
        : macApp
          ? (isDe
            ? `${appLabel} auf Mac einrichten — Schritt für Schritt mit M3U und Xtream Codes.`
            : `${appLabel} ile Mac IPTV kurulumu — M3U ve Xtream Codes adım adım.`)
          : windowsApp
            ? (isDe
              ? `${appLabel} auf Windows PC einrichten — Schritt für Schritt mit M3U und Xtream Codes.`
              : `${appLabel} ile Windows PC IPTV kurulumu — M3U ve Xtream Codes adım adım.`)
            : tabletApp
              ? (isDe
                ? `${appLabel} auf dem Tablet einrichten — Schritt für Schritt mit M3U und Xtream Codes.`
                : `${appLabel} ile tablet IPTV kurulumu — M3U ve Xtream Codes adım adım.`)
              : androidPhoneApp
                ? (isDe
                  ? `${appLabel} auf Android Smartphone per APK einrichten — Schritt für Schritt.`
                  : `${appLabel} ile Android telefon APK kurulumu — adım adım.`)
              : androidApp
                ? (isDe
                  ? `${appLabel} per APK installieren — Link per WhatsApp/E-Mail, dann M3U oder Xtream Codes Schritt für Schritt.`
                  : `${appLabel} APK ile kurulum — WhatsApp/e-posta linki, M3U veya Xtream Codes adım adım.`)
            : isDe
        ? `Schritt-für-Schritt ${name} IPTV Einrichtung. Mit M3U und Xtream Codes.`
        : `Adım adım ${name} IPTV kurulumu. M3U ve Xtream Codes ile kurulum nasıl yapılır?`;
    const ogImageFile = smartTvApp
      ? 'kurulum-smart-tv.jpg'
      : iosApp
        ? 'kurulum-ios.jpg'
        : macApp
          ? 'kurulum-mac.jpg'
          : windowsApp
            ? 'kurulum-windows.jpg'
            : tabletApp
              ? 'kurulum-tablet.jpg'
              : androidPhoneApp
                ? 'kurulum-android-phone.jpg'
                : androidApp
                  ? 'kurulum-android-tv.jpg'
                  : 'kurulum-genel.jpg';
    return {
      title: `${name} IPTV Kurulum Rehberi | QruzeTV`,
      titleDe: `${name} IPTV Einrichtungsanleitung | QruzeTV`,
      description: baseDescription,
      keywords: Array.from(new Set([...(keywords || []), `${name} IPTV`, `${name} IPTV kurulum`, 'IPTV kurulum rehberi'])),
      ogImage: `${SITE_URL}/og/${ogImageFile}`,
    };
  }, [contentSlug, deviceInfo, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp, isDe]);

  const deviceConfig = useMemo(() => {
    const info = DEVICES[deviceSlug] || null;
    if (!info) return undefined;
    return setupData?.[info.key];
  }, [deviceSlug, setupData]);

  const appName = useMemo(() => {
    if (smartTvApp) return isDe ? smartTvApp.nameDe : smartTvApp.name;
    if (iosApp) return isDe ? iosApp.nameDe : iosApp.name;
    if (macApp) return isDe ? macApp.nameDe : macApp.name;
    if (windowsApp) return isDe ? windowsApp.nameDe : windowsApp.name;
    if (tabletApp) return isDe ? tabletApp.nameDe : tabletApp.name;
    if (androidPhoneApp) return isDe ? androidPhoneApp.nameDe : androidPhoneApp.name;
    if (androidApp) return isDe ? androidApp.nameDe : androidApp.name;
    if (deviceConfig) {
      if (Array.isArray(deviceConfig.app_links) && deviceConfig.app_links.length > 0) {
        const fromLinks = deviceConfig.app_links.map((l) => l.app_name).filter(Boolean).join(' / ');
        if (fromLinks) return fromLinks;
      }
      if (deviceConfig.title) return deviceConfig.title;
    }
    return null;
  }, [deviceConfig, smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, androidApp, isDe]);

  const guideSteps = useMemo(() => {
    if (smartTvApp) return getSmartTvGuideSteps(smartTvApp, isDe);
    if (iosApp) return getIosGuideSteps(iosApp, isDe);
    if (macApp) return getMacGuideSteps(macApp, isDe);
    if (windowsApp) return getWindowsGuideSteps(windowsApp, deviceConfig, isDe);
    if (tabletApp) return getTabletGuideSteps(tabletApp, deviceConfig, isDe);
    if (androidPhoneApp) return getAndroidPhoneGuideSteps(androidPhoneApp, deviceConfig, isDe);
    if (deviceSlug === 'android-tv') {
      return resolveAndroidTvGuideSteps(deviceConfig?.steps, isDe);
    }
    return deviceConfig?.steps || [];
  }, [smartTvApp, iosApp, macApp, windowsApp, tabletApp, androidPhoneApp, isDe, deviceConfig, deviceSlug]);

  if (LEGACY_SMART_TV_REDIRECTS[deviceSlug]) {
    return <Navigate to={`${kurulumPath}/${LEGACY_SMART_TV_REDIRECTS[deviceSlug]}`} replace />;
  }

  if (LEGACY_MAC_REDIRECTS[deviceSlug]) {
    return <Navigate to={`${kurulumPath}/${LEGACY_MAC_REDIRECTS[deviceSlug]}`} replace />;
  }

  if (LEGACY_WINDOWS_REDIRECTS[deviceSlug]) {
    return <Navigate to={`${kurulumPath}/${LEGACY_WINDOWS_REDIRECTS[deviceSlug]}`} replace />;
  }

  if (LEGACY_ANDROID_PHONE_REDIRECTS[deviceSlug]) {
    return <Navigate to={`${kurulumPath}/${LEGACY_ANDROID_PHONE_REDIRECTS[deviceSlug]}`} replace />;
  }

  if (deviceSlug === 'smart-tv') {
    return <SmartTvHubPage siteData={siteData} />;
  }

  if (deviceSlug === 'ios') {
    return <IosHubPage siteData={siteData} />;
  }

  if (deviceSlug === 'mac') {
    return <MacHubPage siteData={siteData} />;
  }

  if (deviceSlug === 'windows') {
    return <WindowsHubPage siteData={siteData} />;
  }

  if (deviceSlug === 'tablet') {
    return <TabletHubPage siteData={siteData} />;
  }

  if (deviceSlug === 'android-phone') {
    return <AndroidPhoneHubPage siteData={siteData} />;
  }

  if (tvBrandGuide) {
    return <TvBrandGuidePage guide={tvBrandGuide} siteData={siteData} isDe={isDe} />;
  }

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
  const stepsCount = guideSteps.length;

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
      { q: isDe ? 'Qruze Player im Play Store?' : 'Qruze Player Play Store\'da var mı?', a: isDe ? 'Nein. APK per Downloader mit gesendetem Link installieren.' : 'Hayır. Downloader ile size gönderilen APK linkinden kurulur.' },
      { q: isDe ? 'Qruze Player auf Fire TV Stick?' : "Fire TV Stick'te nasıl kurulur?", a: isDe ? 'Downloader aus dem Amazon Store, APK-Link einfügen.' : 'Downloader indirin, APK linkini yapıştırın ve yükleyin.' },
      { q: isDe ? 'Wo bekomme ich den APK-Link?' : 'APK linkini nereden alırım?', a: isDe ? 'Nach dem Abo per WhatsApp oder E-Mail.' : 'Abonelik sonrası WhatsApp veya e-posta ile iletilir.' },
    ],
    'ios': [
      { q: isDe ? 'Ist 000 Player kostenlos?' : '000 Player ücretsiz mi?', a: isDe ? 'Ja, Grundfunktionen sind kostenlos.' : 'Evet, temel özellikler ücretsiz.' },
      { q: isDe ? 'Läuft auf Apple TV?' : "Apple TV'de çalışır mı?", a: isDe ? 'Ja, im tvOS App Store erhältlich.' : 'Evet, tvOS App Store\'dan indirilebilir.' },
    ],
    'android-phone': [
      { q: isDe ? 'Qruze Player im Play Store?' : 'Qruze Player Play Store\'da var mı?', a: isDe ? 'Nein. Installation per gesendetem APK-Link (WhatsApp/E-Mail).' : 'Hayır. Size gönderilen APK linki ile kurulum yapılır.' },
      { q: isDe ? 'Wo bekomme ich den APK-Link?' : 'APK linkini nereden alırım?', a: isDe ? 'Nach dem Abo per WhatsApp oder E-Mail.' : 'Abonelik sonrası WhatsApp veya e-posta ile iletilir.' },
      { q: isDe ? 'Chromecast unterstützt?' : 'Chromecast destekler mi?', a: isDe ? 'Ja, Cast auf Chromecast-fähige Geräte möglich.' : 'Evet, Chromecast destekli cihazlara yansıtma yapabilir.' },
    ],
    'windows': [
      { q: isDe ? 'Welche App für mein Paket?' : 'Paketime hangi uygulama?', a: isDe ? 'Türkei → IBO Player Pro. Europa Standard (M3U) → ABC. Europa HD (Portal) → VS Player.' : 'Türkiye paketi → IBO Player Pro. Avrupa Standart (M3U) → ABC. Avrupa HD (portal) → VS Player.' },
      { q: isDe ? 'IBO Player Pro kostenlos?' : 'IBO Player Pro ücretsiz mi?', a: isDe ? 'Ja, im Microsoft Store kostenlos.' : 'Evet, Microsoft Store\'dan ücretsiz indirilebilir.' },
    ],
    'mac': [
      { q: isDe ? 'IINA kostenlos?' : 'IINA ücretsiz mi?', a: isDe ? 'Ja, Open Source und kostenlos.' : 'Evet, açık kaynak ve ücretsiz.' },
      { q: isDe ? 'Apple Silicon unterstützt?' : 'Apple Silicon destekler mi?', a: isDe ? 'Ja, native Unterstützung.' : 'Evet, native destek.' },
    ],
    'tablet': [
      { q: isDe ? 'Welche App für mein Paket?' : 'Paketime hangi uygulama?', a: isDe ? 'Türkei → IBO Player Pro. Europa Standard (M3U) → ABC. Europa HD (Portal) → VS Player.' : 'Türkiye paketi → IBO Player Pro. Avrupa Standart (M3U) → ABC. Avrupa HD (portal) → VS Player.' },
      { q: isDe ? 'iPad und Android?' : 'iPad ve Android destekler mi?', a: isDe ? 'IBO Player Pro und ABC auf iPad (App Store) und Android (Play Store). VS Player primär Android-Tablet.' : 'IBO Player Pro ve ABC hem iPad (App Store) hem Android tablet (Play Store). VS Player ağırlıklı Android tablet.' },
    ],
  };

  const faqItems = smartTvApp
    ? (isDe ? smartTvApp.faq.de : smartTvApp.faq.tr)
    : iosApp
      ? (isDe ? iosApp.faq.de : iosApp.faq.tr)
      : macApp
        ? (isDe ? macApp.faq.de : macApp.faq.tr)
        : windowsApp
          ? (isDe ? windowsApp.faq.de : windowsApp.faq.tr)
          : tabletApp
            ? (isDe ? tabletApp.faq.de : tabletApp.faq.tr)
            : androidPhoneApp
              ? (isDe ? androidPhoneApp.faq.de : androidPhoneApp.faq.tr)
            : androidApp
              ? (isDe ? androidApp.faq.de : androidApp.faq.tr)
        : (deviceFaqItems[deviceSlug] || []);
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
      step: guideSteps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title || `Adım ${i + 1}`,
        text: s.description || s.content || '',
      })),
    },
    breadcrumbSchema,
    ...(faqSchema ? [faqSchema] : []),
  ];

  const quickStats = [
    ...(!(smartTvApp || iosApp || macApp || windowsApp || tabletApp || androidPhoneApp || androidApp) && stepsCount > 0
      ? [{ icon: Gauge, label: isDe ? 'Schritte' : 'Adım Sayısı', value: `${stepsCount} ${isDe ? 'Schritte' : 'adım'}` }]
      : []),
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
        ogImage={metadata.ogImage}
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
                    ...(smartTvApp
                      ? [{ name: 'Smart TV', path: `${kurulumPath}/smart-tv` }]
                      : []),
                    ...(iosApp
                      ? [{ name: isDe ? 'iOS & iPhone' : 'iOS ve iPhone', path: `${kurulumPath}/ios` }]
                      : []),
                    ...(macApp
                      ? [{ name: 'Mac', path: `${kurulumPath}/mac` }]
                      : []),
                    ...(windowsApp
                      ? [{ name: 'Windows PC', path: `${kurulumPath}/windows` }]
                      : []),
                    ...(tabletApp
                      ? [{ name: 'Tablet', path: `${kurulumPath}/tablet` }]
                      : []),
                    ...(androidPhoneApp
                      ? [{ name: isDe ? 'Android Smartphone' : 'Android Telefon', path: `${kurulumPath}/android-phone` }]
                      : []),
                    { name: isDe ? deviceInfo.nameDe : deviceInfo.name, path: null },
                  ]}
                />
              </div>

              <Link
                to={smartTvApp ? `${kurulumPath}/smart-tv` : iosApp ? `${kurulumPath}/ios` : macApp ? `${kurulumPath}/mac` : windowsApp ? `${kurulumPath}/windows` : tabletApp ? `${kurulumPath}/tablet` : androidPhoneApp ? `${kurulumPath}/android-phone` : kurulumPath}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-8 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                {smartTvApp
                  ? (isDe ? 'Smart TV Apps' : 'Smart TV uygulamaları')
                  : iosApp
                    ? (isDe ? 'iOS Apps' : 'iOS uygulamaları')
                    : macApp
                      ? (isDe ? 'Mac Apps' : 'Mac uygulamaları')
                      : windowsApp
                        ? (isDe ? 'Windows Apps' : 'Windows uygulamaları')
                        : tabletApp
                          ? (isDe ? 'Tablet Apps' : 'Tablet uygulamaları')
                        : androidPhoneApp
                          ? (isDe ? 'Android Smartphone Apps' : 'Android telefon uygulamaları')
                      : (isDe ? 'Alle Geräte' : 'Tüm cihazlara dön')}
              </Link>

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="shrink-0"
                >
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${deviceInfo.color} p-0.5 shadow-lg shadow-black/30`}>
                    <div className="w-full h-full rounded-[14px] bg-[#0a0a0a]/80 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                      {(smartTvApp || iosApp || macApp || windowsApp || tabletApp || androidPhoneApp || androidApp) && deviceInfo.logo ? (
                        <img src={deviceInfo.logo} alt={appName || 'App'} className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-xl" />
                      ) : (smartTvApp || iosApp || macApp || windowsApp || tabletApp || androidPhoneApp || androidApp) && deviceInfo.logoInitials ? (
                        <span className={`text-xl font-black ${deviceInfo.colorLight}`}>{deviceInfo.logoInitials}</span>
                      ) : (
                        <DeviceIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      )}
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
                    {!(smartTvApp || iosApp || macApp || windowsApp || tabletApp || androidPhoneApp || androidApp) && stepsCount > 0 && (
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

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                    {isDe ? `${deviceInfo.nameDe} IPTV Einrichtungsanleitung` : `${deviceInfo.name} IPTV Kurulum Rehberi`}
                  </h1>
                  <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
                    {smartTvApp
                      ? (isDe
                        ? `${smartTvApp.nameDe} auf Smart TV einrichten — M3U oder Xtream Codes, Schritt für Schritt.`
                        : `Smart TV'de ${smartTvApp.name} ile adım adım IPTV kurulumu. M3U veya Xtream Codes ile birkaç dakikada hazır.`)
                      : iosApp
                        ? (isDe
                          ? `${iosApp.nameDe} auf iPhone & iPad einrichten — M3U oder Xtream Codes, Schritt für Schritt.`
                          : `iPhone ve iPad'de ${iosApp.name} ile adım adım IPTV kurulumu. M3U veya Xtream Codes ile birkaç dakikada hazır.`)
                        : macApp
                          ? (isDe
                            ? `${macApp.nameDe} auf Mac einrichten — M3U oder Xtream Codes, Schritt für Schritt.`
                            : `Mac'te ${macApp.name} ile adım adım IPTV kurulumu. M3U veya Xtream Codes ile birkaç dakikada hazır.`)
                          : windowsApp
                            ? (isDe
                              ? `${windowsApp.nameDe} auf Windows PC einrichten — M3U oder Xtream Codes, Schritt für Schritt.`
                              : `Windows PC'de ${windowsApp.name} ile adım adım IPTV kurulumu. M3U veya Xtream Codes ile birkaç dakikada hazır.`)
                            : tabletApp
                              ? (isDe
                                ? `${tabletApp.nameDe} auf dem Tablet einrichten — M3U oder Xtream Codes, Schritt für Schritt.`
                                : `Tablette ${tabletApp.name} ile adım adım IPTV kurulumu. M3U veya Xtream Codes ile birkaç dakikada hazır.`)
                              : androidPhoneApp
                                ? (isDe
                                  ? `${androidPhoneApp.nameDe} auf Android Smartphone einrichten — APK, Schritt für Schritt.`
                                  : `Android telefonda ${androidPhoneApp.name} ile adım adım APK kurulumu.`)
                              : androidApp
                                ? (isDe
                                  ? `${androidApp.nameDe} per APK installieren — WhatsApp/E-Mail-Link, dann Zugangsdaten eingeben.`
                                  : `${androidApp.name} APK ile kurun — WhatsApp/e-posta linki, ardından giriş bilgilerinizi girin.`)
                          : (isDe
                        ? `Schritt-für-Schritt Anleitung für die IPTV-Einrichtung auf Ihrem ${deviceInfo.nameDe}. Genießen Sie 10.000+ Kanäle in HD & 4K Qualität.`
                        : `${deviceInfo.name} cihazınızda adım adım IPTV kurulumu. 10.000+ kanala HD ve 4K kalitede ulaşın.`)}
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
            <DeviceSeoContentSection deviceSlug={contentSlug} isDe={isDe} />
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
