import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, AppWindow, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import LivingRegionSelect, { getLivingRegionWhatsAppLine } from '@/components/LivingRegionSelect';
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
import { useToast } from '@/components/ui/use-toast';
import TurkeyPackageWhatsAppWarningDialog from '@/components/packages/TurkeyPackageWhatsAppWarningDialog';
import { shouldShowTurkeyPackageWhatsAppWarning } from '@/utils/turkeyPackageWhatsAppGate';
import {
  getIptvFlowDevices,
  getIptvDevicePlatformsMap,
  getIptvDeviceIdsNeedingTvBrand,
} from '@/constants/iptvFlowDevices';

const OrderModal = ({ contactData, packagesData }) => {
  const { isOpen, closeModal, selectedPackage, isTest } = useOrderModal();
  const { siteData } = useSiteData();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const isDe = location.pathname.startsWith('/de');
  const [turkeyWarningOpen, setTurkeyWarningOpen] = useState(false);

  // State for selections and form inputs
  const [livingRegion, setLivingRegion] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [internalSelectedPackageId, setInternalSelectedPackageId] = useState('');
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedApps, setSelectedApps] = useState([]);
  const [tvBrand, setTvBrand] = useState('');

  const tvBrandDeviceIds = useMemo(
    () => getIptvDeviceIdsNeedingTvBrand(siteData?.iptvFlowDevicesData),
    [siteData?.iptvFlowDevicesData]
  );
  const needsTvBrand = tvBrandDeviceIds.includes(selectedDevice);

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
      setLivingRegion('');
      setSelectedDevice('');
      setUsername('');
      setNotes('');
      setSelectedApps([]);
      setTvBrand('');
      if (selectedPackage) {
        setInternalSelectedPackageId(selectedPackage.id || selectedPackage.price);
      } else {
        setInternalSelectedPackageId('');
      }
    }
  }, [isOpen, selectedPackage]);

  useEffect(() => {
    if (!isOpen) setTurkeyWarningOpen(false);
  }, [isOpen]);

  // Reset selected apps when device changes
  useEffect(() => {
    setSelectedApps([]);
  }, [selectedDevice]);

  const devices = useMemo(
    () => getIptvFlowDevices(isDe ? 'de' : 'tr', siteData?.iptvFlowDevicesData),
    [isDe, siteData?.iptvFlowDevicesData]
  );

  const platformsMap = useMemo(
    () => getIptvDevicePlatformsMap(siteData?.iptvFlowDevicesData),
    [siteData?.iptvFlowDevicesData]
  );

  // Filter apps based on selected device (çoklu platform; test sayfası ile aynı mantık)
  const filteredApps = useMemo(() => {
    if (!selectedDevice || !siteData?.appsData) return [];
    const raw = siteData.appsData;
    const list = Array.isArray(raw) ? raw : [];
    const allowed = platformsMap[selectedDevice];
    if (!allowed?.length) return [];
    return list
      .filter((app) => app.platforms?.some((p) => allowed.includes(p)))
      .sort((a, b) => (b.recommended === true) - (a.recommended === true));
  }, [selectedDevice, siteData, platformsMap]);

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
    const deviceObj = devices.find((d) => d.id === selectedDevice);
    return deviceObj ? deviceObj.name : (selectedDevice || (isDe ? 'Nicht angegeben' : 'Belirtilmedi'));
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

    const livingLine = getLivingRegionWhatsAppLine(livingRegion, isDe ? 'de' : 'tr');

    const tvBrandLine = needsTvBrand && tvBrand ? `📺 *TV Marka/Model:* ${tvBrand}` : '';

    // 2. Format Message - TR or DE based on current language
    const currency = isDe ? '€' : 'TL';
    const message = isDe
      ? `Hallo! 👋

*BESTELLANFRAGE*

${livingLine ? `${livingLine}\n\n` : ''}📦 *Paket:* ${packageDisplay}
💰 *Preis:* ${priceValue} ${currency}
📱 *Gerät:* ${deviceName}
${tvBrandLine ? `${tvBrandLine}\n` : ''}👤 *Benutzername:* ${currentUsername}
${notes ? `📝 *Notiz:* ${notes}\n` : ''}
Bitte rufen Sie mich an oder antworten Sie über WhatsApp.

Danke! 🙏`
      : `Selam! 👋

*SİPARİŞ TALEBİ*

${livingLine ? `${livingLine}\n\n` : ''}📦 *Paket:* ${packageDisplay}
💰 *Fiyat:* ${priceValue} ${currency}
📱 *Cihaz:* ${deviceName}
${tvBrandLine ? `${tvBrandLine}\n` : ''}👤 *Kullanıcı Adı:* ${currentUsername}
${notes ? `📝 *Özel Not:* ${notes}\n` : ''}
Lütfen beni arayın veya WhatsApp'tan cevap verin.

Teşekkürler! 🙏`;

    // 3. Encode and Redirect - Öncelik: Admin panel > .env VITE_WHATSAPP_PHONE
    const encodedMessage = encodeURIComponent(message);
    const fromAdmin = String(
      contactData?.whatsapp ?? siteData?.contact_info?.whatsapp ?? siteData?.contactData?.whatsapp ?? ''
    ).replace(/\D/g, '');
    const waNum = fromAdmin || String(import.meta.env.VITE_WHATSAPP_PHONE || '').replace(/\D/g, '');
    if (!waNum) {
      toast({ variant: 'destructive', title: 'WhatsApp Numarası Eksik', description: 'Lütfen admin panelinden İletişim Bilgileri veya Sistem Ayarları bölümüne WhatsApp numarası ekleyin.' });
      return;
    }
    const url = `https://api.whatsapp.com/send/?phone=${waNum}&text=${encodedMessage}`;
    
    // Open in new tab immediately
    window.open(url, '_blank');
    
    // Close modal immediately
    closeModal();
  };

  const requestWhatsApp = () => {
    const pkg = getPackageDetails();
    if (
      shouldShowTurkeyPackageWhatsAppWarning({
        pathname: location.pathname,
        isDeSite: isDe,
        pkg,
        isTestFlow: isTest,
        livingRegion,
      })
    ) {
      setTurkeyWarningOpen(true);
      return;
    }
    handleSpecificWhatsApp();
  };

  const handleTurkeyWarningContinue = () => {
    setTurkeyWarningOpen(false);
    handleSpecificWhatsApp();
  };

  const handleTurkeyWarningGoEurope = () => {
    setTurkeyWarningOpen(false);
    closeModal();
    navigate(isDe ? '/de/pakete' : '/paketler');
  };

  const isFormValid = livingRegion && selectedDevice && (selectedPackage || internalSelectedPackageId) && username && (!needsTvBrand || tvBrand.trim());

  return (
    <>
    <TurkeyPackageWhatsAppWarningDialog
      open={turkeyWarningOpen}
      variant={isTest ? 'test' : 'package'}
      onContinue={handleTurkeyWarningContinue}
      onGoEurope={handleTurkeyWarningGoEurope}
    />
    <Dialog open={isOpen} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent className="z-[9999] flex max-h-[calc(100dvh-1rem)] min-h-0 w-[95%] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border-slate-800 bg-[#0a0a0a] p-0 text-white shadow-2xl sm:max-h-[90vh] sm:max-w-[550px]">
        
        {/* Header Section */}
        <div className={cn(
          "px-4 sm:px-6 py-4 sm:py-5 text-center border-b border-slate-800 shrink-0",
          isTest ? "bg-green-900/10" : "bg-primary/10"
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
              {isTest
                ? (isDe ? 'Erstellen Sie jetzt Ihren kostenlosen Test' : 'Hemen deneme yayınını oluşturun')
                : (isDe ? 'Wählen Sie Ihr Paket und kaufen Sie jetzt' : 'Paketinizi seçin ve hemen satın alın')
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch] sm:space-y-5 sm:p-6 custom-scrollbar">
          
          {/* 0. Yaşam bölgesi (zorunlu) */}
          <LivingRegionSelect
            value={livingRegion}
            onChange={setLivingRegion}
            lang={isDe ? 'de' : 'tr'}
            isTest={isTest}
          />

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
                  <SelectTrigger className="w-full bg-[#0a0a0a] border-slate-800 text-white h-12 rounded-lg px-4 text-sm focus:ring-primary/20">
                    <SelectValue placeholder="Paket Seçiniz" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-slate-800 text-white max-h-[250px]">
                    {allPackages.map((pkg, idx) => (
                      <SelectItem key={pkg.id || idx} value={pkg.id || pkg.price} className="cursor-pointer focus:bg-[#0a0a0a]">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {devices.map((device) => {
                const isSelected = selectedDevice === device.id;
                const DeviceIcon = device.icon;
                return (
                  <button
                    key={device.id}
                    type="button"
                    title={device.desc}
                    onClick={() => setSelectedDevice(device.id)}
                    className={cn(
                      'group relative flex min-h-[4.25rem] flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center transition-all duration-200 sm:min-h-[5.5rem] sm:p-2.5',
                      isSelected
                        ? isTest
                          ? 'border-green-500 bg-[#0a0a0a] shadow-[0_0_10px_-4px_rgba(34,197,94,0.5)]'
                          : 'border-primary bg-[#0a0a0a] shadow-[0_0_10px_-4px_rgba(229,9,20,0.5)]'
                        : 'border-slate-800 bg-[#0a0a0a]/50 hover:border-slate-600 hover:bg-[#0a0a0a]'
                    )}
                  >
                    <DeviceIcon
                      className={cn(
                        'h-5 w-5 shrink-0 transition-colors sm:h-6 sm:w-6',
                        isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                      )}
                    />
                    <span
                      className={cn(
                        'line-clamp-2 text-[10px] font-semibold leading-tight sm:text-[9px]',
                        isSelected ? 'text-white' : 'text-slate-400'
                      )}
                    >
                      {device.name}
                    </span>
                    {isSelected && (
                      <Check className={cn('absolute right-1.5 top-1.5 h-3.5 w-3.5 sm:hidden', isTest ? 'text-green-500' : 'text-primary')} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TV Marka/Model (Smart TV veya Android TV seçildiğinde zorunlu) */}
          {needsTvBrand && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="tvBrand" className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 flex items-center gap-1">
                📺 TV Marka / Model <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tvBrand"
                value={tvBrand}
                onChange={(e) => setTvBrand(e.target.value)}
                placeholder="Örn: Samsung, LG, Arçelik, TCL, Vestel"
                className="bg-[#0a0a0a]/50 border-slate-800 text-white placeholder:text-slate-600 h-12 focus:border-slate-600 focus:ring-0 text-base"
              />
            </div>
          )}

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
                className="bg-[#0a0a0a]/50 border-slate-800 text-white placeholder:text-slate-600 h-12 focus:border-slate-600 focus:ring-0 text-base"
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
                className="bg-[#0a0a0a]/50 border-slate-800 text-white placeholder:text-slate-600 min-h-[80px] sm:min-h-[60px] resize-none focus:border-slate-600 focus:ring-0 text-base"
            />
          </div>

          {/* 4. Used Programs Section */}
          {selectedDevice && filteredApps.length > 0 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 block">
                    4. Kullanılan Programlar
                </Label>
                <div className="bg-[#0a0a0a]/30 rounded-xl border border-slate-800/50 p-2 max-h-[200px] overflow-y-auto custom-scrollbar">
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
                                            ? "bg-[#0a0a0a] border-slate-600" 
                                            : "bg-[#0a0a0a]/50 border-slate-800 hover:bg-[#0a0a0a] hover:border-slate-700"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 sm:w-4 sm:h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                                        isSelected
                                            ? (isTest ? "bg-green-600 border-green-600" : "bg-primary border-primary")
                                            : "border-slate-600"
                                    )}>
                                        {isSelected && <Check className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-white" />}
                                    </div>
                                    
                                    <div className="w-8 h-8 rounded bg-[#0a0a0a] flex items-center justify-center shrink-0 overflow-hidden border border-slate-800">
                                        {app.logo ? (
                                            <img src={app.logo} alt={`${app.name} uygulama logosu`} className="w-full h-full object-cover" />
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
        </div>

        <div className="shrink-0 border-t border-slate-800/80 bg-[#0a0a0a]/98 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-6">
            <Button 
                onClick={requestWhatsApp}
                disabled={!isFormValid}
                className={cn(
                  "relative h-12 w-full overflow-hidden bg-green-600 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-700 sm:h-12",
                  !isFormValid && "cursor-not-allowed opacity-50",
                )}
            >
                <MessageCircle className="mr-2 h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                <span>WhatsApp ile İste</span>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default OrderModal;