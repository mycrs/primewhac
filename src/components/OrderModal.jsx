import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, AppWindow, ShoppingCart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import LivingRegionSelect, { getLivingRegionWhatsAppLine, isLivingRegionComplete } from '@/components/LivingRegionSelect';
import { getFlowApps } from '@/constants/iptvFlowApps';
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
import { openSupportWhatsApp, openSupportTelegram } from '@/utils/supportChannel';
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
  const [livingCountry, setLivingCountry] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [internalSelectedPackageId, setInternalSelectedPackageId] = useState('');
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedApps, setSelectedApps] = useState([]);
  const [customApp, setCustomApp] = useState('');
  const [tvBrand, setTvBrand] = useState('');

  const tvBrandDeviceIds = useMemo(
    () => getIptvDeviceIdsNeedingTvBrand(siteData?.iptvFlowDevicesData),
    [siteData?.iptvFlowDevicesData]
  );
  const needsTvBrand = tvBrandDeviceIds.includes(selectedDevice);
  const isTelegramOrder = (contactData?.order_channel || siteData?.contact_info?.order_channel) === 'telegram';

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
      setLivingCountry('');
      setSelectedDevice('');
      setUsername('');
      setNotes('');
      setSelectedApps([]);
      setCustomApp('');
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
    setCustomApp('');
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
    return getFlowApps(siteData?.appsData, selectedDevice, platformsMap);
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
    const apps = [...selectedApps, ...(customApp.trim() ? [customApp.trim()] : [])];
    if (apps.length > 0) {
      packageDisplay += ` (${apps.join(', ')})`;
    }

    const livingLine = getLivingRegionWhatsAppLine(livingRegion, isDe ? 'de' : 'tr', livingCountry);

    const tvBrandLine = needsTvBrand && tvBrand ? `📺 *TV Marka/Model:* ${tvBrand}` : '';

    const isTelegramOrder = (contactData?.order_channel || siteData?.contact_info?.order_channel) === 'telegram';

    // 2. Format Message - TR or DE based on current language
    const currency = isDe ? '€' : 'TL';
    const channelCallout = isTelegramOrder
      ? (isDe ? 'Bitte antworten Sie über Telegram.' : 'Lütfen Telegram üzerinden dönüş yapın.')
      : (isDe ? 'Bitte rufen Sie mich an oder antworten Sie über WhatsApp.' : 'Lütfen beni arayın veya WhatsApp\'tan cevap verin.');

    const message = isDe
      ? `Hallo! 👋

*BESTELLANFRAGE*

${livingLine ? `${livingLine}\n\n` : ''}📦 *Paket:* ${packageDisplay}
💰 *Preis:* ${priceValue} ${currency}
📱 *Gerät:* ${deviceName}
${tvBrandLine ? `${tvBrandLine}\n` : ''}👤 *Benutzername:* ${currentUsername}
${notes ? `📝 *Notiz:* ${notes}\n` : ''}
${channelCallout}

Danke! 🙏`
      : `Selam! 👋

*SİPARİŞ TALEBİ*

${livingLine ? `${livingLine}\n\n` : ''}📦 *Paket:* ${packageDisplay}
💰 *Fiyat:* ${priceValue} ${currency}
📱 *Cihaz:* ${deviceName}
${tvBrandLine ? `${tvBrandLine}\n` : ''}👤 *Kullanıcı Adı:* ${currentUsername}
${notes ? `📝 *Özel Not:* ${notes}\n` : ''}
${channelCallout}

Teşekkürler! 🙏`;

    // 3. Gönder — Admin ayarına göre Telegram veya WhatsApp
    const opened = isTelegramOrder
      ? openSupportTelegram({ siteData, contactData, message })
      : openSupportWhatsApp({ siteData, contactData, message });

    if (!opened) {
      toast({
        variant: 'destructive',
        title: 'Şu an bağlanılamadı',
        description: isTelegramOrder
          ? 'Telegram bağlantısı kurulamadı. Lütfen admin panelinden Telegram kullanıcı adını kontrol edin.'
          : 'WhatsApp bağlantısı kurulamadı. Lütfen birazdan tekrar deneyin veya info@qruzetv.com adresine yazın.',
      });
      return;
    }

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

  const isFormValid = isLivingRegionComplete(livingRegion, livingCountry) && selectedDevice && (selectedPackage || internalSelectedPackageId) && username && (!needsTvBrand || tvBrand.trim());

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
            country={livingCountry}
            onCountryChange={setLivingCountry}
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
          {selectedDevice && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <Label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1 block">
                    4. Kullanılan Programlar
                </Label>
                <div className="bg-[#0a0a0a]/30 rounded-xl border border-slate-800/50 p-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filteredApps.map((app) => {
                            const isSelected = selectedApps.includes(app.name);
                            return (
                                <button
                                    key={app.id}
                                    type="button"
                                    aria-pressed={isSelected}
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
                                        {app.platforms?.length > 0 && <span className="text-[10px] text-slate-400">{app.platforms.join(' · ')}</span>}
                                        {app.recommended && (
                                            <span className="text-[10px] sm:text-[9px] text-amber-400 font-medium">Önerilen</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <p className="text-xs text-slate-400">{isDe ? 'Die Verfügbarkeit kann je nach Gerät und Land variieren.' : 'Uygulama mağazası seçenekleri cihaz modeline ve ülkeye göre değişebilir.'}</p>
                <Label htmlFor="order-custom-app" className="text-xs text-slate-300">{isDe ? 'Andere Anwendung (optional)' : 'Listede yoksa uygulama adını yazın (isteğe bağlı)'}</Label>
                <Input id="order-custom-app" value={customApp} onChange={(event) => setCustomApp(event.target.value)} maxLength={100} placeholder={isDe ? 'Name der Anwendung' : 'Uygulama adı'} className="h-11 border-slate-700 bg-[#0a0a0a] text-base text-white" />
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-800/80 bg-[#0a0a0a]/98 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-6">
            <Button 
                onClick={requestWhatsApp}
                disabled={!isFormValid}
                className={cn(
                  "relative h-12 w-full overflow-hidden text-sm font-bold text-white shadow-lg transition-all sm:h-12",
                  isTelegramOrder
                    ? "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-950/40"
                    : "bg-green-600 hover:bg-green-700 shadow-green-950/30",
                  !isFormValid && "cursor-not-allowed opacity-50",
                )}
            >
                {isTelegramOrder ? (
                  <Send className="mr-2 h-4 w-4 shrink-0 -translate-x-0.5" />
                ) : (
                  <ShoppingCart className="mr-2 h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                )}
                <span>
                  {isTest
                    ? (isTelegramOrder
                        ? (isDe ? 'Telegram ile Test Talebi Gönder' : 'Telegram ile Test Talebi Gönder')
                        : (isDe ? 'Testanfrage über WhatsApp' : 'Test Talebini Gönder'))
                    : (isTelegramOrder
                        ? (isDe ? 'Telegram ile Sipariş Ver' : 'Telegram ile Sipariş Ver')
                        : (isDe ? 'Über WhatsApp bestellen' : 'WhatsApp ile Sipariş Ver'))}
                </span>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default OrderModal;
