/**
 * TMDB API Monitoring & Logging System
 * Tracks API usage, performance, and errors.
 */

const monitoringStats = {
  requests: {
    total: 0,
    success: 0,
    failed: 0,
    cached: 0
  },
  errors: [],
  latencies: []
};

const MAX_LOG_SIZE = 100;

export const logAPICall = (endpoint, duration, status, isCached = false) => {
  monitoringStats.requests.total++;
  
  if (isCached) {
    monitoringStats.requests.cached++;
  } else if (status >= 200 && status < 300) {
    monitoringStats.requests.success++;
  } else {
    monitoringStats.requests.failed++;
  }

  // Track latency for non-cached successful requests
  if (!isCached && status >= 200 && status < 300) {
    monitoringStats.latencies.push(duration);
    if (monitoringStats.latencies.length > MAX_LOG_SIZE) {
      monitoringStats.latencies.shift();
    }
  }

  // Console log in dev for visibility
  if (import.meta.env.DEV) {
    const color = status >= 200 && status < 300 ? 'green' : 'red';
    const type = isCached ? '[CACHE]' : '[NETWORK]';
    console.debug(`%c${type} TMDB API: ${endpoint} - ${duration}ms (${status})`, `color: ${color}`);
  }
};

export const logError = (endpoint, error) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    endpoint,
    message: error.message || 'Unknown Error',
    code: error.code || error.response?.status,
    stack: import.meta.env.DEV ? error.stack : undefined
  };

  monitoringStats.errors.push(errorLog);
  if (monitoringStats.errors.length > MAX_LOG_SIZE) {
    monitoringStats.errors.shift();
  }

  // Alert on high error rate logic could go here
  alertOnAnomalies();
};

export const getMonitoringStats = () => {
  const avgLatency = monitoringStats.latencies.length 
    ? monitoringStats.latencies.reduce((a, b) => a + b, 0) / monitoringStats.latencies.length 
    : 0;

  return {
    ...monitoringStats.requests,
    averageLatency: Math.round(avgLatency),
    recentErrors: monitoringStats.errors.length
  };
};

export const alertOnAnomalies = () => {
  const errorRate = monitoringStats.requests.total > 0 
    ? monitoringStats.requests.failed / monitoringStats.requests.total 
    : 0;

  if (errorRate > 0.2 && monitoringStats.requests.total > 10) {
    console.warn('TMDB Monitor Alert: High API Error Rate detected (>20%)');
  }
};