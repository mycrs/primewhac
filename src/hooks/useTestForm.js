// This hook is deprecated and no longer used.
// Logic has been moved to StepByStepTestForm.jsx and submit-test-request edge function.
export const useTestForm = () => {
  return { 
    submitTestRequest: async () => console.warn('useTestForm is deprecated'), 
    loading: false 
  };
};