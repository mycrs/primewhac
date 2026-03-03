
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Packages from '@/components/Packages';
import SEOHead from '@/components/SEOHead';
import { defaultData } from '@/data/defaultSiteData';
import ErrorBoundary from '@/components/ErrorBoundary';
import ChatBot from '@/components/ChatBot';
import { CheckCircle2, ShieldCheck, Zap, HelpCircle, Info, MonitorPlay, Settings, Wrench } from 'lucide-react';

const PackagesPage = ({ siteData }) => {
  const safeSiteData = siteData || defaultData;

  const metadata = {
    title: "Premium IPTV Paketleri | Uygun Fiyatlı Kesintisiz Yayınlar",
    description: "Premium IPTV paketleri ile kesintisiz yayın deneyimi. Uygun fiyatlı paketler, 4K kalitesi, 7/24 destek. Hemen başla!",
    keywords: ["IPTV paketleri", "kesintisiz yayın", "uygun fiyat", "uygun fiyatlı", "en iyi IPTV", "premium paketler", "IPTV fiyatları"],
    ogType: "website"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": "https://qruzehd.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Paketler",
        "item": "https://qruzehd.com/paketler"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Hangi IPTV paketini seçmeliyim?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "İzleme alışkanlıklarınıza göre değişir. Kısa süreli deneme için 3 aylık, uzun vadeli tasarruf için 12 aylık premium paketlerimizi öneriyoruz."
        }
      },
      {
        "@type": "Question",
        "name": "Yayınlarda donma olur mu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anti-freeze teknolojimiz ve güçlü sunucularımız sayesinde minimum 10 Mbps internet hızında kesintisiz yayın izleyebilirsiniz."
        }
      }
    ]
  };

  return (
    <>
      <SEOHead {...metadata} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col font-sans text-white selection:bg-purple-500/30">
        <Header contactData={safeSiteData.contactData} />
        
        <main className="flex-grow pt-24 pb-16">
          {/* Main H1 - Hero Section with Premium Enhancements */}
          <section className="relative overflow-hidden py-16 md:py-24">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-pink-500/5 to-transparent -z-10" />
            
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                Premium IPTV Paketleri
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                İhtiyaçlarınıza en uygun paketi seçin ve anında kurulum ile kesintisiz eğlencenin tadını çıkarın. Sizin için hazırladığımız özel avantajlarla dolu dünyaya adım atın.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm transition-all hover:bg-white/10 group">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">Anında Teslimat</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm transition-all hover:bg-white/10 group">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">7/24 Canlı Destek</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm transition-all hover:bg-white/10 group">
                  <CheckCircle2 className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium">Tüm Cihazlarla Uyumlu</span>
                </div>
              </div>
            </div>
          </section>

          {/* IPTV Paketleri Nedir? */}
          <section className="py-12 bg-slate-900/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                  <Info className="w-8 h-8 text-purple-500" />
                  IPTV Paketleri Nedir?
                </h2>
                <div className="text-slate-300 space-y-4 leading-relaxed text-lg">
                  <p>
                    IPTV paketleri, modern çağın en popüler eğlence çözümüdür. Geleneksel uydu alıcılarının ve kablolu yayınların yerini alan bu sistem, internet protokolü üzerinden televizyon yayınlarını ekranınıza taşır. Binlerce kanal, film ve dizi içeriğine anında erişim sağlayan en iyi IPTV hizmetleri, evinizdeki eğlence anlayışını tamamen değiştirir.
                  </p>
                  <p>
                    Artık çanak anten kurulumu veya karmaşık kablolama işlemleriyle uğraşmanıza gerek yok. Gelişmiş teknolojik altyapımız sayesinde, kesintisiz yayın kalitesi ve uygun fiyat ile milyonlarca kullanıcının tercih ettiği bir teknoloji haline gelmiştir. İnternet bağlantınızın olduğu her yerde, ister televizyonunuzda ister mobil cihazınızda en sevdiğiniz içerikleri özgürce izleyebilirsiniz. QruzeHD olarak, sunduğumuz premium paketler ile siz de bu sınırsız eğlence dünyasının ayrıcalıklı bir parçası olabilirsiniz.
                  </p>
                  <p>
                    İçerik kütüphanemiz, güncel sinema filmlerinden popüler dizilere, belgesellerden çocuk kanallarına kadar geniş bir yelpazeyi kapsar. Sadece canlı yayınları değil, aynı zamanda isteğe bağlı video (VOD) içeriklerini de dilediğiniz zaman başlatıp durdurabilir, geri sarma özelliği ile hiçbir anı kaçırmazsınız.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Packages Component Wrapper - Header and Border removed as requested */}
          <section id="packages-list" className="relative z-10 py-12">
            <ErrorBoundary>
              <Packages packages={safeSiteData.packagesData} title="Avantajlı Abonelik Seçenekleri" />
            </ErrorBoundary>
          </section>

          {/* Paket Özellikleri Detaylı */}
          <section className="py-16 bg-slate-900/30 border-y border-white/5">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-bold mb-10 text-white text-center">Paket Özellikleri Detaylı</h2>
              
              <div className="space-y-12 text-slate-300 text-lg leading-relaxed">
                <div>
                  <p className="mb-6">
                    Müşterilerimizin farklı ihtiyaçlarını karşılamak üzere özenle hazırladığımız IPTV paketleri, her bütçeye ve kullanım senaryosuna uygun alternatifler sunar. Her paketimizde kanal sayısı, zengin VOD kütüphanesi, 4K/UHD görüntü kalitesi ve çoklu cihaz uyumluluğu standart olarak sunulmaktadır. Ayrıca detaylı kurulum rehberimiz için <Link to="/kurulum" className="text-purple-400 hover:text-purple-300 underline">Kurulum sayfamızı</Link> ziyaret edebilirsiniz.
                  </p>
                </div>

                <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white text-purple-400">3 Aylık Paketler</h3>
                  <p>
                    Kısa süreli deneme yapmak isteyenler veya geçici bir çözüm arayanlar için 3 aylık paketler ideal seçimdir. Bu paketler, esnek yapısıyla sistemi test etmenize ve yayın kalitesini deneyimlemenize olanak tanır. Yazlık evinizde veya kısa süreli tatillerinizde kesintisiz yayın keyfini yaşamak için mükemmel bir fırsattır. Uygun fiyatlı bu başlangıç paketi, sistemimizin güvenilirliğini kendi gözlerinizle görmeniz için tasarlanmıştır.
                  </p>
                </div>

                <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white text-purple-400">6 Aylık Paketler</h3>
                  <p>
                    Orta vadeli bir çözüm arayan kullanıcılar için 6 aylık IPTV paketleri makul bir tasarruf sağlar. Özellikle spor sezonlarını, favori dizilerinizin yeni sezonlarını veya kış aylarındaki evde geçirilen uzun akşamları kapsayacak şekilde tercih edilir. Aylık maliyetleri düşürerek, premium içeriklere daha avantajlı koşullarda ulaşmanızı sağlar.
                  </p>
                </div>

                <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white text-purple-400">12 Aylık Paketler</h3>
                  <p>
                    Uzun vadeli bir çözüm arayan kullanıcılar ise 12 aylık premium paketler ile önemli bir tasarruf sağlayabilirler. En iyi fiyat avantajını sunan yıllık abonelikler, yenileme derdi olmadan tam bir yıl boyunca kafanızın rahat olmasını garantiler. Fiyat dalgalanmalarından etkilenmeden, evinizin kalıcı eğlence platformunu güvence altına almış olursunuz. Uzun soluklu bu paket, en iyi IPTV deneyimini maksimum ekonomiyle birleştirir.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Neden Bizim Paketlerimiz? */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Neden Bizim Paketlerimiz?</h2>
                <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full" />
                <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
                  Bizim sunduğumuz IPTV paketleri, sadece fiyat açısından değil, teknolojik altyapı, yayın kalitesi ve satış sonrası hizmetler açısından da sektördeki en iyi seçeneklerdir.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
                  <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Yüksek Performans</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Anti-freeze teknolojimiz ve global lokasyonlu, optimize edilmiş sunucularımız sayesinde, yoğun maç saatlerinde bile donma veya takılma olmadan kesintisiz yayın deneyimi sağlar. Gerçek 4K ve Full HD kanallarda kristal netliğinde görüntü kalitesi sunuyoruz.
                  </p>
                </div>
                
                <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
                  <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Güvenli Ödeme</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Müşteri güvenliği birincil önceliğimizdir. Tüm ödemeleriniz 256-bit SSL şifreleme teknolojisi ile korunur. Kredi kartı, havale veya kripto gibi farklı ödeme yöntemleri ile güvenli, hızlı ve şeffaf bir alışveriş deneyimi sunuyoruz. Gizliliğiniz her zaman güvendedir.
                  </p>
                </div>
                
                <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 shadow-xl">
                  <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                    <HelpCircle className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Kesintisiz Destek</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Aboneliğiniz süresince karşılaşabileceğiniz kurulum, kanal güncelleme veya teknik her türlü sorunda 7/24 aktif olan uzman destek ekibimiz yanınızda. WhatsApp ve Canlı Destek üzerinden saniyeler içinde çözüm üretiyoruz.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Nasıl Seçilir & İpuçları */}
          <section className="py-16 bg-slate-900/40">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="grid md:grid-cols-2 gap-12">
                
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <MonitorPlay className="w-8 h-8 text-purple-500" />
                    IPTV Paketleri Nasıl Seçilir?
                  </h2>
                  <div className="text-slate-300 text-lg leading-relaxed space-y-4">
                    <p>
                      Doğru IPTV paketini seçmek, tamamen sizin günlük izleme alışkanlıklarınıza, evinizdeki cihaz sayısına ve bütçenize bağlıdır. Öncelikle evinizdeki internet hızını kontrol etmelisiniz; stabil bir kesintisiz yayın için minimum 10-15 Mbps hıza ihtiyacınız olacaktır.
                    </p>
                    <p>
                      Hangi cihazları kullanacağınızı belirleyin. Sistemimiz Smart TV, Android Box, Apple TV, bilgisayar ve akıllı telefonların tümüyle tam uyumludur. Sadece canlı kanalları mı, yoksa geniş bir VOD arşivi mi aradığınıza karar verin. Tüm premium paketler bu özelliklerin tamamını barındırsa da, uzun süreli alımlar her zaman en uygun fiyatlı çözümdür.
                    </p>
                    <p>
                      Hangi içeriklerin sizin için önemli olduğuna da göz atabilirsiniz. Daha fazla detay için <Link to="/kanallar" className="text-purple-400 hover:text-purple-300 underline">Kanal Listemizi</Link> inceleyebilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Settings className="w-8 h-8 text-purple-500" />
                    Kullanım İpuçları
                  </h2>
                  <div className="text-slate-300 text-lg leading-relaxed space-y-4">
                    <p>
                      IPTV paketinizden en iyi şekilde yararlanmak ve en iyi IPTV deneyimini yaşamak için birkaç önemli ipucu: 
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Bağlantı Türü:</strong> Mümkünse cihazınızı modeme Wi-Fi yerine Ethernet (kablolu) ile bağlayın. Bu, sinyal kayıplarını önler ve stabilitenizi artırır.</li>
                      <li><strong>Cihaz Bakımı:</strong> Smart TV veya TV Box cihazınızın işletim sistemini ve kullandığınız IPTV uygulamasını düzenli olarak güncelleyin.</li>
                      <li><strong>Önbellek Temizliği:</strong> Zaman zaman uygulamalarınızın önbelleğini temizlemek, yavaşlama sorunlarını ve takılmaları çözer.</li>
                      <li><strong>Bant Genişliği:</strong> Evde aynı anda yoğun indirme (download) işlemleri yapılıyorsa, yayın kaliteniz etkilenebilir.</li>
                    </ul>
                    <p>
                      Premium paketlerimiz, yüksek teknolojili altyapımızla birleştiğinde size muazzam bir izleme keyfi sunar. Herhangi bir teknik sorunda, 7/24 müşteri hizmetlerimizle iletişime geçmekten çekinmeyin.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SSS Teaser Section - H2 */}
          <section className="py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-10 rounded-3xl border border-purple-500/30 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center justify-center gap-3">
                  <HelpCircle className="w-8 h-8 text-purple-400" />
                  Sıkça Sorulan Sorular
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Paket seçiminden kuruluma, yayın kalitesinden ödeme seçeneklerine kadar aklınıza takılan her konuda size yardımcı olmaya hazırız. Daha fazla bilgi almak için sıkça sorulan sorular sayfamıza göz atabilir veya destek ekibimize anında ulaşabilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/sss"
                    className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Info className="w-5 h-5" />
                    Tüm Soruları İncele
                  </Link>
                  <a 
                    href={`https://wa.me/${safeSiteData.contactData?.whatsapp?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-5 h-5" />
                    WhatsApp'tan Destek Al
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer 
          contactData={safeSiteData.contactData} 
          siteData={safeSiteData} 
        />
        
        {safeSiteData.chatBotData?.enabled && (
             <ChatBot 
                chatData={safeSiteData.chatBotData} 
                contactData={safeSiteData.contactData} 
             />
        )}
      </div>
    </>
  );
};

export default memo(PackagesPage);
