
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

const isDev = import.meta.env.DEV;

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  
  // Log to console in development
  if (isDev) {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
  }

  // You can send this to an analytics endpoint using navigator.sendBeacon
  // if (navigator.sendBeacon) {
  //   navigator.sendBeacon('/api/analytics', body);
  // }
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
