import React, { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeaderDE from '@/components/HeaderDE';
import FooterDE from '@/components/FooterDE';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTestFormSubmit } from '@/hooks/useTestFormSubmit';
import { useWhatsAppIntegration } from '@/hooks/useWhatsAppIntegration';
import { toast } from '@/components/ui/use-toast';
import { SITE_URL } from '@/constants/siteUrl';

import DeviceSelectionStep from '@/components/test-page/DeviceSelectionStep';
import AppSelectionStep from '@/components/test-page/AppSelectionStep';
import TestFormDetailsStep from '@/components/test-page/TestFormDetailsStep';
import TestFormSummary from '@/components/test-page/TestFormSummary';

const TestPageDE = ({ siteData }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({ username: '', special_note: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { submitTestRequest, loading } = useTestFormSubmit();
  const { redirectToWhatsApp, isTelegram } = useWhatsAppIntegration();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
    if (selectedDevice?.id !== device.id) {
        setSelectedApp(null);
    }
    setTimeout(() => setStep(1), 300);
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setTimeout(() => setStep(2), 300);
  };

  const handleSubmit = async () => {
    const tvBrandInfo = formData.tv_brand ? ` (${formData.tv_brand})` : '';
    const requestData = {
      username: formData.username,
      device: selectedDevice?.name + tvBrandInfo,
      app: selectedApp?.name,
      note: formData.special_note
    };

    const dbData = {
      username: formData.username,
      special_note: formData.special_note,
      device_type: selectedDevice?.name + tvBrandInfo,
      app_name: selectedApp?.name,
      status: 'pending'
    };

    try {
      await submitTestRequest(dbData);
      
      setTimeout(() => {
          const redirected = redirectToWhatsApp(requestData);
          if (redirected) {
            toast({
              title: "Erfolgreich! 🎉",
              description: isTelegram ? "Weiterleitung zu Telegram..." : "Weiterleitung zu WhatsApp...",
              className: isTelegram ? "bg-sky-600 border-none text-white shadow-xl" : "bg-green-600 border-none text-white shadow-xl"
            });
          } else {
            toast({
              variant: "destructive",
              title: isTelegram ? "Telegram-Kontakt fehlt" : "WhatsApp-Nummer fehlt",
              description: isTelegram
                ? "Bitte konfigurieren Sie Telegram in den Admin-Einstellungen."
                : "Bitte fügen Sie die WhatsApp-Nummer in den Admin-Einstellungen hinzu."
            });
          }
      }, 1000);
    } catch (error) {
      toast({
          title: "Fehler",
          description: "Ein Problem ist aufgetreten. Bitte versuchen Sie es erneut.",
          variant: "destructive"
      });
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const seo = {
    title: 'IPTV kostenlos testen | QruzeTV',
    description: 'Testen Sie unseren Premium IPTV Service kostenlos! Mit unserem IPTV Test Deutschland können Sie eine stabile IPTV testen, ohne sich zu verpflichten. Unsere Premium IPTV Probe.',
    keywords: ['IPTV kostenlos testen', 'Premium IPTV Probe', 'IPTV Test Deutschland', 'stabile IPTV testen', '4K IPTV Service kostenlos'],
    canonicalUrl: `${SITE_URL}/de/test`,
  };

  return (
    <>
      <SEOHead {...seo} />

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans selection:bg-green-500/30 selection:text-green-200">
        <HeaderDE contactData={siteData?.contactData} />

        <main className="flex-grow pt-24 pb-20 px-4 relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-600/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto">
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => step === 0 ? navigate('/de') : prevStep()}
                        className="text-slate-400 hover:text-white hover:bg-[#0a0a0a]/50 pl-2 pr-4 rounded-full"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        {step === 0 ? "Zurück zur Startseite" : "Zurück"}
                    </Button>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        IPTV kostenlos testen - Premium IPTV Probe ohne Verpflichtung
                    </h1>
                    <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                        Testen Sie unseren Premium IPTV Service kostenlos! Mit unserem IPTV Test Deutschland können Sie eine stabile IPTV testen, ohne sich zu verpflichten. Unsere Premium IPTV Probe bietet Ihnen vollständigen Zugriff auf alle Funktionen, 4K Streaming und 10.000+ Kanäle - alles ohne Kreditkarte oder versteckte Gebühren.
                    </p>
                </div>

                <div className="mb-12 max-w-xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Welches Gerät verwenden Sie? - IPTV Test Deutschland</h2>
                        <p className="text-slate-400 text-sm">Um Ihnen das bestmögliche Erlebnis zu bieten, wenn Sie unser IPTV kostenlos testen, passen wir die Premium IPTV Probe genau auf Ihr Endgerät an. Egal ob Smart TV, Smartphone, PC oder Fire TV Stick – wählen Sie einfach Ihr Gerät aus, und wir liefern Ihnen die perfekt optimierten Zugangsdaten, damit Sie eine absolut stabile IPTV testen können.</p>
                    </div>

                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                        <span className={cn(step >= 0 && "text-green-500")}>Gerät</span>
                        <span className={cn(step >= 1 && "text-green-500")}>Anwendung</span>
                        <span className={cn(step >= 2 && "text-green-500")}>Details</span>
                        <span className={cn(step >= 3 && "text-green-500")}>Fertig</span>
                    </div>
                    <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-green-600 to-[#b20710]"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((step + 1) / 4) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                    <div className="text-center mt-2 text-slate-600 font-mono text-xs">
                        SCHRITT {step + 1} / 4
                    </div>
                </div>

                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 0 && (
                                <DeviceSelectionStep 
                                    selectedDevice={selectedDevice} 
                                    onSelect={handleDeviceSelect} 
                                />
                            )}
                            {step === 1 && (
                                <AppSelectionStep
                                    appsData={siteData?.appsData}
                                    selectedDevice={selectedDevice}
                                    selectedApp={selectedApp}
                                    onSelect={handleAppSelect}
                                />
                            )}
                            {step === 2 && (
                                <TestFormDetailsStep 
                                    formData={formData} 
                                    onChange={(key, val) => setFormData(prev => ({...prev, [key]: val}))} 
                                    setIsValid={setIsFormValid}
                                    selectedDevice={selectedDevice}
                                />
                            )}
                            {step === 3 && (
                                <TestFormSummary 
                                    formData={formData} 
                                    selectedDevice={selectedDevice} 
                                    selectedApp={selectedApp}
                                    onEditStep={(s) => setStep(s)}
                                    onSubmit={handleSubmit}
                                    loading={loading}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {step === 2 && (
                    <div className="mt-8 flex justify-center">
                        <Button 
                            onClick={nextStep}
                            disabled={!isFormValid}
                            className={cn(
                                "h-14 px-8 text-lg font-bold rounded-xl transition-all duration-300",
                                isFormValid 
                                    ? "bg-white text-black hover:bg-[#141414] shadow-lg hover:shadow-xl hover:scale-105" 
                                    : "bg-[#0a0a0a] text-slate-500 cursor-not-allowed"
                            )}
                        >
                            Nächster Schritt <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto mt-24 border-t border-slate-800/50 pt-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-invert prose-green prose-lg max-w-none prose-headings:text-white prose-a:text-green-400 hover:prose-a:text-green-300"
                >
                    <div className="text-slate-300 space-y-8 leading-relaxed">
                        
                        <h2 className="text-3xl font-bold mt-12 mb-6 border-b border-slate-800 pb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#b20710]">
                            Warum IPTV kostenlos testen? - Premium IPTV Probe
                        </h2>
                        
                        <p>
                            In der sich rasant entwickelnden Welt des digitalen Rundfunks ist das Ansehen hochwertiger und ununterbrochener Inhalte die natürlichste Erwartung jedes Nutzers. Die Auswahl des richtigen Anbieters kann jedoch eine Herausforderung darstellen, da Qualität, Zuverlässigkeit und Inhaltsvielfalt stark variieren können. Genau aus diesem Grund bieten wir Ihnen unseren exklusiven Service an: Sie können unser <strong>IPTV kostenlos testen</strong> und sich selbst von unserer überlegenen Infrastruktur überzeugen. Mit unserem <strong>IPTV Test Deutschland</strong> erhalten Sie die einzigartige Möglichkeit, eine absolut <strong>stabile IPTV testen</strong> zu können, bevor Sie eine finale Entscheidung treffen.
                        </p>
                        
                        <p>
                            Unsere umfassende <strong>Premium IPTV Probe</strong> wurde speziell entwickelt, um Ihnen einen transparenten und ehrlichen Einblick in unser System zu gewähren. Wir verstecken uns nicht hinter leeren Versprechungen, sondern lassen die Leistung unserer Server für sich selbst sprechen. Wenn Sie unseren Service nutzen, profitieren Sie von zahlreichen unschlagbaren Vorteilen, die Ihren Einstieg in die Welt des modernen Fernsehens so angenehm und risikofrei wie möglich gestalten:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    Keine Kreditkarte erforderlich
                                </h3>
                                <p className="text-slate-400 text-sm">Bei unserer Premium IPTV Probe verlangen wir keinerlei sensible Zahlungsdaten im Voraus. Sie können beruhigt starten, ohne Angst vor automatischen Verlängerungen oder versteckten Kosten haben zu müssen.</p>
                            </div>
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    Keine vertragliche Bindung
                                </h3>
                                <p className="text-slate-400 text-sm">Unser IPTV Test Deutschland ist zu 100% unverbindlich. Sie gehen keinen Vertrag ein und müssen nichts kündigen. Wir überzeugen durch Qualität, nicht durch kleingedruckte Klauseln.</p>
                            </div>
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    Vollständiger Zugriff auf Premium IPTV
                                </h3>
                                <p className="text-slate-400 text-sm">Während der Testphase erhalten Sie keine eingeschränkte Demo-Version. Sie genießen den vollen, unzensierten Zugriff auf unser gesamtes Portfolio an Filmen, Serien und Live-TV.</p>
                            </div>
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    Stabile IPTV Verbindung testen
                                </h3>
                                <p className="text-slate-400 text-sm">Erleben Sie unsere Anti-Freeze-Technologie hautnah. Unsere Hochleistungsserver garantieren ein ruckelfreies Streaming-Erlebnis, selbst zu Spitzenzeiten.</p>
                            </div>
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    4K IPTV Service kostenlos
                                </h3>
                                <p className="text-slate-400 text-sm">Tauchen Sie ein in atemberaubende Bildqualität. Testen Sie unsere 4K, UHD und FHD Kanäle und erleben Sie Entertainment in noch nie dagewesener Schärfe.</p>
                            </div>
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    10.000+ Kanäle verfügbar
                                </h3>
                                <p className="text-slate-400 text-sm">Entdecken Sie eine grenzenlose Vielfalt an nationalen und internationalen Sendern, exklusiven Sportübertragungen und einer gigantischen Video-on-Demand (VOD) Bibliothek.</p>
                            </div>
                            <div className="bg-[#0a0a0a]/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/30 transition-colors md:col-span-2">
                                <h3 className="flex items-center text-lg font-bold text-white mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                    24/7 Support
                                </h3>
                                <p className="text-slate-400 text-sm">Sollten Sie Fragen zur Einrichtung haben oder Hilfe benötigen, steht Ihnen unser kompetentes Support-Team jederzeit über WhatsApp zur Verfügung – auch während Ihrer kostenlosen Testphase.</p>
                            </div>
                        </div>

                        <p>
                            Vertrauen Sie auf unsere jahrelange Erfahrung und unsere hochmoderne Server-Infrastruktur. Wir wissen, dass der Wechsel zu einem neuen Anbieter Vertrauenssache ist. Indem Sie unser <strong>IPTV kostenlos testen</strong>, minimieren Sie Ihr Risiko auf null. Zögern Sie nicht länger und starten Sie jetzt Ihre persönliche <strong>Premium IPTV Probe</strong>. Erleben Sie selbst, warum unser <strong>IPTV Test Deutschland</strong> täglich hunderte neue Nutzer überzeugt und entdecken Sie, wie fantastisch eine wirklich <strong>stabile IPTV testen</strong> zu können in der Praxis aussieht. Ihr perfektes Home-Entertainment-Erlebnis ist nur wenige Klicks entfernt!
                        </p>

                    </div>
                </motion.div>
            </div>
        </main>

        <FooterDE contactData={siteData?.contactData} siteData={siteData} />
      </div>
    </>
  );
};

export default TestPageDE;