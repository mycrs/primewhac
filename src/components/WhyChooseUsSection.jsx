import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, Zap } from 'lucide-react';

const reasons = [
  {
    icon: Users,
    title: "Uzman Ekip",
    desc: "Alanında deneyimli, profesyonel kadromuzla hizmetinizdeyiz.",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: Clock,
    title: "7/24 Destek",
    desc: "Günün her saati bize ulaşabilir, anında destek alabilirsiniz.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: CheckCircle,
    title: "Güvenilir Hizmet",
    desc: "Binlerce mutlu müşteri ile kanıtlanmış hizmet kalitesi.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Hızlı Çözüm",
    desc: "Sorunlarınıza anında müdahale ve kalıcı çözümler.",
    gradient: "from-amber-500 to-orange-500"
  }
];

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-purple-400 font-semibold tracking-wider text-sm uppercase mb-2 block">Avantajlarımız</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Neden Bizi Seçmelisiniz?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative group p-1 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm -z-10"
                   style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
              
              <div className="bg-slate-950 h-full rounded-xl p-6 text-center border border-slate-800 group-hover:border-transparent transition-colors relative z-10">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${item.gradient} p-0.5 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;