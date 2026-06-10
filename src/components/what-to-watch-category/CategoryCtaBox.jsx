import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Zap, ArrowRight } from 'lucide-react';

/**
 * Kategori sayfalarının altına koyulan CTA (conversion) bloğu.
 * Kullanıcıyı /paketler veya /de/pakete sayfasına yönlendirir.
 */
const CategoryCtaBox = ({ lang = 'tr' }) => {
  const isDe = lang === 'de';
  const content = isDe
    ? {
        headline: 'Diese Inhalte ohne Ruckler streamen?',
        body:
          'Mit QruzeTV genießt du 4K-Streaming, stabiles Live-TV und ein riesiges VoD-Archiv — alles in einem Abo.',
        cta: 'Jetzt Pakete ansehen',
        path: '/de/pakete',
        perks: ['4K-Qualität', 'Stabil ohne Lags', '24/7 Support'],
      }
    : {
        headline: 'Bu içerikleri donmadan izlemek ister misin?',
        body:
          'QruzeTV ile 4K yayın, stabil canlı TV ve geniş VOD arşivi seni bekliyor. Tek abonelikle hepsi.',
        cta: 'Hemen Paketleri İncele',
        path: '/paketler',
        perks: ['4K kalite', 'Donmayan yayın', '7/24 destek'],
      };

  return (
    <section
      className="my-12 relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/20 via-[#141414] to-[#0a0a0a] p-8 sm:p-10"
      aria-labelledby="category-cta-heading"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(229,9,20,0.25),transparent_50%)]"
      />
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-primary/20 border border-primary/50 rounded-2xl flex items-center justify-center">
            <Tv className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="flex-grow">
          <h2
            id="category-cta-heading"
            className="text-white text-2xl sm:text-3xl font-extrabold mb-2 leading-tight"
          >
            <span className="mr-2" aria-hidden="true">
              📺
            </span>
            {content.headline}
          </h2>
          <p className="text-slate-300 text-base mb-4 max-w-2xl">{content.body}</p>
          <ul className="flex flex-wrap gap-2 mb-5">
            {content.perks.map((perk) => (
              <li
                key={perk}
                className="inline-flex items-center gap-1.5 bg-[#0a0a0a]/70 border border-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <Zap className="w-3 h-3 text-primary" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-shrink-0">
          <Link
            to={content.path}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-base px-6 py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-105"
          >
            {content.cta}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryCtaBox;
