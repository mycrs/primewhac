
import { supabase } from '@/lib/customSupabaseClient';
import { errorLogger, ERROR_SEVERITY } from './errorLogger';

const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const withTimeout = (promise, ms) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Sunucu yanıt vermedi (Zaman aşımı).'));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

export const translateAuthError = (error) => {
  const msg = error?.message || '';
  if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (msg.includes('Email not confirmed')) return 'E-posta adresi doğrulanmamış.';
  if (msg.includes('User not found')) return 'Kullanıcı bulunamadı.';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) return 'Ağ bağlantısı hatası. Lütfen internetinizi kontrol edin.';
  if (msg.includes('Zaman aşımı')) return 'Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.';
  return 'Giriş yapılırken beklenmeyen bir hata oluştu.';
};

export const signInWithEmail = async (email, password, retries = 0) => {
  if (!email || !password) {
    return { data: null, error: new Error('E-posta ve şifre gereklidir.') };
  }

  try {
    errorLogger.log(`Attempting sign in for ${email}`, ERROR_SEVERITY.INFO, { context: 'signInWithEmail', attempt: retries + 1 });
    
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı.');
    }

    const authPromise = supabase.auth.signInWithPassword({ email, password });
    const { data, error } = await withTimeout(authPromise, TIMEOUT_MS);

    if (error) {
      throw error;
    }

    if (!data || !data.session) {
      throw new Error('Oturum verisi alınamadı.');
    }

    errorLogger.log(`Sign in successful for ${email}`, ERROR_SEVERITY.INFO, { context: 'signInWithEmail' });
    return { data, error: null };
  } catch (error) {
    const isNetworkError = error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError') || error?.message?.includes('Zaman aşımı');
    
    if (isNetworkError && retries < MAX_RETRIES) {
      errorLogger.log(`Network error during sign in, retrying... (${retries + 1}/${MAX_RETRIES})`, ERROR_SEVERITY.WARNING, { context: 'signInWithEmail_retry', originalError: error });
      await delay(1000 * (retries + 1)); // Exponential backoff
      return signInWithEmail(email, password, retries + 1);
    }

    errorLogger.log(error, ERROR_SEVERITY.WARNING, { context: 'signInWithEmail_failed', email });
    
    return {
      data: null,
      error: new Error(translateAuthError(error))
    };
  }
};
