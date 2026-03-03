/**
 * Monitoring and Error Handling System
 */
import { executeWithRetry } from './retryLogic';

class MonitoringSystem {
  constructor() {
    this.metrics = {
      uptimeStart: Date.now(),
      errors: [],
      performance: []
    };
  }

  logError(type, message, context = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type,
      message,
      context
    };
    
    this.metrics.errors.push(errorLog);
    console.error(`[Monitor: ${type}]`, message, context);
    
    // Alert system trigger
    if (this.metrics.errors.length > 50) {
      this.triggerAlert('High error rate detected');
      this.metrics.errors.shift(); // Keep log size manageable
    }
  }

  logPerformance(metricName, durationMs) {
    this.metrics.performance.push({
      timestamp: new Date().toISOString(),
      metric: metricName,
      duration: durationMs
    });
  }

  triggerAlert(message) {
    console.warn(`🚨 ALERT SYSTEM: ${message}`);
    // In a real app, this would send an event to Sentry/Datadog
  }

  /**
   * Wrapper for API requests to handle 502/503/504 errors with retries
   */
  async handleNetworkRequest(requestFn, fallbackData = null) {
    const startTime = Date.now();
    
    try {
      const result = await executeWithRetry(async () => {
        const response = await requestFn();
        
        // Handle specific server errors
        if (response && response.status >= 500) {
          const status = response.status;
          if ([502, 503, 504].includes(status)) {
            throw new Error(`Server Error: ${status}`);
          }
        }
        return response;
      }, 3, 1000, fallbackData);
      
      this.logPerformance('NetworkRequest', Date.now() - startTime);
      return result;
      
    } catch (error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        this.logError('TimeoutError', 'Request timed out > 60s', { error: error.message });
      } else {
        this.logError('ConnectionError', 'Failed to connect to backend', { error: error.message });
      }
      return fallbackData;
    }
  }
  
  getUptime() {
    return Math.floor((Date.now() - this.metrics.uptimeStart) / 1000); // in seconds
  }
}

export const monitor = new MonitoringSystem();