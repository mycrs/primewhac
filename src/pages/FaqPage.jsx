import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
import { defaultFaqData } from '@/components/admin/tabs/FaqTab';
import { cn } from '@/lib/utils';
import { FaqSeoSupplement } from '@/components/FaqSeoSupplement';
import InternalLinkingOptimization from '@/components/InternalLinkingOptimization';
import { faqPageSchemas } from '@/utils/seoSchema';
import { readSessionCache, writeSessionCache } from '@/utils/supabaseSessionCache';
import { SITE_URL } from '@/constants/siteUrl';

const FAQ_CACHE_KEY = 'sb_pub_faq_tr_v1';

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

const TRUST_ITEMS = [
  { icon: Headphones, label: '7/24 destek', sub: 'WhatsApp & canlı yardım' },
  { icon: Shield, label: 'Şeffaf süreç', sub: 'Gizlilik ve güvenli ödeme' },
  { icon: Zap, label: 'Hızlı aktivasyon', sub: 'Genelde dakikalar içinde' },
  { icon: BookOpen, label: 'Kurulum rehberi', sub: 'Adım adım yardım' },
];

const FaqPage = ({ siteData }) => {
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFaqData();
  }, []);

  const fetchFaqData = async () => {
    try {
      const cached = readSessionCache(FAQ_CACHE_KEY);
      if (cached?.sections?.length) {
        setFaqData(cached);
        return;
      }
      const { data } = await supabase.from('site_content').select('value').eq('key', 'faqData').single();
      if (data?.value?.sections) {
        setFaqData(data.value);
        writeSessionCache(FAQ_CACHE_KEY, data.value);
      } else {
        setFaqData(defaultFaqData || getFallbackData());
      }
    } catch (err) {
      console.error('Error fetching FAQ data:', err);
      setFaqData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => ({
    title: 'Sıkça Sorulan Sorular — IPTV Rehberi | QruzeTV',
    description:
      'IPTV yasal mı, güvenli mi, nasıl çalışır? QruzeTV hakkında tüm sorularınıza net yanıtlar. Kurulum, ödeme, iade ve destek rehberi.',
    sections: defaultFaqData?.sections || [],
  });

  const filteredSections = useMemo(
    () => filterFaqSections(faqData?.sections, search),
    [faqData?.sections, search]
  );

  const safeSiteData = siteData || {};
  const metadata = {
    title: faqData?.title || 'Sıkça Sorulan Sorular — IPTV Rehberi | QruzeTV',
    description:
      'IPTV yasal mı, güvenli mi, nasıl çalışır? QruzeTV hakkında tüm sorularınıza net yanıtlar. Kurulum, ödeme, iade ve destek rehberi.',
    keywords: ['iptv sss', 'donmayan iptv', 'iptv satın al', 'iptv kurulumu', 'iptv yasal mı'],
    ogType: 'website',
    ogImage: `${SITE_URL}/og/sss.jpg`,
  };

  const jsonLd = faqPageSchemas(metadata, faqData?.sections);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans text-white selection:bg-white/20">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
          <Loader2 className="relative w-14 h-14 animate-spin text-primary" />
        </div>
        <p className="text-slate-400 mt-6 text-sm tracking-wide uppercase">SSS yükleniyor</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead {...metadata} jsonLd={jsonLd} />
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 selection:bg-white/20">
        <Header contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />

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
                    Destek merkezi
                  </span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.08]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#e50914] to-[#b20710]">
                    Sıkça Sorulan Sorular
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                  Abonelik, kurulum, yayın kalitesi ve güvenlik hakkında merak ettikleriniz — tek sayfada,
                  net yanıtlar.
                </p>

                <div className="mt-10 max-w-xl mx-auto relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/70 pointer-events-none" />
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Soru veya anahtar kelime ara…"
                    className="h-14 pl-12 pr-4 rounded-2xl bg-[#0a0a0a]/90 border-primary/25 text-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/40 shadow-inner"
                    aria-label="SSS içinde ara"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-14 md:mt-16"
              >
                {TRUST_ITEMS.map(({ icon: Icon, label, sub }, i) => (
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
                <BreadcrumbNavigation />
              </div>

              {filteredSections.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-dashed border-primary/25 bg-[#0a0a0a]/40">
                  <HelpCircle className="w-14 h-14 text-primary/50 mx-auto mb-4" />
                  <p className="text-white font-semibold text-lg">Sonuç bulunamadı</p>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Farklı bir kelime deneyin veya aşağıdan WhatsApp ile bize yazın.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-6 text-primary hover:text-primary text-sm font-semibold underline underline-offset-4"
                  >
                    Aramayı temizle
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
                  <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
                    Cevabı bulamadınız mı?
                  </h3>
                  <p className="text-slate-400 mb-10 text-base md:text-lg leading-relaxed">
                    Ekibimiz 7/24 WhatsApp üzerinden kurulum, paket ve teknik konularda yardımcı olur. İsterseniz
                    önce paketleri inceleyin.
                  </p>
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-4">
                    <Link
                      to="/paketler"
                      className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#b20710] hover:to-[#b20710] shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                    >
                      Paketleri incele <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/kurulum"
                      className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      Kurulum rehberi
                    </Link>
                    <Link
                      to="/test"
                      className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      Ücretsiz test
                    </Link>
                    {/* wa.me CTA'sı kaldırıldı — numara statik HTML'de açıkta kalıyordu. */}
                    <Link
                      to="/paketler"
                      className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 text-[#e50914]" />
                      Paketler ve destek
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <FaqSeoSupplement lang="tr" />
          <div className="container mx-auto px-4 max-w-6xl">
            <InternalLinkingOptimization currentPage="faq" />
          </div>
        </main>
        <Footer contactData={safeSiteData.contactData} siteTexts={safeSiteData.siteTexts} />
      </div>
    </>
  );
};

export default FaqPage;
