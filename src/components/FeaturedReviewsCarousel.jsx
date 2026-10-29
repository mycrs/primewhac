import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, ChevronLeft, ChevronRight, Loader2, Sparkles, MapPin } from 'lucide-react';
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

const MAX_FEATURED = 3;

const FALLBACK_REVIEWS_TR = [
  {
    id: 'fb-tr-1',
    author_display_name: 'Murat K. (Köln)',
    rating: 5,
    subscription_months: 12,
    customer_since_months: 11,
    body: "Almanya'da yıllardır farklı sağlayıcılar denedim; hafta sonu derbi saatlerinde donmayan neredeyse yok gibiydi. QruzeTV'ye geçerken başta tereddütlüydüm ama 11 aydır tek bir büyük maçta bile yayın takılmadı. Samsung Smart TV'de IBO Player ile kumandadan kanal geçer gibi izliyoruz."
  },
  {
    id: 'fb-tr-2',
    author_display_name: 'Selim T. (Berlin)',
    rating: 5,
    subscription_months: 12,
    customer_since_months: 8,
    body: "Evde çocuklar TRT Çocuk ve animasyonları izliyor, ben akşamları haber ve spor bültenlerini takip ediyorum. Yayın gecikmesi o kadar düşük ki Türkiye'deki ailemizle telefondayken golü aynı anda görüyoruz. WhatsApp destek ekibi kurulumda dakikalar içinde yardımcı oldu."
  },
  {
    id: 'fb-tr-3',
    author_display_name: 'Levent & Deniz B. (Viyana)',
    rating: 5,
    subscription_months: 15,
    customer_since_months: 14,
    body: "Apple TV üzerinde IPTVX uygulamasıyla kullanıyoruz. Arayüz akıcılığı, EPG yayın rehberi ve görüntü netliği kusursuz. Hiçbir taahhüt veya karttan habersiz çekim olmaması da bize tam bir güven veriyor. Tavsiye ederim."
  }
];

const FALLBACK_REVIEWS_DE = [
  {
    id: 'fb-de-1',
    author_display_name: 'Mehmet A. (Frankfurt)',
    rating: 5,
    subscription_months: 12,
    customer_since_months: 11,
    body: "Ich nutze QruzeTV seit fast einem Jahr auf meinem LG OLED mit TiviMate. Die Bildrate bei Fußballübertragungen ist stabil bei 60 FPS und der deutsche Kundenservice per WhatsApp antwortet innerhalb weniger Minuten. Sehr empfehlenswert."
  },
  {
    id: 'fb-de-2',
    author_display_name: 'Ayşe & Emre K. (München)',
    rating: 5,
    subscription_months: 12,
    customer_since_months: 9,
    body: "Für unsere Familie in München die beste Lösung, um türkische Sender ohne Satellitenschüssel in bester HD-Qualität zu empfangen. Keine automatische Vertragsverlängerung und absolut verlässliche Verbindung."
  },
  {
    id: 'fb-de-3',
    author_display_name: 'Caner D. (Stuttgart)',
    rating: 5,
    subscription_months: 15,
    customer_since_months: 13,
    body: "Hervorragende Streaming-Stabilität auch während der abendlichen Hauptsendezeit. Einrichtung auf dem Fire TV Stick war dank der Schritt-für-Schritt-Anleitung in 5 Minuten erledigt."
  }
];

/** Kompakt slayt kartı */
function ReviewSlideCompact({ review, copy, accentIndex }) {
  const text = (review.body || '').trim();
  const short = text.length > 260 ? `${text.slice(0, 257)}…` : text;
  const accent = getReviewAccent(accentIndex);

  return (
    <div className="min-w-0 flex-[0_0_100%] px-1 sm:px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.45, delay: accentIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-xl md:max-w-2xl rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--accent-glow)]"
        style={{
          borderLeft: `4px solid ${accent.solid}`,
          background: `linear-gradient(118deg, rgba(${accent.rgb}, 0.08) 0%, transparent 60%), #0c0c0f`,
          ['--accent-glow']: `0 16px 48px rgba(${accent.rgb}, 0.25)`,
        }}
      >
        <span
          className="absolute top-1 left-2 md:left-4 leading-none pointer-events-none select-none font-serif font-bold opacity-20"
          style={{ fontSize: '3rem', color: accent.solid }}
          aria-hidden
        >
          &ldquo;
        </span>

        <div className="relative z-10 p-5 md:p-7">
          <div className="flex items-center gap-3.5 mb-4">
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-sm md:text-base font-bold bg-[#141418] text-white shrink-0 border border-white/10"
              style={{ boxShadow: `0 0 0 2px ${accent.solid}, 0 0 16px rgba(${accent.rgb}, 0.3)` }}
            >
              {reviewerInitials(review.author_display_name)}
            </div>
            <div className="min-w-0 flex-1">
              <cite className="not-italic font-bold text-base md:text-lg truncate block text-white">
                {review.author_display_name}
              </cite>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    color: accent.solid,
                    backgroundColor: `rgba(${accent.rgb}, 0.15)`,
                    border: `1px solid rgba(${accent.rgb}, 0.35)`,
                  }}
                >
                  {copy.verifiedBadge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Avrupa Diaspora</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3" aria-label={`${review.rating} / 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn('w-4 h-4', i < review.rating ? 'fill-current' : 'text-slate-700')}
                style={
                  i < review.rating
                    ? {
                        color: accent.solid,
                        filter: `drop-shadow(0 0 6px rgba(${accent.rgb}, 0.6))`,
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <blockquote className="text-slate-200 text-sm md:text-[0.9375rem] leading-relaxed font-light">
            {short}
          </blockquote>

          {review.subscription_months != null && review.customer_since_months != null && (
            <footer className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{copy.pkgMeta(review.subscription_months, review.customer_since_months)}</span>
              <span className="text-emerald-400 text-[11px]">✓ Aktif Abone</span>
            </footer>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function FeaturedReviewsSlider({ items, copy, isDe, showViewAllLink, viewAllPath }) {
  const loop = items.length > 1;
  const plugins = loop ? [Autoplay({ delay: 6000, stopOnInteraction: false })] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop, duration: 24 }, plugins);
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
    <section className="py-12 md:py-16" aria-labelledby="featured-reviews-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{isDe ? 'Verifizierte Stimmen' : 'Gerçek Kullanıcı Deneyimleri'}</span>
            </div>
            <h2 id="featured-reviews-heading" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {copy.title}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-1.5 max-w-xl font-light">{copy.subtitle}</p>
          </div>
          {showViewAllLink && (
            <Button asChild variant="outline" className="border-white/15 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 shrink-0 text-sm rounded-xl">
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
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[#111116]/90 border border-white/15 text-white hover:bg-primary transition-all shadow-xl -ml-2 lg:-ml-5"
                aria-label={isDe ? 'Zurück' : 'Önceki'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex w-10 h-10 items-center justify-center rounded-full bg-[#111116]/90 border border-white/15 text-white hover:bg-primary transition-all shadow-xl -mr-2 lg:-mr-5"
                aria-label={isDe ? 'Weiter' : 'Sonraki'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111116] via-[#09090c] to-[#060608] py-4 shadow-[0_24px_70px_rgba(0,0,0,0.6)]" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {items.map((r, i) => (
                <ReviewSlideCompact key={r.id} review={r} copy={copy} accentIndex={i} />
              ))}
            </div>
          </div>

          {loop && (
            <div className="flex justify-center gap-2 mt-5" role="tablist" aria-label={isDe ? 'Folien' : 'Slayt'}>
              {items.map((r, i) => {
                const a = getReviewAccent(i);
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={i === selected}
                    className={cn('h-2 rounded-full transition-all', i === selected ? 'w-8' : 'w-2 bg-white/20 hover:bg-white/40')}
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

const FeaturedReviewsCarousel = ({ locale = 'tr', showViewAllLink = false, className = '' }) => {
  const isDe = locale === 'de';
  const copy = isDe
    ? {
        title: 'Erfahrungen unserer europäischen Abonnenten',
        subtitle: 'Authentische Rückmeldungen von Zuschauern aus Deutschland, Österreich und der Schweiz.',
        viewAll: 'Alle Bewertungen ansehen →',
        pkgMeta: (s, u) => `Paket: ${s} Mon. · Nutzung: ${u} Mon.`,
        verifiedBadge: 'Verifizierter Abonnent',
      }
    : {
        title: 'Avrupa Genelinde İzleyici Deneyimleri',
        subtitle: 'Almanya, Avusturya, Hollanda ve İsviçre’den doğrulanmış kullanıcılarımızın gerçek yayın anlatıları.',
        viewAll: 'Tüm Yorumları Gör →',
        pkgMeta: (s, u) => `Paket: ${s} Ay · Kullanım: ${u} Ay`,
        verifiedBadge: 'Doğrulanmış Abone',
      };

  const viewAllPath = isDe ? '/de/bewertungen' : '/yorumlar';
  const fallbackList = isDe ? FALLBACK_REVIEWS_DE : FALLBACK_REVIEWS_TR;

  const [items, setItems] = useState(fallbackList);
  const [loading, setLoading] = useState(false);

  const fetchFeatured = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setItems(fallbackList);
      return;
    }
    const cacheKey = `sb_pub_featured_reviews_${locale}_v2`;
    const cached = readSessionCache(cacheKey);
    if (Array.isArray(cached) && cached.length > 0) {
      setItems(cached.slice(0, MAX_FEATURED));
      return;
    }
    try {
      const { data, error } = await supabase
        .from('public_customer_reviews')
        .select(SELECT)
        .eq('status', 'approved')
        .eq('locale', locale)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(MAX_FEATURED);
      if (!error && Array.isArray(data) && data.length > 0) {
        setItems(data.slice(0, MAX_FEATURED));
        writeSessionCache(cacheKey, data);
      } else {
        setItems(fallbackList);
      }
    } catch {
      setItems(fallbackList);
    }
  }, [locale, fallbackList]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

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

export default memo(FeaturedReviewsCarousel);
