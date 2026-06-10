import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { breadcrumbSchema } from '@/utils/seoSchema';

const TermsOfServicePage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "IPTV Kullanım Şartları ve Koşulları | Yasal Bilgiler",
    description: "IPTV hizmetinin kullanım şartları, koşulları ve yasal bilgileri. Haklarınız ve yükümlülükleriniz.",
    keywords: ["IPTV şartları", "IPTV koşulları", "IPTV kullanım", "IPTV hizmet"],
    ogType: "article"
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hizmet Şartları', path: '/sartlar' },
  ]);
  const jsonLd = [
    breadcrumb,
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Kullanım Şartları ve Koşulları",
      "author": { "@type": "Organization", "name": "QruzeTV" }
    },
  ];

  const sections = [
    {
      title: "Hizmet Tanımı",
      subsections: [
        { subtitle: "IPTV Hizmeti Kapsamı", content: "QruzeTV, internet protokolü üzerinden canlı televizyon yayınları, film ve dizi (VOD) içerikleri sunan dijital bir platformdur. IPTV hizmet kapsamında sunulan yayınlar, internet altyapınızın kalitesine bağlı olarak değişiklik gösterebilir. Bu platform, bireysel kullanım amacıyla tasarlanmıştır." },
        { subtitle: "Erişim ve Cihazlar", content: "Sunulan IPTV hizmet, Smart TV, Android, iOS, Windows ve Mac cihazlarla uyumludur. Kullanıcılar, kendilerine sağlanan hesap bilgileri ile desteklenen uygulamalar üzerinden sisteme erişim sağlayabilirler." }
      ]
    },
    {
      title: "Kullanıcı Sorumlulukları",
      subsections: [
        { subtitle: "Hesap Güvenliği", content: "Kullanıcılar, kendilerine sağlanan kullanıcı adı ve şifre gibi bilgilerin güvenliğinden tamamen sorumludur. IPTV koşulları gereği, hesap bilgilerinin üçüncü şahıslarla paylaşılması kesinlikle yasaktır." },
        { subtitle: "Altyapı Gereksinimleri", content: "Kesintisiz bir IPTV deneyimi için kullanıcıların stabil ve yeterli hıza sahip bir internet bağlantısı (minimum 16 Mbps) sağlamaları kendi sorumluluklarındadır." }
      ]
    },
    {
      title: "Fikri Mülkiyet Hakları",
      subsections: [
        { subtitle: "İçerik Hakları", content: "Platformumuzda sunulan tüm yazılımlar, logolar ve tasarımlar QruzeTV'nin veya ilgili lisans sahiplerinin fikri mülkiyetindedir. İçeriklerin izinsiz çoğaltılması veya dağıtılması yasaktır." }
      ]
    },
    {
      title: "Yasaklı Kullanımlar",
      subsections: [
        { subtitle: "Ticari Dağıtım", content: "Bireysel IPTV paketlerinin kafe, restoran, otel gibi ticari alanlarda toplu gösterimi veya yeniden satışı kesinlikle yasaktır. Bu tür ihlallerde hesap anında sonlandırılır." },
        { subtitle: "Sistemi Kötüye Kullanma", content: "Sunucularımıza yönelik DDoS saldırıları, tersine mühendislik veya otomasyon araçlarıyla veri çekme girişimleri yasal işlem sebebidir ve IP adresleri kalıcı olarak bloklanır." }
      ]
    },
    {
      title: "Abonelik ve Ödeme Koşulları",
      subsections: [
        { subtitle: "Paket Fiyatlandırması", content: "IPTV şartları gereği, paket fiyatları web sitemizde belirtildiği gibidir. QruzeTV, önceden haber vermeksizin fiyatlarda güncelleme yapma hakkını saklı tutar." },
        { subtitle: "Ödeme Yöntemleri", content: "Kredi kartı, banka havalesi ve kripto para gibi çeşitli ödeme yöntemleri kabul edilmektedir. Abonelik, ödeme onayı alındıktan sonra otomatik olarak başlar." }
      ]
    },
    {
      title: "İade ve İptal Politikası",
      subsections: [
        { subtitle: "İptal Süreci", content: "Kullanıcılar, aboneliklerini istedikleri zaman yenilemeyerek iptal edebilirler. Ancak iptal işlemi, mevcut fatura döneminin sonuna kadar olan erişimi etkilemez." },
        { subtitle: "İade Şartları", content: "Hizmetin dijital doğası gereği, hesap aktivasyonundan sonraki 24 saat içinde yalnızca teknik olarak çözülemeyen firmamız kaynaklı altyapı sorunları kanıtlandığında kısmi veya tam iade değerlendirilir." }
      ]
    },
    {
      title: "Hizmet Kalitesi Garantisi",
      subsections: [
        { subtitle: "Uptime (Kesintisizlik) Oranı", content: "QruzeTV, sunucularında %99.9 çalışma süresi (uptime) hedefler. Ancak, küresel internet omurgasındaki arızalar, ISP (İnternet Servis Sağlayıcı) engellemeleri veya planlı bakım çalışmaları istisnadır." }
      ]
    },
    {
      title: "Sorumluluk Sınırlaması",
      subsections: [
        { subtitle: "Doğrudan ve Dolaylı Zararlar", content: "Hizmetin kullanımından veya kullanılamamasından doğacak kar kaybı, veri kaybı gibi doğrudan veya dolaylı maddi/manevi zararlardan QruzeTV sorumlu tutulamaz." }
      ]
    },
    {
      title: "Değişiklikler ve Güncellemeler",
      subsections: [
        { subtitle: "Sözleşme Güncellemeleri", content: "Bu kullanım şartları zaman zaman güvenlik, teknoloji veya politikalar gereği güncellenebilir. Değişiklikler web sitemizde yayınlandığı andan itibaren tüm mevcut kullanıcılar için geçerli sayılır." }
      ]
    },
    {
      title: "Hukuki Uyuşmazlıklar",
      subsections: [
        { subtitle: "Yetkili Mahkemeler", content: "Bu şartlardan doğabilecek her türlü uyuşmazlığın çözümünde Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir." }
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
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 leading-tight">
                Kullanım Şartları ve Koşulları
              </h1>
              
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 mb-8 leading-relaxed">
                  QruzeTV platformuna hoş geldiniz. Web sitemizi ziyaret ederek veya sunduğumuz <strong>IPTV hizmet</strong> paketlerimizi satın alarak aşağıdaki <strong>IPTV kullanım</strong> şartlarını ve koşullarını tamamen kabul etmiş sayılırsınız. Hizmetimizi güvenle kullanabilmeniz için lütfen <strong>IPTV şartları</strong> ve kurallarını içeren bu metni dikkatlice okuyunuz.
                </p>

                {sections.map((section, idx) => (
                  <div key={idx} className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">
                      {section.title}
                    </h2>
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="mb-6 bg-[#0a0a0a]/20 p-4 rounded-xl border border-slate-700/30">
                        <h3 className="text-xl font-semibold text-orange-300 mb-2">
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
                  <Link to="/gizlilik" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Gizlilik Politikası</Link>
                  <Link to="/sss" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">Sık Sorulan Sorular</Link>
                  <Link to="/paketler" className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600">IPTV Paketleri</Link>
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

export default TermsOfServicePage;