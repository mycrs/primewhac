
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Crown, Gem, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const presets = [
  {
    id: 'beginner',
    title: 'Başlangıç',
    desc: 'Yeni başlayanlar için ideal',
    icon: Rocket,
    users: 50,
    price: 1300,
    rate: 25,
    stats: '50 Müşteri, %25 Komisyon',
    styles: {
      bg: 'from-purple-500/10 to-pink-500/10',
      activeBg: 'from-purple-500/30 to-pink-500/30',
      border: 'border-purple-500/30',
      activeBorder: 'border-purple-400',
      hoverBorder: 'hover:border-purple-400/60',
      shadow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      iconBg: 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white',
      activeIconBg: 'bg-purple-500 text-white',
      indicator: 'text-purple-400'
    }
  },
  {
    id: 'growth',
    title: 'Büyüme',
    desc: 'Hızla büyüyen bayiler için',
    icon: Zap,
    users: 150,
    price: 1300,
    rate: 30,
    stats: '150 Müşteri, %30 Komisyon',
    styles: {
      bg: 'from-orange-500/10 to-yellow-500/10',
      activeBg: 'from-orange-500/30 to-yellow-500/30',
      border: 'border-orange-500/30',
      activeBorder: 'border-orange-400',
      hoverBorder: 'hover:border-orange-400/60',
      shadow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
      iconBg: 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white',
      activeIconBg: 'bg-orange-500 text-white',
      indicator: 'text-orange-400'
    }
  },
  {
    id: 'pro',
    title: 'Profesyonel',
    desc: 'Yüksek hacimli satışlar',
    icon: Crown,
    users: 300,
    price: 1300,
    rate: 35,
    stats: '300 Müşteri, %35 Komisyon',
    styles: {
      bg: 'from-blue-500/10 to-cyan-500/10',
      activeBg: 'from-blue-500/30 to-cyan-500/30',
      border: 'border-blue-500/30',
      activeBorder: 'border-blue-400',
      hoverBorder: 'hover:border-blue-400/60',
      shadow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      iconBg: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white',
      activeIconBg: 'bg-blue-500 text-white',
      indicator: 'text-blue-400'
    }
  },
  {
    id: 'elite',
    title: 'Elit',
    desc: 'Maksimum gelir hedefi',
    icon: Gem,
    users: 500,
    price: 1300,
    rate: 40,
    stats: '500 Müşteri, %40 Komisyon',
    styles: {
      bg: 'from-emerald-500/10 to-teal-500/10',
      activeBg: 'from-emerald-500/30 to-teal-500/30',
      border: 'border-emerald-500/30',
      activeBorder: 'border-emerald-400',
      hoverBorder: 'hover:border-emerald-400/60',
      shadow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      iconBg: 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
      activeIconBg: 'bg-emerald-500 text-white',
      indicator: 'text-emerald-400'
    }
  }
];

const PackagePresets = ({ 
  onSelectPreset, 
  currentValues,
  title = "Hızlı Senaryolar"
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1.5 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
        <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
      </div>
      
      <div className="grid gap-4">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isActive = currentValues.users === preset.users && 
                           currentValues.commission === preset.rate;
          const s = preset.styles;

          return (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPreset(preset)}
              className={cn(
                "w-full flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group bg-gradient-to-br",
                isActive 
                  ? `${s.activeBg} ${s.activeBorder} shadow-lg` 
                  : `${s.bg} ${s.border} ${s.hoverBorder} ${s.shadow}`
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300",
                isActive ? s.activeIconBg : s.iconBg
              )}>
                <Icon className="w-7 h-7" />
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-white text-lg">{preset.title}</h4>
                  {isActive && <Check className={`w-5 h-5 ${s.indicator}`} />}
                </div>
                <p className="text-slate-300 text-sm font-medium mb-1">{preset.desc}</p>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-950/40 inline-block px-2 py-1 rounded-md">
                  {preset.stats}
                </div>
              </div>

              <ChevronRight className={cn(
                "w-6 h-6 transition-transform duration-300",
                isActive ? `${s.indicator} translate-x-1` : "text-slate-500 group-hover:text-slate-300"
              )} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PackagePresets;
