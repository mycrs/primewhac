import React from 'react';
import { motion } from 'framer-motion';
import { Network, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const VALUES = [
  {
    id: 1,
    title: 'Açık Standartlar & Donanım Özgürlüğü',
    icon: Network,
    kicker: 'M3U & Xtream Uyumlu',
    description: 'Sizi tek bir hantal uygulamaya hapsetmiyoruz. Samsung Tizen, LG webOS, Apple TV, Fire TV veya TiviMate; sevdiğiniz arayüzü seçmekte tamamen özgürsünüz.',
    accent: 'from-emerald-500 to-emerald-700',
    borderGlow: 'hover:border-emerald-500/40'
  },
  {
    id: 2,
    title: 'Taahhütsüz & Gizli Kesintisiz Şeffaflık',
    icon: ShieldCheck,
    kicker: 'Otomatik Kart Çekimi Yok',
    description: 'Sürpriz faturalar veya iptali zor sözleşmeler politikamızda yer almaz. Paket süreniz bittiğinde yenilemek tamamen sizin kararınızdır.',
    accent: 'from-[#e50914] to-[#b20710]',
    borderGlow: 'hover:border-primary/40'
  },
  {
    id: 3,
    title: 'Birebir İnsan Rehberliği & Empati',
    icon: HeartHandshake,
    kicker: 'Gerçek Türkçe Destek',
    description: 'Yapay zeka robotları yerine, televizyonunuzun ve ev internetinizin teknik gereksinimlerine göre doğrudan WhatsApp üzerinden çözüm sunan gerçek uzmanlar.',
    accent: 'from-amber-500 to-amber-700',
    borderGlow: 'hover:border-amber-500/40'
  }
];

const AboutValueSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="about-values-heading">
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Yayın Felsefemiz</span>
          </div>
          <h2 id="about-values-heading" className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Taviz Vermediğimiz Temel İlkelerimiz
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
            Sadece bir yayın akışı değil; gurbette evinize huzur ve güven getiren dürüst bir hizmet anlayışı.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className={`group relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${item.borderGlow} hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-2 font-mono">
                    {item.kicker}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutValueSection;
