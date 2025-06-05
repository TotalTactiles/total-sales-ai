import { logger } from '@/utils/logger';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { AuthContextType, Profile, Role } from './types';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          logger.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        logger.info('Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        logger.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          // Immediately clear all state on sign out
          logger.info('Clearing all auth state');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          
          // Clear all storage
          localStorage.clear();
          sessionStorage.clear();
          
          return;
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      logger.error('Error in fetchProfile:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Signed in successfully');
      return {};
    } catch (error) {
      logger.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Check your email for verification link');
      return {};
    } catch (error) {
      logger.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logger.info('SignOut: Starting logout process...');
      
      // Clear state immediately to prevent any redirects during logout
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      
      // Clear all storage immediately
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase (this will trigger the SIGNED_OUT event)
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        logger.error('Supabase sign out error:', error);
      }
      
      logger.info('SignOut: Logout completed');
      
    } catch (error) {
      logger.error('Sign out error:', error);
      // Clear state even on error
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const isDemoMode = (): boolean => {
    return localStorage.getItem('demoMode') === 'true';
  };

  const setLastSelectedRole = (role: Role): void => {
    localStorage.setItem('lastSelectedRole', role);
  };

  const getLastSelectedRole = (): Role => {
    return (localStorage.getItem('lastSelectedRole') as Role) || 'sales_rep';
  };

  const initializeDemoMode = (role: Role): void => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
    setLastSelectedRole(role);
    setLoading(false);
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    fetchProfile,
    isDemoMode,
    setLastSelectedRole,
    getLastSelectedRole,
    initializeDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
