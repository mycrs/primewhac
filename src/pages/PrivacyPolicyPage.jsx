import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { breadcrumbSchema } from '@/utils/seoSchema';

const PrivacyPolicyPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Gizlilik Politikası | IPTV Veri Koruması ve Güvenliği",
    description: "IPTV gizlilik politikası ve veri koruması. Verileriniz nasıl korunuyor? Şeffaf veri politikamız.",
    keywords: ["IPTV gizlilik", "veri koruması", "IPTV güvenliği", "gizlilik politikası"],
    ogType: "article"
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Gizlilik Politikası', path: '/gizlilik' },
  ]);
  const jsonLd = [
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Gizlilik Politikası ve Veri Koruması",
      "author": { "@type": "Organization", "name": "QruzeTV" }
    },
  ];

  const sections = [
    {
      title: "Gizlilik Politikası Nedir?",
      subsections: [
        { subtitle: "Amacımız", content: "QruzeTV olarak, platformumuzu kullanan tüm ziyaretçilerin ve abonelerin gizliliğine maksimum saygı duyuyoruz. Bu gizlilik politikası, hizmetlerimizi kullanırken toplanan verilerin nasıl işlendiğini, saklandığını ve korunduğunu şeffaf bir şekilde açıklamaktadır. Tüm IPTV gizlilik standartlarımız, uluslararası veri koruma yönetmeliklerine ve KVKK/GDPR kurallarına uygun olarak tasarlanmıştır." }
      ]
    },
    {
      title: "Toplanan Veriler",
      subsections: [
        { subtitle: "Kişisel Kimlik Bilgileri", content: "Sistemimize kayıt aşamasında yalnızca adınız, soyadınız, iletişim için e-posta adresiniz ve telefon numaranız gibi temel iletişim bilgilerinizi topluyoruz." },
        { subtitle: "Teknik ve Cihaz Verileri", content: "IPTV güvenliği ve hesap paylaşımını (korsan kullanımı) engellemek amacıyla; bağlandığınız IP adresiniz, cihaz modeliniz, tarayıcı türünüz ve sisteme bağlantı süreleriniz gibi teknik metrikler sistem tarafından otomatik olarak kaydedilmektedir." }
      ]
    },
    {
      title: "Verilerin Kullanımı",
      subsections: [
        { subtitle: "Hizmet Sağlama ve İyileştirme", content: "Toplanan veriler öncelikli olarak abonelik işlemlerinizin hızlıca gerçekleştirilmesi, size teknik destek sağlanması, yayın akışınızın bağlantı hızınıza göre optimize edilmesi için kullanılır." },
        { subtitle: "İletişim ve Bildirimler", content: "E-posta veya telefon bilgileriniz; paketinizin süresinin dolması, önemli teknik bakım duyuruları veya kampanyalar hakkında bilgilendirme yapmak için kullanılmaktadır. Üçüncü şahıslara reklam amacıyla kesinlikle satılmaz." }
      ]
    },
    {
      title: "Veri Güvenliği",
      subsections: [
        { subtitle: "Şifreleme Standartları", content: "Veri koruması kapsamında, sunucularımız ile cihazınız arasındaki tüm form ve veri aktarımları endüstri standardı 256-bit SSL şifreleme teknolojisi ile korunmaktadır." },
        { subtitle: "Yetkisiz Erişim Koruması", content: "Fiziksel ve dijital sunucularımız, veri sızıntısı ve siber saldırılara karşı gelişmiş Web Application Firewall (WAF) ve anti-DDoS sistemleri ile 7/24 izlenmektedir." }
      ]
    },
    {
      title: "Çerezler (Cookies)",
      subsections: [
        { subtitle: "Çerez Kullanımı ve Amacı", content: "Web sitemiz, oturumunuzu açık tutmak, site içi dil/tema tercihlerinizi hatırlamak ve sayfa performansımızı analiz etmek (Google Analytics vb.) için küçük metin dosyaları olan çerezleri (cookies) kullanır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman reddedebilir veya silebilirsiniz." }
      ]
    },
    {
      title: "Üçüncü Taraf Hizmetleri",
      subsections: [
        { subtitle: "İş Ortakları ile Veri Paylaşımı", content: "Ödeme altyapısı (Sanal Pos) ve mesajlaşma servis sağlayıcıları gibi güvenilir üçüncü taraf iş ortaklarımız, sadece hizmetin gerektirdiği ölçüde (örn. kredi kartı ödemesinin provizyonu) ve katı gizlilik anlaşmaları çerçevesinde gerekli verilere erişebilir." }
      ]
    },
    {
      title: "Kullanıcı Hakları",
      subsections: [
        { subtitle: "Veri Erişimi ve Silme Hakkı", content: "Kullanıcılarımız, kendilerine ait hangi verilerin veri tabanımızda saklandığını döküm olarak talep etme ve hesaplarının iptali ile birlikte tüm kişisel verilerinin sistemden kalıcı olarak silinmesini (Unutulma Hakkı) isteme hakkına yasal olarak sahiptir." }
      ]
    },
    {
      title: "Veri Saklama Süresi",
      subsections: [
        { subtitle: "Yasal Arşivleme Süreçleri", content: "Aktif aboneliği bulunan kullanıcıların verileri, hizmet süresince aktif sunucularda saklanır. Abonelik tamamen iptal edildiğinde dahi, yasal mali yükümlülükler (fatura ibrazı vb.) gereği temel işlem bilgileri kanunların emrettiği asgari süre boyunca güvenle arşivlenir." }
      ]
    },
    {
      title: "Politika Değişiklikleri",
      subsections: [
        { subtitle: "Güncelleme Bildirimleri", content: "Gizlilik politikası üzerinde yapılacak yasal veya teknik kaynaklı önemli değişiklikler, web sitemiz üzerinden pop-up veya duyuru olarak yayınlanır ve gerekli hallerde kullanıcılara e-posta yoluyla bildirilir." }
      ]
    },
    {
      title: "İletişim ve Şikayetler",
      subsections: [
        { subtitle: "Gizlilik Destek Hattı", content: "Kişisel verilerinizin işlenmesi, veri koruması ile ilgili her türlü soru, itiraz, bilgi talebi veya şikayetiniz için destek ekibimize iletişim sayfamızdan veya e-posta adresimiz üzerinden her zaman ulaşabilirsiniz." }
      ]
    }
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <BreadcrumbNavigation />
            
            <article className="mt-8 bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] leading-tight">
                Gizlilik Politikası ve Veri Koruması
              </h1>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-10 leading-relaxed">
                  QruzeTV, tüm abonelerinin ve ziyaretçilerinin <strong>veri koruması</strong> ve <strong>IPTV güvenliği</strong> konularında sektördeki en yüksek standartları benimser. Bu şeffaf <strong>gizlilik politikası</strong> metni, platformumuzla paylaştığınız verilerinizin nasıl toplandığını, hangi şartlarda işlendiğini ve kötü niyetli erişimlere karşı nasıl korunduğunu detaylandırmaktadır.
                </p>

                {sections.map((section, idx) => (
                  <div key={idx} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">
                      {section.title}
                    </h2>
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="mb-6 bg-[#0a0a0a]/20 p-4 rounded-xl border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {sub.subtitle}
                        </h3>
                        <p className="text-slate-300 leading-relaxed m-0">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="mt-12 p-8 bg-[#0a0a0a]/50 rounded-2xl border border-slate-700 flex flex-wrap gap-4">
                  <Link to="/sartlar" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Kullanım Şartları</Link>
                  <Link to="/sss" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Sık Sorulan Sorular</Link>
                  <Link to="/kurulum" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Kurulum Rehberi</Link>
                </div>
              </div>
            </article>
          </div>
        </main>
        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;