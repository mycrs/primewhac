import React, { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, FlaskConical } from 'lucide-react';
import { DeviceSelectionStep, AppSelectionStep, TestDetailsForm } from './TestFormContent';
import TestSummary from './TestSummary';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const TestModalContent = ({ onClose }) => {
  const [step, setStep] = useState(0);
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
    <div className="flex flex-col h-full bg-[#0B0F19] text-white">
        {/* Header */}
        <div className="px-6 py-5 text-center border-b border-slate-800/50 bg-gradient-to-b from-green-900/20 to-transparent shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center justify-center gap-2 mb-1 text-white tracking-tight">
              <FlaskConical className="w-6 h-6 text-green-500" />
              Test Yayını Al
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-medium text-sm">
               {desc}
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
             {[0, 1, 2, 3].map((s) => (
                <div 
                    key={s} 
                    className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        s === step ? "w-8 bg-green-500" : 
                        s < step ? "w-2 bg-green-800" : "w-2 bg-slate-800"
                    )} 
                />
             ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col relative">
           <AnimatePresence mode="wait">
             <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto custom-scrollbar h-full"
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
                        onChange={(key, val) => setFormData(prev => ({...prev, [key]: val}))} 
                        setIsValid={setIsFormValid}
                    />
                )}
                {step === 3 && (
                    <TestSummary 
                        formData={formData} 
                        selectedDevice={selectedDevice} 
                        selectedApp={selectedApp}
                        onEditStep={(s) => setStep(s)}
                        onSuccess={onClose}
                    />
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Footer Navigation (Only for Form Step) */}
        {step === 2 && (
            <div className="p-4 border-t border-slate-800/50 flex justify-between gap-3 bg-[#0B0F19]/95 backdrop-blur-sm z-10">
                <Button 
                    variant="ghost" 
                    onClick={prevStep} 
                    className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Geri
                </Button>

                <Button 
                    onClick={nextStep} 
                    disabled={isNextDisabled()}
                    className={cn(
                        "bg-green-600 hover:bg-green-700 text-white font-bold px-8 rounded-xl shadow-lg transition-all",
                        isNextDisabled() && "opacity-50 grayscale cursor-not-allowed"
                    )}
                >
                    Devam Et <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        )}
        
        {/* Back Button for other steps (except start and summary) */}
        {step === 1 && (
             <div className="p-4 border-t border-slate-800/50 flex justify-start bg-[#0B0F19]/95 backdrop-blur-sm z-10">
                <Button 
                    variant="ghost" 
                    onClick={prevStep} 
                    className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Geri
                </Button>
             </div>
        )}
    </div>
  );
};

export default TestModalContent;