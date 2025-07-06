
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AuthContextType, Profile, Role } from './types';
import { signIn as authSignIn, signUp as authSignUp, signUpWithOAuth as authSignUpWithOAuth, signOut as authSignOut } from './authService';
import { fetchProfile as profileFetch, createProfile } from './profileService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      let userProfile = await profileFetch(userId);
      
      if (!userProfile && user) {
        userProfile = await createProfile(user);
      }
      
      return userProfile;
    } catch (error) {
      logger.error('Error fetching profile:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    logger.info('Auth state changed:', event);
    
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      const userProfile = await fetchProfile(session.user.id);
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    return { error: result.error };
  };

  const signUp = async (email: string, password: string, options?: any) => {
    const result = await authSignUp(email, password, options);
    return { error: result.error };
  };

  const signUpWithOAuth = async (provider: 'google' | 'github') => {
    const result = await authSignUpWithOAuth(provider);
    return { error: result.error };
  };

  const signOut = async (): Promise<void> => {
    try {
      await authSignOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Error during sign out:', error);
      throw error;
    }
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
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
