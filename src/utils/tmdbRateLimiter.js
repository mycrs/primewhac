/**
 * TMDB Rate Limiter
 * Enforces strict 4 requests per second limit.
 * Implements exponential backoff.
 */

const RATE_LIMIT_CONFIG = {
  maxRequestsPerSecond: 4,
  interval: 1000, // 1 second
  maxRetries: 3,
  dailyLimit: 40000 // TMDB Daily limit roughly
};

let requestQueue = [];
let processing = false;
let requestCountWindow = 0;
let dailyRequestCount = 0;
let windowStartTime = Date.now();

// Reset window every second
setInterval(() => {
  requestCountWindow = 0;
  windowStartTime = Date.now();
  processQueue(); // Try to process queue if it was stalled
}, RATE_LIMIT_CONFIG.interval);

/**
 * Creates a delay promise
 */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Queue a request to be processed respecting rate limits
 * @param {Function} requestFn - Function that returns a promise (the axios call)
 * @param {number} retryCount - Current retry attempt
 */
export const queueRequest = async (requestFn, retryCount = 0) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      requestFn,
      resolve,
      reject,
      retryCount
    });
    processQueue();
  });
};

/**
 * Process the request queue
 */
const processQueue = async () => {
  if (processing) return;
  if (requestQueue.length === 0) return;

  // Check limits
  if (requestCountWindow >= RATE_LIMIT_CONFIG.maxRequestsPerSecond) {
    // Wait for next window reset (handled by setInterval)
    return;
  }

  processing = true;

  while (requestQueue.length > 0 && requestCountWindow < RATE_LIMIT_CONFIG.maxRequestsPerSecond) {
    const task = requestQueue.shift();
    requestCountWindow++;
    dailyRequestCount++;

    try {
      const result = await task.requestFn();
      task.resolve(result);
    } catch (error) {
      // Handle Rate Limit (429) specifically or Network Errors
      if ((error.response?.status === 429 || !error.response) && task.retryCount < RATE_LIMIT_CONFIG.maxRetries) {
        // Exponential Backoff
        const delay = Math.pow(2, task.retryCount) * 1000;
        console.warn(`Rate limit hit or network error. Retrying in ${delay}ms...`);
        
        await wait(delay);
        
        // Re-queue at the front
        requestQueue.unshift({
          ...task,
          retryCount: task.retryCount + 1
        });
        
        // Decrement counters since this attempt failed/didn't complete successfully in a way that counts against valid data usage (though technically 429 counts as a request, we want to retry logic separately)
      } else {
        task.reject(error);
      }
    }
  }

  processing = false;
};

export const getRateLimitStatus = () => ({
  queueLength: requestQueue.length,
  usedInWindow: requestCountWindow,
  dailyTotal: dailyRequestCount,
  remainingInWindow: RATE_LIMIT_CONFIG.maxRequestsPerSecond - requestCountWindow
});

export const createRateLimiter = () => ({
  queueRequest,
  getRateLimitStatus
});