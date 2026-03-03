/**
 * Frontend configuration representing server-side optimization settings.
 * Note: As this is a frontend application, these settings are used to configure
 * frontend API clients (like Axios/Fetch) to align with backend expectations.
 */

export const serverOptimizationConfig = {
  connectionPooling: {
    enabled: true,
    maxConnections: 100,
    minConnections: 10
  },
  timeouts: {
    connection: 60000, // 60s
    read: 120000,      // 120s
    write: 60000,      // 60s
    keepAlive: 90000,  // 90s
    idle: 300000       // 300s
  },
  keepAlive: {
    enabled: true,
    maxRequests: 1000
  },
  persistentConnections: {
    enabled: true
  }
};

export const getApiClientConfig = () => ({
  timeout: serverOptimizationConfig.timeouts.connection,
  headers: {
    'Connection': serverOptimizationConfig.keepAlive.enabled ? 'keep-alive' : 'close',
    'Keep-Alive': `timeout=${serverOptimizationConfig.timeouts.keepAlive / 1000}`
  }
});