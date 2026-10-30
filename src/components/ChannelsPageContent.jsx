import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ListVideo, PlayCircle, ShieldCheck, MonitorPlay, Tv, Shield, Crown } from 'lucide-react';

const Highlight = ({ children, className = 'text-[#e50914] font-bold' }) => (
  <span className={className}>{children}</span>
);

const InfoCard = ({ title, content, icon: Icon, delay, gradientClass, borderClass, shadowClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className="group relative bg-[#0c0d12]/85 backdrop-blur-md p-7 md:p-8 rounded-2xl border border-white/10 hover:border-red-500/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.2)] hover:-translate-y-1 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-red-500/30 group-hover:scale-105 transition-all duration-300">
            <Icon className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
          </div>
          <h3 className="text-lg md:text-xl font-display font-bold text-white group-hover:text-red-400 transition-colors">
            {title}
          </h3>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base flex-grow font-light">
          {content}
        </p>
      </div>
    </motion.div>
  );
};

const ChannelsPageContent = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="iptv-quality-info" className="py-20 md:py-28 bg-[#07080b] relative overflow-hidden border-t border-white/5">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono font-medium text-slate-300 mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>YAYIN TEKNOLOJİSİ & MİMARİ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            Yayın Kalitesi ve Altyapı Ayrıcalıkları
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto rounded-full mb-4" />
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Kesintisiz ve en yüksek çözünürlükte yayın keyfi için altyapımızın sunduğu teknolojik standartları keşfedin.
          </p>
        </motion.div>

        {/* First original section - Intro */}
        <div className="mb-12">
          <motion.div variants={itemVariants} className="bg-[#0c0d12]/90 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-red-500">
              <Zap className="w-64 h-64" />
            </div>
            <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-4 relative z-10">
              Canlı IPTV Kanalları Nedir? – Gerçek Zamanlı Yayın Hizmetleri
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base relative z-10 font-light">
              Canlı IPTV kanalları, internet protokolü (IP) üzerinden televizyon yayınlarının dijital veri paketleri halinde cihazınıza aktarıldığı, modern ve esnek bir teknolojidir. Uydu çanakları veya kablolu TV altyapılarının aksine, sadece internet bağlantınızla 10.000+ kanal ve içeriğe eş zamanlı ulaşmanızı sağlar. Bu eşsiz gerçek zamanlı yayın hizmeti, izleyicilere mekân ve cihaz sınırlaması olmadan televizyon izleme özgürlüğü sunar. Akıllı telefonunuzdan, tabletinizden veya Smart TV'nizden aynı <Highlight>kaliteli iptv</Highlight> performansını elde edersiniz. Ayrıca, anlık veri akışı sayesinde gecikmeler minimize edilerek, ulusal ve global tüm <Highlight>hd iptv</Highlight> yayın içerikleri eş zamanlı olarak ekranınıza yansıtılır.
            </p>
          </motion.div>
        </div>

        {/* 5 Specific Subsections requested by user in a Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sub 1 */}
          <div className="lg:col-span-2">
            <InfoCard 
              title="4K IPTV Kanalları Avantajları – Ultra Yüksek Çözünürlük Deneyimi"
              content="4K IPTV kanalları, görüntü kalitesi açısından bir devrim niteliğindedir. 3840x2160 piksel çözünürlüğü ile sunulan bu yayınlar, her detayı kristal berraklığında gösterir. Canlı IPTV kanalları aracılığıyla spor maçlarını izlerken, oyuncuların yüz ifadelerini, topun hızını ve sahada olan her hareketi net bir şekilde görebilirsiniz. Film kanallarında ise, sinematik kalitede görüntü, filmlerin orijinal sanat yönetmeninin vizyonunu tam olarak yansıtır. Kaliteli IPTV hizmetleri, 4K IPTV kanalları sunabilmek için yüksek bant genişliği ve güçlü sunucu altyapısı gerektirir. En iyi IPTV servisi sağlayıcıları, bu teknolojiye yatırım yaparak, izleyicilere premium bir deneyim sunarlar. Donmayan IPTV teknolojisi ile birlikte, 4K çözünürlüğü hiç kesintiye uğramadan sunulur. Belgesel kanallarında doğanın güzelliğini, tarihi mekanları ve kültürel zenginlikleri 4K kalitesinde keşfetmek, izleyicileri büyüleyici bir yolculuğa çıkarır. Canlı IPTV kanalları sayesinde, dünyanın her yerinden yayınları, en yüksek kalitede izleyebilirsiniz."
              icon={MonitorPlay}
              delay={0.1}
              gradientClass="from-[#e50914]/10 to-transparent"
              borderClass="border-primary/30 group-hover:border-primary/60"
              shadowClass="hover:shadow-primary/20"
            />
          </div>

          {/* Sub 2 */}
          <InfoCard 
            title="HD IPTV Yayın Kalitesi – Keskin ve Net Görüntü"
            content="HD IPTV yayın, 1920x1080 piksel çözünürlüğü ile sunulan, geleneksel yayın kalitesinden çok daha üstün bir deneyimdir. Kaliteli IPTV hizmetleri, HD çözünürlüğü ile bile, izleyicilere mükemmel bir görüntü sunabilir. Canlı IPTV kanalları aracılığıyla haber bültenlerini, spor maçlarını ve film gösterimlerini HD kalitesinde izlemek, yeterince net ve keskin bir deneyim sağlar. Donmayan IPTV teknolojisi, HD IPTV yayın kalitesini stabil bir şekilde sunabilme yeteneğidir. En iyi IPTV servisi sağlayıcıları, HD çözünürlüğü ile bile, hiç donmayan, hiç kesintiye uğramayan yayınlar sunarlar. Bu, özellikle internet bant genişliği sınırlı olan bölgelerde ideal bir seçenektir."
            icon={Tv}
            delay={0.2}
            gradientClass="from-[#e50914]/10 to-transparent"
            borderClass="border-blue-500/30 group-hover:border-blue-500/60"
            shadowClass="hover:shadow-blue-500/20"
          />

          {/* Sub 3 */}
          <InfoCard 
            title="Spor, Film ve Belgesel Kanallarında Ultra Net Görüntü"
            content="Spor kanallarında 4K IPTV kanalları ve HD IPTV yayın kalitesi, izleyicilere tamamen farklı bir deneyim sunar. Futbol maçlarında, her pas, her şut net bir şekilde görülür. Tenis turnuvalarında, topun hızını 4K çözünürlüğü ile izlemek heyecanı artırır. Film kanallarında, sinematik kalitede görüntü sunar. Renk tonları, ışık-gölge oyunları ve detaylar, 4K çözünürlüğü ile tam olarak yansıtılır. Belgesel kanallarında ise, doğanın güzelliğini, hayvanların hareketlerini, tarihi mekanları 4K kalitesinde keşfetmek, izleyicileri eğitici ve etkileyici bir yolculuğa çıkarır. Donmayan IPTV teknolojisi, bu yüksek kaliteli yayınları kesintisiz sunar."
            icon={PlayCircle}
            delay={0.3}
            gradientClass="from-[#e50914]/10 to-transparent"
            borderClass="border-pink-500/30 group-hover:border-pink-500/60"
            shadowClass="hover:shadow-pink-500/20"
          />

          {/* Sub 4 */}
          <InfoCard 
            title="Donmayan IPTV ile Yüksek Çözünürlük Deneyimi"
            content="Donmayan IPTV, yüksek çözünürlüklü yayınları kesintisiz bir şekilde sunabilme teknolojisidir. En iyi IPTV servisi sağlayıcıları, güçlü sunucu altyapısı, gelişmiş veri sıkıştırma teknolojileri ve akıllı ağ yönetimi kullanarak, 4K IPTV kanalları ve HD IPTV yayın kalitesini hiç donmadan iletir. Canlı IPTV kanalları aracılığıyla spor maçlarını izlerken, donmayan IPTV teknolojisi kritik önem taşır. Maçın heyecan anlarında, yayın donması izleyicilerin deneyimini bozar. En iyi IPTV servisi, bu sorunları minimize ederek, kesintisiz bir yayın sunar. 4K IPTV kanalları ve HD IPTV yayın kalitesi, donmayan IPTV teknolojisi olmadan tam potansiyelini gösteremez."
            icon={ShieldCheck}
            delay={0.4}
            gradientClass="from-[#e50914]/10 to-transparent"
            borderClass="border-[#e50914]/30 group-hover:border-[#e50914]/60"
            shadowClass="hover:shadow-emerald-500/20"
          />

          {/* Sub 5 */}
          <InfoCard 
            title="Geniş Kanal Yelpazesi ve Üst Düzey İzleme Deneyimi"
            content="Üst düzey IPTV hizmeti, sadece yüksek çözünürlük sunmakla kalmaz, aynı zamanda geniş bir kanal yelpazesi de sağlar. Spor, film, belgesel, haber, eğitim, müzik ve daha birçok kategoride yüzlerce kanal, 4K ve HD kalitesinde sunulur. Bu çeşitlilik, her yaş grubundan ve her ilgi alanından izleyicilerin, kendi tercihlerine uygun içeriği bulmasını sağlar. En iyi IPTV servisi, teknolojik üstünlüğün yanı sıra, kullanıcı deneyimini de ön planda tutar. Kolay navigasyon, hızlı kanal değiştirme, kayıt özelliği ve çoklu cihaz desteği, bu hizmetin temel bileşenleridir. Donmayan IPTV ile birlikte bu özellikler, izleyicilere tam bir kontrol ve esneklik sağlar."
            icon={Crown}
            delay={0.5}
            gradientClass="from-orange-600/10 to-transparent"
            borderClass="border-orange-500/30 group-hover:border-orange-500/60"
            shadowClass="hover:shadow-orange-500/20"
          />

        </div>
      </motion.div>
    </section>
  );
};

export default ChannelsPageContent;