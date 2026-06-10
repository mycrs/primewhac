
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import {
  Home,
  Package,
  FlaskConical,
  BookOpen,
  HelpCircle,
  FileText,
  ArrowLeft,
  Tv,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSiteData } from '@/hooks/useSiteData';
import { defaultData } from '@/data/defaultSiteData';
import { SITE_URL } from '@/constants/siteUrl';

const quickLinksTR = [
  { label: 'Ana Sayfa', path: '/', icon: Home },
  { label: 'Kurulum', path: '/kurulum', icon: BookOpen },
  { label: 'SSS', path: '/sss', icon: HelpCircle },
  { label: 'Blog', path: '/blog', icon: FileText },
];
const quickLinksDE = [
  { label: 'Startseite', path: '/de', icon: Home },
  { label: 'Einrichtung', path: '/de/einrichtung', icon: BookOpen },
  { label: 'FAQ', path: '/de/sss', icon: HelpCircle },
  { label: 'Blog', path: '/de/blog', icon: FileText },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteData } = useSiteData(false);
  const isDe = location.pathname.startsWith('/de');
  const safeContact = siteData?.contactData || defaultData?.contactData;

  const title = isDe ? 'Seite nicht gefunden (404)' : 'Sayfa Bulunamadı (404)';
  const heading = isDe ? 'Seite nicht gefunden' : 'Bu sayfa yayında değil';
  const message = isDe
    ? 'Die angeforderte Seite existiert nicht. Mit dem kostenlosen Test oder den Paketen können Sie fortfahren.'
    : 'Aradığınız adres mevcut değil. Ücretsiz test veya paketlerle devam edebilirsiniz.';
  const backLabel = isDe ? 'Zurück' : 'Geri dön';
  const homeLabel = isDe ? 'Startseite' : 'Ana sayfa';
  const testLabel = isDe ? 'Kostenlos testen' : 'Ücretsiz test';
  const packagesLabel = isDe ? 'Pakete ansehen' : 'Paketlere git';

  const canonicalUrl = isDe ? `${SITE_URL}/de` : `${SITE_URL}/`;

  return (
    <>
      <SEOHead
        title={`${title} | QruzeTV`}
        description={isDe ? 'Die angeforderte Seite wurde nicht gefunden.' : 'Aradığınız sayfa bulunamadı. Ana sayfa, paketler veya ücretsiz test sayfalarına gidebilirsiniz.'}
        canonicalUrl={canonicalUrl}
        robotsContent="noindex, follow"
      />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col text-white selection:bg-white/20">
        <Header contactData={safeContact} />

        <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] pt-20 pb-16 px-4 relative overflow-hidden">
          {/* Arka plan: grid + gradient orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[140px]" />
            <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80" />
          </div>

          <motion.section
            className="relative z-10 w-full max-w-xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ana kart: cam efekti + animasyonlu kenarlık */}
            <motion.div
              className="relative rounded-3xl p-8 sm:p-10 border border-white/10 bg-[#0a0a0a]/40 backdrop-blur-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,.05), 0 25px 50px -12px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)',
              }}
            >
              {/* Üst köşe vurgu */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#e50914]/60 to-transparent" />
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-slate-500 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
                {isDe ? 'Offline' : 'Yayın yok'}
              </div>

              {/* 404 + ikon */}
              <div className="flex flex-col items-center text-center mb-8">
                <motion.div
                  className="flex items-center justify-center gap-1 sm:gap-2 mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <span className="text-6xl sm:text-7xl md:text-8xl font-black tabular-nums tracking-tighter text-white/90 drop-shadow-lg">4</span>
                  <motion.span
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#e50914]/80 to-[#b20710]/80 border border-white/20 shadow-lg"
                    animate={{
                      rotate: [0, -3, 3, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Tv className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </motion.span>
                  <span className="text-6xl sm:text-7xl md:text-8xl font-black tabular-nums tracking-tighter text-white/90 drop-shadow-lg">4</span>
                </motion.div>
                <motion.h1
                  className="text-xl sm:text-2xl font-bold text-white mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {heading}
                </motion.h1>
                <motion.p
                  className="text-slate-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {message}
                </motion.p>
              </div>

              {/* Öne çıkan CTA'lar: Test + Paketler */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#e50914] to-green-600 hover:from-[#e50914] hover:to-green-500 text-white font-bold shadow-lg shadow-emerald-500/25 border-0 rounded-xl h-12 px-6"
                >
                  <Link to={isDe ? '/de/test' : '/test'}>
                    <FlaskConical className="mr-2 h-5 w-5" />
                    {testLabel}
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/20 hover:text-white font-semibold rounded-xl h-12 px-6"
                >
                  <Link to={isDe ? '/de/paketler' : '/paketler'}>
                    <Package className="mr-2 h-5 w-5" />
                    {packagesLabel}
                  </Link>
                </Button>
              </motion.div>

              {/* Yardımcı: Ana sayfa + Geri */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
              >
                <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">
                  <Link to={isDe ? '/de' : '/'}>
                    <Home className="w-4 h-4" />
                    {homeLabel}
                  </Link>
                </Button>
                <span className="text-slate-600">·</span>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-4 h-4" />
                  {backLabel}
                </Button>
              </motion.div>
            </motion.div>

            {/* Popüler sayfalar */}
            <motion.div
              className="mt-10"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4 text-center">
                {isDe ? 'Weitere Seiten' : 'Diğer sayfalar'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(isDe ? quickLinksDE : quickLinksTR).map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div key={link.path} variants={item}>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg h-10 border border-transparent hover:border-white/10"
                      >
                        <Link to={link.path}>
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{link.label}</span>
                        </Link>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Alt dekoratif satır */}
            <motion.p
              className="mt-8 text-center text-slate-600 text-xs flex items-center justify-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isDe ? 'QruzeTV · Premium IPTV' : 'QruzeTV · Kesintisiz yayın'}
            </motion.p>
          </motion.section>
        </main>

        <Footer contactData={safeContact} siteData={siteData} />
      </div>
    </>
  );
};

export default NotFoundPage;
