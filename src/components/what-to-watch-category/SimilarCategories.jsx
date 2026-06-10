import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Kategori sayfasının altında "Benzer öneriler" bölümü — internal linking için kritik.
 *
 * Props:
 *  - categories: benzer kategori objeleri (3 adet önerilir)
 *  - lang: 'tr' | 'de'
 */
const SimilarCategories = ({ categories = [], lang = 'tr' }) => {
  if (!Array.isArray(categories) || categories.length === 0) return null;

  const isDe = lang === 'de';
  const title = isDe ? 'Ähnliche Empfehlungen' : 'Benzer Öneriler';
  const subtitle = isDe
    ? 'Diese Kategorien könnten dir auch gefallen'
    : 'Bu kategorileri de beğenebilirsin';
  const browseLabel = isDe ? 'Jetzt stöbern' : 'Göz at';

  return (
    <section
      aria-labelledby="similar-categories-heading"
      className="my-12 border-t border-slate-800/80 pt-10"
    >
      <header className="mb-6">
        <h2
          id="similar-categories-heading"
          className="text-white text-2xl sm:text-3xl font-extrabold flex items-center gap-2 mb-1"
        >
          <Sparkles className="w-6 h-6 text-primary" />
          {title}
        </h2>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const previewItems = Array.isArray(cat.items) ? cat.items.slice(0, 3) : [];
          const count = Array.isArray(cat.items) ? cat.items.length : 0;
          const countLabel = isDe
            ? `${count} Empfehlung${count === 1 ? '' : 'en'}`
            : `${count} öneri`;

          return (
            <Link
              key={cat.slug}
              to={cat.urlPath}
              className="group relative bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-slate-800/80 hover:border-primary/60 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {previewItems.length > 0 && (
                <ul className="text-slate-400 text-xs space-y-1 mb-3">
                  {previewItems.map((it) => (
                    <li key={it.id} className="truncate">
                      • {it.title}
                      {it.year ? ` (${it.year})` : ''}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{countLabel}</span>
                <span className="text-primary font-semibold">{browseLabel} →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SimilarCategories;
