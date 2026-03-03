import React, { useState } from 'react';
import InstallationGuideStep from './InstallationGuideStep';

const GenericGuide = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Guard clause for missing or empty steps
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-900/30 rounded-xl border border-slate-800">
        <p className="text-slate-400">Keine Installationsschritte zur Anzeige gefunden.</p>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top of guide container smoothly
      const guideContainer = document.getElementById('guide-container');
      if (guideContainer) {
        guideContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Ensure current step data exists
  const currentStepData = steps[currentStep];

  return (
    <div id="guide-container" className="py-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
      <InstallationGuideStep 
        step={currentStepData}
        currentStepIndex={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrev={handlePrev}
        isLastStep={currentStep === steps.length - 1}
      />
    </div>
  );
};

export default GenericGuide;