import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-[#e50914] via-[#e50914] to-[#b20710] h-full"
  >
    {/* Semi-transparent white overlay */}
    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />
    
    {/* Glassmorphism shine effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />
    
    <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-8 h-full min-h-[180px]">
      {/* Icon - Reduced size as requested (32-40px range) */}
      <div className="mb-4 p-3 rounded-full bg-white/10 backdrop-blur-sm shadow-inner ring-1 ring-white/20">
        <span className="text-3xl filter drop-shadow-sm leading-none block transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
      </div>
      
      {/* Number - Large and prominent */}
      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md mb-2">
        {value?.toLocaleString('tr-TR') || '0'}
        <span className="text-2xl opacity-80 ml-0.5 font-bold">+</span>
      </h3>
      
      {/* Label */}
      <p className="text-sm font-bold text-blue-50 uppercase tracking-widest opacity-90 text-center">
        {label}
      </p>
    </div>
  </motion.div>
);

const ContentStatsSection = ({ siteData }) => {
  const stats = useMemo(() => {
    if (!siteData) return { films: 0, series: 0, live: 0, popular: 0 };

    const getBase = (id) => siteData.contentStats?.find(s => s.id === id)?.baseNumber || 0;

    const realMovies = siteData.moviesData?.length || 0;
    const realChannels = siteData.channelsData?.length || 0;
    
    const realPackages = [
      ...(siteData.packagesData?.turkiye || []),
      ...(siteData.packagesData?.avrupa || [])
    ].length;

    const popularPackages = [
        ...(siteData.packagesData?.turkiye || []),
        ...(siteData.packagesData?.avrupa || [])
    ].filter(p => p.popular).length;
    
    const popularApps = (siteData.appsData || []).filter(a => a.recommended).length;
    
    return {
      films: getBase('films') + realMovies,
      series: getBase('series') + realPackages,
      live: getBase('channels') + realChannels,
      popular: (getBase('users') / 10) + popularPackages + popularApps
    };
  }, [siteData]);

  const displayStats = {
      ...stats,
      popular: Math.max(stats.popular, 150) 
  };

  const statItems = [
    {
      id: 'films',
      icon: '🎬',
      label: 'Film',
      value: displayStats.films,
      delay: 0.1
    },
    {
      id: 'series',
      icon: '📺',
      label: 'Dizi',
      value: displayStats.series,
      delay: 0.2
    },
    {
      id: 'live',
      icon: '📡',
      label: 'Canlı Yayın',
      value: displayStats.live,
      delay: 0.3
    },
    {
      id: 'popular',
      icon: '⭐',
      label: 'Popüler',
      value: displayStats.popular,
      delay: 0.4
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#0a0a0a] relative z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {statItems.map((item) => (
            <StatCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ContentStatsSection);