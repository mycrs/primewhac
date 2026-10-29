
import React, { useState, memo, useEffect } from 'react';
import { Zap, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';
import { useLogoClickCounter } from '@/hooks/useLogoClickCounter';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import { getCanonicalAndHreflang } from '@/utils/seoCanonicalHreflang';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ contactData }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openTestModal } = useTestModal();
  
  const handleLogoClick = useLogoClickCounter('/yonetim', 8, 2000);

  // Dil geçişi: mevcut sayfanın DE eşdeğeri (TR_TO_DE haritası üzerinden).
  // Eşleşme yoksa /de/ ana sayfasına düşer; hedefler canonical forma uygun (slash'lı).
  const { hreflangDe } = getCanonicalAndHreflang(location.pathname);
  const germanTargetPath = hreflangDe ? new URL(hreflangDe).pathname : '/de/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Paketler', path: '/paketler/' },
    { label: 'Kanallar', path: '/channels/' },
    { label: 'Kurulum', path: '/kurulum/' },
    { label: 'M3U Dönüştür', path: '/m3u-converter/' },
    { label: 'Hakkımızda', path: '/hakkimizda/' },
    { label: 'Bayilik', path: '/reseller/' },
    { label: 'Blog', path: '/blog/' },
    { label: 'SSS', path: '/sss/' },
    { label: 'Yorumlar', path: '/yorumlar/' }
  ];

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300 ease-in-out ${
          scrolled
            ? 'border-white/10 bg-[#050505]/90 shadow-[0_16px_60px_rgba(0,0,0,0.55),0_0_32px_rgba(229,9,20,0.12)] backdrop-blur-2xl'
            : 'border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.94),rgba(10,10,10,0.78))] backdrop-blur-xl'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link 
              to="/"
              onClick={handleLogoClick}
              aria-label="Ana Sayfa"
              title="Ana sayfa"
              className="flex-shrink-0 z-50 focus:outline-none select-none cursor-pointer flex items-center group py-2" 
            >
              <img 
                src={BRAND_LOGO_URL} 
                alt="QruzeTV logo"
                width={48}
                height={48}
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                loading="eager"
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </Link>

            <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  title={item.label}
                  onClick={() => setIsMenuOpen(false)}
                  className={`relative block rounded-full px-4 py-2.5 text-[14px] font-semibold transition-all duration-300 ${
                    location.pathname === item.path ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_22px_rgba(229,9,20,0.14)]' : 'text-gray-300 hover:bg-white/[0.045] hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.span layoutId="underline" className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Language Switch - Desktop */}
              <Link 
                to={germanTargetPath} 
                className="hidden md:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm font-semibold text-gray-300 hover:text-white transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                title="Almanca"
              >
                <img src="https://flagcdn.com/w40/de.png" alt="Almanya bayrağı" width={20} height={16} className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                <span>DE</span>
              </Link>

              <Button
                variant="ghost"
                onClick={openTestModal}
                className="group relative hidden h-10 shrink-0 overflow-hidden rounded-xl border-2 border-[#e50914]/50 bg-white/[0.06] px-5 font-semibold text-white shadow-[0_0_24px_rgba(229,9,20,0.22)] backdrop-blur-md transition-all hover:border-[#e50914]/75 hover:bg-white/[0.1] hover:text-white hover:shadow-[0_0_32px_rgba(229,9,20,0.32)] sm:flex"
              >
                <span
                  className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-[100%]"
                  aria-hidden
                />
                <Zap className="relative z-10 mr-2 h-4 w-4 text-[#e50914]" strokeWidth={2.5} aria-hidden />
                <span className="relative z-10">Test Et</span>
              </Button>

              {/* Country flags - sağda, Test butonunun sağında */}
              <div className="hidden md:flex items-center gap-1">
                <span className="opacity-50 cursor-default" title="Fransa (Yakında)">
                  <img src="https://flagcdn.com/w40/fr.png" alt="Fransa bayrağı" width={20} height={16} loading="lazy" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="Avusturya (Yakında)">
                  <img src="https://flagcdn.com/w40/at.png" alt="Avusturya bayrağı" width={20} height={16} loading="lazy" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <Link to={germanTargetPath} className="hover:scale-110 transition-transform" title="Almanya">
                  <img src="https://flagcdn.com/w40/de.png" alt="Almanya bayrağı" width={20} height={16} loading="lazy" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </Link>
                <span className="opacity-50 cursor-default" title="İtalya (Yakında)">
                  <img src="https://flagcdn.com/w40/it.png" alt="İtalya bayrağı" width={20} height={16} loading="lazy" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="İngiltere (Yakında)">
                  <img src="https://flagcdn.com/w40/gb.png" alt="İngiltere bayrağı" width={20} height={16} loading="lazy" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="Polonya (Yakında)">
                  <img src="https://flagcdn.com/w40/pl.png" alt="Polonya bayrağı" width={20} height={16} loading="lazy" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
              </div>

              <button 
                onClick={() => setIsMenuOpen((open) => !open)}
                className="md:hidden flex items-center justify-center touch-target min-h-[48px] min-w-[48px] text-gray-300 hover:text-white"
                aria-label="Menüyü aç"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'spring', damping: 24, stiffness: 320 }}
              className="fixed top-[4.5rem] left-3 right-3 z-[101] flex max-h-[calc(100dvh-5.25rem)] flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.2),transparent_38%),linear-gradient(145deg,rgba(21,21,24,0.98),rgba(5,5,6,0.99))] shadow-[0_24px_80px_rgba(0,0,0,0.68),0_0_40px_rgba(229,9,20,0.12)] backdrop-blur-2xl md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#262626]">
                <span className="text-xl font-bold text-white">Menü</span>
                <button onClick={() => setIsMenuOpen(false)} className="min-h-[48px] min-w-[48px] flex items-center justify-center text-gray-400 hover:text-white" aria-label="Menüyü kapat">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-3 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Hizmetler</div>
                <div className="grid grid-cols-2 gap-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    title={item.label}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group min-h-[58px] rounded-2xl border px-3.5 py-3 text-left text-sm font-semibold transition-all ${
                      location.pathname === item.path
                        ? 'border-primary/50 bg-primary/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(229,9,20,0.12)]'
                        : 'border-white/10 bg-white/[0.035] text-gray-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-primary/80 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                ))}
                </div>
              </div>
              
              <div className="space-y-3 border-t border-white/10 bg-black/20 p-4">
                <Link 
                  to={germanTargetPath} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  title="Almanca siteye geçin"
                >
                  <img src="https://flagcdn.com/w40/de.png" alt="Almanya bayrağı" width={24} height={16} loading="lazy" className="w-6 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                  Almanca'ya Geç (DE)
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsMenuOpen(false);
                    openTestModal();
                  }}
                  className="group relative h-14 w-full overflow-hidden rounded-2xl border-2 border-[#e50914]/50 bg-white/[0.05] font-bold text-white shadow-[0_0_36px_rgba(229,9,20,0.22)] backdrop-blur-xl transition-all hover:border-[#e50914]/80 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_0_44px_rgba(229,9,20,0.3)] active:scale-[0.99]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] transition-transform duration-700 group-hover:translate-x-[100%]"
                    aria-hidden
                  />
                  <Zap className="relative z-10 mr-2.5 h-5 w-5 text-[#e50914]" strokeWidth={2.5} aria-hidden />
                  <span className="relative z-10">Ücretsiz Test</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Header);
