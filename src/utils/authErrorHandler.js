
import { errorLogger, ERROR_SEVERITY } from './errorLogger';

export const handleAuthError = (error, context = 'auth_operation') => {
  const errorMsg = error?.message || '';
  const status = error?.status;
  
  errorLogger.log(error, ERROR_SEVERITY.WARNING, { context, status });

  const result = {
    requiresLogout: false,
    userMessage: 'Bir kimlik doğrulama hatası oluştu. Lütfen tekrar deneyin.',
    originalError: error
  };

  if (errorMsg.includes('refresh_token_not_found') || errorMsg.includes('Invalid Refresh Token')) {
    result.requiresLogout = true;
    result.userMessage = 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.';
  } else if (status === 401 || errorMsg.includes('Unauthorized') || errorMsg.includes('Invalid login credentials')) {
    result.requiresLogout = true;
    result.userMessage = 'Yetkisiz erişim veya hatalı bilgiler. Lütfen tekrar giriş yapın.';
  } else if (status === 400 || errorMsg.includes('Email not confirmed')) {
    result.userMessage = 'E-posta adresiniz henüz doğrulanmamış veya geçersiz istek.';
  } else if (errorMsg.includes('network') || errorMsg.includes('Failed to fetch')) {
    result.userMessage = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
  }

  return result;
};
