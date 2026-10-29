
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import SEOHead from '@/components/SEOHead';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
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

const AdminLogin = () => {
  const { signIn, signOut, user, loading: authLoading, isAdmin, session } = useAuth();
  const { checkAdminStatus } = useAdminCheck();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [, setLockTick] = useState(0);
  const [mfaGate, setMfaGate] = useState('unknown');
  const [mfaFactorId, setMfaFactorId] = useState(null);
  const [captcha, setCaptcha] = useState(null); // { id, answer } | null
  const [captchaRefresh, setCaptchaRefresh] = useState(0);

  const navigate = useNavigate();
  const signOutRef = useRef(signOut);
  signOutRef.current = signOut;

  const resetCaptcha = useCallback(() => {
    setCaptcha(null);
    setCaptchaRefresh((n) => n + 1);
  }, []);

  const lockRemainingMs = typeof window !== 'undefined' && email.trim() ? getLockRemainingMs(email) : 0;

  useEffect(() => {
    if (!email.trim() || getLockRemainingMs(email) <= 0) return undefined;
    const id = window.setInterval(() => setLockTick((t) => t + 1), 10_000);
    return () => clearInterval(id);
  }, [email]);

  const resolveMfaGate = useCallback(async () => {
    if (!user || !isAdmin) {
      setMfaGate('unknown');
      setMfaFactorId(null);
      return;
    }
    const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) {
      setMfaGate('mfa');
      return;
    }
    const needStepUp = aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal2';
    if (!needStepUp) {
      setMfaGate('ok');
      setMfaFactorId(null);
      return;
    }
    const { data: factors, error: fErr } = await supabase.auth.mfa.listFactors();
    if (fErr) {
      setErrorMsg('2FA bilgisi alınamadı. Lütfen tekrar deneyin.');
      setMfaGate('unknown');
      return;
    }
    const id = factors?.totp?.[0]?.id;
    if (!id) {
      setErrorMsg(
        'Bu hesapta doğrulanmış TOTP (Authenticator) faktörü yok. Supabase Dashboard’da kullanıcı için MFA kaydı gerekir.'
      );
      await signOutRef.current();
      setMfaGate('unknown');
      return;
    }
    setMfaFactorId(id);
    setMfaGate('mfa');
  }, [user, isAdmin]);

  useEffect(() => {
    resolveMfaGate();
  }, [resolveMfaGate, session?.access_token]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (user && isAdmin && mfaGate === 'ok') {
    return <Navigate to={ADMIN_BASE_PATH} replace />;
  }

  const lockMinutesCeil = Math.ceil(lockRemainingMs / 60_000);
  const isLocked = lockRemainingMs > 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLocked) {
      setErrorMsg(`${lockMinutesCeil} dakika sonra tekrar deneyin.`);
      return;
    }

    if (!email || !password) {
      setErrorMsg('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Geçerli bir e-posta adresi formatı giriniz.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (!captcha || !captcha.id || !captcha.answer) {
      setErrorMsg('Lütfen güvenlik sorusunu (matematik doğrulaması) cevaplayın.');
      return;
    }

    setIsSubmitting(true);

    try {
      const captchaResult = await verifyMathCaptcha(captcha.id, captcha.answer);
      if (!captchaResult.ok) {
        setErrorMsg(
          mathCaptchaUserMessage(captchaResult) || 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'
        );
        resetCaptcha();
        return;
      }

      const { data, error } = await signIn(email, password);

      if (error) {
        resetCaptcha();
        if (isInvalidCredentialsError(error)) {
          incrementPasswordFails(email);
        }
        const em = (error.message || '').toLowerCase();
        let displayError = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
        if (isInvalidCredentialsError(error)) {
          displayError = 'E-posta veya şifre hatalı.';
        } else if (em.includes('email not confirmed')) {
          displayError = 'Lütfen e-posta adresinizi doğrulayın.';
        } else if (em.includes('user not found')) {
          displayError = 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı.';
        } else if (
          em.includes('failed to fetch') ||
          em.includes('networkerror') ||
          (error.name === 'TypeError' && em.includes('fetch'))
        ) {
          displayError =
            'Supabase sunucusuna bağlanılamıyor. .env içinde VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY doğru projeye ait mi kontrol edin; başında/sonunda boşluk veya tırnak olmasın. VPN/engelleyici kapatıp sayfayı yenileyin. Geliştirmede: npm run dev’i .env değişikliğinden sonra yeniden başlatın.';
        } else {
          displayError = error.message;
        }
        setErrorMsg(displayError);
        return;
      }

      clearLoginAttempts(email);

      if (data?.user) {
        const { isAdmin: isUserAdmin, error: adminCheckError } = await checkAdminStatus(data.user.email);

        if (adminCheckError || !isUserAdmin) {
          setErrorMsg('Bu hesap admin yetkisine sahip değil.');
          resetCaptcha();
          await signOut();
          return;
        }
      }
    } catch (err) {
      console.error('Login exception:', err);
      setErrorMsg('Ağ hatası veya beklenmedik bir durum oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyTotp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const code = totpCode.replace(/\s/g, '');
    if (!code || code.length < 6) {
      setErrorMsg('Authenticator uygulamanızdaki 6 haneli kodu girin.');
      return;
    }
    if (!mfaFactorId) {
      setErrorMsg('Oturum hatası. Sayfayı yenileyin.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code,
      });
      if (error) {
        setErrorMsg(error.message || 'Kod geçersiz veya süresi doldu.');
        return;
      }
      setTotpCode('');
      await resolveMfaGate();
    } catch (err) {
      console.error('MFA verify:', err);
      setErrorMsg('Doğrulama sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showMfaStep = Boolean(user && isAdmin && mfaGate === 'mfa');
  const showMfaLoading = Boolean(user && isAdmin && mfaGate === 'unknown');

  return (
    <>
      <SEOHead title="Yönetici Girişi | QruzeTV" noindex />
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#141414]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0a0a0a]/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e50914]/20 to-[#b20710]/20 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                {showMfaStep ? (
                  <KeyRound className="w-10 h-10 text-primary" />
                ) : (
                  <Lock className="w-10 h-10 text-primary" />
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                {showMfaStep ? 'İki adımlı doğrulama' : 'Yönetici Girişi'}
              </h1>
              <p className="text-slate-400 text-sm text-center">
                {showMfaStep
                  ? 'Google Authenticator / Authy uygulamanızdaki kodu girin.'
                  : 'Devam etmek için giriş yapın.'}
              </p>
            </div>

            {isLocked && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
                Çok fazla hatalı deneme. {lockMinutesCeil} dakika sonra tekrar deneyin.
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            {showMfaLoading && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-slate-400 text-sm">Oturum doğrulanıyor...</p>
              </div>
            )}

            {!showMfaLoading && showMfaStep && (
              <form onSubmit={handleVerifyTotp} className="space-y-5">
                <p className="text-slate-500 text-xs text-center break-all">{email}</p>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">TOTP kodu</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    value={totpCode}
                    onChange={(ev) => {
                      setTotpCode(ev.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="bg-black/40 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl tracking-widest text-center text-lg"
                    disabled={isSubmitting}
                    maxLength={10}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !totpCode.trim()}
                  className="w-full h-12 bg-primary hover:bg-primary text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Doğrulanıyor...</span>
                    </>
                  ) : (
                    'Doğrula ve devam et'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                  onClick={() =>
                    signOut().then(() => {
                      setTotpCode('');
                      resetCaptcha();
                    })
                  }
                >
                  Farklı hesap
                </Button>
              </form>
            )}

            {!showMfaLoading && !showMfaStep && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">E-posta</Label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="bg-black/40 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl"
                    disabled={isSubmitting || isLocked}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Şifre</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="bg-black/40 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl"
                    disabled={isSubmitting || isLocked}
                    required
                  />
                </div>

                <MathCaptcha
                  onChange={setCaptcha}
                  refreshSignal={captchaRefresh}
                  disabled={isSubmitting || isLocked}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting || !email || !password || isLocked || !captcha}
                  className="w-full h-12 bg-primary hover:bg-primary text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Giriş Yapılıyor...</span>
                    </>
                  ) : (
                    'Giriş Yap'
                  )}
                </Button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 mx-auto text-slate-500 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
