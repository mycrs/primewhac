import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Tv, Monitor, Tablet, Watch, 
  Instagram, Youtube, Chrome, Compass, 
  Music, MessageCircle, Clapperboard, 
  Film, Sparkles, Globe, AppWindow, Flame,
  CheckCircle2, ArrowLeft, Send, Loader2, Info, AlertCircle, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { submitToWordpress } from '@/utils/wpApi';
import { defaultData } from '@/data/defaultSiteData';
import { showPublicMaintenanceToastOnce } from '@/utils/supabaseMaintenanceToast';

// --- Static Data Configuration ---
const devices = [
  { id: 'ios', name: 'iOS', category: 'iOS', icon: Smartphone, color: 'from-gray-700 to-[#141414]' },
  { id: 'android', name: 'Android', category: 'Android', icon: Smartphone, color: 'from-green-600 to-green-800' },
  { id: 'tv', name: 'Smart TV', category: 'TV', icon: Tv, color: 'from-[#e50914] to-[#b20710]' },
  { id: 'android-tv', name: 'Android TV', category: 'Android TV', icon: Tv, color: 'from-[#e50914] to-[#b20710]' },
  { id: 'pc', name: 'PC / Laptop', category: 'PC', icon: Monitor, color: 'from-[#e50914] to-[#b20710]' },
  { id: 'tablet', name: 'Tablet', category: 'Tablet', icon: Tablet, color: 'from-[#e50914] to-[#b20710]' },
  { id: 'watch', name: 'Watch', category: 'Smart Watch', icon: Watch, color: 'from-orange-600 to-orange-800' },
];

const appsConfig = {
  ios: [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
    { id: 'tiktok', name: 'TikTok', icon: Music },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'spotify', name: 'Spotify', icon: Music },
  ],
  android: [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
    { id: 'tiktok', name: 'TikTok', icon: Music },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'spotify', name: 'Spotify', icon: Music },
  ],
  tv: [
    { id: 'netflix', name: 'Netflix', icon: Clapperboard },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'prime', name: 'Prime Video', icon: Film },
    { id: 'disney', name: 'Disney+', icon: Sparkles },
  ],
  'android-tv': [
    { id: 'netflix', name: 'Netflix', icon: Clapperboard },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'prime', name: 'Prime Video', icon: Film },
    { id: 'disney', name: 'Disney+', icon: Sparkles },
  ],
  pc: [
    { id: 'chrome', name: 'Chrome', icon: Chrome },
    { id: 'firefox', name: 'Firefox', icon: Flame },
    { id: 'edge', name: 'Edge', icon: Globe },
    { id: 'safari', name: 'Safari', icon: Compass },
  ],
  tablet: [
    { id: 'ipad-apps', name: 'iPad Apps', icon: AppWindow },
    { id: 'android-tab-apps', name: 'Android Apps', icon: AppWindow },
  ],
  watch: [
    { id: 'apple-watch', name: 'Apple Watch', icon: Watch },
    { id: 'wear-os', name: 'Wear OS', icon: Watch },
  ]
};

const DeviceAppSelectionForm = ({ siteData }) => {
  const { toast } = useToast();
  
  // State Management
  const [step, setStep] = useState(1); // 1: Device, 2: App, 3: Info
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [category, setCategory] = useState('');
  const [username, setUsername] = useState('');
  const [note, setNote] = useState('');
  
  // Submission Status: 'idle', 'loading', 'success', 'error'
  const [status, setStatus] = useState('idle');
  
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step]);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    setCategory(device.category);
    setTimeout(() => setStep(2), 300);
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setTimeout(() => setStep(3), 300);
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedDevice(null);
      setCategory('');
      setStep(1);
    } else if (step === 3) {
      setSelectedApp(null);
      setStep(2);
      setStatus('idle');
    }
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      toast({
        variant: "destructive",
        title: "Kullanıcı Adı Gerekli",
        description: "Lütfen devam etmek için bir kullanıcı adı giriniz."
      });
      return;
    }

    setStatus('loading');

    try {
      const contactInfo = siteData?.contact_info || siteData?.contactData || defaultData?.contactData || {};
      const whatsappNumber = (contactInfo?.whatsapp || contactInfo?.phone || '').replace(/\D/g, '') || (import.meta.env.VITE_WHATSAPP_PHONE || '').replace(/\D/g, '') || '4916345869030';
      const result = await submitToWordpress({
        deviceType: selectedDevice?.name,
        category: category,
        appName: selectedApp?.name,
        username,
        specialNote: note,
        whatsappNumber
      });

      if (result.success) {
        setStatus('success');
        toast({
          title: "WhatsApp Yönlendiriliyor",
          description: "Mesajınızı göndermek için WhatsApp açılıyor...",
          className: "bg-green-600 text-white border-none"
        });
        
        setTimeout(() => {
            setStep(1);
            setSelectedDevice(null);
            setCategory('');
            setSelectedApp(null);
            setUsername('');
            setNote('');
            setStatus('idle');
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      showPublicMaintenanceToastOnce(toast);
    }
  };

  // --- Animation Variants ---
  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 30 : -30, opacity: 0 }),
  };

  const currentApps = selectedDevice ? (appsConfig[selectedDevice.id] || []) : [];

  return (
    <div ref={topRef} className="w-full max-w-5xl mx-auto min-h-[600px] flex flex-col bg-[#0a0a0a]/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative backdrop-blur-sm">
      
      {/* Progress / Step Indicators */}
      <div className="bg-[#0a0a0a]/80 p-6 border-b border-slate-800">
         <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#0a0a0a] -z-0 rounded-full" />
            <div 
                className="absolute top-1/2 left-0 h-1 bg-green-600 -z-0 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            />

            {[1, 2, 3].map((s) => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                    <div 
                        className={`
                           w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4
                           ${step >= s 
                             ? "bg-green-600 border-slate-950 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110" 
                             : "bg-[#0a0a0a] border-slate-950 text-slate-500"
                           }
                        `}
                    >
                        {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    <span className={`text-xs font-semibold ${step >= s ? "text-green-400" : "text-slate-600"}`}>
                        {s === 1 ? 'Cihaz' : s === 2 ? 'Uygulama' : 'Bilgiler'}
                    </span>
                </div>
            ))}
         </div>
      </div>

      <div className="flex-1 p-6 md:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          
          {/* STEP 1: DEVICE SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full flex flex-col"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Hangi cihazı kullanıyorsunuz?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                 {devices.map((device) => (
                    <motion.button
                       key={device.id}
                       onClick={() => handleDeviceSelect(device)}
                       whileHover={{ scale: 1.03, y: -4 }}
                       whileTap={{ scale: 0.96 }}
                       className={`
                          group relative flex flex-col items-center justify-center p-6 rounded-xl overflow-hidden shadow-lg transition-all
                          bg-gradient-to-br ${device.color} border border-white/10 hover:border-white/30 hover:shadow-2xl h-[160px]
                       `}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                        <div className="relative z-10 p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                             <device.icon size={32} className="text-white" />
                        </div>
                        <span className="relative z-10 text-lg font-bold text-white tracking-wide">
                            {device.name}
                        </span>
                        {selectedDevice?.id === device.id && (
                           <div className="absolute top-3 right-3 text-white">
                              <CheckCircle2 className="w-6 h-6 fill-green-500 text-white" />
                           </div>
                        )}
                    </motion.button>
                 ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: APP SELECTION */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full flex flex-col"
            >
               <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
                   <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Geri
                   </Button>
                   <h2 className="text-2xl font-bold text-white text-center flex-1 pr-12">
                     <span className="text-green-400">{selectedDevice?.name}</span> için Uygulama
                   </h2>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto w-full">
                  {currentApps.map((app) => (
                      <motion.button
                        key={app.id}
                        onClick={() => handleAppSelect(app)}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                           group flex flex-col items-center justify-center p-6 rounded-xl 
                           bg-[#0a0a0a] border border-slate-700 hover:border-green-500 hover:bg-[#0a0a0a] 
                           shadow-lg hover:shadow-green-500/20 transition-all h-[150px] relative overflow-hidden
                        "
                      >
                         <div className="p-3 rounded-xl bg-[#0a0a0a] text-slate-300 group-hover:bg-green-500 group-hover:text-white transition-colors mb-4 duration-300">
                            <app.icon size={32} />
                         </div>
                         <span className="font-bold text-slate-200 group-hover:text-white transition-colors">
                            {app.name}
                         </span>
                      </motion.button>
                  ))}
               </div>
            </motion.div>
          )}

          {/* STEP 3: USER INFO & ERROR HANDLING */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="h-full flex flex-col max-w-xl mx-auto w-full"
            >
                <div className="mb-8">
                    <Button variant="ghost" onClick={handleBack} className="text-slate-400 hover:text-white mb-4 -ml-4 group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Uygulamalara Dön
                   </Button>
                   
                   <div className="bg-gradient-to-r from-[#0a0a0a] to-[#141414] p-6 rounded-2xl border border-slate-700 flex items-center gap-6 shadow-inner">
                        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#0a0a0a] border border-slate-800 text-green-400 shadow-lg shrink-0">
                             {selectedApp && <selectedApp.icon size={32} />}
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                                <Info className="w-3 h-3" /> Seçim Özeti
                            </div>
                            <div className="text-xl font-bold text-white flex items-center flex-wrap gap-2">
                                {category} <span className="text-slate-600">-</span> {selectedDevice?.name} 
                                <span className="text-slate-600">/</span> 
                                <span className="text-green-400">{selectedApp?.name}</span>
                            </div>
                        </div>
                   </div>
                </div>

                <div className="space-y-6 bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800">
                    
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-slate-300 font-bold">Adınız Soyadınız</Label>
                        <Input 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={status === 'loading'}
                            placeholder="Örn: Mehmet Demir"
                            className="bg-[#0a0a0a] border-slate-700 h-12 text-white placeholder:text-slate-600 focus:ring-green-500/50 focus:border-green-500"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-slate-300 font-bold">Özel Notunuz (Opsiyonel)</Label>
                        <Textarea 
                            id="notes"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={status === 'loading'}
                            placeholder="Eklemek istedikleriniz..."
                            className="bg-[#0a0a0a] border-slate-700 min-h-[120px] text-white placeholder:text-slate-600 focus:ring-green-500/50 focus:border-green-500 resize-none p-4"
                        />
                    </div>

                    <div className="pt-2">
                        <Button 
                            onClick={handleSubmit}
                            disabled={status === 'loading' || !username}
                            className={`
                                w-full h-12 font-bold text-lg shadow-lg transition-all rounded-xl
                                ${username && status !== 'loading'
                                    ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-green-500/25 hover:scale-[1.01]" 
                                    : "bg-[#0a0a0a] text-slate-500 cursor-not-allowed"
                                }
                            `}
                        >
                            {status === 'loading' ? (
                                <>
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                  Yönlendiriliyor...
                                </>
                            ) : (
                                <>
                                  WhatsApp ile Gönder <Send className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeviceAppSelectionForm;