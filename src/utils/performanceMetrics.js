
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

function sendToAnalytics(metric) {
  // Geliştirmede yalnızca konsola yaz
  if (isDev) {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
    return;
  }

  // Production'da web_vitals tablosuna fire-and-forget insert.
  // Supabase client dinamik import edilir: ölçüm gönderimi render yolunu
  // bloklamaz ve client zaten yüklüyse aynı modül örneği kullanılır.
  if (!isProd || typeof window === 'undefined') return;

  const row = {
    metric: metric.name,
    value: metric.value,
    path: window.location.pathname,
    user_agent: navigator.userAgent,
  };

  import('../lib/customSupabaseClient.js')
    .then(({ default: supabase }) =>
      supabase.from('web_vitals').insert(row)
    )
    .catch(() => {
      // Ölçüm gönderimi asla uygulamayı etkilememeli — hata sessizce yutulur.
    });
}

export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  try {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  } catch (err) {
    console.error('Failed to initialize performance monitoring', err);
  }
};
