import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Simple debounce implementation
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Simple throttle implementation
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const PerformanceContext = createContext(null);

export const PerformanceProvider = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Optimized Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Debounce scroll updates for non-critical UI (10ms)
    const debouncedScroll = debounce(handleScroll, 10);
    
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  // Optimized Resize Handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Throttle resize events (100ms)
    const throttledResize = throttle(handleResize, 100);

    window.addEventListener('resize', throttledResize, { passive: true });
    return () => window.removeEventListener('resize', throttledResize);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsLowPowerMode(mediaQuery.matches);

    const handleChange = (e) => setIsLowPowerMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer Hook Factory
  const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [element, setElement] = useState(null);

    useEffect(() => {
      if (!element) return;

      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      });

      observer.observe(element);
      return () => observer.disconnect();
    }, [element, options]);

    return [setElement, isIntersecting];
  };

  const value = {
    scrollY,
    windowSize,
    isLowPowerMode,
    useIntersectionObserver,
    debounce,
    throttle
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export default PerformanceProvider;