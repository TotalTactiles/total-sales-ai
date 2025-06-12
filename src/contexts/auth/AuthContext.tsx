import { logger } from '@/utils/logger';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { initializeDemoUser } from './demoMode';
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { AuthContextType, Profile, Role } from './types';
import { toast } from 'sonner';
import { setLastSelectedRole, getLastSelectedRole, setLastSelectedCompanyId, getLastSelectedCompanyId } from './localStorage';
import { useNavigate } from 'react-router-dom';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          logger.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        }
      } catch (error) {
        logger.error('Error getting session:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        logger.info('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
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

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching profile:', error);
        return null;
      }

      logger.info('Fetched profile:', data);
      setProfile(data);
      
      if (data?.role) {
        setLastSelectedRole(data.role);
      }
      
      return data;
    } catch (error) {
      logger.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ profile?: Profile; error?: AuthError }> => {
    try {
      setLoading(true);

      // Clear demo mode before signing in
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');

      if (!isSupabaseConfigured) {
        let role: Role = 'sales_rep';
        
        if (email.includes('krishdev') || email.includes('developer')) {
          role = 'developer';
        } else if (email.includes('manager')) {
          role = 'manager';
        }
        
        const { demoUser, demoProfile } = initializeDemoUser(role);
        localStorage.setItem('demoMode', 'true');
        localStorage.setItem('demoRole', role);
        setLastSelectedRole(role);
        setUser(demoUser);
        setProfile(demoProfile);
        setSession(null);
        toast.success('Signed in using local demo mode');
        return { profile: demoProfile };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      const session = data.session;
      const user = data.user;

      setSession(session);
      setUser(user);

      let fetchedProfile: Profile | null = null;
      if (user) {
        fetchedProfile = await fetchProfile(user.id);
        if (fetchedProfile) {
          setLastSelectedRole(fetchedProfile.role);
        }
      }

      toast.success('Signed in successfully');
      return { profile: fetchedProfile || undefined };
    } catch (error) {
      logger.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: any
  ): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (!isSupabaseConfigured) {
        const role: Role = metadata?.role ?? (email.includes('manager') ? 'manager' : 'sales_rep');
        const { demoUser, demoProfile } = initializeDemoUser(role);
        localStorage.setItem('demoMode', 'true');
        localStorage.setItem('demoRole', role);
        setLastSelectedRole(role);
        setUser(demoUser);
        setProfile(demoProfile);
        setSession(null);
        toast.success('Demo account created successfully');
        return {};
      }

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

  const signUpWithOAuth = async (
    provider: Provider
  ): Promise<{ profile?: Profile; error?: AuthError }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.url) {
        window.location.href = data.url;
      }

      return {};
    } catch (error) {
      logger.error('OAuth sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logger.info('SignOut: Starting logout process...');
      
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      
      localStorage.clear();
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        logger.error('Supabase sign out error:', error);
      }
      
    } catch (error) {
      logger.error('Sign out error:', error);
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
    signUpWithOAuth,
    signOut,
    fetchProfile,
    isDemoMode,
    setLastSelectedRole,
    getLastSelectedRole,
    setLastSelectedCompanyId,
    getLastSelectedCompanyId,
    initializeDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
