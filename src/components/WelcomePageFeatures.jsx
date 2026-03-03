import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Zap, Shield, Smartphone, Globe, Headphones } from 'lucide-react';

const features = [
  {
    icon: <Tv className="w-8 h-8" />,
    title: "Binlerce Kanal",
    description: "Ulusal ve uluslararası 10.000+ canlı kanal seçeneği ile asla sıkılmayın."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "4K & Full HD",
    description: "En yüksek görüntü kalitesinde donmadan, takılmadan izleme keyfi."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Tüm Cihazlarda",
    description: "Smart TV, Telefon, Tablet, Bilgisayar ve TV Box cihazlarında çalışır."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Güvenli Altyapı",
    description: "SSL korumalı güvenli bağlantı ve kesintisiz yayın sunucu altyapısı."
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Dünya Sineması",
    description: "Netflix, Exxen, BluTV gibi platformların en popüler içerikleri tek yerde."
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: "7/24 Destek",
    description: "Teknik sorunlarınızda anında WhatsApp üzerinden canlı destek hattı."
  }
];

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
          {feature.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const WelcomePageFeatures = () => {
  return (
    <section className="py-24 bg-[#0F0F1E] relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Neden <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">QruzeHD?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            Sadece bir TV yayını değil, komple bir eğlence platformu sunuyoruz. İşte bizi tercih etmeniz için birkaç neden.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WelcomePageFeatures;