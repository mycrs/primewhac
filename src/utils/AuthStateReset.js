
/**
 * Utility to reset all auth-related state via callback or structured object
 */
export const resetAuthState = (setters = {}) => {
  console.log('[AuthStateReset] Resetting all auth-related state to null/false...');
  
  if (setters.setUser) setters.setUser(null);
  if (setters.setSession) setters.setSession(null);
  if (setters.setAuthError) setters.setAuthError(null);
  if (setters.setLoading) setters.setLoading(false);
  
  return { 
    user: null, 
    token: null, 
    session: null, 
    error: null, 
    loading: false, 
    isAdmin: false 
  };
};

export default { resetAuthState };
