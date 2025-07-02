
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile } from './types';
import { logger } from '@/utils/logger';
import { signIn, signUp, signUpWithOAuth, signOut } from './authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.warn('Profile not found:', error.message, 'auth');
        return null;
      }

      return data as Profile;
    } catch (error) {
      logger.error('Error fetching profile:', error, 'auth');
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log('🔁 Fetching Supabase session...');
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Supabase session error:', error);
        }
        setSession(session ?? null);
        setUser(session?.user ?? null);
        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error('❌ Exception fetching session:', e);
      } finally {
        console.log('✅ Auth loading finished');
        setLoading(false);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fallback: prevent infinite loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('❌ Auth loading exceeded 5s — forcing fallback.');
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleSignIn = async (email: string, password: string) => {
    logger.info('Sign in attempt:', { email }, 'auth');
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        logger.error('Sign in failed:', result.error, 'auth');
        return result;
      }

      logger.info('Sign in successful', {}, 'auth');
      return result;
    } catch (error) {
      logger.error('Sign in exception:', error, 'auth');
      return { error };
    }
  };

  const handleSignUp = async (email: string, password: string, options?: any) => {
    logger.info('Sign up attempt:', { email }, 'auth');
    
    try {
      const result = await signUp(email, password, options);
      
      if (result.error) {
        logger.error('Sign up failed:', result.error, 'auth');
        return result;
      }

      logger.info('Sign up successful', {}, 'auth');
      return result;
    } catch (error) {
      logger.error('Sign up exception:', error, 'auth');
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      logger.info('🚪 Starting sign out', {}, 'auth');
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Call Supabase signout
      const { error } = await supabase.auth.signOut();
      
      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      if (error) {
        logger.error('❌ Sign out error:', error, 'auth');
      } else {
        logger.info('✅ Sign out successful', {}, 'auth');
      }
      
      return { error: null };
      
    } catch (error) {
      logger.error('❌ Sign out exception:', error, 'auth');
      
      // Ensure state is cleared even on exception
      setUser(null);
      setSession(null);
      setProfile(null);
      
      return { error: null };
    }
  };

  const fetchProfile = async (userId: string) => {
    if (!userId) return null;
    
    const profileData = await fetchUserProfile(userId);
    setProfile(profileData);
    return profileData;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    session,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signUpWithOAuth,
    signOut: handleSignOut,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
