import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Radio, Check } from 'lucide-react';

const MissionVisionSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="mission-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Neden Yola Çıktık (Misyon) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-8 md:p-10 flex flex-col justify-between hover:border-primary/30 transition-all shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
                <Compass className="w-6 h-6" />
              </div>
              
              <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2 font-mono">
                Başlangıç Noktamız
              </span>
              <h2 id="mission-heading" className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                Memleket Sesini Evinizde Yaşatmak
              </h2>
              <p className="text-slate-300 text-base leading-relaxed font-light mb-6">
                Avrupa&apos;daki Türk aileleri için televizyon; anadili çocuklara aktarmanın, milli maçlarda tek yürek olmanın ve Türkiye gündemini anbean takip etmenin en samimi yoludur. Amatör, derbi saatinde kilitlenen yayınların yaşattığı hayal kırıklıklarına son vermek için yola çıktık.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/5">
              {[
                'Derbi ve prime-time saatlerinde tamponlamasız akış',
                'Açık ve taahhütsüz şeffaf fiyatlandırma',
                'Her yaşa hitap eden pedagojik aile ve kültür seçkisi'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-light">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nereye İlerliyoruz (Vizyon) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#08080a] p-8 md:p-10 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 text-amber-400">
                <Radio className="w-6 h-6" />
              </div>
              
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2 font-mono">
                Gelecek Hedefimiz
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                Avrupa Standartlarında Bağımsız Yayın Teknolojisi
              </h2>
              <p className="text-slate-300 text-base leading-relaxed font-light mb-6">
                Yayın altyapımızı üçüncü parti belirsiz sunucular yerine; doğrudan Frankfurt (DE-CIX) ve Amsterdam (AMS-IX) ana internet değişim noktalarındaki dedike CDN kümeleriyle güçlendirerek, izleyicimize dünya standartlarında kesintisiz bir deneyim sunmak.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/5">
              {[
                'Düşük gecikmeli Low Latency HLS/DASH akış protokolü',
                'H.265 / HEVC ile 60 FPS pürüzsüz hareket netliği',
                'Tek noktadan kumanda ile yönetilebilen açık oynatıcı uyumu'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-light">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
