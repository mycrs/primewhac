/**
 * Frontend Rate Limit Optimizer & Request Throttling Configuration
 * Aligns client-side request pacing with the updated backend rate limits.
 */

export const rateLimitConfig = {
  requestsPerMinute: 1000,
  burstLimit: 100,
  timeoutMs: 60000,
  whitelistEnabled: true,
  trustedIPs: ['127.0.0.1', 'localhost'], // Example representation
  thresholds: {
    warning: 800,
    block: 1000
  }
};

// Local token bucket tracker for frontend requests
let tokens = rateLimitConfig.burstLimit;
let lastRefill = Date.now();

export const checkLocalRateLimit = () => {
  const now = Date.now();
  const timePassed = now - lastRefill;
  const refillAmount = (timePassed / 60000) * rateLimitConfig.requestsPerMinute;
  
  tokens = Math.min(rateLimitConfig.burstLimit, tokens + refillAmount);
  lastRefill = now;

  if (tokens >= 1) {
    tokens -= 1;
    return true; // Allowed
  }
  
  return false; // Throttled locally before hitting backend
};