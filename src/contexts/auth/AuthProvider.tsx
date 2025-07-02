
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
    let mounted = true;

    const fetchSession = async () => {
      try {
        logger.info('🚀 Fetching initial session', {}, 'auth');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('❌ Session fetch error:', error, 'auth');
        }
        
        if (mounted) {
          const session = data?.session ?? null;
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile if user exists
          if (session?.user) {
            logger.info('👤 Fetching profile for user', { userId: session.user.id }, 'auth');
            const profileData = await fetchUserProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
              logger.info('✅ Profile loaded:', { role: profileData?.role }, 'auth');
            }
          } else {
            setProfile(null);
          }
          
          setLoading(false);
          logger.info('✅ Auth initialization complete', { hasSession: !!session }, 'auth');
        }
      } catch (error) {
        logger.error('❌ Auth initialization error:', error, 'auth');
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        logger.info('🔄 Auth state changed:', { event, hasSession: !!session }, 'auth');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile for new session
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const profileData = await fetchUserProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
                logger.info('✅ Profile updated:', { role: profileData?.role }, 'auth');
              }
            } catch (error) {
              logger.error('❌ Error fetching profile:', error, 'auth');
              if (mounted) setProfile(null);
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
