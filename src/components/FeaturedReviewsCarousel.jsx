import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { isSupabaseConfigured } from '@/utils/envValidator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getReviewAccent, reviewerInitials } from '@/constants/reviewAccents';
import { trackCtaClick } from '@/utils/analyticsTracking';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';

const SELECT =
  'id, author_display_name, rating, body, subscription_months, customer_since_months, created_at, moderated_at';

const MAX_FEATURED = 2;

/** Kompakt slayt kartı */
function ReviewSlideCompact({ review, copy, accentIndex }) {
  const text = (review.body || '').trim();
  const short = text.length > 220 ? `${text.slice(0, 217)}…` : text;
  const accent = getReviewAccent(accentIndex);

  return (
    <div className="min-w-0 flex-[0_0_100%] px-1 sm:px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45, delay: accentIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-xl md:max-w-2xl rounded-2xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--accent-glow)]"
        style={{
          borderLeft: `3px solid ${accent.solid}`,
          background: `linear-gradient(118deg, rgba(${accent.rgb}, 0.06) 0%, transparent 55%), #09090b`,
          ['--accent-glow']: `0 12px 40px rgba(${accent.rgb}, 0.3)`,
        }}
      >
        <span
          className="absolute top-1 left-2 md:left-4 leading-none pointer-events-none select-none font-serif font-bold opacity-25"
          style={{ fontSize: '2.75rem', color: accent.solid }}
          aria-hidden
        >
          &ldquo;
        </span>

        <div className="relative z-10 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm md:text-base font-bold bg-[#0a0a0a]/80 text-slate-100 shrink-0"
              style={{ boxShadow: `0 0 0 2px ${accent.solid}, 0 0 14px rgba(${accent.rgb}, 0.35)` }}
            >
              {reviewerInitials(review.author_display_name)}
            </div>
            <div className="min-w-0 flex-1">
              <cite className="not-italic font-semibold text-sm md:text-base truncate block" style={{ color: accent.solid }}>
                {review.author_display_name}
              </cite>
              <span
                className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{
                  color: accent.solid,
                  backgroundColor: `rgba(${accent.rgb}, 0.14)`,
                  border: `1px solid rgba(${accent.rgb}, 0.35)`,
                }}
              >
                {copy.verifiedBadge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 mb-2" aria-label={`${review.rating} / 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn('w-3.5 h-3.5 md:w-4 md:h-4', i < review.rating ? 'fill-current' : 'text-slate-600')}
                style={
                  i < review.rating
                    ? {
                        color: accent.solid,
                        filter: `drop-shadow(0 0 6px rgba(${accent.rgb}, 0.65))`,
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <blockquote className="text-slate-100 text-sm md:text-[0.9375rem] leading-relaxed whitespace-pre-wrap line-clamp-5 md:line-clamp-6">
            {short}
          </blockquote>

          {review.subscription_months != null && review.customer_since_months != null && (
            <footer className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-500">
              {copy.pkgMeta(review.subscription_months, review.customer_since_months)}
            </footer>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function FeaturedReviewsSlider({ items, copy, isDe, showViewAllLink, viewAllPath }) {
  const loop = items.length > 1;
  const plugins = loop ? [Autoplay({ delay: 5200, stopOnInteraction: false })] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop, duration: 22 }, plugins);

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, items]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="luxury-rail py-8 md:py-12" aria-labelledby="featured-reviews-heading">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="luxury-kicker mb-3">{isDe ? 'Verifizierte Stimmen' : 'Doğrulanmış deneyim'}</span>
            <h2 id="featured-reviews-heading" className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {copy.title}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1.5 max-w-xl">{copy.subtitle}</p>
          </div>
          {showViewAllLink && (
            <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 shrink-0 text-sm">
              <Link to={viewAllPath} title={copy.viewAll}>{copy.viewAll}</Link>
            </Button>
          )}
        </div>

        <div className="relative max-w-3xl md:max-w-4xl mx-auto">
          {loop && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[#0a0a0a]/90 border border-white/10 text-white hover:bg-[#0a0a0a] shadow-lg -ml-1 lg:-ml-3"
                aria-label={isDe ? 'Zurück' : 'Önceki'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[#0a0a0a]/90 border border-white/10 text-white hover:bg-[#0a0a0a] shadow-lg -mr-1 lg:-mr-3"
                aria-label={isDe ? 'Weiter' : 'Sonraki'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_70px_rgba(0,0,0,0.32)]" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {items.map((r, i) => (
                <ReviewSlideCompact key={r.id} review={r} copy={copy} accentIndex={i} />
              ))}
            </div>
          </div>

          {loop && (
            <div className="flex justify-center gap-1.5 mt-5" role="tablist" aria-label={isDe ? 'Folien' : 'Slayt'}>
              {items.map((r, i) => {
                const a = getReviewAccent(i);
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={i === selected}
                    className={cn('h-2 rounded-full transition-all', i === selected ? 'w-6' : 'w-2 bg-[#0a0a0a] hover:opacity-80')}
                    style={
                      i === selected
                        ? { backgroundColor: a.solid, boxShadow: `0 0 12px rgba(${a.rgb}, 0.6)` }
                        : undefined
                    }
                    onClick={() => emblaApi?.scrollTo(i)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Onaylı + is_featured; en fazla 2 yorum, slayt.
 */
const FeaturedReviewsCarousel = ({ locale = 'tr', showViewAllLink = false, className = '' }) => {
  const isDe = locale === 'de';
  const copy = isDe
    ? {
        title: 'Hervorgehobene Kundenbewertungen',
        subtitle: 'Ausgewählte, geprüfte Erfahrungen unserer Nutzer.',
        viewAll: 'Alle Bewertungen',
        emptyTitle: 'Kundenerfahrungen werden kuratiert',
        emptySubtitle: 'Sehen Sie geprüfte Bewertungen oder teilen Sie nach Ihrem Test Ihre Erfahrung.',
        emptyCta: 'Bewertungen ansehen',
        pkgMeta: (s, u) => `Paket: ${s} Mon. · Nutzung: ${u} Mon.`,
        verifiedBadge: 'Verifizierter Kunde',
      }
    : {
        title: 'Öne çıkan yorumlar',
        subtitle: 'Onaylanmış müşterilerimizden seçili deneyimler.',
        viewAll: 'Tüm yorumlar',
        emptyTitle: 'Deneyiminizi paylaşın',
        emptySubtitle: 'Ücretsiz testi tamamladıktan sonra yayın deneyiminizi doğrulanmış müşteri yorumu olarak paylaşabilirsiniz.',
        emptyCta: 'Yorumları gör',
        pkgMeta: (s, u) => `Paket: ${s} ay · Kullanım: ${u} ay`,
        verifiedBadge: 'Doğrulanmış Müşteri',
      };

  const viewAllPath = isDe ? '/de/bewertungen' : '/yorumlar';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatured = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setItems([]);
      setLoading(false);
      return;
    }
    const cacheKey = `sb_pub_featured_reviews_${locale}_v1`;
    const cached = readSessionCache(cacheKey);
    if (Array.isArray(cached)) {
      setItems(cached.slice(0, MAX_FEATURED));
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('public_customer_reviews')
      .select(SELECT)
      .eq('status', 'approved')
      .eq('locale', locale)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(MAX_FEATURED);
    if (error) {
      console.error('[FeaturedReviewsCarousel]', error);
      setItems([]);
    } else {
      const rows = (data || []).slice(0, MAX_FEATURED);
      setItems(rows);
      writeSessionCache(cacheKey, rows);
    }
    setLoading(false);
  }, [locale]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  if (loading) {
    return (
      <section className={`py-8 bg-[#07070c] ${className}`} aria-busy="true">
        <div className="container mx-auto px-4 flex justify-center py-10">
          <Loader2 className="w-9 h-9 text-primary animate-spin" aria-label={isDe ? 'Lädt' : 'Yükleniyor'} />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={`luxury-rail py-8 md:py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="luxury-glass mx-auto max-w-3xl rounded-3xl p-6 text-center md:p-8">
            <span className="luxury-kicker mb-4">{isDe ? 'Social Proof' : 'Sosyal kanıt'}</span>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">{copy.emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">{copy.emptySubtitle}</p>
            <Button asChild variant="outline" className="mt-5 border-primary/40 text-primary hover:bg-primary/10">
              <Link
                to={viewAllPath}
                title={copy.emptyCta}
                onClick={() => trackCtaClick(isDe ? 'reviews_empty_state_de' : 'reviews_empty_state', 'featured_reviews')}
              >
                {copy.emptyCta}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className={className}>
      <FeaturedReviewsSlider
        key={items.map((r) => r.id).join('-')}
        items={items}
        copy={copy}
        isDe={isDe}
        showViewAllLink={showViewAllLink}
        viewAllPath={viewAllPath}
      />
    </div>
  );
};

export default FeaturedReviewsCarousel;
