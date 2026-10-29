import React, { memo, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Packages from '@/components/Packages';
import SEOHead from '@/components/SEOHead';
import { packagesPageSchemas, breadcrumbSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';
import { resolvePackagesPageContent } from '@/utils/packagePageContent';
import PackagesPageSeoSections from '@/components/packages/PackagesPageSeoSections';
import { defaultData } from '@/data/defaultSiteData';
import ErrorBoundary from '@/components/ErrorBoundary';
import ChatBot from '@/components/ChatBot';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Headphones,
  Tv,
  Award,
  Check,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const PACKAGES_FAQ_ITEMS = [
  {
    q: 'Hangi IPTV paketini seçmeliyim?',
    a: 'İzleme alışkanlığınız ve kullanım bölgeniz belirler. Hizmeti ilk kez deniyorsanız 3 aylık paketle başlayabilir; yayın kalitesinden memnun kaldığınızda 6, 12 veya 15 aya geçerek aylık maliyeti belirgin şekilde düşürebilirsiniz. Türkiye içi veya Avrupa/dünya kullanımınıza göre ilgili bölge sekmesini seçebilirsiniz.',
  },
  {
    q: 'Paket fiyatları nasıl belirleniyor?',
    a: 'Fiyatlar abonelik süresine (3, 6, 12 veya 15 ay), yayın kalitesi tercihinize ve kullanım bölgenize göre belirlenir. Süre uzadıkça aylık maliyet düşer; 12 ve 15 aylık paketler bu yüzden en ekonomik seçeneklerdir. Tüm paketlerimize zengin kanal listesi, geniş VOD film/dizi arşivi ve 7/24 teknik destek dahildir.',
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: '3D Secure korumalı kredi/banka kartı, havale/EFT ve uluslararası müşterilerimiz için kripto para ile ödeme kabul ediyoruz. Kart bilgileriniz sistemimizde saklanmaz. Ödeme adımları paket seçiminden sonra güvenli ekranda gösterilir.',
  },
  {
    q: 'Aktivasyon ne kadar sürüyor?',
    a: 'Ödeme onayından sonra erişim bilgileriniz dakikalar içinde WhatsApp ve SMS üzerinden iletilir. Kurulum rehberimiz sayesinde cihazınızda hemen izlemeye başlayabilirsiniz.',
  },
  {
    q: 'Paketler hangi cihazlarla uyumlu?',
    a: 'Samsung ve LG Smart TV, Android TV, Fire TV Stick, iPhone/iPad, Android telefon/tablet ile Windows ve Mac bilgisayarların tümünde sorunsuz izleyebilirsiniz. Kurulum sayfamızda cihazınıza özel adım adım görsel anlatım mevcuttur.',
  },
  {
    q: 'Yayınlarda donma veya takılma olur mu?',
    a: 'Anycast CDN altyapısı ve yedekli fiber hatlarımız sayesinde yoğun saatlerde bile yayınlarda donma yaşanmaz. En iyi 4K deneyimi için stabil internet bağlantısı veya kablolu ethernet önerilir. Satın almadan önce ücretsiz test hesabıyla kalitemizi deneyebilirsiniz.',
  },
  {
    q: 'Memnun kalmazsam iade hakkım var mı?',
    a: 'Aktivasyondan sonraki ilk 24 saat içinde iade talebi iletebilirsiniz. Teknik destek ekibimiz çözülemeyen altyapı sorunlarında müşteri memnuniyeti kapsamında iade sürecini hızla tamamlar.',
  },
  {
    q: 'Aboneliğimi sonradan uzatabilir veya yükseltebilir miyim?',
    a: 'Evet. Süreniz dolmadan dilediğiniz zaman paketinizi uzatabilir, daha yüksek süreli veya VIP paketlere geçiş yapabilirsiniz. Mevcut kalan süreniz yeni paketinize kesintisiz eklenir.',
  },
];

const PACKAGES_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PACKAGES_FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: a,
    },
  })),
};

const DURATION_CARDS = [
  {
    duration: '3 Ay',
    tag: 'Sezonluk Esneklik',
    badgeClass: 'bg-white/10 text-slate-300 border-white/15',
    profile: 'İlk kez deneyenler, kısa dönemli izleyiciler ve sezonluk takipçiler.',
    highlight: 'Düşük başlangıç maliyeti, sıfır taahhüt riski ve tüm arşive tam erişim.',
    icon: Clock,
  },
  {
    duration: '6 Ay',
    tag: 'Dengeli Tercih',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    profile: 'Düzenli izleyen haneler ve yarıyıl boyunca yenileme düşünmek istemeyenler.',
    highlight: 'Fiyat dalgalanmalarından etkilenmeden yarım yıl boyunca kesintisiz konfor.',
    icon: ShieldCheck,
  },
  {
    duration: '12 Ay',
    tag: 'En Popüler ⭐',
    badgeClass: 'bg-primary/20 text-[#ff4d58] border-primary/40 font-bold',
    profile: 'Günlük TV, sinema ve spor tüketen aileler ile uzun vadeli kullanıcılar.',
    highlight: 'Aylık birim maliyeti en çok düşüren, en yüksek tasarruflu ana paket.',
    icon: Sparkles,
    isPopular: true,
  },
  {
    duration: '15 Ay VIP',
    tag: 'VIP Maksimum Avantaj 👑',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold',
    profile: 'Maksimum tasarruf ve kesintisiz VIP ayrıcalığı talep eden seçkin izleyiciler.',
    highlight: '+3 ay ekstra avantaj, en düşük birim fiyat ve öncelikli VIP altyapı.',
    icon: Award,
  },
];

const PackagesPage = ({ siteData }) => {
  const safeSiteData = siteData || defaultData;
  const pageContent = resolvePackagesPageContent(safeSiteData);
  const h1Title = pageContent.page?.title || 'IPTV Paketleri ve Fiyatları';

  const metadata = useMemo(() => ({
    title: 'IPTV Paketleri ve Fiyatları — 4K Abonelik | QruzeTV',
    description:
      'IPTV paketlerini süre, kullanıcı sayısı, bölge ve fiyat açısından karşılaştırın. 4K/UHD seçeneklerini kendi cihazınızda ücretsiz test edin.',
    keywords: ['IPTV paketleri', 'IPTV fiyatları', '4K abonelik', 'QruzeTV', 'premium paketler'],
    ogType: 'website',
    ogImage: `${SITE_URL}/og/paketler.jpg`,
  }), []);

  const jsonLd = useMemo(
    () => [
      ...packagesPageSchemas(metadata),
      breadcrumbSchema([
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Paketler', path: '/paketler' },
      ]),
      PACKAGES_FAQ_SCHEMA,
    ],
    [metadata],
  );

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/paketler`} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#070709] flex flex-col font-sans text-white selection:bg-primary/40">
        <Header contactData={safeSiteData.contactData} />

        <main className="flex-grow pt-24 pb-16">
          {/* Artisan Hero Section */}
          <section className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e50914]/15 via-[#180a0c]/30 to-transparent pointer-events-none -z-10" />

            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 border border-primary/30 text-[#ff4d58] mb-5 shadow-[0_0_25px_rgba(229,9,20,0.25)]">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                PREMİUM PAKET SALONU & BÖLGE SEÇİMİ
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 mt-2 tracking-tight text-white drop-shadow-sm leading-tight">
                IPTV Paketleri ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#ff4b55]">Fiyatları</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
                {pageContent.page?.shortDescription ||
                  'Güncel IPTV paketlerini süre, yayın niteliği ve bölgeye göre inceleyin. Satın almadan önce 4K Ultra HD yayın seçeneklerini kendi cihazınızda ücretsiz test edin.'}
              </p>

              {/* Bespoke Obsidian Trust Badges */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
                <div className="bg-[#121217]/85 border border-white/10 hover:border-primary/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-md">
                  <Zap className="w-4 h-4 text-[#ff4b55]" />
                  <span className="text-white text-xs sm:text-sm font-medium">Anında Aktivasyon</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">Anycast CDN & Donmasız Altyapı</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-blue-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-md">
                  <Tv className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">Tüm Cihazlarla Uyumlu</span>
                </div>
                <div className="bg-[#121217]/85 border border-white/10 hover:border-amber-500/40 backdrop-blur-md flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-md">
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span className="text-white text-xs sm:text-sm font-medium">7/24 Birebir Destek</span>
                </div>
              </div>
            </div>
          </section>

          {/* Core Packages Showcase (TR & EU) */}
          <section id="packages-list" className="relative z-10 py-6 md:py-8">
            <ErrorBoundary>
              <Packages
                packages={safeSiteData.packagesData}
                showTierFilter
                hideSectionHeader
                packagesPageContent={safeSiteData.packagesPageContent}
              />
            </ErrorBoundary>
          </section>

          {/* Artisan 3-Pillar Reassurance Strip */}
          <section className="py-8 border-y border-white/5 bg-[#0a0a0f]/60">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-white/5 hover:border-primary/30 transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-[#ff4b55]" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">Anında Otomatik Teslimat</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Sipariş onayınızın ardından M3U listesi, kullanıcı adı ve şifreniz anında WhatsApp & SMS ile iletilir.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">Anycast CDN & Sıfır Donma</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Yoğun derbi ve prime-time saatlerinde bile yük dengelemeli fiber hatlarla cam netliğinde 4K yayın.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#121217]/80 border border-white/5 hover:border-blue-500/30 transition-all duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Headphones className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">Birebir Uzman Türkçe Destek</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Smart TV, TV Box veya telefonunuza özel adım adım kurulum ve kanal sıralama rehberliği.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEO Content Sections (What is IPTV, Region Differences, Usage Tips) */}
          <PackagesPageSeoSections siteData={safeSiteData} contactData={safeSiteData.contactData} lang="tr" />

          {/* Hangi Paket Kime Uygun? — Bespoke Obsidian Duration Guide */}
          <section className="py-16 border-t border-white/5 relative">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest text-[#ff4b55] font-semibold mb-2 block">
                  DOĞRU TERCİH REHBERİ
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Hangi Paket Kime Uygun?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Paket seçimi temelde iki soruya dayanır: ne kadar süre izleyeceksiniz ve kullanım bölgeniz neresi?
                  Süre seçeneklerimiz 3, 6, 12 ve 15 aydır. Tüm paketlerimizde zengin kanal listesi, geniş film-dizi arşivi ve 7/24 destek eksiksiz yer alır.
                </p>
              </div>

              {/* 4 Bespoke Duration Glass Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                {DURATION_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.duration}
                      className={`relative p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                        card.isPopular
                          ? 'bg-gradient-to-b from-[#1c1214]/90 to-[#0e090b]/95 border border-[#e50914]/50 shadow-[0_0_35px_rgba(229,9,20,0.15)] ring-1 ring-[#e50914]/30'
                          : 'bg-[#121217]/70 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-2xl font-black text-white">{card.duration}</span>
                          <span className={`text-[11px] px-2.5 py-1 rounded-full border ${card.badgeClass}`}>
                            {card.tag}
                          </span>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                          <Icon className={`w-5 h-5 ${card.isPopular ? 'text-[#ff4b55]' : 'text-slate-300'}`} />
                        </div>

                        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Kimin İçin Uygun?</h4>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-4">
                          {card.profile}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Öne Çıkan Avantaj</h4>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {card.highlight}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modern Glass Matrix Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101015]/70 backdrop-blur-md shadow-xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-slate-200">
                      <th className="px-5 py-4 font-bold">Süre</th>
                      <th className="px-5 py-4 font-bold">Hedef Kullanıcı Profili</th>
                      <th className="px-5 py-4 font-bold">Öne Çıkan Değer & Tasarruf</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 divide-y divide-white/5">
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-bold text-white whitespace-nowrap">3 Ay</td>
                      <td className="px-5 py-4">İlk kez deneyenler, lig ve dizi sezonu takipçileri</td>
                      <td className="px-5 py-4">Fiyat-süre dengesi, taahhütsüz esnek başlangıç</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-bold text-white whitespace-nowrap">6 Ay</td>
                      <td className="px-5 py-4">Düzenli izleyen haneler, yarıyıl konforu arayanlar</td>
                      <td className="px-5 py-4">Yenileme derdi olmadan yarım yıl sabit fiyat güvencesi</td>
                    </tr>
                    <tr className="bg-primary/5 hover:bg-primary/10 transition-colors">
                      <td className="px-5 py-4 font-extrabold text-[#ff4b55] whitespace-nowrap flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> 12 Ay (Popüler)
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-200">Günlük izleyiciler, aileler ve gurbetçi kullanıcılar</td>
                      <td className="px-5 py-4 font-medium text-slate-200">En çok tercih edilen, en düşük aylık birim maliyet</td>
                    </tr>
                    <tr className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                      <td className="px-5 py-4 font-extrabold text-amber-300 whitespace-nowrap flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> 15 Ay VIP
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-200">Maksimum tasarruf ve kesintisiz VIP deneyim isteyenler</td>
                      <td className="px-5 py-4 font-medium text-slate-200">+3 ay ekstra avantaj, en düşük aylık ortalama maliyet</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-slate-400 text-xs sm:text-sm leading-relaxed text-center max-w-3xl mx-auto">
                Türkiye paketlerimiz Türkiye IP ve yurt içi kullanıma, Avrupa paketlerimiz ise tüm Avrupa ve dünya geneline özel sunucularla hizmet verir. Satın alma öncesinde dilediğiniz zaman ücretsiz test talebinde bulunabilirsiniz.
              </p>
            </div>
          </section>

          {/* Interactive Luxury FAQ Accordion */}
          <section className="py-16 border-t border-white/5 bg-[#0a0a0f]/40">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10">
                <span className="text-xs uppercase tracking-widest text-[#ff4b55] font-semibold mb-2 block">
                  MERAK EDİLENLER
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">
                  Paketler Hakkında Sık Sorulan Sorular
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
                  IPTV abonelik süreleri, kurulum desteği ve ödeme güvenliği hakkında en çok yöneltilen soruların yanıtları.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-3">
                {PACKAGES_FAQ_ITEMS.map(({ q, a }, index) => (
                  <AccordionItem
                    key={q}
                    value={`packages-faq-${index}`}
                    className="border border-white/10 bg-[#121217]/75 backdrop-blur-md px-5 sm:px-6 rounded-2xl data-[state=open]:border-primary/40 data-[state=open]:bg-[#16161d] transition-all duration-300 shadow-sm"
                  >
                    <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-white hover:text-[#ff4b55] hover:no-underline py-4 sm:py-5">
                      <span className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary/80 shrink-0" />
                        {q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 text-xs sm:text-sm leading-relaxed pb-5 pl-5 border-t border-white/5 pt-3">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
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
