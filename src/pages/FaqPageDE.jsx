import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import {
  Loader2,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Search,
  Shield,
  Zap,
  BookOpen,
  Headphones,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaqSeoSupplement } from '@/components/FaqSeoSupplement';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';

const FAQ_DE_CACHE_KEY = 'sb_pub_faq_de_v1';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

function filterFaqSections(sections, query) {
  if (!sections?.length) return [];
  const q = (query || '').trim().toLowerCase();
  if (!q) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: (section.items || []).filter(
        (item) =>
          (item.question || '').toLowerCase().includes(q) ||
          (item.answer || '').toLowerCase().includes(q)
      ),
    }))
    .filter((s) => s.items.length > 0);
}

const defaultFaqDataDE = {
  title: 'Häufige Fragen zum türkischen IPTV | QruzeTV',
  description:
    'Ist IPTV legal? Welche Geräte? Wie bezahle ich per SEPA? Alle Antworten rund um QruzeTV — Einrichtung, Rechnung, Kündigung und Support auf Deutsch.',
  sections: [
    {
      title: 'Kaufen und Zahlung',
      items: [
        {
          question: 'Wie kann ich ein IPTV-Abo kaufen?',
          answer:
            'Der Kaufprozess ist sehr einfach. Wählen Sie auf unserer Paket-Seite das gewünschte Abonnement aus, klicken Sie auf "Bestellen" und folgen Sie den Anweisungen zur Zahlung. Nach erfolgreicher Zahlung erhalten Sie Ihre Zugangsdaten in der Regel innerhalb weniger Minuten per E-Mail oder WhatsApp.',
        },
        {
          question: 'Welche Zahlungsmethoden werden akzeptiert?',
          answer:
            'Wir bieten verschiedene sichere Zahlungsmöglichkeiten an, darunter PayPal, Kreditkarte, Banküberweisung und Kryptowährungen. Alle Zahlungen werden verschlüsselt und sicher verarbeitet.',
        },
        {
          question: 'Gibt es eine kostenlose Testphase?',
          answer:
            'Ja, wir bieten einen kostenlosen 24-Stunden-Testzugang an, damit Sie sich vor dem Kauf von der Qualität und Stabilität unserer Server überzeugen können. Kontaktieren Sie einfach unseren Support über WhatsApp, um Ihren Testzugang anzufordern.',
        },
      ],
    },
    {
      title: 'Installation und Einrichtung',
      items: [
        {
          question: 'Wie installiere ich IPTV auf meinem Gerät?',
          answer:
            'Die Installation variiert je nach Gerät. Wir unterstützen Smart TVs (Samsung, LG, Android TV), Fire TV Sticks, Apple TV, Smartphones (iOS/Android) und PCs. Nach dem Kauf erhalten Sie eine detaillierte Schritt-für-Schritt-Anleitung für Ihr spezifisches Gerät.',
        },
      ],
    },
    {
      title: 'Streaming-Qualität',
      items: [
        {
          question: 'In welcher Qualität werden die Sender gestreamt?',
          answer:
            'Wir bieten die meisten unserer Sender in echter 4K-, UHD- und Full-HD-Qualität an. Die tatsächliche Qualität hängt jedoch von Ihrer Internetverbindung ab. Wir empfehlen eine minimale Internetgeschwindigkeit von 16 Mbit/s für HD und 30 Mbit/s für 4K-Streaming.',
        },
      ],
    },
    {
      title: 'Technische Probleme',
      items: [
        {
          question: 'Was kann ich tun, wenn der Stream puffert oder ruckelt?',
          answer:
            'Pufferung tritt meist durch eine instabile Internetverbindung auf. Stellen Sie sicher, dass Ihr Gerät per LAN-Kabel (nicht WLAN) verbunden ist. Starten Sie Ihren Router und das Gerät neu. Sollte das Problem bestehen, kontaktieren Sie unseren 24/7 Support, damit wir Ihren Server-Port optimieren können.',
        },
      ],
    },
    {
      title: 'Geräte und Zugang',
      items: [
        {
          question: 'Kann ich mein Abo auf mehreren Geräten gleichzeitig nutzen?',
          answer:
            'Standardabonnements gelten für ein einzelnes Gerät gleichzeitig. Sie können die App auf mehreren Geräten installieren, aber nicht zeitgleich schauen. Wir bieten jedoch spezielle Multiroom-Pakete an, mit denen Sie auf 2 oder mehr Geräten gleichzeitig streamen können.',
        },
      ],
    },
  ],
};

const TRUST_ITEMS_DE = [
  { icon: Headphones, label: '24/7 Support', sub: 'WhatsApp & schnelle Hilfe' },
  { icon: Shield, label: 'Transparenz', sub: 'Datenschutz & sichere Zahlung' },
  { icon: Zap, label: 'Schnelle Freischaltung', sub: 'Oft in wenigen Minuten' },
  { icon: BookOpen, label: 'Anleitungen', sub: 'Schritt-für-Schritt Hilfe' },
];

const FaqPageDE = ({ siteData }) => {
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFaq = async () => {
      try {
        const cached = readSessionCache(FAQ_DE_CACHE_KEY);
        if (cached?.sections?.length) {
          setFaqData(cached);
          return;
        }
        const { data } = await supabase.from('site_content').select('value').eq('key', 'faqDataDE').single();
        if (data?.value?.sections?.length) {
          setFaqData(data.value);
          writeSessionCache(FAQ_DE_CACHE_KEY, data.value);
        } else {
          setFaqData(defaultFaqDataDE);
        }
      } catch {
        setFaqData(defaultFaqDataDE);
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, []);

  const filteredSections = useMemo(
    () => filterFaqSections(faqData?.sections, search),
    [faqData?.sections, search]
  );
  const safeSiteData = siteData || {};

  const metadata = {
    title: faqData?.title || defaultFaqDataDE.title,
    description: faqData?.description || defaultFaqDataDE.description,
    keywords: [
      'IPTV Deutschland',
      'IPTV kaufen',
      'IPTV Test',
      'IPTV Erfahrungen',
      'Deutsche Sender',
      'Smart TV IPTV',
    ],
    ogType: 'website',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity:
      faqData?.sections?.flatMap((section) =>
        section.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        }))
      ) || [],
  };

  const customCrumbs = [
    { name: 'Startseite', path: '/de' },
    { name: 'FAQ', path: null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans text-white selection:bg-white/20">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
          <Loader2 className="relative w-14 h-14 animate-spin text-primary" />
        </div>
        <p className="text-slate-400 mt-6 text-sm tracking-wide uppercase">FAQ wird geladen</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead {...metadata} jsonLd={[jsonLd]} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 selection:bg-white/20">
        <HeaderDE contactData={safeSiteData.contactData} />

        <main className="flex-grow w-full">
          <section className="relative pt-28 pb-16 md:pb-24 px-4 overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(229, 9, 20,0.25),transparent_55%)]" />
            <div className="absolute top-1/4 left-0 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-[#e50914]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10 mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold tracking-[0.2em] uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Support-Center
                  </span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.08]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#e50914] to-[#b20710]">
                    Häufig gestellte Fragen
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  Alles Wichtige zu IPTV, Installation, Qualität und Zahlung — übersichtlich beantwortet.
                </p>

                <div className="mt-10 max-w-xl mx-auto relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/70 pointer-events-none" />
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Frage oder Stichwort suchen…"
                    className="h-14 pl-12 pr-4 rounded-2xl bg-[#0a0a0a]/90 border-primary/25 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40 shadow-inner"
                    aria-label="FAQ durchsuchen"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-14 md:mt-16"
              >
                {TRUST_ITEMS_DE.map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/8 bg-gradient-to-br from-[#0a0a0a]/90 to-[#12121f]/90 p-4 sm:p-5 text-left hover:border-primary/25 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" aria-hidden />
                    </div>
                    <p className="text-white font-bold text-sm sm:text-base">{label}</p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-snug">{sub}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="py-14 md:py-20 px-4 sm:px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e50914]/10 to-transparent pointer-events-none" />
            <div className="container mx-auto max-w-4xl relative z-10">
              <div className="mb-10">
                <BreadcrumbNavigation customCrumbs={customCrumbs} />
              </div>

              {filteredSections.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-dashed border-primary/25 bg-[#0a0a0a]/40">
                  <HelpCircle className="w-14 h-14 text-primary/50 mx-auto mb-4" />
                  <p className="text-white font-semibold text-lg">Keine Treffer</p>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Versuchen Sie andere Suchbegriffe oder schreiben Sie uns per WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-6 text-primary hover:text-primary text-sm font-semibold underline underline-offset-4"
                  >
                    Suche zurücksetzen
                  </button>
                </div>
              ) : (
                <motion.div
                  className="space-y-14 md:space-y-20"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  {filteredSections.map((section, idx) => (
                    <motion.div key={`${section.title}-${idx}`} variants={itemVariants} className="w-full">
                      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e50914] to-[#b20710] text-white font-black text-lg shadow-lg shadow-primary/40 ring-2 ring-primary/20">
                            {idx + 1}
                          </span>
                          <h2 className="section-title text-2xl md:text-3xl">
                            {section.title}
                          </h2>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="w-full space-y-3">
                        {section.items.map((item, itemIdx) => (
                          <AccordionItem
                            key={itemIdx}
                            value={`item-${idx}-${itemIdx}`}
                            className="!border-b-0 border border-white/[0.06] rounded-2xl overflow-hidden bg-[#0a0a0a]/75 backdrop-blur-md shadow-lg shadow-black/20 data-[state=open]:border-primary/35 data-[state=open]:shadow-[0_0_48px_-12px_rgba(229,9,20,0.35)] transition-all duration-300"
                          >
                            <AccordionTrigger
                              className={cn(
                                'text-left py-5 px-5 sm:px-6 text-base md:text-lg font-semibold text-slate-100',
                                'hover:text-white hover:no-underline [&[data-state=open]]:text-transparent [&[data-state=open]]:bg-clip-text',
                                '[&[data-state=open]]:bg-gradient-to-r [&[data-state=open]]:from-[#e50914] [&[data-state=open]]:to-white/90',
                                '[&[data-state=open]>svg]:text-primary'
                              )}
                            >
                              <span className="pr-4 leading-snug">{item.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-400 text-base leading-relaxed px-5 sm:px-6 pb-6 pt-0 border-t border-white/5">
                              <div className="pt-5">{item.answer}</div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div
                className="mt-20 md:mt-28 relative rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#e50914]/40 via-[#1a1025] to-[#0a0a0a]" />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-primary/20" />
                <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#e50914]/12 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10 px-6 py-12 md:px-14 md:py-16 text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Keine Antwort gefunden?</h2>
                  <p className="text-slate-400 mb-10 text-base md:text-lg leading-relaxed">
                    Unser Team hilft Ihnen gerne bei Installation, Paketen und technischen Fragen.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
                    <Link
                      to="/de/pakete"
                      className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#b20710] hover:to-[#b20710] shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                    >
                      Pakete ansehen <ArrowRight className="w-5 h-5" />
                    </Link>
                    {/* wa.me-CTA entfernt — die Nummer stand im statischen HTML offen. */}
                    <Link
                      to="/de/einrichtung"
                      className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 text-[#e50914]" />
                      Einrichtungshilfe
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <FaqSeoSupplement lang="de" />
        </main>
        <FooterDE contactData={safeSiteData.contactData} siteData={safeSiteData} />
      </div>
    </>
  );
};

export default FaqPageDE;
