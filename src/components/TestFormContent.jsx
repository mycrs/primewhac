import React, { useMemo, useState, useEffect } from 'react';
import { Tv, Check, AppWindow, Search, AlertCircle, Type, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSiteData } from '@/hooks/useSiteData';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getIptvFlowDevices, getIptvDevicePlatformsMap } from '@/constants/iptvFlowDevices';

// Styling constants matching OrderModal
const ITEM_BASE_CLASS = "relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md";
const ITEM_SELECTED_CLASS = "bg-[#0a0a0a] border-green-500 shadow-[0_0_15px_-3px_rgba(34,197,94,0.3)]";
const ITEM_DEFAULT_CLASS = "bg-[#0a0a0a]/50 border-slate-800 hover:bg-[#0a0a0a] hover:border-slate-600";

// --- Step 1: Device Selection (test sayfası / OrderModal ile aynı liste) ---
export const DeviceSelectionStep = ({ selectedDevice, onSelect }) => {
  const location = useLocation();
  const { siteData } = useSiteData();
  const isDe = location.pathname.startsWith('/de');
  const devices = useMemo(
    () => getIptvFlowDevices(isDe ? 'de' : 'tr', siteData?.iptvFlowDevicesData),
    [isDe, siteData?.iptvFlowDevicesData]
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid max-h-[min(380px,50vh)] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 custom-scrollbar sm:max-h-none sm:overflow-visible">
        {devices.map((device, idx) => {
          const isSelected = selectedDevice?.id === device.id;
          const Icon = device.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              key={device.id}
              onClick={() => onSelect(device)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(device);
                }
              }}
              className={cn(
                ITEM_BASE_CLASS,
                isSelected ? ITEM_SELECTED_CLASS : ITEM_DEFAULT_CLASS
              )}
            >
              <div className="relative shrink-0">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                    isSelected ? 'bg-green-500/20 text-green-500' : 'bg-[#0a0a0a] text-slate-500'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block font-bold text-sm transition-colors',
                    isSelected ? 'text-white' : 'text-slate-300'
                  )}
                >
                  {device.name}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 line-clamp-2">{device.desc}</span>
              </div>
              {isSelected && (
                <div className="ml-auto shrink-0">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-3 w-3 text-white" />
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

  const platformsMap = useMemo(
    () => getIptvDevicePlatformsMap(siteData?.iptvFlowDevicesData),
    [siteData?.iptvFlowDevicesData]
  );

  const filteredApps = useMemo(() => {
    const raw = siteData?.appsData;
    const allApps = Array.isArray(raw) ? raw : [];
    if (!selectedDevice) return [];

    const allowedPlatforms = platformsMap[selectedDevice.id];
    if (!allowedPlatforms?.length) return [];
    return allApps.filter((app) => app.platforms?.some((p) => allowedPlatforms.includes(p)));
  }, [selectedDevice, siteData, platformsMap]);

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
                 role="button"
                 tabIndex={0}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault();
                     onSelect(app);
                   }
                 }}
                 className={cn(
                   ITEM_BASE_CLASS,
                   isSelected ? ITEM_SELECTED_CLASS : ITEM_DEFAULT_CLASS
                 )}
               >
                 <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] flex items-center justify-center shrink-0 overflow-hidden border border-slate-700 shadow-inner">
                    {app.logo ? (
                        <img src={app.logo} alt={`${app.name} uygulama logosu`} className="w-full h-full object-cover" />
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
          <div className="col-span-full py-8 text-center bg-[#0a0a0a]/30 rounded-xl border border-dashed border-slate-700">
            <Search className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Özel bir uygulama bulunamadı.</p>
          </div>
        )}
        
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           onClick={() => onSelect({ id: 'generic', name: 'Diğer / Bilmiyorum' })}
           role="button"
           tabIndex={0}
           onKeyDown={(e) => {
             if (e.key === 'Enter' || e.key === ' ') {
               e.preventDefault();
               onSelect({ id: 'generic', name: 'Diğer / Bilmiyorum' });
             }
           }}
           className={cn(
             ITEM_BASE_CLASS,
             selectedApp?.id === 'generic' ? ITEM_SELECTED_CLASS : ITEM_DEFAULT_CLASS
           )}
         >
            <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] flex items-center justify-center shrink-0 border border-slate-700">
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
export const TestDetailsForm = ({ formData, onChange, setIsValid, selectedDevice }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const needsTvBrand = Boolean(selectedDevice?.needsTvBrand);

  const validate = (data) => {
    const newErrors = {};
    if (!data.username || data.username.length < 3) {
      newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır.";
    } else if (!/^[a-zA-Z0-9\s\-_ğüşıöçĞÜŞİÖÇ]+$/.test(data.username)) {
      newErrors.username = "Sadece harf, rakam ve tire/alt çizgi kullanabilirsiniz.";
    }

    if (needsTvBrand && (!data.tv_brand || data.tv_brand.trim().length < 2)) {
      newErrors.tv_brand = "TV marka/model bilgisi zorunludur.";
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
  }, [formData, setIsValid, needsTvBrand]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-right-4 duration-500 sm:space-y-4 sm:pt-2">
      <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="username" className="ml-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
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
                "h-11 border-slate-800 bg-[#0a0a0a]/50 pl-4 pr-12 text-base text-white transition-all placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 sm:h-12 sm:text-lg",
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

      {needsTvBrand && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label htmlFor="tv_brand" className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 flex items-center gap-2">
              <Tv className="w-3 h-3" /> TV Marka / Model <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="tv_brand"
              value={formData.tv_brand || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 80) onChange('tv_brand', val);
              }}
              onBlur={() => handleBlur('tv_brand')}
              className={cn(
                "bg-[#0a0a0a]/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 h-14 text-lg pl-4 pr-12 transition-all",
                touched.tv_brand && errors.tv_brand && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Örn: Samsung, LG, Arçelik, TCL, Vestel"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
              {(formData.tv_brand || '').length}/80
            </div>
          </div>
          {touched.tv_brand && errors.tv_brand && (
            <div className="flex items-center gap-2 text-red-400 text-xs pl-1 animate-in slide-in-from-top-1">
              <AlertCircle className="w-3 h-3" />
              {errors.tv_brand}
            </div>
          )}
        </div>
      )}

      <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="note" className="ml-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
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
              className="min-h-[72px] resize-none border-slate-800 bg-[#0a0a0a]/50 p-3 text-sm text-white placeholder:text-slate-600 focus:border-green-500/50 focus:ring-green-500/20 sm:min-h-[96px] sm:p-4 sm:text-base"
              rows={3}
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