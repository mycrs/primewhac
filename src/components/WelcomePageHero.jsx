
import React from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTestModal } from '@/contexts/TestModalContext';

const WelcomePageHero = () => {
  const navigate = useNavigate();
  const { openTestModal } = useTestModal();
  const NEW_LOGO_URL = "https://horizons-cdn.hostinger.com/6f4a665f-b1cc-4753-8f96-f98db31dd5f3/ee7b00c4d7684d8a8e7320e9b78634fe.png";

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1569587889770-9134d27b292e?q=80&w=2070&auto=format&fit=crop" 
          alt="Entertainment Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1E] via-transparent to-[#0F0F1E]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={NEW_LOGO_URL} 
            alt="QRUZE TV Premium IPTV" 
            className="h-28 md:h-36 w-auto object-contain mb-12 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          />
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
            EĞLENCENİN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">
              YENİ BOYUTU
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light">
            QRUZE TV ile televizyon izleme deneyiminizi zirveye taşıyın. 
            4K yayın kalitesi, binlerce içerik ve rakipsiz destek.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              onClick={openTestModal}
              size="lg"
              className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl shadow-2xl transition-all hover:scale-105"
            >
              Hemen Başla
            </Button>
            <Button 
              onClick={() => navigate('/paketler')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-16 px-12 rounded-2xl border-2 border-white/20 bg-white/5 text-white font-bold text-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              Paketleri Gör
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomePageHero;
