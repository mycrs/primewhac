
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from '@/components/ErrorBoundary';
import './index.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import SupabaseConfigurationError from '@/components/SupabaseConfigurationError';
import ClientValidator from '@/utils/supabaseClientValidator';
import AuthFlowReset from '@/utils/authFlowReset';
import AuthDebugger from '@/utils/authDebugger';
import { initPerformanceMonitoring } from '@/utils/performanceMetrics';
import { installChunkErrorRecovery } from '@/utils/chunkErrorRecovery';

// Chunk/modulepreload hatasında (eski HTML ↔ yeni deploy uyuşmazlığı)
// kullanıcıyı beklemeden otomatik kurtarma; döngü korumalı.
installChunkErrorRecovery();

const rootElement = document.getElementById('root');

// Statik HTML'de botlar için bulunan prerender head/schema bloklarını, Helmet'in
// çalışma zamanı sürümü gelmeden kaldır; aksi halde tarayıcı DOM'unda çift canonical,
// description, hreflang ve JSON-LD oluşur. Kaynak HTML'deki bot sinyalleri korunur.
document
  .querySelectorAll('[data-prerender-head="true"], [data-prerender-jsonld="true"]')
  .forEach((element) => element.remove());

const root = ReactDOM.createRoot(rootElement);

// Service Worker devre dışı - SW aktivasyonu sayfa yenileme döngüsüne yol açıyordu
// Eski SW varsa kaldır (kullanıcılar için) + eski CacheStorage kayıtlarını temizle
// (eski SW cache'inden gelen bayat chunk'lar "Bağlantı sorunu" ekranına yol açıyordu)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
  if ('caches' in window) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  }
}

// Initialize Web Vitals
initPerformanceMonitoring();

const preInitValidation = () => {
  AuthDebugger.logAuthFlow('Starting pre-initialization validation');
  
  const removed = AuthFlowReset.cleanupCorruptedTokens();
  if (removed > 0) {
    AuthDebugger.logAuthFlow(`Cleaned ${removed} corrupted tokens during pre-init.`);
  }

  const configCheck = ClientValidator.validateSupabaseConfig();
  
  if (!configCheck.isValid) {
    console.error('[Main Init] Critical missing environment variables blocked app mount.', configCheck.errors);
    root.render(
      <SupabaseConfigurationError errors={configCheck.errors} />
    );
    return false;
  }

  return true; 
};

if (preInitValidation()) {
  root.render(
    <>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
