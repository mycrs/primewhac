import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Tv, Search, Play, ListVideo, Zap, Shield } from 'lucide-react';

const OFFICIAL_URL = 'https://0player.com/';

const StoreSearchMock = ({ storeLabel, searchQuery, isDe }) => (
  <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0d1117] shadow-2xl">
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-slate-800">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{storeLabel}</span>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500/80" />
        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-slate-700/60">
        <Search className="w-4 h-4 text-slate-500 shrink-0" />
        <span className="text-sm text-white font-medium">{searchQuery}</span>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30">
        <div className="w-14 h-14 rounded-xl bg-black border border-amber-500/40 p-1.5 shrink-0">
          <img src="/0player-logo.png" alt="0 Player" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-bold text-sm">0 Player</div>
          <div className="text-[11px] text-slate-400 truncate">
            {isDe ? 'Premium Media Player · IPTV' : 'Premium Media Player · IPTV'}
          </div>
          <div className="mt-1.5 inline-flex px-2.5 py-0.5 rounded-md bg-primary text-[10px] font-bold text-white">
            {isDe ? 'Installieren' : 'Yükle'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AppUiMock = ({ isDe }) => (
  <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0a0a0a] shadow-2xl">
    <div className="flex items-center gap-2 px-4 py-2 bg-[#141414] border-b border-slate-800">
      <img src="/0player-logo.png" alt="0 Player logosu" className="h-5 w-auto object-contain" aria-hidden />
      <span className="text-xs text-slate-400">0 Player</span>
    </div>
    <div className="p-4 grid grid-cols-3 gap-2">
      {[
        { label: isDe ? 'Live TV' : 'Canlı TV', active: true },
        { label: 'EPG', active: false },
        { label: 'VOD', active: false },
      ].map((item) => (
        <div
          key={item.label}
          className={`text-center py-2 rounded-lg text-[10px] font-semibold ${
            item.active ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-[#141414] text-slate-500'
          }`}
        >
          {item.label}
        </div>
      ))}
    </div>
    <div className="px-4 pb-4 space-y-1.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414]/80">
          <Play className="w-3 h-3 text-amber-400 shrink-0" />
          <div className="h-1.5 flex-1 rounded bg-slate-700/80" />
        </div>
      ))}
    </div>
  </div>
);

const ZeroPlayerShowcase = ({ isDe = false, variant = 'generic' }) => {
  const storeLabel =
    variant === 'samsung'
      ? 'Samsung Apps'
      : variant === 'lg'
        ? 'LG Content Store'
        : isDe
          ? 'Smart TV App Store'
          : 'Smart TV Uygulama Mağazası';

  const features = [
    {
      icon: Tv,
      title: isDe ? 'Für Fernseher gebaut' : 'TV için tasarlandı',
      desc: isDe ? 'Navigation mit der Fernbedienung' : 'Uzaktan kumanda ile rahat menü',
    },
    {
      icon: Zap,
      title: isDe ? 'Schnelles Zapping' : 'Hızlı kanal geçişi',
      desc: isDe ? 'Live-Kanalwechsel ohne Verzögerung' : 'Canlı yayında gecikmesiz zapping',
    },
    {
      icon: ListVideo,
      title: 'M3U & Xtream',
      desc: isDe ? 'Beide gängigen Anbindungen' : 'Her iki bağlantı türü desteklenir',
    },
    {
      icon: Shield,
      title: isDe ? 'Offiziell im Store' : 'Resmi mağaza uygulaması',
      desc: isDe ? 'Samsung Tizen & LG webOS' : 'Samsung Tizen ve LG webOS',
    },
  ];

  return (
    <section className="py-14 px-4 border-y border-slate-800/50 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 mb-5">
              <img src="/0player-logo.png" alt="0 Player logosu" className="h-4 w-auto" aria-hidden />
              0 Player · Zero Player
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {isDe
                ? 'Premium IPTV-Player für Samsung & LG Smart TV'
                : 'Samsung ve LG Smart TV için premium IPTV oynatıcı'}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {isDe
                ? '0 Player ist unser empfohlener Media Player für Tizen und webOS. Installieren Sie die App aus dem TV-Store, fügen Sie Ihre M3U- oder Xtream-Daten hinzu — fertig.'
                : 'Smart TV kurulumunda önerdiğimiz uygulama 0 Player (Zero Player). TV mağazasından indirin, M3U veya Xtream bilgilerinizi ekleyin — birkaç dakikada hazır.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-amber-400" />
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-colors"
            >
              {isDe ? 'Offizielle Seite' : 'Resmi Site'}
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <StoreSearchMock
              storeLabel={storeLabel}
              searchQuery="0 Player"
              isDe={isDe}
            />
            <AppUiMock isDe={isDe} />
            <p className="text-[11px] text-slate-600 text-center">
              {isDe ? 'Illustrative App-Oberfläche' : 'Uygulama arayüzü temsili görsel'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ZeroPlayerShowcase;
