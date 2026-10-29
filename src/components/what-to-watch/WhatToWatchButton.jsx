import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhatToWatchButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isDe = location.pathname.startsWith('/de');
  const isWatchActive = location.pathname.startsWith('/what-to-watch') || 
                        location.pathname.startsWith('/ne-izlesem') ||
                        location.pathname.startsWith('/de/was-soll-ich-schauen');

  const watchRoute = isDe ? '/de/was-soll-ich-schauen' : '/ne-izlesem';
  const watchLabel = isDe ? 'Was soll ich schauen?' : 'Ne İzlesem?';
  
  return (
    <div className="fixed bottom-24 right-4 z-40 hidden flex-col gap-2 md:flex">
      {/* Ne İzlesem — Film & Dizi Keşfi */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ scale: 1.06, y: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(watchRoute)}
          className={cn(
            'group relative flex min-h-[52px] items-center gap-2.5 overflow-hidden rounded-2xl border-2 px-4 py-3.5 backdrop-blur-md transition-all duration-300 md:min-h-0 md:px-5',
            isWatchActive
              ? 'border-[#e50914]/45 bg-gradient-to-br from-[#0a0a0a]/95 via-[#e50914]/85 to-[#0a0a0a]/95 text-white shadow-[0_0_36px_rgba(229,9,20,0.35),0_0_24px_rgba(229, 9, 20,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]'
              : 'border-white/[0.18] bg-[linear-gradient(135deg,#e50914,#b20710)] text-white shadow-[0_4px_20px_rgba(229, 9, 20,0.55),0_0_40px_rgba(229,9,20,0.35),inset_0_1px_0_rgba(255,255,255,0.22)] hover:border-[#e50914]/40 hover:shadow-[0_6px_28px_rgba(229, 9, 20,0.65),0_0_48px_rgba(229,9,20,0.3),inset_0_1px_0_rgba(255,255,255,0.28)]'
          )}
          aria-label={watchLabel}
        >
          {!isWatchActive && (
            <span
              className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-[linear-gradient(110deg,transparent_12%,rgba(255,255,255,0.28)_48%,transparent_84%)] transition-transform duration-700 group-hover:translate-x-[100%]"
              aria-hidden
            />
          )}
          <span
            className={cn(
              'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg ring-1',
              isWatchActive
                ? 'bg-[#e50914]/20 ring-[#e50914]/45'
                : 'bg-white/20 ring-white/35 shadow-primary/30'
            )}
            aria-hidden
          >
            <Film
              className={cn(
                'h-[1.15rem] w-[1.15rem] drop-shadow-md',
                isWatchActive ? 'text-white' : 'text-white'
              )}
              strokeWidth={2.25}
            />
            <motion.span
              className="pointer-events-none absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center"
              animate={
                isWatchActive
                  ? { opacity: 0.75, scale: 1 }
                  : { opacity: [0.5, 1, 0.5], scale: [0.88, 1.08, 0.88] }
              }
              transition={
                isWatchActive
                  ? { duration: 0.3 }
                  : { repeat: Infinity, duration: 2.2, repeatDelay: 2.4, ease: 'easeInOut' }
              }
            >
              <Sparkles
                className={cn(
                  'h-3 w-3 drop-shadow-[0_0_6px_rgba(250,204,21,0.55)]',
                  isWatchActive ? 'text-amber-200/80' : 'text-amber-200'
                )}
                strokeWidth={2.25}
                aria-hidden
              />
            </motion.span>
          </span>
          <span
            className={cn(
              'relative z-10 hidden max-w-[12rem] truncate text-sm font-bold tracking-tight md:inline-block',
              isWatchActive
                ? 'bg-gradient-to-r from-white via-white to-[#b20710] bg-clip-text text-transparent'
                : 'text-white drop-shadow-sm'
            )}
          >
            {watchLabel}
          </span>
        </motion.button>
      </AnimatePresence>
    </div>
  );
};

export default WhatToWatchButton;
