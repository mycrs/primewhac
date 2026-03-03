
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Rocket } from 'lucide-react';

const MissionVisionSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/20 transition-colors duration-500"></div>
            
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Misyonumuz</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Avrupa ve Türkiye'deki kullanıcılarımıza en yüksek kalitede, kesintisiz ve erişilebilir dijital yayıncılık deneyimi sunmak. Teknolojik altyapımızı sürekli güçlendirerek, müşteri memnuniyetini standartların ötesine taşımak ve sektörde güvenin simgesi olmak.
            </p>
            <ul className="space-y-3">
              {['Müşteri Odaklılık', 'Şeffaflık', 'Kalite Standartları'].map((item, index) => (
                <li key={index} className="flex items-center text-slate-300">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -ml-16 -mb-16 group-hover:bg-blue-600/20 transition-colors duration-500"></div>
            
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <Rocket className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Vizyonumuz</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Global ölçekte dijital yayıncılık teknolojilerine yön veren, yenilikçi çözümlerle sınırları kaldıran ve milyonlarca kullanıcıya ulaşan lider bir platform olmak. Geleceğin eğlence anlayışını bugünden inşa etmek.
            </p>
            <ul className="space-y-3">
              {['Global Erişim', 'Teknolojik Liderlik', 'Sürdürülebilir Büyüme'].map((item, index) => (
                <li key={index} className="flex items-center text-slate-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
