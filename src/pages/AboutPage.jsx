
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { seoMetadata } from '@/data/seoMetadata';
import { breadcrumbSchema } from '@/utils/seoSchema';
import { motion } from 'framer-motion';

// Import all sections
import AboutValueSection from '@/components/AboutValueSection';
import MissionVisionSection from '@/components/MissionVisionSection';
import ServicesSection from '@/components/ServicesSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import SuccessStatsSection from '@/components/SuccessStatsSection';
import CompanyTimelineSection from '@/components/CompanyTimelineSection';
import SuccessStoriesSection from '@/components/SuccessStoriesSection';

const AboutPage = ({ siteData }) => {
  // Safely access metadata with fallback to prevent undefined errors
  const metadata = seoMetadata.about || {
    title: "Hakkımızda — Güvenilir 4K IPTV Altyapısı | QruzeTV",
    description: "QruzeTV hakkında detaylı bilgi. Güçlü CDN altyapımız, kesintisiz yayın standartlarımız, vizyonumuz ve 7/24 müşteri odaklı hizmetimiz.",
    keywords: ["hakkımızda", "iptv", "vizyon", "misyon"],
    ogType: "website"
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hakkımızda', path: '/hakkimizda' },
  ]);
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "QruzeTV",
    "description": metadata.description,
    "url": window.location.origin,
    "logo": siteData.contactData?.logoUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      // telephone bilerek yok — numara JSON-LD üzerinden hasat ediliyordu.
      "email": siteData.contactData?.email,
      "contactType": "customer service"
    }
  };

  return (
    <>
      <SEOHead 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType={metadata.ogType}
        ogImage={metadata.ogImage}
        twitterCard={metadata.twitterCard}
        jsonLd={[breadcrumb, orgSchema]}
      />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans overflow-x-hidden">
        <Header contactData={siteData.contactData} siteTexts={siteData.siteTexts} />
        
        <main id="main-content" className="flex-grow pt-20">
          
          {/* Hero / Introduction Section - single H1 for TR about page */}
          <section className="relative py-24 overflow-hidden" aria-label="Hakkımızda Giriş Bölümü">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e50914]/20 via-[#0a0a0a] to-[#141414]" />
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-primary font-bold text-sm tracking-widest uppercase">
                    QruzeTV Hakkımızda
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                  QruzeTV ile Güvenilir ve Premium IPTV Deneyimi
                </h1>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                  QruzeTV, hem Türkiye&#39;deki bireysel kullanıcılar hem de yurt dışındaki Türkler için
                  güvenilir, kesintisiz ve üst düzey bir IPTV hizmeti sunmak üzere kurulmuş profesyonel bir
                  dijital yayın platformudur.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Core Values Section */}
          <AboutValueSection />

          {/* Mission & Vision Section */}
          <MissionVisionSection />

          {/* SEO Odaklı Hakkımızda İçeriği – TR (zenginleştirilmiş) */}
          <section className="py-12 md:py-20 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#141414]" aria-label="QruzeTV Hakkımızda Detaylı İçerik">
            <div className="container mx-auto px-4 max-w-6xl text-slate-200 space-y-16">
              {/* Marka hikayesi ve misyon */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] items-start"
              >
                <div className="space-y-5">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    QruzeTV’nin Doğuşu ve Misyonu – Türk IPTV Deneyimini Yeniden Tanımlayan Marka
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed">
                    QruzeTV, dijital yayıncılığın hızla geliştiği bir dönemde, gerçekten güvenilir bir{' '}
                    <span className="font-semibold text-primary">IPTV hizmet</span> i arayan kullanıcıların
                    beklentilerine cevap verebilmek için kuruldu. Kurucu ekibimiz; geleneksel yayıncılık, ağ
                    mühendisliği ve kullanıcı deneyimi tasarımı alanlarında yıllara dayanan tecrübeye sahip
                    profesyonellerden oluşuyor. Bu birikimi, hem Türkiye&#39;deki bireysel kullanıcılar hem de
                    yurt dışında yaşayan Türkler için kesintisiz, ölçeklenebilir ve uzun vadeli bir{' '}
                    <span className="font-semibold text-primary">profesyonel bir IPTV</span> platformuna dönüştürdük.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed">
                    Yıllar içerisinde on binlerce kullanıcıya ulaşan QruzeTV, bugün hem Türkiye&#39;de hem de
                    Avrupa başta olmak üzere dünyanın birçok bölgesinde tercih edilen bir{' '}
                    <span className="font-semibold text-primary">Türk IPTV</span> markası konumuna geldi.
                    İlk günden bu yana temel ilkemiz; rakamlardan çok, kullanıcılarımızın hayatına gerçek değer
                    katmak oldu. Bu nedenle tüm yol haritamızı; şeffaflık, sürdürülebilirlik, istikrar ve uzun vadeli
                    memnuniyet üzerine inşa ettik.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed">
                    Misyonumuz; ister Türkiye&#39;de yaşayın ister yurt dışında olun, televizyonu yalnızca &quot;aç
                    izle&quot; mantığından çıkararak, her anınıza uyum sağlayan, cihaz bağımsız, üst düzey bir
                    eğlence deneyimine dönüştürmek. QruzeTV, bu vizyonla geliştirdiği{' '}
                    <span className="font-semibold text-primary">IPTV abonelik</span> modelleri ile kullanıcılarına
                    beklentilerinin üzerinde bir hizmet sunmayı hedefliyor.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-primary/30 p-6 shadow-xl shadow-primary/40">
                    <p className="text-sm font-semibold tracking-widest text-primary uppercase mb-3">
                      Güven ve Güvenilirlik
                    </p>
                    <ul className="space-y-2 text-sm md:text-base leading-relaxed">
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>
                          Yıllardır kesintisiz şekilde hizmet veren, sürekli büyüyen bir{' '}
                          <span className="font-semibold">IPTV hizmet</span> platformu
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>
                          Türkiye ve yurt dışında on binlerce kullanıcıya ulaşan geniş bir topluluk
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>
                          Uzun vadeli memnuniyet ve tavsiye oranı yüksek, güvenilir IPTV deneyimi
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/60 border border-slate-700/60 p-5 text-sm md:text-base">
                    <p className="font-semibold text-slate-100 mb-1">
                      Kime Hitap Ediyoruz?
                    </p>
                    <p className="text-slate-300">
                      Hem Türkiye&#39;de yaşayan bireysel kullanıcılar, hem de Almanya, Hollanda, Fransa, İngiltere ve
                      diğer ülkelerde yaşayan, anadilinde içerik arayan Türkler için özelleştirilmiş{' '}
                      <span className="font-semibold">yurt dışı IPTV</span> çözümleri sunuyoruz.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Neden bizi seçmelisiniz */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      Neden QruzeTV’yi Seçmelisiniz? – Güvenilir IPTV, Gerçek Fark
                    </h2>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-300">
                      Piyasada çok sayıda IPTV sağlayıcısı bulunuyor; ancak bunların önemli bir kısmı kısa vadeli,
                      destekten yoksun ve sürdürülebilir olmayan yapılardan oluşuyor. QruzeTV ise uzun soluklu
                      bir yaklaşım benimsiyor ve tüm sistemini kullanıcı memnuniyeti üzerine kurguluyor. Bizim için
                      asıl önemli olan; yalnızca yüksek çözünürlüklü görüntü değil, baştan sona güven veren bir abonelik
                      deneyimi sunmak.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-[#e50914]/10 border border-[#e50914]/40 px-4 py-2 text-sm text-[#e50914]">
                    <span className="h-2 w-2 rounded-full bg-[#e50914] animate-pulse" />
                    <span>Yüksek yenileme oranına sahip sadık abone kitlesi</span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-primary/30 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Kurumsal Güven ve Şeffaflık
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      Abonelik süreçlerimizde şeffaflığı esas alır, kullanıcılarımıza sunduğumuz{' '}
                      <span className="font-semibold">IPTV paket</span> içeriklerini, sürelerini ve koşullarını
                      açıkça paylaşırız. Sözleşme koşullarında sürpriz yoktur; neye abone olduğunuzu en baştan net
                      olarak bilirsiniz. Bu yaklaşım, QruzeTV&#39;yi tercih eden kullanıcıların bize olan
                      güvenini her yıl daha da artırmaktadır.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-[#e50914]/30 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Türkiye ve Yurt Dışında Aynı Standart
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      Hem Türkiye içinde hem de yurt dışında yaşayan Türk kullanıcılar için tasarlanmış{' '}
                      <span className="font-semibold">yurt dışı IPTV</span> altyapımız sayesinde, bulunduğunuz
                      ülkeden bağımsız olarak aynı kalite standardını korumaya odaklanıyoruz. Farklı coğrafyalardaki
                      bağlantı koşullarını gözeterek, içerik dağıtım ağlarımızı sürekli optimize ediyoruz.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-pink-500/30 p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Kullanıcı Deneyimi Merkezli Yaklaşım
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      QruzeTV ekibi, her yeni özelliği &quot;gerçek bir kullanıcı bu özelliği nasıl deneyimler?&quot;
                      sorusuyla tasarlar. Menü yapıları, kanal listeleri ve cihaz uyumluluğu gibi konularda sade ama
                      güçlü bir kullanıcı deneyimi sunmaya özen gösteririz. Bu sayede sadece teknik olarak değil,
                      kullanım kolaylığı açısından da öne çıkan bir{' '}
                      <span className="font-semibold">güvenilir IPTV</span> deneyimi sağlarız.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Teknik altyapı */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      Teknik Altyapımız – 4K IPTV ve HD Kanal Kalitesine Güç Veren Sistem
                    </h2>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-300">
                      Güçlü bir teknik altyapı olmadan, ne kadar zengin içerik sunulursa sunulsun,{' '}
                      <span className="font-semibold">istikrarlı bir yayın</span> deneyiminden söz etmek mümkün değildir.
                      QruzeTV olarak yatırımımızı yalnızca içerik tarafına değil, aynı zamanda yüksek uptime
                      oranına sahip, ölçeklenebilir ve güvenli sunucu altyapısına da yapıyoruz. Böylece kullanıcılarımıza,
                      günün ve haftanın yoğun saatlerinde bile istikrarlı bir yayın akışı sunabiliyoruz.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center text-xs md:text-sm">
                    <div className="rounded-xl bg-[#0a0a0a]/70 border border-[#e50914]/40 px-3 py-3">
                      <p className="text-[#e50914] font-bold text-lg md:text-xl">99%+</p>
                      <p className="text-slate-300">hedeflenen uptime oranı</p>
                    </div>
                    <div className="rounded-xl bg-[#0a0a0a]/70 border border-primary/40 px-3 py-3">
                      <p className="text-primary font-bold text-lg md:text-xl">4K / HD</p>
                      <p className="text-slate-300">yayın kalite standartları</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      Yüksek Uptime, Hızlı Sunucular ve Akıllı Yönlendirme
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      QruzeTV, farklı lokasyonlarda konumlandırılmış, yüksek performanslı sunucular üzerinde
                      çalışan dağıtık bir altyapı kullanır. Böylece kullanıcıların bulunduğu bölgeye en yakın ve en
                      hızlı erişimi sunan sunucu üzerinden yayın alması sağlanır. Akıllı yük dengeleme sistemleri,
                      anlık yoğunluk artışlarında trafiği otomatik olarak dağıtarak gecikmeyi minimum seviyede tutar.
                    </p>
                    <p className="text-sm md:text-base leading-relaxed">
                      Özellikle canlı yayın, maç ve büyük etkinlik dönemlerinde yaşanan yoğun yüklenmeler, çoğu
                      platform için ciddi bir problem oluştururken, QruzeTV’nin tasarladığı altyapı bu
                      dönemlerde de istikrarı korumaya odaklanır. Böylece hem Türkiye içindeki hem de yurt dışındaki
                      kullanıcılarımız, aynı stabil <span className="font-semibold">IPTV hizmet</span> kalitesine
                      sahip olur.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      4K IPTV ve HD Kanal Deneyimi
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      QruzeTV, içerik tarafında geniş bir <span className="font-semibold">HD kanal</span> ve
                      4K destekli yayın seçeneklerine yer verir. Uyumlu cihaz ve bağlantı koşulları sağlandığında
                      kullanıcılarımız; renk doğruluğu, keskinlik ve detay seviyesi açısından üst düzey bir{' '}
                      <span className="font-semibold">4K IPTV</span> deneyimi yaşar. Bağlantı hızı düşük olduğunda
                      ise adaptif yayın teknolojileri devreye girerek, donma ve kopma yerine kaliteyi otomatik
                      optimize eder.
                    </p>
                    <p className="text-sm md:text-base leading-relaxed">
                      Tüm bu altyapı yatırımlarımız, QruzeTV markasını; teknik açıdan güçlü, kullanıcı gözüyle
                      bakıldığında ise pratik ve konforlu bir{' '}
                      <span className="font-semibold">Türk IPTV</span> çözümü haline getiriyor.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Müşteri desteği */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.11 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      7/24 Destek Sunan Müşteri Hizmetleri – Sadece Bir Tık Uzağınızdayız
                    </h2>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-300">
                      Bir IPTV sağlayıcısını gerçekten değerli kılan unsur, yaşanan bir sorunda ne kadar hızlı ve
                      profesyonel çözüm sunabildiğidir. QruzeTV olarak kullanıcılarımızı, abonelik süresi
                      boyunca yalnız bırakan bir anlayışı kesinlikle benimsemiyoruz. Bu nedenle deneyimli destek
                      ekibimiz, <span className="font-semibold">7/24 destek</span> anlayışıyla farklı iletişim
                      kanalları üzerinden hizmet veriyor.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/80 border border-[#e50914]/40 px-5 py-4 text-sm md:text-base">
                    <p className="font-semibold text-white mb-1">Ne Zaman Ulaşabilirsiniz?</p>
                    <p className="text-slate-200">
                      Kurulumdan paket değişikliğine, bağlantı sorunlarından cihaz uyumluluğuna kadar tüm sorularınız
                      için günün her saati bize ulaşabilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-slate-700/70 p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Kurulum ve Cihaz Desteği
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      Smart TV, Android TV kutuları, mobil cihazlar ve bilgisayarlar için adım adım kurulum
                      rehberleri sunuyoruz. Özellikle yurt dışında yaşayan Türk kullanıcılarımız için, bölgesel
                      ayarlar ve uygulama kurulumları konusunda detaylı yönlendirmeler sağlıyoruz.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-slate-700/70 p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Hızlı ve Çözüm Odaklı İletişim
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      Destek taleplerinizde önceliğimiz, sorunu en kısa sürede tespit edip, kalıcı bir şekilde
                      çözmektir. Hazır kalıplarla geçiştirmek yerine, gerçekten ihtiyacınıza uygun çözümü bulmayı
                      amaçlıyoruz. Böylece <span className="font-semibold">IPTV hizmet</span> deneyiminiz kesintiye
                      uğramadan devam eder.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/70 border border-slate-700/70 p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Geri Bildirim Odaklı Gelişim
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      Kullanıcılarımızdan gelen her geri bildirimi, kanal listelerimizi, arayüz deneyimlerimizi ve
                      teknik altyapımızı geliştirmek için bir fırsat olarak görüyoruz. Bu sayede QruzeTV,
                      sürekli kendini yenileyen, dinamik ve kullanıcı odaklı bir{' '}
                      <span className="font-semibold">güvenilir IPTV</span> platformu olma özelliğini koruyor.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Fiyatlandırma anlayışı */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.14 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      Fiyatlandırma Anlayışımız – Uygun Fiyatlı, Şeffaf ve Esnek IPTV Paketleri
                    </h2>
                    <p className="mt-3 text-base md:text-lg leading-relaxed text-slate-300">
                      QruzeTV olarak, yüksek kalitede bir <span className="font-semibold">IPTV abonelik</span>{' '}
                      deneyiminin yalnızca belirli bir kesimin erişebileceği lüks bir hizmet olmaması gerektiğine
                      inanıyoruz. Bu nedenle fiyatlandırma politikamızı; erişilebilirlik, şeffaflık ve esneklik
                      prensipleri üzerine kurduk. Hazırladığımız her bir{' '}
                      <span className="font-semibold">IPTV paket</span>, farklı bütçe ve kullanım alışkanlıklarına
                      hitap edecek şekilde tasarlandı.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#0a0a0a]/80 border border-amber-400/40 px-5 py-4 text-sm md:text-base">
                    <p className="font-semibold text-amber-200 mb-1">Şeffaflık Sözümüz</p>
                    <p className="text-slate-100">
                      Sözleşme süresi, paket içeriği ve ücretlendirme; karar vermeden önce tamamen şeffaf bir şekilde
                      sunulur, gizli maliyetlere yer verilmez.
                    </p>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      Her Bütçeye Uygun IPTV Çözümleri
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      Kısa dönem deneme paketlerinden, uzun dönem avantajlı aboneliklere kadar farklı ihtiyaca
                      yönelik seçenekler oluşturduk. Böylece QruzeTV’yi önce deneyip, memnun kaldığınızda
                      daha uzun süreli ve avantajlı paketlere geçiş yapabilirsiniz. Bu yaklaşım; kullanıcılarımıza
                      &quot;önce deneyimle, sonra karar ver&quot; özgürlüğü sağlıyor.
                    </p>
                    <p className="text-sm md:text-base leading-relaxed">
                      Üstelik hem Türkiye içindeki kullanıcılar hem de yurt dışındaki Türkler için rekabetçi fiyatlar
                      sunmaya özen gösteriyor, kur avantajı ve maliyet farklarını olabildiğince dengelemeye
                      çalışıyoruz. Böylece <span className="font-semibold">yurt dışı IPTV</span> arayışında olan
                      kullanıcılar da aynı standartta bir hizmete ulaşabiliyor.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      Gizli Ücret Yok, Sürpriz Yok
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed">
                      QruzeTV, fiyatlandırma sürecinde şeffaflığı ilke edinir. Abonelik başında gördüğünüz{' '}
                      <span className="font-semibold">IPTV paket</span> içeriği ve ücreti neyse, abonelik süresince
                      de bu çerçevede devam eder. Ekstra kurulum bedelleri, aktivasyon ücretleri ya da sonradan
                      eklenen sürpriz masraflar yoktur.
                    </p>
                    <p className="text-sm md:text-base leading-relaxed">
                      Amacımız; uzun vadede kullanıcılarımızla karşılıklı güvene dayalı bir ilişki kurmak ve
                      &quot;güvenilir IPTV&quot; denildiğinde ilk akla gelen markalardan biri olarak konumumuzu
                      güçlendirmektir.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Kapanış ve CTA */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-4 border border-primary/40 rounded-3xl p-6 md:p-10 bg-gradient-to-r from-[#e50914]/40 via-[#0a0a0a] to-[#b20710]/40 shadow-2xl"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  QruzeTV ile Güvenilir ve Üst Düzey IPTV Deneyimine Şimdi Adım Atın
                </h2>
                <p className="text-base md:text-lg leading-relaxed mb-4 text-slate-100">
                  QruzeTV, yalnızca teknik olarak güçlü bir <span className="font-semibold">IPTV hizmet</span>{' '}
                  sunmakla kalmıyor; aynı zamanda her gününüzde yanınızda olacak, alışkanlıklarınızı dönüştürecek
                  yeni bir televizyon deneyimi vadediyor. Gelişmiş altyapımız, 4K IPTV ve HD kanal kalitemiz,
                  şeffaf ve avantajlı IPTV paket yapımız ile hem Türkiye&#39;deki kullanıcılarımızın hem de yurt
                  dışında yaşayan Türklerin beklentilerini karşılamayı ve aşmayı hedefliyoruz.
                </p>
                <p className="text-base md:text-lg leading-relaxed mb-4 text-slate-100">
                  Eğer siz de televizyonu sadece arka planda açık bir ekran olmaktan çıkarıp, gerçekten keyif
                  aldığınız, kontrolün sizde olduğu, cihaz bağımsız ve ayrıcalıklı bir eğlenceye dönüştürmek
                  istiyorsanız, QruzeTV tam size göre. Güvenilir IPTV altyapısı, uygun fiyatlı ve esnek IPTV
                  abonelik seçenekleri ve <span className="font-semibold">7/24 destek</span> sunan deneyimli ekibiyle
                  QruzeTV, bir sonraki adımda yanınızda olmaya hazır.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-slate-100">
                  Şimdi QruzeTV ailesine katılın; ister Türkiye&#39;de ister yurt dışında olun, televizyon
                  deneyiminizi birlikte yeniden tasarlayalım. Üst düzey görüntü kalitesi, güvenilir altyapı, 4K IPTV ve HD kanal
                  standartlarını bir arada sunan bu yolculukta, sizleri de aramızda görmekten memnuniyet duyarız.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Broadcast Engineering Pillars */}
          <WhyChooseUsSection title="Mühendislik Standartlarımız ve Altyapı" />

        </main>

        <Footer contactData={siteData.contactData} siteTexts={siteData.siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default AboutPage;
