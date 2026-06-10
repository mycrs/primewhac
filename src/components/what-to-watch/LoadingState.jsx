
import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingState = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center mb-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Yükleniyor...</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-slate-800 h-full flex flex-col"
          >
            <Skeleton className="relative aspect-[2/3] w-full rounded-none" />
            <div className="p-4 flex flex-col flex-grow">
              <Skeleton className="h-5 w-3/4 mb-3" />
              <div className="mt-auto flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
