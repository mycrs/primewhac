
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Tv, Laptop, Monitor, Tablet, Box, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const DeviceSelectionStep = ({ selectedDevice, onSelect }) => {
  const location = useLocation();
  const isDe = location.pathname.includes('/de');

  const devices = [
    { id: 'smart-tv', name: 'Smart TV', icon: Tv, desc: isDe ? 'Samsung, LG, Sony, Android TV' : 'Samsung, LG, Sony, Android TV' },
    { id: 'android-box', name: 'Android Box', icon: Box, desc: isDe ? 'Nvidia Shield, Mi Box, Formuler' : 'Nvidia Shield, Mi Box, Formuler' },
    { id: 'firestick', name: 'Firestick', icon: Box, desc: isDe ? 'Amazon Fire TV Stick / Cube' : 'Amazon Fire TV Stick / Cube' },
    { id: 'smartphone', name: isDe ? 'Telefon und TV Box' : 'Telefon ve TV Box', icon: Smartphone, desc: isDe ? 'Android- und iOS-Geräte' : 'Android ve iOS cihazlar' },
    { id: 'mag-box', name: 'Mag Box', icon: Monitor, desc: isDe ? 'Mag Box, Enigma2, usw.' : 'Mag Box, Enigma2, vb.' },
    { id: 'pc-mac', name: 'PC / Mac', icon: Laptop, desc: 'Windows, MacOS, Linux' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {isDe ? "Welches Gerät verwenden Sie?" : "Hangi cihazı kullanıyorsunuz?"}
        </h2>
        <p className="text-slate-400">
          {isDe
            ? "Wählen Sie das Gerät aus, auf dem Sie den Test-Stream einrichten möchten."
            : "Test yayınını kurmak istediğiniz cihazı seçin."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => {
          const Icon = device.icon;
          const isSelected = selectedDevice?.id === device.id;

          return (
            <motion.button
              key={device.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(device)}
              className={cn(
                "relative group flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden",
                isSelected 
                  ? "bg-green-600/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
                isSelected ? "bg-green-500 text-white" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
              )}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{device.name}</h3>
              <p className="text-sm text-slate-500 font-medium">{device.desc}</p>

              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 text-green-500"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              )}
              
              <div className={cn(
                "absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-500",
                isSelected ? "w-full" : "w-0"
              )}></div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceSelectionStep;
