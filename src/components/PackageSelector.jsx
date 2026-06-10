import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Smartphone, Tablet, Monitor, MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderModal } from '@/contexts/OrderModalContext';
import { useTestModal } from '@/contexts/TestModalContext';

const PackageSelector = ({ siteTexts }) => {
  const { openModal: openOrderModal } = useOrderModal();
  const { openModal: openTestModal } = useTestModal();
  const texts = siteTexts?.packageSelector || {};
  
  const devices = [
    { id: 'smarttv', label: texts.deviceSmartTV || 'Smart TV', icon: Tv },
    { id: 'ios', label: texts.deviceIOS || 'iOS (iPhone/iPad)', icon: Smartphone },
    { id: 'android', label: texts.deviceAndroid || 'Android', icon: Tablet },
    { id: 'pc', label: texts.devicePC || 'PC/Mac', icon: Monitor }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0a0a0a] via-[#e50914] to-[#141414]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {texts.title || 'Akıllı Paket Seçimi'}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {texts.subtitle || 'Cihazınıza özel en uygun programları bulun'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-effect rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="space-y-8">
            <p className="text-gray-300 mb-6">
              Cihazınız için en iyi kurulum deneyimini sunan sihirbazımızı başlatın.
            </p>

            {/* Device selection section - Hidden on mobile, shown on md breakpoint and above */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 opacity-50 pointer-events-none hidden md:grid">
                {devices.map((device) => {
                  const Icon = device.icon;
                  return (
                    <div key={device.id} className="p-4 border border-gray-700 rounded-lg flex flex-col items-center">
                       <Icon className="w-8 h-8 text-gray-400 mb-2"/>
                       <span className="text-xs text-gray-500">{device.label}</span>
                    </div>
                  )
                })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => openTestModal()}
                className="flex-1 max-w-xs bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg shadow-lg shadow-green-900/20"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {texts.testButton || 'Ücretsiz Test Et'}
              </Button>
              <Button
                onClick={() => openOrderModal(null, false)}
                className="flex-1 max-w-xs bg-[#141414] hover:bg-[#0a0a0a] text-white font-bold py-6 text-lg shadow-lg shadow-blue-900/20"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {texts.buyButton || 'Hemen Satın Al'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PackageSelector;