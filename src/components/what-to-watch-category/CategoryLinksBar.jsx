import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categoryListTR, categoryListDE } from '@/data/whatToWatchCategories';

/**
 * Kategori sayfaları arasında yatay gezinme barı.
 * Internal linking + SEO sinyali için kritik: her kategori sayfası diğer kategorilere link verir.
 *
 * Props:
 *  - lang: 'tr' | 'de'
 *  - activeSlug: şu anki sayfa (vurgulamak için)
 */
const CategoryLinksBar = ({ lang = 'tr', activeSlug = null }) => {
  const location = useLocation();
  const list = lang === 'de' ? categoryListDE : categoryListTR;
  const isDe = lang === 'de';

  const title = isDe ? 'Kategorien entdecken' : 'Kategorileri Keşfet';
  const homeLabel = isDe ? 'Alle ansehen' : 'Tümünü gör';
  const homePath = isDe ? '/de/was-soll-ich-schauen' : '/ne-izlesem';

  if (!list || list.length === 0) return null;

  const current = activeSlug ?? location.pathname.split('/').filter(Boolean).pop();

  return (
    <nav
      className="my-6 bg-gradient-to-r from-[#0a0a0a] via-[#141414] to-[#0a0a0a] border border-slate-800/80 rounded-2xl px-4 py-4"
      aria-label={title}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
          {title}
        </h2>
        <Link
          to={homePath}
          className="text-primary text-xs font-semibold hover:underline"
        >
          {homeLabel} →
        </Link>
      </div>
      <ul className="flex flex-wrap gap-2">
        {list.map((cat) => {
          const isActive = cat.slug === current;
          return (
            <li key={cat.slug}>
              <Link
                to={cat.urlPath}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                  isActive
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#0a0a0a] text-slate-300 border-slate-700 hover:border-primary/60 hover:text-primary'
                }`}
              >
                {cat.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryLinksBar;
