
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavigationControls from './NavigationControls';
import { ImageOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const InstallationGuideStep = ({ 
  step, 
  currentStepIndex, 
  totalSteps, 
  onNext, 
  onPrev 
}) => {
  const [imageState, setImageState] = useState('loading'); // 'loading', 'loaded', 'error'

  useEffect(() => {
    // Reset state when step or image changes
    if (!step?.image) {
      setImageState('error');
      return;
    }
    
    // Validate URL format simply
    try {
      new URL(step.image);
      setImageState('loading');
    } catch {
      // If it's a relative path, we'll try to load it anyway, but mark it loading
      if (step.image.startsWith('/')) {
         setImageState('loading');
      } else {
         setImageState('error');
      }
    }
  }, [step?.image]);

  if (!step) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < totalSteps - 1;

  const renderImageFallback = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]/50 text-slate-500 border-b lg:border-b-0 lg:border-l border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a]/50 flex items-center justify-center mb-3">
        <ImageOff className="w-8 h-8 opacity-50" />
      </div>
      <span className="text-sm font-medium">Bu adım için görsel bulunmamaktadır</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#0a0a0a]/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        
        {/* Text Content Side */}
        <div className="p-6 md:p-10 lg:p-12 flex flex-col order-2 lg:order-1 relative">
          {/* Top Gradient Line for Mobile */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e50914] to-[#b20710] lg:hidden" />
          
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0a0a0a]/80 text-primary text-xs font-bold border border-primary/20 mb-4 shadow-sm">
                ADIM {currentStepIndex + 1}
              </span>
              <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                {step.title}
              </h4>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-light">
                  {step.description}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 pt-6">
            <NavigationControls 
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              onNext={onNext}
              onPrev={onPrev}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              isLastStep={isLastStep}
            />
          </div>
        </div>

        {/* Image Side */}
        <div className="relative min-h-[250px] md:min-h-[350px] lg:h-auto lg:min-h-[500px] order-1 lg:order-2 bg-[#0a0a0a] overflow-hidden group flex items-center justify-center">
           {/* Image Overlays */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 lg:bg-gradient-to-l opacity-90 pointer-events-none" />
           
           {/* Hover Effect Gradient */}
           <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />

           {step.image && imageState !== 'error' ? (
             <>
               {imageState === 'loading' && (
                 <div className="absolute inset-0 flex items-center justify-center z-0 bg-[#0a0a0a]">
                    <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
                 </div>
               )}
               <img 
                 src={step.image} 
                 alt={step.title ? `${step.title} IPTV kurulum` : `Adım ${currentStepIndex + 1} IPTV kurulum`}
                 className={cn(
                   "w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 z-0 relative",
                   imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
                 )}
                 onLoad={() => setImageState('loaded')}
                 onError={() => setImageState('error')}
               />
             </>
           ) : (
             renderImageFallback()
           )}
        </div>
      </div>
    </div>
  );
};

export default InstallationGuideStep;
