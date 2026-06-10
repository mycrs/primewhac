import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { defaultData } from '@/data/defaultSiteData';
import InternalLinkingHelper from '@/components/InternalLinkingHelper';
import { Tv, Monitor, Wifi, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GuidePage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || defaultData;
  
  const metadata = {
    title: "IPTV İzleme Rehberi | Kurulum ve Kullanım Kılavuzu",
    description: "IPTV nasıl izlenir? Adım adım kurulum rehberi, cihaz ayarları ve kullanım ipuçları. Tüm cihazlarda IPTV kullanımı öğren.",
    keywords: ["IPTV izleme rehberi", "IPTV nasıl izlenir", "IPTV kurulum rehberi", "IPTV cihaz kurulumu", "IPTV kullanım kılavuzu"],
  };

  return (
    <>
      <SEOHead {...metadata} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <article className="container mx-auto max-w-4xl bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12 shadow-2xl">
            <header className="mb-12 text-center">
              <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-full text-xs font-bold tracking-wider uppercase mb-6">
                TEKNİK REHBER
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] via-[#e50914] to-[#b20710]">
                IPTV İzleme Rehberi | Kurulum ve Kullanım Kılavuzu
              </h1>
              <div className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-3xl mx-auto bg-[#0a0a0a]/50 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm text-left">
                <p>
                  Televizyon yayıncılığının geleceği olan dijital yayın dünyasına hoş geldiniz. Hazırladığımız bu kapsamlı <strong>IPTV izleme rehberi</strong> ile evinizdeki eğlence anlayışını tamamen değiştirecek adımları keşfedeceksiniz. Birçok kullanıcının aklındaki en temel soru olan <strong>IPTV nasıl izlenir</strong> sorusunun yanıtını, teknik detaylara boğulmadan, en anlaşılır ve pratik şekilde bu sayfada bulacaksınız.
                </p>
                <p className="mt-4">
                  Sıfırdan başlayanlar ve sistemini iyileştirmek isteyenler için özel olarak derlediğimiz bu <strong>IPTV kullanım kılavuzu</strong>, sahip olduğunuz tüm cihazlarda en yüksek görüntü kalitesini ve en stabil yayın akışını elde etmenizi sağlayacak. Doğru yapılandırılmış bir sistemle donma, takılma veya kesinti sorunlarını geride bırakarak, 10.000+ kanallık sınırsız bir medya kütüphanesinin keyfini sürebilirsiniz.
                </p>
              </div>
            </header>

            <div className="prose prose-invert max-w-none prose-lg prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-white prose-headings:to-[#141414] prose-a:text-primary">
              <h2 className="text-3xl font-bold mt-12 mb-6 border-b border-slate-800 pb-4">IPTV Nedir ve Sistem Nasıl Çalışır?</h2>
              <p>
                <strong>IPTV (Internet Protocol Television)</strong>, klasik anten, çanak uydu veya analog kablolu televizyon altyapılarının aksine, televizyon kanallarını ve medya içeriklerini (film, dizi, belgesel) doğrudan genişbant internet bağlantınız üzerinden cihazınıza aktaran modern bir teknolojidir. Bu teknoloji, televizyon yayınlarını dijital veri paketlerine dönüştürerek sunuculardan anlık olarak ekranınıza iletir.
              </p>
              <p>
                Bu sistemin en büyük avantajı sunduğu devasa özgürlüktür. İçerikleri yalnızca yayınlandığı saatte değil, dilediğiniz zaman &quot;İsteğe Bağlı Video&quot; (VOD - Video on Demand) özelliğiyle izleyebilirsiniz. Dünyanın öbür ucundaki bir spor müsabakasından, vizyondan yeni çıkmış ödüllü bir filme kadar yüz binlerce içerik tek bir tık uzağınızdadır. <strong>IPTV nasıl izlenir</strong> diye merak ediyorsanız, temel ihtiyaçlarınız oldukça basittir: Stabil ve hızlı bir internet bağlantısı, yayını oynatabilecek kapasitede akıllı bir cihaz (televizyon, bilgisayar veya mobil cihaz) ve bu yayını çözecek lisanslı bir medya oynatıcı uygulama.
              </p>
              <p>
                İnternet altyapınızın kalitesi, izleme deneyiminizi doğrudan belirler. Yüksek çözünürlüklü 4K (UHD) veya 1080p (FHD) kalitesindeki yayınların veri paketleri oldukça büyüktür ve bu paketlerin cihazınıza zamanında ulaşması gerekir. Bu sebeple <strong>IPTV kurulum rehberi</strong> aşamalarında her zaman ilk vurguladığımız nokta bağlantı optimizasyonudur.
              </p>

              <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                <div className="p-8 bg-[#0a0a0a]/80 rounded-2xl border border-slate-800 text-center hover:border-blue-500/50 transition-colors duration-300 shadow-lg">
                  <div className="w-16 h-16 bg-[#141414]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Wifi className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-white">İnternet Gereksinimi</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Kesintisiz ve takılmasız HD yayınlar için minimum 16 Mbps, 4K Ultra HD kalitesi için ise en az 50 Mbps sabit ve kotasız bir indirme (download) hızı önerilmektedir.</p>
                </div>
                <div className="p-8 bg-[#0a0a0a]/80 rounded-2xl border border-slate-800 text-center hover:border-green-500/50 transition-colors duration-300 shadow-lg">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Tv className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-white">Geniş Cihaz Desteği</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Yeni nesil Smart TV&apos;ler, Android TV Box cihazları, Apple TV, akıllı telefonlar, tabletler ve bilgisayarlar ile %100 tam uyumlu ve platform bağımsız çalışma imkanı.</p>
                </div>
                <div className="p-8 bg-[#0a0a0a]/80 rounded-2xl border border-slate-800 text-center hover:border-primary/50 transition-colors duration-300 shadow-lg">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Monitor className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-white">Uygulama İhtiyacı</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">Yayınları görüntüleyebilmek için IPTV Smarters Pro, XCIPTV, TiviMate veya IBO Player gibi güvenilir ve lisanslı medya oynatıcı uygulamalara ihtiyaç duyulur.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold mt-16 mb-6 border-b border-slate-800 pb-4">Adım Adım IPTV Cihaz Kurulumu</h2>
              <p>
                Sistemin temel çalışma mantığını kavradıktan sonra, sıradaki ve en önemli aşama cihaz entegrasyonudur. Kusursuz bir <strong>IPTV cihaz kurulumu</strong>, ilerleyen süreçte yaşanabilecek senkronizasyon ve kalite düşüşü sorunlarını en başından önler. Çoğu kullanıcı teknik işlemlerden çekinse de, modern uygulamalar sayesinde bu süreç son derece kolaylaştırılmıştır.
              </p>
              <p>
                Kuruluma başlamadan önce küçük ama hayati bir ipucu: Televizyonunuzu veya TV kutunuzu modeminize kablosuz (Wi-Fi) bağlamak yerine, daima kaliteli bir Cat6 Ethernet kablosu ile kablolu olarak bağlamayı tercih edin. Kablolu bağlantı, Wi-Fi&apos;ın doğasından kaynaklanan sinyal zayıflamalarını ve veri paketi kayıplarını sıfıra indirir. Eğer mutlaka Wi-Fi kullanmanız gerekiyorsa, modeminizin daha yüksek veri taşıma kapasitesine sahip olan 5GHz bandını kullanın.
              </p>
              <p>
                Farklı donanımlar ve işletim sistemleri için hazırladığımız bu detaylı <strong>IPTV kurulum rehberi</strong> adımlarını takip ederek sisteminizi saniyeler içinde yayına hazır hale getirebilirsiniz:
              </p>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-blue-400">1. Smart TV Kurulumu (Samsung Tizen &amp; LG WebOS)</h3>
              <p>
                Evinizdeki modern akıllı televizyonlar (Smart TV), herhangi bir ek uydu alıcısına veya kutuya ihtiyaç duymadan yüksek kaliteli yayınları doğrudan işleyip oynatabilir. Bu televizyonlarda kurulum süreci, mağazadan sıradan bir uygulama indirmek kadar zahmetsizdir:
              </p>
              <ol className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800 space-y-3 marker:text-blue-500">
                <li>Televizyonunuzun kumandasından resmi uygulama mağazasına (Samsung için Smart Hub / Apps, LG için Content Store) giriş yapın.</li>
                <li>Arama (büyüteç) bölümüne girerek <strong>&quot;IPTV Smarters Pro&quot;</strong>, <strong>&quot;IBO Player&quot;</strong> veya <strong>&quot;Flix IPTV&quot;</strong> yazıp popüler ve yüksek puanlı uygulamalardan birini cihazınıza indirin ve kurun.</li>
                <li>Uygulamayı ilk kez açtığınızda ekranda uygulamanın cihazınıza atadığı benzersiz bir &quot;MAC Adresi&quot; (Device ID) veya eşleştirme kodu belirecektir. Bu bilgiyi not alın.</li>
                <li>Bilgisayarınızdan veya telefonunuzdan indirdiğiniz uygulamanın resmi web sitesine (yönetim paneline) giderek, not aldığınız MAC adresi üzerinden size aboneliğinizle birlikte verilen M3U yayın bağlantı linkini (URL) sisteme yükleyin (upload playlist).</li>
                <li>Televizyonunuzdaki uygulamayı tamamen kapatıp yeniden açın. 10.000+ kanallık güncel listenizin ve VOD içeriklerinin kategoriler halinde yüklendiğini göreceksiniz.</li>
              </ol>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-green-400">2. Android Telefon, Tablet ve TV Box Kurulumu</h3>
              <p>
                Android işletim sisteminin açık yapısı, medya oynatıcı seçimi konusunda büyük bir özgürlük sağlar. Özellikle Xiaomi Mi Box, Nvidia Shield veya Amazon Fire TV Stick gibi Android tabanlı cihazlarda donanım ivmelendirme yetenekleri üst seviyededir. Kesintisiz bir deneyim için şu adımları izleyin:
              </p>
              <ol className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800 space-y-3 marker:text-green-500">
                <li>Android cihazınızdan Google Play Store&apos;u (veya desteklenen diğer resmi mağazaları) açın.</li>
                <li>Yüksek performanslı ve stabil oynatıcılar olan <strong>&quot;XCIPTV Player&quot;</strong>, <strong>&quot;TiviMate IPTV Player&quot;</strong> veya <strong>&quot;Televizo&quot;</strong> uygulamalarından birini aratıp yükleyin.</li>
                <li>Uygulamayı çalıştırın. Çoğu modern uygulamada karşınıza çıkacak olan <strong>&quot;Xtream Codes API ile Giriş Yap&quot;</strong> seçeneğini işaretleyin.</li>
                <li>Size SMS, WhatsApp veya e-posta yoluyla iletilen; Sunucu URL (Host adresi), Kullanıcı Adı (Username) ve Şifre (Password) bilgilerinizi eksiksiz ve boşluk bırakmadan ilgili kutucuklara yazın.</li>
                <li>&quot;Giriş&quot; (Login) butonuna tıklayın. Uygulamanın ayarlar (Settings) menüsüne girerek video oynatma kısmından <strong>&quot;Donanım Hızlandırma&quot; (Hardware Decoding)</strong> seçeneğini mutlaka aktif konuma getirin. Bu işlem kanal geçişlerini hızlandırır.</li>
              </ol>

              <h3 className="text-2xl font-bold mt-12 mb-4 text-primary">3. Bilgisayar (Windows PC ve Mac) Kurulumu</h3>
              <p>
                İş yerinizde, çalışma masanızda veya seyahat esnasında dizüstü bilgisayarınızdan yayınlara bağlanmak istediğinizde, kullanabileceğiniz güçlü masaüstü yazılımları bulunmaktadır.
              </p>
              <ol className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800 space-y-3 marker:text-primary">
                <li><strong>Özel Yazılım Tercihi:</strong> En kolay yöntem, &quot;IPTV Smarters Pro&quot; uygulamasının bilgisayarlar için özel olarak hazırlanmış Windows (.exe) veya macOS (.dmg) masaüstü versiyonunu kendi resmi sitesinden indirip kurmaktır. Arayüzü televizyondaki ile birebir aynıdır; Xtream giriş bilgilerinizle saniyeler içinde bağlanabilirsiniz.</li>
                <li><strong>VLC Media Player Alternatifi:</strong> Halihazırda bilgisayarınızda dünyaca ünlü VLC Player yüklüyse, programı açın.</li>
                <li>Üst menü çubuğundan &quot;Ortam&quot; (Media) sekmesine tıklayıp açılan menüden &quot;Ağ Akışı Aç...&quot; (Open Network Stream) seçeneğini seçin.</li>
                <li>Size teslim edilen, sonu .m3u veya .m3u8 ile biten tam yayın bağlantı adresini (URL) ekrandaki boş alana yapıştırın.</li>
                <li>&quot;Oynat&quot; butonuna bastığınızda ilk kanal açılacaktır. Kanallar arası geçiş yapmak veya tüm listeyi görmek için &quot;Görünüm &gt; Oynatma Listesi&quot; (Kısayol: CTRL+L veya CMD+L) menüsünü kullanabilirsiniz.</li>
              </ol>

              <div className="bg-yellow-500/10 p-6 rounded-xl border-l-4 border-yellow-500 my-10 not-prose shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-yellow-500" />
                  <h4 className="text-yellow-400 font-bold text-lg m-0">Uzman Kullanıcı İpucu: Bilgi Girişi Hataları</h4>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Kurulum esnasında karşılaşılan bağlantı reddi (login failed) hatalarının <strong>%95&apos;i hatalı bilgi girişinden</strong> kaynaklanmaktadır. Kullanıcı adı veya şifrenizi girerken büyük/küçük harf duyarlılığına mutlaka dikkat edin. Ayrıca klavyede &quot;0&quot; (sıfır) rakamı ile &quot;O&quot; (o harfi) sıklıkla karıştırılır. Mümkünse bilgilerinizi kopyala-yapıştır yaparak cihazınıza aktarın.
                </p>
              </div>

              <h2 className="text-3xl font-bold mt-16 mb-6 border-b border-slate-800 pb-4">Sık Karşılaşılan Sorunlar ve Pratik Çözümleri (SSS)</h2>
              <p>
                Her şeyi kusursuz bir şekilde kurmuş olsanız bile, internetin dalgalı doğası gereği bazen ufak tefek teknik pürüzlerle karşılaşabilirsiniz. Kapsamlı bir <strong>IPTV kullanım kılavuzu</strong>, sorun anında kendi teknik servisiniz olmanızı sağlar. İşte en sık rastlanan durumlar ve profesyonel çözüm adımları:
              </p>
              <ul className="space-y-6 bg-[#0a0a0a]/30 p-6 md:p-8 rounded-xl border border-slate-800 mt-6">
                <li>
                  <strong className="text-blue-400 block mb-2 text-xl">1. Yayınım İzlerken Sürekli Donuyor veya Takılıyor, Ne Yapmalıyım?</strong>
                  Yayın donmalarının en temel sebebi internet hızınızdaki anlık (milisaniyelik) düşüşler veya paket kayıplarıdır. İlk olarak modeminizi fişten çekip 30 saniye bekledikten sonra yeniden takın. Cihazınız Wi-Fi ile bağlıysa modeme daha yakın bir konuma alın veya aradaki engelleri (kalın duvarlar) azaltın. En kesin çözüm ise cihazınızı modeme Ethernet (LAN) kablosu ile bağlamaktır.
                </li>
                <li>
                  <strong className="text-blue-400 block mb-2 text-xl">2. Kanal Listem Yüklenmiyor, Ekran Boş Görünüyor:</strong>
                  Bu durum genellikle cihazın internete bağlanamaması veya abonelik sürenizin dolmasıyla ilgilidir. Bağlantınızı kontrol ettikten sonra uygulamanızın menüsünden &quot;Playlist&apos;i Güncelle&quot; (Refresh / Reload Playlist) butonuna basarak sunucudan güncel listeyi yeniden çekmeye zorlayın. Bazen internet servis sağlayıcıları (ISS) yoğun saatlerde belirli portları engelleyebilir; bu durumda cihazınızda güvenilir bir VPN kullanmak sorunu anında çözer.
                </li>
                <li>
                  <strong className="text-blue-400 block mb-2 text-xl">3. Kanallarda Ses Var Ama Ekranda Görüntü Yok (Siyah Ekran):</strong>
                  Ekranda görüntünün olmaması genellikle uygulamanın yayının video formatını (kodek) çözememesinden kaynaklanır. Kullandığınız medya oynatıcı uygulamanın &quot;Ayarlar&quot; (Settings) kısmına girip &quot;Oynatıcı Motoru&quot; (Player Engine) veya &quot;Decoder&quot; ayarını değiştirin. Örneğin EXO Player&apos;dan VLC Player motoruna geçiş yapmak veya Donanım Hızlandırmayı (Hardware/Software Decoder) değiştirmek bu sorunu giderir.
                </li>
                <li>
                  <strong className="text-blue-400 block mb-2 text-xl">4. Uygulama Çok Yavaş Açılıyor ve Kanallar Geç Değişiyor:</strong>
                  Eğer akıllı televizyonunuzun veya Android kutunuzun belleği (RAM) ve depolama alanı dolmuşsa cihaz hantallaşır. Cihazınızın ayarlar menüsüne girerek kullandığınız uygulamanın &quot;Önbelleğini Temizle&quot; (Clear Cache) işlemini uygulayın. Arka planda açık kalan, kullanmadığınız diğer uygulamaları kapatarak cihazınızın işlemcisini rahatlatın.
                </li>
              </ul>
              
              <h2 className="text-3xl font-bold mt-16 mb-6 border-b border-slate-800 pb-4">Sonuç: Sınırsız Eğlence Evrenine Adım Atın</h2>
              <p>
                Sizler için büyük bir titizlikle hazırladığımız bu detaylı <strong>IPTV izleme rehberi</strong> ile dijital yayıncılığın tüm inceliklerini öğrenmiş oldunuz. Artık televizyon izleme deneyiminizin ipleri tamamen sizin elinizde. Doğru bir <strong>IPTV cihaz kurulumu</strong> gerçekleştirerek, geleneksel yayınların sunduğu kısıtlamalardan sonsuza dek kurtulabilirsiniz. 
              </p>
              <p>
                Unutmayın ki; mükemmel bir televizyon keyfi, kaliteli bir internet altyapısı, uygun donanım ve bu rehberde paylaştığımız ipuçlarının doğru uygulanmasıyla ortaya çıkar. Geriye sadece en sevdiğiniz çerezi hazırlamak, rahat koltuğunuza kurulmak ve dünya çapındaki 10.000+ kanalın, binlerce filmin tadını çıkarmak kalıyor. Keyifli seyirler dileriz!
              </p>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-800 bg-[#0a0a0a]/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Sınırsız Premium Eğlenceye Hazır Mısınız?</h3>
                <p className="text-slate-400 text-lg">
                  Rehberimizdeki bilgileri hemen pratiğe dökün. Size en uygun paketi seçin ve yeni nesil televizyon deneyimini yaşamaya bugün başlayın.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                <Link to="/paketler" className="flex-1 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white text-center py-4 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                  <Tv className="w-5 h-5" /> Paketleri İncele
                </Link>
                <Link to="/kurulum" className="flex-1 bg-[#0a0a0a] hover:bg-[#0a0a0a] text-white text-center py-4 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border border-slate-700 shadow-lg flex items-center justify-center gap-2">
                  <Monitor className="w-5 h-5" /> Cihaz Rehberleri
                </Link>
              </div>
            </div>

            <section className="mt-16 bg-[#0a0a0a]/50 p-8 rounded-2xl border border-slate-800">
              <h2 className="text-2xl font-bold mb-8 text-white text-center">İlgili İçerikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/paketler" className="p-4 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] border border-slate-800 rounded-xl transition-colors flex items-center justify-between group">
                  <span className="text-slate-300 group-hover:text-white">Paketleri İncele</span>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </Link>
                <Link to="/kurulum" className="p-4 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] border border-slate-800 rounded-xl transition-colors flex items-center justify-between group">
                  <span className="text-slate-300 group-hover:text-white">Kurulum Rehberi</span>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </Link>
                <Link to="/sss" className="p-4 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] border border-slate-800 rounded-xl transition-colors flex items-center justify-between group">
                  <span className="text-slate-300 group-hover:text-white">Sık Sorulan Sorular (SSS)</span>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </Link>
                <Link to="/karsilastirma" className="p-4 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] border border-slate-800 rounded-xl transition-colors flex items-center justify-between group">
                  <span className="text-slate-300 group-hover:text-white">Paketleri Karşılaştır</span>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </Link>
                <Link to="/guide/iptv-kurulum-rehberi" className="md:col-span-2 p-4 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] border border-slate-800 rounded-xl transition-colors flex items-center justify-between group">
                  <span className="text-slate-300 group-hover:text-white">Detaylı Kurulum Rehberi</span>
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </Link>
              </div>
            </section>

            <InternalLinkingHelper currentPage="/guide/iptv-kurulum-rehberi" />
          </article>
        </main>

        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default GuidePage;