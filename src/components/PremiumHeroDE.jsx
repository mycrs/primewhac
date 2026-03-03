
import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, Monitor, ShieldCheck, Film, Clock, Sparkles, Tv2, Radio, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useTestModal } from '@/contexts/TestModalContext';

const features = [
  { icon: Monitor, title: "4K Ultra HD Streaming", desc: "Echtes Kinoerlebnis mit kristallklarer und flüssiger Bildqualität.", color: "from-blue-400 to-cyan-400" },
  { icon: ShieldCheck, title: "Anti-Freeze Technologie", desc: "Kein Einfrieren mehr! Unterbrechungsfreies Streaming auch zur Stoßzeit.", color: "from-purple-400 to-pink-400" },
  { icon: Film, title: "Riesiges VOD-Archiv", desc: "Die aktuellsten Serien, Kinofilme und Dokumentationen auf Knopfdruck.", color: "from-amber-400 to-orange-400" },
  { icon: Clock, title: "24/7 Premium Support", desc: "Unser technisches Expertenteam bietet sofortige Lösungen für jedes Problem.", color: "from-emerald-400 to-green-400" }
];

const trustItems = [
  { icon: Tv2, label: "5000+ Kanäle" },
  { icon: Radio, label: "4K Ultra HD" },
  { icon: Headphones, label: "24/7 Support" }
];

const ROTATING_SLIDES_DE = [
  { id: 1, gradient: 'linear-gradient(135deg, rgba(88,28,135,0.4) 0%, rgba(15,23,42,0.95) 50%, rgba(6,78,59,0.3) 100%)', tagline: 'Kinoqualität Streaming' },
  { id: 2, gradient: 'linear-gradient(135deg, rgba(30,58,138,0.35) 0%, rgba(15,23,42,0.95) 50%, rgba(124,58,237,0.25) 100%)', tagline: '5000+ Kanäle • Live & VOD' },
  { id: 3, gradient: 'linear-gradient(135deg, rgba(6,78,59,0.3) 0%, rgba(15,23,42,0.95) 50%, rgba(168,85,247,0.3) 100%)', tagline: '4K & 8K Unterstützung' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const PremiumHeroDE = () => {
  const { openTestModal } = useTestModal();
  const [slideIndex, setSlideIndex] = useState(0);
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";

  useEffect(() => {
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % ROTATING_SLIDES_DE.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full min-h-[100vh] flex flex-col justify-center overflow-hidden bg-[#030308] pt-24 pb-28">
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
        <AnimatePresence mode="wait">
          <motion.div
            key={ROTATING_SLIDES_DE[slideIndex].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
            style={{ background: ROTATING_SLIDES_DE[slideIndex].gradient }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(139,92,246,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
        <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.75)]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto flex flex-col items-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={slideIndex} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.4 }} className="mb-6 text-sm font-medium tracking-[0.2em] uppercase text-cyan-400/90">
              {ROTATING_SLIDES_DE[slideIndex].tagline}
            </motion.div>
          </AnimatePresence>

          <motion.div variants={itemVariants} animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500/25 via-cyan-500/25 to-purple-500/25 blur-2xl opacity-70" />
            <img src={NEW_LOGO_URL} alt="QRUZE TV Premium" className="relative h-28 md:h-36 w-auto drop-shadow-[0_0_60px_rgba(168,85,247,0.5)]" fetchPriority="high" decoding="async" />
          </motion.div>

          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-amber-500/15 backdrop-blur-xl mb-6 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Ultra Premium</span>
            <span className="w-px h-4 bg-amber-500/40" />
            <span className="text-sm font-medium text-gray-300 tracking-wide">Deutschlands Beste Premium IPTV Plattform</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-display text-center max-w-4xl mb-6">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white antialiased leading-tight">Grenzenlose Unterhaltung,</span>
            <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight antialiased leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300">Wahres Vergnügen Entdecken</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl text-center leading-relaxed">
            Vergessen Sie das traditionelle Fernsehen. Mit Tausenden von <span className="text-white font-medium">Premium-Kanälen</span>, einer riesigen <span className="text-white font-medium">VOD-Bibliothek</span> und unserer perfekten <span className="text-cyan-400 font-semibold">4K-Infrastruktur</span> verwandeln wir Ihr Zuhause in ein privates Kino.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-6 w-full sm:w-auto">
            <Link to="/de/pakete" className="w-full sm:w-auto group">
              <Button className="w-full sm:w-auto h-14 px-12 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-bold text-base hover:from-purple-500 hover:via-purple-400 hover:to-indigo-500 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_60px_rgba(147,51,234,0.5)] border border-white/25 relative overflow-hidden">
                <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Play className="w-5 h-5 mr-2.5 fill-current relative z-10" />
                <span className="relative z-10">Pakete Entdecken</span>
              </Button>
            </Link>
            <Button onClick={openTestModal} className="w-full sm:w-auto h-14 px-12 rounded-2xl bg-white/[0.04] border-2 border-cyan-400/50 backdrop-blur-xl text-white font-bold text-base hover:bg-white/[0.08] hover:border-cyan-400/80 hover:scale-[1.03] transition-all duration-300 shadow-[0_0_50px_rgba(34,211,238,0.25)] group relative overflow-hidden">
              <Zap className="w-5 h-5 mr-2.5 text-cyan-400 relative z-10" />
              <span className="relative z-10">Kostenlos Testen</span>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto mb-10 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md px-4 py-3 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">4K</span>
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">8K</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-medium text-gray-400">Wird abgespielt</span>
            </div>
            <div className="flex-1 min-w-[180px] flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" initial={{ width: '0%' }} animate={{ width: ['0%', '52%', '52%'] }} transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 1] }} />
              </div>
              <span className="text-[11px] font-mono text-gray-500 tabular-nums">1:24:00 / 2:30:00</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-16 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-gray-400">
                <item.icon className="w-5 h-5 text-cyan-400/80" />
                <span className="text-sm font-medium text-gray-300">{item.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {features.map((feature, index) => (
              <motion.div key={index} whileHover={{ y: -8, scale: 1.02 }} className="group relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`relative w-14 h-14 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-7 h-7 text-white drop-shadow-md" />
                </div>
                <h3 className="relative text-lg font-bold text-white mb-2 tracking-tight">{feature.title}</h3>
                <p className="relative text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#030308] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default memo(PremiumHeroDE);
