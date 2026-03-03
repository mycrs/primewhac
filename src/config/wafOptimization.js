/**
 * WAF (Web Application Firewall) Configuration Parameters
 * Documentation config defining the backend WAF posture to inform frontend error handling.
 */

export const wafConfig = {
  sensitivity: 'Medium', // Reduced from High
  falsePositiveMinimization: true,
  rules: {
    sqlInjection: true,
    xss: true,
    pathTraversal: true
  },
  whitelisting: {
    enabled: true,
    expandTrustedIPs: true,
    allowedSubnets: ['10.0.0.0/8', '192.168.0.0/16'] // Example
  },
  blacklisting: {
    strictMaliciousOnly: true
  }
};