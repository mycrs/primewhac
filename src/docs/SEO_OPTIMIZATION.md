# SEO Optimization & Documentation

## Overview
This document outlines the SEO optimizations implemented across the QruzeHD application to improve search engine visibility and user engagement.

## 1. Meta Tags & Titles
- **Strategy:** All pages now feature unique, keyword-rich titles and descriptions (155-160 chars).
- **Implementation:** `seoMetadata.js` acts as the single source of truth, consumed by `SEOHead.jsx`.
- **Keywords:** "IPTV abonelik", "4K canlı TV", "donmayan IPTV", "kurulum rehberi".

## 2. Structured Data (JSON-LD)
- **Organization Schema:** Added to `HomePage` to establish brand identity.
- **Product Schema:** Added to `PackagesPage` for rich snippets in search results (pricing, availability).
- **HowTo Schema:** Added to `InstallationPage` for step-by-step guides.
- **BreadcrumbList:** Implemented across secondary pages for better site hierarchy understanding.

## 3. Content Enhancement
- **Heading Hierarchy:** Validated H1 -> H2 -> H3 structure across all main pages.
- **Keyword Integration:** Natural integration of long-tail keywords ("en iyi iptv", "kesintisiz izleme") into hero sections, package cards, and feature lists.
- **Readability:** Improved use of bold text, bullet points, and spacing.

## 4. Internal Linking
- **New Component:** `InternalLinkingOptimization.jsx` created.
- **Strategy:** Context-aware linking block at the bottom of major pages to guide users (Home -> Packages -> Installation).
- **Anchor Text:** Descriptive anchor text used instead of generic "click here".

## 5. Image Optimization
- **Alt Text:** All major images (Hero, Packages, Devices) now have descriptive alt attributes containing relevant keywords.
- **Performance:** Images use `loading="lazy"` where appropriate (except LCP images).

## 6. Technical SEO
- **Canonical URLs:** Self-referencing canonical tags added to all pages to prevent duplicate content issues.
- **Robots Meta:** Directives set to `index, follow` with snippet controls.
- **Open Graph:** Complete OG tags for Facebook/Twitter sharing.

## 7. Robots.txt Directives (Recommended)
Ensure your `public/robots.txt` contains: