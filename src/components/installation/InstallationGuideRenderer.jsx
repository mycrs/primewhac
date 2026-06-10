
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InstallationGuideStep from './InstallationGuideStep';
import { AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const InstallationGuideRenderer = ({ 
  steps, 
  currentStepIndex, 
  onNext, 
  onPrev 
}) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');
  
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-24 px-6 border border-slate-800/50 rounded-3xl bg-[#0a0a0a]/20 backdrop-blur-sm max-w-2xl mx-auto"
      >
        <div className="w-16 h-16 bg-[#0a0a0a]/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-black/20">
             <AlertCircle className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {isDe ? "Installationsschritte nicht gefunden" : "Kurulum adımları bulunamadı"}
        </h3>
        <p className="text-slate-400 text-base max-w-md mx-auto">
          {isDe 
            ? "Für dieses Gerät wurden noch keine Installationsschritte hinzugefügt. Bitte versuchen Sie es später erneut." 
            : "Bu cihaz için henüz kurulum adımları eklenmedi. Lütfen daha sonra tekrar deneyin."}
        </p>
      </motion.div>
    );
  }

  const currentStep = steps[currentStepIndex];
  
  // Guard against index out of bounds
  if (!currentStep) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`step-wrapper-${currentStepIndex}`}
          initial={{ opacity: 0, x: 50, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <InstallationGuideStep 
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            onNext={onNext}
            onPrev={onPrev}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InstallationGuideRenderer;
