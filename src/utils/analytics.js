export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onLCP }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onLCP(onPerfEntry);
    });
  }
};

export const logPerformance = (metric) => {
  console.log(`[Performance] ${metric.name}: ${metric.value} (id: ${metric.id})`);
};