
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const { signIn, signOut, user, loading: authLoading, isAdmin } = useAuth();
  const { checkAdminStatus } = useAdminCheck();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

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

    setIsSubmitting(true);
    
    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        let displayError = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
        if (error.message.includes('Invalid login credentials')) {
          displayError = 'E-posta veya şifre hatalı.';
        } else if (error.message.includes('Email not confirmed')) {
          displayError = 'Lütfen e-posta adresinizi doğrulayın.';
        } else if (error.message.includes('User not found')) {
          displayError = 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı.';
        } else {
          displayError = error.message;
        }
        setErrorMsg(displayError);
        return;
      }

      if (data?.user) {
        // Verify admin status from the admin_users table
        const { isAdmin: isUserAdmin, error: adminCheckError } = await checkAdminStatus(data.user.email);
        
        if (adminCheckError || !isUserAdmin) {
          setErrorMsg('Bu hesap admin yetkisine sahip değil.');
          await signOut();
          return;
        }
        
        // Success! Navigation will happen automatically via the condition at the top
        // once the auth context updates.
      }

    } catch (err) {
      console.error("Login exception:", err);
      setErrorMsg('Ağ hatası veya beklenmedik bir durum oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errorMsg) setErrorMsg('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMsg) setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <Lock className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Yönetici Girişi</h1>
            <p className="text-slate-400 text-sm text-center">Devam etmek için giriş yapın.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">E-posta</Label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={handleEmailChange}
                className="bg-black/40 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Şifre</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className="bg-black/40 border-slate-800 text-white placeholder:text-slate-600 h-12 rounded-xl"
                disabled={isSubmitting}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2 transition-all"
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
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2 mx-auto text-slate-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
