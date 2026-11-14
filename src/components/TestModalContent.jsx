import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, FlaskConical } from 'lucide-react';
import { DeviceSelectionStep, AppSelectionStep, TestDetailsForm } from './TestFormContent';
import TestSummary from './TestSummary';
import LivingRegionSelect from '@/components/LivingRegionSelect';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const TestModalContent = ({ onClose }) => {
  const location = useLocation();
  const isDe = location.pathname.startsWith('/de');
  const [step, setStep] = useState(0);
  const [livingRegion, setLivingRegion] = useState('');
  const [livingCountry, setLivingCountry] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({ username: '', special_note: '' });
  const [isFormValid, setIsFormValid] = useState(false);

  // Navigation Logic
  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  
  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    // Reset App if Device changes
    if (selectedDevice?.id !== device.id) {
        setSelectedApp(null);
    }
    // Auto advance with slight delay for visual feedback
    setTimeout(() => {
        setStep(1);
    }, 300);
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    // Auto advance
    setTimeout(() => {
        setStep(2);
    }, 300);
  };

  const isNextDisabled = () => {
    if (step === 2 && !isFormValid) return true;
    return false;
  };

  // Step Titles
  const getStepInfo = () => {
    switch(step) {
      case 0: return { title: "Cihazını Seç", desc: "Hangi cihazda izlemek istiyorsun?" };
      case 1: return { title: "Uygulama Seç", desc: "Kullandığın bir uygulama var mı?" };
      case 2: return { title: "Bilgilerini Gir", desc: "Test yayını kimin adına olacak?" };
      case 3: return { title: "Onay ve Gönder", desc: "Bilgilerini kontrol et ve onayla" };
      default: return { title: "", desc: "" };
    }
  };

  const { title, desc } = getStepInfo();

  return (
    <div className="flex h-full min-h-0 w-full max-w-full flex-1 flex-col overflow-hidden bg-[#0a0a0a] text-white">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-800/50 bg-gradient-to-b from-green-900/20 to-transparent px-4 py-3 text-center sm:px-6 sm:py-4">
          <DialogHeader>
            <DialogTitle className="mb-0.5 flex items-center justify-center gap-2 text-lg font-black tracking-tight text-white sm:text-2xl">
              <FlaskConical className="h-5 w-5 shrink-0 text-green-500 sm:h-6 sm:w-6" />
              Test Yayını Al
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-400 sm:text-sm">
               {desc}
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress Indicator */}
          <div className="mt-2 flex items-center justify-center gap-2 sm:mt-3">
             {[0, 1, 2, 3].map((s) => (
                <div 
                    key={s} 
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        s === step ? "w-8 bg-green-500" : 
                        s < step ? "w-2 bg-green-800" : "w-2 bg-[#0a0a0a]"
                    )} 
                />
             ))}
          </div>
        </div>

        {/* İç sütun: kaydırılan alan + alt butonlar aynı flex kolonunda (butonlar her zaman görünür) */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-3 sm:px-5 sm:py-4">
          <div className="mb-2 shrink-0 sm:mb-3">
            <LivingRegionSelect
              value={livingRegion}
              onChange={setLivingRegion}
              country={livingCountry}
              onCountryChange={setLivingCountry}
              lang={isDe ? 'de' : 'tr'}
              isTest={true}
            />
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'min-h-0 min-w-0 flex-1',
                  step === 3
                    ? 'flex flex-col overflow-hidden'
                    : 'overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] custom-scrollbar'
                )}
              >
                {step === 0 && (
                  <DeviceSelectionStep selectedDevice={selectedDevice} onSelect={handleDeviceSelect} />
                )}
                {step === 1 && (
                  <AppSelectionStep selectedDevice={selectedDevice} selectedApp={selectedApp} onSelect={handleAppSelect} />
                )}
                {step === 2 && (
                  <TestDetailsForm
                    formData={formData}
                    onChange={(key, val) => setFormData((prev) => ({ ...prev, [key]: val }))}
                    setIsValid={setIsFormValid}
                    selectedDevice={selectedDevice}
                  />
                )}
                {step === 3 && (
                  <TestSummary
                    formData={formData}
                    selectedDevice={selectedDevice}
                    selectedApp={selectedApp}
                    livingRegion={livingRegion}
                    livingCountry={livingCountry}
                    lang={isDe ? 'de' : 'tr'}
                    onEditStep={(s) => setStep(s)}
                    onSuccess={onClose}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {step === 2 && (
              <div className="z-10 flex shrink-0 justify-between gap-2 border-t border-slate-800/50 bg-[#0a0a0a] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:gap-3 sm:px-4">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="h-11 shrink-0 rounded-xl text-slate-400 hover:bg-[#0a0a0a]/50 hover:text-white sm:h-12"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className={cn(
                    'h-11 shrink-0 rounded-xl bg-green-600 px-5 font-bold text-white shadow-lg transition-all hover:bg-green-700 sm:h-12 sm:px-8',
                    isNextDisabled() && 'cursor-not-allowed opacity-50 grayscale'
                  )}
                >
                  Devam Et <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="z-10 flex shrink-0 justify-start border-t border-slate-800/50 bg-[#0a0a0a] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-4">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="h-11 rounded-xl text-slate-400 hover:bg-[#0a0a0a]/50 hover:text-white sm:h-12"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Geri
                </Button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default TestModalContent;
