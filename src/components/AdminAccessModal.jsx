
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { errorLogger, ERROR_SEVERITY } from '@/utils/errorLogger';
import { ADMIN_BASE_PATH } from '@/constants/adminRoutes';
import MathCaptcha from '@/components/MathCaptcha';
import { verifyMathCaptcha, mathCaptchaUserMessage } from '@/utils/mathCaptchaClient';

const MAX_PASSWORD_FAILS = 5;
const LOCK_MS = 10 * 60 * 1000;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function lockStorageKey(email) {
  return `admin_login_lock_${normalizeEmail(email)}`;
}

function failStorageKey(email) {
  return `admin_login_fails_${normalizeEmail(email)}`;
}

function getLockRemainingMs(email) {
  if (typeof window === 'undefined' || !email) return 0;
  try {
    const end = parseInt(localStorage.getItem(lockStorageKey(email)) || '0', 10);
    if (!Number.isFinite(end) || end <= 0) return 0;
    return Math.max(0, end - Date.now());
  } catch {
    return 0;
  }
}

function setLoginLock(email) {
  try {
    localStorage.setItem(lockStorageKey(email), String(Date.now() + LOCK_MS));
    localStorage.removeItem(failStorageKey(email));
  } catch {
    /* ignore */
  }
}

function incrementPasswordFails(email) {
  try {
    const key = failStorageKey(email);
    const n = (parseInt(localStorage.getItem(key) || '0', 10) || 0) + 1;
    localStorage.setItem(key, String(n));
    if (n >= MAX_PASSWORD_FAILS) setLoginLock(email);
  } catch {
    /* ignore */
  }
}

function clearLoginAttempts(email) {
  try {
    localStorage.removeItem(failStorageKey(email));
    localStorage.removeItem(lockStorageKey(email));
  } catch {
    /* ignore */
  }
}

function isInvalidCredentialsError(error) {
  const em = (error?.message || '').toLowerCase();
  return em.includes('invalid login credentials') || em.includes('invalid_credentials');
}

const AdminAccessModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [captcha, setCaptcha] = useState(null); // { id, answer } | null
  const [captchaRefresh, setCaptchaRefresh] = useState(0);
  const [, setLockTick] = useState(0);
  const { signIn, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const lockRemainingMs = typeof window !== 'undefined' && email.trim() ? getLockRemainingMs(email) : 0;
  const lockMinutesCeil = Math.ceil(lockRemainingMs / 60_000);
  const isLocked = lockRemainingMs > 0;

  useEffect(() => {
    if (!email.trim() || getLockRemainingMs(email) <= 0) return undefined;
    const id = window.setInterval(() => setLockTick((t) => t + 1), 10_000);
    return () => clearInterval(id);
  }, [email]);

  const resetCaptcha = useCallback(() => {
    setCaptcha(null);
    setCaptchaRefresh((n) => n + 1);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLocked) {
      setErrorMsg(`Çok fazla hatalı deneme. ${lockMinutesCeil} dakika sonra tekrar deneyin.`);
      return;
    }

    if (!email || !password) {
      setErrorMsg('Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (!captcha || !captcha.id || !captcha.answer) {
      setErrorMsg('Lütfen güvenlik sorusunu (matematik doğrulaması) cevaplayın.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    errorLogger.log(`Modal login attempt for: ${email}`, ERROR_SEVERITY.INFO, { context: 'AdminAccessModal' });

    try {
      const captchaResult = await verifyMathCaptcha(captcha.id, captcha.answer);
      if (!captchaResult.ok) {
        errorLogger.log('Modal captcha verification failed', ERROR_SEVERITY.WARNING, { context: 'AdminAccessModal' });
        if (isMounted.current) {
          setErrorMsg(
            mathCaptchaUserMessage(captchaResult) || 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'
          );
        }
        resetCaptcha();
        return;
      }

      const { data, error } = await signIn(email, password);

      if (error) {
        errorLogger.log(`Modal login failed: ${error.message}`, ERROR_SEVERITY.WARNING, { context: 'AdminAccessModal' });
        if (isInvalidCredentialsError(error)) {
          incrementPasswordFails(email);
        }
        resetCaptcha();
        if (isMounted.current) {
          setErrorMsg(
            isInvalidCredentialsError(error)
              ? 'E-posta veya şifre hatalı.'
              : error.message || 'Giriş başarısız.'
          );
        }
        return;
      }

      if (data?.session) {
        clearLoginAttempts(email);
        errorLogger.log(`Modal login successful for: ${email}`, ERROR_SEVERITY.INFO, { context: 'AdminAccessModal' });
        toast({
          title: "Giriş Başarılı",
          description: "Yönetici paneline yönlendiriliyorsunuz.",
          className: "bg-green-600 border-none text-white"
        });
        onClose();
        navigate(ADMIN_BASE_PATH);
      } else {
        resetCaptcha();
        if (isMounted.current) setErrorMsg('Oturum açılamadı. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      errorLogger.log(`Unexpected error in modal login: ${err}`, ERROR_SEVERITY.ERROR, { context: 'AdminAccessModal' });
      resetCaptcha();
      if (isMounted.current) setErrorMsg('Beklenmeyen bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleAdminRedirect = () => {
    onClose();
    navigate(ADMIN_BASE_PATH);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose(open)}>
      <DialogContent className="sm:max-w-[425px] w-[95%] bg-[#0a0a0a] border-white/10 text-white p-0 overflow-hidden mx-auto rounded-xl">
        <div className="p-4 sm:p-6">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              Yönetici Erişimi
            </DialogTitle>
          </DialogHeader>

          {session ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 font-medium text-sm sm:text-base">Zaten giriş yapmış durumdasınız.</p>
              </div>
              <Button onClick={handleAdminRedirect} className="w-full bg-[#e50914] hover:bg-[#b20710] text-white h-12">
                Panele Git
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {isLocked && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                  <p className="text-amber-200 text-sm font-medium">
                    Çok fazla hatalı deneme. {lockMinutesCeil} dakika sonra tekrar deneyin.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                  <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-2 relative">
                <label className="text-xs sm:text-sm font-medium text-gray-300">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#0a0a0a] border-white/10 text-white focus:border-primary placeholder:text-gray-500 h-12"
                    placeholder="admin@example.com"
                    required
                    disabled={loading || isLocked}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-300">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#0a0a0a] border-white/10 text-white focus:border-primary placeholder:text-gray-500 h-12"
                    placeholder="••••••••"
                    required
                    disabled={loading || isLocked}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <MathCaptcha
                onChange={setCaptcha}
                refreshSignal={captchaRefresh}
                disabled={loading || isLocked}
              />

              <Button
                type="submit"
                className="w-full bg-[#e50914] hover:bg-[#b20710] text-white mt-4 h-12 sm:h-14 font-bold"
                disabled={loading || !captcha || isLocked}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : null}
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAccessModal;
