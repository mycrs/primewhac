
import React, { memo, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Packages from '@/components/Packages';
import SEOHead from '@/components/SEOHead';
import { packagesPageSchemas, breadcrumbSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';
import { resolvePackagesPageContent } from '@/utils/packagePageContent';
import PackagesPageSeoSections from '@/components/packages/PackagesPageSeoSections';
import { defaultData } from '@/data/defaultSiteData';
import ErrorBoundary from '@/components/ErrorBoundary';
import ChatBot from '@/components/ChatBot';
import { CheckCircle2 } from 'lucide-react';

const PACKAGES_FAQ_ITEMS = [
  {
    q: 'Hangi IPTV paketini seçmeliyim?',
    a: 'İzleme alışkanlığınız belirler. Hizmeti ilk kez deniyorsanız 1 veya 3 aylık paketle başlayın; yayın kalitesinden memnun kaldığınızda 6 veya 12 aya geçmek aylık maliyeti belirgin şekilde düşürür. Aynı anda iki ekranda izlenecekse çift kullanıcılı seçeneği tercih edin.',
  },
  {
    q: 'Paket fiyatları nasıl belirleniyor?',
    a: 'Fiyatlar abonelik süresine (1, 3, 6, 12 veya 15 ay) ve kullanıcı sayısına göre belirlenir. Süre uzadıkça aylık maliyet düşer; 12 ve 15 aylık paketler bu yüzden en ekonomik seçeneklerdir. Tüm paketlere aynı kanal listesi, film-dizi arşivi ve 7/24 destek dahildir.',
  },
  {
    q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    a: '3D Secure korumalı kredi/banka kartı, havale/EFT ve uluslararası müşterilerimiz için kripto para ile ödeme kabul ediyoruz. Kart bilgileriniz sistemimizde saklanmaz. Ödeme adımları paket seçiminden sonra gösterilir.',
  },
  {
    q: 'Aktivasyon ne kadar sürüyor?',
    a: 'Ödeme onayından sonra erişim bilgileri çoğunlukla birkaç dakika içinde iletilir. Yoğun dönemlerde süre uzayabilir; güncel teslimat bilgisi sipariş sırasında paylaşılır.',
  },
  {
    q: 'Paketler hangi cihazlarla uyumlu?',
    a: 'Samsung ve LG Smart TV, Android TV, Fire TV Stick, iPhone/iPad, Android telefon ve tablet ile Windows ve Mac bilgisayarlarda izleyebilirsiniz. Kurulum sayfamızda her cihaz için adım adım anlatım bulunur.',
  },
  {
    q: 'Yayınlarda donma olur mu?',
    a: 'Yük dengelemeli altyapıyla yüksek erişilebilirlik hedeflenir; ancak sonuç internet hızına, Wi-Fi kalitesine, cihazınıza ve kaynak yayına göre değişir. 4K için mümkünse ethernet bağlantısı kullanın ve satın alma öncesinde ücretsiz test yapın.',
  },
  {
    q: 'Memnun kalmazsam iade hakkım var mı?',
    a: 'Aktivasyondan sonraki ilk 24 saat içinde iade talebi iletebilirsiniz. Dijital hizmetlerde iade; firmamız kaynaklı ve destek tarafından çözülemeyen teknik sorunlar için hizmet şartlarına göre değerlendirilir. Satın almadan önce ücretsiz test önerilir.',
  },
  {
    q: 'Aboneliğimi sonradan uzatabilir veya yükseltebilir miyim?',
    a: 'Evet. Süre bitmeden uzatma yapabilir, dilerseniz daha uzun süreli ya da çift kullanıcılı pakete geçebilirsiniz. Destek ekibimiz geçiş işlemini birkaç dakika içinde tamamlar.',
  },
];

const PACKAGES_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PACKAGES_FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: a,
    },
  })),
};

const PackagesPage = ({ siteData }) => {
  const safeSiteData = siteData || defaultData;
  const pageContent = resolvePackagesPageContent(safeSiteData);
  const h1Title = pageContent.page?.title || 'IPTV Paketleri ve Fiyatları';

  const metadata = useMemo(() => ({
    title: 'IPTV Paketleri ve Fiyatları — 4K Abonelik | QruzeTV',
    description:
      'IPTV paketlerini süre, kullanıcı sayısı, bölge ve fiyat açısından karşılaştırın. 4K/UHD seçeneklerini kendi cihazınızda ücretsiz test edin.',
    keywords: ['IPTV paketleri', 'IPTV fiyatları', '4K abonelik', 'QruzeTV', 'premium paketler'],
    ogType: 'website',
    ogImage: `${SITE_URL}/og/paketler.jpg`,
  }), []);

  const jsonLd = useMemo(
    () => [
      ...packagesPageSchemas(metadata),
      breadcrumbSchema([
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Paketler', path: '/paketler' },
      ]),
      PACKAGES_FAQ_SCHEMA,
    ],
    [metadata],
  );

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/paketler`} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white selection:bg-primary/40">
        <Header contactData={safeSiteData.contactData} />

        <main className="flex-grow pt-24 pb-16">
          <section className="relative overflow-hidden py-12 md:py-16">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e50914]/10 via-amber-500/5 to-transparent -z-10" />

            <div className="container mx-auto px-4 text-center">
              <span className="luxury-kicker mb-5">Premium Paket Salonu</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 mt-4 tracking-tight text-white drop-shadow-sm">
                {h1Title}
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
                {pageContent.page?.shortDescription ||
                  'Güncel IPTV paketlerini süre, kullanıcı sayısı ve bölgeye göre karşılaştırın. Satın almadan önce 4K/UHD yayın seçeneklerini kendi cihazınızda ücretsiz test edin.'}
              </p>

              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <div className="glass-effect flex items-center gap-3 px-6 py-3 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-[#e50914]" />
                  <span className="text-white font-medium">Anında Teslimat</span>
                </div>
                <div className="glass-effect flex items-center gap-3 px-6 py-3 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-[#e50914]" />
                  <span className="text-white font-medium">7/24 Canlı Destek</span>
                </div>
                <div className="glass-effect flex items-center gap-3 px-6 py-3 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-[#e50914]" />
                  <span className="text-white font-medium">Tüm Cihazlarla Uyumlu</span>
                </div>
              </div>
            </div>
          </section>

          <section id="packages-list" className="relative z-10 py-8">
            <ErrorBoundary>
              <Packages
                packages={safeSiteData.packagesData}
                showTierFilter
                hideSectionHeader
                packagesPageContent={safeSiteData.packagesPageContent}
              />
            </ErrorBoundary>
          </section>

          <PackagesPageSeoSections siteData={safeSiteData} contactData={safeSiteData.contactData} lang="tr" />

          {/* Hangi paket kime uygun? — süre bazlı karşılaştırma */}
          <section className="py-16 border-t border-white/5">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-bold mb-6 text-white">Hangi Paket Kime Uygun?</h2>
              <div className="text-slate-300 space-y-4 leading-relaxed text-lg">
                <p>
                  Paket seçimi aslında iki soruya iner: ne kadar süre izleyeceksiniz ve kaç ekran kullanacaksınız?
                  Süre seçenekleri 1, 3, 6, 12 ve 15 ay; içerik tarafında ise tüm paketler aynı kanal listesini,
                  film-dizi arşivini ve destek hizmetini içerir. Yani kısa paket aldığınızda kaliteden değil,
                  yalnızca süreden feragat etmiş olursunuz.
                </p>
                <p>
                  <strong className="text-white">1 aylık abonelik,</strong> hizmeti ilk kez deneyenler ya da yalnızca
                  belirli bir dönem için — bir turnuva, tatil ya da kısa bir seyahat gibi — yayın isteyenler için
                  mantıklıdır. Taahhüt süresi kısadır; beğenirseniz süre bitmeden uzatabilirsiniz.
                </p>
                <p>
                  <strong className="text-white">3 aylık paket,</strong> bir sezonluk dizi veya lig takibi için ideal
                  orta yoldur. Aylık maliyeti 1 aylık pakete göre daha düşüktür ve üç ay boyunca yenileme
                  düşünmezsiniz.
                </p>
                <p>
                  <strong className="text-white">6 aylık abonelik,</strong> düzenli izleyen haneler için dengeli bir
                  seçimdir. Yaz ve kış yoğun dönemlerini tek ödemeyle geçirir, yarıyıl boyunca fiyat değişiminden
                  etkilenmezsiniz.
                </p>
                <p>
                  <strong className="text-white">12 aylık paket</strong> ise aylık maliyeti en düşük seçeneklerden biridir ve uzun
                  vadede ciddi tasarruf sağlar. Yurt dışında yaşayıp Türk kanallarını günlük izleyenler ve spor
                  severler genellikle bu pakette karar kılar. Evde iki ekran aynı anda kullanılacaksa çift kullanıcılı
                  12 aylık paket toplam maliyeti daha da makul hâle getirir.
                </p>
                <p>
                  <strong className="text-white">15 Ay VIP abonelik,</strong> en uzun süreli ve en avantajlı paketimizdir.
                  Aylık maliyet tüm seçenekler arasında en düşük seviyeye iner; 15 ay boyunca hiç yenileme
                  derdi yaşamadan kesintisiz izleme keyfini sürersiniz. Uzun vadeli kullanıcılar ve aileler
                  için özellikle önerilir.
                </p>
              </div>

              <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-5 py-4 text-slate-200 font-semibold border-b border-white/10">Süre</th>
                      <th className="px-5 py-4 text-slate-200 font-semibold border-b border-white/10">Kimin için uygun?</th>
                      <th className="px-5 py-4 text-slate-200 font-semibold border-b border-white/10">Öne çıkan avantaj</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr>
                      <td className="px-5 py-4 border-b border-white/5 font-medium text-white">1 Ay</td>
                      <td className="px-5 py-4 border-b border-white/5">İlk kez deneyenler, kısa dönemli ihtiyaç</td>
                      <td className="px-5 py-4 border-b border-white/5">Düşük başlangıç maliyeti, kısa taahhüt</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 border-b border-white/5 font-medium text-white">3 Ay</td>
                      <td className="px-5 py-4 border-b border-white/5">Sezonluk dizi ve lig takipçileri</td>
                      <td className="px-5 py-4 border-b border-white/5">Fiyat-süre dengesi, sezon boyu kesintisiz izleme</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 border-b border-white/5 font-medium text-white">6 Ay</td>
                      <td className="px-5 py-4 border-b border-white/5">Düzenli izleyen haneler</td>
                      <td className="px-5 py-4 border-b border-white/5">Yenileme derdi olmadan yarım yıl</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 border-b border-white/5 font-medium text-white">12 Ay</td>
                      <td className="px-5 py-4 border-b border-white/5">Günlük izleyenler ve aileler</td>
                      <td className="px-5 py-4 border-b border-white/5">En düşük aylık maliyet, en yüksek tasarruf</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-[#e50914]/5 to-transparent">
                      <td className="px-5 py-4 font-bold text-[#e50914]">15 Ay VIP ⭐</td>
                      <td className="px-5 py-4">Maksimum tasarruf ve kesintisiz deneyim isteyenler</td>
                      <td className="px-5 py-4">En uzun süre, en düşük aylık maliyet, VIP ayrıcalıklar</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-slate-400 leading-relaxed">
                Tablodaki özet süre bazlı seçim mantığını gösterir; güncel fiyat ve kullanıcı sayısı detaylarını
                sayfanın üst bölümündeki paket kartlarında bulabilirsiniz. Kartlardaki "popüler" rozeti,
                müşterilerimizin en çok tercih ettiği süreyi işaretler. Kararsız kalırsanız ücretsiz test hesabıyla
                yayını kendi cihazınızda deneyip öyle karar vermenizi öneririz.
              </p>
            </div>
          </section>

          {/* Paketler hakkında SSS — PACKAGES_FAQ_ITEMS ile birebir aynı içerik */}
          <section className="py-16 border-t border-white/5">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold mb-10 text-white">Paketler Hakkında Sık Sorulan Sorular</h2>
              <div className="space-y-6">
                {PACKAGES_FAQ_ITEMS.map(({ q, a }) => (
                  <div key={q} className="bg-[#0a0a0a]/40 p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">{q}</h3>
                    <p className="text-slate-300 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer contactData={safeSiteData.contactData} siteData={safeSiteData} />

        {safeSiteData.chatBotData?.enabled && (
          <ChatBot chatData={safeSiteData.chatBotData} contactData={safeSiteData.contactData} />
        )}
      </div>
    </>
  );
};

export default memo(PackagesPage);