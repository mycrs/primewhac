import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Server, Zap, Layers, ShieldCheck, Check, Sparkles } from 'lucide-react';

const ENGINEERING_PILLARS = [
  {
    icon: Server,
    kicker: 'Avrupa Omurga Peering',
    metric: '< 12ms Düşük Gecikme',
    title: 'Frankfurt & Amsterdam CDN Altyapısı',
    desc: 'Avrupa ve Türkiye arasındaki ana internet değişim noktalarına doğrudan bağlı yedekli hatlar. Derbi ve prime-time saatlerinde tamponlama (buffering) yaşanmaz.',
    tags: ['Yedekli Hat', 'Sıfır Yoğunluk Kaybı'],
    accent: 'from-[#e50914] to-[#b20710]'
  },
  {
    icon: Zap,
    kicker: 'Hareket Doğruluğu',
    metric: 'Gerçek 60 FPS Akış',
    title: 'H.265 / HEVC Yüksek Bitrate',
    desc: 'Spor müsabakalarında ve hızlı sahnelerde piksellenmeyi önleyen modern sıkıştırma standardı. İnternet kotanızı yormadan stadyum netliği.',
    tags: ['Akıcı Top Hareketi', '4K / 1080p60'],
    accent: 'from-amber-500 to-amber-700'
  },
  {
    icon: Layers,
    kicker: 'Donanım Özgürlüğü',
    metric: 'M3U & Xtream Desteği',
    title: 'Açık Protokol & Kendi Oynatıcın',
    desc: 'Sizi zorunlu ve hantal uygulamalara hapsetmiyoruz. Samsung Tizen, LG webOS, Apple TV, Fire TV ve TiviMate ile kendi favori arayüzünüzü kullanın.',
    tags: ['Apple TV & TiviMate', 'Akıllı TV Uyumlu'],
    accent: 'from-emerald-500 to-emerald-700'
  },
  {
    icon: ShieldCheck,
    kicker: 'Şeffaf Hizmet',
    metric: 'Sözleşmesiz & Net',
    title: 'Birebir İnsan Desteği & Sıfır Taahhüt',
    desc: 'Otomatik kart çekimi veya gizli abonelik şartları yok. Cihazınıza özel adım adım kurulum için WhatsApp üzerinden gerçek bir uzmanla görüşün.',
    tags: ['Canlı WhatsApp Destek', 'Taahhütsüz'],
    accent: 'from-blue-500 to-blue-700'
  }
];

const WhyChooseUsSection = ({ title }) => {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Mühendislik Standartlarımız</span>
          </div>
          <h2 id="why-choose-heading" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            {title || 'Sıradan Sunucular Değil, Özel Yayın Mimarisi'}
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
            Gurbetteki Türk ailelerinin ve sporseverlerin en çok ihtiyaç duyduğu şey kesintisizliktir. Altyapımızı reklam sloganlarıyla değil, somut teknik standartlarla inşa ediyoruz.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ENGINEERING_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                <div>
                  {/* Top Bar: Icon & Metric */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {pillar.metric}
                    </span>
                  </div>

                  {/* Kicker */}
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                    {pillar.kicker}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom Tags */}
                <div className="pt-4 border-t border-white/5 space-y-2">
                  {pillar.tags.map((tag, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(WhyChooseUsSection);
