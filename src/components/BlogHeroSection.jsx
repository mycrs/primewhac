
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogHeroSection = ({ lang, setLang }) => {
  const content = {
    tr: {
      title: "Blog & Rehberler",
      subtitle: "IPTV dünyasından en son haberler, detaylı kurulum rehberleri ve uzman ipuçları."
    },
    de: {
      title: "Blog & Leitfäden",
      subtitle: "Neueste Nachrichten aus der IPTV-Welt, detaillierte Einrichtungsanleitungen und Expertentipps."
    }
  };

  return (
    <section className="relative min-h-[40vh] flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-[#0a0a0a] border border-[#262626] shadow-xl shadow-[#e50914]/5 mb-10 px-4 py-16">
      
      {/* Subtle Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e50914]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#141414]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
        <div className="flex bg-[#0a0a0a] p-1 rounded-full border border-[#262626] shadow-inner">
          <button
            onClick={() => setLang('tr')}
            className={`relative px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-colors duration-300 ${
              lang === 'tr' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'tr' && (
              <motion.div
                layoutId="active-blog-lang"
                className="absolute inset-0 bg-[#e50914] rounded-full shadow-md"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" className="w-4 h-3 rounded-[2px] object-cover flex-shrink-0 shadow-sm">
                <rect width="1200" height="800" fill="#E30A17"/>
                <circle cx="425" cy="400" r="200" fill="#fff"/>
                <circle cx="475" cy="400" r="160" fill="#E30A17"/>
                <polygon fill="#fff" points="700,400 600,432.4 630.9,535.3 545.5,465 460,535.3 490.9,432.4 390.9,370 505.5,370 545.5,267.6 585.5,370" />
              </svg>
              TR
            </span>
          </button>
          <button
            onClick={() => setLang('de')}
            className={`relative px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-colors duration-300 ${
              lang === 'de' ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang === 'de' && (
              <motion.div
                layoutId="active-blog-lang"
                className="absolute inset-0 bg-[#e50914] rounded-full shadow-md"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-4 h-3 rounded-[2px] object-cover flex-shrink-0 shadow-sm">
                <rect width="3" height="2" fill="#000"/>
                <rect width="3" height="1.333" y="0.666" fill="#D00"/>
                <rect width="3" height="0.666" y="1.333" fill="#FFCE00"/>
              </svg>
              DE
            </span>
          </button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-3xl mx-auto mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-medium rounded-full bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e50914] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e50914]"></span>
              </span>
              {lang === 'tr' ? 'Güncel İçerikler' : 'Aktuelle Inhalte'}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {content[lang].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl leading-relaxed">
              {content[lang].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BlogHeroSection;
