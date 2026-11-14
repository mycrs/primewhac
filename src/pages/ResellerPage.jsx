
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import SEOHead from '@/components/SEOHead';
import { resellerPageSchemas } from '@/utils/seoSchema';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Wallet, Shield, TrendingUp, Award, Clapperboard, 
  CheckCircle, Rocket, MessageCircle, ArrowRight, Star, Zap, Wrench, 
  Megaphone, Headphones, HelpCircle 
} from 'lucide-react';
import ResellerCalculatorSection from '@/components/ResellerCalculatorSection';
import { openSupportWhatsApp } from '@/utils/supportChannel';
import { SITE_URL } from '@/constants/siteUrl';

const iconMap = {
  LayoutDashboard,
  Wallet,
  Shield,
  TrendingUp,
  Award,
  Clapperboard
};

const ResellerPage = ({ siteData }) => {
  const { resellerData, contactData, siteTexts, chatBotData, packagesData } = siteData;
  // Link DOM'a yazılmaz; numara runtime'da çözülür ve yalnızca tıklamada açılır.
  const openResellerContact = () =>
    openSupportWhatsApp({
      siteData,
      contactData,
      message: 'IPTV Bayilik programı hakkında bilgi almak istiyorum.',
    });
  
  const metadata = {
    title: "IPTV Bayilik (Reseller) Programı: Kendi İşinizi Kurun | QruzeTV",
    description: "IPTV bayilik (reseller) programımızla kendi işinizi kurun. En gelişmiş kontrol paneli ve yüksek kazanç oranları ile hemen başlayın.",
    keywords: ["iptv bayilik", "iptv reseller", "iptv panel satışı", "iptv bayilik fiyatları", "iptv iş ortaklığı"],
    ogType: "website",
    ogImage: `${SITE_URL}/og/bayilik.jpg`,
  };
  const jsonLd = resellerPageSchemas(metadata);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const defaultFeatures = [
    { 
      id: 1, 
      title: "Kullanıcı Dostu Panel", 
      description: "Müşterilerinizi ve aboneliklerinizi hızlı, pratik ve verimli bir şekilde yönetmenizi sağlayan yenilikçi kontrol paneli.", 
      icon: "LayoutDashboard" 
    },
    { 
      id: 2, 
      title: "Esnek Kredi Sistemi", 
      description: "İhtiyacınız kadar kredi satın alın ve dilediğiniz gibi kullanın. Stok maliyeti olmadan satış yapın.", 
      icon: "Wallet" 
    },
    { 
      id: 3, 
      title: "7/24 Teknik Destek", 
      description: "Bayilerimize özel, öncelikli teknik destek ve her türlü sorunda anında çözüm ortağı.", 
      icon: "Shield" 
    },
    { 
      id: 4, 
      title: "Yüksek Kâr Marjı", 
      description: "Sektördeki en rekabetçi fiyatlarla gelirinizi maksimize edin ve hızla büyüyün.", 
      icon: "TrendingUp" 
    },
    { 
      id: 5, 
      title: "Markalaşma İmkanı", 
      description: "Kendi markanız altında satış yapma özgürlüğü ve özelleştirilebilir DNS seçenekleri.", 
      icon: "Award" 
    },
    { 
      id: 6, 
      title: "Sürekli Güncel İçerik", 
      description: "10.000+ kanal, güncel film ve dizi arşivi ile müşterilerinizi her zaman memnun edin.", 
      icon: "Clapperboard" 
    }
  ];

  const featuresToDisplay = defaultFeatures;

  const contentCards = [
    {
      title: "Neden IPTV Bayilik?",
      icon: Rocket,
      bgClass: "from-[#e50914]/10 to-[#b20710]/10",
      borderClass: "border-primary/30 hover:border-primary",
      shadowClass: "hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]",
      iconBgClass: "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white",
      textGradient: "from-[#e50914] to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Girişimcilerin <strong>IPTV bayilik</strong> sistemine yönelmesinin en temel nedeni, dijital içerik tüketimindeki muazzam artıştır. İnsanlar artık istedikleri içeriğe, istedikleri cihazdan ve istedikleri zaman ulaşmak istiyor. İyi bir <strong>IPTV hizmet sağlayıcı</strong> olmak, bu büyük talebe doğrudan ve kârlı bir şekilde yanıt vermek anlamına gelir. Müşterilerinize sunacağınız <strong>kesintisiz IPTV</strong> deneyimi, işletmenizin hızla büyümesini ve kulaktan kulağa yayılmasını sağlar.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Sıfırdan bir yayın altyapısı kurmak milyonlarca dolarlık bir yatırım gerektirirken, bizim güçlü <strong>IPTV altyapısı</strong> ve yüksek kapasiteli <strong>IPTV sunucusu</strong> ağımız sayesinde siz sadece satışa odaklanırsınız. Fiziksel bir ürün stoklama, kargo süreçleri veya depo kiralama gibi dertleriniz olmaz. Her şey tamamen dijital ortamda saniyeler içinde gerçekleşir. Minimum işletme maliyetiyle maksimum verim elde etmenizi sağlayan bu sistem, kısa sürede yatırımlarınızın geri dönüşünü almanıza (ROI) olanak tanır.</p>
        </>
      )
    },
    {
      title: "IPTV Bayilik Avantajları",
      icon: Star,
      bgClass: "from-[#e50914]/10 to-[#b20710]/10",
      borderClass: "border-blue-500/30 hover:border-blue-400",
      shadowClass: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
      iconBgClass: "bg-[#141414]/20 text-blue-400 group-hover:bg-[#141414] group-hover:text-white",
      textGradient: "from-[#e50914] to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Bir <strong>IPTV bayisi</strong> olmanın avantajları saymakla bitmez. En büyük ayrıcalık, kendi belirlediğiniz fiyat politikasıyla özgürce çalışabilmenizdir. Size sunulan esnek kredi sistemi sayesinde, dilediğiniz gibi paketler oluşturabilir ve kampanyalar düzenleyebilirsiniz. Gelişmiş <strong>IPTV müşteri yönetimi</strong> sistemimiz, abonelik sürelerinin takibini, otomatik hatırlatmaları ve yenileme süreçlerini sizin için son derece kolay bir hale getirir.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Geniş içerik yelpazemiz sayesinde müşterilerinize <strong>Dijital TV bayilik</strong>, <strong>İnternet TV bayilik</strong>, ve <strong>Streaming TV bayilik</strong> gibi farklı konseptlerde hizmetler sunabilirsiniz. Paketin içinde yer alan on binlerce içerik sayesinde, hem yerel hem de küresel izleyici kitlesine hitap edersiniz. Yüksek çözünürlüklü yayın kalitesi (4K/FHD), güçlü donanım desteği ve platform bağımsız (Smart TV, Android, iOS, PC) çalışma özelliği, satış yapmanızı inanılmaz derecede kolaylaştırır.</p>
        </>
      )
    },
    {
      title: "Nasıl Başlanır?",
      icon: Zap,
      bgClass: "from-orange-500/10 to-yellow-500/10",
      borderClass: "border-orange-500/30 hover:border-orange-400",
      shadowClass: "hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]",
      iconBgClass: "bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white",
      textGradient: "from-orange-400 to-yellow-400",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium"><strong>IPTV başlangıç</strong> süreci son derece hızlı ve basittir. Bizimle iletişime geçtikten sonra, ihtiyaçlarınıza ve hedeflerinize en uygun bayilik paketini seçersiniz. Hesabınız saniyeler içinde onaylanır ve size özel bir <strong>IPTV paneli</strong> tahsis edilir. Bu panel üzerinden hemen kredilerinizi yükleyebilir ve ilk müşterinize saniyeler içinde test yayını veya tam abonelik açabilirsiniz. Hiçbir teknik bilgiye veya kodlama becerisine ihtiyacınız yoktur.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Başarılı bir <strong>IPTV işletme</strong> kurmanın ilk adımı, doğru kitleyi belirlemektir. Yeni bayilerimiz için hazırladığımız başlangıç rehberleri ve eğitim materyalleri, sistemin nasıl kullanılacağından satış stratejilerine kadar her detayı kapsar. Müşterilerinize sunacağınız <strong>IPTV abonelik</strong> seçeneklerini belirlerken, pazar analizlerine dayanarak rekabetçi bir fiyatlandırma stratejisi oluşturmanız konusunda size rehberlik ediyoruz. Hemen bugün ilk adımınızı atarak dijital dünyanın kazananları arasında yerinizi alabilirsiniz.</p>
        </>
      )
    },
    {
      title: "Gelir Potansiyeli",
      icon: TrendingUp,
      bgClass: "from-green-500/10 to-[#b20710]/10",
      borderClass: "border-green-500/30 hover:border-green-400",
      shadowClass: "hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]",
      iconBgClass: "bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-white",
      textGradient: "from-green-400 to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium"><strong>IPTV gelir</strong> potansiyeli tamamen sizin vizyonunuza ve çabanıza bağlıdır. Esnek kâr marjları sayesinde, satılan her paketten %100'den %300'e kadar <strong>IPTV kâr</strong> elde etmeniz mümkündür. Müşteri sayınız arttıkça ve yenileme oranlarınız yükseldikçe, aydan aya katlanan pasif bir gelir modeline kavuşursunuz. Başarılı bir <strong>IPTV satış</strong> stratejisiyle, sadece birkaç ay içinde tam zamanlı işinizin gelirini geride bırakabilirsiniz.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Bu sektördeki en büyük avantaj, "tekrar eden gelir" (recurring revenue) modelidir. Memnun kalan bir müşteri aboneliğini her yıl veya her ay yenileyecektir. Portföyünüze ekleyeceğiniz <strong>Canlı TV bayilik</strong>, <strong>TV kanalları bayilik</strong>, <strong>Spor kanalları bayilik</strong> ve <strong>Haber kanalları bayilik</strong> gibi alt kategorilerle hitap ettiğiniz kitleyi genişletebilirsiniz. Özel maç günleri veya vizyona yeni giren dizilerin olduğu dönemlerde satışlarınızda büyük patlamalar yaşamanız son derece olağandır.</p>
        </>
      )
    },
    {
      title: "Teknik Destek",
      icon: Wrench,
      bgClass: "from-[#e50914]/10 to-[#b20710]/10",
      borderClass: "border-[#e50914]/30 hover:border-[#e50914]/60",
      shadowClass: "hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]",
      iconBgClass: "bg-[#141414]/20 text-[#e50914] group-hover:bg-[#141414] group-hover:text-white",
      textGradient: "from-[#e50914] to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Başarılı bir bayilik ağının arkasında her zaman güçlü ve erişilebilir bir teknik destek ekibi bulunur. Olası tüm altyapı sorunları, yayın kesintileri veya sunucu güncellemeleri uzman mühendislerimiz tarafından 7/24 proaktif olarak takip edilir. Böylece sizin teknik detaylarla boğuşmanıza gerek kalmaz. <strong>Kesintisiz IPTV</strong> deneyimini garanti altına almak için en son teknolojiyi kullanan yedekli sunucularla çalışıyoruz.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Bayilerimize özel destek kanallarımız üzerinden, müşteri kurulumlarında yaşayabileceğiniz zorluklarda anında yardım alabilirsiniz. Mac adresine göre cihaz kurulumları, m3u link yapılandırmaları ve Xtream API kullanımları hakkında hazırladığımız detaylı dökümantasyonlar sayesinde, siz de müşterilerinize profesyonel teknik destek sunabilirsiniz. Güçlü bir <strong>IPTV altyapısı</strong> arkanızda olduğu sürece, müşterilerinizle sadece yeni abonelikler ve satışlar üzerine konuşursunuz.</p>
        </>
      )
    },
    {
      title: "Pazarlama Desteği",
      icon: Megaphone,
      bgClass: "from-[#e50914]/10 to-rose-500/10",
      borderClass: "border-[#e50914]/30 hover:border-[#ff2430]",
      shadowClass: "hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]",
      iconBgClass: "bg-[#e50914]/20 text-[#ff3b45] group-hover:bg-[#e50914] group-hover:text-white",
      textGradient: "from-[#e50914] to-rose-400",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Üstün bir ürüne sahip olmak yeterli değildir; onu doğru şekilde pazarlamak gerekir. <strong>IPTV pazarlama</strong> konusunda iş ortaklarımıza sunduğumuz rehberlik, onların sektörde öne çıkmasını sağlar. Doğru sosyal medya stratejileri, SEO taktikleri ve hedeflenmiş reklam kampanyaları ile nasıl daha fazla müşteriye ulaşabileceğinizi sizlerle paylaşıyoruz. Markanızı bir <strong>IPTV franchise</strong> kalitesinde konumlandırmanız için gerekli tüm görsel materyalleri sağlıyoruz.</p>
          <p className="text-slate-300 leading-relaxed font-medium"><strong>Eğlence kanalları bayilik</strong> ve <strong>Uluslararası kanallar bayilik</strong> gibi spesifik niş alanlara odaklanarak pazarlama stratejinizi çeşitlendirebilirsiniz. Gurbetçi vatandaşlara yönelik özel kampanyalar veya sadece spor içeriklerine odaklanan paketler tasarlayarak hedef kitlenizi daraltıp dönüşüm oranlarınızı artırabilirsiniz. <strong>White Label IPTV</strong> özelliğimizle, tamamen size ait bir marka algısı yaratarak kendi sadık müşteri kitlenizi oluşturmanız çok daha kolay olacaktır.</p>
        </>
      )
    },
    {
      title: "Müşteri Hizmetleri",
      icon: Headphones,
      bgClass: "from-[#e50914]/10 to-[#b20710]/10",
      borderClass: "border-[#e50914]/30 hover:border-[#e50914]",
      shadowClass: "hover:shadow-[0_0_30px_rgba(229,9,20,0.3)]",
      iconBgClass: "bg-[#e50914]/20 text-[#e50914] group-hover:bg-[#e50914] group-hover:text-white",
      textGradient: "from-[#e50914] to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Müşteri elde tutma oranı (retention rate), <strong>IPTV işletme</strong> kârlılığını belirleyen en önemli faktördür. İyi yapılandırılmış bir <strong>IPTV müşteri yönetimi</strong>, yenileme dönemlerini kaçırmamanızı ve müşterilerinizle sürekli iletişim halinde kalmanızı sağlar. Panelin sunduğu otomasyon özellikleri sayesinde, abonelik bitimine yaklaşan kullanıcılara otomatik hatırlatmalar gönderebilirsiniz. Müşterilerinizle WhatsApp veya Telegram üzerinden hızlı ve etkili bir iletişim kurmak satışlarınızı doğrudan artırır.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Sunduğumuz yüksek kaliteli yayınlar ve sıfır donma politikamız sayesinde şikayet oranlarınız minimum düzeyde kalacaktır. Bir <strong>IPTV abonelik</strong> sürecinde müşterinin en çok değer verdiği şey güvendir. Ücretsiz test yayınları açarak müşterinizin sistemi denemesine olanak tanımak, kapanan satış oranlarını inanılmaz ölçüde artırır. Müşteri memnuniyetini en üst düzeye çıkaran bayilerimiz, sadece yeni satışlardan değil, referans yoluyla gelen müşterilerden de büyük kazançlar elde etmektedir.</p>
        </>
      )
    },
    {
      title: "Başarı Hikayeleri",
      icon: Award,
      bgClass: "from-amber-500/10 to-orange-500/10",
      borderClass: "border-amber-500/30 hover:border-amber-400",
      shadowClass: "hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      iconBgClass: "bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
      textGradient: "from-amber-400 to-orange-400",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Sıfır sermaye ile başlayıp sadece birkaç ay içinde binlerce aktif aboneye ulaşan bayilerimizin hikayeleri en büyük motivasyon kaynağımızdır. Doğru <strong>IPTV yatırım</strong> stratejisi ve disiplinli bir çalışma ile öğrenci, ev hanımı veya ek gelir arayan profesyoneller kendi işlerinin patronu oldular. <strong>IPTV ortaklık</strong> programımız, herkesin eşit şartlarda rekabet edebileceği, emeğinin karşılığını fazlasıyla alabileceği adil bir sistem üzerine kuruludur.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Bir bayimiz, sadece çevresindeki spor tutkunlarına yönelerek başlattığı küçük işletmesini, bugün 3 farklı ülkede satış yapan uluslararası bir platforma dönüştürdü. Başarının sırrı, istikrar, doğru iletişim ve güvenilir bir <strong>IPTV sunucusu</strong> sağlayıcısı ile çalışmaktır. Siz de bu başarı hikayelerinden biri olabilir, dijital dünyanın sunduğu sınırsız fırsatlardan payınızı alabilirsiniz. Kendi markanızı yaratarak bağımsızlığınızı ilan etmek tamamen sizin elinizde.</p>
        </>
      )
    },
    {
      title: "Sıkça Sorulan Sorular",
      icon: HelpCircle,
      bgClass: "from-[#e50914]/10 to-[#b20710]/10",
      borderClass: "border-[#e50914]/30 hover:border-[#e50914]",
      shadowClass: "hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]",
      iconBgClass: "bg-[#e50914]/20 text-white group-hover:bg-[#e50914] group-hover:text-white",
      textGradient: "from-[#e50914] to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Yeni bir işe başlarken akılda soru işaretleri olması son derece doğaldır. "Teknik bilgiye ihtiyacım var mı?" Hayır, size sunduğumuz <strong>IPTV paneli</strong> son derece kullanıcı dostudur ve eğitim gerektirmez. "Ne kadar kazanabilirim?" <strong>IPTV kâr</strong> oranları tamamen sizin satış fiyatlarınıza bağlıdır, ancak sektör ortalaması %200 civarındadır. "Fiyatlarımı kendim belirleyebilir miyim?" Evet, kendi satış fiyatlarınızı tamamen özgürce belirleyebilirsiniz.</p>
          <p className="text-slate-300 leading-relaxed font-medium">"Yurtdışına satış yapabilir miyim?" Evet, altyapımız tüm dünya genelinde sorunsuz çalışmaktadır. <strong>Uluslararası kanallar bayilik</strong> avantajıyla dünyanın her yerindeki gurbetçilere veya yabancı müşterilere satış yapabilirsiniz. "Kendi logomu kullanabilir miyim?" <strong>White Label IPTV</strong> desteğimiz sayesinde evet, müşterileriniz sadece sizin markanızı görecektir. Tüm sorularınız ve detaylı bilgi için 7/24 bizimle iletişime geçmekten çekinmeyin.</p>
        </>
      )
    },
    {
      title: "Sonuç",
      icon: CheckCircle,
      bgClass: "from-[#e50914]/10 to-[#b20710]/10",
      borderClass: "border-primary/30 hover:border-primary",
      shadowClass: "hover:shadow-[0_0_30px_rgba(229, 9, 20,0.3)]",
      iconBgClass: "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white",
      textGradient: "from-[#e50914] to-[#b20710]",
      content: (
        <>
          <p className="mb-4 text-slate-300 leading-relaxed font-medium">Özetlemek gerekirse, doğru adımlar atıldığında <strong>IPTV bayilik</strong>, günümüzün en kârlı, en düşük riskli ve en hızlı büyüyen dijital iş modellerinden biridir. Yüksek kaliteli <strong>Kesintisiz IPTV</strong> hizmetini arkasına alan bir <strong>IPTV bayisi</strong>, sınırların olmadığı küresel bir pazarda ticaret yapma özgürlüğüne kavuşur. Sağladığımız güçlü <strong>IPTV altyapısı</strong>, esnek bayi paneli ve profesyonel teknik destek ile kendi başarı hikayenizi yazmanız için ihtiyacınız olan her şeye sahibiz.</p>
          <p className="text-slate-300 leading-relaxed font-medium">Bugün bir karar verin ve kendi işinizin patronu olmak için ilk adımı atın. Düşük bir bütçe ile yüksek <strong>IPTV gelir</strong> elde edebileceğiniz bu fırsatı kaçırmayın. Hemen bizimle iletişime geçin, size en uygun bayilik paketini birlikte seçelim ve satışlara bugün başlayın. Başarının anahtarı, güvenilir bir iş ortağı ile yola çıkmaktır; biz, bu yolda en güçlü destekçiniz olmaya hazırız.</p>
        </>
      )
    }
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans">
        <Header contactData={contactData} />
        
        <main className="flex-grow pt-24 pb-0 text-white">
          <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm">
                 <span className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-primary" /> Bayilik Programı
                 </span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                IPTV Bayilik Fırsatı - Yüksek Kâr Marjı ile Kendi İşini Kur
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light mb-10">
                Dünya standartlarında IPTV hizmetlerini yeniden satarak ek gelir elde edin veya kendi büyük işletmenizi kurun.
              </p>
              
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary text-white font-bold h-14 px-10 rounded-xl text-lg shadow-lg shadow-primary/40 hover:scale-105 transition-all duration-300"
                onClick={openResellerContact}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Şimdi Başvur
              </Button>
            </motion.div>
          </section>

          <ResellerCalculatorSection />

          {/* SEO Optimized Content Grid Section */}
          <section className="py-20 bg-[#0a0512] relative z-10">
            <div className="container mx-auto px-4 max-w-7xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {contentCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                        viewport={{ once: true }}
                        className={`bg-gradient-to-br ${card.bgClass} p-6 md:p-8 rounded-2xl border-2 ${card.borderClass} transition-all duration-300 hover:scale-105 ${card.shadowClass} flex flex-col group`}
                      >
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 shadow-inner ${card.iconBgClass}`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${card.textGradient} tracking-tight`}>
                                {card.title}
                            </h3>
                        </div>
                        <div className="flex-grow">
                           {card.content}
                        </div>
                      </motion.div>
                    );
                  })}
               </div>
            </div>
          </section>

          <section className="py-16 bg-[#0c0518] border-y border-white/5 relative z-10">
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto prose prose-invert prose prose-lg prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary"
              >
                <div className="text-gray-300 space-y-6 leading-relaxed">
                  <h3 className="text-3xl font-bold mt-12 mb-6 border-b border-white/10 pb-4">IPTV Reseller İşleyişi</h3>
                  <p>
                    Bir bayi olarak, geniş altyapımızı ve sunucularımızı kullanarak kendi adınızla son kullanıcılara abonelik satışı yaparsınız. Siz satış ve pazarlamaya odaklanırken, teknik altyapıyı biz yönetiriz. Size özel panel ile müşterilerinizi saniyeler içinde yönetebilirsiniz.
                  </p>

                  <h3 className="text-3xl font-bold mt-12 mb-6 border-b border-white/10 pb-4">Neden Bizimle Çalışmalısınız?</h3>
                  <p>
                    Stok maliyeti, kargo derdi ve büyük yatırım gereksinimi olmadan hemen işe başlayabilirsiniz. Paket satışlarından elde edilen gelir doğrudan sizin olur. İster aylık ister yıllık hesaplarla gelirinizi her geçen gün artırabilirsiniz. Sektörün en gelişmiş altyapısı ile teknik sorunlarla uğraşmazsınız.
                  </p>

                  <div className="mt-8">
                     <button onClick={openResellerContact} className="font-bold underline text-primary hover:text-primary">Daha fazla bilgi için hemen bizimle iletişime geçin</button>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="relative py-24 bg-[#0a0a0a]/30">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e50914]/5 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                {featuresToDisplay.map((feature, index) => {
                    const Icon = iconMap[feature.icon] || CheckCircle;
                    return (
                    <motion.div
                        key={feature.id || index}
                        variants={itemVariants}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-primary/40 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
                    >
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-inner">
                        <Icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors font-light">{feature.description}</p>
                    </motion.div>
                    );
                })}
                </motion.div>
            </div>
          </section>

          <section className="py-16 bg-[#0a0512] relative z-10">
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto prose prose-invert prose prose-lg prose-headings:text-white prose-a:text-primary"
              >
                <h3 className="text-3xl font-bold mt-12 mb-6 border-b border-white/10 pb-4">IPTV Bayilik Nedir?</h3>
                <p>
                  <strong>IPTV bayilik</strong>, gelişen dijital eğlence dünyasında kendi markanızı yaratarak yüksek kazanç elde edebileceğiniz yenilikçi bir iş modelidir. Geleneksel yayıncılığın yerini alan bu sistem, internet üzerinden yayın sağlayan modern bir altyapıya dayanır. Bir <strong>IPTV reseller</strong> olarak, teknik altyapı maliyetlerine katlanmadan, doğrudan son kullanıcıya hizmet sunabilirsiniz. Dünyanın her yerindeki kullanıcılara ulaşabilme imkanı sunan bu sistem, esnek çalışma saatleri ve lokasyon bağımsızlığı sağlar.
                </p>
                <p>
                  Sistem, size tahsis edilen özel bir <strong>IPTV paneli</strong> üzerinden yönetilir. Bu panel aracılığıyla kendi müşteri ağınızı kurabilir, abonelikleri anlık olarak açıp kapatabilir ve tüm satış süreçlerinizi tek ekrandan kontrol edebilirsiniz. <strong>White Label IPTV</strong> çözümlerimiz sayesinde, müşterileriniz sadece sizin belirlediğiniz marka ismini ve logoyu görür. Bu durum, kurumsal kimliğinizi güçlendirirken, müşteri sadakatini de en üst düzeye çıkarır. Dijital çağın bu kârlı iş modeli, düşük sermaye ile yüksek getiri hedefleyen girişimciler için idealdir.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-20 pb-32">
             <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden p-[2px] bg-gradient-to-r from-[#e50914] via-[#ff2430] to-[#b20710] shadow-2xl shadow-primary/50"
             >
                <div className="bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[22px] p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e50914]/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Başlamaya Hazır Mısınız?</h3>
                        <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">Hemen bizimle iletişime geçin ve bugün kendi IPTV işinizi kurmaya başlayın.</p>
                        <Button 
                            size="lg" 
                            className="bg-white text-primary font-bold hover:bg-primary h-16 px-12 rounded-full text-lg shadow-xl hover:scale-105 transition-all duration-300 border-4 border-primary/20"
                            onClick={openResellerContact}
                        >
                            <MessageCircle className="mr-2 h-6 w-6" />
                            Hemen İletişime Geç
                        </Button>
                    </div>
                </div>
             </motion.div>
          </section>
        </main>
        <Footer contactData={contactData} siteData={siteData} />
        {chatBotData?.enabled && <ChatBot chatData={chatBotData} contactData={contactData} siteTexts={siteTexts} />}
      </div>
    </>
  );
};

export default ResellerPage;
