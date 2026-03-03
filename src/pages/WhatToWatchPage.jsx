
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SearchBar from '@/components/what-to-watch/SearchBar';
import FilterAndSort from '@/components/what-to-watch/FilterAndSort';
import TVShowsSection from '@/components/what-to-watch/TVShowsSection';
import MoviesSection from '@/components/what-to-watch/MoviesSection';
import TrendingContentSlider from '@/components/TrendingContentSlider';
import LoadingState from '@/components/what-to-watch/LoadingState';
import ErrorState from '@/components/what-to-watch/ErrorState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Film, Tv, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTrendingContent } from '@/hooks/useTrendingContent';

const WhatToWatchPage = ({ siteData }) => {
  const [activeTab, setActiveTab] = useState('movie');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  // Safely destructure hook return values with fallbacks to prevent undefined errors
  const { 
    data: trendingData, 
    movies: trendingMovies, 
    tvShows: trendingTvShows, 
    loading, 
    isLoading: hookIsLoading, 
    error, 
    refetch 
  } = useTrendingContent() || {};

  // Normalize loading state
  const isLoading = loading || hookIsLoading || false;

  // Defensive useMemo block with try-catch and array checks
  const combinedTrending = useMemo(() => {
    try {
      let combined = [];
      
      // If hook returns combined 'data' array
      if (Array.isArray(trendingData) && trendingData.length > 0) {
        combined = trendingData;
      } 
      // Fallback: If hook returns separate movies and tvShows arrays
      else {
        const safeMovies = Array.isArray(trendingMovies) ? trendingMovies : [];
        const safeTvShows = Array.isArray(trendingTvShows) ? trendingTvShows : [];
        
        combined = [
          ...safeMovies.map(m => ({ ...m, media_type: m?.media_type || 'movie' })),
          ...safeTvShows.map(t => ({ ...t, media_type: t?.media_type || 'tv' }))
        ];
      }

      // Return empty array if no valid data
      if (!combined || combined.length === 0) return [];

      return combined
        .filter(Boolean) // Remove any null/undefined items
        .map(item => ({
          ...item,
          media_type: item.media_type || (item.title ? 'movie' : 'tv')
        }))
        .sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0))
        .slice(0, 12);
    } catch (err) {
      console.error("Error processing trending content in useMemo:", err);
      return [];
    }
  }, [trendingData, trendingMovies, trendingTvShows]);

  const handleSearch = (query, type) => {
    setSearchQuery(query);
    if (type) setActiveTab(type);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-purple-500/30 selection:text-purple-200">
      <SEOHead 
        title="Ne İzlesem? IPTV'de En İyi Dizi ve Film Önerileri" 
        description="IPTV'de ne izleyeceğinize karar veremeyen misiniz? En iyi dizi ve film önerileri, 4K IPTV içerikleri ve canlı dizi önerileri için tıklayın." 
        keywords="ne izlesem, IPTV ne izlesem, en iyi IPTV içerikleri, IPTV film önerileri, canlı dizi önerileri IPTV, 4K IPTV, UHD IPTV"
      />
      <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

      <style>
        {`
          .premium-seo-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
            opacity: 0.95;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border-radius: 30px;
            background-blend-mode: overlay;
            max-width: 900px;
            margin: 0 auto;
            transition: all 0.3s ease;
          }
          @media (max-width: 767px) {
            .premium-seo-container { padding: 40px 20px; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .premium-seo-container { padding: 60px 30px; }
          }
          @media (min-width: 1024px) {
            .premium-seo-container { padding: 80px 40px; }
          }
          
          .premium-h1 {
            color: #ffffff;
            font-size: 42px;
            font-weight: 800;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            letter-spacing: 0.5px;
            margin-bottom: 30px;
            text-align: center;
          }
          @media (max-width: 767px) {
             .premium-h1 { font-size: 32px; }
          }
          
          .premium-h2 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            margin-top: 40px;
            margin-bottom: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 15px;
          }
          @media (max-width: 767px) {
             .premium-h2 { font-size: 24px; }
          }
          
          .premium-h3 {
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            margin-top: 25px;
            margin-bottom: 15px;
          }
          @media (max-width: 767px) {
             .premium-h3 { font-size: 18px; }
          }
          
          .premium-p {
            color: rgba(255, 255, 255, 0.95);
            font-size: 16px;
            line-height: 1.9;
            margin-bottom: 20px;
            text-align: justify;
            font-weight: 400;
          }
          
          .premium-link {
            color: #ffffff;
            text-decoration: underline;
            font-weight: 600;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: color 0.3s ease, text-shadow 0.3s ease;
          }
          .premium-link:hover {
            color: #ffd700;
          }
          
          .premium-btn {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #333333;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            text-decoration: none;
          }
          .premium-btn:hover {
            background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
            box-shadow: 0 12px 35px rgba(255, 215, 0, 0.6);
            transform: translateY(-2px);
          }
        `}
      </style>

      <main className="pt-32 pb-20">
        
        {/* Dynamic App Section - TOP - tek H1 sayfa başlığı (SEO) */}
        <section className="container mx-auto px-4 mb-6 text-center" aria-label="Sayfa başlığı">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">
              Ne İzlesem? IPTV'de En İyi Dizi ve Film Önerileri
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Binlerce içerik arasından senin için en iyi dizi ve filmleri anında bul.
            </p>
          </motion.div>
          <SearchBar onSearch={handleSearch} />
        </section>

        <section className="container mx-auto px-4 relative z-10">
          
          {/* Synchronized Trending Content Display */}
          {!searchQuery && (
            <div className="mb-8">
              {!(error || (combinedTrending.length === 0 && !isLoading)) && (
                <TrendingContentSlider 
                  title="Haftanın Popüler İçerikleri"
                  customItems={combinedTrending}
                  customLoading={isLoading}
                  customError={error}
                  customRefetch={refetch}
                />
              )}
              {combinedTrending.length === 0 && !isLoading && !error && (
                 <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">İçerik Bulunamadı</h3>
                    <p className="text-slate-400">Şu an için gösterilecek popüler içerik verisi bulunmuyor.</p>
                 </div>
              )}
            </div>
          )}

          <Tabs defaultValue="movie" value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQuery(''); }} className="w-full mt-12">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-slate-900 border border-slate-800 rounded-full p-1 h-auto shadow-lg">
                <TabsTrigger value="movie" className="data-[state=active]:bg-purple-600 px-6 py-2.5 rounded-full text-base font-bold data-[state=active]:text-white text-slate-400 transition-all">
                  <Film className="w-5 h-5 mr-2" /> Filmler
                </TabsTrigger>
                <TabsTrigger value="tv" className="data-[state=active]:bg-purple-600 px-6 py-2.5 rounded-full text-base font-bold data-[state=active]:text-white text-slate-400 transition-all">
                  <Tv className="w-5 h-5 mr-2" /> Diziler
                </TabsTrigger>
              </TabsList>
            </div>

            {!searchQuery && <FilterAndSort type={activeTab} onFilterChange={setFilters} />}

            <TabsContent value="movie" className="mt-0 outline-none">
              <MoviesSection filters={filters} searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="tv" className="mt-0 outline-none">
              <TVShowsSection filters={filters} searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </section>

        {/* SEO Content Section - BOTTOM */}
        <section className="container mx-auto px-4 mt-24 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="premium-seo-container"
          >
            <h2 className="premium-h1">
              IPTV'de Ne İzlesem? Rehber ve Öneriler
            </h2>
            
            <p className="premium-p">
              Günün yorgunluğunu atmak için televizyonun veya bilgisayarın karşısına geçtiğinizde aklınıza gelen ilk soru genellikle "ne izlesem?" olur. Günümüzde sayısız dijital platform ve binlerce kanal arasında seçim yapmak, çoğu zaman izleyeceğimiz içeriği seçmekten daha uzun sürebiliyor. İşte tam bu noktada, IPTV ne izlesem derdine son veren muazzam bir çözüm sunuyor. Sınırsız içerik kütüphanesi, dünyanın dört bir yanından gelen yayınlar ve her zevke hitap eden kategorilerle en iyi IPTV içerikleri parmaklarınızın ucunda. Bu rehberde, size ilham verecek harika öneriler sunarak ekran karşısında geçirdiğiniz zamanı çok daha kaliteli ve keyifli hale getireceğiz.
            </p>

            <h2 className="premium-h2">
              IPTV'de Ne İzlesem? Popüler Diziler
            </h2>
            <p className="premium-p">
              Dizi tutkunları için IPTV, adeta uçsuz bucaksız bir okyanustur. Dünyaca ünlü platformların en çok konuşulan dizilerinden, yerel yapımlara kadar her şeyi tek bir ekranda bulabilirsiniz. Peki, yüzlerce seçenek arasından IPTV dizi önerileri ararken nelere dikkat etmelisiniz? İşte sizin için derlediğimiz öne çıkan dizi kategorileri:
            </p>

            <h3 className="premium-h3">
              Türk Dizileri
            </h3>
            <p className="premium-p">
              Türkiye'nin her akşam ekranlara kilitlendiği, dramdan komediye, tarihi epik yapımlardan gençlik dizilerine kadar sayısız yerli yapımı kesintisiz olarak izleyebilirsiniz. Kaçırdığınız son bölümler, efsaneleşmiş eski diziler ve dijital platformlara özel çekilen yeni nesil Türk dizileri, IPTV ile dilediğiniz an karşınızda. Ailece izleyebileceğiniz sıcak hikayeler veya nefes kesen polisiye kurgularla yerli yapımların tadını çıkarın.
            </p>

            <h3 className="premium-h3">
              Yabancı Dizileri
            </h3>
            <p className="premium-p">
              Global televizyon trendlerini yakından takip edenler için yabancı diziler vazgeçilmezdir. Emmy ödüllü dramalar, dünyayı kasıp kavuran bilim kurgu efsaneleri, akıl almaz gerilim hikayeleri ve kahkaha tufanı yaratan sitcom'lar... En popüler yabancı dizileri eş zamanlı olarak veya tüm sezonlarıyla birlikte maraton (binge-watching) şeklinde izleyebilirsiniz. Altyazı veya dublaj seçenekleriyle dünya standartlarında bir dizi deneyimi sizi bekliyor.
            </p>

            <h3 className="premium-h3">
              Belgesel Dizileri
            </h3>
            <p className="premium-p">
              Eğlenirken öğrenmeyi seven, dünyanın gizemlerine, tarihin karanlık sayfalarına veya doğanın muhteşem güzelliklerine merak duyanlar için belgesel dizileri harika bir alternatiftir. Suç belgesellerinden doğa keşiflerine, teknolojik yeniliklerden tarihi olaylara kadar en kaliteli belgesel kanalları ve VOD içerikleri IPTV sisteminizde her an erişime açıktır.
            </p>

            <h2 className="premium-h2">
              En İyi IPTV Film Önerileri
            </h2>
            <p className="premium-p">
              Sinema salonunu evinize getirmek istediğinizde IPTV film önerileri listemiz imdadınıza yetişiyor. Vizyondan yeni çıkmış en son filmlerden, sinema tarihinin kültleşmiş başyapıtlarına kadar binlerce seçenek arasından kolayca tercih yapabilirsiniz. IPTV film izle ayrıcalığı ile donma ve takılma olmadan mükemmel bir sinema gecesi planlayın.
            </p>

            <h3 className="premium-h3">
              Aksiyon Filmleri
            </h3>
            <p className="premium-p">
              Adrenalini doruklarda hissetmek isteyenler için aksiyon filmleri kategorisi tam bir görsel şölen sunar. Patlamalar, nefes kesen kovalamacalar, süper kahramanların epik savaşları ve casusluk hikayeleri... Ses sisteminizi sonuna kadar açıp, yüksek çözünürlüklü aksiyon filmleriyle koltuğunuzun ucunda heyecan dolu saatler geçirebilirsiniz.
            </p>

            <h3 className="premium-h3">
              Dram Filmleri
            </h3>
            <p className="premium-p">
              Derin karakter analizleri, duygu yüklü senaryolar ve unutulmaz oyunculuk performansları arıyorsanız, dram filmleri kategorisine göz atmalısınız. Gerçek hayat hikayelerinden uyarlanan yapımlar, Oscar ödüllü dramalar ve kalbinize dokunacak hikayeler, IPTV'nin geniş VOD (Seç İzle) arşivinde sizleri bekliyor.
            </p>

            <h3 className="premium-h3">
              Komedi Filmleri
            </h3>
            <p className="premium-p">
              Komedi filmleri, günlük hayatın stresinden uzaklaşmak ve bolca kahkaha atmak için en iyi ilaçtır. Romantik komedilerden durum komedilerine, kara mizahtan absürt kurgulara kadar yüzünüzü güldürecek en iyi komedi filmlerine anında ulaşın. Arkadaşlarınızla veya ailenizle geçireceğiniz film geceleri için mükemmel bir tercih.
            </p>

            <h2 className="premium-h2">
              4K IPTV ve UHD IPTV İçerikleri
            </h2>
            <p className="premium-p">
              İçerik zenginliği kadar, izlediğiniz yayının görüntü kalitesi de seyir zevkini belirleyen en önemli unsurlardan biridir. Gelişen teknolojiyle birlikte 4K IPTV teknolojisi, televizyon izleme alışkanlıklarımızı tamamen değiştirdi. Yüksek çözünürlüklü ekranlarınızın tam potansiyelini kullanmak için 4K yayınlar vazgeçilmezdir.
            </p>

            <h3 className="premium-h3">
              4K Kalitesinde Dizi İzleme
            </h3>
            <p className="premium-p">
              En sevdiğiniz dizilerin her sahnesini, karakterlerin mimiklerini, mekanların eşsiz detaylarını 4K (Ultra HD) kalitesinde izlemek, kendinizi hikayenin tam ortasında hissetmenizi sağlar. Güçlü bir internet bağlantısıyla, desteklenen cihazlarınızda hiçbir detay kaybolmadan, en ince ayrıntısına kadar net bir dizi izleme deneyimi yaşayabilirsiniz.
            </p>

            <h3 className="premium-h3">
              UHD IPTV Avantajları
            </h3>
            <p className="premium-p">
              UHD IPTV, standart HD yayınların dört katı daha fazla piksel sunarak benzersiz bir derinlik ve renk doğruluğu yaratır. Özellikle spor müsabakaları, belgeseller ve görsel efekt ağırlıklı filmlerde UHD kalitesinin farkı muazzamdır. Akıcı kare hızları ve geniş renk yelpazesi sayesinde ekrandaki görüntüler adeta camın dışına taşar. Premium IPTV altyapımızla 4K yayınların kesintisiz ve akıcı keyfine varın.
            </p>

            <h2 className="premium-h2">
              Canlı Dizi Önerileri IPTV'de
            </h2>
            <p className="premium-p">
              Sadece isteğe bağlı (VOD) içerikler değil, aynı zamanda canlı yayın akışları da IPTV'nin en güçlü yönlerindendir. Canlı dizi önerileri IPTV sayesinde, dünyanın farklı ülkelerindeki televizyon kanallarını anında izleyebilirsiniz. Örneğin; Amerika'da yayınlanan popüler bir dizinin yeni bölümünü, yayınlandığı an kendi saat diliminizde canlı olarak takip etme şansına sahipsiniz. En iyi IPTV kanalları listesinde yer alan premium eğlence, sinema ve dizi kanalları, 7/24 kesintisiz bir yayın akışı sunarak televizyon kumandasını elinizden bırakmanıza engel olacak. Zamanı yönetin, ister canlı yayında heyecana ortak olun, ister yayını geri sararak kaçırdığınız anları yakalayın.
            </p>

            <h2 className="premium-h2">
              IPTV Paketleri ile Sınırsız İçerik
            </h2>
            <p className="premium-p">
              "Ne izlesem?" sorusunu bir daha asla sormamak, yüzlerce kategoride binlerce güncel içeriğe anında ulaşmak için doğru yerdesiniz. Gelişmiş sunucularımız, anti-freeze (donma önleyici) teknolojimiz ve devasa VOD/Canlı Kanal arşivimizle sizlere eşsiz bir dijital eğlence dünyası sunuyoruz. Spor, belgesel, sinema, çocuk kanalları ve çok daha fazlası tek bir abonelikte birleşiyor.
            </p>
            <p className="premium-p mb-8">
              Hemen şimdi bütçenize ve ihtiyaçlarınıza en uygun çözümü bulmak için detaylı olarak hazırladığımız <Link to="/packages" className="premium-link">IPTV paketleri</Link> sayfamızı ziyaret edin. Sizin için hazırladığımız özel paketlerimiz ile televizyonunuzu, tabletinizi veya akıllı telefonunuzu eksiksiz bir eğlence merkezine dönüştürebilirsiniz.
            </p>

            <div className="text-center mt-10">
              <Link 
                to="/packages" 
                className="premium-btn"
              >
                <Play className="w-5 h-5 fill-current" /> Paketleri İncele
              </Link>
            </div>
          </motion.div>
        </section>

      </main>

      <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
    </div>
  );
};

export default WhatToWatchPage;
