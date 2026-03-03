import React, { useMemo, useState, useEffect } from 'react';
import { Tv, Smartphone, Monitor, Tablet, Watch, Check, AppWindow, Search, AlertCircle, Type, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSiteData } from '@/hooks/useSiteData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Styling constants matching OrderModal
const ITEM_BASE_CLASS = "relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md";
const ITEM_SELECTED_CLASS = "bg-slate-800 border-green-500 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]";
const ITEM_DEFAULT_CLASS = "bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-600";

// --- Step 1: Device Selection ---
export const DeviceSelectionStep = ({ selectedDevice, onSelect }) => {
  const devices = [
    { id: 'tv', name: 'Smart TV', icon: Tv },
    { id: 'android', name: 'Android', icon: Smartphone },
    { id: 'ios', name: 'iOS (Apple)', icon: Smartphone },
    { id: 'pc', name: 'PC / Laptop', icon: Monitor },
    { id: 'tablet', name: 'Tablet', icon: Tablet },
    { id: 'other', name: 'Diğer', icon: Watch },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {devices.map((device, idx) => {
          const isSelected = selectedDevice?.id === device.id;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={device.id}
              onClick={() => onSelect(device)}
              className={cn(
                ITEM_BASE_CLASS,
                isSelected ? ITEM_SELECTED_CLASS : ITEM_DEFAULT_CLASS
              )}
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                  isSelected ? "bg-green-500/20 text-green-500" : "bg-slate-800 text-slate-500"
                )}>
                   <device.icon className="w-5 h-5" />
                </div>
              </div>
              <span className={cn(
                "font-bold text-sm transition-colors",
                isSelected ? "text-white" : "text-slate-300"
              )}>
                {device.name}
              </span>
              {isSelected && (
                <div className="ml-auto">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// --- Step 2: App Selection ---
export const AppSelectionStep = ({ selectedDevice, selectedApp, onSelect }) => {
  const { siteData } = useSiteData();
  
  const filteredApps = useMemo(() => {
    const allApps = siteData?.appsData || [];
    if (!selectedDevice) return [];

    return allApps.filter(app => {
      const deviceMap = {
        'tv': ['smarttv', 'android'],
        'android': ['android'],
        'ios': ['ios'],
        'pc': ['pc'],
        'tablet': ['tablet', 'android', 'ios'],
        'other': [] 
      };
      
      const allowedPlatforms = deviceMap[selectedDevice.id] || [];
      return app.platforms?.some(p => allowedPlatforms.includes(p));
    });
  }, [selectedDevice, siteData]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2 pb-2">
        {filteredApps.length > 0 ? (
          filteredApps.map((app, idx) => {
             const isSelected = selectedApp?.id === app.id;
             return (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 key={app.id}
                 onClick={() => onSelect(app)}
                 className={cn(
                   ITEM_BASE_CLASS,
                   isSelected ? ITEM_SELECTED_CLASS : ITEM_DEFAULT_CLASS
                 )}
               >
                 <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden border border-slate-700 shadow-inner">
                    {app.logo ? (
                        <img src={app.logo} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                        <AppWindow className="w-5 h-5 text-slate-500" />
                    )}
                 </div>
                 
                 <div className="flex flex-col min-w-0">
                    <span className={cn("font-bold text-sm truncate", isSelected ? "text-white" : "text-slate-200")}>
                        {app.name}
                    </span>
                    {app.recommended && (
                        <span className="text-[10px] text-amber-400 font-medium">⭐ Önerilen</span>
                    )}
                 </div>

                 {isSelected && (
                   <div className="ml-auto">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                   </div>
                 )}
               </motion.div>
             );
          })
        ) : (
          <div className="col-span-full py-8 text-center bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
            <Search className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Özel bir uygulama bulunamadı.</p>
          </div>
        )}
        
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           onClick={() => onSelect({ id: 'generic', name: 'Diğer / Bilmiyorum' })}
           className={cn(
             ITEM_BASE_CLASS,
             selectedApp?.id === 'generic' ? ITEM_SELECTED_CLASS : ITEM_DEFAULT_CLASS
           )}
         >
            <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center shrink-0 border border-slate-700">
                <span className="text-slate-500 font-bold text-lg">?</span>
            </div>
            <span className={cn("font-bold text-sm", selectedApp?.id === 'generic' ? "text-white" : "text-slate-400")}>
                Diğer / Bilmiyorum
            </span>
            {selectedApp?.id === 'generic' && (
               <div className="ml-auto">
                 <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                   <Check className="w-3 h-3 text-white" />
                 </div>
               </div>
            )}
         </motion.div>
      </div>
    </div>
  );
};

// --- Step 3: Details Form ---
export const TestDetailsForm = ({ formData, onChange, setIsValid }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data) => {
    const newErrors = {};
    if (!data.username || data.username.length < 3) {
      newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır.";
    } else if (!/^[a-zA-Z0-9\s\-_ğüşıöçĞÜŞİÖÇ]+$/.test(data.username)) {
      newErrors.username = "Sadece harf, rakam ve tire/alt çizgi kullanabilirsiniz.";
    }

    if (data.special_note && data.special_note.length > 500) {
      newErrors.special_note = "Notunuz 500 karakterden fazla olamaz.";
    }

    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [formData, setIsValid]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pt-2">
      <div className="space-y-2">
          <Label htmlFor="username" className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 flex items-center gap-2">
              <Type className="w-3 h-3" /> Adınız Soyadınız <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input 
              id="username"
              value={formData.username}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 50) onChange('username', val);
              }}
              onBlur={() => handleBlur('username')}
              className={cn(
                "bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-14 text-lg pl-4 pr-12 transition-all",
                touched.username && errors.username && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Örn: Ahmet Yılmaz"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
              {formData.username.length}/50
            </div>
          </div>
          {touched.username && errors.username && (
            <div className="flex items-center gap-2 text-red-400 text-xs pl-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3 h-3" />
              {errors.username}
            </div>
          )}
      </div>

      <div className="space-y-2">
          <Label htmlFor="note" className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Özel Not (Opsiyonel)
          </Label>
          <div className="relative">
            <Textarea 
              id="note"
              value={formData.special_note || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 500) onChange('special_note', val);
              }}
              className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 min-h-[120px] resize-none text-base p-4"
              placeholder="Belirtmek istediğiniz özel bir durum varsa buraya yazabilirsiniz..."
            />
            <div className="absolute right-3 bottom-3 text-xs text-slate-500 font-medium">
              {(formData.special_note || '').length}/500
            </div>
          </div>
      </div>
    </div>
  );
};