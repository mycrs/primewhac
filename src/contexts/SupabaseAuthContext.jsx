
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { errorLogger, ERROR_SEVERITY } from '@/utils/errorLogger';
import { adminLastActivityStorageKey } from '@/constants/adminRoutes';
import { resolveAdminAccess } from '@/utils/resolveAdminUser';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStatus, setAdminStatus] = useState('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyAdminStatus = async (currentUser) => {
    if (!currentUser?.email) return false;
    return resolveAdminAccess(supabase, currentUser);
  };

  const verifyAndStoreAdminStatus = async (currentUser) => {
    setAdminStatus('checking');
    try {
      const allowed = await verifyAdminStatus(currentUser);
      setIsAdmin(allowed);
      setAdminStatus(allowed ? 'allowed' : 'denied');
      setError(null);
      return allowed;
    } catch (err) {
      errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'verifyAdminStatus_exception' });
      setIsAdmin(false);
      setAdminStatus('error');
      setError(err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          if (session?.user) {
            await verifyAndStoreAdminStatus(session.user);
          } else {
            if (mounted) setIsAdmin(false);
            if (mounted) setAdminStatus('idle');
          }
        }
      } catch (err) {
        errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'initializeAuth' });
        if (mounted) {
           setError(err);
           setUser(null);
           setSession(null);
           setIsAdmin(false);
           setAdminStatus('idle');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (mounted) {
        try {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          if (currentSession?.user) {
            await verifyAndStoreAdminStatus(currentSession.user);
          } else {
            if (mounted) setIsAdmin(false);
            if (mounted) setAdminStatus('idle');
          }
        } catch (err) {
          errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'onAuthStateChange' });
        }
        
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email, password) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        errorLogger.log(result.error, ERROR_SEVERITY.WARNING, { context: 'signInWithEmail_failed' });
      }
      return result;
    } catch (err) {
      errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'signInWithEmail_exception' });
      return { data: { user: null, session: null }, error: err };
    }
  };

  const signOut = async () => {
    let userId;
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      userId = s?.user?.id;
      await supabase.auth.signOut();
    } catch (err) {
      errorLogger.log(err, ERROR_SEVERITY.WARNING, { context: 'signOut' });
    } finally {
      if (userId && typeof window !== 'undefined') {
        try {
          localStorage.removeItem(adminLastActivityStorageKey(userId));
        } catch {
          /* ignore */
        }
      }
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setAdminStatus('idle');
    }
  };

  const retryAdminCheck = async () => {
    if (!user) return false;
    return verifyAndStoreAdminStatus(user);
  };

  const value = {
    user,
    session,
    isAdmin,
    adminStatus,
    loading,
    error,
    signInWithEmail,
    signIn: signInWithEmail,
    signOut,
    retryAdminCheck
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
