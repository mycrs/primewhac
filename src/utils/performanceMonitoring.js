import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

const logPerformanceData = (metric) => {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value * 100) / 100, metric);
  }
  
  // Here we would typically send this to an analytics endpoint
  // Example: navigator.sendBeacon('/analytics', JSON.stringify(metric));
};

export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    onCLS(logPerformanceData);
    onFID(logPerformanceData);
    onLCP(logPerformanceData);
    onFCP(logPerformanceData);
    onTTFB(logPerformanceData);
  }
};