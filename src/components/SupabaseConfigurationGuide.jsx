
import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, ExternalLink, Database, Key, Terminal } from 'lucide-react';
import { getConfigStatus } from '@/utils/supabaseConfigValidator';
import { getEnvStatus } from '@/utils/envDebugger';

const SupabaseConfigurationGuide = ({ errors = [] }) => {
  const [copied, setCopied] = useState(false);
  
  const envStatus = getEnvStatus();
  const configStatus = getConfigStatus();
  
  const displayErrors = errors.length > 0 ? errors : configStatus.errors;

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 flex flex-col items-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-3xl w-full bg-[#0a0a0a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-500/10 p-8 border-b border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="bg-red-500/20 p-4 rounded-2xl shrink-0">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Supabase Yapılandırma Hatası</h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Uygulamanın veritabanı ve kimlik doğrulama özelliklerini kullanabilmesi için Supabase bağlantı ayarlarının doğru yapılması gerekmektedir.
            </p>
          </div>
        </div>

        {/* Current Status Debug */}
        <div className="bg-black/30 p-6 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Mevcut Durum Analizi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
            <div className="bg-[#0a0a0a]/50 p-3 rounded-xl border border-slate-700/50">
              <div className="text-slate-500 mb-1">VITE_SUPABASE_URL</div>
              <div className="text-slate-300 break-all">{envStatus.rawUrlMasked}</div>
              {envStatus.hasQuotesUrl && <div className="text-orange-400 mt-1 text-xs">⚠️ Tırnak işaretleri kaldırılmalı</div>}
            </div>
            <div className="bg-[#0a0a0a]/50 p-3 rounded-xl border border-slate-700/50">
              <div className="text-slate-500 mb-1">VITE_SUPABASE_ANON_KEY</div>
              <div className="text-slate-300 break-all">{envStatus.rawKeyMasked}</div>
              {envStatus.hasQuotesKey && <div className="text-orange-400 mt-1 text-xs">⚠️ Tırnak işaretleri kaldırılmalı</div>}
            </div>
          </div>
        </div>

        {/* Errors List */}
        {displayErrors.length > 0 && (
          <div className="p-6 border-b border-slate-800 bg-red-500/5">
            <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Tespit Edilen Hatalar</h2>
            <ul className="space-y-2">
              {displayErrors.map((err, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <span className="mt-0.5">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6">Çözüm Adımları</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141414]/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-lg">1</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Supabase'e Giriş Yapın</h3>
                <p className="text-slate-400 text-sm mb-3">
                  <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">https://app.supabase.com</a> adresine gidin ve projenizi seçin.
                </p>
                <div className="bg-[#0a0a0a]/50 p-4 rounded-xl border border-slate-700/50 text-sm text-slate-300">
                  <p>Sol menüden <strong className="text-white">Project Settings</strong> (Dişli çark) ikonuna tıklayın, ardından <strong className="text-white">API</strong> sekmesini seçin.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141414]/20 text-blue-400 flex items-center justify-center font-bold shrink-0 text-lg">2</div>
              <div className="w-full">
                <h3 className="text-white font-semibold mb-2">.env Dosyanızı Düzenleyin</h3>
                <p className="text-slate-400 text-sm mb-3">Projenizin ana dizinindeki <code className="text-blue-400 bg-[#141414]/10 px-1.5 py-0.5 rounded">.env</code> dosyasına aşağıdaki bilgileri <strong>tırnak işareti olmadan</strong> yapıştırın:</p>
                
                <div className="relative group mt-4">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#e50914]/20 to-[#b20710]/20 rounded-2xl blur opacity-50"></div>
                  <pre className="relative bg-[#0A0A0F] p-5 rounded-xl text-sm font-mono text-slate-300 overflow-x-auto border border-slate-700/50 leading-loose">
                    {envTemplate}
                  </pre>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute top-4 right-4 p-2 bg-[#0a0a0a] hover:bg-[#0a0a0a] rounded-lg transition-all text-slate-400 hover:text-white border border-slate-700"
                    title="Şablonu Kopyala"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-400 bg-[#0a0a0a]/30 p-3 rounded-lg border border-slate-700/50">
                    <Database className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <strong className="text-slate-200 block mb-1">Project URL:</strong>
                      "https://" ile başlamalı, ".supabase.co" ile bitmeli ve <strong>sonunda "/" (slash) olmamalıdır</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-400 bg-[#0a0a0a]/30 p-3 rounded-lg border border-slate-700/50">
                    <Key className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <strong className="text-slate-200 block mb-1">Anon Key:</strong>
                      Başında ve sonunda boşluk olmamalı, uzun bir JWT metni olmalıdır.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#0a0a0a] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Değişiklikleri yaptıktan sonra uygulamanın yeniden derlenmesi gerekebilir.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-3 bg-[#141414] hover:bg-[#141414] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/20"
          >
            Tekrar Kontrol Et
          </button>
        </div>

      </div>
    </div>
  );
};

export default SupabaseConfigurationGuide;
