
import { supabase } from '@/lib/customSupabaseClient';
import TokenValidator from './tokenValidator';

/**
 * Comprehensive debugging utility for Auth Flow
 */

export const getAuthState = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return {
      hasSession: !!session,
      user: session?.user?.id || null,
      error: error?.message || null,
      expiresAt: session?.expires_at || null
    };
  } catch (e) {
    return { error: e.message };
  }
};

export const getTokenInfo = (token) => {
  if (!token) return { status: 'missing' };
  
  const structureValid = TokenValidator.validateTokenStructure(token);
  const segmentsValid = TokenValidator.validateTokenSegments(token);
  
  let header = null;
  let payloadInfo = null;
  
  if (structureValid) {
    try {
      const parts = token.split('.');
      header = JSON.parse(atob(parts[0]));
      // Safely check payload without strict base64url decoding rules just for debugging
      const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);
      payloadInfo = {
        hasSub: !!payload.sub,
        exp: payload.exp,
        iat: payload.iat
      };
    } catch (e) {
      payloadInfo = { error: 'Failed to decode payload safely for debugging' };
    }
  }

  return {
    status: structureValid ? 'structured' : 'malformed',
    segments: token.split('.').length,
    segmentsBase64Valid: segmentsValid,
    header,
    payloadInfo
  };
};

export const getSupabaseConfig = () => {
  return {
    urlLength: (import.meta.env.VITE_SUPABASE_URL || '').length,
    keyLength: (import.meta.env.VITE_SUPABASE_ANON_KEY || '').length,
    isDefined: !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
  };
};

export const generateAuthReport = async () => {
  const authState = await getAuthState();
  const config = getSupabaseConfig();
  
  // Safely check local storage keys
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes('supabase')) keys.push(key);
  }

  return {
    timestamp: new Date().toISOString(),
    config,
    authState,
    storageKeysFound: keys.length
  };
};

export const logAuthFlow = (step, details = {}) => {
  if (import.meta.env.DEV) {
    console.log(`[Auth Flow] ${step}`, details);
  }
};

export const AuthDebugger = {
  getAuthState,
  getTokenInfo,
  getSupabaseConfig,
  generateAuthReport,
  logAuthFlow
};

export default AuthDebugger;
