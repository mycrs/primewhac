
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADMIN_LOGIN_PATH } from '@/constants/adminRoutes';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, adminStatus, loading, session, retryAdminCheck } = useAuth();
  const location = useLocation();
  const [mfaSatisfied, setMfaSatisfied] = useState(null);
  const [mfaCheckError, setMfaCheckError] = useState(false);
  const [mfaRetry, setMfaRetry] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      setMfaSatisfied(null);
      setMfaCheckError(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (cancelled) return;
      if (error) {
        setMfaSatisfied(null);
        setMfaCheckError(true);
        return;
      }
      setMfaCheckError(false);
      const needStepUp = aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal2';
      setMfaSatisfied(!needStepUp);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, session?.access_token, mfaRetry]);

  if (loading || adminStatus === 'checking' || (user && isAdmin && mfaSatisfied === null && !mfaCheckError)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05050A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Yetkiler kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ADMIN_LOGIN_PATH} state={{ from: location }} replace />;
  }

  if (adminStatus === 'error') {
    return (
      <AdminAccessRetry
        message="Yönetici yetkisi şu anda doğrulanamadı. Oturumunuz kapatılmadı."
        onRetry={retryAdminCheck}
      />
    );
  }

  if (!isAdmin || adminStatus === 'denied') {
    return <Navigate to={ADMIN_LOGIN_PATH} state={{ from: location }} replace />;
  }

  if (mfaCheckError) {
    return (
      <AdminAccessRetry
        message="Güvenlik doğrulaması şu anda kontrol edilemedi. Oturumunuz kapatılmadı."
        onRetry={() => setMfaRetry((value) => value + 1)}
      />
    );
  }

  if (mfaSatisfied === false) {
    return <Navigate to={ADMIN_LOGIN_PATH} state={{ from: location, needMfa: true }} replace />;
  }

  return children;
};

function AdminAccessRetry({ message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050A] p-6">
      <div className="w-full max-w-md rounded-xl border border-amber-900/50 bg-[#0a0a0a] p-6 text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-500" />
        <p className="mb-5 text-sm text-slate-300">{message}</p>
        <Button type="button" onClick={onRetry} className="bg-primary text-white">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tekrar Dene
        </Button>
      </div>
    </div>
  );
}

export default ProtectedAdminRoute;
