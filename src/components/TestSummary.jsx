import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { getLivingRegionWhatsAppLine, isLivingRegionComplete } from '@/components/LivingRegionSelect';
import { isAbroadLivingRegion } from '@/utils/turkeyPackageWhatsAppGate';
import { toast } from '@/components/ui/use-toast';
import TestSummaryDisplay from './TestSummaryDisplay';
import TurkeyPackageWhatsAppWarningDialog from '@/components/packages/TurkeyPackageWhatsAppWarningDialog';

const TestSummary = ({ formData, selectedDevice, selectedApp, livingRegion, livingCountry, lang = 'tr', onEditStep, onSuccess }) => {
  const { redirectToWhatsApp } = useWhatsAppIntegration();
  const livingRegionMessage = getLivingRegionWhatsAppLine(livingRegion, lang, livingCountry);
  const [trWarningOpen, setTrWarningOpen] = useState(false);
  const isTrLang = lang === 'tr';

  useEffect(() => {
    if (livingRegion !== 'not_in_turkey') setTrWarningOpen(false);
  }, [livingRegion]);

  const handleFinish = () => {
    const tvBrandInfo = formData.tv_brand ? ` (${formData.tv_brand})` : '';
    const requestData = {
      username: formData.username,
      special_note: formData.special_note,
      note: formData.special_note,
      device: selectedDevice?.name + tvBrandInfo,
      app: selectedApp?.name,
      livingRegionMessage,
    };

    const redirected = redirectToWhatsApp(requestData);
    if (!redirected) {
      toast({
        variant: "destructive",
        title: "WhatsApp Numarası Eksik",
        description: "Lütfen admin panelinden İletişim Bilgileri veya Sistem Ayarları bölümüne WhatsApp numarası ekleyin."
      });
      return;
    }

    toast({
      title: "Yönlendiriliyorsunuz",
      description: "WhatsApp açılıyor...",
      className: "bg-green-600 border-none text-white shadow-lg"
    });
    if (onSuccess) onSuccess();
  };

  const requestWhatsApp = () => {
    if (isTrLang && isAbroadLivingRegion(livingRegion)) {
      setTrWarningOpen(true);
      return;
    }
    handleFinish();
  };

  const handleWarningContinue = () => {
    setTrWarningOpen(false);
    handleFinish();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
       <TurkeyPackageWhatsAppWarningDialog
         open={trWarningOpen}
         variant="test"
         onContinue={handleWarningContinue}
       />
       <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch] custom-scrollbar">
          <TestSummaryDisplay 
            formData={formData}
            selectedDevice={selectedDevice}
            selectedApp={selectedApp}
            onEditStep={onEditStep}
          />
       </div>

       <div className="shrink-0 border-t border-slate-800/50 bg-[#0a0a0a] pt-3 pb-[max(0.35rem,env(safe-area-inset-bottom))]">
            <Button 
                onClick={requestWhatsApp}
                disabled={!isLivingRegionComplete(livingRegion, livingCountry)}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-green-600 to-[#b20710] text-base font-bold text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:from-green-500 hover:to-[#b20710] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:h-14 sm:text-lg"
            >
                WhatsApp ile İste <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-2 text-center text-[11px] font-medium text-slate-500 sm:mt-3 sm:text-xs">
                Kişisel verileriniz gizlilik politikamız kapsamında korunmaktadır.
            </p>
       </div>
    </div>
  );
};

export default TestSummary;
