
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { isTokenExpired } from '@/utils/jwtValidator';
import { refreshSessionToken } from '@/utils/sessionRecoveryEnhanced';
import { resetSupabaseSession } from '@/utils/ComprehensiveSessionReset';
import { validateTokenBeforeUse } from '@/utils/SessionValidationMiddleware';
import { resetTokenRefresh } from '@/utils/TokenRefreshReset';

export const useTokenRefresh = (session, onLogoutRequired) => {
  const timeoutRef = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!session?.access_token || window.__disableAutoRefresh) return;

    const scheduleRefresh = () => {
      try {
        const validation = validateTokenBeforeUse(session.access_token);
        if (!validation.isValid) {
          console.error('[TokenRefresh] Current token invalid before refresh. Triggering reset.');
          handleCriticalReset();
          return;
        }

        const expiresAt = session.expires_at * 1000;
        const timeNow = Date.now();
        const refreshBuffer = 5 * 60 * 1000; 
        const timeUntilRefresh = expiresAt - timeNow - refreshBuffer;

        if (timeUntilRefresh <= 0 || isTokenExpired(session.access_token)) {
          performRefresh();
        } else {
          timeoutRef.current = setTimeout(performRefresh, timeUntilRefresh);
          window.__refreshTimeout = timeoutRef.current;
        }
      } catch (err) {
        console.error('[TokenRefresh] Error scheduling refresh:', err);
      }
    };

    const handleCriticalReset = async () => {
      resetTokenRefresh();
      await resetSupabaseSession();
      if (onLogoutRequired) {
        onLogoutRequired('Güvenlik nedeniyle oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.');
      }
    };

    const performRefresh = async () => {
      console.log(`[TokenRefresh] Proactively refreshing token... (Attempt ${retryCount.current + 1})`);
      
      const validation = validateTokenBeforeUse(session.access_token);
      if (!validation.isValid) {
        await handleCriticalReset();
        return;
      }

      const result = await refreshSessionToken();
      
      if (result.success && result.session?.access_token) {
        const postValidation = validateTokenBeforeUse(result.session.access_token);
        if (!postValidation.isValid) {
           console.error('[TokenRefresh] Refreshed token is invalid. Triggering reset.');
           await handleCriticalReset();
           return;
        }
        
        console.log('[TokenRefresh] Token successfully refreshed and validated.');
        retryCount.current = 0;
      } else {
        console.error('[TokenRefresh] Refresh failed:', result.error);
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1;
          const backoff = Math.pow(2, retryCount.current) * 1000;
          timeoutRef.current = setTimeout(performRefresh, backoff);
        } else {
          await handleCriticalReset();
        }
      }
    };

    scheduleRefresh();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [session, onLogoutRequired]);
};
