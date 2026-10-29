import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Tv, Search, ListVideo, Zap, Shield } from 'lucide-react';

const OFFICIAL_URL = 'https://www.iptvsmarters.com/';
const LOGO_ICON = '/iptv-smarters-pro-icon.svg';
const LOGO_WIDE = '/iptv-smarters-pro-logo.svg';

const StoreSearchMock = ({ isDe }) => (
  <div className="rounded-xl overflow-hidden border border-violet-500/20 bg-[#0d1117] shadow-2xl shadow-violet-500/5">
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-slate-800">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Smart TV Apps</span>
      <span className="text-[10px] text-violet-400 font-semibold">Samsung / LG</span>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-violet-500/30">
        <Search className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="text-sm text-white font-medium">IPTV Smarters Pro</span>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-transparent border border-violet-500/35">
        <img src={LOGO_ICON} alt="IPTV Smarters Pro" className="w-16 h-16 rounded-2xl shrink-0 shadow-lg shadow-violet-900/40" />
        <div className="min-w-0 flex-1">
          <div className="text-white font-bold text-sm md:text-base">IPTV Smarters Pro</div>
          <div className="text-[11px] text-violet-200/70 mt-0.5">Live TV · EPG · VOD · 4K</div>
          <div className="mt-2 inline-flex px-3 py-1 rounded-md bg-violet-600 text-[10px] font-bold text-white shadow-md shadow-violet-900/30">
            {isDe ? 'Installieren' : 'Yükle'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SmartersProShowcase = ({ isDe = false }) => {
  const features = [
    {
      icon: Tv,
      title: isDe ? 'Smart TV Store' : 'TV mağazasında',
      desc: isDe ? 'Samsung Apps & LG Content Store' : 'Samsung Apps ve LG Content Store',
    },
    {
      icon: ListVideo,
      title: 'Xtream & M3U',
      desc: isDe ? 'Beide Login-Methoden unterstützt' : 'Her iki giriş yöntemi desteklenir',
    },
    {
      icon: Zap,
      title: 'EPG & VOD',
      desc: isDe ? 'Programmführer und Mediathek' : 'Program rehberi ve VOD arşivi',
    },
    {
      icon: Shield,
      title: isDe ? 'Bewährt' : 'Yaygın kullanım',
      desc: isDe ? 'Beliebte Wahl auf Samsung/LG' : 'Samsung ve LG\'de popüler seçim',
    },
  ];

  return (
    <section className="py-14 px-4 border-y border-slate-800/50 bg-gradient-to-b from-[#0a0a0a] via-[#0f0a1a] to-[#0d0d0d]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-3 px-3 py-2 rounded-full text-xs font-bold bg-violet-500/10 text-violet-300 border border-violet-500/25 mb-5">
              <img src={LOGO_ICON} alt="IPTV Smarters Pro logosu" className="w-7 h-7 rounded-lg" aria-hidden />
              IPTV Smarters Pro
            </div>
            <img src={LOGO_WIDE} alt="IPTV Smarters Pro" className="h-12 md:h-14 w-auto max-w-full mb-5 object-contain object-left" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {isDe
                ? 'IPTV Smarters Pro auf Samsung & LG Smart TV'
                : 'Samsung ve LG Smart TV\'de IPTV Smarters Pro'}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {isDe
                ? 'Installieren Sie IPTV Smarters Pro aus dem TV-Store, melden Sie sich mit Xtream Codes oder M3U an — in wenigen Minuten bereit.'
                : 'TV mağazasından IPTV Smarters Pro\'yu indirin, Xtream Codes veya M3U ile giriş yapın — dakikalar içinde hazır.'}
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-violet-500/10">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{f.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:from-violet-500 hover:to-indigo-500 transition-colors shadow-lg shadow-violet-900/30"
            >
              {isDe ? 'Offizielle Seite' : 'Resmi Site'}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            <StoreSearchMock isDe={isDe} />
            <div className="rounded-xl border border-violet-500/20 bg-[#0a0a0a] p-3 shadow-2xl">
              <img src="/guides/smarters-xtream.svg" alt="IPTV Smarters Pro Xtream Codes giriş ekranı" className="w-full rounded-lg object-contain" />
            </div>
            <p className="text-[11px] text-slate-600 text-center">
              {isDe ? 'Xtream Codes & M3U Oberfläche' : 'Xtream Codes ve M3U arayüzü'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SmartersProShowcase;
