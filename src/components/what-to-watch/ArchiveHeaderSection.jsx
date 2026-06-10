import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ArchiveHeaderSection = () => {
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-4xl mx-auto mb-10 group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#e50914] via-pink-600 to-[#b20710] rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-700"></div>
      
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl text-center transform transition-transform duration-500 hover:scale-[1.02]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-block mb-4 text-5xl md:text-6xl"
        >
          🎬
        </motion.div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] via-pink-300 to-[#b20710] tracking-tight">
          {isDe ? "Was haben wir in unserem Archiv? Entdecken Sie es!" : "Arşivimizde Neler Var? Keşfedin!"}
        </h2>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto font-medium">
          {isDe 
            ? "Finden Sie sofort aus Tausenden von Filmen und Serien das Passende für sich. Durchsuchen Sie die Kategorien für ein einzigartiges Seherlebnis." 
            : "Binlerce film ve dizi arasından size en uygun olanı anında bulun. Eşsiz bir izleme deneyimi için kategorilere göz atın."}
        </p>
      </div>
    </motion.div>
  );
};

export default ArchiveHeaderSection;