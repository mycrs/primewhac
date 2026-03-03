
import { parseJWT } from './jwtValidator';
import { validateTokenBeforeUse } from './SessionValidationMiddleware';

export const logSessionState = async (session) => {
  console.group('[SessionDebugger] Current Session State');
  console.log('Session Exists:', !!session);
  if (session?.access_token) {
    const payload = parseJWT(session.access_token);
    console.log('Token Payload Claims:', Object.keys(payload || {}));
    console.log('Has sub claim:', !!payload?.sub);
    console.log('Has session_id claim:', !!payload?.session_id);
  }
  console.groupEnd();
};

export const validateSessionIntegrity = (session) => {
  if (!session?.access_token) return { corrupted: false, reason: 'No session' };
  const validation = validateTokenBeforeUse(session.access_token);
  return { corrupted: !validation.isValid, reason: validation.error };
};

export const suggestRecoverySteps = (integrityReport) => {
  if (!integrityReport.corrupted) return 'No action needed. Session is healthy.';
  if (integrityReport.reason?.includes('Missing required claims')) {
    return 'CRITICAL: Token missing claims. Trigger ComprehensiveSessionReset and force fresh login.';
  }
  return 'Session malformed. Clear storage and re-authenticate.';
};

export const generateSessionReport = (session) => {
  const integrity = validateSessionIntegrity(session);
  return {
    timestamp: new Date().toISOString(),
    hasSession: !!session,
    integrity,
    recoveryRecommendation: suggestRecoverySteps(integrity)
  };
};

export default { logSessionState, validateSessionIntegrity, suggestRecoverySteps, generateSessionReport };
