
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { whatToWatchPageSchemas } from '@/utils/seoSchema';
import SearchBar from '@/components/what-to-watch/SearchBar';
import FilterAndSort from '@/components/what-to-watch/FilterAndSort';
import TVShowsSection from '@/components/what-to-watch/TVShowsSection';
import MoviesSection from '@/components/what-to-watch/MoviesSection';
import TrendingContentSlider from '@/components/TrendingContentSlider';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import CategoryLinksBar from '@/components/what-to-watch-category/CategoryLinksBar';
import { SITE_URL } from '@/constants/siteUrl';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Film, Tv, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTrendingContent } from '@/hooks/useTrendingContent';

/** Sinematik noise (feTurbulence tabanlı SVG) */
const CINEMA_NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

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

  const metadata = {
    title: "Ne İzlesem? IPTV'de En İyi Dizi ve Film Önerileri | QruzeTV",
    description: "IPTV'de ne izleyeceğinize karar veremeyen misiniz? En iyi dizi ve film önerileri, 4K IPTV içerikleri ve canlı dizi önerileri için tıklayın.",
    keywords: ["ne izlesem", "IPTV ne izlesem", "en iyi IPTV içerikleri", "IPTV film önerileri", "canlı dizi önerileri IPTV", "4K IPTV", "UHD IPTV"],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Ne İzlesem sayfasında film ve dizi önerileri nasıl seçiliyor?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sayfa; popülerlik, puan ve kullanıcı aramasına göre film ve dizi önerilerini listeler. Böylece IPTV için hızlı içerik keşfi yapabilirsiniz.',
        },
      },
      {
        '@type': 'Question',
        name: 'Film ve dizi detay sayfalarında benzersiz içerik var mı?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Evet. Her detay sayfasında içerik özeti, puan, oyuncular ve benzer içerikler yer alır.',
        },
      },
      {
        '@type': 'Question',
        name: 'Ne İzlesem sayfasından IPTV paketlerine geçiş yapabilir miyim?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Evet. Sayfadan doğrudan QruzeTV paketler sayfasına, ana sayfaya ve içerik detaylarına geçebilirsiniz.',
        },
      },
    ],
  };
  const jsonLd = [...whatToWatchPageSchemas(metadata), faqSchema];

  return (
    <>
      {/* Hub /ne-izlesem indexlenir; TMDB film/dizi detayları WhatToWatchDetailPage’de noindex */}
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/ne-izlesem`} jsonLd={jsonLd} />

      <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] font-sans text-white selection:bg-[#e50914]/25 selection:text-white">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[#0a0a0a]" aria-hidden />
        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.045] mix-blend-overlay"
          style={{ backgroundImage: CINEMA_NOISE_DATA_URI, backgroundSize: '200px 200px' }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-screen flex-col bg-[#0a0a0a]">
          <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

          <main className="mx-auto w-full max-w-7xl flex-grow bg-[#0a0a0a] px-5 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-10">
            <BreadcrumbNavigation
              tone="cinema"
              className="py-3 sm:py-4"
              listClassName="text-[0.8125rem] sm:text-sm opacity-90"
              customCrumbs={[
                { name: 'Ana Sayfa', path: '/' },
                { name: 'Ne İzlesem', path: null },
              ]}
            />

            <section className="mb-8 bg-[#0a0a0a] text-center" aria-label="Sayfa başlığı">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <h1
                  className="font-extrabold tracking-tight text-white"
                  style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.35rem)', lineHeight: 1.2 }}
                >
                  <span className="text-[#e50914]">Ne İzlesem?</span> IPTV&apos;de En İyi Dizi ve Film Önerileri
                </h1>
                <div
                  className="mx-auto mt-4 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#e50914]/45 to-transparent shadow-[0_0_14px_rgba(229,9,20,0.35)]"
                  aria-hidden
                />
                <p className="mx-auto mt-5 max-w-2xl text-base text-white/55 sm:text-lg">
                  Binlerce içerik arasından senin için en iyi dizi ve filmleri anında bul.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                  <Link to="/" className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline">
                    Ana sayfa
                  </Link>
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                  <Link to="/paketler/" className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline">
                    IPTV paketleri
                  </Link>
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('movie')}
                    className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    Popüler filmler
                  </button>
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('tv')}
                    className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    Popüler diziler
                  </button>
                </div>
              </motion.div>
            </section>

            <div className="mb-10 rounded-2xl border border-white/[0.12] bg-white/[0.06] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[12px] sm:p-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            <CategoryLinksBar lang="tr" />

            <section className="relative z-10">
              {!searchQuery && (
                <div className="mb-10">
                  <TrendingContentSlider
                    title="Haftanın Popüler İçerikleri"
                    customItems={combinedTrending}
                    customLoading={isLoading}
                    customError={combinedTrending.length > 0 ? null : error}
                    customRefetch={refetch}
                  />
                </div>
              )}

              <Tabs
                defaultValue="movie"
                value={activeTab}
                onValueChange={(v) => {
                  setActiveTab(v);
                  setSearchQuery('');
                }}
                className="w-full"
              >
                <div className="mb-8 flex justify-center">
                  <TabsList className="h-auto gap-1 rounded-2xl border border-white/[0.12] bg-black/25 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-1 ring-white/[0.08] backdrop-blur-sm">
                    <TabsTrigger
                      value="movie"
                      className="rounded-xl px-6 py-2.5 text-base font-bold text-white/55 transition-all data-[state=active]:bg-[linear-gradient(135deg,#e50914,#b20710)] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(229,9,20,0.45),0_0_26px_rgba(229,9,20,0.3)] data-[state=active]:ring-1 data-[state=active]:ring-[#e50914]/35 data-[state=inactive]:hover:bg-white/[0.08] data-[state=inactive]:hover:text-white"
                    >
                      <Film className="mr-2 h-5 w-5" /> Filmler
                    </TabsTrigger>
                    <TabsTrigger
                      value="tv"
                      className="rounded-xl px-6 py-2.5 text-base font-bold text-white/55 transition-all data-[state=active]:bg-[linear-gradient(135deg,#e50914,#b20710)] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_18px_rgba(229,9,20,0.45),0_0_26px_rgba(229,9,20,0.3)] data-[state=active]:ring-1 data-[state=active]:ring-[#e50914]/35 data-[state=inactive]:hover:bg-white/[0.08] data-[state=inactive]:hover:text-white"
                    >
                      <Tv className="mr-2 h-5 w-5" /> Diziler
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

            <section className="mb-8 mt-20 sm:mt-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="mx-auto max-w-4xl rounded-2xl border border-white/[0.12] bg-white/[0.06] px-5 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[12px] sm:px-8 sm:py-10"
              >
                <h2 className="mb-8 bg-gradient-to-r from-[#0a0a0a] via-[#e50914] to-[#b20710] bg-clip-text text-center text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                  IPTV&apos;de Ne İzlesem? Rehber ve Öneriler
                </h2>

                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Günün yorgunluğunu atmak için televizyonun veya bilgisayarın karşısına geçtiğinizde aklınıza gelen ilk soru genellikle &quot;ne izlesem?&quot; olur. Günümüzde sayısız dijital platform ve 10.000+ kanal arasında seçim yapmak, çoğu zaman izleyeceğimiz içeriği seçmekten daha uzun sürebiliyor. İşte tam bu noktada, IPTV ne izlesem derdine son veren muazzam bir çözüm sunuyor. Sınırsız içerik kütüphanesi, dünyanın dört bir yanından gelen yayınlar ve her zevke hitap eden kategorilerle en iyi IPTV içerikleri parmaklarınızın ucunda. Bu rehberde, size ilham verecek harika öneriler sunarak ekran karşısında geçirdiğiniz zamanı çok daha kaliteli ve keyifli hale getireceğiz.
                </p>

                <h2 className="mt-10 border-b border-white/10 pb-3 text-xl font-bold text-white/95 sm:text-2xl">
                  IPTV&apos;de Ne İzlesem? Popüler Diziler
                </h2>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Dizi tutkunları için IPTV, adeta uçsuz bucaksız bir okyanustur. Dünyaca ünlü platformların en çok konuşulan dizilerinden, yerel yapımlara kadar her şeyi tek bir ekranda bulabilirsiniz. Peki, yüzlerce seçenek arasından IPTV dizi önerileri ararken nelere dikkat etmelisiniz? İşte sizin için derlediğimiz öne çıkan dizi kategorileri:
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">Türk Dizileri</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Türkiye&apos;nin her akşam ekranlara kilitlendiği, dramdan komediye, tarihi epik yapımlardan gençlik dizilerine kadar sayısız yerli yapımı kesintisiz olarak izleyebilirsiniz. Kaçırdığınız son bölümler, efsaneleşmiş eski diziler ve dijital platformlara özel çekilen yeni nesil Türk dizileri, IPTV ile dilediğiniz an karşınızda. Ailece izleyebileceğiniz sıcak hikayeler veya nefes kesen polisiye kurgularla yerli yapımların tadını çıkarın.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">Yabancı Dizileri</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Global televizyon trendlerini yakından takip edenler için yabancı diziler vazgeçilmezdir. Emmy ödüllü dramalar, dünyayı kasıp kavuran bilim kurgu efsaneleri, akıl almaz gerilim hikayeleri ve kahkaha tufanı yaratan sitcom&apos;lar... En popüler yabancı dizileri eş zamanlı olarak veya tüm sezonlarıyla birlikte maraton (binge-watching) şeklinde izleyebilirsiniz. Altyazı veya dublaj seçenekleriyle dünya standartlarında bir dizi deneyimi sizi bekliyor.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">Belgesel Dizileri</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Eğlenirken öğrenmeyi seven, dünyanın gizemlerine, tarihin karanlık sayfalarına veya doğanın muhteşem güzelliklerine merak duyanlar için belgesel dizileri harika bir alternatiftir. Suç belgesellerinden doğa keşiflerine, teknolojik yeniliklerden tarihi olaylara kadar en kaliteli belgesel kanalları ve VOD içerikleri IPTV sisteminizde her an erişime açıktır.
                </p>

                <h2 className="mt-10 border-b border-white/10 pb-3 text-xl font-bold text-white/95 sm:text-2xl">
                  En İyi IPTV Film Önerileri
                </h2>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Sinema salonunu evinize getirmek istediğinizde IPTV film önerileri listemiz imdadınıza yetişiyor. Vizyondan yeni çıkmış en son filmlerden, sinema tarihinin kültleşmiş başyapıtlarına kadar binlerce seçenek arasından kolayca tercih yapabilirsiniz. IPTV film izle ayrıcalığı ile donma ve takılma olmadan mükemmel bir sinema gecesi planlayın.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">Aksiyon Filmleri</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Adrenalini doruklarda hissetmek isteyenler için aksiyon filmleri kategorisi tam bir görsel şölen sunar. Patlamalar, nefes kesen kovalamacalar, süper kahramanların epik savaşları ve casusluk hikayeleri... Ses sisteminizi sonuna kadar açıp, yüksek çözünürlüklü aksiyon filmleriyle koltuğunuzun ucunda heyecan dolu saatler geçirebilirsiniz.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">Dram Filmleri</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Derin karakter analizleri, duygu yüklü senaryolar ve unutulmaz oyunculuk performansları arıyorsanız, dram filmleri kategorisine göz atmalısınız. Gerçek hayat hikayelerinden uyarlanan yapımlar, Oscar ödüllü dramalar ve kalbinize dokunacak hikayeler, IPTV&apos;nin geniş VOD (Seç İzle) arşivinde sizleri bekliyor.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">Komedi Filmleri</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Komedi filmleri, günlük hayatın stresinden uzaklaşmak ve bolca kahkaha atmak için en iyi ilaçtır. Romantik komedilerden durum komedilerine, kara mizahtan absürt kurgulara kadar yüzünüzü güldürecek en iyi komedi filmlerine anında ulaşın. Arkadaşlarınızla veya ailenizle geçireceğiniz film geceleri için mükemmel bir tercih.
                </p>

                <h2 className="mt-10 border-b border-white/10 pb-3 text-xl font-bold text-white/95 sm:text-2xl">
                  4K IPTV ve UHD IPTV İçerikleri
                </h2>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  İçerik zenginliği kadar, izlediğiniz yayının görüntü kalitesi de seyir zevkini belirleyen en önemli unsurlardan biridir. Gelişen teknolojiyle birlikte 4K IPTV teknolojisi, televizyon izleme alışkanlıklarımızı tamamen değiştirdi. Yüksek çözünürlüklü ekranlarınızın tam potansiyelini kullanmak için 4K yayınlar vazgeçilmezdir.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">4K Kalitesinde Dizi İzleme</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  En sevdiğiniz dizilerin her sahnesini, karakterlerin mimiklerini, mekanların eşsiz detaylarını 4K (Ultra HD) kalitesinde izlemek, kendinizi hikayenin tam ortasında hissetmenizi sağlar. Güçlü bir internet bağlantısıyla, desteklenen cihazlarınızda hiçbir detay kaybolmadan, en ince ayrıntısına kadar net bir dizi izleme deneyimi yaşayabilirsiniz.
                </p>

                <h3 className="mt-6 text-lg font-semibold text-white sm:text-xl">UHD IPTV Avantajları</h3>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  UHD IPTV, standart HD yayınların dört katı daha fazla piksel sunarak benzersiz bir derinlik ve renk doğruluğu yaratır. Özellikle spor müsabakaları, belgeseller ve görsel efekt ağırlıklı filmlerde UHD kalitesinin farkı muazzamdır. Akıcı kare hızları ve geniş renk yelpazesi sayesinde ekrandaki görüntüler adeta camın dışına taşar. Premium IPTV altyapımızla 4K yayınların kesintisiz ve akıcı keyfine varın.
                </p>

                <h2 className="mt-10 border-b border-white/10 pb-3 text-xl font-bold text-white/95 sm:text-2xl">
                  Canlı Dizi Önerileri IPTV&apos;de
                </h2>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  Sadece isteğe bağlı (VOD) içerikler değil, aynı zamanda canlı yayın akışları da IPTV&apos;nin en güçlü yönlerindendir. Canlı dizi önerileri IPTV sayesinde, dünyanın farklı ülkelerindeki televizyon kanallarını anında izleyebilirsiniz. Örneğin; Amerika&apos;da yayınlanan popüler bir dizinin yeni bölümünü, yayınlandığı an kendi saat diliminizde canlı olarak takip etme şansına sahipsiniz. En iyi IPTV kanalları listesinde yer alan premium eğlence, sinema ve dizi kanalları, 7/24 kesintisiz bir yayın akışı sunarak televizyon kumandasını elinizden bırakmanıza engel olacak. Zamanı yönetin, ister canlı yayında heyecana ortak olun, ister yayını geri sararak kaçırdığınız anları yakalayın.
                </p>

                <h2 className="mt-10 border-b border-white/10 pb-3 text-xl font-bold text-white/95 sm:text-2xl">
                  IPTV Paketleri ile Sınırsız İçerik
                </h2>
                <p className="mb-5 text-left text-base leading-relaxed text-slate-300/95">
                  &quot;Ne izlesem?&quot; sorusunu bir daha asla sormamak, yüzlerce kategoride binlerce güncel içeriğe anında ulaşmak için doğru yerdesiniz. Gelişmiş sunucularımız, anti-freeze (donma önleyici) teknolojimiz ve devasa VOD/Canlı Kanal arşivimizle sizlere eşsiz bir dijital eğlence dünyası sunuyoruz. Spor, belgesel, sinema, çocuk kanalları ve çok daha fazlası tek bir abonelikte birleşiyor.
                </p>
                <p className="mb-8 text-left text-base leading-relaxed text-slate-300/95">
                  Hemen şimdi bütçenize ve ihtiyaçlarınıza en uygun çözümü bulmak için detaylı olarak hazırladığımız{' '}
                  <Link to="/paketler/" className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-white">
                    IPTV paketleri
                  </Link>{' '}
                  sayfamızı ziyaret edin. Sizin için hazırladığımız özel paketlerimiz ile televizyonunuzu, tabletinizi veya akıllı telefonunuzu eksiksiz bir eğlence merkezine dönüştürebilirsiniz.
                </p>

                <div className="mt-10 text-center">
                  <Link
                    to="/paketler/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#e50914,#b20710)] px-8 py-3.5 text-base font-bold text-white shadow-[0_4px_22px_rgba(229,9,20,0.42),0_0_28px_rgba(229,9,20,0.28)] ring-1 ring-[#e50914]/30 transition-transform hover:scale-[1.02] hover:shadow-[0_6px_30px_rgba(229,9,20,0.5)]"
                  >
                    <Play className="h-5 w-5 fill-current" /> Paketleri İncele
                  </Link>
                </div>
              </motion.div>
            </section>

          </main>

          <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        </div>
      </div>
    </>
  );
};

export default WhatToWatchPage;
