
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const stories = [
  {
    name: "Ahmet K.",
    role: "Premium Üye",
    quote: "Yıllardır farklı IPTV hizmetleri denedim ama QruzeHD gibisini görmedim. Donma yok, görüntü kalitesi harika ve destek ekibi çok ilgili.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    name: "Mehmet Y.",
    role: "VIP Üye",
    quote: "Kurulumu çok kolaydı, rehberler sayesinde 5 dakikada hallettim. Maç yayınlarındaki performans gerçekten etkileyici.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    name: "Ayşe T.",
    role: "Standart Üye",
    quote: "Film ve dizi arşivi çok geniş. Aradığım her şeyi bulabiliyorum. Çocuk kanalları da çok çeşitli, ailece memnunuz.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
  }
];

const SuccessStoriesSection = () => {
  return (
    <section className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Müşteri Yorumları</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Kullanıcılarımızın deneyimleri bizim en büyük referansımızdır.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-950 p-8 rounded-2xl border border-slate-800 relative hover:-translate-y-2 transition-transform duration-300"
            >
              <Quote className="w-10 h-10 text-purple-500/20 absolute top-6 right-6" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700">
                  <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{story.name}</h3>
                  <span className="text-purple-400 text-xs uppercase tracking-wide">{story.role}</span>
                </div>
              </div>
              
              <p className="text-slate-300 italic leading-relaxed">
                "{story.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
