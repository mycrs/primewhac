import { BLOG_TRANSLATIONS_DE } from '@/data/staticBlogTranslationsDE';

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import CommentSection from '@/components/CommentSection';
import CommentCounter from '@/components/comments/CommentCounter';
import SEOHead from '@/components/SEOHead';
import SocialShareButtons from '@/components/SocialShareButtons';
import { generateBlogSchema } from '@/components/seo/BlogPostSEOSchema';
import { Calendar, User, ArrowLeft, Loader2, Tag, Clock, RefreshCw, MessageSquare as MessageSquareOff } from 'lucide-react';
import { executeSupabaseQuery } from '@/utils/supabaseErrorHandler';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { MIN_CONTENT_THRESHOLD, plainTextLengthFromHtml } from '@/utils/seoNoindexPaths';
import { SITE_URL } from '@/constants/siteUrl';

/**
 * Render-zamanı marka güvenlik ağı: eski marka adı / yazım kalıntılarını
 * gösterilen metinlerde düzeltir. Kalıcı veri temizliği ayrıca
 * supabase/brand_cleanup_2026-07-20.sql ile yapılır.
 */
const BRAND_TEXT_FIXES = [
  [/MARKA_ADINIZ/gi, 'QruzeTV'],
  [/MARKA ADINIZ/gi, 'QruzeTV'],
  [/Qruze Tv /gi, 'QruzeTV '],
  [/Qruze<[^>]*>HD<\/[^>]*>/gi, 'QruzeTV'],
  [/Qruze<[^>]*>HD/gi, 'QruzeTV'],
  [/Qruze\s*HD/gi, 'QruzeTV'],
  [/QruzeHD/gi, 'QruzeTV'],
  [/KaliteliIPTV/gi, 'QruzeTV'],
  [/PrimeWatch TV/gi, 'QruzeTV'],
  [/Satın AI/gi, 'Satın Al'],
  [/https?:\/\/(?:www\.)?qruzetv\.com/gi, 'https://cineverse.pro'],
  [/https?:\/\/(?:www\.)?kaliteliiptv\.com/gi, 'https://cineverse.pro'],
  [/https?:\/\/(?:www\.)?primewatch\.tv/gi, 'https://cineverse.pro'],
];

const sanitizeBrandText = (text) => {
  if (typeof text !== 'string' || text.length === 0) return text;
  return BRAND_TEXT_FIXES.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
};

const extractEmbeddedMetaDescription = (html) => {
  if (typeof html !== 'string') return '';
  const tag = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0];
  return tag?.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
};

const getSafeMetaDescription = ({ candidate, excerpt, title, content }) => {
  const value = sanitizeBrandText(candidate || '');
  const suspicious = value.length > 180 || /Ana Sayfa\s+Blog|Hemen Başla|QruzeTV\s+QruzeTV/i.test(value);
  const embedded = sanitizeBrandText(extractEmbeddedMetaDescription(content));
  if ((!value || suspicious) && embedded) return embedded;
  if (value && !suspicious) return value;
  return `${(sanitizeBrandText(excerpt || title || '')).substring(0, 150)}...`;
};

const normalizeArticleHtml = (html) => {
  if (typeof html !== 'string' || html.length === 0) return html;
  let normalized = sanitizeBrandText(html);
  normalized = normalized.replace(/Qruze\s*<[^>]+>\s*HD\s*<\/[^>]+>/gi, 'QruzeTV');
  const body = normalized.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (body?.[1]) normalized = body[1];
  return normalized
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<head\b[\s\S]*?<\/head>/gi, '')
    .replace(/<\/?(?:html|body)\b[^>]*>/gi, '')
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(["'])[\s\S]*?\1/gi, '')
    .replace(/\s(?:href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\1/gi, '');
};

const BlogPostPage = ({ siteData }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCommentCount, setRefreshCommentCount] = useState(0);
  const { contactData, siteTexts } = siteData;
  const isDe = location.pathname.startsWith('/de/');
  const canonicalUrl = DomainMigrationManager.getCanonicalUrl(`${isDe ? '/de/blog' : '/blog'}/${post?.slug || slug}`);

  // Utility to detect if the passed param is an old UUID
  const isUUID = (str) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    
    if (!isSupabaseConfigured()) {
      setError(new Error('not_configured'));
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
          navigate(`${isDe ? '/de/blog' : '/blog'}/${data.slug}`, { replace: true });
          return;
        }

        data.content = DomainMigrationManager.updateContent(data.content);
        data.cover_image_url = DomainMigrationManager.updateUrl(data.cover_image_url);
        if (BLOG_TRANSLATIONS_DE[data.slug]) {
          const trDe = BLOG_TRANSLATIONS_DE[data.slug];
          data.title_de = trDe.title_de;
          data.seo_title_de = trDe.seo_title_de;
          data.seo_description_de = trDe.seo_description_de;
          data.excerpt_de = trDe.excerpt_de;
          data.content_de = trDe.content_de;
        }
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
  }, [slug, isDe]);

  const HeaderComponent = isDe ? HeaderDE : Header;
  const FooterComponent = isDe ? FooterDE : Footer;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(isDe ? 'de-DE' : 'tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <HeaderComponent contactData={contactData} siteTexts={siteTexts} />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#e50914] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <HeaderComponent contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">{isDe ? 'Beitrag nicht gefunden' : 'Blog Yazısı Bulunamadı'}</h1>
            <p className="text-gray-400 mb-8">{isDe ? 'Der gewünschte Beitrag ist nicht verfügbar oder wurde entfernt.' : 'Aradığınız yazıya ulaşılamıyor. Adresi yanlış yazmış olabilir veya yazı kaldırılmış olabilir.'}</p>
            <Link to={isDe ? '/de/blog/' : '/blog/'} className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#e50914] hover:bg-[#b20710]">
              <ArrowLeft className="mr-2 -ml-1 h-5 w-5" /> {isDe ? 'Zum Ratgeber' : "Blog'a Dön"}
            </Link>
          </div>
        </main>
        <FooterComponent contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    );
  }

  const keywords = [post.focus_keyword, post.category, ...(post.tags || [])].filter(Boolean).map(sanitizeBrandText);

  // DE görünüm: Almanca alan(lar) mevcutsa onları kullan; yoksa TR içeriğe düşülür ve
  // sayfa noindex,follow + hreflang'siz çıkar (Google'a Türkçe DE kopyası sunulmaz).
  const pickLocalized = (deValue, trValue) =>
    isDe && typeof deValue === 'string' && deValue.trim().length > 0 ? deValue : trValue;
  const hasGermanContent =
    typeof post.title_de === 'string' && post.title_de.trim().length > 0 &&
    plainTextLengthFromHtml(post.content_de) >= MIN_CONTENT_THRESHOLD;
  const deNoindex = isDe && !hasGermanContent;
  // TR görünümde Almanca çeviri yoksa DE karşılığı noindex'ken TR → de hreflang
  // karşılıksız kalır; bu durumda yalnızca 'de' alternate linki bastırılır
  // (tr ve x-default korunur). SEOHead sözleşmesi: boş string override linki render etmez.
  const suppressDeAlternate = !isDe && !hasGermanContent;

  const displayTitle = sanitizeBrandText(pickLocalized(post.title_de, post.title));
  const displaySeoTitle = sanitizeBrandText(pickLocalized(post.seo_title_de, post.seo_title));
  const displayExcerpt = sanitizeBrandText(pickLocalized(post.excerpt_de, post.excerpt));
  const displaySeoDescription = sanitizeBrandText(pickLocalized(post.seo_description_de, post.seo_description));
  const displayRawContent = pickLocalized(post.content_de, post.content);
  const displayContent = normalizeArticleHtml(displayRawContent);

  const metaTitle = displaySeoTitle || `${displayTitle} | QruzeTV`;
  const metaDescription = getSafeMetaDescription({
    candidate: displaySeoDescription,
    excerpt: displayExcerpt,
    title: displayTitle,
    content: displayRawContent,
  });
  const ogImage = post.cover_image_url || `${SITE_URL}/default-og-image.jpg`;
  const blogSchema = generateBlogSchema(
    { ...post, title: displayTitle, seo_title: displaySeoTitle, seo_description: displaySeoDescription, excerpt: displayExcerpt },
    canonicalUrl
  );
  const bodyTextLen = plainTextLengthFromHtml(displayContent);
  
  const commentsEnabled = post.allow_comments !== false;
  
  const homeCrumb = isDe ? { name: 'Startseite', path: '/de' } : { name: 'Ana Sayfa', path: '/' };
  const blogPath = isDe ? '/de/blog' : '/blog';
  const blogCrumb = { name: 'Blog', path: blogPath };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": homeCrumb.name, "item": DomainMigrationManager.getCanonicalUrl(homeCrumb.path) },
      { "@type": "ListItem", "position": 2, "name": blogCrumb.name, "item": DomainMigrationManager.getCanonicalUrl(blogPath) },
      { "@type": "ListItem", "position": 3, "name": displayTitle, "item": canonicalUrl }
    ]
  };

  return (
    <>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        keywords={keywords}
        ogType="article"
        ogImage={ogImage}
        canonicalUrl={canonicalUrl}
        jsonLd={[blogSchema, breadcrumbSchema]}
        pageData={{ contentLength: bodyTextLen, forceIndex: isDe && hasGermanContent }}
        noindex={deNoindex}
        hreflangOverrides={
          deNoindex
            ? { tr: '', de: '', 'x-default': '' }
            : suppressDeAlternate
              ? { de: '' }
              : undefined
        }
      />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white">
        <HeaderComponent contactData={contactData} siteTexts={siteTexts} />
        <main className="flex-grow pt-24 pb-12">
          <article itemScope itemType="http://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={post.published_at} />
            <meta itemProp="dateModified" content={post.updated_at || post.published_at} />
            <meta itemProp="image" content={ogImage} />
            <meta itemProp="headline" content={displayTitle} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto bg-[#0a0a0a] rounded-3xl overflow-hidden border border-[#262626] shadow-2xl">
                {/* Hero Section of the Post */}
                <div className="p-6 sm:p-8 md:p-12 lg:p-16 border-b border-[#262626]/50">
                  <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <BreadcrumbNavigation customCrumbs={[
                        homeCrumb,
                        blogCrumb,
                        { name: displayTitle, path: null }
                    ]} />
                    {commentsEnabled && <CommentCounter postId={post.id} refreshTrigger={refreshCommentCount} />}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                    {displayTitle}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-[#0a0a0a]/50 px-4 py-2 rounded-full border border-[#262626]">
                      <Calendar className="w-4 h-4 text-[#e50914]" />
                      <time className="text-sm font-medium text-gray-300" dateTime={post.published_at}>
                        {formatDate(post.published_at)}
                      </time>
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-3 bg-[#e50914]/10 px-4 py-2 rounded-full border border-[#e50914]/20">
                        <Tag className="w-4 h-4 text-[#e50914]" />
                        <span className="text-sm font-semibold text-[#e50914] uppercase tracking-wider">
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
                      prose-a:text-[#e50914] prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-white prose-strong:font-bold
                      prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-[#262626]
                      prose-ul:list-disc prose-ol:list-decimal"
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                  />

                  {/* Share Buttons */}
                  <div className="mt-12 pt-8 border-t border-[#262626]/50">
                    <SocialShareButtons
                      url={canonicalUrl}
                      title={displayTitle}
                      description={metaDescription}
                      image={ogImage}
                      locale={isDe ? 'de' : 'tr'}
                    />
                  </div>
                </div>

                {/* Footer/Comments Area */}
                <div className="bg-[#0a0a0a]/30 p-6 sm:p-8 md:p-12 lg:p-16 border-t border-[#262626]">
                  {commentsEnabled ? (
                    <div onBlur={() => setRefreshCommentCount(prev => prev + 1)}>
                      <CommentSection postId={post.id} />
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#0a0a0a] rounded-xl border border-[#262626]">
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
        <FooterComponent contactData={contactData} siteTexts={siteTexts} siteData={siteData} />
      </div>
    </>
  );
};

export default BlogPostPage;
