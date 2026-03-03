
import React, { useState, memo, useEffect } from 'react';
import { FlaskConical, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';
import { useLogoClickCounter } from '@/hooks/useLogoClickCounter';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderDE = ({ contactData }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openTestModal } = useTestModal();
  
  const handleLogoClick = useLogoClickCounter('/admin', 8, 2000);
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Startseite', path: '/de' },
    { label: 'Pakete', path: '/de/pakete' },
    { label: 'Kanäle', path: '/de/kanale' },
    { label: 'Einrichtung', path: '/de/einrichtung' },
    { label: 'Über uns', path: '/de/uber-uns' },
    { label: 'Reseller', path: '/de/reseller' },
    { label: 'Blog', path: '/de/blog' },
    { label: 'FAQ', path: '/de/sss' }
  ];

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          scrolled ? 'bg-[#0a0a16]/95 backdrop-blur-md shadow-lg border-b border-[#2a2a40]' : 'bg-[#0F0F1E] border-b border-[#2a2a40]'
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
                src={NEW_LOGO_URL} 
                alt="QRUZE TV Premium IPTV Logo" 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                loading="eager"
              />
            </Link>

            <nav className="hidden md:flex flex-1 items-center justify-center space-x-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNav(item.path)}
                  className={`relative block text-[15px] font-medium py-4 px-4 transition-all duration-300 ${
                    location.pathname === item.path ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.span layoutId="underline-de" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Language Switch - Desktop */}
              <Link 
                to="/" 
                className="hidden md:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white transition-all"
                title="Türkisch"
              >
                <img src="https://flagcdn.com/w40/tr.png" alt="" className="w-5 h-4 object-cover rounded-sm" />
                <span>TR</span>
              </Link>

              <Button 
                onClick={openTestModal} 
                className="hidden sm:flex font-semibold bg-purple-600 text-white hover:bg-purple-700 h-10 px-6 rounded-full transition-all"
              >
                <FlaskConical className="h-4 w-4 mr-2" /> 
                Testen
              </Button>

              {/* Country flags - sağda, Test butonunun sağında */}
              <div className="hidden md:flex items-center gap-1">
                <span className="opacity-50 cursor-default" title="Frankreich (Demnächst)">
                  <img src="https://flagcdn.com/w40/fr.png" alt="FR" className="w-5 h-4 object-cover rounded-sm" />
                </span>
                <span className="opacity-50 cursor-default" title="Österreich (Demnächst)">
                  <img src="https://flagcdn.com/w40/at.png" alt="AT" className="w-5 h-4 object-cover rounded-sm" />
                </span>
                <span className="opacity-100" title="Deutschland">
                  <img src="https://flagcdn.com/w40/de.png" alt="DE" className="w-5 h-4 object-cover rounded-sm" />
                </span>
                <span className="opacity-50 cursor-default" title="Italien (Demnächst)">
                  <img src="https://flagcdn.com/w40/it.png" alt="IT" className="w-5 h-4 object-cover rounded-sm" />
                </span>
                <span className="opacity-50 cursor-default" title="England (Demnächst)">
                  <img src="https://flagcdn.com/w40/gb.png" alt="GB" className="w-5 h-4 object-cover rounded-sm" />
                </span>
                <span className="opacity-50 cursor-default" title="Polen (Demnächst)">
                  <img src="https://flagcdn.com/w40/pl.png" alt="PL" className="w-5 h-4 object-cover rounded-sm" />
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
              className="fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#0F0F1E] border-l border-[#2a2a40] z-[101] flex flex-col md:hidden"
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
                  <img src="https://flagcdn.com/w40/tr.png" alt="" className="w-6 h-4 object-cover rounded-sm" />
                  Wechseln zu Türkisch (TR)
                </Link>
                <Button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    openTestModal();
                  }} 
                  className="w-full font-bold bg-purple-600 text-white hover:bg-purple-700 h-12 rounded-xl"
                >
                  <FlaskConical className="h-5 w-5 mr-2" /> 
                  Kostenlos Testen
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
