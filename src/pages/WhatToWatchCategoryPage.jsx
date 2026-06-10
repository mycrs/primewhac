import React, { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { whatToWatchCategorySchemas } from '@/utils/seoSchema';
import {
  getCategoryTR,
  getSimilarCategoriesTR,
} from '@/data/whatToWatchCategories';
import CategoryItemCard from '@/components/what-to-watch-category/CategoryItemCard';
import CategoryLinksBar from '@/components/what-to-watch-category/CategoryLinksBar';
import CategoryCtaBox from '@/components/what-to-watch-category/CategoryCtaBox';
import CategoryFilterBar from '@/components/what-to-watch-category/CategoryFilterBar';
import SimilarCategories from '@/components/what-to-watch-category/SimilarCategories';
import TmdbAttribution from '@/components/what-to-watch-category/TmdbAttribution';

const CINEMA_NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/**
 * /ne-izlesem/{slug} rotalarına hizmet veren kategori sayfası (TR).
 * Her sayfa curated (editoryal) bir liste gösterir, filter + sort + "en çok izlenenler" bölümleri içerir.
 * URL slug'ı prop olarak verilir (App.jsx'te rota kayıtları bu propu geçer).
 * Prop verilmediyse useParams().category'den alınır.
 */
const WhatToWatchCategoryPage = ({ siteData, slug: slugProp }) => {
  const params = useParams();
  const slug = slugProp || params.category;

  const category = useMemo(() => getCategoryTR(slug), [slug]);

  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('default');

  const filteredItems = useMemo(() => {
    let result = Array.isArray(category?.items) ? [...category.items] : [];

    if (filters.year) result = result.filter((i) => i.year === filters.year);
    if (filters.genre)
      result = result.filter((i) => Array.isArray(i.genres) && i.genres.includes(filters.genre));
    if (filters.minRating)
      result = result.filter((i) => typeof i.rating === 'number' && i.rating >= filters.minRating);

    switch (sortBy) {
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'year-desc':
        result.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'year-asc':
        result.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'popular':
        result.sort((a, b) => {
          const aScore = (a.featured ? 10 : 0) + (a.trending ? 5 : 0) + (a.rating || 0);
          const bScore = (b.featured ? 10 : 0) + (b.trending ? 5 : 0) + (b.rating || 0);
          return bScore - aScore;
        });
        break;
      default:
        break;
    }
    return result;
  }, [category?.items, filters, sortBy]);

  const featuredItems = useMemo(
    () =>
      (category?.items || [])
        .filter((i) => i.featured || i.trending)
        .slice(0, 3),
    [category?.items],
  );

  const similar = useMemo(() => getSimilarCategoriesTR(slug, 3), [slug]);

  if (!category) {
    return <Navigate to="/ne-izlesem" replace />;
  }

  const metadata = {
    title: category.title,
    description: category.description,
    keywords: category.seoKeywords,
    ogType: 'website',
  };

  const jsonLd = whatToWatchCategorySchemas(category, 'tr');

  return (
    <>
      <SEOHead
        {...metadata}
        jsonLd={jsonLd}
        pageData={{ forceIndex: true, isEditorialCategory: true }}
      />

      <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] font-sans text-white selection:bg-[#e50914]/25 selection:text-white">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[#0a0a0a]" aria-hidden />
        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.045] mix-blend-overlay"
          style={{ backgroundImage: CINEMA_NOISE_DATA_URI, backgroundSize: '200px 200px' }}
          aria-hidden
        />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Header contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />

          <main className="mx-auto w-full max-w-7xl flex-grow px-5 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-28 lg:px-10">
            <BreadcrumbNavigation
              tone="cinema"
              className="py-3 sm:py-4"
              listClassName="text-[0.8125rem] sm:text-sm opacity-90"
              customCrumbs={[
                { name: 'Ana Sayfa', path: '/' },
                { name: 'Ne İzlesem', path: '/ne-izlesem' },
                { name: category.label, path: null },
              ]}
            />

            <section className="mb-8 text-center" aria-label="Sayfa başlığı">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <h1
                  className="font-extrabold tracking-tight text-white"
                  style={{ fontSize: 'clamp(1.6rem, 4.8vw, 2.5rem)', lineHeight: 1.2 }}
                >
                  {category.h1}
                </h1>
                <div
                  className="mx-auto mt-4 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#e50914]/45 to-transparent shadow-[0_0_14px_rgba(229,9,20,0.35)]"
                  aria-hidden
                />
                <div className="mx-auto mt-6 max-w-3xl text-left">
                  <p className="text-base sm:text-[17px] text-white/75 leading-relaxed">
                    {category.intro}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                  <Link to="/" className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline">
                    Ana sayfa
                  </Link>
                  <span className="text-white/20" aria-hidden>·</span>
                  <Link to="/ne-izlesem" className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline">
                    Ne İzlesem
                  </Link>
                  <span className="text-white/20" aria-hidden>·</span>
                  <Link to="/paketler" className="text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline">
                    IPTV paketleri
                  </Link>
                </div>
              </motion.div>
            </section>

            {/* Kategori gezinme bar'ı (internal linking) */}
            <CategoryLinksBar lang="tr" activeSlug={category.slug} />

            {/* En Çok İzlenenler bölümü */}
            {featuredItems.length > 0 && (
              <section className="mb-10" aria-labelledby="featured-heading">
                <header className="mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 id="featured-heading" className="text-white text-xl sm:text-2xl font-bold">
                    En Çok İzlenenler
                  </h2>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featuredItems.map((item, i) => (
                    <CategoryItemCard key={`featured-${item.id}`} item={item} index={i} lang="tr" />
                  ))}
                </div>
              </section>
            )}

            {/* Filter + Sort */}
            <CategoryFilterBar
              items={category.items}
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              lang="tr"
            />

            {/* Tam liste */}
            <section aria-labelledby="items-list-heading">
              <h2 id="items-list-heading" className="sr-only">
                {category.label} tam liste
              </h2>
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredItems.map((item, i) => (
                    <CategoryItemCard key={item.id} item={item} index={i} lang="tr" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <p className="text-lg font-semibold mb-2">Filtrelerle eşleşen içerik bulunamadı.</p>
                  <p className="text-sm">Filtreleri temizleyerek tüm listeyi görebilirsin.</p>
                </div>
              )}
            </section>

            {/* CTA */}
            <CategoryCtaBox lang="tr" />

            {/* Benzer öneriler */}
            <SimilarCategories categories={similar} lang="tr" />

            {/* Sayfa düzeyi TMDB attribution (her kartta değil) */}
            <TmdbAttribution lang="tr" />
          </main>

          <Footer contactData={siteData?.contactData} siteTexts={siteData?.siteTexts} />
        </div>
      </div>
    </>
  );
};

export default WhatToWatchCategoryPage;
