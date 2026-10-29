/**
 * Intelligent Bot Protection Module Configuration
 */

export const botProtectionConfig = {
  challengeRate: 'low',
  bypassTrustedUsers: true,
  thresholds: {
    suspiciousScore: 0.8, // 0.0 to 1.0
    captchaRequired: 0.9
  },
  fingerprinting: {
    enabled: true,
    collectCanvas: true,
    collectAudio: true
  },
  captcha: {
    mode: 'invisible',
    provider: 'internal-math-captcha',
  },
};

/**
 * Mock frontend fingerprinting utility
 */
export const generateUserFingerprint = () => {
  if (!botProtectionConfig.fingerprinting.enabled) return 'anonymous';
  
  const nav = window.navigator;
  const screen = window.screen;
  return btoa(`${nav.userAgent}-${screen.width}x${screen.height}-${nav.language}`).substring(0, 32);
};