import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Film, Tv, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { buildTmdbPosterUrl } from '@/data/whatToWatchCategories';

/**
 * Curated kategori sayfalarındaki film/dizi kartı.
 * - Detay sayfası TMDB numeric id bekliyor (/ne-izlesem/:imdbID param adına rağmen TMDB ID'dir).
 *   Bu nedenle link tmdbId üzerinden kurulur; tmdbId yoksa kart tıklanmaz (statik gösterim).
 * - posterPath varsa TMDB CDN'den resim çekilir (lazy loading, skeleton).
 * - trending=true → kırmızı "Trend" rozeti gösterir.
 * - imdbId Schema.org identifier olarak saklanır (link üretimi için değil).
 * - TMDB attribution kart seviyesinde DEĞİL, sayfa seviyesinde tek blok olarak gösterilir.
 */
const CategoryItemCard = ({ item, index = 0, lang = 'tr' }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const {
    imdbId,
    tmdbId,
    title,
    year,
    genres = [],
    rating,
    description,
    posterPath,
    type,
    trending,
  } = item;

  const posterUrl = buildTmdbPosterUrl(posterPath, 'w500');
  const isDe = lang === 'de';
  const detailBasePath = isDe ? '/de/was-soll-ich-schauen' : '/ne-izlesem';
  const detailPath = tmdbId ? `${detailBasePath}/${tmdbId}?type=${type || 'movie'}` : null;

  const labels = isDe
    ? {
        type: type === 'tv' ? 'Serie' : 'Film',
        trending: 'Trending',
        details: 'Details anzeigen',
        noImage: 'Kein Bild verfügbar',
      }
    : {
        type: type === 'tv' ? 'Dizi' : 'Film',
        trending: 'Trend',
        details: 'Detaylara bak',
        noImage: 'Görsel bulunamadı',
      };

  const CardWrapper = detailPath ? Link : 'div';
  const wrapperProps = detailPath
    ? { to: detailPath, 'aria-label': `${title} ${labels.details}` }
    : {};

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
      className="group relative h-full"
      itemScope
      itemType={type === 'tv' ? 'https://schema.org/TVSeries' : 'https://schema.org/Movie'}
    >
      <CardWrapper
        {...wrapperProps}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl"
      >
        <div className="relative bg-[#0a0a0a]/95 rounded-3xl overflow-hidden border border-slate-800/80 group-hover:border-primary/60 shadow-xl group-hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col">
          {/* Poster area */}
          <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-900 via-[#141414] to-black">
            {posterUrl && !imgError ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {type === 'tv' ? (
                      <Tv className="w-16 h-16 text-slate-700 animate-pulse" />
                    ) : (
                      <Film className="w-16 h-16 text-slate-700 animate-pulse" />
                    )}
                  </div>
                )}
                <img
                  src={posterUrl}
                  alt={`${title} (${year}) ${labels.type.toLowerCase()} posteri`}
                  loading="lazy"
                  decoding="async"
                  width="500"
                  height="750"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  itemProp="image"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 px-4 text-center">
                {type === 'tv' ? <Tv className="w-16 h-16 mb-3" /> : <Film className="w-16 h-16 mb-3" />}
                <span className="text-xs text-slate-500">{labels.noImage}</span>
              </div>
            )}

            {/* Gradient overlay at bottom of poster */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

            {/* Top-left: rating badge */}
            {typeof rating === 'number' && rating > 0 && (
              <div className="absolute top-3 left-3 bg-yellow-500/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-black font-extrabold flex items-center gap-1.5 shadow-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                  <span itemProp="ratingValue">{rating.toFixed(1)}</span>
                  <meta itemProp="bestRating" content="10" />
                </span>
              </div>
            )}

            {/* Top-right: trending badge + type */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
              {trending && (
                <div className="bg-primary/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-extrabold flex items-center gap-1 shadow-md animate-pulse">
                  <Flame className="w-3 h-3" />
                  {labels.trending}
                </div>
              )}
              <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-semibold border border-white/10 flex items-center gap-1.5">
                {type === 'tv' ? (
                  <Tv className="w-3 h-3 text-blue-400" />
                ) : (
                  <Film className="w-3 h-3 text-primary" />
                )}
                {labels.type}
              </div>
            </div>
          </div>

          {/* Text area */}
          <div className="p-4 flex flex-col flex-grow gap-2">
            <h3
              className="text-white font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors"
              itemProp="name"
            >
              {title}
            </h3>

            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              {year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span itemProp="datePublished">{year}</span>
                </span>
              )}
              {genres.length > 0 && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="truncate" itemProp="genre">
                    {genres.slice(0, 2).join(', ')}
                  </span>
                </>
              )}
            </div>

            {description && (
              <p
                className="text-slate-300 text-[13px] leading-relaxed line-clamp-4 flex-grow"
                itemProp="description"
              >
                {description}
              </p>
            )}

            {/* Footer: sadece CTA — TMDB attribution sayfa düzeyinde */}
            {detailPath && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                <span className="text-[11px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {labels.details} →
                </span>
              </div>
            )}

            {imdbId ? <meta itemProp="identifier" content={imdbId} /> : null}
          </div>
        </div>
      </CardWrapper>
    </motion.article>
  );
};

export default CategoryItemCard;
