import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Key,
  Layers,
  Lightbulb,
  ListVideo,
  MonitorPlay,
  Play,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tv,
  Wrench,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import {
  APP_GUIDES,
  APP_GUIDES_BASE,
  getAppGuide,
  getAppGuideDescription,
  getAppGuideTitle,
} from '@/data/appInstallationGuides';
import { appGuideSchemas } from '@/utils/appGuideSchema';
import { SITE_URL } from '@/constants/siteUrl';
import AppUiMockup from '@/components/installation/AppUiMockup';

const indexTitle = 'IPTV Uygulama Kurulum Rehberleri | QruzeTV';
const indexDescription =
  'SmartOne, 0 Player, HotPlayer, Smarters Pro, XCIPTV, TiviMate, IBO Player, Smart IPTV, Televizo ve IPTVX için gerçekçi adım adım kurulum rehberleri.';

function AppMark({ guide, large = false }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111117] ${
        large ? 'h-20 w-20 p-3 sm:h-24 sm:w-24' : 'h-14 w-14 p-2.5'
      }`}
      style={{ boxShadow: `0 0 36px ${guide.accent}20` }}
    >
      {guide.logo ? (
        <img
          src={guide.logo}
          alt={guide.logoAlt || `${guide.name} logosu`}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      ) : (
        <span className="text-lg font-black tracking-tight" style={{ color: guide.accent }}>
          {guide.shortName.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function AppCard({ guide }) {
  return (
    <Link
      to={`${APP_GUIDES_BASE}/${guide.slug}/`}
      className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#111116]/90 p-5 transition hover:-translate-y-1 hover:border-white/25 hover:bg-[#17171e]"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <AppMark guide={guide} />
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${guide.accent}15`,
              color: guide.accent,
              border: `1px solid ${guide.accent}30`,
            }}
          >
            {guide.loginType === 'web-portal' ? 'Web Portalı' : 'Cihazdan Giriş'}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-bold text-white group-hover:text-red-400 transition">
          {guide.name}
        </h3>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {guide.devices.slice(0, 3).join(' · ')}
        </p>
      </div>

      <div className="mt-5 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <ListVideo className="h-3.5 w-3.5" style={{ color: guide.accent }} />
          <span className="truncate">{guide.method}</span>
        </div>
        <span className="mt-3 flex items-center justify-between text-xs font-bold text-white group-hover:text-red-400">
          Kurulum Rehberini Aç <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function Crumbs({ guide }) {
  return (
    <nav aria-label="Gezinti yolu" className="flex flex-wrap items-center gap-2 text-xs text-slate-400 sm:text-sm">
      <Link className="hover:text-white" to="/">
        Ana Sayfa
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link className="hover:text-white" to="/kurulum/">
        Kurulum
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      {guide ? (
        <>
          <Link className="hover:text-white" to={`${APP_GUIDES_BASE}/`}>
            Uygulamalar
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-200" aria-current="page">
            {guide.name}
          </span>
        </>
      ) : (
        <span className="text-slate-200" aria-current="page">
          Uygulama Rehberleri
        </span>
      )}
    </nav>
  );
}

export default function AppInstallationGuidesPage({ siteData }) {
  const { appSlug } = useParams();
  const guide = appSlug ? getAppGuide(appSlug) : null;
  const unknown = Boolean(appSlug && !guide);
  const title = guide ? getAppGuideTitle(guide) : indexTitle;
  const description = guide ? getAppGuideDescription(guide) : indexDescription;
  const path = guide ? `${APP_GUIDES_BASE}/${guide.slug}/` : `${APP_GUIDES_BASE}/`;
  const related = guide
    ? APP_GUIDES.filter((item) => item.slug !== guide.slug && item.devices.some((device) => guide.devices.includes(device))).slice(0, 3)
    : [];
  const crumbs = <Crumbs guide={guide} />;

  const [filterDevice, setFilterDevice] = useState('all');
  const filteredGuides = APP_GUIDES.filter((item) => {
    if (filterDevice === 'all') return true;
    if (filterDevice === 'tv') return item.devices.some((d) => d.includes('Samsung') || d.includes('LG') || d.includes('Smart TV'));
    if (filterDevice === 'android') return item.devices.some((d) => d.includes('Android') || d.includes('Fire'));
    if (filterDevice === 'apple') return item.devices.some((d) => d.includes('Apple') || d.includes('iPhone') || d.includes('iPad'));
    return true;
  });

  return (
    <div className="min-h-screen bg-[#08080b] text-slate-200">
      <SEOHead
        title={unknown ? 'Rehber bulunamadı | QruzeTV' : title}
        description={description}
        canonicalUrl={`${SITE_URL}${path}`}
        noindex={unknown}
        jsonLd={unknown ? undefined : appGuideSchemas(guide, SITE_URL)}
      />
      <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

      <main className="pt-24 sm:pt-28">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(229,9,20,0.14),transparent_45%),linear-gradient(180deg,#100d10,#08080b)]">
          <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-5 sm:px-6 sm:pb-20">
            {crumbs}

            {unknown ? (
              <div className="py-20 text-center">
                <h1 className="text-3xl font-bold text-white">Rehber bulunamadı</h1>
                <p className="mt-3 text-slate-400">Aradığınız uygulama rehberi bulunamadı veya taşınmış olabilir.</p>
                <Link
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500"
                  to={`${APP_GUIDES_BASE}/`}
                >
                  Tüm Uygulama Rehberlerine Dön <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : guide ? (
              <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
                <div>
                  <div className="flex items-center gap-3">
                    <AppMark guide={guide} large />
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${guide.accent}15`,
                          color: guide.accent,
                          border: `1px solid ${guide.accent}30`,
                        }}
                      >
                        {guide.loginType === 'web-portal' ? <Globe className="h-3.5 w-3.5" /> : <Key className="h-3.5 w-3.5" />}
                        {guide.loginType === 'web-portal' ? 'Resmî Web Portalı ile Kurulum' : 'Doğrudan Uygulama İçi Giriş'}
                      </span>
                      <div className="mt-1.5 text-xs font-semibold text-slate-400">
                        Protokol: <span className="text-white">{guide.method}</span>
                      </div>
                    </div>
                  </div>

                  <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                    {guide.name} nasıl kurulur?
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                    {guide.intro}
                  </p>

                  {/* Required credentials tags */}
                  {guide.keyInputs && (
                    <div className="mt-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gereken Bilgiler:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {guide.keyInputs.map((input) => (
                          <span
                            key={input}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-mono font-medium text-slate-300"
                          >
                            {input}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supported devices badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.devices.map((device) => (
                      <span
                        key={device}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-slate-400"
                      >
                        {device}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#adimlar"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e50914] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-600"
                    >
                      Kuruluma Başla <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                      to="/test/"
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      <Zap className="h-4 w-4 text-amber-400" /> Ücretsiz Test Yayını Al
                    </Link>
                  </div>
                </div>

                {/* Bespoke Interactive Simulation */}
                <AppUiMockup guide={guide} />
              </div>
            ) : (
              /* Application Library Hub Header */
              <div className="mx-auto max-w-3xl pb-3 pt-12 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-xs font-bold tracking-wide text-red-300">
                  <BookOpen className="h-4 w-4" /> 10 POPÜLER OYNATICI REHBERİ
                </span>
                <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
                  IPTV Uygulamaları Nasıl Kurulur?
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                  Kullandığınız oynatıcıyı seçin; her uygulamanın kendine has arayüzüne, giriş yöntemine ve kumanda kısayollarına uygun resmî rehberi inceleyin.
                </p>

                {/* Filter Pills */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {[
                    { id: 'all', label: 'Tüm Uygulamalar' },
                    { id: 'tv', label: 'Smart TV (Samsung/LG)' },
                    { id: 'android', label: 'Android TV & Box' },
                    { id: 'apple', label: 'Apple TV & iOS' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilterDevice(tab.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        filterDevice === tab.id
                          ? 'bg-red-600 text-white'
                          : 'border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Detailed Guide Body */}
        {!unknown && guide ? (
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_290px] lg:gap-14 lg:py-16">
            <article className="min-w-0 space-y-12">
              {/* Pro Tips Callout Box */}
              {guide.proTips && guide.proTips.length > 0 && (
                <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] to-amber-900/[0.03] p-5 sm:p-7">
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <Lightbulb className="h-5 w-5 shrink-0" />
                    <h2 className="text-base font-bold uppercase tracking-wider text-amber-300 sm:text-lg">
                      Teknisyen & Uzman Tavsiyeleri ({guide.shortName})
                    </h2>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {guide.proTips.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 text-xs sm:text-sm leading-6 text-slate-300">
                        <span className="font-bold text-amber-400 shrink-0">★</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Prerequisites Section */}
              <section className="rounded-2xl border border-white/10 bg-[#111116] p-5 sm:p-7">
                <div className="flex items-center gap-2.5 text-white">
                  <Check className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-xl font-bold">Başlamadan Önce Gerekenler</h2>
                </div>
                <ul className="mt-4 space-y-3">
                  {guide.prerequisites.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <span>{guide.name} bağımsız bir oynatıcıdır; yayın listesi QruzeTV aboneliğinizle ayrıca verilir.</span>
                  {guide.portalUrl && (
                    <a
                      href={guide.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-red-400 hover:underline"
                    >
                      {guide.portalName || 'Yönetim Portalı'} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </section>

              {/* Step-by-Step Instructions */}
              <section id="adimlar" className="scroll-mt-28">
                <div className="mb-7">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                    ADIM ADIM KURULUM
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                    {guide.name} Nasıl Kurulur?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Aşağıdaki adımları sırayla takip edin. Cihazınızın kumandasını veya telefonunuzu hazır bulundurun.
                  </p>
                </div>

                <ol className="space-y-4">
                  {guide.steps.map(([heading, text], index) => (
                    <li
                      key={heading}
                      className="group flex gap-4 rounded-2xl border border-white/10 bg-[#101015] p-5 transition hover:border-white/20 sm:gap-5 sm:p-6"
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-black shadow-inner"
                        style={{ color: guide.accent }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white sm:text-lg group-hover:text-red-400 transition">
                          {heading}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Developer / Store Screenshot Section */}
              {guide.screenshot && (
                <section className="scroll-mt-28">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                        REFERANS GÖRÜNÜM
                      </span>
                      <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                        {guide.name} Resmî Ekran Görüntüsü
                      </h2>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                      <MonitorPlay className="h-3.5 w-3.5" style={{ color: guide.accent }} /> Orijinal Arayüz
                    </span>
                  </div>

                  <figure className="overflow-hidden rounded-3xl border border-white/10 bg-[#111116] p-3 shadow-2xl transition hover:border-white/20 sm:p-4">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08090d]">
                      <img
                        src={guide.screenshot}
                        alt={`${guide.name} resmî ekran görüntüsü ve arayüzü`}
                        loading="lazy"
                        className="h-auto w-full max-h-[500px] object-contain mx-auto bg-black/40"
                      />
                    </div>
                    <figcaption className="mt-3 px-2 flex flex-wrap items-center justify-between gap-2 text-xs leading-5 text-slate-400">
                      <span>{guide.screenshotCaption || `${guide.name} orijinal uygulama kütüphanesi ve oynatıcı arayüzü.`}</span>
                      <a
                        className="inline-flex items-center gap-1 font-semibold text-red-400 hover:text-red-300 underline underline-offset-4"
                        href={guide.screenshotSource || guide.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Kaynak / Resmî Kayıt <ExternalLink className="h-3 w-3" />
                      </a>
                    </figcaption>
                  </figure>
                </section>
              )}

              {/* App-Specific Troubleshooting */}
              <section id="sorunlar" className="scroll-mt-28">
                <div className="flex items-center gap-2 text-red-400">
                  <Wrench className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">SORUN GİDERME</span>
                </div>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {guide.name} Kurulumunda Sorun mu Yaşıyorsunuz?
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {guide.troubleshooting ? (
                    guide.troubleshooting.map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-[#111116] p-5">
                        <h3 className="font-bold text-white text-base">{item.title}</h3>
                        <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-400">{item.text}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="rounded-2xl border border-white/10 bg-[#111116] p-5">
                        <h3 className="font-bold text-white">Uygulama mağazada görünmüyor</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          TV’nizin markası kadar mağaza bölgesi (ülkesi) de önemlidir. Bölge ayarını Türkiye veya Almanya yaparak tekrar aratın veya harici TV Box bağlayın.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#111116] p-5">
                        <h3 className="font-bold text-white">Liste veya giriş açılmıyor</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Sunucu adresinin sonuna fazladan slash (/) koymadığınızdan, kullanıcı adı ve şifrenin baş harfini telefon klavyesinin büyük yapmadığından emin olun.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Frequently Asked Questions */}
              <section id="sss" className="scroll-mt-28">
                <div className="flex items-center gap-2 text-red-400">
                  <HelpCircle className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">SSS</span>
                </div>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  {guide.name} Hakkında Sık Sorulan Sorular
                </h2>

                <div className="mt-5 space-y-3">
                  {guide.faqs.map(([question, answer]) => (
                    <details
                      key={question}
                      className="group rounded-2xl border border-white/10 bg-[#111116] p-5 transition hover:border-white/20"
                    >
                      <summary className="cursor-pointer list-none pr-6 font-semibold text-white marker:content-none flex items-center justify-between">
                        <span>{question}</span>
                        <span className="text-red-400 transition-transform group-open:rotate-45 text-lg font-bold">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-slate-300 border-t border-white/5 pt-3">
                        {answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Reassurance & Live Support CTA */}
              <section className="rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-[#12080a] to-[#08080b] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300">
                      7/24 BİREBİR KURULUM DESTEĞİ
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                      {guide.name} Kurulumunda Takıldınız mı?
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                      Müşteri temsilcilerimiz televizyon veya cihaz modelinize göre adım adım rehberlik eder, listenizi birkaç dakikada hazır hale getirir.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                    <a
                      href="https://wa.me/905300000000?text=Merhaba,%20uygulama%20kurulumu%20i%C3%A7in%20destek%20almak%20istiyorum."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/30"
                    >
                      WhatsApp Canlı Destek <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                      to="/test/"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition"
                    >
                      Ücretsiz Test Yayını Al
                    </Link>
                  </div>
                </div>
              </section>

              {/* Comprehensive Legal & Copyright Safe Harbor Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-5 sm:p-6 text-xs leading-6 text-slate-400 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <ShieldCheck className="h-4 w-4 text-red-400 shrink-0" />
                  <span>Yasal Uyarı, Telif Hakları ve Marka Bildirimi</span>
                </div>
                <p>
                  <strong>Marka & Logo Sahipliği:</strong> {guide.name} ({guide.shortName}) ismi, logosu, ticari markaları ve ekran tasarımları ilgili bağımsız yazılım geliştiricisine aittir. QruzeTV, bu yazılımın geliştiricisi, resmî dağıtıcısı veya lisans satıcısı değildir. Sayfada yer alan logo ve ekran görüntüleri; kullanıcıların kendi televizyon veya cihazlarında ilgili oynatıcıyı kurabilmelerini kolaylaştırmak amacıyla, 5846 sayılı FSEK ve uluslararası <em>Adil Kullanım (Nominative Fair Use)</em> prensipleri çerçevesinde tanımlayıcı/eğitici referans olarak kullanılmıştır.
                </p>
                <p>
                  <strong>Zero-Hosting (Sıfır Dosya Barındırma):</strong> Sitemizde hiçbir üçüncü taraf oynatıcı APK’sı, kurulum dosyası veya telifli medya dosyası barındırılmaz. Kurulumlar, kullanıcıların TV veya cihazlarındaki resmî mağazalardan (Google Play Store, Apple App Store, Samsung Smart Hub, LG Content Store) doğrudan indirme yapması esasına dayanır.
                </p>
                <p className="border-t border-white/5 pt-2 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Resmî geliştirici dokümantasyonu:{' '}
                    <a
                      href={guide.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-red-400 underline underline-offset-4"
                    >
                      {guide.sourceLabel} <ExternalLink className="inline h-3 w-3" />
                    </a>
                  </span>
                  <span>
                    Telif ve içerik bildirimleri için:{' '}
                    <Link to="/iletisim/" className="text-slate-300 underline hover:text-white">
                      İletişim & Telif Masası
                    </Link>
                  </span>
                </p>
              </div>
            </article>

            {/* Sticky Sidebar Navigation */}
            <aside className="h-fit rounded-2xl border border-white/10 bg-[#111116] p-5 lg:sticky lg:top-28">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Bu Rehberde</h2>
              <nav className="mt-4 flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-400">
                <a className="hover:text-white transition flex items-center gap-2" href="#adimlar">
                  <Play className="h-3.5 w-3.5 text-red-400" /> Adım adım kurulum
                </a>
                <a className="hover:text-white transition flex items-center gap-2" href="#sorunlar">
                  <Wrench className="h-3.5 w-3.5 text-red-400" /> Sorun giderme
                </a>
                <a className="hover:text-white transition flex items-center gap-2" href="#sss">
                  <HelpCircle className="h-3.5 w-3.5 text-red-400" /> Sık sorulan sorular
                </a>
              </nav>

              <div className="mt-6 border-t border-white/10 pt-5 space-y-3">
                <Link
                  to={`${APP_GUIDES_BASE}/`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Tüm uygulama rehberleri
                </Link>
                <Link
                  to="/kurulum/"
                  className="block text-xs text-slate-400 hover:text-white"
                >
                  Cihaza göre kurulum (TV, Mobil, PC) →
                </Link>
              </div>
            </aside>
          </div>
        ) : !unknown ? (
          /* Application Library Grid */
          <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                  UYGULAMA KÜTÜPHANESİ
                </span>
                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Tüm IPTV Oynatıcı Rehberleri
                </h2>
              </div>
              <span className="text-sm font-semibold text-slate-400">
                {filteredGuides.length} rehber listeleniyor
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((item) => (
                <AppCard key={item.slug} guide={item} />
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-[#14141d] to-[#0c0c12] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Önce Cihazınızı mı Seçmek İstersiniz?</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400 max-w-2xl">
                    Samsung, LG, Philips, Vestel, TCL Smart TV modelleri veya Android TV Box, Firestick, Apple TV ve PC kurulum sayfalarına göz atın.
                  </p>
                </div>
                <Link
                  to="/kurulum/"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500 transition shrink-0"
                >
                  Cihaz Kurulum Rehberleri <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-[#0b0b0f] p-4 text-[11px] leading-5 text-slate-500">
              <p>
                <strong>Yasal Açıklama & Marka Bildirimi:</strong> Bu sayfada listelenen oynatıcı uygulamaların (SmartOne, 0 Player, HotPlayer, IPTV Smarters Pro, XCIPTV, TiviMate, IBO Player, Smart IPTV, Televizo, IPTVX) telif, ticari marka ve fikri mülkiyet hakları ilgili bağımsız yazılım geliştiricilerine aittir. QruzeTV bağımsız bir servis sağlayıcıdır; bu oynatıcı yazılımların resmî satıcısı veya geliştiricisi değildir. Sunulan rehberler, kullanıcıların yasal ve lisanslı cihazlarında M3U / Xtream listelerini kurabilmelerini sağlamak amacıyla eğitim ve teknik kılavuz niteliğinde hazırlanmıştır.
              </p>
            </div>
          </section>
        ) : null}

        {/* Related Guides Footer Section */}
        {guide && related.length > 0 && (
          <section className="border-t border-white/10 bg-[#0c0c10] py-14">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-red-400">KEŞFET</span>
                  <h2 className="mt-2 text-2xl font-bold text-white">İlgili Uygulama Rehberleri</h2>
                </div>
                <Link to={`${APP_GUIDES_BASE}/`} className="text-sm font-bold text-red-400 hover:text-red-300">
                  Tümünü gör →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <AppCard key={item.slug} guide={item} />
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-[#0b0b0f] p-4 text-[11px] leading-5 text-slate-500">
              <p>
                <strong>Yasal Açıklama & Marka Bildirimi:</strong> Bu sayfada listelenen oynatıcı uygulamaların (SmartOne, 0 Player, HotPlayer, IPTV Smarters Pro, XCIPTV, TiviMate, IBO Player, Smart IPTV, Televizo, IPTVX) telif, ticari marka ve fikri mülkiyet hakları ilgili bağımsız yazılım geliştiricilerine aittir. QruzeTV bağımsız bir servis sağlayıcıdır; bu oynatıcı yazılımların resmî satıcısı veya geliştiricisi değildir. Sunulan rehberler, kullanıcıların yasal ve lisanslı cihazlarında M3U / Xtream listelerini kurabilmelerini sağlamak amacıyla eğitim ve teknik kılavuz niteliğinde hazırlanmıştır.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer contactData={siteData?.contactData} siteData={siteData} />
    </div>
  );
}
