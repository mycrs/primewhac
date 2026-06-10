
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Download, ArrowRight, BookOpenCheck, FlaskConical, MonitorPlay, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderModal } from '@/contexts/OrderModalContext';

// Skeleton Component for better UX
const InstallationSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto space-y-8 animate-pulse">
    <div className="flex justify-center gap-4 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-10 w-24 bg-[#0a0a0a] rounded-lg"></div>
      ))}
    </div>
    <div className="bg-[#0a0a0a] rounded-3xl p-8 h-64 border border-slate-800"></div>
  </div>
);

const Installation = ({ siteData }) => {
  const { openModal } = useOrderModal();
  
  // Robust data extraction with fallbacks
  const data = useMemo(() => {
    // Try to get data from prop
    if (siteData?.installationPageData) return siteData.installationPageData;
    // Fallback is handled by parent or defaultData in hook
    return null;
  }, [siteData]);

  // If no data is available yet, show skeleton instead of text spinner
  if (!data || !data.tabs || data.tabs.length === 0) {
     return (
        <section id="installation" className="py-24 bg-[#0a0a0a]">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                     <div className="h-8 w-64 bg-[#0a0a0a] rounded mx-auto mb-4 animate-pulse"></div>
                     <div className="h-4 w-96 bg-[#0a0a0a] rounded mx-auto animate-pulse"></div>
                 </div>
                 <InstallationSkeleton />
            </div>
        </section>
     );
  }

  return (
    <section id="installation" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
             <MonitorPlay className="w-4 h-4 text-primary" />
             <span className="text-primary text-sm font-bold uppercase tracking-wider">Kolay Kurulum</span>
          </div>
          {/* Changed from H1 to H2 to prevent multiple H1s per page when component is reused */}
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            {data.title || "Kurulum Rehberi"}
          </h2>
           <div className="mt-8 mb-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" variant="outline" className="font-bold text-lg h-14 px-8 rounded-full border-2 border-[#e50914]/50 text-white hover:bg-[#e50914]/10 hover:text-white">
              <Link to="/detailed-instructions">
                <BookOpenCheck className="mr-3 h-5 w-5" />
                Detaylı Rehberler
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button 
                onClick={() => openModal(null, true)}
                size="lg" 
                variant="default"
                className="font-bold text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25"
            >
                <FlaskConical className="mr-3 h-5 w-5" />
                Hemen Test Et
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue={data.tabs[0]?.id} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <TabsList className="inline-flex h-auto flex-wrap items-center justify-center gap-3 bg-[#0a0a0a]/80 p-3 rounded-2xl border border-slate-800 shadow-xl">
              {data.tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="rounded-xl px-6 py-3 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-gray-400 hover:text-white"
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>
          
          {data.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="focus:outline-none mt-0">
              <div className="space-y-8 max-w-5xl mx-auto">
                {tab.steps && tab.steps.map((step, index) => (
                  <motion.div 
                    key={step.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#13151a] border border-slate-800 rounded-3xl p-8 md:p-10 hover:border-primary/30 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}>
                       <div className="md:w-1/2 space-y-6">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/30 mb-2 group-hover:scale-110 transition-transform">
                            {index + 1}
                          </div>
                          <p className="text-lg text-gray-300 leading-relaxed font-light">
                            {step.description}
                          </p>
                       </div>
                       
                       <div className="md:w-1/2 w-full">
                         <div className="relative aspect-video bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group-hover:border-primary/20 transition-all">
                           {step.imageUrl ? (
                             <img 
                                src={step.imageUrl} 
                                loading="lazy"
                                className="w-full h-full object-cover" 
                                alt={`${tab.title} IPTV kurulum`}
                             />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                                <span className="text-slate-600 font-medium">Görsel Yok</span>
                             </div>
                           )}
                         </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {tab.apps && tab.apps.length > 0 && (
                <div className="mt-24">
                  <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#e50914] to-transparent w-32"></div>
                    <p className="text-2xl md:text-3xl font-bold text-center text-white">
                      <span className="text-primary">{tab.title}</span> İçin Önerilen Uygulamalar
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#e50914] to-transparent w-32"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
                    {tab.apps.map((app, appIndex) => (
                      <div key={appIndex} className="bg-[#0a0a0a] border border-slate-800 p-8 rounded-2xl flex flex-col items-center text-center hover:bg-[#0a0a0a]/80 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2">
                        <div className="w-20 h-20 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all shadow-lg border border-slate-700 group-hover:border-primary/30">
                           <Download className="w-8 h-8" />
                        </div>
                        <p className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{app.name}</p>
                        {app.details?.description && <p className="text-sm text-gray-400 mb-8 line-clamp-2">{app.details.description}</p>}
                        
                        <div className="flex flex-col gap-3 w-full mt-auto">
                          <Button asChild className="w-full bg-primary hover:bg-primary text-white font-bold rounded-xl h-11 shadow-lg shadow-primary/20">
                            <a href={app.url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Hemen İndir
                            </a>
                          </Button>
                          {app.slug && (
                            <Button asChild variant="ghost" className="w-full text-gray-400 hover:text-primary hover:bg-primary/5 h-11">
                              <Link to={`/kurulum/${app.slug}`}>
                                Kurulum Detayları <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default React.memo(Installation);
