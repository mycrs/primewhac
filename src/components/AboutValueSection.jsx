import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Shield, Zap } from 'lucide-react';

const values = [
  {
    id: 1,
    title: 'Deneyim',
    icon: Briefcase,
    description: 'Sektördeki 10 yılı aşkın tecrübemizle, kullanıcılarımızın ihtiyaçlarını en iyi şekilde analiz ediyor ve en doğru çözümleri sunuyoruz. Geçmişten gelen bilgi birikimimizi geleceğin teknolojisiyle harmanlıyoruz.',
    color: 'from-[#e50914] to-[#b20710]',
    shadow: 'shadow-blue-500/20',
    delay: 0.1
  },
  {
    id: 2,
    title: 'Güvenilirlik',
    icon: Shield,
    description: 'Müşteri memnuniyeti ve veri güvenliği bizim için her şeyden önce gelir. Güçlü altyapımız ve şeffaf hizmet politikamızla, size her zaman söz verdiğimiz kaliteyi ve güveni sunmayı taahhüt ediyoruz.',
    color: 'from-[#e50914] to-[#b20710]',
    shadow: 'shadow-primary/20',
    delay: 0.2
  },
  {
    id: 3,
    title: 'İnovasyon',
    icon: Zap,
    description: 'Teknoloji dünyasındaki gelişmeleri yakından takip ediyor, altyapımızı sürekli güncelliyoruz. En yeni yayın teknolojilerini ve modern çözümleri sistemimize entegre ederek, her zaman bir adım önde olmanızı sağlıyoruz.',
    color: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/20',
    delay: 0.3
  }
];

const AboutValueSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0a0a0a] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0a0a0a] to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-3 block">Değerlerimiz</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Mükemmelliği Hedefleyen <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#141414]">Standartlarımız</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Hizmet kalitemizi belirleyen temel prensiplerimizle, size sadece bir yayın değil, kusursuz bir deneyim sunuyoruz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              className={`relative group p-1 rounded-2xl bg-gradient-to-b from-[#0a0a0a] to-[#141414] hover:from-[#0a0a0a] hover:to-[#141414] transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                   style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} 
              />
              
              <div className="h-full bg-[#0a0a0a] rounded-xl p-8 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300 border border-slate-800 group-hover:border-slate-700">
                {/* Glow Effect */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${item.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full pointer-events-none`} />

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-8 shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center backface-hidden">
                    <item.icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br ${item.color} stroke-current`} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#141414] transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValueSection;