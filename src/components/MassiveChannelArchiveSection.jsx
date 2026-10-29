import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tv, Trophy, Film, Globe2, Baby, ArrowRight } from 'lucide-react';

const categories = [
  { icon: Trophy, title: 'Spor Kanalları', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { icon: Film, title: 'Sinema & Dizi', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { icon: Globe2, title: 'Ulusal Kanallar', color: 'text-blue-400', bg: 'bg-[#141414]/10' },
  { icon: Baby, title: 'Çocuk Kanalları', color: 'text-[#e50914]', bg: 'bg-[#e50914]/10' },
];

const MassiveChannelArchiveSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Gradients & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6 backdrop-blur-md">
              <Tv className="w-4 h-4" />
              Geniş Kanal Arşivi
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e50914] to-[#b20710] mb-6 tracking-tight drop-shadow-sm">
              Dünyanın Eğlencesi Tek Platformda
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Tüm aileniz için özenle seçilmiş, donmayan ve yüksek çözünürlüklü kanal seçenekleriyle eşsiz bir televizyon deneyimine hazır olun.
            </p>
          </motion.div>
        </div>

        {/* Category Cards - Glassmorphism */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 shadow-lg hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <cat.icon className={`w-8 h-8 ${cat.color}`} />
              </div>
              <p className="text-white font-bold text-lg group-hover:text-primary transition-colors">
                {cat.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link 
            to="/channels"
            title="Tüm IPTV kanallarını inceleyin"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#e50914] hover:to-[#b20710] text-white font-bold py-4 px-10 rounded-full shadow-[0_0_40px_-10px_rgba(229,9,20,0.5)] hover:shadow-[0_0_60px_-15px_rgba(229,9,20,0.7)] transition-all duration-300 text-lg group"
          >
            TÜM KANALLARI İNCELE
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MassiveChannelArchiveSection;
