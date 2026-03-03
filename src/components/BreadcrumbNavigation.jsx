import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';

const BreadcrumbNavigation = ({ customCrumbs }) => {
  const location = useLocation();
  
  // Generate crumbs from path if no custom crumbs provided
  const pathnames = location.pathname.split('/').filter(x => x);
  
  let crumbs = [];
  
  if (customCrumbs) {
    crumbs = customCrumbs;
  } else {
    // Default Home crumb
    crumbs.push({ name: 'Ana Sayfa', path: '/' });
    
    let currentPath = '';
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
      
      crumbs.push({
        name: formattedName,
        path: isLast ? null : currentPath
      });
    });
  }

  // Schema.org BreadcrumbList
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.path ? `${window.location.origin}${crumb.path}` : undefined
    }))
  };

  if (location.pathname === '/') return null;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-slate-600" />}
                
                {index === 0 ? (
                  <Link 
                    to={crumb.path} 
                    className="flex items-center hover:text-purple-400 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span className="sr-only">{crumb.name}</span>
                  </Link>
                ) : isLast ? (
                  <span className="text-purple-400 font-medium truncate max-w-[200px]" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    className="hover:text-purple-400 transition-colors"
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