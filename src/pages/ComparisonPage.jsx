import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { Check, X, Star, Zap } from 'lucide-react';
import { breadcrumbSchema } from '@/utils/seoSchema';
import { SITE_URL } from '@/constants/siteUrl';

const ComparisonPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: 'En Kaliteli IPTV Hangisi? 2026 Karşılaştırma + Fiyatlar | QruzeTV',
    description:
      'Farklı IPTV paketlerini ve özelliklerini karşılaştırın. HD vs 4K, kanal sayıları ve fiyat analizi. En iyi IPTV deneyimi için doğru seçimi yapın.',
    keywords: ['IPTV paketleri', 'IPTV fiyatları', 'IPTV karşılaştırması', 'en iyi IPTV', 'IPTV paket seçimi'],
    ogType: 'article',
    ogImage: `${SITE_URL}/og/karsilastirma.jpg`,
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Paketler', path: '/paketler' },
    { name: 'Karşılaştırma', path: '/karsilastirma' },
  ]);
  const jsonLd = [
    breadcrumb,
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'En Kaliteli IPTV Hangisi? 2026 Karşılaştırma + Fiyatlar',
      author: { '@type': 'Organization', name: 'QruzeTV' },
    },
  ];

  const features = [
    { name: 'Canlı Kanal Sayısı', basic: '10.000+', standard: '10.000+', premium: '10.000+' },
    { name: 'Film & Dizi Arşivi', basic: 'Sınırlı (Eski İçerik)', standard: 'Kapsamlı (Güncel)', premium: 'Sınırsız (VIP VOD)' },
    { name: 'Yayın Çözünürlüğü', basic: 'SD & HD', standard: 'FHD', premium: '4K & UHD Seçenekli' },
    { name: 'Donma Önleyici Altyapı', basic: false, standard: true, premium: true },
    { name: 'Geriye Dönük İzleme (Catch-up)', basic: false, standard: '24 Saat', premium: '72 Saat' },
    { name: 'Çoklu Cihaz Desteği', basic: '1 Cihaz', standard: '1 Cihaz', premium: '1 Cihaz (Opsiyonel 2 Giriş)' },
    { name: 'Yetişkin (Adult) Kanallar', basic: 'Yok', standard: 'Opsiyonel', premium: 'Şifreli (Ücretsiz)' },
    { name: 'Öncelikli WhatsApp Destek', basic: false, standard: false, premium: true },
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />

        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <BreadcrumbNavigation />

            <article className="mt-8 bg-[#0a0a0a]/50 border border-slate-800 rounded-2xl p-6 md:p-12 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] to-[#b20710] leading-tight">
                IPTV Paketleri Karşılaştırması - Hangisi Sizin İçin Uygun?
              </h1>

              <div className="prose prose-invert prose-lg max-w-none mb-12">
                <p className="text-slate-300 leading-relaxed">
                  İhtiyacınıza en uygun, bütçenizi yormayan ve kesintisiz eğlence sunan <strong>en iyi IPTV</strong> paketini seçmek zor olabilir. Bu rehberde, sunduğumuz tüm <strong>IPTV paketleri</strong> arasındaki farkları tablo ve açıklamalar halinde detaylıca sunuyoruz. Kapsamlı <strong>IPTV karşılaştırması</strong> sayesinde bütçenize ve izleme alışkanlıklarınıza en uygun kararı verebilirsiniz.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-2">Paket Karşılaştırması Neden Önemli?</h2>
              <p className="text-slate-300 mb-10">
                Her kullanıcının yayın tüketim alışkanlığı farklıdır. Kimi kullanıcılar sadece hafta sonu derbi maçlarını takip etmek isterken, kimi kullanıcılar ev sinema sisteminde 4K film arşivi tüketmek isteyebilir. Paket karşılaştırması, izlemeyeceğiniz içeriklere veya kullanmayacağınız özelliklere fazla para ödemenizi engeller.
              </p>

              <div className="overflow-x-auto mb-16 rounded-xl border border-slate-700">
                <table className="w-full text-left border-collapse bg-[#0a0a0a]/30">
                  <thead>
                    <tr>
                      <th className="p-4 bg-[#0a0a0a] text-slate-300 font-bold border-b border-slate-700">Özellikler</th>
                      <th className="p-4 bg-[#0a0a0a] text-center font-bold border-b border-slate-700 text-slate-300">Temel Paket</th>
                      <th className="p-4 bg-[#0a0a0a] text-center font-bold border-b border-slate-700 text-blue-400">
                        <div className="flex items-center justify-center gap-1">
                          <Zap className="w-4 h-4" /> Standart
                        </div>
                      </th>
                      <th className="p-4 bg-[#0a0a0a] text-center font-bold border-b border-slate-700 text-yellow-400">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4" /> Premium VIP
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-[#0a0a0a]/50 transition-colors">
                        <td className="p-4 text-slate-300 font-medium">{feature.name}</td>
                        <td className="p-4 text-center text-slate-400">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            feature.basic
                          )}
                        </td>
                        <td className="p-4 text-center text-slate-200">
                          {typeof feature.standard === 'boolean' ? (
                            feature.standard ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            feature.standard
                          )}
                        </td>
                        <td className="p-4 text-center font-bold text-yellow-100">
                          {typeof feature.premium === 'boolean' ? (
                            feature.premium ? (
                              <Check className="w-5 h-5 text-yellow-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            feature.premium
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Temel Paket Özellikleri</h2>
              <p className="text-slate-300 mb-8">
                Temel paketimiz, IPTV dünyasına yeni giriş yapan ve bütçe dostu bir seçenek arayanlar için idealdir. Spor kanalları ve ulusal kanallar yer alır. Ancak dizi/film arşivi (VOD) daha sınırlıdır ve 4K çözünürlük desteği bulunmaz.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Standart Paket Özellikleri</h2>
              <p className="text-slate-300 mb-8">
                Müşterilerimizin %70&apos;i tarafından tercih edilen Standart paket, Full HD yayın kalitesi ve donma önleyici özel sunucu altyapısına sahiptir. Kaçırdığınız dizileri veya maçları 24 saat geriye dönük (Catch-up) izleyebilirsiniz.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Premium VIP Paket Özellikleri</h2>
              <p className="text-slate-300 mb-8">
                Kaliteden asla ödün vermek istemeyenlerin seçimidir. 12 aylık tercihlerde opsiyonel çift giriş (2 cihaz) seçeneğiyle ailenizle eşzamanlı izleme imkanı sunar. Sınırsız güncel 4K film arşivi, 72 saate kadar geri sarma ve teknik destek taleplerinde VIP öncelik içerir.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Hangi Paket Sizin İçin Uygun? (Paket Seçimi İçin İpuçları)</h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-2 mb-8">
                <li>Eğer sadece haber kanalları ve temel spor müsabakaları ile ilgileniyorsanız: <strong>Temel Paket</strong></li>
                <li>Geniş bir akıllı TV&apos;niz var ve Full HD kalitede sorunsuz maç, güncel sinema keyfi istiyorsanız: <strong>Standart Paket</strong></li>
                <li>Kalabalık bir aileniz var, hem salonda TV&apos;den maç izlenirken diğer odada film izlensin istiyorsanız: <strong>Premium VIP Paket (Çift Giriş Seçeneği ile)</strong></li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Paket Yükseltme ve Düşürme (Paket Değişikliği Nasıl Yapılır?)</h2>
              <p className="text-slate-300 mb-8">
                Aboneliğiniz süresince ihtiyaçlarınız değişebilir. Temel paketten Standart veya Premium pakete yükseltme işlemi yapmak (Upgrade) istediğinizde, aradaki fiyat farkını ödeyerek anında paketinizi büyütebilirsiniz. Paket düşürme işlemleri (Downgrade) ise sadece abonelik yenileme dönemlerinde yapılabilmektedir. Değişiklik taleplerinizi WhatsApp destek hattımıza iletebilirsiniz.
              </p>

              <div className="mt-12 p-8 bg-[#0a0a0a]/50 rounded-2xl border border-slate-700 flex flex-wrap gap-4">
                <Link to="/paketler/" className="px-6 py-3 bg-primary hover:bg-primary text-white font-bold rounded-lg transition-colors">
                  Paketleri Satın Al
                </Link>
                <Link
                  to="/kurulum/"
                  className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600"
                >
                  Kurulum Adımları
                </Link>
                <Link
                  to="/sss/"
                  className="px-6 py-3 bg-[#0a0a0a] hover:bg-[#141414] text-white font-bold rounded-lg transition-colors border border-slate-600"
                >
                  SSS
                </Link>
              </div>
            </article>
          </div>
        </main>
        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default ComparisonPage;
