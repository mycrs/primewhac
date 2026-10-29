import React from 'react';
import { motion } from 'framer-motion';
import { Search, Play, ListVideo, Zap, Shield, Smartphone, Tv, Download } from 'lucide-react';

const DownloaderUrlMock = ({ isDe, accentClass, badgeClass, accentText }) => (
  <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0d1117] shadow-2xl">
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-slate-800">
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Downloader by AFTVnews</span>
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500/80" />
        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
      </div>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-slate-700/60">
        <Search className={`w-4 h-4 ${accentText} shrink-0`} />
        <span className="text-sm text-slate-400 truncate">
          {isDe ? 'APK-Link von WhatsApp/E-Mail' : 'WhatsApp/e-posta APK linki'}
        </span>
      </div>
      <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${accentClass} border`}>
        <div className={`w-14 h-14 rounded-xl bg-black border ${badgeClass} flex items-center justify-center shrink-0`}>
          <span className="text-lg font-black text-white">QP</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-bold text-sm">Qruze Player APK</div>
          <div className="text-[11px] text-slate-400 truncate">
            {isDe ? 'Nicht im Play Store' : 'Play Store\'da yok'}
          </div>
          <div className="mt-1.5 inline-flex px-2.5 py-0.5 rounded-md bg-primary text-[10px] font-bold text-white">
            Go / {isDe ? 'Installieren' : 'Yükle'}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PhoneApkMock = ({ isDe, accentClass, badgeClass, accentText, isPhone = true }) => (
  <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0a0a0a] shadow-2xl">
    <div className="flex items-center gap-2 px-4 py-2 bg-[#141414] border-b border-slate-800">
      <Download className={`w-4 h-4 ${accentText}`} />
      <span className="text-xs text-slate-400">{isDe ? 'APK-Download' : 'APK indirme'}</span>
    </div>
    <div className="p-4 space-y-3">
      <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${accentClass} border`}>
        <div className={`w-12 h-12 rounded-xl bg-black border ${badgeClass} flex items-center justify-center shrink-0`}>
          <span className="text-base font-black text-white">QP</span>
        </div>
        <div>
          <div className="text-white font-bold text-sm">qruze-player.apk</div>
          <div className="text-[11px] text-slate-500">{isDe ? 'Aus unbekannter Quelle' : 'Bilinmeyen kaynak'}</div>
        </div>
      </div>
      <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold text-white ${isPhone ? 'bg-[#e50914]' : 'bg-green-600'}`}>
        {isDe ? 'Installieren' : 'Yükle'}
      </div>
    </div>
  </div>
);

const AppUiMock = ({ isDe, accentText }) => (
  <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#0a0a0a] shadow-2xl">
    <div className="flex items-center gap-2 px-4 py-2 bg-[#141414] border-b border-slate-800">
      <span className={`text-xs font-bold ${accentText}`}>Qruze Player</span>
    </div>
    <div className="p-4 grid grid-cols-3 gap-2">
      {[
        { label: isDe ? 'Live TV' : 'Canlı TV', active: true },
        { label: 'VOD', active: false },
        { label: isDe ? 'Serien' : 'Diziler', active: false },
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
          <Play className={`w-3 h-3 ${accentText} shrink-0`} />
          <div className="h-1.5 flex-1 rounded bg-slate-700/80" />
        </div>
      ))}
    </div>
  </div>
);

const QruzePlayerShowcase = ({ isDe = false, variant = 'phone' }) => {
  const isPhone = variant === 'phone';
  const DeviceIcon = isPhone ? Smartphone : Tv;
  const accentClass = isPhone
    ? 'from-[#e50914]/10 to-transparent border-[#e50914]/30'
    : 'from-green-500/10 to-transparent border-green-500/30';
  const badgeClass = isPhone ? 'border-[#e50914]/40' : 'border-green-500/40';
  const accentText = isPhone ? 'text-[#e50914]' : 'text-green-400';
  const gradientBar = isPhone
    ? 'from-[#e50914]/20 via-transparent to-transparent'
    : 'from-green-500/20 via-transparent to-transparent';

  const features = isPhone
    ? [
        { icon: Download, title: 'APK Kurulum', desc: isDe ? 'Link per WhatsApp/E-Mail' : 'WhatsApp/e-posta linki' },
        { icon: ListVideo, title: isDe ? 'M3U & Xtream' : 'M3U & Xtream', desc: isDe ? 'Beide Formate' : 'Her iki format' },
        { icon: Zap, title: 'Chromecast', desc: isDe ? 'Auf TV casten' : 'TV\'ye yansıtma' },
        { icon: Shield, title: isDe ? 'Play Store' : 'Play Store', desc: isDe ? 'Nicht verfügbar' : 'Mağazada yok' },
      ]
    : [
        { icon: Tv, title: 'Downloader', desc: isDe ? 'APK sideload Tool' : 'APK sideload aracı' },
        { icon: ListVideo, title: isDe ? 'M3U & Xtream' : 'M3U & Xtream', desc: isDe ? 'Beide Formate' : 'Her iki format' },
        { icon: Zap, title: 'Fire TV', desc: isDe ? 'Downloader + APK' : 'Downloader + APK' },
        { icon: Shield, title: isDe ? 'Play Store' : 'Play Store', desc: isDe ? 'Qruze nicht gelistet' : 'Qruze listede yok' },
      ];

  return (
    <section className="relative mb-16 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientBar} pointer-events-none`} />
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${isPhone ? 'bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
              <DeviceIcon className="w-3.5 h-3.5" />
              {isPhone
                ? (isDe ? 'Android Smartphone · APK' : 'Android Telefon · APK')
                : (isDe ? 'Android TV · Downloader' : 'Android TV · Downloader')}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Qruze Player
              <span className="block text-lg font-normal text-slate-400 mt-1">
                {isDe ? 'Nicht im Google Play Store' : 'Google Play Store\'da yok'}
              </span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {isPhone
                ? (isDe
                  ? 'Qruze Player wird nicht im Play Store angeboten. Öffnen Sie den per WhatsApp oder E-Mail gesendeten APK-Link im Browser, laden Sie die Datei herunter und installieren Sie sie. Anschließend mit Ihren Zugangsdaten anmelden.'
                  : 'Qruze Player Play Store\'da bulunmaz. WhatsApp veya e-posta ile gönderilen APK linkini tarayıcıda açın, indirin ve kurun. Ardından size verilen giriş bilgileriyle oturum açın.')
                : (isDe
                  ? 'Installieren Sie zuerst „Downloader by AFTVnews“ aus dem TV-Store. Fügen Sie den gesendeten Qruze Player APK-Link in Downloader ein und installieren Sie die App. Fire TV Stick: unbekannte Quellen für Downloader erlauben.'
                  : 'Önce TV mağazasından Downloader by AFTVnews uygulamasını kurun. Size gönderilen Qruze Player APK linkini Downloader\'a yapıştırıp yükleyin. Fire TV Stick\'te Downloader için bilinmeyen kaynak izni gerekir.')}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${isPhone ? 'bg-[#e50914]/10' : 'bg-green-500/10'}`}>
                    <f.icon className={`w-4 h-4 ${accentText}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{f.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              {isDe
                ? 'Der APK-Download-Link wird nach dem Abo per WhatsApp oder E-Mail gesendet. Unten auf der Seite finden Sie auch den Download-Button, falls hinterlegt.'
                : 'APK indirme linki abonelik sonrası WhatsApp veya e-posta ile iletilir. Sayfadaki indirme butonundan da erişebilirsiniz.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {isPhone ? (
              <PhoneApkMock isDe={isDe} accentClass={accentClass} badgeClass={badgeClass} accentText={accentText} isPhone />
            ) : (
              <DownloaderUrlMock isDe={isDe} accentClass={accentClass} badgeClass={badgeClass} accentText={accentText} />
            )}
            <AppUiMock isDe={isDe} accentText={accentText} />
            <p className="text-[11px] text-slate-600 text-center">
              {isDe ? 'Illustrative App-Oberfläche' : 'Uygulama arayüzü temsili görsel'}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QruzePlayerShowcase;
