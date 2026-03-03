
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      setIsValidating(false);
    }
  }, [loading]);

  if (loading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F1E]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-sm font-medium">Oturum doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
