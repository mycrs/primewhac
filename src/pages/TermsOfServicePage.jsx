import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { breadcrumbSchema } from '@/utils/seoSchema';
import {
  ShieldCheck,
  Cpu,
  ServerOff,
  Layers,
  Scale,
  Lock,
  CreditCard,
  Zap,
  FileText,
  HelpCircle,
  AlertTriangle,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const TermsOfServicePage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Kullanım Şartları ve Hizmet Sözleşmesi | QruzeTV Yasal Bilgiler",
    description: "QruzeTV platformu kullanım koşulları, yapay zeka (AI) destekli medya üretimi beyanı, telif hakkı koruması, DMCA bildir-kaldır politikası ve yasal sorumluluk sınırları.",
    keywords: ["kullanım şartları", "hizmet sözleşmesi", "yasal bildirim", "telif hakkı", "dmca bildir kaldır", "ai medya politikası", "veri sorumluluğu"],
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
      "headline": "Kullanım Şartları ve Yasal Bilgilendirme",
      "author": { "@type": "Organization", "name": "QruzeTV" }
    },
  ];

  const sections = [
    {
      icon: Cpu,
      title: "1. Hizmetin Tanımı ve Yapay Zeka (AI) Destekli Medya Beyanı",
      subsections: [
        {
          subtitle: "Teknoloji ve Oynatıcı Protokol Sağlayıcısı",
          content: "QruzeTV; internet protokolleri üzerinden çalışan medya oynatıcı yazılımları, M3U ve Xtream API arayüz araçları ile yapay zeka (AI) destekli dijital akış simülasyonları sunan bağımsız bir teknoloji sağlayıcısıdır. Platformumuz, kullanıcıların dijital akış altyapılarını yönetmelerine ve kendi oynatma listelerini organize etmelerine olanak tanır."
        },
        {
          subtitle: "Yapay Zeka (AI) ile Üretilmiş Özgün İçerik Modeli",
          content: "Platformumuzda sunulan veya demo olarak sergilenen tüm katalog tanıtımları, sinematik fragman simülasyonları, metinler, görseller ve dijital medya özetleri yalnızca yapay zeka algoritmaları ve bağımsız telifsiz (royalty-free) kaynaklar kullanılarak üretilmiştir. Sitede yer alan tüm AI içerikleri QruzeTV'nin özgün dijital varlığıdır."
        }
      ]
    },
    {
      icon: ServerOff,
      title: "2. Kendi Sunucularımızda Telifli Yayın Barındırılmama İlkesi",
      subsections: [
        {
          subtitle: "Sıfır Telifli İçerik Barındırma Politikası (Zero-Hosting)",
          content: "QruzeTV sunucularında kesinlikle hiçbir üçüncü tarafa, televizyon kuruluşuna, şifreli uydu yayıncısına veya ticari stüdyoya ait telif hakkına tabi video dosyası, canlı televizyon sinyali veya ticari yayın arşivi barındırılmaz, saklanmaz, çoğaltılmaz veya dağıtılmaz."
        },
        {
          subtitle: "Aracı Hizmet ve Yer Sağlayıcı Statüsü",
          content: "QruzeTV; 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Kanunu ve uluslararası dijital standartlar kapsamında salt bir teknoloji, protokol yönlendirme ve arayüz sağlayıcısı ('Yer Sağlayıcı') statüsündedir. Sunucularımız doğrudan yayın kaynağı teşkil etmez."
        }
      ]
    },
    {
      icon: Layers,
      title: "3. Kullanıcı Kaynaklı Harici Akışlar ve Sorumluluk Reddi",
      subsections: [
        {
          subtitle: "Harici Oynatma Listeleri (M3U / URL) Sorumluluğu",
          content: "Kullanıcıların kendi cihazlarına tanımladığı, harici internet kaynaklarından temin ettiği veya arayüzümüze manuel olarak eklediği üçüncü taraf M3U bağlantıları, akış URL'leri ve oynatma listeleri tamamen kullanıcının kendi şahsi tasarrufunda ve sorumluluğundadır."
        },
        {
          subtitle: "Üçüncü Taraf Yayınların Denetlenmemesi",
          content: "QruzeTV; kullanıcıların sisteme entegre ettiği harici üçüncü taraf akışların yasallığını, telif durumunu, doğruluğunu veya sürekliliğini denetleme yükümlülüğüne sahip değildir. Bu kaynaklardan kaynaklanabilecek herhangi bir hukuki veya cezai sorumluluk doğrudan kullanıcıya aittir."
        }
      ]
    },
    {
      icon: Scale,
      title: "4. Telif Hakkı (DMCA) ve Bildir-Kaldır Politikası",
      subsections: [
        {
          subtitle: "Fikri Mülkiyet Haklarına Saygı",
          content: "QruzeTV, fikri ve sınai mülkiyet haklarına azami özen göstermektedir. Platformumuz, Digital Millennium Copyright Act (DMCA), Avrupa Birliği Telif Hakları Direktifi ve Türk Fikir ve Sanat Eserleri Kanunu ilkelerine tam uyumlu olarak 'Bildir ve Kaldır' (Notice and Takedown) prensibiyle hareket eder."
        },
        {
          subtitle: "İhlal Bildirimi Süreci",
          content: "Hak sahibi olduğunu tevsik eden gerçek veya tüzel kişiler, hak ihlali iddiası içeren bildirimlerini doğrudan dmca@qruzetv.com e-posta adresimize iletebilir. Usulüne uygun yapılan bildirimler 24 ila 48 saat içerisinde incelenerek ihlale konu içerik veya referans derhal sistemden kaldırılır."
        }
      ]
    },
    {
      icon: ShieldCheck,
      title: "5. Fikri Mülkiyet ve Yazılım Hakları",
      subsections: [
        {
          subtitle: "Platform Varlıkları ve Kod Hakları",
          content: "QruzeTV web sitesi tasarımı, yapay zeka prompt mimarileri, tescilli logolar, yazılım algoritmaları, CSS/JS mimarisi ve arayüz bileşenleri platformumuzun münhasır fikri mülkiyetindedir. İzinsiz kopyalanamaz, çoğaltılamaz veya tersine mühendisliğe tabi tutulamaz."
        }
      ]
    },
    {
      icon: Lock,
      title: "6. Hesap Güvenliği ve Bireysel Kullanım Şartı",
      subsections: [
        {
          subtitle: "Şahsi Kullanım Esası",
          content: "Sağlanan hesap bilgileri, yazılım lisansları ve protokol erişimleri yalnızca şahsi ve bireysel tüketim amacıyla tahsis edilir. Hesapların ticari alanlarda (kafe, otel, restoran) halka açık gösterimi veya üçüncü şahıslara yetkisiz satışı yasaktır."
        },
        {
          subtitle: "Sisteme Yönelik Kötüye Kullanımlar",
          content: "Sunucu altyapımıza yönelik DDoS saldırıları, otomatik veri kazıma (scraping), brute-force veya güvenlik duvarını delme girişimleri tespit edildiğinde ilgili hesap ve IP adresleri derhal süresiz olarak engellenir ve yasal makamlara bildirilir."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "7. Abonelik, Aktivasyon ve İade Koşulları",
      subsections: [
        {
          subtitle: "Dijital Hizmet Aktivasyonu",
          content: "Sunulan hizmet, dijital yazılım altyapısı ve protokol erişimi niteliğindedir. Ödeme onayıyla birlikte hesap ve erişim parametreleri anında otomatik olarak oluşturulur ve teslim edilir."
        },
        {
          subtitle: "İade Politikası",
          content: "Dijital içerik ve anında ifa edilen hizmetler yönetmeliği gereği, hesap aktivasyonundan sonraki ilk 24 saat içerisinde yalnızca firmamız kaynaklı teknik altyapı çözümsüzlüklerinde iade talebi işleme alınır."
        }
      ]
    },
    {
      icon: Zap,
      title: "8. Hizmet Kalitesi ve Altyapı Sorumluluk Sınırı",
      subsections: [
        {
          subtitle: "Sunucu Performansı ve Harici Faktörler",
          content: "QruzeTV, teknoloji omurgasında yüksek çalışma süresi (%99.9 Uptime) hedefler. Ancak, küresel internet omurgasındaki kesintiler, İnternet Servis Sağlayıcı (İSS) kısıtlamaları veya kullanıcının yerel ağ yetersizliklerinden doğan aksaklıklardan platformumuz sorumlu tutulamaz."
        }
      ]
    },
    {
      icon: FileText,
      title: "9. Sözleşme Değişiklikleri ve Yürürlük",
      subsections: [
        {
          subtitle: "Şartların Güncellenmesi",
          content: "Bu hizmet şartları; mevzuat değişiklikleri, yapay zeka teknolojilerindeki gelişmeler veya güvenlik gereksinimleri doğrultusunda güncellenebilir. Güncellenen metin sitede yayınlandığı andan itibaren geçerlilik kazanır."
        }
      ]
    },
    {
      icon: HelpCircle,
      title: "10. Hukuki Uyuşmazlıklar ve Yetkili Mahkemeler",
      subsections: [
        {
          subtitle: "Uygulanacak Hukuk",
          content: "Bu sözleşmeden ve hizmetin kullanımından doğabilecek her türlü ihtilafın çözümünde Türkiye Cumhuriyeti kanunları uygulanır; İstanbul Mahkemeleri ve İcra Daireleri münhasıran yetkilidir."
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#070709] flex flex-col font-sans text-white selection:bg-[#e50914]/40">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
        
        <main className="flex-grow pt-28 pb-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <BreadcrumbNavigation />
            
            {/* Hero Header */}
            <div className="mt-8 mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e50914]/10 border border-[#e50914]/30 text-[#ff4d58] mb-4">
                <ShieldCheck className="w-4 h-4 text-[#ff4d58]" />
                YASAL SÖZLEŞME & KULLANIM KOŞULLARI
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Kullanım Şartları ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#ff4b55]">Hizmet Sözleşmesi</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
                Bu hizmet sözleşmesi; QruzeTV altyapısının teknolojik kapsamını, yapay zeka (AI) destekli medya üretim beyanını, kendi sunucularımızda telifli yayın barındırılmama ilkelerini ve kullanıcı sorumluluklarını açıklamaktadır.
              </p>
            </div>

            {/* Crucial Safe Harbor Notice Banner */}
            <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#180a0c]/90 via-[#121217]/90 to-[#0d0d12]/90 border border-[#e50914]/30 shadow-xl shadow-[#e50914]/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-[#ff4b55]" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base mb-1.5 flex items-center gap-2">
                    <span>Önemli Yasal Güvence & Yapay Zeka (AI) Medya Bildirimi</span>
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    QruzeTV; bağımsız bir yayın teknolojisi, M3U protokol yöneticisi ve yapay zeka (AI) destekli medya oynatıcı arayüz platformudur. <strong>Sunucularımızda hiçbir üçüncü tarafa veya yayın kuruluşuna ait ticari televizyon yayını, şifreli sinyal veya telifli video barındırılmaz.</strong> Platformumuzda yer alan tüm tanıtım içerikleri yapay zeka ve telifsiz açık lisanslar ile üretilmiştir.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections Accordion/Cards */}
            <div className="space-y-6">
              {sections.map((section, idx) => {
                const IconComponent = section.icon;
                return (
                  <article 
                    key={idx}
                    className="p-6 sm:p-8 rounded-2xl bg-[#121218]/80 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
                      <div className="w-9 h-9 rounded-xl bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-[#ff4b55]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-black/40 p-4 sm:p-5 rounded-xl border border-white/5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#ff4b55] shrink-0" />
                            <span>{sub.subtitle}</span>
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed m-0 font-normal">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* DMCA & Takedown Direct Box */}
            <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#15121e]/90 to-[#0e0c14]/90 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold block mb-1">
                  DMCA & TELİF HAKKI BAŞVURUSU
                </span>
                <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1.5">
                  Telif Hakkı veya İçerik Kaldırma Talebi
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Fikri mülkiyet haklarınızın ihlal edildiğini düşünüyorsanız, resmi tevsik edici belgelerinizle birlikte DMCA birimimize yazabilirsiniz. Talepler 24-48 saat içinde değerlendirilir.
                </p>
              </div>
              <a
                href="mailto:dmca@qruzetv.com"
                className="shrink-0 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>dmca@qruzetv.com</span>
              </a>
            </div>

            {/* Quick Navigation Footer Links */}
            <div className="mt-10 p-6 rounded-2xl bg-[#121218]/60 border border-white/5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link to="/gizlilik" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                🔒 Gizlilik Politikası
              </Link>
              <Link to="/sss" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                ❓ Sıkça Sorulan Sorular
              </Link>
              <Link to="/paketler" className="px-5 py-2.5 rounded-xl bg-[#e50914]/20 hover:bg-[#e50914]/30 text-[#ff4b55] text-xs sm:text-sm font-bold transition-all border border-[#e50914]/30">
                ⚡ IPTV Paketleri
              </Link>
            </div>
          </div>
        </main>
        
        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default TermsOfServicePage;
