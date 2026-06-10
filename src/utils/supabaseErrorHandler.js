
import { errorLogger, ERROR_SEVERITY } from '@/utils/errorLogger';
import { checkOnlineStatus, isNetworkError } from './networkConnectivity';

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const isRetryableError = (error) => {
  if (!error) return false;
  const status = error.status || error.code;
  
  // Non-retryable auth/authz errors
  if (
    status === 401 || 
    status === 403 || 
    status === 'PGRST301' || 
    status === 'PGRST116' ||
    error.message?.includes('missing sub claim') ||
    error.message?.includes('JWT')
  ) {
    return false;
  }
  
  return true;
};

/** Kullanıcıya asla ham API / altyapı metni sızdırmaz (toast dışı kısa özet). */
export const getUserFriendlyMessage = (error) => {
  if (!error) return 'Geçici olarak bağlantı kurulamadı.';

  const msg = error.message?.toLowerCase() || '';

  if (isNetworkError(error) || !checkOnlineStatus()) {
    return 'İnternet bağlantınızı kontrol edip tekrar deneyebilirsiniz.';
  }

  if (msg.includes('timeout') || msg.includes('zaman aşımına') || msg.includes('zaman aşımı')) {
    return 'İstek zaman aşımına uğradı. Lütfen bir süre sonra tekrar deneyin.';
  }

  if (msg.includes('missing sub claim') || msg.includes('jwt')) {
    return 'Oturum süresi dolmuş olabilir. Yönetici sayfası için tekrar giriş yapın.';
  }

  if (error.code === '42501' || msg.includes('row-level security')) {
    return 'Bu işlem için yetkiniz bulunmuyor.';
  }

  return 'Geçici olarak bağlantı kurulamadı.';
};

export const executeSupabaseQuery = async (queryFn, options = {}) => {
  const { 
    retries = 3, 
    backoffMs = 1000, 
    context = 'supabase_query', 
    fallback = null,
    timeoutMs = 10000
  } = options;
  
  if (!checkOnlineStatus()) {
    const error = new Error("İnternet bağlantısı yok.");
    errorLogger.log(error, ERROR_SEVERITY.WARNING, { context, online: false });
    return { data: fallback, error, isFallback: true, message: getUserFriendlyMessage(error) };
  }

  let lastError = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Execute query with a strict timeout wrapper
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('İstek zaman aşımına uğradı')), timeoutMs)
      );

      const result = await Promise.race([queryFn(), timeoutPromise]);

      if (result && result.error) {
        throw result.error;
      }

      return {
        data: result?.data ?? result,
        count: typeof result?.count === 'number' ? result.count : undefined,
        error: null,
        isFallback: false,
      };
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.code;
      
      errorLogger.log(error, ERROR_SEVERITY.WARNING, { context, attempt: attempt + 1, status });

      if (!isRetryableError(error)) {
        break; // Authentication/Authorization errors shouldn't be retried
      }
      
      if (attempt < retries - 1) {
        // Exponential backoff: 1s, 2s, 4s...
        await delay(backoffMs * Math.pow(2, attempt));
      }
    }
  }

  const friendlyMessage = getUserFriendlyMessage(lastError);
  if (lastError) lastError.friendlyMessage = friendlyMessage;

  errorLogger.log(lastError, ERROR_SEVERITY.CRITICAL, { context, finalAttempt: true });
  
  return { 
    data: fallback, 
    error: lastError, 
    isFallback: true, 
    message: friendlyMessage
  };
};
