
import React, { useState, memo, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';
import { useLogoClickCounter } from '@/hooks/useLogoClickCounter';
import { BRAND_LOGO_URL } from '@/constants/brandAssets';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderDE = ({ contactData }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openTestModal } = useTestModal();
  
  const handleLogoClick = useLogoClickCounter('/yonetim', 8, 2000);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Startseite', path: '/de' },
    { label: 'Pakete', path: '/de/pakete' },
    { label: 'Kanäle', path: '/de/kanale' },
    { label: 'Einrichtung', path: '/de/einrichtung' },
    { label: 'M3U erstellen', path: '/de/m3u-olustur' },
    { label: 'Über uns', path: '/de/uber-uns' },
    { label: 'Reseller', path: '/de/reseller' },
    { label: 'Blog', path: '/de/blog' },
    { label: 'FAQ', path: '/de/sss' },
    { label: 'Bewertungen', path: '/de/bewertungen' }
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
              to="/de"
              onClick={handleLogoClick}
              className="flex-shrink-0 z-50 focus:outline-none select-none cursor-pointer flex items-center group py-2" 
            >
              <img 
                src={BRAND_LOGO_URL} 
                alt="QruzeTV logo"
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                loading="eager"
                fetchPriority="high"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </Link>

            <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNav(item.path)}
                  className={`relative block rounded-full px-4 py-2.5 text-[14px] font-semibold transition-all duration-300 ${
                    location.pathname === item.path ? 'bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_22px_rgba(229,9,20,0.14)]' : 'text-gray-300 hover:bg-white/[0.045] hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.span layoutId="underline-de" className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Language Switch - Desktop */}
              <Link 
                to="/" 
                className="hidden md:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-sm font-semibold text-gray-300 hover:text-white transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                title="Türkisch"
              >
                <img src="https://flagcdn.com/w40/tr.png" alt="Türkiye bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                <span>TR</span>
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
                <span className="relative z-10">Testen</span>
              </Button>

              {/* Country flags - sağda, Test butonunun sağında */}
              <div className="hidden md:flex items-center gap-1">
                <span className="opacity-50 cursor-default" title="Frankreich (Demnächst)">
                  <img src="https://flagcdn.com/w40/fr.png" alt="Fransa bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="Österreich (Demnächst)">
                  <img src="https://flagcdn.com/w40/at.png" alt="Avusturya bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-100" title="Deutschland">
                  <img src="https://flagcdn.com/w40/de.png" alt="Almanya bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="Italien (Demnächst)">
                  <img src="https://flagcdn.com/w40/it.png" alt="İtalya bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="England (Demnächst)">
                  <img src="https://flagcdn.com/w40/gb.png" alt="İngiltere bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
                <span className="opacity-50 cursor-default" title="Polen (Demnächst)">
                  <img src="https://flagcdn.com/w40/pl.png" alt="Polonya bayrağı" className="w-5 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                </span>
              </div>

              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden flex items-center justify-center touch-target min-h-[44px] min-w-[44px] text-gray-300 hover:text-white"
                aria-label="Menü öffnen"
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#0a0a0a] border-l border-[#262626] z-[101] flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[#2a2a40]">
                <span className="text-xl font-bold text-white">Menü</span>
                <button onClick={() => setIsMenuOpen(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white" aria-label="Menü schließen">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNav(item.path)}
                    className="w-full text-left px-4 py-3 min-h-[44px] flex items-center text-gray-300 hover:bg-white/5 hover:text-white rounded-xl text-lg font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <div className="p-5 border-t border-[#2a2a40] space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                >
                  <img src="https://flagcdn.com/w40/tr.png" alt="Türkiye bayrağı" className="w-6 h-4 object-cover rounded-sm" referrerPolicy="no-referrer" />
                  Wechseln zu Türkisch (TR)
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
                  <span className="relative z-10">Kostenlos Testen</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(HeaderDE);
