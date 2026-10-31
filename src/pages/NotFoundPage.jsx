import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import {
  Home,
  Package,
  FlaskConical,
  BookOpen,
  ArrowLeft,
  Tv,
  Film,
  MessageCircle,
  Search,
  Sparkles,
  Compass,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSiteData } from '@/hooks/useSiteData';
import { defaultData } from '@/data/defaultSiteData';
import { SITE_URL } from '@/constants/siteUrl';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteData } = useSiteData(false);
  const isDe = location.pathname.startsWith('/de');
  const safeContact = siteData?.contactData || defaultData?.contactData;

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const targetUrl = isDe
      ? `/de/kanale?search=${encodeURIComponent(searchQuery.trim())}`
      : `/channels?search=${encodeURIComponent(searchQuery.trim())}`;
    navigate(targetUrl);
  };

  const title = isDe ? 'Seite nicht gefunden (404) | QruzeTV' : 'Sayfa Bulunamadı (404) | QruzeTV';
  const heading = isDe ? 'Dieser Kanal ist offline! 🍿' : 'Aradığınız Kanal Frekansta Yok! 🍿';
  const message = isDe
    ? 'Unser Popcorn-Scout konnte diese Adresse auf der Karte nicht finden. Keine Sorge – tausende 4K-Live-Sender, Sport-Feeds und das Filmarchiv laufen auf der Hauptseite wie gewohnt weiter!'
    : 'Qruze Popcorn haritada bu adresi bulamadı ama endişelenmeyin! 10.000+ canlı TV kanalı, kesintisiz derbi maçları ve dev film/dizi arşivi ana merkezimizde yayında.';

  const canonicalUrl = isDe ? `${SITE_URL}/de` : `${SITE_URL}/`;

  const quickCategories = [
    {
      title: isDe ? 'Live Senderliste' : 'Canlı TV & Kanallar',
      desc: isDe ? 'Sport, Filme & Weltkanäle' : 'Tüm ulusal, spor ve dünya kanalları',
      icon: Tv,
      path: isDe ? '/de/kanale' : '/channels',
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      title: isDe ? 'IPTV Pakete' : 'Avantajlı Paketler',
      desc: isDe ? '3, 6, 12 Monate & 4K UHD' : '12 Ay en popüler ve VIP seçenekler',
      icon: Package,
      path: isDe ? '/de/pakete' : '/paketler',
      color: 'from-[#e50914]/20 to-rose-500/20 text-[#ff4b55] border-[#e50914]/30',
    },
    {
      title: isDe ? 'Was anschauen?' : 'Ne İzlesem? (VOD)',
      desc: isDe ? 'Trends, Filme & Serien' : 'Sürekli güncellenen dev film & dizi arşivi',
      icon: Film,
      path: isDe ? '/de/was-anschauen' : '/ne-izlesem',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      title: isDe ? 'Einrichtung' : 'Kolay Kurulum',
      desc: isDe ? 'Smart TV, Firestick & Co.' : 'Cihazınıza özel adım adım görsel rehber',
      icon: BookOpen,
      path: isDe ? '/de/einrichtung' : '/kurulum',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <>
      <SEOHead
        title={title}
        description={isDe ? 'Die angeforderte Seite wurde nicht gefunden. Finden Sie hier unsere Live-Sender, Pakete und Support.' : 'Aradığınız sayfa bulunamadı. QruzeTV canlı TV kanalları, paketler ve ücretsiz test sayfalarından devam edebilirsiniz.'}
        canonicalUrl={canonicalUrl}
        robotsContent="noindex, follow"
      />

      <div className="min-h-screen bg-[#070709] flex flex-col text-white selection:bg-[#e50914]/40 font-sans">
        <Header contactData={safeContact} />

        <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] pt-24 pb-16 px-4 relative overflow-hidden">
          {/* Ambient Lighting & Glow Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e50914]/15 rounded-full blur-[140px]" />
            <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>

          <motion.div
            className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Live Signal Status Pill */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg mb-4 text-xs font-semibold"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e50914]" />
              </span>
              <span className="text-slate-300">
                {isDe ? 'Signal verloren · Fehler 404' : 'Frekans Sinyali Kayboldu · Hata 404'}
              </span>
            </motion.div>

            {/* Bespoke 3D Popcorn Mascot Graphic with Floating Animation */}
            <motion.div
              className="relative my-2 sm:my-4 cursor-pointer"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              onClick={() => navigate(isDe ? '/de/' : '/')}
              title={isDe ? 'Zurück zur Startseite' : 'Ana Sayfaya Dön'}
            >
              {/* Backlight halo matching gold & ruby 3D typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#e50914]/30 via-amber-500/20 to-transparent blur-3xl rounded-full -z-10 scale-95" />

              <picture>
                <source srcSet="/404-qruze.webp" type="image/webp" />
                <img
                  src="/404-qruze.png"
                  alt="404 QruzeTV Popcorn Mascot"
                  className="w-72 sm:w-84 md:w-96 max-w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(229,9,20,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95"
                  loading="eager"
                  fetchPriority="high"
                  width="420"
                  height="280"
                />
              </picture>
            </motion.div>

            {/* Heading & Subtext */}
            <motion.h1
              className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-2 mb-3 drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {heading}
            </motion.h1>

            <motion.p
              className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6 font-normal px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {message}
            </motion.p>

            {/* In-page Fast Channel/VOD Search Form */}
            <motion.form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md mx-auto mb-8 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isDe ? 'Kanal oder Film suchen...' : 'Kanal, spor yayını veya film ara...'}
                  className="w-full h-12 pl-11 pr-24 rounded-full bg-[#121218]/90 border border-white/15 focus:border-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/40 text-sm text-white placeholder-slate-400 shadow-inner backdrop-blur-md transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-[#e50914] to-[#b20710] text-white text-xs font-bold hover:opacity-95 transition-opacity active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>{isDe ? 'Finden' : 'Bul'}</span>
                </button>
              </div>
            </motion.form>

            {/* Action CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 mb-10 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#e50914] via-[#ff3b45] to-[#b20710] hover:scale-102 active:scale-95 text-white font-black shadow-xl shadow-[#e50914]/30 rounded-2xl h-12 px-7 transition-all cursor-pointer text-sm"
              >
                <Link to={isDe ? '/de/' : '/'}>
                  <Home className="mr-2 h-4 w-4" />
                  {isDe ? 'Zur Startseite' : 'Ana Sayfaya Dön'}
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/[0.05] hover:bg-white/[0.1] text-white border-white/15 hover:border-white/30 rounded-2xl h-12 px-6 font-bold transition-all cursor-pointer text-sm"
              >
                <Link to={isDe ? '/de/pakete' : '/paketler'}>
                  <Package className="mr-2 h-4 w-4 text-[#ff4b55]" />
                  {isDe ? 'Pakete ansehen' : 'Paketleri İncele'}
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl h-12 px-6 font-bold transition-all cursor-pointer text-sm"
              >
                <Link to={isDe ? '/de/test' : '/test'}>
                  <FlaskConical className="mr-2 h-4 w-4 text-emerald-400" />
                  {isDe ? 'Kostenlos Testen' : 'Ücretsiz Test Al'}
                </Link>
              </Button>
            </motion.div>

            {/* Quick Exploration Category Cards */}
            <motion.div
              className="w-full max-w-3xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                <Compass className="w-3.5 h-3.5 text-[#ff4b55]" />
                <span>{isDe ? 'Direkte Navigation' : 'Hızlı Erişim Kanalları'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickCategories.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      className="group p-4 rounded-2xl bg-[#121218]/70 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 border shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-white font-bold text-sm mb-1 group-hover:text-[#ff4b55] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-[11px] leading-tight line-clamp-2">
                        {item.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Secondary Controls: Back & WhatsApp */}
            <motion.div
              className="flex items-center justify-center gap-4 text-xs text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isDe ? 'Vorherige Seite' : 'Bir Önceki Sayfaya Dön'}</span>
              </button>

              <span className="text-slate-700">•</span>

              <a
                href={safeContact?.whatsapp ? `https://wa.me/${safeContact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isDe ? 'Hallo QruzeTV, ich habe eine Frage...' : 'Merhaba QruzeTV, bir sayfaya ulaşamadım...')}` : 'https://wa.me/?text=Merhaba'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isDe ? '7/24 WhatsApp Support' : '7/24 WhatsApp Destek'}</span>
              </a>
            </motion.div>
          </motion.div>
        </main>

        <Footer contactData={safeContact} siteData={siteData} />
      </div>
    </>
  );
};

export default NotFoundPage;
