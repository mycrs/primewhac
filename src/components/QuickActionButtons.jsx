import React from 'react';
import { Package, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSiteData } from '@/hooks/useSiteData';
import { useTestModal } from '@/contexts/TestModalContext';

const QuickActionButtons = ({ siteData: propSiteData }) => {
  const navigate = useNavigate();
  const { openModal: openTestModal } = useTestModal();
  const { siteData: hookSiteData } = useSiteData(false);
  const siteData = propSiteData || hookSiteData;
  const testSettings = siteData?.test_settings || {};
  
  const handleTestClick = () => {
    // Open modal without params
    openTestModal();
  };

  const handlePackagesClick = () => {
    navigate('/paketler');
  };

  return (
    <section className="w-full py-12 px-4 bg-[#0a0a0a] relative z-20">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Packages Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button
              onClick={handlePackagesClick}
              className="w-full h-32 md:h-40 text-xl md:text-2xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-slate-700 hover:border-primary/50 transition-all duration-300 group flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#e50914]/10 to-[#b20710]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="bg-primary/20 p-3 rounded-full">
                   <Package className="w-8 h-8 text-primary group-hover:text-primary transition-colors" />
                </div>
                <span className="text-white group-hover:text-primary">PAKETLER</span>
              </div>
              <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-hover:text-white group-hover:translate-x-2 transition-all opacity-0 md:opacity-100" />
            </Button>
          </motion.div>

          {/* Test Button - Only show if enabled */}
          {testSettings.enabled !== false && (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
            >
                <Button
                onClick={handleTestClick}
                className="w-full h-32 md:h-40 text-xl md:text-2xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-green-500/20 bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-slate-700 hover:border-green-500/50 transition-all duration-300 group flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-[#b20710]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="bg-green-500/20 p-3 rounded-full">
                    <Zap className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
                    </div>
                    <span className="text-white group-hover:text-green-200">TEST ET</span>
                </div>
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-hover:text-white group-hover:translate-x-2 transition-all opacity-0 md:opacity-100" />
                </Button>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default QuickActionButtons;