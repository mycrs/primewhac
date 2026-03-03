
import React from 'react';
import { DomainMigrationManager } from '@/utils/domainMigration';

export const generateBlogSchema = (post, currentSiteUrl = window.location.origin) => {
  if (!post) return null;

  // Enforce new domain for SEO schema
  const siteUrl = "https://primewatch.tv";
  const postUrl = `${siteUrl}/blog/${post.slug || post.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": post.seo_title || post.title,
    "description": post.seo_description || post.excerpt,
    "image": DomainMigrationManager.updateUrl(post.cover_image_url) || `${siteUrl}/default-blog-image.jpg`,
    "author": {
      "@type": "Person",
      "name": post.author || "QruzeHD Editör",
      "url": DomainMigrationManager.updateUrl(post.author_url) || siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "PrimeWatch TV",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "datePublished": post.published_at || post.created_at,
    "dateModified": post.updated_at || post.published_at || post.created_at,
    "keywords": post.tags ? post.tags.join(', ') : "",
    "articleSection": post.category || "Genel"
  };
};

export const BlogPostSEOSchema = ({ post, siteUrl }) => {
  const schema = generateBlogSchema(post, siteUrl);
  
  if (!schema) return null;

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};

export default BlogPostSEOSchema;
