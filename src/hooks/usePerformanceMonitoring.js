
import { useEffect, useRef } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export const usePerformanceMonitoring = (componentName) => {
  const renderStartTime = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  // Measure component render time
  useEffect(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;

    const renderTime = performance.now() - renderStartTime.current;
    
    // Use import.meta.env.DEV for Vite instead of process.env
    if (import.meta.env && import.meta.env.DEV) {
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      if (renderTime > 16) {
        console.warn(`[Performance Warning] ${componentName} took longer than 16ms to render (${renderTime.toFixed(2)}ms). This may cause dropped frames on mobile.`);
      }
    }
    
    // Reset for next render
    renderStartTime.current = performance.now();
  });

  // Measure Core Web Vitals once per component mount (usually best at app root, but included here as requested)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (import.meta.env && import.meta.env.DEV) {
      const logVital = (metric) => {
        console.log(`[Web Vitals] ${metric.name}: ${metric.value}`, metric);
      };

      onCLS(logVital);
      onFID(logVital);
      onLCP(logVital);
      onFCP(logVital);
      onTTFB(logVital);
    }
  }, []);
};

export default usePerformanceMonitoring;
