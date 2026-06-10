import React from 'react';
import InternetRequirementsCard from './InternetRequirementsCard';
import TroubleshootingAccordion from './TroubleshootingAccordion';
import DeviceCompatibilityTable from './DeviceCompatibilityTable';
import FireTVDetailedGuide from './FireTVDetailedGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, HelpCircle, Smartphone, Wifi } from 'lucide-react';

const ImportantInfoSection = ({ selectedDevice, lang = 'tr' }) => {
  const isDeRoute = typeof window !== 'undefined' && window.location.pathname.includes('/de');
  const currentLang = lang === 'de' || isDeRoute ? 'de' : 'tr';
  const isDe = currentLang === 'de';

  return (
    <section className="py-16 bg-[#0a0a0a]/50" aria-label={isDe ? "Wichtige Informationen" : "Önemli Bilgiler"}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {isDe ? "Informationszentrum" : "Bilgi Merkezi"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isDe ? "Vor der Installation & Fehlerbehebung" : "Kurulumdan Önce & Sorun Giderme"}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {isDe ? "Bitte lesen Sie die folgenden Abschnitte für ein reibungsloses Erlebnis" : "Sorunsuz bir deneyim için lütfen aşağıdaki bölümleri inceleyin."}
          </p>
        </div>

        <Tabs defaultValue="requirements" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#0a0a0a] border border-slate-800 p-1 mb-8 h-auto rounded-xl">
            <TabsTrigger value="requirements" className="data-[state=active]:bg-primary text-slate-400 gap-2 py-3 rounded-lg">
              <Wifi className="w-4 h-4" /> <span className="hidden md:inline">{isDe ? "Anforderungen" : "Gereksinimler"}</span>
              <span className="md:hidden">{isDe ? "Netzwerk" : "Ağ"}</span>
            </TabsTrigger>
            <TabsTrigger value="compatibility" className="data-[state=active]:bg-[#141414] text-slate-400 gap-2 py-3 rounded-lg">
              <Smartphone className="w-4 h-4" /> <span className="hidden md:inline">{isDe ? "Kompatibilität" : "Uyumluluk"}</span>
              <span className="md:hidden">{isDe ? "Gerät" : "Cihaz"}</span>
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="data-[state=active]:bg-amber-600 text-slate-400 gap-2 py-3 rounded-lg">
              <HelpCircle className="w-4 h-4" /> <span className="hidden md:inline">{isDe ? "Fehlerbehebung" : "Sorun Giderme"}</span>
              <span className="md:hidden">{isDe ? "Support" : "Destek"}</span>
            </TabsTrigger>
            <TabsTrigger value="firetv" className="data-[state=active]:bg-orange-600 text-slate-400 gap-2 py-3 rounded-lg">
              <Info className="w-4 h-4" /> <span className="hidden md:inline">{isDe ? "Fire TV Anleitung" : "Fire TV Kılavuzu"}</span>
              <span className="md:hidden">Fire TV</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requirements" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InternetRequirementsCard lang={currentLang} />
          </TabsContent>

          <TabsContent value="compatibility" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DeviceCompatibilityTable lang={currentLang} />
          </TabsContent>
          
          <TabsContent value="troubleshoot" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-1 gap-8">
               <TroubleshootingAccordion lang={currentLang} />
            </div>
          </TabsContent>

          <TabsContent value="firetv" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <FireTVDetailedGuide lang={currentLang} />
          </TabsContent>
        </Tabs>

      </div>
    </section>
  );
};

export default ImportantInfoSection;