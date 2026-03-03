import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Sparkles, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhatToWatchButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isDe = location.pathname.startsWith('/de');
  const isMatchActive = location.pathname.startsWith('/mac-programi') || location.pathname.startsWith('/de/spielplan');
  const isWatchActive = location.pathname.startsWith('/what-to-watch') || 
                        location.pathname.startsWith('/ne-izlesem') ||
                        location.pathname.startsWith('/de/was-soll-ich-schauen');

  const matchRoute = isDe ? '/de/spielplan' : '/mac-programi';
  const watchRoute = isDe ? '/de/was-soll-ich-schauen' : '/what-to-watch';
  const matchLabel = isDe ? 'Spielplan' : 'Maç Programı';
  const watchLabel = isDe ? 'Was soll ich schauen?' : 'Ne İzlesem?';
  
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-2">
      {/* Maç Programı */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(matchRoute)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all duration-300 group",
            isMatchActive 
              ? "bg-slate-800 text-emerald-400 border border-emerald-500/50 shadow-emerald-900/20" 
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/30"
          )}
          aria-label={matchLabel}
        >
          <span className="text-lg" aria-hidden>⚽</span>
          <Calendar className="w-4 h-4" />
          <span className="font-bold text-sm hidden md:inline-block">{matchLabel}</span>
        </motion.button>
      </AnimatePresence>

      {/* Ne İzlesem */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(watchRoute)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all duration-300 group",
            isWatchActive 
              ? "bg-slate-800 text-purple-400 border border-purple-500/50 shadow-purple-900/20" 
              : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/30"
          )}
          aria-label={watchLabel}
        >
          <div className="relative">
            <Film className={cn("w-5 h-5", isWatchActive ? "animate-pulse" : "")} />
            {!isWatchActive && (
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
              </motion.div>
            )}
          </div>
          <span className="font-bold text-sm hidden md:inline-block">{watchLabel}</span>
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default WhatToWatchButton;
