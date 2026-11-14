import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import DeviceSelectionSection from '@/components/installation/DeviceSelectionSection';
import InstallationPageSeoSection from '@/components/installation/InstallationPageSeoSection';
import {
  Wifi,
  Tv,
  KeyRound,
  DownloadCloud,
  Zap,
  ShieldCheck,
  Headphones,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MonitorPlay,
  Smartphone,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { breadcrumbSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';
import { APP_GUIDES, APP_GUIDES_BASE } from '@/data/appInstallationGuides';

const InstallationPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const metadata = {
    title: "IPTV Kurulum Rehberi — Tüm TV ve Cihazlar | QruzeTV",
    description: "Samsung, LG, Philips, Vestel, Hisense, TCL, Android TV, Fire TV, iPhone ve bilgisayar için işletim sistemine uygun IPTV kurulum rehberleri.",
    keywords: ["IPTV kurulumu", "Samsung IPTV kurulum", "LG IPTV kurulum", "Philips IPTV kurulum", "Vestel IPTV kurulum", "Hisense IPTV kurulum", "TCL IPTV kurulum", "Fire TV IPTV", "Android TV IPTV", "IPTV kurulum rehberi"],
    ogType: "website"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "IPTV kurulumu nasıl yapılır?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cihazınıza uygun IPTV oynatıcı uygulamasını (Tivimate, IBO Player, IPTV Smarters, VLC vb.) indirin. M3U linki veya Xtream Codes bilgilerinizi uygulamaya girin. Kanallar otomatik yüklenecektir."
        }
      },
      {
        "@type": "Question",
        "name": "Hangi cihazlarda IPTV izlenebilir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IPTV; desteklenen Samsung, LG, Philips, Vestel, Hisense ve TCL Smart TV modellerinin yanı sıra Android TV, Fire TV Stick, iPhone, iPad, Android telefon, Windows PC, Mac ve tabletlerde kullanılabilir."
        }
      },
      {
        "@type": "Question",
        "name": "IPTV için internet hızı ne olmalı?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "HD yayın için minimum 16 Mbps, 4K yayın için 25 Mbps ve üzeri internet hızı önerilir. Ethernet bağlantısı Wi-Fi'den daha stabil sonuç verir."
        }
      },
      {
        "@type": "Question",
        "name": "M3U ve Xtream Codes nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "M3U, IPTV kanal listesini içeren bir link formatıdır. Xtream Codes ise sunucu adresi, kullanıcı adı ve şifre ile erişim sağlayan API formatıdır. Her ikisi de QruzeTV abonelerine sunulur."
        }
      }
    ]
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Kurulum', path: '/kurulum' },
  ]);

  const jsonLdData = [
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "IPTV Nasıl Kurulur?",
      "description": "Tüm cihazlar için adım adım IPTV kurulumu",
      "step": [
        { "@type": "HowToStep", "name": "Uygulama İndirme", "text": "Cihazınıza uygun IPTV oynatıcı uygulamasını indirin." },
        { "@type": "HowToStep", "name": "Abonelik Bilgilerini Girme", "text": "Kullanıcı adı, şifre ve URL bilgilerinizi uygulamaya girin." },
        { "@type": "HowToStep", "name": "İzlemeye Başlama", "text": "Kanalların yüklenmesini bekleyin ve izlemeye başlayın." }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "IPTV Kurulum Rehberi - Adım Adım Talimatlar ve Sorun Giderme",
      "author": { "@type": "Organization", "name": "QruzeTV" },
      "datePublished": "2026-01-01",
      "dateModified": "2026-07-31",
      "url": `${SITE_URL}/kurulum`,
      "image": `${SITE_URL}/default-og-image.jpg`,
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/kurulum` },
      "publisher": { "@type": "Organization", "name": "QruzeTV", "logo": { "@type": "ImageObject", "url": `${SITE_URL}/default-og-image.jpg` } }
    },
    faqSchema
  ];

  return (
    <ErrorBoundary>
      <SEOHead {...metadata} jsonLd={jsonLdData} />
      <div className="min-h-screen bg-[#070709] flex flex-col font-sans text-slate-200 selection:bg-primary/40">
        <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        
        <main className="flex-grow w-full pt-20">
          {/* Artisan Hero Section */}
          <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e50914]/15 via-[#180a0c]/30 to-transparent pointer-events-none -z-10" />

            <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/30 text-[#ff4d58] mb-5 shadow-[0_0_25px_rgba(229,9,20,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  ADIM ADIM CİHAZ KURULUMU & UYGULAMA REHBERİ
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight text-white drop-shadow-sm leading-tight">
                  IPTV Kurulum <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ff4b55]">Rehberi</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed text-slate-300">
                  Smart TV, TV Box, telefon ve bilgisayarınız için adım adım resimli kurulum kılavuzları ile yayınınızı dakikalar içinde başlatın.
                </p>
              </motion.div>

              {/* Bespoke Obsidian Reassurance Pills */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-[#121217]/85 border border-white/10 hover:border-primary/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-md">
                  <Zap className="w-4 h-4 text-[#ff4b55]" />
                  <span className="text-white text-xs sm:text-sm font-medium">5 Dakikada Hızlı Kurulum</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">Tüm Akıllı Cihazlar & TV'ler</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-blue-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 shadow-md">
                  <Headphones className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">7/24 Birebir Canlı Destek</span>
                </div>
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16 max-w-7xl relative z-10">
            <div className="mb-8">
              <BreadcrumbNavigation />
            </div>

            {/* Prerequisites Section (Ön Gereksinimler) */}
            <motion.div
              className="mb-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {[
                {
                  icon: Wifi,
                  title: 'İnternet Bağlantısı',
                  desc: 'Min. 16 Mbps fiber / VDSL (4K için 25+ Mbps ethernet önerilir)',
                  badge: 'Min 16 Mbps',
                  badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                },
                {
                  icon: Tv,
                  title: 'Hedef Cihaz',
                  desc: 'Samsung, LG, Philips TV, Android Box, iOS, Windows veya Mac',
                  badge: 'Geniş Uyum',
                  badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
                },
                {
                  icon: KeyRound,
                  title: 'Erişim Bilgileri',
                  desc: 'WhatsApp & SMS ile iletilen M3U Playlist linki veya Xtream Codes API',
                  badge: 'Anında Teslimat',
                  badgeColor: 'text-[#ff4b55] border-primary/30 bg-primary/10',
                },
                {
                  icon: DownloadCloud,
                  title: 'IPTV Oynatıcı',
                  desc: 'Cihaz mağazasından indirilen Tivimate, IBO Player, Smarters veya NEXT+',
                  badge: 'Resmî Mağaza',
                  badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[#121217]/80 border border-white/10 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white">
                          <Icon className="w-5 h-5 text-slate-200" />
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
            
            {/* Device showroom */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl overflow-hidden bg-[#101015]/60 border border-white/10 shadow-2xl p-2 sm:p-4 mb-16"
            >
              <DeviceSelectionSection selectedDevice="" onSelect={() => {}} asLinks />
            </motion.div>

            <section aria-labelledby="app-guides-heading" className="mb-16 rounded-3xl border border-white/10 bg-[#111116]/80 p-5 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div><span className="text-xs font-bold uppercase tracking-widest text-red-400">UYGULAMAYA GÖRE</span><h2 id="app-guides-heading" className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Hangi uygulamayı kullanıyorsunuz?</h2><p className="mt-2 text-sm leading-6 text-slate-400">Uygulamanızı seçin; yükleme ve liste ekleme adımlarını takip edin.</p></div>
                <Link to={`${APP_GUIDES_BASE}/`} className="inline-flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300">Tüm uygulamalar <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{APP_GUIDES.slice(0, 6).map((guide) => <Link key={guide.slug} to={`${APP_GUIDES_BASE}/${guide.slug}/`} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#09090d] p-4 transition hover:border-white/25 hover:bg-white/[0.04]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#16161b] p-1.5">{guide.logo ? <img src={guide.logo} alt="" className="h-full w-full object-contain" /> : <span className="font-black" style={{ color: guide.accent }}>{guide.shortName.slice(0, 2).toUpperCase()}</span>}</div>
                <span className="min-w-0 flex-1"><span className="block font-bold text-white">{guide.name}</span><span className="mt-1 block truncate text-xs text-slate-400">{guide.devices.slice(0, 2).join(' · ')}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-white" />
              </Link>)}</div>
            </section>

            {/* How it works - 3-step Artisan Vitrin */}
            <motion.section
              className="mt-16 md:mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest text-[#ff4b55] font-semibold mb-2 block">
                  3 KOLAY ADIMDA YAYIN
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
                  Kurulum Nasıl Yapılır?
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                  Cihazınız ne olursa olsun kurulum süreci standart ve pratiktir. Teknik bilgi gerekmeden yayınınızı başlatın.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
                {[
                  {
                    step: '01',
                    label: 'Uygulama',
                    title: 'Uygulamayı İndirin',
                    desc: 'Cihazınızın resmî mağazasından (Google Play, Samsung Apps, LG Content Store, App Store vb.) önerdiğimiz oynatıcıyı ücretsiz indirin.',
                    tag: 'Tivimate • IBO • NEXT+',
                  },
                  {
                    step: '02',
                    label: 'Doğrulama',
                    title: 'Abonelik Bilgilerini Girin',
                    desc: 'Siparişiniz sonrası anında iletilen M3U playlist linkini veya Xtream Codes (sunucu adresi, kullanıcı adı, şifre) alanlarını doldurun.',
                    tag: 'M3U Link & Xtream API',
                  },
                  {
                    step: '03',
                    label: 'Canlı Yayın',
                    title: '4K Yayını Başlatın',
                    desc: 'Kanal listeniz ve VOD arşiviniz birkaç saniye içinde yüklenir. EPG akış rehberi ve yüksek bitrate konforuyla izlemeye başlayın.',
                    tag: '10.000+ Kanal & 15.000+ VOD',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#141419]/90 to-[#08080c]/95 border border-white/10 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-500" />
                    
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[#ff4b55]">
                          {item.label}
                        </span>
                        <span className="font-mono text-3xl sm:text-4xl font-black text-white/15 group-hover:text-primary/40 transition-colors">
                          {item.step}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#ff4b55] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium">{item.tag}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Protocol Explanation & CTA Lounge */}
            <motion.article 
              className="mt-16 md:mt-24 bg-[#101015]/75 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-3xl">
                <span className="text-xs uppercase tracking-widest text-[#ff4b55] font-semibold mb-2 block">
                  TEKNOLOJİ & BAĞLANTI PROTOKOLLERİ
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 text-white leading-tight">
                  IPTV Nedir ve Nasıl Çalışır?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-8">
                  IPTV, televizyon yayınlarını çanak anten veya karmaşık kablolar yerine internet protokolü üzerinden cihazınıza aktarır. Size iletilen M3U linki veya Xtream API bilgileriyle oynatıcı uygulamanız yüksek hızlı fiber sunucularımıza doğrudan bağlanır ve gecikmesiz akış sağlar.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 my-8">
                <div className="p-6 rounded-2xl bg-[#141419]/90 border border-white/10 hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <h3 className="font-bold text-white text-base">M3U Playlist Linki</h3>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Tek bir web linki ile tüm canlı kanal, kategori ve VOD arşivini oynatıcınıza aktarır. Hızlı ve kolay başlangıç için idealdir.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#141419]/90 border border-white/10 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h3 className="font-bold text-white text-base">Xtream Codes API</h3>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Sunucu adresi, kullanıcı adı ve şifre ile giriş yapılır. EPG elektronik yayın akışı, kategori filtreleme ve kanal logolarını otomatik senkronize eder.
                  </p>
                </div>
              </div>

              {/* Artisan CTA Banner */}
              <div className="mt-12 p-8 sm:p-10 bg-gradient-to-b from-[#180f12]/95 to-[#0b0809]/98 rounded-2xl border border-primary/30 shadow-2xl text-center flex flex-col items-center">
                <span className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mb-4">
                  <Flame className="w-5 h-5 text-[#ff4b55]" />
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">
                  Kuruluma Başlamaya Hazır Mısınız?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mb-8 leading-relaxed font-light">
                  Aboneliğiniz yoksa size uygun IPTV paketini seçebilir veya satın alma öncesinde 4K yayın kalitemizi ücretsiz test edebilirsiniz.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3.5 w-full justify-center max-w-lg">
                  <Link 
                    to="/paketler/" 
                    className="px-6 py-3.5 bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] text-white font-bold rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                  >
                    Paketleri İncele <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    to="/test/" 
                    className="px-6 py-3.5 bg-[#141419] hover:bg-[#1c1c24] text-white font-semibold rounded-xl text-sm transition-all duration-300 border border-white/15 flex items-center justify-center"
                  >
                    Ücretsiz Test Talep Et
                  </Link>
                  <Link 
                    to="/sss/" 
                    className="px-6 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all duration-300 border border-white/10 flex items-center justify-center"
                  >
                    Sık Sorulan Sorular
                  </Link>
                </div>
              </div>
            </motion.article>

            <InstallationPageSeoSection />

            {/* Device Specific Troubleshooting Cards */}
            <motion.section
              className="mt-16 md:mt-24 bg-[#101015]/75 border border-white/10 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-3xl mb-10">
                <span className="text-xs uppercase tracking-widest text-[#ff4b55] font-semibold mb-2 block">
                  PRATİK İPUÇLARI
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 text-white leading-tight">
                  Cihazlara Göre Hızlı Sorun Giderme
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base font-light leading-relaxed">
                  Kurulumu tamamladığınız hâlde takıldığınız bir durum olursa, destek kayıtlarımızda en sık karşılaşılan cihaz bazlı çözümler:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                <div className="p-6 rounded-2xl bg-[#141419]/80 border border-white/10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <MonitorPlay className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-white">Samsung & LG Smart TV</h3>
                  </div>
                  <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    <p><strong className="text-white">Uygulama mağazada yoksa:</strong> TV bölgesini ve yazılım sürümünü kontrol edin; modelinize uygun resmi uygulamayı <Link to="/kurulum/smart-tv/" className="text-[#ff4b55] hover:underline font-medium">Smart TV rehberimizden</Link> seçin.</p>
                    <p><strong className="text-white">Kanal geçişleri yavaşsa:</strong> Wi-Fi yerine kablolu ethernet bağlantısı kullanmak bellek yönetimini ve geçiş hızını belirgin derecede iyileştirir.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#141419]/80 border border-white/10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Tv className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Android TV & Fire TV Stick</h3>
                  </div>
                  <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    <p><strong className="text-white">EPG rehberi boşsa:</strong> Tivimate veya XCIPTV ayarlarından EPG kaynağını güncelleyin ve cihaz saat dilimini otomatik konuma getirin.</p>
                    <p><strong className="text-white">Depolama uyarısı:</strong> Fire TV Stick ayarlarından kullanmadığınız uygulamaları kaldırıp önbelleği temizleyin.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#141419]/80 border border-white/10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">iOS (iPhone & iPad)</h3>
                  </div>
                  <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    <p><strong className="text-white">Ekran kilitlenince yayın duruyorsa:</strong> Düşük güç modunu kapatın ve oynatıcı ayarlarından "arka planda oynat" iznini aktif hâle getirin.</p>
                    <p><strong className="text-white">AirPlay gecikmesi:</strong> Telefondan TV'ye yansıtmak yerine TV'ye doğrudan player kurmak çok daha akıcı 4K deneyimi sunar.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#141419]/80 border border-white/10">
                  <div className="flex items-center gap-2.5 mb-4">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">7/24 Birebir Teknik Destek</h3>
                  </div>
                  <div className="space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                    <p><strong className="text-white">Çözüm bulamadınız mı?</strong> WhatsApp destek hattımızdan uzman teknik ekibimize cihaz modelinizi ileterek anında canlı yönlendirme alabilirsiniz.</p>
                    <p>Daha fazla detay için <Link to="/sss/" className="text-[#ff4b55] hover:underline font-medium">Sıkça Sorulan Sorular</Link> bölümümüzü inceleyebilirsiniz.</p>
                  </div>
                </div>
              </div>
            </motion.section>

          </div>
        </main>
        <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
      </div>
    </ErrorBoundary>
  );
};

export default InstallationPage;
