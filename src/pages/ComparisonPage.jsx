import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { Check, X, Star, Zap } from 'lucide-react';

const ComparisonPage = ({ siteData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeSiteData = siteData || {};
  const metadata = {
    title: "IPTV Paketleri Karşılaştırması | Hangisi Sizin İçin Uygun?",
    description: "IPTV paketlerini karşılaştırın. Temel, Standart, Premium paketlerin özellikleri, fiyatları, avantajları ve tüm detayları.",
    keywords: ["IPTV paketleri", "IPTV fiyatları", "IPTV karşılaştırması", "en iyi IPTV", "kaliteli IPTV"],
    ogType: "article"
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "IPTV Paketleri Karşılaştırması - Hangisi Sizin İçin Uygun?",
      "author": { "@type": "Organization", "name": "QruzeHD" }
    }
  ];

  const features = [
    { name: "Canlı Kanal Sayısı", basic: "8,000+", standard: "12,000+", premium: "15,000+" },
    { name: "Film & Dizi Arşivi", basic: "Sınırlı (Eski İçerik)", standard: "Kapsamlı (Güncel)", premium: "Sınırsız (VIP VOD)" },
    { name: "Yayın Çözünürlüğü", basic: "SD & HD", standard: "FHD", premium: "4K & UHD Seçenekli" },
    { name: "Donma Önleyici Altyapı", basic: false, standard: true, premium: true },
    { name: "Geriye Dönük İzleme (Catch-up)", basic: false, standard: "24 Saat", premium: "72 Saat" },
    { name: "Çoklu Cihaz Desteği", basic: "Sadece 1", standard: "1", premium: "2 (Aynı Anda)" },
    { name: "Yetişkin (Adult) Kanallar", basic: "Yok", standard: "Opsiyonel", premium: "Şifreli (Ücretsiz)" },
    { name: "Öncelikli WhatsApp Destek", basic: false, standard: false, premium: true },
  ];

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col font-sans text-white">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
        
        <main className="flex-grow pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <BreadcrumbNavigation />
            
            <article className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-12 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 leading-tight">
                IPTV Paketleri Karşılaştırması - Hangisi Sizin İçin Uygun?
              </h1>
              
              <div className="prose prose-invert prose-lg max-w-none mb-12">
                <p className="text-slate-300 leading-relaxed">
                  İhtiyacınıza en uygun, bütçenizi yormayan ve kesintisiz eğlence sunan <strong>en iyi IPTV</strong> paketini seçmek zor olabilir. Bu rehberde, sunduğumuz tüm <strong>IPTV paketleri</strong> arasındaki farkları tablo ve açıklamalar halinde detaylıca sunuyoruz. Kapsamlı <strong>IPTV karşılaştırması</strong> sayesinde <strong>kaliteli IPTV</strong> deneyimi için en doğru kararı verebilirsiniz.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700/50 pb-2">Paket Karşılaştırması Neden Önemli?</h2>
              <p className="text-slate-300 mb-10">Her kullanıcının yayın tüketim alışkanlığı farklıdır. Kimi kullanıcılar sadece hafta sonu derbi maçlarını takip etmek isterken, kimi kullanıcılar ev sinema sisteminde 4K film arşivi tüketmek isteyebilir. Paket karşılaştırması, izlemeyeceğiniz içeriklere veya kullanmayacağınız özelliklere fazla para ödemenizi engeller.</p>

              {/* Comparison Table */}
              <div className="overflow-x-auto mb-16 rounded-xl border border-slate-700">
                <table className="w-full text-left border-collapse bg-slate-800/30">
                  <thead>
                    <tr>
                      <th className="p-4 bg-slate-900 text-slate-300 font-bold border-b border-slate-700">Özellikler</th>
                      <th className="p-4 bg-slate-900 text-center font-bold border-b border-slate-700 text-slate-300">Temel Paket</th>
                      <th className="p-4 bg-slate-900 text-center font-bold border-b border-slate-700 text-blue-400">
                        <div className="flex items-center justify-center gap-1"><Zap className="w-4 h-4"/> Standart</div>
                      </th>
                      <th className="p-4 bg-slate-900 text-center font-bold border-b border-slate-700 text-yellow-400">
                        <div className="flex items-center justify-center gap-1"><Star className="w-4 h-4"/> Premium VIP</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 text-slate-300 font-medium">{feature.name}</td>
                        <td className="p-4 text-center text-slate-400">
                          {typeof feature.basic === 'boolean' ? (feature.basic ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : feature.basic}
                        </td>
                        <td className="p-4 text-center text-slate-200">
                          {typeof feature.standard === 'boolean' ? (feature.standard ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : feature.standard}
                        </td>
                        <td className="p-4 text-center font-bold text-yellow-100">
                          {typeof feature.premium === 'boolean' ? (feature.premium ? <Check className="w-5 h-5 text-yellow-400 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />) : feature.premium}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Temel Paket Özellikleri</h2>
              <p className="text-slate-300 mb-8">Temel paketimiz, IPTV dünyasına yeni giriş yapan ve bütçe dostu bir seçenek arayanlar için idealdir. Spor kanalları ve ulusal kanallar yer alır. Ancak dizi/film arşivi (VOD) daha sınırlıdır ve 4K çözünürlük desteği bulunmaz.</p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Standart Paket Özellikleri</h2>
              <p className="text-slate-300 mb-8">Müşterilerimizin %70'i tarafından tercih edilen Standart paket, Full HD yayın kalitesi ve donma önleyici özel sunucu altyapısına sahiptir. Kaçırdığınız dizileri veya maçları 24 saat geriye dönük (Catch-up) izleyebilirsiniz.</p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Premium VIP Paket Özellikleri</h2>
              <p className="text-slate-300 mb-8">Kaliteden asla ödün vermek istemeyenlerin seçimidir. Aynı anda 2 farklı cihazdan (farklı IP'lerden olsa bile) izleme imkanı sunar. Sınırsız güncel 4K film arşivi, 72 saate kadar geri sarma ve teknik destek taleplerinde öncelik içerir.</p>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Hangi Paket Sizin İçin Uygun? (Paket Seçimi İçin İpuçları)</h2>
              <ul className="list-disc pl-6 text-slate-300 space-y-2 mb-8">
                <li>Eğer sadece haber kanalları ve temel spor müsabakaları ile ilgileniyorsanız: <strong>Temel Paket</strong></li>
                <li>Geniş bir akıllı TV'niz var ve Full HD kalitede sorunsuz maç, güncel sinema keyfi istiyorsanız: <strong>Standart Paket</strong></li>
                <li>Kalabalık bir aileniz var, hem siz evde TV'den maç izlerken çocuğunuz tabletinden çizgi film izleyecekse: <strong>Premium VIP Paket</strong></li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Paket Yükseltme ve Düşürme (Paket Değişikliği Nasıl Yapılır?)</h2>
              <p className="text-slate-300 mb-8">Aboneliğiniz süresince ihtiyaçlarınız değişebilir. Temel paketten Standart veya Premium pakete yükseltme işlemi yapmak (Upgrade) istediğinizde, aradaki fiyat farkını ödeyerek anında paketinizi büyütebilirsiniz. Paket düşürme işlemleri (Downgrade) ise sadece abonelik yenileme dönemlerinde yapılabilmektedir. Değişiklik taleplerinizi WhatsApp destek hattımıza iletebilirsiniz.</p>

              <div className="mt-12 p-8 bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-wrap gap-4">
                <Link to="/paketler" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors">Paketleri Satın Al</Link>
                <Link to="/kurulum" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors border border-slate-600">Kurulum Adımları</Link>
                <Link to="/sss" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors border border-slate-600">SSS</Link>
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