import React from 'react';
import { Tv, Film, Monitor, Users, Globe, Server } from 'lucide-react';
import { defaultData } from '@/data/defaultSiteData';

const Stats = ({ statsData = defaultData.statsData }) => {
  const statIcons = {
    "CANLI TV KANALI": Tv,
    "VOD FİLM ARŞİVİ": Film,
    "DİZİ ARŞİVİ": Monitor,
    "MUTLU MÜŞTERİ": Users,
    "ÜLKE DESTEĞİ": Globe,
    "UPTIME": Server
  };

  const stats = Array.isArray(statsData) ? statsData : [];

  return (
    <section className="py-16 bg-slate-900 border-y border-slate-800 relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="absolute inset-0 bg-purple-900/5 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = statIcons[stat.label] || Tv;
            return (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-800/50 transition-colors duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] transition-all duration-300">
                    <Icon className="w-8 h-8 text-purple-500 group-hover:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-4xl font-black text-white mb-2 tracking-tight group-hover:text-purple-100 transition-colors">
                  {/* Static rendering for LCP optimization - no progressive counting on initial load */}
                  {new Intl.NumberFormat("en-US").format(stat.baseNumber || 0)}+
                </h3>
                <p className="text-sm font-bold text-gray-500 tracking-widest uppercase group-hover:text-purple-400 transition-colors">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;