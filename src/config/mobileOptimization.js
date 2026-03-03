/**
 * Mobile Optimization Configuration & Utilities
 */
import { useState, useEffect } from 'react';

export const mobileConfig = {
  mobileFirstApproach: true,
  responsiveDesign: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  performance: {
    disableHeavyAnimationsOnMobile: true,
    reduceImageQuality: false, // Serve appropriate sizes via srcSet instead
    touchOptimization: true
  },
  caching: {
    aggressiveMobileCaching: true
  }
};

/**
 * React hook to detect mobile viewport and apply optimizations
 */
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileConfig.responsiveDesign.breakpoints.md);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Apply touch optimizations
    if (mobileConfig.performance.touchOptimization && 'ontouchstart' in window) {
      document.documentElement.classList.add('touch-optimized');
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, config: mobileConfig };
};