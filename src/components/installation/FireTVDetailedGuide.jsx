
import React from 'react';
import { Search, Download, Power, Tv } from 'lucide-react';

const FireTVDetailedGuide = ({ lang = 'tr' }) => {
  const isDe = lang === 'de';

  const steps = [
    {
      title: isDe ? "Appstore öffnen" : "Appstore'u Açın",
      icon: <Tv className="w-5 h-5" />,
      desc: isDe 
        ? "Gehen Sie auf dem Fire TV-Startbildschirm zur Registerkarte 'Find' (Suchen) oder drücken Sie die Sprachbefehlstaste auf der Fernbedienung." 
        : "Fire TV ana ekranında 'Bul' sekmesine gidin veya kumandadaki sesli komut düğmesine basın."
    },
    {
      title: isDe ? "Downloader suchen" : "Downloader'ı Arayın",
      icon: <Search className="w-5 h-5" />,
      desc: isDe 
        ? "Geben Sie 'Downloader' in das Suchfeld ein. Finden Sie die App mit dem orangefarbenen Symbol." 
        : "Arama kutusuna 'Downloader' yazın. Turuncu simgeli uygulamayı bulun."
    },
    {
      title: isDe ? "Herunterladen (Get)" : "İndirin (Al)",
      icon: <Download className="w-5 h-5" />,
      desc: isDe 
        ? "Klicken Sie auf 'Get' oder 'Download', um die App auf Ihr Gerät herunterzuladen." 
        : "Uygulamayı cihazınıza indirmek için 'Al' veya 'İndir'e tıklayın."
    },
    {
      title: isDe ? "Berechtigungen erteilen" : "İzinleri Verin",
      icon: <Power className="w-5 h-5" />,
      desc: isDe 
        ? "Gehen Sie zu Einstellungen > Mein Fire TV > Entwickleroptionen und aktivieren Sie 'Unbekannte Apps installieren' für Downloader." 
        : "Ayarlar > Fire TV'm > Geliştirici Seçenekleri'ne gidin ve Downloader için 'Bilinmeyen Uygulamaları Yükle'yi etkinleştirin."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />
      
      <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
            <Tv className="w-6 h-6" />
        </span>
        {isDe ? "Amazon Fire TV Anleitung" : "Amazon Fire TV Kılavuzu"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group">
            {/* Connector Line */}
            {idx !== steps.length - 1 && (
              <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-slate-800 -z-10" />
            )}
            
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl h-full hover:border-orange-500/30 transition-colors shadow-lg hover:shadow-orange-900/10">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4 font-bold text-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                {idx + 1}
              </div>
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                {step.icon}
                {step.title}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default FireTVDetailedGuide;
