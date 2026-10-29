import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Gauge,
  Globe2,
  Info,
  MonitorCheck,
  Package,
  Play,
  Search,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
  Wrench,
} from 'lucide-react';
import Header from '@/components/Header';
import HeaderDE from '@/components/HeaderDE';
import Footer from '@/components/Footer';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SITE_URL } from '@/constants/siteUrl';
import {
  TV_BRAND_GUIDES,
  getTvBrandAppRecommendation,
  localizeTvBrandGuide,
} from '@/data/tvBrandGuides';

const TvBrandGuidePage = ({ guide, siteData, isDe = false }) => {
  const lang = isDe ? 'de' : 'tr';
  const content = useMemo(() => localizeTvBrandGuide(guide, lang), [guide, lang]);
  const [selectedSystemId, setSelectedSystemId] = useState(content.systems[0]?.id);
  const selectedSystem =
    content.systems.find((system) => system.id === selectedSystemId) || content.systems[0];
  const selectedApp = getTvBrandAppRecommendation(guide.slug, selectedSystem?.id, lang);

  const setupPath = isDe ? '/de/einrichtung' : '/kurulum';
  const testPath = isDe ? '/de/test' : '/test';
  const packagesPath = isDe ? '/de/pakete' : '/paketler';
  const canonicalPath = `${setupPath}/${guide.slug}`;
  const relatedGuides = Object.values(TV_BRAND_GUIDES).filter((item) => item.slug !== guide.slug);
  const updatedLabel = isDe ? 'Aktualisiert: 31. Juli 2026' : 'Güncellendi: 31 Temmuz 2026';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [guide.slug]);

  useEffect(() => {
    setSelectedSystemId(content.systems[0]?.id);
  }, [content.systems]);

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: isDe ? 'Startseite' : 'Ana Sayfa',
      item: `${SITE_URL}${isDe ? '/de/' : '/'}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: isDe ? 'Einrichtung' : 'Kurulum',
      item: `${SITE_URL}${setupPath}/`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Smart TV',
      item: `${SITE_URL}${setupPath}/smart-tv/`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: content.brand,
      item: `${SITE_URL}${canonicalPath}/`,
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: content.title,
      description: content.metaDescription,
      inLanguage: isDe ? 'de-DE' : 'tr-TR',
      datePublished: '2026-07-31',
      dateModified: '2026-07-31',
      mainEntityOfPage: `${SITE_URL}${canonicalPath}/`,
      author: {
        '@type': 'Organization',
        name: 'QruzeTV',
        url: `${SITE_URL}/`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'QruzeTV',
        url: `${SITE_URL}/`,
      },
      about: [
        `${content.brand} Smart TV`,
        'IPTV',
        ...content.systems.map((system) => system.label),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: content.title,
      description: content.metaDescription,
      totalTime: 'PT10M',
      supply: [
        { '@type': 'HowToSupply', name: isDe ? 'Rechtmäßiger IPTV-Zugang' : 'Yasal IPTV aboneliği' },
        { '@type': 'HowToSupply', name: isDe ? 'Internetverbindung' : 'İnternet bağlantısı' },
      ],
      step: content.howToSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    },
  ];

  const keywords = [
    `${content.brand} TV IPTV`,
    `${content.brand} IPTV ${isDe ? 'einrichten' : 'kurulumu'}`,
    content.title,
    'Smart TV IPTV',
    'M3U',
    'Xtream Codes',
    ...content.systems.map((system) => system.label),
  ];

  return (
    <ErrorBoundary>
      <SEOHead
        title={content.metaTitle}
        description={content.metaDescription}
        keywords={keywords}
        ogType="article"
        jsonLd={jsonLd}
        canonicalUrl={`${SITE_URL}${canonicalPath}`}
      />

      <div className="min-h-screen bg-[#080808] text-slate-200">
        {isDe ? (
          <HeaderDE contactData={siteData?.contactData} />
        ) : (
          <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        )}

        <main>
          <section className="relative overflow-hidden px-4 pb-14 pt-28 md:pb-20 md:pt-36">
            <div className={`absolute inset-0 bg-gradient-to-br ${content.accent} opacity-[0.09]`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(to_top,#080808,transparent_60%)]" />

            <div className="container relative z-10 mx-auto max-w-6xl">
              <BreadcrumbNavigation
                customCrumbs={[
                  { name: isDe ? 'Startseite' : 'Ana Sayfa', path: isDe ? '/de' : '/' },
                  { name: isDe ? 'Einrichtung' : 'Kurulum', path: setupPath },
                  { name: 'Smart TV', path: `${setupPath}/smart-tv` },
                  { name: content.brand, path: null },
                ]}
              />

              <Link
                to={`${setupPath}/smart-tv`}
                className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {isDe ? 'Zur Smart-TV-Auswahl' : 'Smart TV seçimine dön'}
              </Link>

              <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_380px]">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-1 text-xs font-bold ${content.accentBg} ${content.accentText}`}>
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {isDe ? 'Modellspezifischer Leitfaden' : 'Modele göre doğru yöntem'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {isDe ? 'Offizieller Store zuerst' : 'Önce resmî mağaza'}
                    </span>
                  </div>

                  <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {content.title}
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                    {content.intro}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>{updatedLabel}</span>
                    <span aria-hidden="true">•</span>
                    <span>{isDe ? 'Lesezeit: ca. 6 Minuten' : 'Okuma süresi: yaklaşık 6 dakika'}</span>
                    <span aria-hidden="true">•</span>
                    <span>{isDe ? 'Von der QruzeTV-Redaktion geprüft' : 'QruzeTV editör kontrolü'}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                  className="relative mx-auto aspect-[4/3] w-full max-w-sm"
                  aria-hidden="true"
                >
                  <div className={`absolute inset-6 rounded-full bg-gradient-to-br ${content.accent} opacity-25 blur-3xl`} />
                  <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl">
                    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-6">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${content.accent}`}>
                          <Tv className="h-6 w-6 text-white" />
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                          {isDe ? 'Kompatibilität' : 'Uyumluluk'}
                        </span>
                      </div>
                      <div className="my-auto">
                        <div className="text-5xl font-black text-white">{content.brand}</div>
                        <div className="mt-2 text-sm text-slate-400">
                          {content.systems.map((system) => system.label).join(' · ')}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[Wifi, Search, Play].map((Icon, index) => (
                          <div key={index} className="flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                            <Icon className={`h-5 w-5 ${content.accentText}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/[0.07] bg-white/[0.025] px-4 py-10">
            <div className="container mx-auto max-w-5xl">
              <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-start">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${content.accentBg}`}>
                  <Info className={`h-6 w-6 ${content.accentText}`} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">
                    {isDe ? 'Kurzantwort' : 'Kısa cevap'}
                  </h2>
                  <p className="mt-3 text-base leading-8 text-slate-300">
                    {content.summary}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <span className={`text-sm font-extrabold uppercase tracking-[0.18em] ${content.accentText}`}>
                  {isDe ? 'Interaktiver System-Check' : 'Etkileşimli sistem kontrolü'}
                </span>
                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  {isDe ? 'Was sehen Sie auf Ihrem TV?' : 'TV’nizde hangisini görüyorsunuz?'}
                </h2>
                <p className="mt-4 leading-7 text-slate-400">
                  {isDe
                    ? 'Wählen Sie die Beschreibung, die zu Ihrem Startbildschirm passt. Der empfohlene Weg wird sofort angepasst.'
                    : 'Ana ekranınıza uyan seçeneği işaretleyin. Önerilen kurulum yolu anında değişsin.'}
                </p>
              </div>

              <div
                role="tablist"
                aria-label={isDe ? 'Betriebssystem auswählen' : 'TV işletim sistemi seçimi'}
                className={`mx-auto mt-10 grid max-w-5xl gap-3 ${content.systems.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
              >
                {content.systems.map((system) => {
                  const selected = system.id === selectedSystem?.id;
                  return (
                    <button
                      key={system.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="selected-tv-system"
                      onClick={() => setSelectedSystemId(system.id)}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        selected
                          ? `border-white/30 ${content.accentBg} shadow-lg shadow-black/30`
                          : 'border-white/[0.08] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-white">{system.label}</div>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{system.clue}</p>
                        </div>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selected ? `border-transparent bg-gradient-to-br ${content.accent}` : 'border-white/20'}`}>
                          {selected && <Check className="h-4 w-4 text-white" />}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSystem?.id}
                  id="selected-tv-system"
                  role="tabpanel"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto mt-5 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#101010]"
                >
                  <div className={`h-1 bg-gradient-to-r ${content.accent}`} />
                  <div className="grid gap-6 p-6 md:grid-cols-[230px_1fr] md:p-8">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {isDe ? 'Empfehlung' : 'Sonuç'}
                      </div>
                      <div className={`mt-2 text-lg font-extrabold ${content.accentText}`}>
                        {selectedSystem?.verdict}
                      </div>
                    </div>
                    <div>
                      <p className="leading-7 text-slate-300">{selectedSystem?.method}</p>
                      {selectedApp && (
                        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                                {isDe ? 'Ihre App' : 'Kuracağınız uygulama'}
                              </div>
                              <div className="mt-1 text-xl font-black text-white">{selectedApp.primary}</div>
                            </div>
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                              {isDe ? 'Empfohlen' : 'Önerilen'}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            <strong className="text-white">{isDe ? 'Im Store suchen:' : 'Mağazada arayın:'}</strong>{' '}
                            “{selectedApp.search}”
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{selectedApp.note}</p>
                          <p className="mt-3 text-xs text-slate-500">
                            {isDe ? 'Alternative:' : 'Alternatif:'} {selectedApp.alternative}
                          </p>
                        </div>
                      )}
                      <div className="mt-5 flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                          <MonitorCheck className="h-4 w-4 text-emerald-400" />
                          {isDe ? 'Modell prüfen' : 'Modeli doğrula'}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                          <Globe2 className="h-4 w-4 text-sky-400" />
                          {isDe ? 'Store-Region prüfen' : 'Mağaza bölgesini kontrol et'}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-300">
                          <ShieldCheck className="h-4 w-4 text-amber-400" />
                          {isDe ? 'Nur rechtmäßige Inhalte' : 'Yalnızca yasal içerik'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          <section className="border-y border-white/[0.07] bg-[#0c0c0c] px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <span className={`text-sm font-extrabold uppercase tracking-[0.18em] ${content.accentText}`}>
                    {isDe ? 'Schritt für Schritt' : 'Adım adım'}
                  </span>
                  <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                    {isDe ? `${content.brand} TV IPTV einrichten` : `${content.brand} TV IPTV kurulumu`}
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Gauge className="h-4 w-4" />
                  {isDe ? 'Dauer: meist 5–10 Minuten' : 'Süre: genellikle 5–10 dakika'}
                </div>
              </div>

              <ol className="mt-12 space-y-4">
                {content.howToSteps.map((step, index) => (
                  <motion.li
                    key={step.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:grid-cols-[52px_1fr] sm:p-6"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${content.accent} text-lg font-black text-white`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{step.name}</h3>
                      <p className="mt-2 leading-7 text-slate-400">{step.text}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <p className="text-sm leading-6 text-amber-100/80">
                    {isDe
                      ? 'Hinweis: Eine Player-App stellt normalerweise keine Sender bereit. Verwenden Sie ausschließlich Inhalte, für die Sie die erforderlichen Nutzungsrechte besitzen. Geben Sie Zugangsdaten nur in vertrauenswürdige, offizielle Apps ein.'
                      : 'Önemli: Oynatıcı uygulama genellikle kanal sağlamaz. Yalnızca kullanım hakkına sahip olduğunuz yayınları kullanın; abonelik bilgilerinizi güvenilir ve resmî mağazadan yüklenmiş uygulamalara girin.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${content.accentBg}`}>
                    <Wrench className={`h-5 w-5 ${content.accentText}`} />
                  </div>
                  <h2 className="mt-5 text-3xl font-black text-white">
                    {isDe ? 'Schnelle Fehlerdiagnose' : 'Hızlı sorun teşhisi'}
                  </h2>
                  <p className="mt-4 leading-7 text-slate-400">
                    {isDe
                      ? 'Beginnen Sie mit der Karte, die zu Ihrem Symptom passt. Ändern Sie nicht mehrere Einstellungen gleichzeitig.'
                      : 'Belirtinize uyan karttan başlayın. Aynı anda birden fazla ayarı değiştirmeyin; hangi adımın işe yaradığını net görün.'}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {content.troubleshooting.map((item, index) => (
                    <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${content.accentBg} text-sm font-black ${content.accentText}`}>
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-sm leading-6 text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/[0.07] bg-white/[0.02] px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center">
                <HelpCircle className={`mx-auto h-9 w-9 ${content.accentText}`} />
                <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
                  {isDe ? 'Häufige Fragen' : 'Sık sorulan sorular'}
                </h2>
              </div>

              <div className="mt-10 space-y-3">
                {content.faqs.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-white/[0.08] bg-[#0d0d0d] open:border-white/20"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 font-bold text-white marker:content-none">
                      <span>{item.q}</span>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${content.accentBg} transition-transform group-open:rotate-45`}>
                        <span className={`text-xl leading-none ${content.accentText}`}>+</span>
                      </span>
                    </summary>
                    <div className="border-t border-white/[0.07] px-5 py-5 leading-7 text-slate-400">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-2xl font-black text-white md:text-3xl">
                    {isDe ? 'Andere Smart-TV-Marken' : 'Diğer Smart TV marka rehberleri'}
                  </h2>
                  <p className="mt-2 text-slate-400">
                    {isDe ? 'Wählen Sie die Marke Ihres zweiten Geräts.' : 'Başka bir TV için doğru işletim sistemi yolunu seçin.'}
                  </p>
                </div>
                <Link
                  to={`${setupPath}/smart-tv`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-primary"
                >
                  {isDe ? 'Alle Smart-TV-Optionen' : 'Tüm Smart TV seçenekleri'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {relatedGuides.map((related) => {
                  const relatedContent = localizeTvBrandGuide(related, lang);
                  return (
                    <Link
                      key={related.slug}
                      to={`${setupPath}/${related.slug}`}
                      className="group rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center justify-between">
                        <Tv className={`h-5 w-5 ${relatedContent.accentText}`} />
                        <ArrowRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                      </div>
                      <div className="mt-4 font-bold text-white">{relatedContent.brand}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {isDe ? 'IPTV-Anleitung' : 'IPTV kurulum rehberi'}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-4 pb-10">
            <div className="container mx-auto max-w-5xl rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <BadgeCheck className="h-4 w-4 text-emerald-400" />
                    {isDe ? 'Quellen und Aktualität' : 'Kaynak ve güncellik'}
                  </div>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
                    {isDe
                      ? 'Menüs und App-Angebot können sich durch Modell, Land und Softwareupdate ändern. Prüfen Sie im Zweifel die Herstellerdokumentation.'
                      : 'Menüler ve uygulama seçenekleri model, ülke ve yazılım güncellemesine göre değişebilir. Emin olmadığınız noktada üretici belgesini kontrol edin.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-white/20 hover:text-white"
                    >
                      {source.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-5xl">
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${content.accent} p-[1px]`}>
                <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0a0a0a] px-6 py-10 text-center md:px-12 md:py-14">
                  <div className={`absolute inset-0 bg-gradient-to-br ${content.accent} opacity-10`} />
                  <div className="relative z-10">
                    <Smartphone className={`mx-auto h-10 w-10 ${content.accentText}`} />
                    <h2 className="mt-5 text-3xl font-black text-white">
                      {isDe ? 'Erst auf Ihrem eigenen TV testen' : 'Önce kendi TV’nizde test edin'}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
                      {isDe
                        ? 'Prüfen Sie App-Kompatibilität, Bildqualität und Verbindung auf Ihrem eigenen Gerät, bevor Sie ein Paket auswählen.'
                        : 'Paket seçmeden önce uygulama uyumluluğunu, görüntü kalitesini ve bağlantınızı kendi cihazınızda doğrulayın.'}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <Link
                        to={testPath}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition-colors hover:bg-slate-200"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        {isDe ? 'Kostenlos testen' : 'Ücretsiz test iste'}
                      </Link>
                      <Link
                        to={packagesPath}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                      >
                        <Package className="h-5 w-5" />
                        {isDe ? 'Pakete ansehen' : 'Paketleri karşılaştır'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {isDe ? (
          <FooterDE contactData={siteData?.contactData} siteData={siteData} />
        ) : (
          <Footer
            contactData={siteData?.contactData}
            siteTexts={siteData?.siteTexts}
            siteData={siteData}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TvBrandGuidePage;
