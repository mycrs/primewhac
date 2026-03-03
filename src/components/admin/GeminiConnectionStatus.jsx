import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const GeminiConnectionStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'connected', 'error'

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/health/gemini`);
        const data = await res.json().catch(() => ({}));
        setStatus(data?.ok ? 'connected' : 'error');
      } catch {
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
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 shadow-md" title="Gemini API bağlantısı yok veya API sunucusu çalışmıyor">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium text-amber-400">Bağlantı Yok</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 shadow-md" title="Gemini API bağlı">
      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
      <span className="text-xs font-medium text-[#10b981]">Bağlı</span>
    </div>
  );
};

export default GeminiConnectionStatus;
