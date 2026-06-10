import React from 'react';
import { Edit2, Tv, AppWindow, User, FileText } from 'lucide-react';
import { useSiteData } from '@/hooks/useSiteData';
import { getIptvDeviceIcon } from '@/constants/iptvFlowDevices';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SummaryCard = ({ title, value, icon: Icon, onEdit, subValue }) => (
  <div className="bg-[#0a0a0a]/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center gap-4 min-w-0">
      <div className={cn(
        "w-12 h-12 flex items-center justify-center rounded-xl shrink-0 bg-gradient-to-br border border-slate-700/50",
        title === 'Cihaz' ? "from-[#e50914]/20 to-[#b20710]/20 text-blue-400" :
        title === 'Uygulama' ? "from-[#e50914]/20 to-[#b20710]/20 text-primary" :
        "from-[#e50914]/20 to-green-500/20 text-[#e50914]"
      )}>
        {Icon ? <Icon className="w-6 h-6" /> : <User className="w-6 h-6" />}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">{title}</p>
        <p className="text-base font-bold text-white truncate">{value || 'Belirtilmedi'}</p>
        {subValue && (
          <p className="text-xs text-slate-400 truncate mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
    <Button 
      size="icon" 
      variant="ghost" 
      className="h-9 w-9 rounded-lg text-slate-500 hover:text-white hover:bg-[#0a0a0a] shrink-0" 
      onClick={onEdit}
    >
      <Edit2 className="w-4 h-4" />
    </Button>
  </div>
);

const TestSummaryDisplay = ({ formData, selectedDevice, selectedApp, onEditStep }) => {
  const { siteData } = useSiteData();
  const getDeviceIcon = () => {
    if (!selectedDevice?.id) return Tv;
    return getIptvDeviceIcon(selectedDevice.id, siteData?.iptvFlowDevicesData);
  };

  const deviceDisplay = formData?.tv_brand
    ? `${selectedDevice?.name} (${formData.tv_brand})`
    : selectedDevice?.name;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SummaryCard 
        title="Cihaz" 
        value={deviceDisplay} 
        icon={getDeviceIcon()} 
        onEdit={() => onEditStep(0)} 
      />

      <SummaryCard 
        title="Uygulama" 
        value={selectedApp?.name} 
        icon={AppWindow} 
        onEdit={() => onEditStep(1)} 
      />

      <SummaryCard 
        title="Kullanıcı Adı" 
        value={formData.username} 
        icon={User} 
        onEdit={() => onEditStep(2)} 
      />

      {formData.special_note && (
        <div className="bg-[#0a0a0a]/40 border border-slate-800 rounded-xl p-4 group hover:border-slate-700 transition-colors">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-500">
                 <FileText className="w-4 h-4" />
                 <span className="text-[10px] uppercase tracking-widest font-bold">Özel Not</span>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-lg text-slate-500 hover:text-white hover:bg-[#0a0a0a]" 
                onClick={() => onEditStep(2)}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
           </div>
           <p className="text-sm text-slate-300 italic pl-1 border-l-2 border-slate-700">
             "{formData.special_note}"
           </p>
        </div>
      )}
    </div>
  );
};

export default TestSummaryDisplay;