import React from 'react';
import { cn } from '@/lib/utils';
import { Globe, Flag } from 'lucide-react';

const PackageRegionSelector = ({ selectedRegion, onRegionChange }) => {
  const regions = [
    { 
      id: 'tr', 
      label: 'TR', 
      fullLabel: 'Türkiye', 
      desc: 'Türk kanalları',
      icon: <Flag className="w-4 h-4" /> 
    },
    { 
      id: 'eu', 
      label: 'EU', 
      fullLabel: 'Avrupa', 
      desc: 'Avrupa kanalları',
      icon: <Globe className="w-4 h-4" /> 
    },
    { 
      id: 'tr-eu', 
      label: 'TR + EU', 
      fullLabel: 'TR + EU', 
      desc: 'Her ikisi de',
      icon: <div className="flex"><Flag className="w-3 h-3 -mr-1" /><Globe className="w-3 h-3" /></div> 
    }
  ];

  return (
    <div className="w-full bg-[#1e1e30] p-1 rounded-lg border border-[#2a2a40] mb-6 flex relative">
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onRegionChange(region.id);
          }}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-300 relative z-10",
            selectedRegion === region.id 
              ? "bg-[#e50914] text-white shadow-lg shadow-primary/20" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
          title={region.desc}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            {region.icon}
            <span className="font-bold text-xs">{region.label}</span>
          </div>
          <span className="text-[10px] opacity-80 hidden md:block">{region.desc}</span>
        </button>
      ))}
    </div>
  );
};

export default PackageRegionSelector;