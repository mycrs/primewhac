
import React from 'react';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { sanitizeJsonLdSchema } from '@/utils/jsonLdSanitize';
import { SITE_URL } from '@/constants/siteUrl';

/** Tarihi ISO 8601 formatına çevirir */
function toISO(dateValue) {
  if (!dateValue) return undefined;
  try {
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Blog yazısı sayfası için Article schema (JSON-LD).
 * Kurallar: headline = sayfa başlığı, description = meta description, image = ana görsel, tarihler ISO.
 */
export const generateArticleSchema = (post, currentPostUrl) => {
  if (!post) return null;

  const postUrl = currentPostUrl || `${SITE_URL}/blog/${post.slug || post.id}`;
  const headline = (post.title || '').trim() || 'Blog yazısı';
  const descRaw = post.seo_description || post.excerpt || post.title || '';
  const description = String(descRaw).trim().substring(0, 5000);
  const image = DomainMigrationManager.updateUrl(post.cover_image_url) || `${SITE_URL}/default-og-image.jpg`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": (post.author && String(post.author).trim()) || "QruzeTV Editor",
      "url": DomainMigrationManager.updateUrl(post.author_url) || SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "QruzeTV",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/default-og-image.jpg`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };
  const dp = toISO(post.published_at || post.created_at);
  const dm = toISO(post.updated_at || post.published_at || post.created_at);
  if (dp) schema.datePublished = dp;
  if (dm) schema.dateModified = dm;
  return sanitizeJsonLdSchema(schema);
};

export const generateBlogSchema = (post, currentPostUrl) => {
  if (!post) return null;

  const postUrl = currentPostUrl || `${SITE_URL}/blog/${post.slug || post.id}`;
  const headline = (post.seo_title || post.title || '').trim() || 'Blog yazısı';
  const descRaw = post.seo_description || post.excerpt || post.title || '';
  const description = String(descRaw).trim().substring(0, 5000);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": headline,
    "description": description,
    "image": DomainMigrationManager.updateUrl(post.cover_image_url) || `${SITE_URL}/default-og-image.jpg`,
    "author": {
      "@type": "Person",
      "name": (post.author && String(post.author).trim()) || "QruzeTV Editor",
      "url": DomainMigrationManager.updateUrl(post.author_url) || SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "QruzeTV",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/default-og-image.jpg`
      }
    },
  };
  const dp = toISO(post.published_at || post.created_at);
  const dm = toISO(post.updated_at || post.published_at || post.created_at);
  if (dp) schema.datePublished = dp;
  if (dm) schema.dateModified = dm;
  const kw = Array.isArray(post.tags) ? post.tags.filter(Boolean).join(', ') : '';
  if (kw) schema.keywords = kw;
  const section = post.category && String(post.category).trim();
  if (section) schema.articleSection = section;
  return sanitizeJsonLdSchema(schema);
};

export const BlogPostSEOSchema = ({ post, siteUrl }) => {
  const schema = generateBlogSchema(post, siteUrl);

  if (!schema || typeof schema !== 'object') return null;

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
};

export default BlogPostSEOSchema;
