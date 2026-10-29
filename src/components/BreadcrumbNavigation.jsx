import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils';
import { sanitizeJsonLdSchema } from '@/utils/jsonLdSanitize';
import { SITE_URL } from '@/constants/siteUrl';

const BreadcrumbNavigation = ({ customCrumbs, className, listClassName, tone = 'default' }) => {
  const isCinema = tone === 'cinema';
  const isCinemaBlue = tone === 'cinemaBlue';
  const cinemaTone = isCinema || isCinemaBlue;
  const location = useLocation();
  const siteUrl = SITE_URL;
  const isDe = location.pathname === '/de' || location.pathname.startsWith('/de/');
  
  // Generate crumbs from path if no custom crumbs provided
  const pathnames = location.pathname.split('/').filter(x => x).filter((x, index) => !(isDe && index === 0 && x === 'de'));
  
  let crumbs = [];
  
  if (customCrumbs) {
    crumbs = customCrumbs;
  } else {
    // Default Home crumb
    crumbs.push({ name: isDe ? 'Startseite' : 'Ana Sayfa', path: isDe ? '/de/' : '/' });
    
    let currentPath = isDe ? '/de' : '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      const isLast = index === pathnames.length - 1;
      
      // Basic name formatting
      let formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
      
      // Override specific path names
      if (name === 'faq') formattedName = 'Sıkça Sorulan Sorular';
      if (name === 'installation') formattedName = 'Kurulum Rehberi';
      if (name === 'contact') formattedName = 'İletişim';
      if (name === 'about') formattedName = 'Hakkımızda';
      if (name === 'blog') formattedName = 'Blog';
      if (name === 'packages') formattedName = 'Paketler';
      if (isDe && name === 'pakete') formattedName = 'Pakete';
      if (isDe && name === 'kanale') formattedName = 'Kanäle';
      if (isDe && name === 'einrichtung') formattedName = 'Einrichtung';
      if (isDe && name === 'uber-uns') formattedName = 'Über uns';
      if (isDe && name === 'bewertungen') formattedName = 'Bewertungen';
      if (isDe && name === 'sss') formattedName = 'Häufige Fragen';
      if (isDe && name === 'test') formattedName = 'Kostenloser Test';
      
      crumbs.push({
        name: formattedName,
        path: isLast ? null : currentPath
      });
    });
  }

  // Schema.org BreadcrumbList (item: son öğede verilmez; boş alan sanitize ile elenir)
  const schema = sanitizeJsonLdSchema({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.path ? `${siteUrl}${crumb.path}` : undefined
    }))
  });

  if (location.pathname === '/') return null;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema || {})}
        </script>
      </Helmet>
      
      <nav aria-label="Breadcrumb" className={cn('py-4', className)}>
        <ol className={cn('flex flex-wrap items-center gap-2 text-sm text-slate-400', listClassName)}>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className={cn('w-3.5 h-3.5 mx-1 shrink-0', cinemaTone ? 'text-white/25' : 'text-slate-600')} />
                )}
                
                {index === 0 ? (
                  <Link
                    to={crumb.path}
                    className={cn(
                      'flex items-center transition-colors',
                      isCinemaBlue ? 'text-white/60 hover:text-white' : isCinema ? 'text-white/60 hover:text-[#e50914]/90' : 'hover:text-primary'
                    )}
                  >
                    <Home className="w-4 h-4" />
                    <span className="sr-only">{crumb.name}</span>
                  </Link>
                ) : isLast ? (
                  <span
                    className={cn(
                      'font-medium truncate max-w-[200px]',
                      isCinemaBlue ? 'text-white' : isCinema ? 'text-white/75' : 'text-primary'
                    )}
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className={cn(
                      isCinemaBlue ? 'text-white/60 hover:text-white' : isCinema ? 'text-white/60 hover:text-[#e50914]/90' : 'hover:text-primary',
                      'transition-colors'
                    )}
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default BreadcrumbNavigation;
