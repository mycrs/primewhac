import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import InternalLinkingHelper from '@/components/InternalLinkingHelper';
import { useTestModal } from '@/contexts/TestModalContext';
import { SITE_URL } from '@/constants/siteUrl';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Smartphone,
  Laptop,
  Server,
  HelpCircle,
  ArrowRight,
  Clock,
  Headphones,
  Layers,
  Activity,
  Flame,
  ChevronDown,
  MonitorPlay,
  AlertCircle,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TimsahIptvPage = ({ siteData }) => {
  const { openTestModal } = useTestModal();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};

  const metadata = {
    title: "Timsah Panel IPTV Satın Al | Orijinal Sunucu & Kurulum Rehberi — QruzeTV",
    description: "Timsah Panel IPTV satın al! Orijinal Timsah IPTV panel nedir, nasıl alınır, nereden bulunur? Kesintisiz 4K yayınlar, anında teslimat ve ücretsiz test avantajı.",
    keywords: [
      "timsah panel iptv",
      "timsah iptv satın al",
      "timsah panel iptv satın al",
      "timsah iptv panel",
      "timsah iptv nedir",
      "timsah iptv nasıl alınır",
      "timsah iptv nereden bulunur",
      "orijinal timsah iptv",
      "timsah iptv test",
      "donmayan timsah panel",
      "qruzetv timsah panel"
    ],
    h1: "Timsah Panel IPTV Satın Al",
    ogType: "website",
    ogImage: `${SITE_URL}/og/timsah-iptv.jpg`,
    ogImageAlt: "Timsah Panel IPTV Satın Al | Orijinal Sunucu ve Kurulum Rehberi — QruzeTV"
  };

  const faqItems = [
    {
      question: "Timsah Panel IPTV nedir ve neden tercih edilir?",
      answer: "Timsah Panel IPTV; yüksek bant genişliğine sahip Avrupa CDN sunucuları ve Anti-Freeze 10.0 akıllı önbellekleme teknolojisi ile çalışan yeni nesil bir IPTV yayın altyapısıdır. Özellikle canlı spor karşılaşmaları, yüksek çözünürlüklü 4K belgeseller ve binlerce güncel film/dizi içeriğini sıfır takılma ve 60 FPS kare hızıyla sunması sayesinde en çok tercih edilen panel sistemlerinden biridir."
    },
    {
      question: "Timsah Panel IPTV nasıl satın alınır?",
      answer: "Timsah Panel IPTV satın almak yalnızca 3 adımdan oluşur: 1) Sitemizdeki Paketler sayfasından kullanım sürenize (1, 3, 6 veya 12 Ay) uygun paketi seçin. 2) Güvenli ödeme veya WhatsApp canlı destek hattımız üzerinden siparişinizi tamamlayın. 3) Ödemeniz onaylandığı anda M3U Plus bağlantı linkiniz ve Xtream Codes API bilgileriniz (Sunucu, Kullanıcı Adı, Şifre) 5 dakika içerisinde WhatsApp veya e-posta yoluyla iletilir."
    },
    {
      question: "Orijinal Timsah IPTV Panel nereden bulunur ve sahte satıcılardan nasıl ayırt edilir?",
      answer: "İnternette 'Timsah Panel' adını kullanarak sahte veya aşırı yüklenmiş klon paneller satan yetkisiz aracılar bulunmaktadır. Orijinal Timsah Panel lisansı yalnızca QruzeTV gibi kurumsal, 7/24 teknik destek sağlayan, SSL korumalı ve müşteri memnuniyeti garantisi sunan güvenilir platformlardan temin edilmelidir. Orijinal lisanslarda kanal geçişleri 1 saniyenin altındadır ve derbi saatlerinde yayın kesintisi yaşanmaz."
    },
    {
      question: "Satın alma işleminden sonra yayınım ne zaman açılır?",
      answer: "Siparişiniz onaylandığı anda sistemimiz otomatik aktivasyon sürecini başlatır. Ortalama 5 ila 10 dakika içerisinde tüm kurulum parametreleriniz hazırlanarak tarafınıza teslim edilir. Dilerseniz uzman teknik ekibimiz cihazınıza uzaktan kurulum desteği de sağlar."
    },
    {
      question: "Satın almadan önce ücretsiz deneme (test) yayını alabilir miyim?",
      answer: "Evet! QruzeTV güvencesiyle sunulan Timsah Panel kalitesini satın almadan önce kendi televizyonunuzda veya telefonunuzda bizzat deneyimleyebilirsiniz. Sitemizdeki 'Ücretsiz Test' butonuna tıklayarak anında deneme yayını talep edebilirsiniz."
    },
    {
      question: "Timsah Panel hangi cihazlarda ve hangi uygulamalarla çalışır?",
      answer: "Timsah Panel IPTV; Samsung ve LG Smart TV (IBO Player, Smart IPTV), Android TV ve TV Box (TiviMate, IPTV Smarters Pro, XCIPTV), Amazon Fire TV Stick, Apple TV, iPhone/iPad (NEXT+, CASTORA, IPTVX), Windows PC ve Mac bilgisayarlar dahil tüm modern akıllı cihazlarla %100 uyumludur."
    },
    {
      question: "Timsah Panel maç saatlerinde donma veya takılma yapar mı?",
      answer: "Hayır. Timsah Panel sunucuları dinamik yük dengeleme (load balancer) teknolojisine sahiptir. Milyonlarca izleyicinin aynı anda bağlandığı derbi ve büyük kupa maçlarında trafik otomatik olarak yedek sunuculara dağıtılır. En az 16 Mbit/s stabil internet bağlantısı ile donmasız ve takılmasız Full HD / 4K izleme garanti edilir."
    }
  ];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": `${SITE_URL}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Timsah Panel IPTV Satın Al",
        "item": `${SITE_URL}/timsah-iptv/`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Timsah Panel IPTV Lisans ve Yayın Paketi",
    "image": `${SITE_URL}/og/timsah-iptv.jpg`,
    "description": metadata.description,
    "brand": {
      "@type": "Brand",
      "name": "QruzeTV"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "15",
      "highPrice": "60",
      "offerCount": "4",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "389"
    }
  };

  const jsonLd = [breadcrumb, faqSchema, productSchema];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white selection:bg-red-600/30">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />

        <main className="flex-grow pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <BreadcrumbNavigation
              customCrumbs={[
                { name: 'Ana Sayfa', path: '/' },
                { name: 'Timsah Panel IPTV Satın Al', path: null }
              ]}
            />
          </div>

          {/* Hero Header Card */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#14141c] via-[#0d0d12] to-[#070709] p-8 sm:p-12 md:p-16 shadow-2xl mb-14 text-center md:text-left">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
                <Flame className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>Orijinal Timsah Panel Yetkili Dağıtım & Test</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                Timsah Panel IPTV Satın Al
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed mb-8 max-w-3xl">
                Yüksek hızlı Avrupa bulut sunucuları, <strong>Anti-Freeze 10.0</strong> donmayan yayın teknolojisi ve 
                10.000+ canlı kanal arşiviyle orijinal Timsah IPTV Panel deneyimine hemen kavuşun. 
                <strong>Timsah IPTV nasıl alınır</strong>, <strong>nereden bulunur</strong> ve kurulum nasıl yapılır tüm detaylar bu sayfada.
              </p>

              {/* Action CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 justify-start">
                <Link
                  to="/paketler/"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#e50914] via-[#f40612] to-[#b20710] text-white text-base font-bold shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] transition-all"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Timsah Panel Paketlerini İncele</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={openTestModal}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-base font-semibold backdrop-blur-md transition-all hover:scale-[1.02]"
                >
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Ücretsiz Test Yayını Al</span>
                </button>

                <Link
                  to="/iletisim/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all"
                >
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span>WhatsApp Canlı Destek</span>
                </Link>
              </div>

              {/* Quick Feature Pillars */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Anti-Freeze 10.0</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light">Yoğun maç saatlerinde kesintisiz yayın</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 Dakikada Teslimat</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light">M3U ve Xtream anında hazır</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>4K UHD & 60 FPS</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light">Ultra net spor ve sinema</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>7/24 Birebir Destek</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light">Canlı teknik rehberlik</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 1: Timsah Panel IPTV Nedir? */}
          <section className="mb-16">
            <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <Server className="w-3.5 h-3.5 text-primary" />
                  <span>Sunucu Mimarisi & Teknoloji</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                  Timsah Panel IPTV Nedir ve Sistemi Nasıl Çalışır?
                </h2>
                <p className="text-slate-300 leading-relaxed font-light text-base sm:text-lg">
                  Timsah Panel IPTV, IPTV yayın sektöründe istikrar ve yüksek aktarım hızlarıyla tanınan kurumsal bir medya sunucu altyapısıdır. 
                  Geleneksel yayın sunucularının aksine, tek noktaya bağımlı kalmaz; <strong>Avrupa, Almanya ve Türkiye</strong> omurgasındaki 
                  yük dengeleyiciler (Load Balancers) sayesinde kullanıcıyı en düşük ping değerine sahip sunucu havuzuna bağlar.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Hızlı Kanal Geçişi</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Özel kodlanmış stream tamponlama protokolleri sayesinde kanallar arasında geçiş yaparken bekleme süresi 0.5 saniyenin altına iner.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Yüksek Bitrate & H.265</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    HEVC / H.265 video sıkıştırma standardı, internet kotanızı zorlamadan gerçek 4K ve 1080p 60 FPS görüntü netliği sunar.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Sürekli Güncel VOD Arşivi</h3>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">
                    Yalnızca canlı TV değil; en yeni vizyon filmleri, ödüllü yerli/yabancı diziler ve çocuk içerikleri düzenli olarak güncellenir.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Timsah IPTV Nereden Bulunur? */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-[#12121a] via-[#0a0a0f] to-black border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Güvenlik & Orijinallik Rehberi</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-6">
                  Timsah Panel IPTV Nereden Bulunur? Orijinal ve Güvenilir Kaynaklar
                </h2>
                
                <p className="text-slate-300 leading-relaxed font-light text-base sm:text-lg mb-8">
                  Sosyal medya, forumlar veya çeşitli mesajlaşma gruplarında &quot;Timsah Panel&quot; etiketiyle satılan birçok hesap görebilirsiniz. 
                  Ancak bu satıcıların büyük bölümü, tek bir yetersiz paneli yüzlerce kişiye bölen korsan aracılardır. 
                  Büyük derbi maçlarında yayın çöktüğünde paranız boşa gider ve karşınızda teknik muhatap bulamazsınız.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Warning Box */}
                  <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 text-red-400 font-bold mb-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <h4>Sahte ve Klon Satıcıların Belirtileri</h4>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      <li>• Çok ucuz veya &quot;ömür boyu üyelik&quot; gibi gerçek dışı vaatler sunarlar.</li>
                      <li>• Kurumsal web sitesi, SSL güvencesi veya şeffaf iletişim bilgisi yoktur.</li>
                      <li>• Maç başladıktan sonra yayın kesilir, gecikme dakikaları bulur.</li>
                      <li>• Satış sonrası teknik sorunlarda destek hattı kapanır.</li>
                    </ul>
                  </div>

                  {/* Trust Box */}
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold mb-3">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <h4>QruzeTV Güvencesiyle Orijinal Timsah Panel</h4>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      <li>• Doğrudan Avrupa merkezli yüksek hızlı CDN sunucu portlarına bağlantı.</li>
                      <li>• Satın almadan önce ücretsiz deneme (test yayını) imkanı.</li>
                      <li>• WhatsApp ve canlı destek üzerinden 7/24 kesintisiz teknik danışmanlık.</li>
                      <li>• Şeffaf paket yapısı, gizli taahhütsüz ve otomatik yenilenmeyen abonelik.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-bold text-base">Güvenle Satın Almaya Hazır mısınız?</h4>
                    <p className="text-xs sm:text-sm text-slate-400 font-light">
                      Orijinal Timsah Panel IPTV lisansınızı resmi QruzeTV altyapısıyla anında aktif edin.
                    </p>
                  </div>
                  <Link
                    to="/paketler/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition shadow-lg shadow-red-600/30 shrink-0"
                  >
                    <span>Paketleri Gör</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Timsah IPTV Nasıl Alınır? */}
          <section className="mb-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>3 Adımda Hızlı Başlangıç</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                Timsah Panel IPTV Nasıl Alınır? Adım Adım Satın Alma Kılavuzu
              </h2>
              <p className="text-slate-400 font-light text-base sm:text-lg">
                Uzun sözleşmeler, karmaşık formlar ve günlerce bekleme süresi yok. 
                Sadece birkaç dakika içinde yayınınızı başlatabilirsiniz.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="bg-[#0f0f15] border border-white/10 rounded-3xl p-8 relative hover:border-red-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 font-black text-xl flex items-center justify-center mb-6">
                  01
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Paketinizi Seçin</h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                  İhtiyacınıza ve bütçenize göre 1 Aylık, 3 Aylık, 6 Aylık veya en avantajlı <strong>12 Aylık Premium</strong> paketlerimizden birini tercih edin.
                </p>
                <Link to="/paketler/" className="text-xs font-bold text-red-400 hover:text-red-300 inline-flex items-center gap-1">
                  Paket seçeneklerini gör →
                </Link>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0f0f15] border border-white/10 rounded-3xl p-8 relative hover:border-red-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xl flex items-center justify-center mb-6">
                  02
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Siparişi Tamamlayın</h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                  Sipariş formunu doldurarak veya doğrudan WhatsApp müşteri destek hattımız üzerinden güvenli ödeme yöntemleriyle işleminizi tamamlayın.
                </p>
                <Link to="/iletisim/" className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">
                  Sipariş hattına bağlan →
                </Link>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0f0f15] border border-white/10 rounded-3xl p-8 relative hover:border-red-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-xl flex items-center justify-center mb-6">
                  03
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Anında İzlemeye Başlayın</h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                  M3U bağlantınız ve Xtream API giriş bilgileriniz 5 dakika içinde hazır! Cihazınızdaki IPTV uygulamasını açıp hemen izlemeye başlayın.
                </p>
                <Link to="/kurulum/" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
                  Cihaz kurulum rehberi →
                </Link>
              </div>
            </div>
          </section>

          {/* Section 4: Hangi Cihazlarda ve Uygulamalarda Çalışır? */}
          <section className="mb-16">
            <div className="bg-[#0c0c10] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <Tv className="w-3.5 h-3.5 text-primary" />
                  <span>Geniş Donanım Uyumluluğu</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                  Timsah Panel IPTV Hangi Cihazlarda Çalışır?
                </h2>
                <p className="text-slate-300 font-light text-base sm:text-lg">
                  Timsah Panel IPTV, ek donanım veya pahalı uydu alıcısı gerektirmez. 
                  Evinizdeki mevcut tüm akıllı cihazlara dakikalar içinde kurulabilir:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                  <Tv className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Smart TV&apos;ler</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    Samsung (Tizen) ve LG (webOS) mağazalarındaki <strong>IBO Player, Smart IPTV, Nanomid</strong> veya <strong>0 Player</strong> ile doğrudan kumandadan izleyin.
                  </p>
                  <Link to="/kurulum/smart-tv/" className="text-xs font-semibold text-emerald-400 hover:underline">
                    Smart TV Kurulumu →
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                  <MonitorPlay className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Android & Firestick</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    Xiaomi Mi Box, Amazon Fire TV Stick, Google TV ve tüm Android TV cihazlarında <strong>TiviMate, IPTV Smarters Pro</strong> ve <strong>XCIPTV</strong> desteği.
                  </p>
                  <Link to="/kurulum/android-tv/" className="text-xs font-semibold text-amber-400 hover:underline">
                    Android Kurulumu →
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                  <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Apple (iOS & Mac)</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    iPhone, iPad, Apple TV ve Mac bilgisayarlarda <strong>NEXT+, CASTORA, IPTVX</strong> ve <strong>GSE Smart IPTV</strong> ile 4K AirPlay keyfi.
                  </p>
                  <Link to="/kurulum/ios/" className="text-xs font-semibold text-blue-400 hover:underline">
                    Apple Kurulumu →
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                  <Laptop className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Windows PC</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    Windows 10 ve Windows 11 bilgisayarlarda <strong>IBO Player Pro, VS Player</strong> veya <strong>VLC Media Player</strong> ile tam ekran konforu.
                  </p>
                  <Link to="/kurulum/windows/" className="text-xs font-semibold text-red-400 hover:underline">
                    PC Kurulumu →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Sık Sorulan Sorular (FAQ) */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  <span>Merak Edilenler</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                  Timsah Panel IPTV Hakkında Sıkça Sorulan Sorular
                </h2>
                <p className="text-slate-400 font-light text-base">
                  Satın alma, aktivasyon ve teknik detaylarla ilgili en çok merak edilen soruların yanıtları:
                </p>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-[#0e0e14] overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-white text-base sm:text-lg hover:text-red-400 transition"
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                            isOpen ? 'rotate-180 text-red-500' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-slate-300 font-light leading-relaxed border-t border-white/5 pt-4">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Safe Harbor Legal Card */}
          <section className="mb-16">
            <div className="rounded-2xl border border-white/10 bg-[#0c0c10] p-6 text-xs text-slate-400 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                <Lock className="h-4 w-4 text-red-500 shrink-0" />
                <span>Yasal Bilgilendirme ve Adil Kullanım Beyanı</span>
              </div>
              <p>
                <strong>Sıfır Dosya Barındırma (Zero-Hosting):</strong> QruzeTV web sitesi üzerinde hiçbir üçüncü taraf oynatıcı APK&apos;sı, 
                telifli medya dosyası veya korsan stream içeriği barındırılmaz. Sunulan hizmet, kullanıcıların kendi internet altyapıları üzerinden 
                yasal ve lisanslı yayın akışlarına erişmesini sağlayan teknik bağlantı çözümlerinden ibarettir.
              </p>
              <p>
                <strong>Marka Hakları:</strong> Sitede adı geçen tüm marka, logo ve yazılım isimleri ilgili bağımsız geliştiricilerine aittir. 
                Tanımlayıcı ve bilgilendirici amaçlarla 5846 sayılı FSEK ve adil kullanım esaslarına uygun olarak yer verilmiştir.
              </p>
            </div>
          </section>

          {/* Bottom Conversion Banner */}
          <section className="rounded-3xl bg-gradient-to-r from-emerald-600/20 via-black to-red-950/30 border border-emerald-500/30 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block px-4 py-1 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
                HEMEN İZLEMEYE BAŞLAYIN
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">
                Timsah Panel IPTV Ayrıcalığına Bugün Katılın
              </h3>
              <p className="text-slate-300 text-sm sm:text-base font-light">
                Donmayan sunucular, 10.000+ kanal ve canlı teknik destek avantajıyla TV keyfinizi katlayın. 
                İster hemen satın alın, ister ücretsiz test ile kendiniz görün!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link
                  to="/paketler/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 hover:scale-105 transition"
                >
                  <Tv className="w-4 h-4" />
                  <span>Timsah Panel Paketlerini Satın Al</span>
                </Link>
                <button
                  type="button"
                  onClick={openTestModal}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition hover:scale-105"
                >
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Ücretsiz Test Al</span>
                </button>
              </div>
            </div>
          </section>

          {/* Internal Linking Helper */}
          <InternalLinkingHelper currentPage="/timsah-iptv/" />
        </main>

        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default TimsahIptvPage;
