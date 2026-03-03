import React from 'react';
import { motion } from 'framer-motion';
import { Download, Headphones, Smartphone, Shield } from 'lucide-react';

const services = [
  {
    icon: Download,
    title: "Kurulum Rehberi",
    desc: "Her cihaz için adım adım, kolay anlaşılır görsel kurulum rehberleri ile yayınınız dakikalar içinde hazır.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    delay: 0
  },
  {
    icon: Headphones,
    title: "Teknik Destek",
    desc: "Karşılaşabileceğiniz her türlü teknik sorun için 7/24 aktif, çözüm odaklı uzman destek ekibi.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    delay: 0.1
  },
  {
    icon: Smartphone,
    title: "Cihaz Uyumluluğu",
    desc: "Smart TV, Android, iOS, Windows ve daha fazlası. Tüm platformlarda sorunsuz çalışma garantisi.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    delay: 0.2
  },
  {
    icon: Shield,
    title: "Güvenlik & Gizlilik",
    desc: "Verileriniz bizimle güvende. SSL şifreleme ve gelişmiş güvenlik protokolleri ile tam koruma.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    delay: 0.3
  }
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Hizmetlerimiz</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;