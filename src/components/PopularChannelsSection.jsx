
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tv, RefreshCw, TrendingUp } from 'lucide-react';
import { useChannelsRealtime } from '@/hooks/useChannelsRealtime';
import { Button } from '@/components/ui/button';
import { getChannelImageUrl } from '@/utils/channelImageUtils';

const PopularChannelsSection = () => {
  const { channels, loading, error, refetch } = useChannelsRealtime();

  // Filter only active channels
  const activeChannels = useMemo(() => {
    return channels.filter(c => c.is_active !== false);
  }, [channels]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = activeChannels.map(c => c.category).filter(Boolean);
    return [...new Set(cats)];
  }, [activeChannels]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Canlı Güncellemeler</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Popüler IPTV Kanalları</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Kesintisiz yayın kalitesiyle binlerce ulusal ve uluslararası kanal</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg animate-pulse h-[280px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-red-950/20 border border-red-900/50 rounded-lg p-8 shadow-md">
            <p className="text-red-400 mb-4">Kanallar yüklenirken bir hata oluştu</p>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <Button onClick={refetch} className="bg-red-600 hover:bg-red-700 text-white">
              <RefreshCw className="w-4 h-4 mr-2" /> Tekrar Dene
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (activeChannels.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center bg-slate-900/50 border border-slate-800 rounded-lg p-12 shadow-md">
            <Tv className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Henüz aktif kanal bulunmuyor</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-[#0F0F1E] to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm shadow-lg shadow-purple-500/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
            <span className="text-sm font-medium text-purple-300">Premium İçerik</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            Popüler IPTV Kanalları
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Kesintisiz yayın kalitesiyle {activeChannels.length}+ ulusal ve uluslararası kanal. Her tarza uygun yüksek çözünürlüklü yayınlar.
          </motion.p>
        </div>

        {/* Premium Channels Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
          {activeChannels.map((channel, index) => {
            const bgImageUrl = getChannelImageUrl(channel.image_url, 'desktop', channel.category);
            
            return (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
                className="relative h-[280px] rounded-lg cursor-pointer overflow-hidden group shadow-md transition-shadow duration-300 hover:shadow-xl bg-slate-800"
              >
                {/* Full coverage background image */}
                <img 
                  src={bgImageUrl}
                  alt={channel.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-slate-900/50 backdrop-blur-lg border border-slate-800 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">
                <span className="font-bold text-white">{activeChannels.length}</span> Aktif Kanal
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-purple-400" />
              <span className="text-slate-300">
                <span className="font-bold text-white">{categories.length}</span> Kategori
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularChannelsSection;
