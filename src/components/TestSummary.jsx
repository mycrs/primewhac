import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { useTestFormSubmit } from '@/hooks/useTestFormSubmit';
import { toast } from '@/components/ui/use-toast';
import TestSummaryDisplay from './TestSummaryDisplay';

const TestSummary = ({ formData, selectedDevice, selectedApp, onEditStep, onSuccess }) => {
  const { submitTestRequest, loading } = useTestFormSubmit();
  const { redirectToWhatsApp } = useWhatsAppIntegration();

  const handleFinish = async () => {
    // 1. Prepare Data
    const requestData = {
      username: formData.username,
      special_note: formData.special_note,
      device: selectedDevice?.name,
      app: selectedApp?.name
    };
    
    // 2. Submit to DB
    const { success } = await submitTestRequest({
        ...requestData,
        device_type: selectedDevice?.name,
        app_name: selectedApp?.name
    });

    if (success) {
        // 3. Notify
        toast({
            title: "Talep Oluşturuldu",
            description: "WhatsApp'a yönlendiriliyorsunuz...",
            className: "bg-green-600 border-none text-white shadow-lg"
        });

        // 4. Redirect WhatsApp
        redirectToWhatsApp(requestData);

        // 5. Close Modal
        if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="flex flex-col h-full">
       <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
          <TestSummaryDisplay 
            formData={formData}
            selectedDevice={selectedDevice}
            selectedApp={selectedApp}
            onEditStep={onEditStep}
          />
       </div>

       <div className="pt-4 mt-auto border-t border-slate-800/50">
            <Button 
                onClick={handleFinish}
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                ) : (
                    <>
                        WhatsApp ile İste <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                )}
            </Button>
            <p className="text-center text-xs text-slate-500 mt-3 font-medium">
                Kişisel verileriniz gizlilik politikamız kapsamında korunmaktadır.
            </p>
       </div>
    </div>
  );
};

export default TestSummary;