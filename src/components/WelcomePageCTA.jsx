import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestModal } from '@/contexts/TestModalContext';

const WelcomePageCTA = () => {
  const { openModal } = useTestModal();

  return (
    <section className="py-24 relative overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e50914] to-[#b20710]" />
      
      {/* Decorative overlay patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Hala Kararsız mısınız?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
            Kalitemizi görmeden karar vermeyin. 24 saatlik ücretsiz deneme süresi ile tüm kanalları ve içerikleri test edin, memnun kalırsanız abone olun.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={openModal}
              size="lg" 
              className="h-16 px-10 text-lg font-bold rounded-full bg-white text-primary hover:bg-gray-100 hover:text-primary shadow-2xl hover:shadow-white/20 transition-all"
            >
              <FlaskConical className="w-6 h-6 mr-3" />
              Ücretsiz Test Et
            </Button>
          </motion.div>
          
          <p className="mt-6 text-sm text-blue-200/60">
            *Kredi kartı gerekmez. Anında aktivasyon.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomePageCTA;