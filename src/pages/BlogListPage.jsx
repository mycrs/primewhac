
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import BlogHeroSection from '@/components/BlogHeroSection';
import BlogCard from '@/components/blog/BlogCard';
import { Helmet } from 'react-helmet-async';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';

const BlogListPage = ({ siteData }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await executeSupabaseQuery(
        () => supabase
          .from('blog_posts')
          .select('*')
          .not('published_at', 'is', null)
          .order('featured', { ascending: false, nullsFirst: false })
          .order('published_at', { ascending: false })
      );
        
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog & Rehberler",
    "description": "En son yazılarımız, ipuçları ve rehberler.",
    "url": window.location.href,
    "blogPost": posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.published_at,
      "dateModified": post.updated_at || post.published_at,
      "author": {
        "@type": "Person",
        "name": post.author || "Admin"
      },
      "url": `${window.location.origin}/blog/${post.slug || post.id}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Premium IPTV Blog - Blog & Rehberler</title>
        <meta name="description" content="Explore the ultimate hub for IPTV excellence. En son yazılarımız, ipuçları ve rehberler." />
        <meta name="keywords" content="Premium IPTV, 4K Streaming, IPTV Hub, Entertainment Technology, Streaming News, Smart TV Setup" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Premium IPTV & Streaming Content Hub" />
        <meta property="og:description" content="Discover unlimited entertainment with our expert streaming guides and technology insights." />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content={`${window.location.origin}/blog`} />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 flex flex-col text-white selection:bg-purple-500/30">
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
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h3 className="text-2xl font-semibold text-white mb-2">Henüz yazı bulunmuyor</h3>
              <p className="text-slate-400">Çok yakında yeni içeriklerle karşınızda olacağız.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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
          )}

          {/* Deep SEO Content Section */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-[2.5rem] p-8 md:p-16 prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-cyan-300 transition-all duration-300">
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
                <h3 className="text-2xl font-bold text-purple-400">Zengin İçerik ve Kanal Yönetimi</h3>
                <p className="text-slate-300">
                  Binlerce kanal ve isteğe bağlı video (VOD) içeriği arasında kaybolmamak için iyi bir kanal yönetimi şarttır. M3u formatlı listelerin nasıl düzenleneceği konusunda rehberlerimizden faydalanabilirsiniz.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Tüm Cihazlar İçin Kapsamlı Kurulum Rehberleri</h2>
            <p className="text-slate-300 mb-8">
              Platformumuzda, pazarın önde gelen cihazları için resimli ve adım adım anlatımlı rehberler sunuyoruz. Örneğin, evinizde bir akıllı televizyon varsa <Link to="/installation" className="font-semibold underline decoration-blue-500/30 underline-offset-4 hover:decoration-blue-500 transition-all">Smart TV IPTV kurulumu</Link> rehberimizi inceleyebilirsiniz.
            </p>

            <div className="mt-12 bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-inner">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-400" /> Neden Bizi Tercih Etmelisiniz?
              </h3>
              <ul className="space-y-4 text-slate-300 list-none pl-0">
                <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-blue-400 text-xl font-bold mt-0.5">01</span>
                  <span><strong>Güncel ve Doğru Bilgi:</strong> Teknolojik gelişmeleri yakından takip ederek içeriklerimizi sürekli güncelliyoruz.</span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-purple-400 text-xl font-bold mt-0.5">02</span>
                  <span><strong>Kolay Anlaşılır Dil:</strong> Teknik terimleri boğmadan, herkesin anlayabileceği sadelikte anlatımlar sunuyoruz.</span>
                </li>
                <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-cyan-400 text-xl font-bold mt-0.5">03</span>
                  <span><strong>Çözüm Odaklı Yaklaşım:</strong> Sık karşılaşılan problemlere anında çözüm üreten <Link to="/faq" className="font-semibold">Sıkça Sorulan Sorular</Link> bölümümüzle destek sağlıyoruz.</span>
                </li>
              </ul>
            </div>
            
            <p className="text-slate-500 text-sm mt-12 italic text-center border-t border-slate-800 pt-8">
              Teknoloji blogumuzu düzenli takip ederek, eğlence sisteminizden her zaman en yüksek verimi alabilir, yeni çıkan uygulamalar ve donanımlar hakkında ilk siz bilgi sahibi olabilirsiniz.
            </p>
          </section>

        </main>
        
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BlogListPage;
