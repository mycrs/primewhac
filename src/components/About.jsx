
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Users, Award } from 'lucide-react';

const About = ({ data }) => {
  if (!data) return null;

  const features = data.features || [];
  
  const defaultImage = "https://images.unsplash.com/photo-1554224154-260325c237b8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=6000";
  const imageUrl = data.imageUrl && data.imageUrl.startsWith('http') ? data.imageUrl : defaultImage;
  const secondaryImageUrl = data.secondaryImageUrl && data.secondaryImageUrl.startsWith('http') ? data.secondaryImageUrl : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2940&auto=format&fit=crop";

  const iconMap = {
    ShieldCheck,
    Zap,
    Users,
    Award
  };

  const getIcon = (iconName) => {
    return iconMap[iconName] || ShieldCheck;
  };

  return (
    <section id="about" className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          {/* Changed from H1 to H2 to prevent multiple H1s per page when component is reused */}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            <span className="border-b-4 border-purple-500 pb-2">{data.title || 'QRUZEHD Farkı'}</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            {data.subtitle || 'Güvenilir, kesintisiz ve yüksek çözünürlüklü yayıncılığın arkasındaki ekibi ve teknolojiyi tanıyın.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             viewport={{ once: true }}
             className="relative"
          >
            <div className="absolute -inset-4 bg-purple-600/20 rounded-3xl blur-xl opacity-50"></div>
            <img  
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border border-slate-700"
              alt="QRUZEHD ekibi modern bir ofiste IPTV teknolojileri üzerine çalışıyor"
              src={imageUrl} />
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             viewport={{ once: true }}
             className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                {data.section1Title || "Misyonumuz"}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {data.mainText || 'QRUZEHD olarak misyonumuz, Avrupa ve Türkiye\'deki tüm kullanıcılara en üst düzeyde, kesintisiz ve donmayan bir IPTV deneyimi sunmaktır. En iyi IPTV server altyapısını kullanarak, müşteri memnuniyetini her zaman ilk sırada tutuyoruz. Vizyonumuz, yenilikçi teknolojilerle IPTV sektöründe standartları belirleyen, en güvenilir ve en çok tercih edilen marka olmaktır.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {(features || []).map((feature, index) => {
                    const IconComponent = getIcon(feature.icon);
                    return (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-800 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex-shrink-0 flex items-center justify-center border border-purple-500/20">
                                <IconComponent className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg mb-1">{feature.title}</h4>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             viewport={{ once: true }}
             className="space-y-6 lg:order-last"
          >
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                {data.section2Title || "Teknolojimiz & Destek"}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {data.secondaryText || 'En son teknolojiye sahip sunucularımız ve yedekli altyapımız sayesinde %99.9 uptime oranıyla hizmet veriyoruz. Anti-buffer teknolojimiz, en yoğun saatlerde bile donma ve takılmaları önler. 7/24 aktif olan teknik destek ekibimiz, her türlü sorunuzda size anında yardımcı olmak için hazırdır. Sizin memnuniyetiniz, bizim başarımızdır.'}
            </p>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             viewport={{ once: true }}
             className="lg:order-first relative"
          >
            <div className="absolute -inset-4 bg-purple-600/20 rounded-3xl blur-xl opacity-50"></div>
            <img  
              className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border border-slate-700"
              alt="Memnun müşteriler QRUZEHD IPTV hizmetini kullanıyor"
              src={secondaryImageUrl} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
