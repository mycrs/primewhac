import React, { memo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import SEOHead from '@/components/SEOHead';
import { defaultData } from '@/data/defaultSiteData';
import { SITE_URL } from '@/constants/siteUrl';
import ChatBot from '@/components/ChatBot';
import { MessageSquare, ShieldCheck, Zap, Headphones, PhoneCall } from 'lucide-react';

const ContactPage = ({ siteData }) => {
  const safeSiteData = siteData || defaultData;
  const contactData = safeSiteData.contactData || safeSiteData.contact_info || {};

  const metadata = {
    title: 'İletişim & 7/24 Canlı Destek — QruzeTV',
    description:
      'QruzeTV müşteri hizmetleri, WhatsApp ve Telegram canlı destek hatları. Kurulum, paketler veya teknik destek için bize dilediğiniz an ulaşın.',
    keywords: ['IPTV iletişim', 'QruzeTV destek', 'IPTV WhatsApp hattı', 'IPTV müşteri hizmetleri', 'canlı destek'],
    ogType: 'website',
  };

  const contactSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'QruzeTV İletişim & Destek',
      url: `${SITE_URL}/iletisim`,
      description: metadata.description,
    },
  ];

  return (
    <>
      <SEOHead {...metadata} canonicalUrl={`${SITE_URL}/iletisim`} jsonLd={contactSchemas} />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-white selection:bg-primary/40">
        <Header contactData={contactData} />

        <main className="flex-grow pt-24 md:pt-28">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-12 md:py-16 border-b border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e50914]/12 via-amber-500/5 to-transparent -z-10" />

            <div className="container mx-auto px-4 text-center max-w-4xl">
              <span className="luxury-kicker mb-4 inline-block">7/24 Müşteri Deneyimi Merkezi</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-md">
                Size Nasıl Yardımcı Olabiliriz?
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Abonelik, teknik kurulum, kanal talepleri veya test yayını hakkında merak ettiğiniz tüm sorular için uzman destek ekibimiz hizmetinizde.
              </p>

              {/* Guarantees Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="p-4 rounded-2xl bg-[#121212]/80 border border-white/10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-2">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-white">7/24 Kesintisiz</span>
                  <span className="text-xs text-slate-400 mt-0.5">Her an aktif destek</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#121212]/80 border border-white/10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-white">Anında Aktivasyon</span>
                  <span className="text-xs text-slate-400 mt-0.5">Dakikalar içinde teslim</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#121212]/80 border border-white/10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 mb-2">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-white">Çoklu Kanal</span>
                  <span className="text-xs text-slate-400 mt-0.5">WhatsApp, Telegram, Web</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#121212]/80 border border-white/10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-white">%100 Güvenli</span>
                  <span className="text-xs text-slate-400 mt-0.5">Gizlilik & veri koruma</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Contact Section (Form + Fast Support Channels) */}
          <Contact contactData={contactData} siteTexts={safeSiteData.siteTexts} />
        </main>

        <Footer contactData={contactData} siteData={safeSiteData} />

        {safeSiteData.chatBotData?.enabled && (
          <ChatBot chatData={safeSiteData.chatBotData} contactData={contactData} />
        )}
      </div>
    </>
  );
};

export default memo(ContactPage);
