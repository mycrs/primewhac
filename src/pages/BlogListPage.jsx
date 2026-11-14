
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import BlogHeroSection from '@/components/BlogHeroSection';
import BlogCard from '@/components/blog/BlogCard';
import SEOHead from '@/components/SEOHead';
import { blogListPageSchemas } from '@/utils/seoSchema';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import { loadBlogListPage } from '@/utils/blogListFetch';

const BLOG_CACHE_PREFIX = 'sb_blog_tr';

const BlogListPage = ({ siteData }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const totalCountRef = useRef(0);
  const { contactData, siteTexts } = siteData || {};
  
  const navigate = useNavigate();
  const [lang, setLang] = useState('tr');

  // Initialize and persist language state
  useEffect(() => {
    const savedLang = localStorage.getItem('blogLanguage');
    if (savedLang === 'de') {
      navigate('/de/blog', { replace: true });
    } else {
      setLang('tr');
    }
  }, [navigate]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('blogLanguage', newLang);
    if (newLang === 'de') {
      navigate('/de/blog');
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const r = await loadBlogListPage({ pageIndex: 0, cachePrefix: BLOG_CACHE_PREFIX });
      if (cancelled) return;
      if (r.error) {
        console.error('Error fetching posts:', r.error);
        setPosts([]);
        totalCountRef.current = 0;
        setHasMore(false);
      } else {
        setPosts(r.rows);
        totalCountRef.current = r.totalCount;
        setHasMore(r.rows.length < r.totalCount);
        setPage(0);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const r = await loadBlogListPage({ pageIndex: next, cachePrefix: BLOG_CACHE_PREFIX });
      if (r.error) {
        console.error('Blog load more:', r.error);
        return;
      }
      setPosts((prev) => {
        const merged = [...prev, ...r.rows];
        setHasMore(merged.length < totalCountRef.current);
        return merged;
      });
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  };

  const metadata = {
    title: "Premium IPTV Blog - Blog & Rehberler | QruzeTV",
    description: "IPTV dünyasından en güncel haberler, ipuçları ve teknik rehberler. Kurulum, kanal yönetimi ve sorun giderme rehberleri.",
    keywords: ["IPTV blog", "IPTV rehberi", "IPTV haberler", "IPTV ipuçları", "Smart TV kurulum", "4K streaming"],
    ogType: "website",
  };
  const jsonLd = blogListPageSchemas(metadata, posts);

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white selection:bg-white/20">
        <Header contactData={contactData} siteTexts={siteTexts} />
        
        <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>

          {/* Premium Dynamic Hero Section */}
          <BlogHeroSection lang={lang} setLang={handleLangChange} />

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-[#0a0a0a]/50 rounded-2xl border border-slate-800">
              <h3 className="text-2xl font-semibold text-white mb-2">Henüz yazı bulunmuyor</h3>
              <p className="text-slate-400">Çok yakında yeni içeriklerle karşınızda olacağız.</p>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${hasMore ? 'mb-10' : 'mb-20'}`}>
                {posts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <BlogCard post={post} />
                  </motion.article>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mb-20">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10"
                    disabled={loadingMore}
                    onClick={loadMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Yükleniyor…
                      </>
                    ) : (
                      'Daha fazla yazı'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Deep SEO Content Section */}
          <section className="bg-[#0a0a0a]/60 border border-slate-800/80 rounded-[2.5rem] p-8 md:p-16 prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-[#e50914] transition-all duration-300">
            <h2 className="text-4xl font-bold mb-8 text-white border-b border-slate-800 pb-6 tracking-tight">
              IPTV ve Modern Yayıncılığın Geleceği
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Geleneksel uydu ve kablolu yayıncılığın yerini hızla alan <strong>IPTV (Internet Protocol Television)</strong>, televizyon izleme alışkanlıklarımızı kökünden değiştiriyor. Yüksek hızlı internet altyapılarının yaygınlaşmasıyla birlikte, 4K Ultra HD çözünürlüğe kadar ulaşan görüntü kalitesini donma ve takılma yaşamadan deneyimlemek artık mümkün.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-blue-400">Kesintisiz Deneyim İçin Temel Gereksinimler</h3>
                <p className="text-slate-300">
                  Kaliteli bir yayın deneyimi için yalnızca iyi bir servis sağlayıcıya değil, aynı zamanda doğru donanım ve stabil bir internet bağlantısına da ihtiyacınız vardır. Sitemizdeki rehberler sayesinde, ev internetinizin hızını nasıl optimize edeceğinizi öğrenebilirsiniz.
                </p>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary">Zengin İçerik ve Kanal Yönetimi</h3>
                <p className="text-slate-300">
                  10.000+ kanal ve isteğe bağlı video (VOD) içeriği arasında kaybolmamak için iyi bir kanal yönetimi şarttır. M3u formatlı listelerin nasıl düzenleneceği konusunda rehberlerimizden faydalanabilirsiniz.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Tüm Cihazlar İçin Kapsamlı Kurulum Rehberleri</h2>
            <p className="text-slate-300 mb-8">
              Platformumuzda, pazarın önde gelen cihazları için resimli ve adım adım anlatımlı rehberler sunuyoruz. Örneğin, evinizde bir akıllı televizyon varsa <Link to="/kurulum/smart-tv/" className="font-semibold underline decoration-blue-500/30 underline-offset-4 hover:decoration-blue-500 transition-all">Smart TV IPTV kurulumu</Link> rehberimizi inceleyebilirsiniz.
            </p>

            <div className="mt-12 bg-gradient-to-br from-[#0a0a0a]/40 to-[#141414]/40 p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-400" /> Neden Bizi Tercih Etmelisiniz?
              </h3>
              <ul className="space-y-4 text-slate-300 list-none pl-0">
                <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-blue-400 text-xl font-bold mt-0.5">01</span>
                  <span><strong>Güncel ve Doğru Bilgi:</strong> Teknolojik gelişmeleri yakından takip ederek içeriklerimizi sürekli güncelliyoruz.</span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-primary text-xl font-bold mt-0.5">02</span>
                  <span><strong>Kolay Anlaşılır Dil:</strong> Teknik terimleri boğmadan, herkesin anlayabileceği sadelikte anlatımlar sunuyoruz.</span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-[#e50914] text-xl font-bold mt-0.5">03</span>
                  <span><strong>Çözüm Odaklı Yaklaşım:</strong> Sık karşılaşılan problemlere anında çözüm üreten <Link to="/sss/" className="font-semibold">Sıkça Sorulan Sorular</Link> bölümümüzle destek sağlıyoruz.</span>
                </li>
              </ul>
            </div>
            
            <p className="text-slate-500 text-sm mt-12 italic text-center border-t border-slate-800 pt-8">
              Teknoloji blogumuzu düzenli takip ederek, eğlence sisteminizden her zaman en yüksek verimi alabilir, yeni çıkan uygulamalar ve donanımlar hakkında ilk siz bilgi sahibi olabilirsiniz.
            </p>
          </section>

          <div className="container mx-auto px-4 max-w-6xl">
            <InternalLinkingOptimization currentPage="blog" />
          </div>

        </main>
        
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BlogListPage;
