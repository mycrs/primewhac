import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { breadcrumbSchema } from '@/utils/seoSchema';
import {
  ShieldCheck,
  EyeOff,
  Lock,
  Cpu,
  Server,
  UserCheck,
  Cookie,
  Trash2,
  FileCheck,
  HelpCircle,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const PrivacyPolicyPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "Gizlilik Politikası ve KVKK Uyumluluğu | QruzeTV Veri Güvenliği",
    description: "QruzeTV gizlilik politikası, sıfır kayıt (zero-log) prensibi, KVKK/GDPR veri koruma hakları, yapay zeka telemetrisi ve 256-bit SSL güvenlik standartları.",
    keywords: ["gizlilik politikası", "kvkk veri koruması", "gdpr uyumluluğu", "zero log iptv", "veri güvenliği", "unutulma hakkı"],
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
      "headline": "Gizlilik Politikası ve Kişisel Verilerin Korunması (KVKK/GDPR)",
      "author": { "@type": "Organization", "name": "QruzeTV" }
    },
  ];

  const sections = [
    {
      icon: ShieldCheck,
      title: "1. Gizlilik Taahhüdümüz ve Yasal Çerçeve (KVKK & GDPR)",
      subsections: [
        {
          subtitle: "Mahremiyete Tam Saygı",
          content: "QruzeTV; kullanıcılarının ve web sitesi ziyaretçilerinin dijital mahremiyetini en temel insan hakkı olarak kabul eder. Tüm veri işleme süreçlerimiz 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) ilkeleriyle %100 uyumludur."
        }
      ]
    },
    {
      icon: EyeOff,
      title: "2. İzleme ve Günlük Tutmama İlkesi (Zero-Logs / Sıfır Kayıt Prensibi)",
      subsections: [
        {
          subtitle: "İzleme Geçmişi Asla Kaydedilmez",
          content: "QruzeTV altyapısında; kullanıcıların hangi içerikleri başlattığı, hangi akışları oynattığı, ne kadar süre izlediği veya kişisel yayın tercihleri KESİNLİKLE İZLENMEZ, GÜNLÜK (LOG) DOSYALARINDA TUTULMAZ VE PROFİLLENMEZ."
        },
        {
          subtitle: "Uçtan Uca Doğrudan İletim",
          content: "Medya akış protokolleri kullanıcının cihazı ile kaynak arasında doğrudan gerçekleşir; platformumuz hiçbir yayın trafiğini araya girerek gözetlemez veya depolamaz."
        }
      ]
    },
    {
      icon: Lock,
      title: "3. Toplanan Asgari Veriler ve Toplanma Amaçları",
      subsections: [
        {
          subtitle: "Hesap Aktivasyon Verileri",
          content: "Sipariş teyidi, erişim parametrelerinin iletimi ve teknik destek sağlanabilmesi için yalnızca adınız, e-posta adresiniz ve WhatsApp/telefon iletişim bilgileriniz toplanır."
        },
        {
          subtitle: "Bağlantı Güvenliği Metrikleri",
          content: "Eş zamanlı cihaz ihlallerini engellemek ve sistem güvenliğini sağlamak amacıyla oturum süresi, şifrelenmiş IP adresi ve cihaz türü (Smart TV, Android, iOS vb.) teknik düzeyde işlenir."
        }
      ]
    },
    {
      icon: Cpu,
      title: "4. Yapay Zeka (AI) Algoritmaları ve Anonim Telemetri",
      subsections: [
        {
          subtitle: "Kişisel Veriden Bağımsız Optimizasyon",
          content: "Platformumuzda kullanılan yapay zeka modelleri kişisel verileri işlemez. Yalnızca video akış kararlılığı, donanım ivmesi uyumluluğu ve arayüz tepki süresini iyileştirmek için tamamen anonimleştirilmiş teknik performans telemetrisi kullanır."
        }
      ]
    },
    {
      icon: Server,
      title: "5. Veri Güvenliği ve 256-Bit SSL Şifreleme",
      subsections: [
        {
          subtitle: "Uçtan Uca Kriptografik Koruma",
          content: "Web sitemiz ile cihazınız arasındaki tüm formlar, sipariş adımları ve veri alışverişi endüstri standardı 256-Bit SSL/TLS şifreleme protokolüyle güvence altındadır."
        },
        {
          subtitle: "Güvenlik Duvarı ve Tehdit Engelleme",
          content: "Veritabanlarımız; Web Application Firewall (WAF), veri sızıntısını önleyici şifreli yapılar ve periyodik sızma testleriyle yetkisiz erişimlere karşı 7/24 korunur."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "6. Üçüncü Şahıslarla Paylaşım ve Ticari Satış Yasağı",
      subsections: [
        {
          subtitle: "Veri Ticareti Yapılmaz",
          content: "Kullanıcı verileriniz hiçbir koşul altında reklam ağlarına, pazarlama şirketlerine veya veri tüccarlarına SATILMAZ, KİRALANMAZ VEYA TİCARİ AMAÇLA DEVREDİLMEZ."
        },
        {
          subtitle: "Yalnızca Zorunlu Entegratörler",
          content: "Sadece 3D Secure güvenli ödeme sağlayıcıları ve SMS/mesajlaşma ağları, ödemenin tahsil edilmesi ve aktivasyon mesajının iletilmesi için gerekli asgari bilgiyi güvenli kanaldan işler."
        }
      ]
    },
    {
      icon: Cookie,
      title: "7. Çerezler (Cookies) ve Oturum Tercihleri",
      subsections: [
        {
          subtitle: "Çerez Kullanım Amacı",
          content: "Sitemizde kullanılan çerezler yalnızca oturum sürekliliği, dil seçimi (TR/DE) ve sayfa hızı optimizasyonu sağlamak amacını taşır. Tarayıcınızın ayarlarından dilediğiniz an çerezleri silebilir veya engelleyebilirsiniz."
        }
      ]
    },
    {
      icon: Trash2,
      title: "8. Kullanıcı Hakları ve Unutulma Hakkı (Right to be Forgotten)",
      subsections: [
        {
          subtitle: "Verilerinizi Yönetme ve Kalıcı Olarak Silme",
          content: "KVKK ve GDPR uyarınca; hakkınızda tutulan verilerin dökümünü talep etme, güncelleme veya hesabınızın kapanmasıyla birlikte tüm verilerinizin sistemlerimizden kalıcı olarak silinmesini ('Unutulma Hakkı') isteme hakkına sahipsiniz."
        }
      ]
    },
    {
      icon: FileCheck,
      title: "9. Veri Saklama ve İmha Politikası",
      subsections: [
        {
          subtitle: "Güvenli İmha Süreci",
          content: "Aktif abonelik süresi boyunca saklanan temel iletişim kayıtları, abonelik sonlandığında ve yasal mali yükümlülük süreleri dolduğunda güvenli biçimde geri döndürülemez şekilde imha edilir."
        }
      ]
    },
    {
      icon: HelpCircle,
      title: "10. Veri Sorumlusu İletişim Bilgileri",
      subsections: [
        {
          subtitle: "Gizlilik Destek Hattı",
          content: "Kişisel verilerinizin korunması, hak talepleri veya gizlilik sözleşmesi ile ilgili tüm sorularınız için privacy@qruzetv.com üzerinden Veri Sorumlusu ekibimize 7/24 ulaşabilirsiniz."
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                KVKK & GDPR UYUMLU GİZLİLİK POLİTİKASI
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Gizlilik Politikası ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400">Veri Güvenliği</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
                QruzeTV; kullanıcı mahremiyetini merkeze alan <strong>sıfır kayıt (zero-log)</strong> politikasını benimser. Hangi içerikleri izlediğiniz asla kaydedilmez; toplanan asgari veriler yalnızca 256-Bit SSL güvencesiyle korunur.
              </p>
            </div>

            {/* Zero-Log Key Highlight Banner */}
            <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0d1813]/90 via-[#101915]/90 to-[#0c120f]/90 border border-emerald-500/30 shadow-xl shadow-emerald-500/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <EyeOff className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base mb-1.5 flex items-center gap-2">
                    <span>Sıfır Günlük (Zero-Logs) Güvencesi</span>
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Platformumuz; kullanıcıların hangi yayınları açtığını, izleme sürelerini veya akış geçmişini <strong>asla kaydetmez, izlemez veya profil oluşturmaz</strong>. Yapay zeka altyapımız yalnızca teknik oynatıcı kararlılığını sağlamak için anonim telemetri kullanır.
                  </p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, idx) => {
                const IconComponent = section.icon;
                return (
                  <article 
                    key={idx}
                    className="p-6 sm:p-8 rounded-2xl bg-[#121218]/80 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <IconComponent className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {section.title}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-black/40 p-4 sm:p-5 rounded-xl border border-white/5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

            {/* Privacy Contact Direct Box */}
            <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0f1814]/90 to-[#0a100d]/90 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                  KVKK / GDPR VERİ SORUMLUSU
                </span>
                <h3 className="text-white font-extrabold text-lg sm:text-xl mb-1.5">
                  Veri Talepleri ve Unutulma Hakkı Başvurusu
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Kişisel verilerinizin dökümünü almak veya sistemlerimizden tamamen silinmesini talep etmek için Veri Sorumlumuza dilediğiniz an başvurabilirsiniz.
                </p>
              </div>
              <a
                href="mailto:privacy@qruzetv.com"
                className="shrink-0 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>privacy@qruzetv.com</span>
              </a>
            </div>

            {/* Quick Navigation Footer Links */}
            <div className="mt-10 p-6 rounded-2xl bg-[#121218]/60 border border-white/5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Link to="/sartlar/" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                📄 Kullanım Şartları
              </Link>
              <Link to="/sss/" className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-all border border-white/10">
                ❓ Sıkça Sorulan Sorular
              </Link>
              <Link to="/paketler/" className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold transition-all border border-emerald-500/30">
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

export default PrivacyPolicyPage;
