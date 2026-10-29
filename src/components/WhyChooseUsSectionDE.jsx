import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Server, Zap, Layers, ShieldCheck, Check, Sparkles } from 'lucide-react';

const ENGINEERING_PILLARS_DE = [
  {
    icon: Server,
    kicker: 'Europäisches Core-Peering',
    metric: '< 12ms Latenz',
    title: 'Frankfurt & Amsterdam CDN-Infrastruktur',
    desc: 'Direkte Anbindung an zentrale Internet-Knotenpunkte in Deutschland und Westeuropa. Keine Drosselung oder Pufferung zu abendlichen Spitzenzeiten.',
    tags: ['Redundante Leitungen', 'Garantierte Bandbreite'],
  },
  {
    icon: Zap,
    kicker: 'Präzise Bildwiederholrate',
    metric: 'Echte 60 FPS Streams',
    title: 'H.265 / HEVC Hochbitraten-Streaming',
    desc: 'Kristallklare Schärfe bei schnellen Ball- und Spielbewegungen ohne Pixelbildung. Ressourcenschonend für Ihr Heimnetzwerk.',
    tags: ['Flüssige Ballbewegung', 'Full HD & 4K UHD'],
  },
  {
    icon: Layers,
    kicker: 'Gerätefreiheit',
    metric: 'M3U & Xtream Standard',
    title: 'Offenes Protokoll & Eigene Player-Wahl',
    desc: 'Keine Zwangs-Apps. Kompatibel mit Apple TV, Smart TVs (Samsung Tizen, LG webOS), Fire TV sowie professionellen Apps wie TiviMate.',
    tags: ['Apple TV & TiviMate', 'Smart TV Direktkompatibel'],
  },
  {
    icon: ShieldCheck,
    kicker: 'Faire Bedingungen',
    metric: 'Ohne Abo-Falle',
    title: 'Persönlicher Support & Keine Bindung',
    desc: 'Keine automatische Vertragsverlängerung. Schritt-für-Schritt-Unterstützung bei der Ersteinrichtung direkt per WhatsApp oder E-Mail.',
    tags: ['Direkter WhatsApp-Support', 'Keine Mindestlaufzeit'],
  }
];

const WhyChooseUsSectionDE = () => {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="why-choose-heading-de">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Technische Standards</span>
          </div>
          <h2 id="why-choose-heading-de" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Ingenieurskunst statt Standard-Server
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
            Zuverlässiger Empfang türkischer Sender in Deutschland erfordert eine stabile Infrastruktur. Wir setzen auf dedizierte Server und modernste Streaming-Technologie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ENGINEERING_PILLARS_DE.map((pillar, idx) => {
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
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {pillar.metric}
                    </span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                    {pillar.kicker}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-light mb-6">
                    {pillar.desc}
                  </p>
                </div>

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

export default memo(WhyChooseUsSectionDE);
