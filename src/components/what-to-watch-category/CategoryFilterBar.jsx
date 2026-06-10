import React from 'react';
import { ArrowUpDown, Filter, X } from 'lucide-react';

/**
 * Kategori sayfası için client-side filter + sort kontrolleri.
 *
 * Props:
 *  - items: ham item listesi (filtre seçeneklerini türetmek için)
 *  - filters: { year, genre, minRating }
 *  - onFiltersChange: (newFilters) => void
 *  - sortBy: 'default' | 'rating-desc' | 'year-desc' | 'year-asc' | 'popular'
 *  - onSortChange: (sort) => void
 *  - lang: 'tr' | 'de'
 */
const CategoryFilterBar = ({
  items = [],
  filters = {},
  onFiltersChange,
  sortBy = 'default',
  onSortChange,
  lang = 'tr',
}) => {
  const isDe = lang === 'de';
  const t = isDe
    ? {
        filter: 'Filter',
        sort: 'Sortieren',
        year: 'Jahr',
        genre: 'Genre',
        rating: 'Mindestbewertung',
        all: 'Alle',
        any: 'Beliebig',
        clear: 'Filter zurücksetzen',
        sortOptions: {
          default: 'Empfehlung',
          'rating-desc': 'Beste Bewertung',
          'year-desc': 'Neueste zuerst',
          'year-asc': 'Älteste zuerst',
          popular: 'Beliebteste',
        },
      }
    : {
        filter: 'Filtrele',
        sort: 'Sırala',
        year: 'Yıl',
        genre: 'Tür',
        rating: 'Min puan',
        all: 'Hepsi',
        any: 'Fark etmez',
        clear: 'Filtreleri temizle',
        sortOptions: {
          default: 'Editör seçimi',
          'rating-desc': 'En yüksek puanlı',
          'year-desc': 'En yeniler',
          'year-asc': 'En eskiler',
          popular: 'En çok izlenenler',
        },
      };

  const years = Array.from(new Set(items.map((i) => i.year).filter(Boolean))).sort((a, b) => b - a);
  const genres = Array.from(new Set(items.flatMap((i) => i.genres || []))).sort();
  const hasActive = filters.year || filters.genre || filters.minRating;

  const updateFilter = (key, value) => {
    onFiltersChange?.({ ...filters, [key]: value || undefined });
  };

  const clearAll = () => {
    onFiltersChange?.({});
  };

  return (
    <div
      className="sticky top-16 z-20 bg-[#0a0a0a]/95 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 mb-6 shadow-lg"
      role="toolbar"
      aria-label={t.filter}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          {t.filter}:
        </div>

        {/* Year filter */}
        <label className="flex items-center gap-2">
          <span className="sr-only">{t.year}</span>
          <select
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value ? Number(e.target.value) : null)}
            className="bg-[#141414] border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:border-primary focus:outline-none"
          >
            <option value="">{t.year}: {t.all}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        {/* Genre filter */}
        {genres.length > 0 && (
          <label className="flex items-center gap-2">
            <span className="sr-only">{t.genre}</span>
            <select
              value={filters.genre || ''}
              onChange={(e) => updateFilter('genre', e.target.value)}
              className="bg-[#141414] border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:border-primary focus:outline-none"
            >
              <option value="">{t.genre}: {t.all}</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Rating filter */}
        <label className="flex items-center gap-2">
          <span className="sr-only">{t.rating}</span>
          <select
            value={filters.minRating || ''}
            onChange={(e) => updateFilter('minRating', e.target.value ? Number(e.target.value) : null)}
            className="bg-[#141414] border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:border-primary focus:outline-none"
          >
            <option value="">{t.rating}: {t.any}</option>
            <option value="7">7.0+</option>
            <option value="8">8.0+</option>
            <option value="9">9.0+</option>
          </select>
        </label>

        {/* Clear */}
        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            {t.clear}
          </button>
        )}

        {/* Sort (right side) */}
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-4 h-4" />
              {t.sort}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="bg-[#141414] border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:border-primary focus:outline-none"
            >
              {Object.entries(t.sortOptions).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilterBar;
