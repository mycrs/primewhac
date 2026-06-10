
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';
import { ADMIN_LOGIN_PATH } from '@/constants/adminRoutes';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading, session } = useAuth();
  const location = useLocation();
  const [mfaSatisfied, setMfaSatisfied] = useState(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      setMfaSatisfied(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (cancelled) return;
      if (error) {
        setMfaSatisfied(false);
        return;
      }
      const needStepUp = aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal2';
      setMfaSatisfied(!needStepUp);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, session?.access_token]);

  if (loading || (user && isAdmin && mfaSatisfied === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05050A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Yetkiler kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to={ADMIN_LOGIN_PATH} state={{ from: location }} replace />;
  }

  if (mfaSatisfied === false) {
    return <Navigate to={ADMIN_LOGIN_PATH} state={{ from: location, needMfa: true }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
