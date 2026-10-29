import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tv, Trophy, Film, Globe2, Baby, Compass, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES_DE = [
  {
    icon: Globe2,
    title: 'Nationale Sender & Nachrichten',
    subtitle: 'TRT, HaberTürk, CNN Türk, NTV und unabhängige Berichterstattung',
    badge: 'Live EPG · 1080p',
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    tags: ['Echtzeit-Nachrichten', 'Wirtschaft & Debatte']
  },
  {
    icon: Trophy,
    title: 'Live-Sport & Spielpläne',
    subtitle: 'Süper Lig, UEFA-Wettbewerbe, EuroLeague und Motorsport',
    badge: '60 FPS · Niedrige Latenz',
    accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    tags: ['Live-Spielplan', 'Vor- & Nachberichte']
  },
  {
    icon: Compass,
    title: 'Natur, Geschichte & Wissen',
    subtitle: 'DMAX, TRT Belgesel, Wissenschaft, Archäologie und Tierwelten',
    badge: '4K Ultra HD',
    accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    tags: ['Weltkultur', 'Hohe Farbtiefe']
  },
  {
    icon: Film,
    title: 'Kultur, Kunst & Theater',
    subtitle: 'Klassisches türkisches Kino, Theateraufführungen und Festivalkino',
    badge: 'Restaurierte Master',
    accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    tags: ['Kulturerbe', 'Lossless Audio']
  },
  {
    icon: Baby,
    title: 'Kinder- & Familienprogramm',
    subtitle: 'TRT Çocuk, Minika und pädagogisch geprüfte türkische Zeichentrickserien',
    badge: 'Familienfreundlich · Werbefrei',
    accent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    tags: ['Sichere Inhalte', 'Lernformate']
  },
  {
    icon: Tv,
    title: 'Internationale Free-to-Air Sender',
    subtitle: 'Deutschland (ARD, ZDF), Großbritannien, Frankreich und weltweite Sender',
    badge: 'FTA Mehrsprachig',
    accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    tags: ['Mehrsprachig', 'Europäische Sender']
  }
];

const MassiveChannelArchiveSectionDE = ({ title }) => {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="channel-catalogue-heading-de">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Sparten- & Sendeübersicht
            </span>
            <h2 id="channel-catalogue-heading-de" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              {title || 'Vielseitige und geordnete Senderlandschaft'}
            </h2>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light">
              Kein Senderchaos: Übersichtliche Kategorisierung nach Programmgenres, unterstützt durch einen elektronischen Programmführer (EPG).
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {CATEGORIES_DE.map((cat, idx) => {
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link 
            to="/de/kanale"
            title="Alle Kanäle nach Kategorie und Land ansehen"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#e50914] to-[#b20710] hover:from-[#f40612] hover:to-[#c30813] text-white font-bold py-4 px-10 rounded-2xl shadow-[0_12px_40px_rgba(229,9,20,0.3)] hover:shadow-[0_16px_50px_rgba(229,9,20,0.45)] transition-all duration-300 text-base md:text-lg group"
          >
            <span>Kanalübersicht und Details ansehen</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(MassiveChannelArchiveSectionDE);
