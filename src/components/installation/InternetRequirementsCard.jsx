
import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Zap, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const InternetRequirementsCard = ({ lang = 'tr' }) => {
  const isDe = lang === 'de';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-8 md:mb-12">
      {/* Internet Speed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#0a0a0a]/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group relative overflow-hidden w-full"
      >
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
        
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform relative z-10">
          <Wifi className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 relative z-10">
          {isDe ? "Internetgeschwindigkeit" : "İnternet Hızı"}
        </p>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 relative z-10">
          {isDe ? "Für 4K- und HD-Streams ist eine stabile Verbindung erforderlich." : "4K ve HD akışları için stabil bir bağlantı gereklidir."}
        </p>
        
        <ul className="space-y-2 relative z-10">
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>{isDe ? "Mindestens" : "Minimum"} <strong>16 Mbps</strong> {isDe ? "Download" : "İndirme"}</span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>{isDe ? "Ping-Zeit" : "Ping Süresi"} &lt; 50ms</span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{isDe ? "Hotspot/Mobile Daten nicht empfohlen" : "Hotspot/Mobil Veri Önerilmez"}</span>
          </li>
        </ul>
      </motion.div>

      {/* Connection Stability */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-[#0a0a0a]/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 group relative overflow-hidden w-full"
      >
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#141414]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#141414]/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform relative z-10">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 relative z-10">
          {isDe ? "Einfrierungslösungen" : "Donma Çözümleri"}
        </p>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 relative z-10">
          {isDe ? "Befolgen Sie diese Schritte, wenn Sie Ruckler erleben." : "Takılma yaşıyorsanız bu adımları izleyin."}
        </p>

        <ul className="space-y-2 relative z-10">
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{isDe ? "Modem für 10 Sek. ausschalten (IP zurücksetzen)" : "Modemi 10 Sn. kapatıp açın (IP Sıfırla)"}</span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{isDe ? "Kabelgebundene (Ethernet) Verbindung nutzen" : "Kablolu (Ethernet) Bağlantı Kullanın"}</span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{isDe ? "Hintergrund-Downloads stoppen" : "Arka Plan İndirmelerini Durdurun"}</span>
          </li>
        </ul>
      </motion.div>

      {/* VPN & Connection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-[#0a0a0a]/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 md:p-6 lg:p-8 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-300 group relative overflow-hidden w-full"
      >
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-amber-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform relative z-10">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 relative z-10">
          {isDe ? "Verbindungsabbrüche" : "Bağlantı Kesintileri"}
        </p>
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 relative z-10">
          {isDe ? "Beachten Sie dies, wenn häufig Verbindungsfehler auftreten." : "Sık sık bağlantı hatası alıyorsanız dikkat edin."}
        </p>

        <ul className="space-y-2 relative z-10">
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{isDe ? "VPN deaktivieren (falls aktiv)" : "VPN'i Devre Dışı Bırakın (Açıksa)"}</span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{isDe ? "DNS-Einstellungen auf automatisch setzen" : "DNS Ayarlarını Otomatik Olarak Ayarlayın"}</span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{isDe ? "Einen anderen Player (App) ausprobieren" : "Farklı Bir Oynatıcı (Uygulama) Deneyin"}</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default InternetRequirementsCard;
