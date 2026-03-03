
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { DomainMigrationManager } from '@/utils/domainMigration';
import { getCanonicalAndHreflang } from '@/utils/seoCanonicalHreflang';

const SEOHead = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  jsonLd,
  canonicalUrl: canonicalUrlProp,
  extraHeadElements,
  noindex = false,
}) => {
  const location = useLocation();

  const siteUrl = "https://primewatch.tv";
  const { canonicalUrl: canonicalFromPath, hreflangTr, hreflangDe, xDefaultUrl, lang } = getCanonicalAndHreflang(location.pathname, siteUrl);
  const currentUrl = canonicalUrlProp || canonicalFromPath;

  const siteName = "PrimeWatch TV";
  const defaultImage = `${siteUrl}/default-og-image.jpg`;

  const safeTitle = (title && typeof title === 'string' && title.trim().length > 0)
    ? title
    : "PrimeWatch TV - En İyi IPTV Abonelik | HD 4K Canlı TV İzleme";

  const metaDescription = (description && typeof description === 'string')
    ? description.substring(0, 160)
    : "Türkiye'nin en kaliteli IPTV hizmeti ile tanışın. Kesintisiz IPTV abonelik, 4K Ultra HD kanallar, donmayan yayınlar ve en uygun fiyatlar.";

  const metaKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : (typeof keywords === 'string' ? keywords : "iptv, kurulum, rehber, android, ios, smart tv, film önerileri, dizi önerileri, iptv abonelik, canlı tv");

  const metaImage = DomainMigrationManager.updateUrl(ogImage) || defaultImage;
  const ogLocale = lang === 'de' ? 'de_DE' : 'tr_TR';

  const renderJsonLd = () => {
    if (!jsonLd) return null;
    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    return schemas.map((schema, index) => (
      <script key={`schema-${index}`} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ));
  };

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={metaDescription} />
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hreflang="tr" href={hreflangTr} />
      <link rel="alternate" hreflang="de" href={hreflangDe} />
      <link rel="alternate" hreflang="x-default" href={xDefaultUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="author" content={siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <html lang={lang === 'de' ? 'de' : 'tr'} />

      <meta name="msvalidate.01" content="CA8DF3D0A50E3D150C561F86C75418F8" />

      <link rel="dns-prefetch" href="https://api.themoviedb.org" />
      <link rel="dns-prefetch" href="https://image.tmdb.org" />
      <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={safeTitle} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={lang === 'de' ? 'tr_TR' : 'de_DE'} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@primewatchtv" />

      {renderJsonLd()}
      {extraHeadElements}
    </Helmet>
  );
};

export default SEOHead;
