import React from 'react';
import { motion } from 'framer-motion';
import { Play, Monitor, Smartphone, Globe, Shield, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 hover:bg-slate-800/50 transition-all duration-300 group"
  >
    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
      <Icon className="w-6 h-6 text-purple-400" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const WelcomeTabs = () => {
  const { openModal: openTestModal } = useTestModal();
  const navigate = useNavigate();

  const features = [
    { icon: Monitor, title: "Tüm Cihazlarla Uyumlu", description: "Smart TV, PC, Telefon ve Tabletlerinizde sorunsuz çalışır." },
    { icon: Wifi, title: "Kesintisiz Yayın", description: "Güçlü altyapımız ile donmadan, takılmadan izleme keyfi." },
    { icon: Globe, title: "Evrensel İçerik", description: "Dünyanın her yerinden binlerce kanal ve içerik parmaklarınızın ucunda." },
    { icon: Shield, title: "Güvenli ve Gizli", description: "Kullanıcı verileriniz şifrelenir ve güvenle saklanır." }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Neden Bizi Seçmelisiniz?
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          En son teknoloji altyapımız ve geniş içerik arşivimiz ile size benzersiz bir deneyim sunuyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} delay={i * 0.1} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button 
          onClick={openTestModal}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 px-8 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all w-full sm:w-auto"
        >
          <Play className="w-4 h-4 mr-2 fill-current" />
          Hemen Test Et
        </Button>
        <Button 
          onClick={() => navigate('/paketler')}
          variant="outline"
          size="lg"
          className="border-slate-700 text-white hover:bg-slate-800 font-semibold h-12 px-8 rounded-full w-full sm:w-auto"
        >
          Paketleri İncele
        </Button>
      </div>
    </div>
  );
};

export default WelcomeTabs;