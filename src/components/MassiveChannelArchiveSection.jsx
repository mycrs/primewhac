import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tv, Trophy, Film, Globe2, Baby, Compass, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  {
    icon: Globe2,
    title: 'Ulusal & Haber Yayınları',
    subtitle: 'TRT, HaberTürk, CNN Türk, NTV ve bağımsız bültenler',
    badge: 'Canlı EPG · 1080p',
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    tags: ['Anlık Haber', 'Tartışma & Ekonomi']
  },
  {
    icon: Trophy,
    title: 'Canlı Spor & Karşılaşmalar',
    subtitle: 'Süper Lig, Avrupa kupaları, EuroLeague ve motor sporları',
    badge: '60 FPS · Düşük Gecikme',
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    tags: ['Canlı Fikstür', 'Maç Öncesi & Sonrası']
  },
  {
    icon: Compass,
    title: 'Doğa, Tarih & Belgesel',
    subtitle: 'DMAX, TRT Belgesel, bilim, arkeoloji ve vahşi yaşam serileri',
    badge: '4K Ultra HD',
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    tags: ['Dünya Mirası', 'Yüksek Renk Derinliği']
  },
  {
    icon: Film,
    title: 'Kültür, Sanat & Sahne',
    subtitle: 'Klasik Türk sineması, tiyatro oyunları, caz ve akustik konserler',
    badge: 'Restorasyonlu Master',
    accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    tags: ['Kültürel Bellek', 'Lossless Ses']
  },
  {
    icon: Baby,
    title: 'Çocuk & Aile Kuşağı',
    subtitle: 'TRT Çocuk, Minika ve pedagojik olarak onaylı Türkçe animasyonlar',
    badge: 'Aile Dostu · Reklamsız',
    accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    tags: ['Güvenli İçerik', 'Eğitici Atölyeler']
  },
  {
    icon: Tv,
    title: 'Uluslararası Açık Yayınlar',
    subtitle: 'Almanya (ARD, ZDF), İngiltere, Fransa ve küresel genel yayınlar',
    badge: 'FTA Çok Dilli',
    accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    tags: ['Çoklu Dil', 'Avrupa Standartları']
  }
];

const MassiveChannelArchiveSection = ({ title }) => {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="channel-catalogue-heading">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Katalog & Kategori Mimarisi
            </span>
            <h2 id="channel-catalogue-heading" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              {title || 'Tüm Aile İçin Zengin ve Düzenli Yayın Yelpazesi'}
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light">
              Kanal karmaşası yerine; türlerine göre titizlikle kategorilenmiş, Elektronik Program Rehberi (EPG) ile desteklenen akıcı yayın akışı.
            </p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md tracking-wide ${cat.accent}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light mb-5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {cat.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link 
            to="/channels"
            title="Tüm kanalları kategori ve ülke bazında inceleyin"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#f40612] hover:to-[#c30813] text-white font-bold py-4 px-10 rounded-2xl shadow-[0_12px_40px_rgba(229,9,20,0.3)] hover:shadow-[0_16px_50px_rgba(229,9,20,0.45)] transition-all duration-300 text-base md:text-lg group"
          >
            <span>Kanal Listesini ve Detayları İncele</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(MassiveChannelArchiveSection);
