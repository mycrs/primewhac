
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, Star } from 'lucide-react';
import { Card, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const calculateReadingTime = (content, excerpt) => {
  const text = (content || excerpt || '').trim();
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const sanitizeLegacyBrand = (value) => String(value || '')
  .replace(/Qruze\s*HD/gi, 'QruzeTV')
  .replace(/KaliteliIPTV/gi, 'QruzeTV')
  .replace(/PrimeWatch TV/gi, 'QruzeTV');

const BlogCard = ({ post }) => {
  const displayTitle = sanitizeLegacyBrand(post.title);
  const displayExcerpt = sanitizeLegacyBrand(
    post.excerpt || (post.content ? post.content.replace(/<[^>]+>/g, '').substring(0, 155) + '...' : '')
  );
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full relative group">
      {post.featured && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg shadow-amber-500/20 px-2.5 py-1 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Öne Çıkan</span>
          </Badge>
        </div>
      )}
      
      <Card className={`h-full flex flex-col bg-[#0a0a0a]/50 ${post.featured ? 'border-amber-500/30 hover:border-amber-500/60' : 'border-slate-800 hover:border-primary/50'} transition-all duration-500 overflow-hidden hover:shadow-2xl ${post.featured ? 'hover:shadow-amber-500/10' : 'hover:shadow-primary/10'} group-hover:-translate-y-2 relative`}>
        {post.featured && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none z-10" />
        )}
        <div className="relative aspect-video overflow-hidden bg-[#0a0a0a]">
          {post.cover_image_url ? (
            <img 
              src={post.cover_image_url} 
              alt={`${displayTitle} kapak görseli`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] text-slate-600">
              Görsel Yok
            </div>
          )}
          {post.category && (
            <div className="absolute top-4 left-4 z-20">
              <Badge variant="secondary" className="bg-primary hover:bg-primary text-white border-none shadow-lg">
                {post.category}
              </Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        </div>
        <CardHeader className="flex-grow p-6 relative z-20">
          <header>
            <p className={`text-2xl font-bold text-white mb-3 line-clamp-2 transition-colors duration-300 ${post.featured ? 'group-hover:text-amber-400' : 'group-hover:text-blue-400'}`}>
              {displayTitle}
            </p>
          </header>
          <p className="text-slate-400 line-clamp-3 leading-relaxed text-sm">
            {displayExcerpt}
          </p>
        </CardHeader>
        <CardFooter className="p-6 pt-0 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 mt-auto gap-y-2 relative z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#e50914]" />
              <span>{calculateReadingTime(post.content, post.excerpt)} dk okuma</span>
            </div>
          </div>
          {post.author && (
            <div className="flex items-center gap-1.5 ml-auto">
              <User className="w-4 h-4 text-primary" />
              <span itemProp="author">{post.author}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
