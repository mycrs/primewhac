import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const AppDownloadButtons = ({ appLinks = [], className }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');

  if (!appLinks || !Array.isArray(appLinks) || appLinks.length === 0) return null;

  const validLinks = appLinks.filter(link => 
    link && 
    typeof link === 'object' && 
    link.app_url && 
    link.app_url.trim().length > 0
  );

  if (validLinks.length === 0) return null;

  return (
    <div className={cn("grid gap-3 md:gap-4 lg:gap-5", className, 
       validLinks.length === 1 ? "grid-cols-1 max-w-sm mx-auto w-full" : 
       validLinks.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto w-full" :
       "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto w-full"
    )}>
      {validLinks.map((link, index) => {
         const safeId = link.id || `download-btn-${index}`;
         
         return (
          <motion.div
            key={safeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full"
          >
            <Button 
              asChild
              className={cn(
                 "w-full min-h-[44px] h-auto py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 rounded-xl shadow-lg border relative overflow-hidden group transition-all duration-300",
                 "hover:scale-[1.02] hover:-translate-y-1 active:scale-95 touch-manipulation",
                 index % 3 === 0 ? "bg-gradient-to-br from-[#e50914] to-[#b20710] border-primary/30 hover:shadow-primary/40" :
                 index % 3 === 1 ? "bg-gradient-to-br from-[#e50914] to-[#b20710] border-blue-500/30 hover:shadow-blue-900/40" :
                 "bg-gradient-to-br from-[#e50914] to-[#b20710] border-[#e50914]/30 hover:shadow-emerald-900/40"
              )}
            >
              <a 
                href={link.app_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col items-center justify-center gap-1 text-white no-underline w-full"
              >
                 <div className="flex items-center gap-2 mb-1">
                    <Download className="w-4 h-4 md:w-5 md:h-5 opacity-90" />
                    <span className="font-bold text-sm md:text-base lg:text-lg text-center break-words max-w-full leading-tight">
                      {link.app_name || (isDe ? 'Herunterladen' : 'İndir')}
                    </span>
                 </div>
                 <span className="text-[10px] md:text-xs text-white/80 font-normal flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-full">
                   {isDe ? 'Zum Herunterladen klicken' : 'İndirmek için tıklayın'} <ExternalLink className="w-3 h-3" />
                 </span>
                 
                 <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />
              </a>
            </Button>
          </motion.div>
         );
      })}
    </div>
  );
};

export default AppDownloadButtons;