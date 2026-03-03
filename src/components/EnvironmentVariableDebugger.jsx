
import React, { useState, useEffect } from 'react';
import { Terminal, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getConfigStatus } from '@/utils/supabaseConfigValidator';
import { getEnvStatus } from '@/utils/envDebugger';

const EnvironmentVariableDebugger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [envDetails, setEnvDetails] = useState(null);

  const checkStatus = () => {
    setStatus(getConfigStatus());
    setEnvDetails(getEnvStatus());
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!import.meta.env.DEV) return null; // Only show in development

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-[9999] flex items-center justify-center transition-all hover:scale-110 ${
          status?.isValid ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white animate-pulse'
        }`}
        title="Environment Variables Debugger"
      >
        <Terminal className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[9999] overflow-hidden flex flex-col font-mono text-sm">
      <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Terminal className="w-4 h-4" />
          <span>Env Debugger</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={checkStatus} className="text-slate-400 hover:text-white p-1">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
        
        <div className="space-y-2">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider">Status</h3>
          <div className={`p-2 rounded flex items-center gap-2 ${status?.isValid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {status?.isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{status?.isValid ? 'All Configs Valid' : 'Configuration Errors Detected'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider">Parsed Variables</h3>
          
          <div className="bg-black/40 p-3 rounded border border-slate-800 space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">VITE_SUPABASE_URL</span>
                <span className={status?.details?.urlValid ? 'text-emerald-400' : 'text-red-400'}>
                  {status?.details?.urlValid ? 'OK' : 'INVALID'}
                </span>
              </div>
              <div className="text-xs text-slate-400 break-all bg-slate-800/50 p-1.5 rounded">
                {envDetails?.rawUrlMasked}
              </div>
              {(envDetails?.hasQuotesUrl || envDetails?.hasWhitespaceUrl) && (
                <div className="text-[10px] text-orange-400 mt-1">
                  ⚠️ Contains quotes or whitespace. Auto-cleaned for execution.
                </div>
              )}
            </div>

            <div className="h-px bg-slate-800 w-full"></div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300">VITE_SUPABASE_ANON_KEY</span>
                <span className={status?.details?.keyValid ? 'text-emerald-400' : 'text-red-400'}>
                  {status?.details?.keyValid ? 'OK' : 'INVALID'}
                </span>
              </div>
              <div className="text-xs text-slate-400 break-all bg-slate-800/50 p-1.5 rounded">
                {envDetails?.rawKeyMasked}
              </div>
               {(envDetails?.hasQuotesKey || envDetails?.hasWhitespaceKey) && (
                <div className="text-[10px] text-orange-400 mt-1">
                  ⚠️ Contains quotes or whitespace. Auto-cleaned for execution.
                </div>
              )}
            </div>
          </div>
        </div>

        {status?.errors?.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider">Errors</h3>
            <div className="space-y-1">
              {status.errors.map((err, i) => (
                <div key={i} className="text-red-400 bg-red-500/10 p-2 rounded text-xs leading-relaxed">
                  {err}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EnvironmentVariableDebugger;
