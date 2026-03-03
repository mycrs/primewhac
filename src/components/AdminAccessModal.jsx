
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { errorLogger, ERROR_SEVERITY } from '@/utils/errorLogger';

const AdminAccessModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMsg('Lütfen tüm alanları doldurunuz.');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    errorLogger.log(`Modal login attempt for: ${email}`, ERROR_SEVERITY.INFO, { context: 'AdminAccessModal' });
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        errorLogger.log(`Modal login failed: ${error.message}`, ERROR_SEVERITY.WARNING, { context: 'AdminAccessModal' });
        if (isMounted.current) setErrorMsg(error.message || 'Giriş başarısız.');
        return;
      }
      
      if (data?.session) {
        errorLogger.log(`Modal login successful for: ${email}`, ERROR_SEVERITY.INFO, { context: 'AdminAccessModal' });
        toast({ 
          title: "Giriş Başarılı",
          description: "Yönetici paneline yönlendiriliyorsunuz.",
          className: "bg-green-600 border-none text-white"
        });
        onClose();
        navigate('/admin'); 
      } else {
        if (isMounted.current) setErrorMsg('Oturum açılamadı. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      errorLogger.log(`Unexpected error in modal login: ${err}`, ERROR_SEVERITY.ERROR, { context: 'AdminAccessModal' });
      if (isMounted.current) setErrorMsg('Beklenmeyen bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleAdminRedirect = () => {
    onClose();
    navigate('/admin');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose(open)}>
      <DialogContent className="sm:max-w-[425px] w-[95%] bg-[#0F0F1E] border-white/10 text-white p-0 overflow-hidden mx-auto rounded-xl">
        <div className="p-4 sm:p-6">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              Yönetici Erişimi
            </DialogTitle>
          </DialogHeader>

          {session ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 font-medium text-sm sm:text-base">Zaten giriş yapmış durumdasınız.</p>
              </div>
              <Button onClick={handleAdminRedirect} className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white h-12">
                Panele Git
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
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
                    className="pl-10 bg-[#1A1A2E] border-white/10 text-white focus:border-purple-500 placeholder:text-gray-500 h-12"
                    placeholder="admin@example.com"
                    required
                    disabled={loading}
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
                    className="pl-10 bg-[#1A1A2E] border-white/10 text-white focus:border-purple-500 placeholder:text-gray-500 h-12"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#A855F7] hover:bg-[#9333EA] text-white mt-4 h-12 sm:h-14 font-bold" 
                disabled={loading}
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
