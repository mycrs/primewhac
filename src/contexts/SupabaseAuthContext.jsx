
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { errorLogger, ERROR_SEVERITY } from '@/utils/errorLogger';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verifyAdminStatus = async (currentUser) => {
    if (!currentUser?.email) return false;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('is_admin')
        .eq('email', currentUser.email)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        errorLogger.log(error, ERROR_SEVERITY.WARNING, { context: 'verifyAdminStatus' });
      }
      return !!data?.is_admin;
    } catch (err) {
      errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'verifyAdminStatus_exception' });
      return false;
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
            const adminStatus = await verifyAdminStatus(session.user);
            if (mounted) setIsAdmin(adminStatus);
          } else {
            if (mounted) setIsAdmin(false);
          }
          setError(null);
        }
      } catch (err) {
        errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'initializeAuth' });
        if (mounted) {
           setError(err);
           setUser(null);
           setSession(null);
           setIsAdmin(false);
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
            const adminStatus = await verifyAdminStatus(currentSession.user);
            if (mounted) setIsAdmin(adminStatus);
          } else {
            if (mounted) setIsAdmin(false);
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
      if (result.error) throw result.error;
      return result;
    } catch (err) {
      errorLogger.log(err, ERROR_SEVERITY.ERROR, { context: 'signInWithEmail' });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      errorLogger.log(err, ERROR_SEVERITY.WARNING, { context: 'signOut' });
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  };

  const value = {
    user,
    session,
    isAdmin,
    loading,
    error,
    signInWithEmail,
    signIn: signInWithEmail,
    signOut
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
