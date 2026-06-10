
import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, ExternalLink, Database, Key } from 'lucide-react';

const SupabaseConfigurationError = ({ errors = [] }) => {
  const [copied, setCopied] = useState(false);

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-[#0a0a0a] border border-red-500/30 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-500/10 p-6 border-b border-red-500/20 flex items-start gap-4">
          <div className="bg-red-500/20 p-3 rounded-2xl shrink-0">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Supabase Bağlantı Hatası</h1>
            <p className="text-slate-400 text-sm">
              Uygulamanın çalışabilmesi için gerekli olan çevre değişkenleri (environment variables) eksik veya hatalı yapılandırılmış.
            </p>
          </div>
        </div>

        {/* Errors List */}
        {errors.length > 0 && (
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Tespit Edilen Hatalar</h2>
            <ul className="space-y-2">
              {errors.map((err, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                  <span className="mt-0.5">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructions */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-4">Nasıl Çözülür?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#141414]/20 text-blue-400 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <p className="text-slate-300 mb-2">Projenizin kök dizininde <code className="text-blue-400 bg-[#141414]/10 px-1.5 py-0.5 rounded">.env</code> adında bir dosya oluşturun (veya mevcut olanı düzenleyin).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#141414]/20 text-blue-400 flex items-center justify-center font-bold shrink-0">2</div>
              <div className="w-full">
                <p className="text-slate-300 mb-2">Aşağıdaki formatta değişkenleri ekleyin:</p>
                <div className="relative group">
                  <pre className="bg-black/50 p-4 rounded-xl text-sm font-mono text-slate-300 overflow-x-auto border border-slate-800">
                    {envTemplate}
                  </pre>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 p-2 bg-[#0a0a0a] hover:bg-[#0a0a0a] rounded-lg transition-colors text-slate-400 hover:text-white"
                    title="Kopyala"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#141414]/20 text-blue-400 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <p className="text-slate-300 mb-2">Bu değerleri Supabase panonuzdan alabilirsiniz:</p>
                <ul className="space-y-3 mt-3">
                  <li className="flex items-center gap-3 text-sm text-slate-400">
                    <Database className="w-4 h-4 text-primary" />
                    <span><strong>Project URL:</strong> Project Settings &gt; API &gt; Project URL</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-400">
                    <Key className="w-4 h-4 text-green-400" />
                    <span><strong>Anon Key:</strong> Project Settings &gt; API &gt; Project API Keys (anon, public)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#0a0a0a]/50 p-6 flex items-center justify-between">
          <a 
            href="https://supabase.com/dashboard/projects" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Supabase Panosuna Git <ExternalLink className="w-4 h-4" />
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#141414] hover:bg-[#0a0a0a] text-white font-medium rounded-xl transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>

      </div>
    </div>
  );
};

export default SupabaseConfigurationError;
