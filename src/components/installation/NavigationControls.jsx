
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NavigationControls = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  canGoNext, 
  canGoPrev,
  isLastStep 
}) => {
  // Calculate progress percentage
  const progress = Math.min(100, Math.max(0, ((currentStep + 1) / totalSteps) * 100));

  return (
    <div className="w-full space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
          <span className="text-sm font-medium text-slate-400" aria-current="step">
            Adım <span className="text-white font-bold">{currentStep + 1}</span> / {totalSteps}
          </span>
          <span className="text-xs font-semibold text-purple-400">
            {Math.round(progress)}% Tamamlandı
          </span>
        </div>
        <div 
          className="h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-800"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!canGoPrev}
          className={cn(
            "min-w-[110px] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-300",
            !canGoPrev && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-slate-300"
          )}
          aria-label="Önceki Adım"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Geri
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext && !isLastStep}
          className={cn(
            "min-w-[130px] font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
            isLastStep 
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20" 
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-purple-900/20"
          )}
          aria-label={isLastStep ? "Kurulumu Tamamla" : "Sonraki Adım"}
        >
          {isLastStep ? (
            <>Tamamla <CheckCircle2 className="w-4 h-4 ml-2" /></>
          ) : (
            <>İleri <ChevronRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NavigationControls;
