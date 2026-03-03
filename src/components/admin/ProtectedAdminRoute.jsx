
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05050A]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Yetkiler kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
