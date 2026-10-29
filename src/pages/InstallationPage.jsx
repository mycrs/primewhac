
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import DeviceSelectionSection from '@/components/installation/DeviceSelectionSection';
import InstallationPageSeoSection from '@/components/installation/InstallationPageSeoSection';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { breadcrumbSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';

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
          "text": "Cihazınıza uygun IPTV oynatıcı uygulamasını (Tivimate, 000 Player, IPTV Smarters, VLC vb.) indirin. M3U linki veya Xtream Codes bilgilerinizi uygulamaya girin. Kanallar otomatik yüklenecektir."
        }
      },
      {
        "@type": "Question",
        "name": "Hangi cihazlarda IPTV izlenebilir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "IPTV; desteklenen Samsung, LG, Philips, Vestel, Hisense ve TCL Smart TV modellerinin yanı sıra Android TV, Fire TV Stick, iPhone, iPad, Android telefon, Windows PC, Mac ve tabletlerde kullanılabilir. Uygulama desteği model, işletim sistemi ve bölgeye göre değişir."
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
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200">
        <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        
        <main className="flex-grow w-full">
          {/* Hero Section */}
          <section className="relative min-h-[55vh] lg:min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] py-20 px-4 pt-32">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0a0a] to-[#141414]" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <div className="container relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mb-6 flex justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(229,9,20,0.15)]">
                    Rehber & Yönergeler
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff2430] via-[#e50914] to-[#b20710]">
                  IPTV Kurulum Rehberi
                </h1>
                <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed text-slate-300">
                  Adım adım kurulum talimatları ile cihazınızı dakikalar içinde hazırlayın.
                </p>
              </motion.div>

              {/* Quick stat pills */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3 mt-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {[
                  { icon: Loader2, text: '5 dk kurulum', color: 'text-[#e50914] bg-[#e50914]/10 border-[#e50914]/20' },
                  { icon: ArrowRight, text: '7 cihaz desteği', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { icon: ArrowRight, text: '7/24 destek', color: 'text-primary bg-primary/10 border-primary/20' },
                ].map((item, i) => (
                  <span key={i} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${item.color}`}>
                    <item.icon className="w-3.5 h-3.5" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 max-w-7xl relative z-10">
            <div className="mb-8">
              <BreadcrumbNavigation />
            </div>

            {/* Prerequisites checklist */}
            <motion.div
              className="mb-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {[
                { icon: '📶', title: 'İnternet', desc: 'Min. 16 Mbps stabil bağlantı' },
                { icon: '📱', title: 'Cihaz', desc: 'Smart TV, telefon, tablet veya PC' },
                { icon: '🔑', title: 'Erişim Bilgileri', desc: 'M3U link veya Xtream Codes' },
                { icon: '📥', title: 'Uygulama', desc: 'Cihaza uygun IPTV player' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-[#0a0a0a]/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-white text-sm">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Device selection */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-slate-800 p-2">
                <DeviceSelectionSection selectedDevice="" onSelect={() => {}} asLinks />
              </div>
            </motion.div>

            {/* How it works - 3-step */}
            <motion.div
              className="mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title text-3xl md:text-4xl mb-4 text-center">
                Kurulum Nasıl Yapılır?
              </h2>
              <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12 font-light">
                Sadece 3 adımda tüm cihazlarda IPTV'yi çalıştırın.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '01', title: 'Uygulamayı İndirin', desc: 'Cihazınıza uygun IPTV player uygulamasını (Tivimate, IBO Player, Smarters Pro vb.) mağazadan indirin.', gradient: 'from-[#e50914]/20 to-[#b20710]/20', border: 'border-amber-500/20 hover:border-amber-500/40' },
                  { step: '02', title: 'Bilgileri Girin', desc: 'Size gönderilen M3U linki veya Xtream Codes (sunucu, kullanıcı adı, şifre) bilgilerini uygulamaya girin.', gradient: 'from-[#e50914]/20 to-[#b20710]/20', border: 'border-primary/20 hover:border-primary/40' },
                  { step: '03', title: 'İzlemeye Başlayın', desc: 'Kanallar otomatik yüklenir. EPG rehberi, VOD arşivi ve 10.000+ kanalla izleme keyfine başlayın.', gradient: 'from-[#e50914]/20 to-[#b20710]/20', border: 'border-[#e50914]/20 hover:border-[#e50914]/40' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`relative p-8 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} transition-all duration-300`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <span className="text-5xl font-black text-white/10 absolute top-4 right-6">{item.step}</span>
                    <p className="text-xl font-bold text-white mb-3">{item.title}</p>
                    <p className="text-slate-300 font-light leading-relaxed text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Content article */}
            <motion.article 
              className="mt-24 bg-[#0a0a0a]/60 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white leading-tight">
                IPTV Nedir ve Nasıl Çalışır?
              </h2>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-8 leading-relaxed font-light">
                  IPTV, televizyon yayınlarını çanak anten veya kablo yerine internet protokolü üzerinden cihazınıza iletir. Size sağlanan M3U linki veya Xtream Codes API bilgileri sayesinde, cihazınızdaki oynatıcı uygulama yayın sunucularımızla iletişim kurar. Yüksek hızlı fiber sunucularımız, akıcı bir izleme deneyimini donma olmadan ekranınıza yansıtır.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 my-10 not-prose">
                  {[
                    { title: 'M3U Link', desc: 'Tek bir URL ile tüm kanal ve VOD listesini uygulamanıza çeker. Hızlı ve kolay.' },
                    { title: 'Xtream Codes', desc: 'Sunucu, kullanıcı adı ve şifre ile giriş. EPG ve gelişmiş özellikler sunar.' },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-xl bg-[#0a0a0a]/50 border border-slate-700/50">
                      <p className="font-bold text-white mb-2">{item.title}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="text-2xl font-bold text-white mt-12 mb-4 border-b border-slate-800 pb-3">Kurulum Öncesi Gereksinimler</p>
                <p className="text-slate-300 mb-6 font-light">Kusursuz bir izleme deneyimi için minimum 16 Mbps indirme hızına sahip stabil bir internet bağlantısı önerilir. Wi-Fi kullanıyorsanız modeme yakın olmalı veya mümkünse ethernet kablosu tercih etmelisiniz. 4K yayın için 25 Mbps ve üzeri hız idealdir.</p>

                <div className="mt-16 p-10 bg-gradient-to-br from-[#0a0a0a] to-[#141414] rounded-2xl border border-slate-700 shadow-xl text-center flex flex-col items-center">
                  <p className="text-2xl font-bold text-white mb-4">Kuruluma Hazır Mısınız?</p>
                  <p className="text-slate-300 mb-8 max-w-2xl font-light">Tüm kurulum adımlarını tamamladınız veya kuruluma başlamadan önce bir pakete ihtiyacınız varsa, hemen paketlerimizi inceleyin.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link 
                      to="/paketler" 
                      className="px-8 py-4 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                    >
                      Paketleri İncele <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      to="/sss" 
                      className="px-8 py-4 bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700 shadow-lg flex items-center justify-center"
                    >
                      Sık Sorulan Sorular
                    </Link>
                    <Link 
                      to="/test" 
                      className="px-8 py-4 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700 shadow-lg flex items-center justify-center"
                    >
                      Test Hesabı
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>

            <InstallationPageSeoSection />

            {/* Cihaz bazlı sorun giderme */}
            <motion.section
              className="mt-24 bg-[#0a0a0a]/60 border border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white leading-tight">
                Cihazlara Göre Sorun Giderme
              </h2>
              <p className="text-slate-400 mb-10 font-light max-w-3xl leading-relaxed">
                Kurulumu tamamladığınız hâlde takıldığınız bir nokta varsa sorun çoğu zaman cihaza özgüdür. Aşağıda destek kayıtlarımızda en sık karşılaştığımız durumları ve pratik çözümlerini cihaz bazında derledik.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Samsung, LG ve Diğer Smart TV’ler</h3>
                  <div className="space-y-3 text-slate-300 text-sm leading-relaxed font-light">
                    <p><strong className="text-slate-200">Uygulama mağazada görünmüyorsa:</strong> TV’nin model kodunu, işletim sistemini, yazılım sürümünü ve hizmet bölgesini kontrol edin. Mağazada bulunmayan bir uygulamayı destekleniyor kabul etmeyin; <Link to="/kurulum/smart-tv" className="font-semibold text-primary hover:underline">marka rehberinden</Link> modelinize uygun yolu seçin.</p>
                    <p><strong className="text-slate-200">Kanal geçişleri yavaşsa:</strong> Smart TV'lerin belleği sınırlıdır. Uygulama önbelleğini temizleyin, televizyonu fişten çekip bir dakika bekleyin. Wi-Fi yerine ethernet kullanmak kanal geçiş hızını belirgin şekilde artırır.</p>
                    <p><strong className="text-slate-200">M3U linkini kumandayla yazmak zorsa:</strong> Xtream Codes girişi (kullanıcı adı + şifre + sunucu adresi) çok daha kısa sürer; bilgileri size gelen mesajdan hata yapmadan girebilirsiniz.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Android TV</h3>
                  <div className="space-y-3 text-slate-300 text-sm leading-relaxed font-light">
                    <p><strong className="text-slate-200">EPG boş görünüyor veya saatler yanlışsa:</strong> Uygulamanın EPG kaynağını güncelleyin ve cihazın tarih/saat ayarını "otomatik" konumuna alın. Tivimate kullanıyorsanız ayarlardan EPG'yi manuel olarak yenileyin.</p>
                    <p><strong className="text-slate-200">Uygulama arka planda kapanıyorsa:</strong> Ayarlar'dan oynatıcı uygulaması için pil optimizasyonunu kapatın. Sorun sürerse uygulama önbelleğini temizleyip cihazı yeniden başlatın.</p>
                    <p><strong className="text-slate-200">Yayın donuyorsa:</strong> 2.4 GHz yerine 5 GHz Wi-Fi bandına geçin veya ethernet kullanın. Aynı ağda büyük bir indirme devam ediyorsa izleme sırasında duraklatın.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Fire TV Stick</h3>
                  <div className="space-y-3 text-slate-300 text-sm leading-relaxed font-light">
                    <p><strong className="text-slate-200">"Depolama alanı yetersiz" uyarısı alıyorsanız:</strong> Ayarlar &gt; Uygulamalar &gt; Uygulamaları Yönet yolundan kullanmadığınız uygulamaları kaldırın ve kalanların önbelleğini temizleyin. Stick'in boş alanı azaldıkça yayın performansı da düşer.</p>
                    <p><strong className="text-slate-200">APK yüklenmiyorsa:</strong> Geliştirici seçeneklerinden "bilinmeyen kaynaklardan uygulama yükleme" iznini açın. Uygulama Amazon mağazasında mevcutsa her zaman resmi sürümü tercih edin.</p>
                    <p><strong className="text-slate-200">Kumandayla yazı yazmak zor geliyorsa:</strong> Telefonunuza Fire TV uygulamasını kurup kumanda yerine kullanın; klavye desteği sayesinde M3U ve şifre girişi birkaç saniyeye iner.</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">iOS (iPhone / iPad)</h3>
                  <div className="space-y-3 text-slate-300 text-sm leading-relaxed font-light">
                    <p><strong className="text-slate-200">Yayın bir süre sonra kendiliğinden duruyorsa:</strong> iOS arka plandaki uygulamaları kısar. Düşük güç modunu kapatın ve oynatıcıyı ön planda tutun; ekran otomatik kilitlenince yayın da kesilebilir.</p>
                    <p><strong className="text-slate-200">Ekran kapanınca ses kesiliyorsa:</strong> Bazı oynatıcılarda "arka planda oynatma" seçeneği bulunur. Uygulamanızda bu ayar yoksa otomatik kilit süresini uzatmak en pratik çözümdür.</p>
                    <p><strong className="text-slate-200">AirPlay'de gecikme veya donma oluyorsa:</strong> Telefondan yansıtmak yerine Apple TV'ye doğrudan uygulama kurmak ya da HDMI adaptörü kullanmak çok daha stabil sonuç verir.</p>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 mt-10 font-light leading-relaxed">
                Bu adımlar sorunu çözmezse <Link to="/sss" className="text-primary hover:text-primary underline underline-offset-2">Sık Sorulan Sorular</Link> sayfamıza göz atın veya 7/24 destek hattımızdan bize ulaşın; teknik ekibimiz cihazınıza özel yönlendirme yapar.
              </p>
            </motion.section>

          </div>
        </main>
        <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
      </div>
    </ErrorBoundary>
  );
};

export default InstallationPage;
