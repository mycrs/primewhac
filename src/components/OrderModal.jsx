import React, { useState, useEffect, useMemo } from 'react';
import { Send, Smartphone, Tv, Monitor, Tablet, Check, AppWindow, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderModal } from '@/contexts/OrderModalContext';
import { useSiteData } from '@/hooks/useSiteData';

const OrderModal = ({ contactData, packagesData }) => {
  const { isOpen, closeModal, selectedPackage, isTest } = useOrderModal();
  const { siteData } = useSiteData();
  
  // State for selections and form inputs
  const [selectedDevice, setSelectedDevice] = useState('');
  const [internalSelectedPackageId, setInternalSelectedPackageId] = useState('');
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedApps, setSelectedApps] = useState([]);

  // Combine all packages for the dropdown if needed
  const allPackages = useMemo(() => {
    if (!packagesData) return [];
    const tr = packagesData.turkiye || [];
    const eu = packagesData.avrupa || [];
    if (Array.isArray(packagesData)) return packagesData;
    return [...tr, ...eu];
  }, [packagesData]);

  // Reset or initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDevice('');
      setUsername('');
      setNotes('');
      setSelectedApps([]);
      if (selectedPackage) {
        setInternalSelectedPackageId(selectedPackage.id || selectedPackage.price);
      } else {
        setInternalSelectedPackageId('');
      }
    }
  }, [isOpen, selectedPackage]);

  // Reset selected apps when device changes
  useEffect(() => {
    setSelectedApps([]);
  }, [selectedDevice]);

  const devices = [
    { id: 'Smart TV', label: 'Smart TV', icon: Tv },
    { id: 'Apple (iOS)', label: 'iOS (Apple)', icon: Smartphone },
    { id: 'Android', label: 'Android', icon: Tablet },
    { id: 'PC / Laptop', label: 'PC / Laptop', icon: Monitor }
  ];

  const platformMap = {
    'Smart TV': 'smarttv',
    'Apple (iOS)': 'ios',
    'Android': 'android',
    'PC / Laptop': 'pc'
  };

  // Filter apps based on selected device
  const filteredApps = useMemo(() => {
    if (!selectedDevice || !siteData?.appsData) return [];
    const platformKey = platformMap[selectedDevice];
    // Sort so recommended apps appear first
    return [...siteData.appsData]
      .filter(app => app.platforms?.includes(platformKey))
      .sort((a, b) => (b.recommended === true) - (a.recommended === true));
  }, [selectedDevice, siteData]);

  const toggleApp = (appName) => {
    setSelectedApps(prev => 
      prev.includes(appName) 
        ? prev.filter(n => n !== appName)
        : [...prev, appName]
    );
  };

  const getPackageDetails = () => {
    let pkg = selectedPackage;
    if (!pkg && internalSelectedPackageId) {
      pkg = allPackages.find(p => (p.id || p.price) === internalSelectedPackageId);
    }
    return pkg;
  };

  const getDeviceName = () => {
    const deviceObj = devices.find(d => d.id === selectedDevice);
    return deviceObj ? deviceObj.label : (selectedDevice || "Belirtilmedi");
  };

  // Main WhatsApp Handler
  const handleSpecificWhatsApp = () => {
    // 1. Get Data
    const pkg = getPackageDetails();
    const pkgName = pkg ? (pkg.name || pkg.title || pkg.duration || "Paket") : "Seçilmedi";
    // Remove "TL" from price if present to avoid double "TL TL"
    const rawPrice = pkg ? (pkg.price || "0") : "0";
    const priceValue = rawPrice.toString().replace(/\s*TL\s*/i, '').trim();
    
    const deviceName = getDeviceName();
    const currentUsername = username || "Belirtilmedi";
    
    // Combine Package Name with Selected Apps for the "Paket" field if apps are selected
    let packageDisplay = pkgName;
    if (selectedApps.length > 0) {
      packageDisplay += ` (${selectedApps.join(', ')})`;
    }

    // 2. Format Message
    const message = `Selam! 👋

*SİPARİŞ TALEBİ*

📦 *Paket:* ${packageDisplay}
💰 *Fiyat:* ${priceValue} TL
📱 *Cihaz:* ${deviceName}
👤 *Kullanıcı Adı:* ${currentUsername}
${notes ? `📝 *Özel Not:* ${notes}\n` : ''}
Lütfen beni arayın veya WhatsApp'tan cevap verin.

Teşekkürler! 🙏`;

    // 3. Encode and Redirect (Instant)
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send/?phone=447542953987&text=${encodedMessage}`;
    
    // Open in new tab immediately
    window.open(url, '_blank');
    
    // Close modal immediately
    closeModal();
  };

  const isFormValid = selectedDevice && (selectedPackage || internalSelectedPackageId) && username;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="w-[95%] max-w-lg sm:max-w-[550px] bg-slate-950 border-slate-800 text-white p-0 gap-0 overflow-hidden shadow-2xl z-[9999] max-h-[90vh] flex flex-col rounded-xl">
        
        {/* Header Section */}
        <div className={cn(
          "px-4 sm:px-6 py-4 sm:py-5 text-center border-b border-slate-800 shrink-0",
          isTest ? "bg-green-900/10" : "bg-purple-900/10"
        )}>
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-black flex items-center justify-center gap-2 mb-1">
              {isTest ? (
                <span className="text-white">Ücretsiz Test Al</span>
              ) : (
                <span className="text-white">Satın Al</span>
              )}
            </DialogTitle>
            <DialogDescription className="text-amber-400 font-medium text-xs sm:text-sm">
               Hemen deneme yayınını oluşturun
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Package Selection Display (Only if not pre-selected) */}
           {!selectedPackage && (
             <div className="space-y-2">
               <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1">
                 Paket Seçimi
               </Label>
               <Select
                  value={internalSelectedPackageId}
                  onValueChange={setInternalSelectedPackageId}
                >
                  <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-white h-12 rounded-lg px-4 text-sm focus:ring-purple-500/20">
                    <SelectValue placeholder="Paket Seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white max-h-[250px]">
                    {allPackages.map((pkg, idx) => (
                      <SelectItem key={pkg.id || idx} value={pkg.id || pkg.price} className="cursor-pointer focus:bg-slate-800">
                        <span className="font-medium">{pkg.duration}</span>
                        <span className="ml-2 text-slate-400">- {pkg.price}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
           )}

          {/* 1. Device Selection */}
          <div className="space-y-2">
            <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1">
              1. CİHAZ SEÇİMİ
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {devices.map((device) => {
                const isSelected = selectedDevice === device.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className={cn(
                      "relative flex flex-row sm:flex-col items-center justify-start sm:justify-center p-3 sm:p-2 rounded-lg border transition-all duration-200 gap-3 sm:gap-1 group h-14 sm:h-20",
                      isSelected 
                        ? (isTest 
                            ? "bg-slate-800 border-green-500 shadow-[0_0_10px_-4px_rgba(34,197,94,0.5)]" 
                            : "bg-slate-800 border-purple-500 shadow-[0_0_10px_-4px_rgba(168,85,247,0.5)]")
                        : "bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-600"
                    )}
                  >
                    <div className="relative shrink-0">
                        <device.icon className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                        isSelected 
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-300"
                        )} />
                    </div>
                    
                    <span className={cn(
                      "text-sm sm:text-[10px] font-medium leading-tight",
                      isSelected ? "text-white" : "text-slate-400"
                    )}>
                      {device.label.replace(' (Apple)', '').replace(' / Laptop', '')}
                    </span>
                    
                    {isSelected && (
                      <div className="ml-auto sm:hidden">
                        <Check className={cn("w-4 h-4", isTest ? "text-green-500" : "text-purple-500")} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Username Input */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1">
                2. İstediğiniz Kullanıcı Adı
            </Label>
            <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı adı giriniz"
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 h-12 focus:border-slate-600 focus:ring-0 text-base"
            />
          </div>

          {/* 3. Special Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1">
                3. Özel Not (Opsiyonel)
            </Label>
            <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Varsa notunuz..."
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 min-h-[80px] sm:min-h-[60px] resize-none focus:border-slate-600 focus:ring-0 text-base"
            />
          </div>

          {/* 4. Used Programs Section */}
          {selectedDevice && filteredApps.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 block">
                    4. Kullanılan Programlar
                </Label>
                <div className="bg-slate-900/30 rounded-xl border border-slate-800/50 p-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredApps.map((app) => {
                            const isSelected = selectedApps.includes(app.name);
                            return (
                                <div 
                                    key={app.id}
                                    onClick={() => toggleApp(app.name)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 sm:p-2 rounded-lg cursor-pointer border transition-all duration-200",
                                        isSelected 
                                            ? "bg-slate-800 border-slate-600" 
                                            : "bg-slate-950/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 sm:w-4 sm:h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                        isSelected
                                            ? (isTest ? "bg-green-600 border-green-600" : "bg-purple-600 border-purple-600")
                                            : "border-slate-600"
                                    )}>
                                        {isSelected && <Check className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white" />}
                                    </div>
                                    
                                    <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden border border-slate-800">
                                        {app.logo ? (
                                            <img src={app.logo} alt={app.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <AppWindow className="w-4 h-4 text-slate-500" />
                                        )}
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <span className={cn(
                                            "text-sm sm:text-xs font-medium truncate",
                                            isSelected ? "text-white" : "text-slate-300"
                                        )}>
                                            {app.name}
                                        </span>
                                        {app.recommended && (
                                            <span className="text-[10px] sm:text-[9px] text-amber-400 font-medium">Önerilen</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 pb-2 flex gap-3 mt-auto">
            <Button 
                onClick={handleSpecificWhatsApp}
                disabled={!isFormValid}
                className={cn(
                  "flex-1 font-bold h-12 sm:h-12 text-sm shadow-lg transition-all relative overflow-hidden bg-green-600 hover:bg-green-700 text-white",
                  !isFormValid && "opacity-50 cursor-not-allowed",
                )}
            >
                <MessageCircle className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
                <span>WhatsApp ile İste</span>
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;