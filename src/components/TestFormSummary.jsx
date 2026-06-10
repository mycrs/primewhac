import React, { useState } from 'react';
import { Edit2, AlertCircle, Tv, Download, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useTestFormSubmit } from '@/hooks/useTestFormSubmit';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { toast } from '@/components/ui/use-toast';
import TurkeyPackageWhatsAppWarningDialog from '@/components/packages/TurkeyPackageWhatsAppWarningDialog';
import { isAbroadLivingRegion } from '@/utils/turkeyPackageWhatsAppGate';
import { useSiteData } from '@/hooks/useSiteData';
import { getIptvDeviceIcon } from '@/constants/iptvFlowDevices';

const TestFormSummary = ({
  formData,
  selectedDevice,
  selectedApp,
  onBack,
  onEditStep,
  onSuccess,
  livingRegion = '',
}) => {
  const location = useLocation();
  const isDeSite = location.pathname.startsWith('/de');
  const [trWarningOpen, setTrWarningOpen] = useState(false);
  const { siteData } = useSiteData(false, false);
  const { submitTestRequest, loading, error } = useTestFormSubmit();
  const { redirectToWhatsApp } = useWhatsAppIntegration();

  const runWhatsAppRedirect = () => {
    const whatsAppData = {
      device: selectedDevice?.name,
      app: selectedApp?.name,
      username: formData.username,
      note: formData.special_note
    };
    const redirected = redirectToWhatsApp(whatsAppData);
    if (redirected) {
      toast({
        title: "Yönlendiriliyorsunuz...",
        description: "WhatsApp açılıyor.",
        duration: 1000,
        className: "bg-green-600 border-none text-white"
      });
    } else {
      toast({
        variant: "destructive",
        title: "WhatsApp Numarası Eksik",
        description: "Lütfen admin panelinden İletişim Bilgileri veya Sistem Ayarları bölümüne WhatsApp numarası ekleyin."
      });
    }
    if (onSuccess) onSuccess();
  };

  const handleInstantSubmit = () => {
    const requestData = {
      username: formData.username,
      special_note: formData.special_note,
      device_type: selectedDevice?.name,
      app_name: selectedApp?.name
    };
    const isValid = submitTestRequest(requestData);
    if (!isValid) return;
    if (isDeSite) {
      runWhatsAppRedirect();
      return;
    }
    if (isAbroadLivingRegion(livingRegion)) {
      setTrWarningOpen(true);
      return;
    }
    runWhatsAppRedirect();
  };

  const handleWarningContinue = () => {
    setTrWarningOpen(false);
    runWhatsAppRedirect();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      <TurkeyPackageWhatsAppWarningDialog
        open={trWarningOpen}
        variant="test"
        onContinue={handleWarningContinue}
      />
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar p-1">
        
        {/* Device Summary */}
        <div className="bg-[#0a0a0a]/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 transition-colors">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#0a0a0a] rounded-xl text-primary shrink-0">
                 {selectedDevice?.id
                    ? React.createElement(getIptvDeviceIcon(selectedDevice.id, siteData?.iptvFlowDevicesData), { size: 24 })
                    : <Tv size={24} />}
              </div>
              <div className="min-w-0">
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Seçilen Cihaz</p>
                 <p className="text-base font-medium text-white truncate">{selectedDevice?.name || 'Seçilmedi'}</p>
              </div>
           </div>
           <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-slate-500 hover:text-white" onClick={() => onEditStep(0)}>
              <Edit2 size={16} />
           </Button>
        </div>

        {/* App Summary */}
        <div className="bg-[#0a0a0a]/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 transition-colors">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#0a0a0a] rounded-xl text-blue-400 shrink-0">
                 <Download size={24} />
              </div>
              <div className="min-w-0">
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Uygulama</p>
                 <p className="text-base font-medium text-white truncate">{selectedApp?.name || 'Seçilmedi'}</p>
              </div>
           </div>
           <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-slate-500 hover:text-white" onClick={() => onEditStep(1)}>
              <Edit2 size={16} />
           </Button>
        </div>

        {/* User Summary */}
        <div className="bg-[#0a0a0a]/40 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 group hover:border-slate-700 transition-colors">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-[#0a0a0a] rounded-xl text-green-400 shrink-0">
                    <User size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Kullanıcı Bilgileri</p>
                    <p className="text-base font-medium text-white truncate">{formData.username}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-slate-500 hover:text-white" onClick={() => onEditStep(2)}>
                 <Edit2 size={16} />
              </Button>
           </div>
           {formData.special_note && (
             <div className="pt-3 border-t border-slate-800/50 pl-16">
                <p className="text-xs text-slate-500 mb-1 font-semibold">Özel Not</p>
                <p className="text-sm text-slate-300 italic">"{formData.special_note}"</p>
             </div>
           )}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-sm text-red-400 animate-in slide-in-from-bottom-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-slate-800/50 flex gap-4 pb-safe">
        <Button 
          variant="outline" 
          onClick={onBack} 
          disabled={loading} 
          className="w-1/3 h-12 border-slate-700 bg-transparent hover:bg-[#0a0a0a] text-slate-300 rounded-xl"
        >
          Geri
        </Button>
        <Button
          onClick={handleInstantSubmit}
          disabled={loading}
          className="flex-1 h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all hover:scale-[1.02]"
        >
          WhatsApp ile İste <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default TestFormSummary;