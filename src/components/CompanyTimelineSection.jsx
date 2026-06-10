import React from 'react';
import { motion } from 'framer-motion';
import { Flag, TrendingUp, Globe2, Award } from 'lucide-react';

const timelineData = [
  {
    year: "2019",
    title: "Kuruluş",
    desc: "QruzeTV, premium IPTV hizmeti sunmak amacıyla küçük ama tutkulu bir ekip tarafından kuruldu.",
    icon: Flag,
    align: "left"
  },
  {
    year: "2020",
    title: "İlk 1000 Müşteri",
    desc: "Kaliteli hizmet anlayışımız sayesinde kısa sürede 1000 aktif kullanıcıya ulaştık.",
    icon: TrendingUp,
    align: "right"
  },
  {
    year: "2021",
    title: "Uluslararası Genişleme",
    desc: "Altyapımızı güçlendirerek Avrupa başta olmak üzere global pazara açıldık.",
    icon: Globe2,
    align: "left"
  },
  {
    year: "2023",
    title: "10,000+ Mutlu Kullanıcı",
    desc: "Sektörün öncü markalarından biri haline geldik ve büyümemizi sürdürüyoruz.",
    icon: Award,
    align: "right"
  }
];

const CompanyTimelineSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Yolculuğumuz</h2>
          <p className="text-slate-400">Başarılarla dolu geçmişimiz ve geleceğe olan yolculuğumuz.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#e50914]/0 via-[#e50914]/50 to-[#b20710]/0 hidden md:block"></div>
          
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center justify-between gap-8 ${
                  item.align === 'left' ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Empty Space for alignment */}
                <div className="w-full md:w-5/12 hidden md:block" />

                {/* Center Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#0a0a0a] border-4 border-slate-800 z-10 hidden md:flex">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-5/12 relative">
                  <div className={`bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-primary/30 transition-colors duration-300 relative`}>
                    {/* Mobile Icon */}
                    <div className="md:hidden absolute -top-6 left-6 w-12 h-12 bg-[#0a0a0a] border-4 border-slate-800 rounded-full flex items-center justify-center text-primary">
                      <item.icon className="w-5 h-5" />
                    </div>

                    <span className="text-primary font-bold text-xl block mb-2 mt-4 md:mt-0">{item.year}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimelineSection;