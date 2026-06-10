
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Tv, Zap, Shield, Users, CheckCircle2, Star } from 'lucide-react';
import HomePageVideoSection from '@/components/HomePageVideoSection';
import { useTestModal } from '@/contexts/TestModalContext';

const HomePageSeoContent = ({ siteData }) => {
  const { openTestModal } = useTestModal();

  return (
    <div className="container mx-auto px-4 py-16 text-slate-300 leading-relaxed">
      <article className="max-w-5xl mx-auto">
        
        <header className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Premium IPTV – <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710]">4K Kalitesinde</span> Kesintisiz Yayınlar
          </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Türkiye'nin en iyi IPTV deneyimi ile <span className="text-primary/90">kristal netliğinde görüntü kalitesi</span>, donmasız yayınlar ve 10.000+ premium kanala sahip olun. Kaliteli internet televizyonu için güvenilir adresiniz.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Tv className="w-8 h-8 text-primary" />
            Neden Premium IPTV Tercih Etmelisiniz?
          </h2>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-6 text-slate-200 leading-relaxed">
              Günümüzün dijital dünyasında <span className="text-primary font-semibold">IPTV</span>, geleneksel kablolu televizyon yayıncılığına kıyasla en çok tercih edilen alternatif haline gelmiştir. Giderek artan sayıda kullanıcı, sadece daha uygun maliyetli olmakla kalmayıp, aynı zamanda daha fazla özellik ve içerik sunan esnek internet televizyonunu tercih ediyor. Bizimle birlikte, en yüksek kalite standartlarını karşılayan ve eşsiz bir izleme deneyimi garantileyen bir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] font-semibold">Premium IPTV Sağlayıcısına</span> erişim kazanırsınız.
            </p>
            
            <p className="text-lg mb-6 text-slate-200 leading-relaxed">
              IPTV çözümümüz, özellikle kullanıcıların ihtiyaçları göz önünde bulundurularak geliştirilmiştir. <span className="text-amber-200/90">Kapsamlı yerel kanallar</span>, uluslararası yayınlar, özel spor müsabakaları ve eğlence programları yelpazemizden faydalanırsınız. Teknik mükemmellik ve müşteri memnuniyetine büyük önem veriyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
              <p className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Kesintisiz ve Donmasız IPTV
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Kesintisiz bir televizyon keyfi için <span className="text-primary font-semibold">stabil bir IPTV</span> bağlantısı şarttır. Avrupa'daki son teknoloji sunucu altyapılarımız, sinir bozucu takılmalar veya donmalar olmadan sürekli ve kararlı bir yayın garantisi sunar. <span className="text-[#e50914]/90">Yedekli sistemlere</span> ve akıllı yük dağıtımına güveniyoruz, böylece en yoğun saatlerde bile birinci sınıf yayın kalitesini deneyimleyebilirsiniz.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Yedekli sunucularla %99,9 kesintisiz erişim</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Gerçek zamanlı otomatik hata düzeltme</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>İnternet servis sağlayıcıları ile optimize edilmiş bağlantı</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
              <p className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-primary" />
                Mükemmel İzleme Deneyimi için 4K IPTV
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Ultra HD eğlence dünyasına adım atın! <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300 font-semibold">4K IPTV</span> hizmetimiz, Full HD'den dört kat daha yüksek çözünürlükle jilet gibi keskin görüntüler sunar. En sevdiğiniz programların, filmlerin ve spor etkinliklerinin keyfini nefes kesici görüntü kalitesinde çıkarın. Akıllı TV'nizde, tabletinizde veya akıllı telefonunuzda – <span className="text-white">adaptif yayın teknolojimiz</span> kaliteyi internet hızınıza ve cihazınıza göre otomatik olarak ayarlar.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>4K'ya kadar Ultra HD Çözünürlük (2160p)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Canlı renkler için HDR desteği</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>Optimum kalite için uyarlanabilir bit hızı</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Premium IPTV Sağlayıcısı – Farkımız Nedir?
          </h2>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg mb-6 text-slate-200 leading-relaxed">
              Köklü bir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] font-semibold">Premium IPTV Sağlayıcısı</span> olarak kaliteyi, güvenilirliği ve mükemmel müşteri hizmetini temsil ediyoruz. Sadece büyük bir kanal seçiminden daha fazlasını beklediğinizi biliyoruz – <span className="text-[#e50914]/90">tamamen endişesiz bir televizyon deneyimi</span> istiyorsunuz. Kapsamlı hizmet paketimizle size tam olarak sunduğumuz şey budur.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-6 rounded-xl border border-slate-700 hover:border-primary transition-all">
              <p className="text-xl font-bold text-white mb-4">Geniş Kanal Seçenekleri</p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Dünyanın dört bir yanından <span className="text-amber-200/90 font-semibold">10.000+ canlı TV kanalı</span> hizmetinizde. Ulusal ve uluslararası haber, spor kanalları, belgeseller ve özel premium içeriklere kadar aradığınız her şeyi bulabilirsiniz. Ek olarak, isteğe bağlı (VOD) <span className="text-primary">50.000'den fazla film ve diziye</span> anında erişim sunuyoruz.
              </p>
              <Link to="/channels" className="text-primary hover:text-primary font-semibold inline-flex items-center gap-2">
                Kanal Listesini İncele →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-6 rounded-xl border border-slate-700 hover:border-primary transition-all">
              <p className="text-xl font-bold text-white mb-4">Güvenilir Müşteri Desteği</p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Destek ekibimiz <span className="text-[#e50914]/90 font-semibold">haftanın 7 günü, günün 24 saati</span> hizmetinizdedir. Kurulumla ilgili sorularınız mı var, teknik desteğe mi ihtiyacınız var veya cihazlarınızı yapılandırma konusunda yardıma mı ihtiyacınız var – sizin için buradayız. WhatsApp veya e-posta yoluyla bize her zaman hızlı ve kolay bir şekilde ulaşabilirsiniz.
              </p>
              <Link to="/sss" className="text-primary hover:text-primary font-semibold inline-flex items-center gap-2">
                Sıkça Sorulan Sorular →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-6 rounded-xl border border-slate-700 hover:border-primary transition-all">
              <p className="text-xl font-bold text-white mb-4">Güvenli ve Gizli Kullanım</p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Güvenliğiniz ve gizliliğiniz bizim için en büyük önceliktir. <span className="text-white">Veri aktarımlarınız şifrelenir</span> ve hassas kullanıcı verilerinizi kayıt altında tutmayız. Böylece <span className="text-primary font-semibold">IPTV hizmetimizin</span> keyfini hiçbir endişe duymadan ve kesintisiz olarak çıkarabilirsiniz.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gradient-to-br from-[#e50914]/20 to-[#141414]/50 p-8 md:p-12 rounded-2xl border border-primary/30">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            IPTV Satın Al – Kolay ve Güvenli
          </h2>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6 text-slate-200 leading-relaxed">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] font-semibold">IPTV satın almak</span> istiyor ve sipariş sürecinin nasıl işlediğini mi merak ediyorsunuz? Premium televizyona başlamak bizimle çok kolay. Sadece size uygun paketi seçin; ister deneme için 1 aylık abonelik, ister <span className="text-amber-200/90">cazip indirimlerle uzun vadeli paketler</span> olsun. Gizli maliyetler barındırmayan şeffaf fiyatlandırma sistemimiz sayesinde tam maliyet kontrolü sağlıyoruz.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="space-y-4">
                <p className="text-xl font-semibold text-white">4 Adımda Satın Alma Süreci:</p>
                <ol className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">1</span>
                    <div className="text-slate-200">
                      <strong className="text-primary">Paket Seçimi:</strong> İhtiyaçlarınıza uygun bir abonelik süresi seçin.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">2</span>
                    <div className="text-slate-200">
                      <strong className="text-[#e50914]">Güvenli Ödeme:</strong> Birçok güvenli ödeme yöntemimizden birini kullanın.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">3</span>
                    <div className="text-slate-200">
                      <strong className="text-amber-200">Bilgileri Teslim Alın:</strong> Giriş bilgileriniz anında WhatsApp veya e-posta ile iletilir.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">4</span>
                    <div className="text-slate-200">
                      <strong className="text-white">Hemen Başlayın:</strong> Uygulamayı kurun ve en iyi kalitede IPTV'nin keyfini çıkarın.
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-700">
                <p className="text-xl font-semibold text-white mb-4">Güvenli Ödeme Yöntemleri</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Kredi Kartı / Banka Kartı (Güvenli Altyapı)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Havale / EFT / FAST</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Kripto Para Seçenekleri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Uluslararası Ödeme Seçenekleri</span>
                  </li>
                </ul>
                <p className="text-sm text-slate-400 mt-4">
                  Tüm ödemeler SSL şifrelidir ve en yüksek güvenlik standartlarını karşılar.
                </p>
              </div>
            </div>

            <p className="text-lg mb-6 text-slate-200 leading-relaxed">
              Başarılı bir satın almanın ardından, <span className="text-[#e50914]/90">dakikalar içinde</span> kişisel erişim verilerinizi alacaksınız. Detaylı kurulum rehberlerimiz Smart TV, akıllı telefon, tablet, TV box veya bilgisayarınıza IPTV kurmanıza yardımcı olacaktır. <Link to="/kurulum" className="text-primary hover:text-primary font-semibold underline decoration-primary/50 underline-offset-2">Kurulum rehberine git →</Link>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Tüm Cihazlarla Uyumlu IPTV Paketleri</h2>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg text-center mb-6 text-slate-200 leading-relaxed">
              Her bütçeye ve ihtiyaca uygun esnek abonelik seçenekleri sunuyoruz. Tüm paketlerimiz, kanal ve içerik arşivimizin tamamına hiçbir kısıtlama olmaksızın erişim sağlar. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] font-semibold">Paketlerimizi şimdi keşfedin</span> ve sizin için en uygun olanı hemen seçin.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#e50914]/30 to-[#b20710]/30 p-8 rounded-2xl border border-primary/50 text-center mb-8">
            <p className="text-2xl font-bold text-white mb-4">Premium IPTV Dünyasına Katılmaya Hazır Mısınız?</p>
            <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
              <span className="text-amber-200 font-semibold">Paketinizi seçin</span> ve en iyi IPTV deneyimine bugün başlayın. Test paketlerinden <span className="text-[#e50914]/90 font-semibold">%40'a varan indirimli</span> uzun vadeli aboneliklere kadar, size en uygun teklifi bulacağınız garanti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/paketler" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#e50914] to-[#b20710] text-white font-bold rounded-xl hover:from-[#e50914] hover:to-[#b20710] transition-all shadow-lg hover:shadow-primary/50"
              >
                Hemen Paket Seç →
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0a0a0a] text-white font-bold rounded-xl hover:bg-[#141414] transition-all"
                onClick={() => openTestModal()}
              >
                Ücretsiz Test Et
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
              <p className="text-lg font-bold text-white mb-3">Tüm paketlerin içerikleri:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-amber-200/90">10.000+</span> Canlı TV Kanalı</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-primary">50.000+</span> Film ve Dizi (VOD)</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-white">4K / FHD / HD</span> Yayın Seçenekleri</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span>EPG (Elektronik Yayın Rehberi)</span></li>
              </ul>
            </div>

            <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
              <p className="text-lg font-bold text-white mb-3">Cihaz Uyumluluğu:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-[#e50914]/90">Smart TV</span> (Samsung, LG, Philips vs.)</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span>Android TV Box / Amazon Fire TV</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-amber-200/90">iOS & Android</span> Mobil Cihazlar</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span>Windows ve Mac Bilgisayarlar</span></li>
              </ul>
            </div>

            <div className="bg-[#0a0a0a]/50 p-6 rounded-xl border border-slate-800">
              <p className="text-lg font-bold text-white mb-3">Destek & Hizmetler:</p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-[#e50914]/90">7/24</span> Kesintisiz Türkçe Destek</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span>WhatsApp üzerinden anında iletişim</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span><span className="text-white">Videolu kurulum</span> rehberleri</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" /><span>Düzenli sistem güncellemeleri</span></li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="text-center pt-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm leading-relaxed">
            Bu SEO uyumlu içerik, sizlere <span className="text-primary font-semibold">Premium IPTV</span> hizmetimiz hakkında ayrıntılı bilgi sağlamak için hazırlanmıştır. Takılmasız yayınlar, 4K kalite ve devasa içerik arşivinin tadını çıkarın.
          </p>
        </footer>

      </article>
    </div>
  );
};

export default memo(HomePageSeoContent);
