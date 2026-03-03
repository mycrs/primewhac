
/**
 * Utility to completely reset token refresh mechanism
 */
export const resetTokenRefresh = () => {
  console.log('[TokenRefreshReset] Resetting token refresh mechanisms...');
  
  // 1. Clear token refresh timers/intervals (if tracked globally, otherwise component clears it)
  if (window.__refreshTimeout) {
    clearTimeout(window.__refreshTimeout);
    window.__refreshTimeout = null;
  }
  
  // 2. Clear cached tokens
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('refresh_token')) {
      localStorage.removeItem(key);
    }
  }
  
  // 3. Reset refresh error handlers / flags
  window.__refreshErrorCount = 0;
  
  // 4. Disable auto-refresh temporarily
  window.__disableAutoRefresh = true;
  setTimeout(() => {
    window.__disableAutoRefresh = false;
  }, 5000); // Re-enable after 5s

  return { success: true };
};

export default { resetTokenRefresh };
