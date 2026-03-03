
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import CommentSection from '@/components/CommentSection';
import CommentCounter from '@/components/comments/CommentCounter';
import SEOHead from '@/components/SEOHead';
import { generateBlogSchema } from '@/components/seo/BlogPostSEOSchema';
import { Calendar, User, ArrowLeft, Loader2, Tag, Clock, RefreshCw, MessageSquare as MessageSquareOff } from 'lucide-react';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { isSupabaseConfigured } from '@/utils/envValidator';

const BlogPostPage = ({ siteData }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCommentCount, setRefreshCommentCount] = useState(0);
  const { contactData, siteTexts } = siteData;
  const canonicalUrl = DomainMigrationManager.getCanonicalUrl(`/blog/${post?.slug || slug}`);

  // Utility to detect if the passed param is an old UUID
  const isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    
    if (!isSupabaseConfigured()) {
      setError(new Error("Supabase is not configured"));
      setLoading(false);
      return;
    }

    try {
      const isIdBased = isUUID(slug);
      console.log(`Loading blog post from Supabase using ${isIdBased ? 'ID' : 'slug'}: ${slug}`);
      
      let query = supabase.from('blog_posts').select('*');
      if (isIdBased) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }

      const { data, error: fetchError } = await executeSupabaseQuery(
        () => query.single(),
        { retries: 3, context: 'fetch_blog_post_detail' }
      );
        
      if (fetchError) throw fetchError;
      
      if (data) {
        // Redirect legacy UUID links to proper slug links
        if (isIdBased && data.slug) {
          navigate(`/blog/${data.slug}`, { replace: true });
          return;
        }

        data.content = DomainMigrationManager.updateContent(data.content);
        data.cover_image_url = DomainMigrationManager.updateUrl(data.cover_image_url);
        setPost(data);
      } else {
        throw new Error("Post not found");
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col">
        <Header contactData={contactData} siteTexts={siteTexts} />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col">
        <Header contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Blog Yazısı Bulunamadı</h1>
            <p className="text-gray-400 mb-8">Aradığınız yazıya ulaşılamıyor. Adresi yanlış yazmış olabilir veya yazı kaldırılmış olabilir.</p>
            <Link to="/blog" className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#A855F7] hover:bg-[#9333EA]">
              <ArrowLeft className="mr-2 -ml-1 h-5 w-5" /> Blog'a Dön
            </Link>
          </div>
        </main>
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    );
  }

  const keywords = [post.focus_keyword, post.category, ...(post.tags || []), "kaliteli iptv", "iptv kurulumu"].filter(Boolean);
  const metaTitle = post.seo_title || `${post.title} | PrimeWatch TV`;
  const metaDescription = post.seo_description || `${(post.excerpt || post.title).substring(0, 120)}...`;
  const ogImage = post.cover_image_url || "https://primewatch.tv/default-og-image.jpg";
  const blogSchema = generateBlogSchema(post, "https://primewatch.tv");
  
  const commentsEnabled = post.allow_comments !== false;
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": DomainMigrationManager.getCanonicalUrl('/') },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": DomainMigrationManager.getCanonicalUrl('/blog') },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <SEOHead title={metaTitle} description={metaDescription} keywords={keywords} ogType="article" ogImage={ogImage} canonicalUrl={canonicalUrl} jsonLd={[blogSchema, breadcrumbSchema]} />
      <div className="min-h-screen bg-[#0F0F1E] flex flex-col text-white">
        <Header contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-12">
          <article itemScope itemType="http://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={post.published_at} />
            <meta itemProp="dateModified" content={post.updated_at || post.published_at} />
            <meta itemProp="image" content={ogImage} />
            <meta itemProp="headline" content={post.title} />
            {post.focus_keyword && <meta name="keywords" content={post.focus_keyword} />}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto bg-[#1a1a2e] rounded-3xl overflow-hidden border border-[#2a2a40] shadow-2xl">
                {/* Hero Section of the Post */}
                <div className="p-6 sm:p-8 md:p-12 lg:p-16 border-b border-[#2a2a40]/50">
                  <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <BreadcrumbNavigation customCrumbs={[
                        { name: 'Ana Sayfa', path: '/' },
                        { name: 'Blog', path: '/blog' },
                        { name: post.title, path: null }
                    ]} />
                    {commentsEnabled && <CommentCounter postId={post.id} refreshTrigger={refreshCommentCount} />}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-[#0F0F1E]/50 px-4 py-2 rounded-full border border-[#2a2a40]">
                      <Calendar className="w-4 h-4 text-[#A855F7]" />
                      <time className="text-sm font-medium text-gray-300" dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                      </time>
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-3 bg-[#A855F7]/10 px-4 py-2 rounded-full border border-[#A855F7]/20">
                        <Tag className="w-4 h-4 text-[#A855F7]" />
                        <span className="text-sm font-semibold text-[#A855F7] uppercase tracking-wider">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 sm:p-8 md:p-12 lg:p-16">
                  <div 
                    itemProp="articleBody" 
                    className="prose prose-invert prose-lg sm:prose-xl max-w-none text-gray-300 
                      prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                      prose-p:leading-relaxed prose-p:mb-6
                      prose-a:text-[#A855F7] prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-white prose-strong:font-bold
                      prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-[#2a2a40]
                      prose-ul:list-disc prose-ol:list-decimal"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                </div>

                {/* Footer/Comments Area */}
                <div className="bg-[#0F0F1E]/30 p-6 sm:p-8 md:p-12 lg:p-16 border-t border-[#2a2a40]">
                  {commentsEnabled ? (
                    <div onBlur={() => setRefreshCommentCount(prev => prev + 1)}>
                      <CommentSection postId={post.id} />
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#0F0F1E] rounded-xl border border-[#2a2a40]">
                      <MessageSquareOff className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-300 mb-2">Yorumlar Kapalı</h3>
                      <p className="text-slate-500">Bu yazı için yorumlar kapatılmıştır.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        </main>
        <Footer contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BlogPostPage;
