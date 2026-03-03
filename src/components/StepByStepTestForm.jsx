import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TestFormContent from '@/components/TestFormContent';
import TestFormSummary from '@/components/TestFormSummary';

const StepByStepTestForm = ({ 
  step, 
  direction, 
  selectedDevice, 
  selectedApp, 
  formData, 
  onNext, 
  onBack, 
  onSelectDevice, 
  onSelectApp, 
  onChangeForm, 
  onEditStep,
  onSuccess
}) => {
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'relative'
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute'
    })
  };

  const transition = {
    x: { type: "tween", ease: "easeOut", duration: 0.3 },
    opacity: { duration: 0.2 }
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col">
      <div className="flex-1 relative w-full h-full p-4 sm:p-6 md:p-8 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="w-full h-full flex flex-col"
          >
            {step < 3 ? (
              <TestFormContent 
                step={step}
                selectedDevice={selectedDevice}
                selectedApp={selectedApp}
                formData={formData}
                onSelect={step === 0 ? onSelectDevice : onSelectApp}
                onChange={onChangeForm}
                onNext={onNext}
                onBack={onBack}
              />
            ) : (
              <TestFormSummary 
                formData={formData}
                selectedDevice={selectedDevice}
                selectedApp={selectedApp}
                onBack={onBack}
                onEditStep={onEditStep}
                onSuccess={onSuccess}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StepByStepTestForm;