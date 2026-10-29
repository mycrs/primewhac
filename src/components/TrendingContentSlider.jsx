import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Tv, Radio, Compass, Film, HeartHandshake, Music2, ShieldCheck } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useWhenVisible } from '@/hooks/useWhenVisible';

const EDITORIAL_STREAMS_TR = [
  {
    id: 'stream-nature-4k',
    title: '4K Doğa & Kültür Belgeselleri',
    category: '4K UHD · 60 FPS',
    badge: 'Ultra Netlik',
    description: 'Yaban hayatı, okyanus derinlikleri ve dünya mirası serileri gerçek renk derinliğiyle ekranınızda.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
    icon: Compass,
    link: '/channels',
    gradient: 'from-emerald-500/30 via-emerald-950/20 to-black/80',
    borderGlow: 'group-hover:border-emerald-500/50',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'stream-national-news',
    title: '7/24 Kesintisiz Ulusal & Haber Akışı',
    category: 'Canlı EPG · Sıfır Gecikme',
    badge: 'Canlı Akış',
    description: 'Türkiye ve dünyadan tarafsız ana haber bültenleri, ekonomi ve güncel tartışma programları.',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=900&auto=format&fit=crop',
    icon: Radio,
    link: '/channels',
    gradient: 'from-red-500/30 via-red-950/20 to-black/80',
    borderGlow: 'group-hover:border-[#e50914]/50',
    tagColor: 'text-red-400 bg-red-500/10 border-red-500/20'
  },
  {
    id: 'stream-live-sports',
    title: 'Haftalık Canlı Maç & Spor Fikstürü',
    category: 'Canlı Fikstür · Anlık Saatler',
    badge: 'Spor Rehberi',
    description: 'Süper Lig, Şampiyonlar Ligi, EuroLeague ve Premier League karşılaşmalarının eksiksiz programı.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=900&auto=format&fit=crop',
    icon: Tv,
    link: '/mac-programi',
    gradient: 'from-amber-500/30 via-amber-950/20 to-black/80',
    borderGlow: 'group-hover:border-amber-500/50',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'stream-cinema-arts',
    title: 'Kültür, Sanat & Klasik Sahne Arşivi',
    category: 'Restorasyonlu Master',
    badge: 'Kültür Kuşağı',
    description: 'Türk tiyatrosu, bağımsız sinema belleği ve uluslararası festival yapımları tek seçkide.',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop',
    icon: Film,
    link: '/channels',
    gradient: 'from-purple-500/30 via-purple-950/20 to-black/80',
    borderGlow: 'group-hover:border-purple-500/50',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'stream-family-kids',
    title: 'Pedagojik Aile & Çocuk Kuşağı',
    category: 'Güvenli Yayın · Reklamsız',
    badge: 'Aile Dostu',
    description: 'Çocuklarınız için uzmanlarca seçilmiş güvenli, eğitici animasyonlar ve Türkçe çizgi diziler.',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=900&auto=format&fit=crop',
    icon: HeartHandshake,
    link: '/channels',
    gradient: 'from-sky-500/30 via-sky-950/20 to-black/80',
    borderGlow: 'group-hover:border-sky-500/50',
    tagColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
  },
  {
    id: 'stream-acoustic-music',
    title: 'Akustik Sahne & Stüdyo Müzik Kuşağı',
    category: 'Lossless Ses · Hi-Fi Audio',
    badge: 'Stüdyo Sesi',
    description: 'Canlı oda konserleri, caz performansları, klasik senfoniler ve geleneksel akustik dinletiler.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=900&auto=format&fit=crop',
    icon: Music2,
    link: '/channels',
    gradient: 'from-rose-500/30 via-rose-950/20 to-black/80',
    borderGlow: 'group-hover:border-rose-500/50',
    tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }
];

const EDITORIAL_STREAMS_DE = [
  {
    id: 'stream-nature-4k-de',
    title: '4K Natur- & Kultur-Dokumentationen',
    category: '4K UHD · 60 FPS',
    badge: 'Ultra Schärfe',
    description: 'Faszinierende Tierwelten, Meereswunder und Weltkultur in atemberaubender Farbtiefe.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
    icon: Compass,
    link: '/de/kanale',
    gradient: 'from-emerald-500/30 via-emerald-950/20 to-black/80',
    borderGlow: 'group-hover:border-emerald-500/50',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'stream-national-news-de',
    title: '24/7 Nationale Sender & Nachrichten',
    category: 'Live EPG · Geringe Latenz',
    badge: 'Live Stream',
    description: 'Hauptnachrichten, Wirtschaft und Live-Berichterstattung aus der Türkei und der Welt.',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=900&auto=format&fit=crop',
    icon: Radio,
    link: '/de/kanale',
    gradient: 'from-red-500/30 via-red-950/20 to-black/80',
    borderGlow: 'group-hover:border-[#e50914]/50',
    tagColor: 'text-red-400 bg-red-500/10 border-red-500/20'
  },
  {
    id: 'stream-live-sports-de',
    title: 'Live-Sport & Wöchentlicher Spielplan',
    category: 'Spielplan · Live-Ticker',
    badge: 'Sport Guide',
    description: 'Süper Lig, UEFA Champions League, EuroLeague und internationale Begegnungen im Detail.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=900&auto=format&fit=crop',
    icon: Tv,
    link: '/de/spielplan',
    gradient: 'from-amber-500/30 via-amber-950/20 to-black/80',
    borderGlow: 'group-hover:border-amber-500/50',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'stream-cinema-arts-de',
    title: 'Bühnenkunst & Unabhängiges Kino',
    category: 'Restaurierte Master',
    badge: 'Kulturarchiv',
    description: 'Klassiker der türkischen Filmgeschichte, Theateraufzeichnungen und Kulturbeiträge.',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=900&auto=format&fit=crop',
    icon: Film,
    link: '/de/kanale',
    gradient: 'from-purple-500/30 via-purple-950/20 to-black/80',
    borderGlow: 'group-hover:border-purple-500/50',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'stream-family-kids-de',
    title: 'Pädagogisches Kinder- & Familienprogramm',
    category: 'Familienfreundlich · Sicher',
    badge: 'Familie',
    description: 'Sorgfältig ausgewählte Trickfilme und Wissenssendungen für Kinder in türkischer Sprache.',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=900&auto=format&fit=crop',
    icon: HeartHandshake,
    link: '/de/kanale',
    gradient: 'from-sky-500/30 via-sky-950/20 to-black/80',
    borderGlow: 'group-hover:border-sky-500/50',
    tagColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
  },
  {
    id: 'stream-acoustic-music-de',
    title: 'Akustische Konzerte & Live-Musik',
    category: 'Lossless Audio · Studio-Sound',
    badge: 'Hi-Fi Audio',
    description: 'Live-Sessions, Jazz-Clubs, traditionelle Melodien und kristallklarer Klang für anspruchsvolle Hörer.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=900&auto=format&fit=crop',
    icon: Music2,
    link: '/de/kanale',
    gradient: 'from-rose-500/30 via-rose-950/20 to-black/80',
    borderGlow: 'group-hover:border-rose-500/50',
    tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }
];

const TrendingContentSlider = ({ title, isDe = false }) => {
  const [sectionRef, sectionVisible] = useWhenVisible({ rootMargin: '300px' });
  const [emblaRef] = useEmblaCarousel(
    { align: 'start', loop: true, dragFree: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const streams = useMemo(() => {
    return isDe ? EDITORIAL_STREAMS_DE : EDITORIAL_STREAMS_TR;
  }, [isDe]);

  const copy = isDe
    ? {
        badge: 'Kuratierte Sendeformate',
        defaultTitle: 'Editionsauswahl: Hochwertige Sendeformate',
        subtitle: 'Entdecken Sie thematische Programmsparten in herausragender Bild- und Tonqualität – ohne urheberrechtliche Konflikte, transparent und stabil.',
        action: 'Kanalübersicht',
        viewAll: 'Alle Kanäle entdecken →'
      }
    : {
        badge: 'Özel Editoryal Kuşaklar',
        defaultTitle: title || 'Editoryal Seçki: Tematik Canlı Yayın Kuşakları',
        subtitle: 'Özenle seçilmiş tematik yayın kuşakları, yüksek bitrate ve kristal netliğinde ses ile televizyonunuzda. Telif güvencesiyle, şeffaf ve kararlı akış.',
        action: 'Yayın Detayı',
        viewAll: 'Tüm Yayınları Keşfet →'
      };

  const displayTitle = title || copy.defaultTitle;

  if (!sectionVisible) {
    return (
      <section ref={sectionRef} className="py-12 w-full container mx-auto px-4 min-h-[300px]" aria-hidden="true" />
    );
  }

  return (
    <section ref={sectionRef} className="py-12 relative w-full container mx-auto px-4 transition-opacity duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {copy.badge}
            </span>
          </div>
          <h2 className="section-title text-2xl md:text-4xl flex items-center gap-3">
            <span className="bg-gradient-to-b from-[#e50914] to-[#b20710] w-1.5 md:w-2 h-8 md:h-10 rounded-full" />
            <span className="text-white">{displayTitle}</span>
          </h2>
          <p className="text-slate-300 mt-1 md:mt-2 md:ml-4 text-sm md:text-base max-w-2xl leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <Link
          to={isDe ? '/de/kanale' : '/channels'}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-white transition-colors shrink-0 group pb-2"
        >
          <span>{copy.viewAll}</span>
        </Link>
      </div>

      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#111114] via-[#0a0a0c] to-[#070709] px-2 md:px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        {/* Soft edge fades for smooth sliding effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-10" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-3 md:-ml-5 py-2">
            {streams.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex-[0_0_84%] sm:flex-[0_0_50%] md:flex-[0_0_38%] lg:flex-[0_0_31%] xl:flex-[0_0_27%] pl-3 md:pl-5"
                >
                  <Link
                    to={item.link}
                    className="block h-full group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl"
                  >
                    <div
                      className={`relative h-[380px] md:h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.7)] ${item.borderGlow} flex flex-col justify-end p-5 md:p-6`}
                    >
                      {/* Background Visual */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-45 group-hover:opacity-60"
                      />

                      {/* Multilayer gradient for perfect text contrast */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-90 transition-opacity duration-500 group-hover:opacity-95`} />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-md">
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <span className={`text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md uppercase tracking-wider ${item.tagColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/70 font-mono bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                          {item.category}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="relative z-10">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed font-light">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="text-xs font-semibold text-white/90 group-hover:text-primary transition-colors flex items-center gap-1">
                            {copy.action}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> Telifsiz & Kararlı
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(TrendingContentSlider);
