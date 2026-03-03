/**
 * Retry logic utility with exponential backoff and circuit breaker pattern.
 */

const circuitBreaker = {
  failures: 0,
  maxFailures: 5,
  isTripped: false,
  resetTime: 60000, // 1 minute
  lastFailureTime: null
};

export const checkCircuitBreaker = () => {
  if (circuitBreaker.isTripped) {
    if (Date.now() - circuitBreaker.lastFailureTime > circuitBreaker.resetTime) {
      // Reset circuit breaker
      circuitBreaker.isTripped = false;
      circuitBreaker.failures = 0;
      return true;
    }
    return false; // Still tripped
  }
  return true;
};

export const executeWithRetry = async (
  operation, 
  maxRetries = 3, 
  baseDelay = 1000, 
  fallbackData = null
) => {
  if (!checkCircuitBreaker()) {
    console.warn('Circuit breaker tripped. Returning fallback data.');
    return fallbackData;
  }

  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await operation();
      // Success resets circuit breaker failures
      circuitBreaker.failures = 0;
      return result;
    } catch (error) {
      attempt++;
      circuitBreaker.failures++;
      circuitBreaker.lastFailureTime = Date.now();

      if (circuitBreaker.failures >= circuitBreaker.maxFailures) {
        circuitBreaker.isTripped = true;
      }

      if (attempt >= maxRetries) {
        console.error(`Operation failed after ${maxRetries} attempts.`);
        if (fallbackData !== null) {
          console.warn('Using cached/fallback data.');
          return fallbackData;
        }
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};