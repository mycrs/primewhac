
import TokenClaimsValidator from './TokenClaimsValidator';
import SessionClaimsValidator from './SessionClaimsValidator';

/**
 * Comprehensive JWT debugging utility
 */

const safeParse = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { header: null, payload: null };
    return {
      header: JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))),
      payload: JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    };
  } catch (e) {
    return { header: null, payload: null, error: e.message };
  }
};

export const analyzeToken = (token) => {
  if (!token) return { status: 'Missing' };
  
  const { header, payload, error } = safeParse(token);
  if (error) return { status: 'Parse Error', error };
  
  return {
    status: 'Parsed',
    header,
    payload,
    claimsReport: TokenClaimsValidator.getClaimsValidationReport(payload)
  };
};

export const analyzeSession = (session) => {
  if (!session) return { status: 'Missing' };
  return {
    status: 'Present',
    report: SessionClaimsValidator.getSessionValidationReport(session)
  };
};

export const compareTokenAndSession = (token, session) => {
  if (!token || !session) return { status: 'Missing Data' };
  const { payload } = safeParse(token);
  return SessionClaimsValidator.validateSessionConsistency(session, payload);
};

export const validateTokenClaimsComprehensively = (token) => {
  const { payload } = safeParse(token);
  return TokenClaimsValidator.getClaimsValidationReport(payload);
};

export const suggestTokenFixes = (token) => {
  const { payload } = safeParse(token);
  return TokenClaimsValidator.suggestClaimRecovery(payload);
};

export const generateDebugReport = (token, session) => {
  return {
    timestamp: new Date().toISOString(),
    tokenAnalysis: analyzeToken(token),
    sessionAnalysis: analyzeSession(session),
    comparison: compareTokenAndSession(token, session),
    suggestedFix: session ? SessionClaimsValidator.suggestSessionRecovery(session) : suggestTokenFixes(token)
  };
};

export const logTokenAnalysis = (token) => {
  console.group('[JWTDebugger] Token Analysis');
  console.log(analyzeToken(token));
  console.groupEnd();
};

export const exportDebugReport = (token, session) => {
  const report = generateDebugReport(token, session);
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auth-debug-report-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const JWTDebugger = {
  analyzeToken,
  analyzeSession,
  compareTokenAndSession,
  generateDebugReport,
  validateTokenClaimsComprehensively,
  suggestTokenFixes,
  logTokenAnalysis,
  exportDebugReport
};

export default JWTDebugger;
