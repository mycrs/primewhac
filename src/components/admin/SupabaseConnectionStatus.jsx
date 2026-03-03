
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { isSupabaseConfigured } from '@/utils/envValidator';

const SupabaseConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'error'

  useEffect(() => {
    const checkConnection = async () => {
      if (!isSupabaseConfigured()) {
        setStatus('error');
        return;
      }

      try {
        const { error } = await supabase.from('site_content').select('key').limit(1);
        if (error) {
          setStatus('error');
        } else {
          setStatus('connected');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    checkConnection();
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/10 shadow-md">
        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        <span className="text-xs font-medium text-slate-300">Kontrol ediliyor...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 shadow-md">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-xs font-medium text-red-400">Bağlantı Yok</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 shadow-md">
      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
      <span className="text-xs font-medium text-[#10b981]">Bağlı</span>
    </div>
  );
};

export default SupabaseConnectionStatus;
