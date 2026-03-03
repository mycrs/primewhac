
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import SupabaseConfigurationError from '@/components/SupabaseConfigurationError';
import ClientValidator from '@/utils/supabaseClientValidator';
import AuthFlowReset from '@/utils/authFlowReset';
import AuthDebugger from '@/utils/authDebugger';
import { initPerformanceMonitoring } from '@/utils/performanceMetrics';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Initialize Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Yeni SW yüklenip beklemeye girerse sayfayı otomatik yenile
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // Yeni SW aktive oldu → sayfayı yenile (eski chunk hatası kırılsın)
            window.location.reload();
          }
        });
      });
    }).catch((err) => {
      console.log('SW registration failed: ', err);
    });
  });
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
          <App />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
