
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ErrorState = ({ message, details, onRetry, retryCount, maxRetries }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-2xl mx-auto"
    >
      <div className="bg-red-500/10 p-6 rounded-full mb-6">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">
        Bir Hata Oluştu
      </h3>
      
      <p className="text-slate-400 mb-2">
        {message || "İçerikler yüklenirken beklenmeyen bir ağ veya sunucu hatası oluştu."}
      </p>

      {details && (
        <p className="text-sm text-slate-500 mb-8 bg-slate-900/50 p-3 rounded-lg border border-slate-800 w-full">
          {details}
        </p>
      )}

      {retryCount > 0 && retryCount < maxRetries && (
        <p className="text-orange-400 text-sm mb-4 font-medium animate-pulse">
          Yeniden deneniyor... (Deneme {retryCount}/{maxRetries})
        </p>
      )}

      <Button 
        onClick={onRetry} 
        disabled={retryCount > 0 && retryCount < maxRetries}
        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-8 shadow-lg shadow-red-600/30 transition-all"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${(retryCount > 0 && retryCount < maxRetries) ? 'animate-spin' : ''}`} />
        Tekrar Dene
      </Button>
    </motion.div>
  );
};

export default ErrorState;
