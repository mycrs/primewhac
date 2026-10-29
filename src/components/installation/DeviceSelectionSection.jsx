import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tv, Smartphone, Monitor, AppWindow, Tablet, MonitorPlay } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const devices = [
  { id: 'android-tv', name: 'Android TV', icon: Tv, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
  { id: 'ios', name: 'iOS (Apple)', icon: Smartphone, color: 'text-slate-200', bg: 'bg-slate-500/10 border-slate-500/25' },
  { id: 'android-phone', name: 'Android', icon: Smartphone, color: 'text-[#e50914]', bg: 'bg-[#e50914]/10 border-[#e50914]/20' },
  { id: 'windows', name: 'Windows PC', icon: Monitor, color: 'text-blue-500', bg: 'bg-[#141414]/10 border-blue-500/20' },
  { id: 'mac', name: 'Mac', icon: AppWindow, color: 'text-slate-300', bg: 'bg-[#141414]/10 border-slate-500/20' },
  { id: 'smart-tv', name: 'Smart TV', icon: MonitorPlay, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/20' },
  { id: 'tablet', name: 'Tablet', icon: Tablet, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
];

const DeviceSelectionSection = ({ selectedDevice, onSelect, asLinks = false }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');
  const basePath = isDe ? '/de/einrichtung' : '/kurulum';

  const content = {
    heading: isDe ? "Wählen Sie Ihr Gerät" : "Cihazınızı Seçin",
    description: isDe 
      ? "Klicken Sie auf Ihr Gerät für die Schritt-für-Schritt Installationsanleitung." 
      : "Kurulum rehberi için cihazınıza tıklayın."
  };

  const baseClasses = "relative flex flex-col items-center justify-center p-4 md:p-5 lg:p-6 rounded-2xl border transition-all duration-300 w-full min-h-[110px] md:min-h-[130px] lg:min-h-[150px] touch-manipulation";

  return (
    <section className="w-full py-6 md:py-10 lg:py-16">
      <div className="text-center mb-6 md:mb-10 lg:mb-12 px-4">
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">
          {content.heading}
        </h3>
        <p className="text-sm md:text-base text-slate-400">
          {content.description}
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6 px-4">
        {devices.map((device) => {
           const Icon = device.icon;
           const isSelected = selectedDevice === device.id;
           const classes = cn(
             baseClasses,
             isSelected 
               ? cn("bg-[#0a0a0a] shadow-lg shadow-primary/20 ring-2 ring-primary", device.bg)
               : "bg-[#0a0a0a]/40 border-slate-800 hover:bg-[#0a0a0a] hover:border-slate-700"
           );
           
           if (asLinks) {
             return (
               <Link key={device.id} to={`${basePath}/${device.id}`} className="block group">
                 <motion.div
                   whileHover={{ scale: 1.02, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                   className={cn(classes, "cursor-pointer")}
                 >
                   <div className="p-2 md:p-3 rounded-xl mb-2 md:mb-3 transition-colors bg-[#0a0a0a] group-hover:bg-white/5">
                     <Icon className={cn("w-6 h-6 md:w-8 md:h-8", device.color)} />
                   </div>
                   <span className="font-semibold text-xs md:text-sm lg:text-base text-center text-slate-400 group-hover:text-white transition-colors">
                     {device.name}
                   </span>
                 </motion.div>
               </Link>
             );
           }
           
           return (
             <motion.button
               key={device.id}
               onClick={() => onSelect(device.id)}
               whileHover={{ scale: 1.02, y: -2 }}
               whileTap={{ scale: 0.98 }}
               className={classes}
             >
               <div className={cn(
                 "p-2 md:p-3 rounded-xl mb-2 md:mb-3 transition-colors",
                 isSelected ? "bg-white/10" : "bg-[#0a0a0a]"
               )}>
                 <Icon className={cn("w-6 h-6 md:w-8 md:h-8", device.color)} />
               </div>
               <span className={cn(
                 "font-semibold text-xs md:text-sm lg:text-base text-center",
                 isSelected ? "text-white" : "text-slate-400"
               )}>
                 {device.name}
               </span>
               
               {isSelected && (
                 <motion.div 
                   layoutId="activeIndicator"
                   className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-primary"
                 />
               )}
             </motion.button>
           );
        })}
      </div>
    </section>
  );
};

export default DeviceSelectionSection;