import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import BlogHeroSection from '@/components/BlogHeroSection';
import SEOHead from '@/components/SEOHead';
import { Calendar, User, ArrowRight, Loader2, Search, Tv, Zap, Shield, Users, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { useLazyImage } from '@/hooks/useLazyImage';
import { Input } from '@/components/ui/input';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { motion } from 'framer-motion';

const BlogCardImage = ({ src, alt }) => {
    const migratedSrc = DomainMigrationManager.updateUrl(src);
    const { src: imageSrc, isLoading } = useLazyImage(migratedSrc);
    return (
        <div className="relative aspect-video bg-[#1a1a2e] overflow-hidden border-b border-[#2a2a40]">
            <img 
                src={imageSrc || migratedSrc} 
                alt={alt} 
                className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} 
            />
        </div>
    )
}

const defaultMetadata = {
  title: "IPTV Rehberi ve En İyi IPTV Hizmetleri | Deutschland",
  description: "IPTV nedir, nasıl kurulur und en iyi IPTV hizmetleri hakkında kapsamlı rehber.",
  keywords: ["IPTV nedir", "IPTV nasıl kurulur", "IPTV rehberi"],
  ogType: "website",
  ogImage: "https://primewatch.tv/default-og-image.jpg",
  twitterCard: "summary_large_image",
  h1: "IPTV Rehberi: Türkiye'de IPTV Nedir und Nasıl Kurulur?"
};

const BlogPageDE = ({ siteData }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { contactData, siteTexts } = siteData || {};
  
  const canonicalUrl = DomainMigrationManager.getCanonicalUrl('/de/blog');
  const metadata = defaultMetadata;

  const navigate = useNavigate();
  const [lang, setLang] = useState('de');

  // Initialize and persist language state
  useEffect(() => {
    const savedLang = localStorage.getItem('blogLanguage');
    if (savedLang === 'tr') {
      navigate('/blog', { replace: true });
    } else {
      setLang('de');
    }
  }, [navigate]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('blogLanguage', newLang);
    if (newLang === 'tr') {
      navigate('/blog');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
        
      if (error) throw error;
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const dynamicOgImage = posts.length > 0 && posts[0].cover_image_url 
    ? DomainMigrationManager.updateUrl(posts[0].cover_image_url)
    : metadata.ogImage;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": metadata.title,
    "description": metadata.description,
    "url": canonicalUrl,
    "hasPart": filteredPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": DomainMigrationManager.getCanonicalUrl(`/de/blog/${post.slug}`),
      "datePublished": post.published_at,
      "image": DomainMigrationManager.updateUrl(post.cover_image_url)
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Startseite", "item": DomainMigrationManager.getCanonicalUrl('/de') },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": canonicalUrl }
    ]
  };

  return (
    <>
      <SEOHead 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogType={metadata.ogType}
        ogImage={dynamicOgImage}
        twitterCard={metadata.twitterCard}
        canonicalUrl={canonicalUrl}
        jsonLd={[collectionSchema, breadcrumbSchema]}
      />

      <div className="min-h-screen bg-[#0F0F1E] flex flex-col text-white font-sans">
        <HeaderDE contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          
          <div className="mb-8">
            <BreadcrumbNavigation 
              customPaths={[
                { label: 'Startseite', path: '/de' },
                { label: 'Blog', path: '/de/blog' }
              ]}
            />
          </div>

          <BlogHeroSection lang={lang} setLang={handleLangChange} />

          <section className="py-8 mb-16">
            <div className="max-w-xl mx-auto relative group mb-16">
              <Input 
                placeholder="Blogbeiträge durchsuchen..." 
                className="pl-12 bg-[#1a1a2e]/80 border-[#2a2a40] focus:border-[#A855F7] focus:ring-[#A855F7] h-14 rounded-full shadow-lg text-white placeholder-gray-500 transition-all duration-300 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-4 w-6 h-6 text-gray-500 group-focus-within:text-[#A855F7] transition-colors" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-[#A855F7] pl-4">Aktuelle Beiträge</h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-[#1a1a2e] rounded-2xl border border-[#2a2a40]">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-2">Keine Blogbeiträge gefunden.</h3>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <article key={post.id}>
                    <Link to={`/de/blog/${post.slug}`} className="block group h-full">
                      <div className="bg-[#1a1a2e] rounded-2xl border border-[#2a2a40] overflow-hidden h-full flex flex-col hover:border-[#A855F7] hover:shadow-lg hover:shadow-[#A855F7]/20 transition-all duration-300">
                         <BlogCardImage src={post.cover_image_url} alt={post.title} />
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A855F7] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-3 flex-grow mb-6">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Deep SEO Content Section - German Translation */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1a1a2e]/60 border border-[#2a2a40] rounded-[2.5rem] p-8 md:p-16 mb-20 shadow-2xl relative overflow-hidden"
          >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600/10 to-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 border-b border-[#2a2a40] pb-6 tracking-tight">
                IPTV und die Zukunft des modernen Rundfunks
              </h2>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-12">
                <strong>IPTV (Internet Protocol Television)</strong>, das traditionelle Satelliten- und Kabelfernsehen schnell ablöst, verändert unsere Sehgewohnheiten grundlegend. Mit der Verbreitung von Hochgeschwindigkeits-Internet-Infrastrukturen ist es nun möglich, Bildqualität bis hin zu 4K Ultra HD ohne Einfrieren und Ruckeln zu erleben. Premium IPTV Services bieten Ihnen heute eine grenzenlose Unterhaltungswelt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {/* Card 1 */}
                <motion.div whileHover={{ y: -5 }} className="bg-[#111122] p-6 rounded-2xl border border-[#2a2a40] shadow-lg hover:border-blue-500/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-400">
                    <Tv className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Warum IPTV?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Für ein nahtloses Erlebnis benötigen Sie nicht nur einen guten Dienstleister, sondern auch die richtige Hardware und eine stabile Internetverbindung. Optimieren Sie Ihr Heimnetzwerk für das beste Streaming-Erlebnis.
                  </p>
                </motion.div>

                {/* Card 2 */}
                <motion.div whileHover={{ y: -5 }} className="bg-[#111122] p-6 rounded-2xl border border-[#2a2a40] shadow-lg hover:border-purple-500/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 text-purple-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Technologische Vorteile</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Um sich in tausenden von Kanälen und Video-on-Demand (VOD) Inhalten nicht zu verlieren, ist ein gutes Kanalmanagement unerlässlich. Erfahren Sie, wie Sie M3U-Listen effizient verwalten können.
                  </p>
                </motion.div>

                {/* Card 3 */}
                <motion.div whileHover={{ y: -5 }} className="bg-[#111122] p-6 rounded-2xl border border-[#2a2a40] shadow-lg hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 text-cyan-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Zukunftsperspektiven</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Auf unserer Plattform bieten wir bebilderte und schrittweise Installationsanleitungen für die führenden Geräte auf dem Markt. Entdecken Sie die Zukunft des Fernsehens schon heute.
                  </p>
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Vorteile unseres Premium IPTV Service</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#111122] border border-[#2a2a40]">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Aktuelle & Präzise Informationen</h4>
                    <p className="text-sm text-gray-400">Wir verfolgen technologische Entwicklungen genau und aktualisieren unsere Inhalte kontinuierlich.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#111122] border border-[#2a2a40]">
                  <Users className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Leicht Verständliche Sprache</h4>
                    <p className="text-sm text-gray-400">Wir bieten Erklärungen in einer Einfachheit, die jeder verstehen kann, ohne sich in Fachbegriffen zu verlieren.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#111122] border border-[#2a2a40]">
                  <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Lösungsorientierter Ansatz</h4>
                    <p className="text-sm text-gray-400">Wir bieten sofortige Lösungen für häufig auftretende Probleme durch unsere umfangreiche FAQ-Sektion.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-[#111122] border border-[#2a2a40]">
                  <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Höchste Qualität in 4K</h4>
                    <p className="text-sm text-gray-400">Genießen Sie Filme, Serien und Live-Sport in atemberaubender Ultra HD Qualität ohne Kompromisse.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-[#2a2a40] text-center mt-12">
                <p className="text-gray-300 italic text-lg mb-6">
                  "Wenn Sie unseren Technologie-Blog regelmäßig verfolgen, können Sie immer das Maximum aus Ihrem Entertainment-System herausholen und als Erster über neue Anwendungen und Hardware informiert sein."
                </p>
                <Link to="/de/installation" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-purple-500/25">
                  Zur Installationsanleitung <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </div>
          </motion.section>

        </main>
        <FooterDE contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BlogPageDE;