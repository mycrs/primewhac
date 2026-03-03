// Simple performance logging utility
export const logPerformance = (componentName) => {
  // Check if window.performance exists to avoid errors in some environments
  if (typeof window !== 'undefined' && window.performance) {
    const now = window.performance.now();
    // Intentionally simplified for production
    // console.log(`[Performance] ${componentName} rendered at ${Math.round(now)}ms`);
  }
};