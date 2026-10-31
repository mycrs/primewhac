import React from 'react';
import { motion } from 'framer-motion';
import { Zap, MonitorPlay, Tv, PlayCircle, ShieldCheck, Crown } from 'lucide-react';

const Highlight = ({ children, className = 'text-[#e50914] font-semibold' }) => (
  <span className={className}>{children}</span>
);

const InfoCard = ({ title, content, icon: Icon, delay, gradientClass, borderClass, shadowClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={`group relative bg-[#0c0d12]/85 backdrop-blur-md p-7 md:p-8 rounded-2xl border ${borderClass} transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${shadowClass} hover:-translate-y-1 overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
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
            Yüksek bit hızı, akıllı veri sıkıştırma ve küresel Anycast CDN omurgasıyla donatılmış yeni nesil akış altyapımızı keşfedin.
          </p>
        </motion.div>

        {/* First section - Intro */}
        <div className="mb-12">
          <motion.div variants={itemVariants} className="bg-[#0c0d12]/90 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-red-500">
              <Zap className="w-64 h-64" />
            </div>
            <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-4 relative z-10">
              Yeni Nesil Dijital Yayın Mimarisi Nasıl Çalışır?
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base relative z-10 font-light">
              Geleneksel uydu çanaklarının veya kablolu hatların yarattığı hava muhalefeti ve sinyal kayıplarının aksine, modern dijital akış teknolojisi yayın paketlerini yüksek hızlı fiber optik omurgalar üzerinden cihazınıza ulaştırır. <Highlight>QruzeTV altyapısı</Highlight>, 10.000&apos;den fazla canlı televizyon kanalını ve geniş VOD kütüphanesini tek bir arayüzde birleştirir. Smart TV, Android TV, Apple TV veya telefonunuzdan izlerken sunucu ile cihazınız arasında doğrudan kurulan 256-bit şifreli bağlantı, gecikmeleri asgari düzeye indirerek stadyum ve sinema salonu atmosferini evinize taşır.
            </p>
          </motion.div>
        </div>

        {/* 5 Distinct Cards with Polish and No Robotic Repetition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sub 1 */}
          <div className="lg:col-span-2">
            <InfoCard 
              title="4K Ultra HD Yayın Standartları – Gerçekçi Detay ve 60 FPS Akıcılık"
              content="3840x2160 piksel çözünürlükle aktarılan 4K yayınlar, geleneksel televizyonculuğun ötesinde sinematik bir derinlik sunar. Canlı spor müsabakalarında çimdeki her hareket, oyuncuların yüz ifadeleri ve topun saliseler içindeki yön değişimi 60 kare/saniye akıcılığıyla netleşir. H.265 (HEVC) kodlama mimarimiz, yüksek renk derinliğini ve HDR10+ kontrastını korurken aşırı internet tüketimini dengeler; böylece 4K kalitesi donma yaşamadan ekranınıza yansır."
              icon={MonitorPlay}
              delay={0.1}
              gradientClass="from-[#e50914]/10 to-transparent"
              borderClass="border-primary/30 hover:border-primary/60"
              shadowClass="hover:shadow-primary/20"
            />
          </div>

          {/* Sub 2 */}
          <InfoCard 
            title="Full HD & Kararlı Akış – Düşük Bant Genişliğinde Üstün Performans"
            content="1080p Full HD yayınlarımız, kristal netliğinde görüntü sağlarken ev internetinizin veya mobil bağlantınızın hız dalgalanmalarına anında uyum sağlar. Akıllı adaptif bitrate teknolojisi sayesinde 12-16 Mbps gibi ortalama internet hızlarında dahi yayın akışı kesilmeden stabil bir şekilde devam eder."
            icon={Tv}
            delay={0.2}
            gradientClass="from-blue-600/10 to-transparent"
            borderClass="border-blue-500/30 hover:border-blue-500/60"
            shadowClass="hover:shadow-blue-500/20"
          />

          {/* Sub 3 */}
          <InfoCard 
            title="Spor, Sinema ve Belgesel Odaklı Tematik Akışlar"
            content="Süper Lig derbilerinden UEFA Şampiyonlar Ligi'ne, Premier Lig'den Formula 1'e kadar tüm uluslararası spor organizasyonları özel yüksek hızlı yayın beslemeleriyle aktarılır. Sinema ve belgesel kanallarında ise orijinal dil seçenekleri, çok dilli altyazı desteği ve Dolby Digital ses formatı eşlik eder."
            icon={PlayCircle}
            delay={0.3}
            gradientClass="from-pink-600/10 to-transparent"
            borderClass="border-pink-500/30 hover:border-pink-500/60"
            shadowClass="hover:shadow-pink-500/20"
          />

          {/* Sub 4 */}
          <InfoCard 
            title="Anycast CDN ve Frankfurt/Amsterdam Doğrudan Peering"
            content="Yayın donmalarının temel sebebi yetersiz sunucu bant genişliğidir. QruzeTV; Avrupa'nın ana internet değişim noktaları (DE-CIX Frankfurt ve AMS-IX Amsterdam) ile doğrudan fiber peering bağlantısına sahiptir. Yüz binlerce izleyicinin aynı anda derbi izlediği yoğun saatlerde bile yük dengeleme algoritmaları trafiği en yakın düğüme yönlendirir."
            icon={ShieldCheck}
            delay={0.4}
            gradientClass="from-emerald-600/10 to-transparent"
            borderClass="border-emerald-500/30 hover:border-emerald-500/60"
            shadowClass="hover:shadow-emerald-500/20"
          />

          {/* Sub 5 */}
          <InfoCard 
            title="Akıllı EPG Rehberi ve 0.5 Saniyenin Altında Kanal Geçişi (Zap Hızı)"
            content="Gelişmiş kanal mimarimiz, kanal değiştirme gecikmesini (zap süresi) 0.5 saniyenin altına indirir. Güncel Elektronik Program Rehberi (EPG) ile hangi yayının ne zaman başlayacağını kolayca görebilir, favori listelerinizi dilediğiniz gibi düzenleyerek televizyon izleme konforunuzu kişiselleştirebilirsiniz."
            icon={Crown}
            delay={0.5}
            gradientClass="from-amber-600/10 to-transparent"
            borderClass="border-amber-500/30 hover:border-amber-500/60"
            shadowClass="hover:shadow-amber-500/20"
          />

        </div>
      </motion.div>
    </section>
  );
};

export default ChannelsPageContent;
