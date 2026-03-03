import React, { memo } from 'react';
import { ShieldCheck, Zap, Tv, Headphones as Headset } from 'lucide-react';

const WhyChooseUsSectionDE = () => {
  const features = [
    { icon: Zap, title: "Stabile Verbindung", desc: "Keine Unterbrechungen dank leistungsstarker Server." },
    { icon: Tv, title: "Full HD & 4K Qualität", desc: "Genießen Sie kristallklare Bildqualität auf allen Kanälen." },
    { icon: ShieldCheck, title: "Sichere Zahlung", desc: "100% sichere und verschlüsselte Zahlungsmöglichkeiten." },
    { icon: Headset, title: "24/7 Support", desc: "Unser Support-Team steht Ihnen jederzeit zur Verfügung." }
  ];

  return (
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
        Warum <span className="text-purple-500">Uns Wählen?</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors">
            <f.icon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WhyChooseUsSectionDE);