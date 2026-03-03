
# Domain Migration SEO Checklist (kaliteliiptv.com -> primewatch.tv)

## 1. 301 Redirect Verification
- [x] Implemented client-side fallback redirect in `src/middleware/redirectMiddleware.js`.
- [ ] **CRITICAL:** Configure permanent 301 redirects at your hosting provider (Vercel, Netlify, Cloudflare, etc.) to ensure search engines receive the correct HTTP status code. Frontend redirects alone are not sufficient for SEO juice transfer.
- [ ] Test redirects:
  - `http://kaliteliiptv.com` -> `https://primewatch.tv` (301)
  - `https://kaliteliiptv.com/blog` -> `https://primewatch.tv/blog` (301)
  - `https://kaliteliiptv.com/de/blog` -> `https://primewatch.tv/de/blog` (301)

## 2. Meta Tag & Canonical URL Preservation
- [x] Updated `SEOHead.jsx` to enforce `primewatch.tv` as the base domain for canonicals.
- [x] Explicitly set canonical URLs in `BlogListPage.jsx`, `BlogPostPage.jsx`, and `BlogPageDE.jsx`.
- [x] Updated OG Tags (`og:url`, `og:image`) and Twitter Cards to use the new domain.

## 3. Image and Internal Link Migration
- [x] Created `src/utils/linkMigration.js` to rewrite URLs dynamically.
- [x] Applied rewriting to fetched blog post content and image URLs in the frontend.
- [ ] **Database Action Required:** Run an SQL update script in Supabase to permanently replace old domains in the `blog_posts` table (content, cover_image_url).

## 4. Sitemap and Robots.txt
- [x] Updated `sitemapGenerator.js` to output `primewatch.tv` URLs exclusively.
- [ ] Ensure `robots.txt` is updated on the server to point to the new sitemap:
  