import React, { useState } from 'react';
import EarningsCalculator from './EarningsCalculator';
import PackagePresets from './PackagePresets';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, CheckCircle2, Rocket } from 'lucide-react';

const ResellerCalculatorSection = () => {
  const [users, setUsers] = useState(50);
  const [avgPrice, setAvgPrice] = useState(1300);
  const [commission, setCommission] = useState(25);

  const handlePresetSelect = (preset) => {
    setUsers(preset.users);
    setAvgPrice(preset.price);
    setCommission(preset.rate);
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px]"></div>
        </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e50914] via-pink-500 to-[#b20710] animate-gradient-x">
              Gelir Hesaplayıcı
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Kaç kazanabileceğinizi hesaplayın. Kullanıcı sayısı, paket fiyatı ve komisyon oranınızı ayarlayarak aylık ve yıllık gelir potansiyelinizi görebilirsiniz.
          </p>
        </motion.div>

        {/* Colorful SEO Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-16 md:mb-24 max-w-6xl mx-auto">
          {/* Paragraph 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-[#e50914]/10 to-[#b20710]/10 p-6 md:p-8 rounded-3xl border-2 border-primary/30 transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_rgba(229,9,20,0.2)] flex items-start gap-5 group"
          >
            <div className="p-4 rounded-2xl bg-primary/20 text-primary flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#e50914] group-hover:to-[#b20710] group-hover:text-white transition-all duration-300 shadow-inner">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">IPTV Bayilik Nedir?</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                IPTV bayilik, herhangi bir teknik altyapı veya sunucu kurulumu gerektirmeden, gelişmiş sistemlerimizi kullanarak kendi müşterilerinize dijital yayın hizmeti sunmanızı sağlayan kârlı bir iş modelidir. Kendi markanızı oluşturarak saniyeler içinde satışa başlayabilirsiniz.
              </p>
            </div>
          </motion.div>

          {/* Paragraph 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-[#e50914]/10 to-[#b20710]/10 p-6 md:p-8 rounded-3xl border-2 border-blue-500/30 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-start gap-5 group"
          >
            <div className="p-4 rounded-2xl bg-[#141414]/20 text-blue-400 flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#e50914] group-hover:to-[#b20710] group-hover:text-white transition-all duration-300 shadow-inner">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">Neden IPTV Bayilik?</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                Dijital içerik tüketimi her geçen gün hızla artıyor. Bu devasa pazarda, sıfır stok maliyeti ve düşük sermaye ile yerinizi alabilirsiniz. Dünyanın her yerindeki kullanıcılara ulaşabilme imkanı ve esnek çalışma koşulları, bu işi geleceğin en parlak girişimlerinden biri yapıyor.
              </p>
            </div>
          </motion.div>

          {/* Paragraph 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-[#e50914]/10 to-[#b20710]/10 p-6 md:p-8 rounded-3xl border-2 border-[#e50914]/30 transition-all duration-300 hover:scale-105 hover:border-[#e50914] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-start gap-5 group"
          >
            <div className="p-4 rounded-2xl bg-[#e50914]/20 text-[#e50914] flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-[#e50914] group-hover:to-[#b20710] group-hover:text-white transition-all duration-300 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">IPTV Bayilik Avantajları</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                Kendi fiyat politikanızı özgürce belirleyebilir, yüksek kâr marjları (%100 - %300) ile kazancınızı maksimize edebilirsiniz. Kargo veya depo gibi fiziksel dertleriniz olmaz. Gelişmiş panelimiz üzerinden müşterilerinizi anlık olarak yönetir, abonelikleri kolayca kontrol edersiniz.
              </p>
            </div>
          </motion.div>

          {/* Paragraph 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 p-6 md:p-8 rounded-3xl border-2 border-orange-500/30 transition-all duration-300 hover:scale-105 hover:border-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] flex items-start gap-5 group"
          >
            <div className="p-4 rounded-2xl bg-orange-500/20 text-orange-400 flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-yellow-500 group-hover:text-white transition-all duration-300 shadow-inner">
              <Rocket className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight">Nasıl Başlanır?</h3>
              <p className="text-slate-300 leading-relaxed font-medium">
                Sisteme dahil olmak son derece hızlı ve basittir. Bütçenize en uygun başlangıç paketini seçtikten sonra size özel paneliniz anında aktif edilir. Teknik bilgi gerektirmeyen bu sistemde, dakikalar içinde test yayınları açabilir ve hemen satış yapmaya başlayabilirsiniz.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Calculator and Presets Section */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Left Column: Calculator */}
          <div className="lg:col-span-7">
            <EarningsCalculator 
              users={users} 
              setUsers={setUsers}
              avgPrice={avgPrice}
              setAvgPrice={setAvgPrice}
              commission={commission}
              setCommission={setCommission}
            />
          </div>

          {/* Right Column: Presets */}
          <div className="lg:col-span-5 h-full">
            <div className="h-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl flex flex-col justify-center">
              <PackagePresets 
                onSelectPreset={handlePresetSelect}
                currentValues={{ users, avgPrice, commission }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResellerCalculatorSection;