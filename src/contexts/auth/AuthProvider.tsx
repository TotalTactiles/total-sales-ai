
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

  // Simplified profile fetching
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile not found:', error.message);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error, 'auth');
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile if user exists
          if (session?.user) {
            const profileData = await fetchUserProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        logger.error('Auth initialization error:', error, 'auth');
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        logger.info('Auth state changed:', { event, hasSession: !!session }, 'auth');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile for authenticated user
          fetchUserProfile(session.user.id).then(profileData => {
            if (mounted) {
              setProfile(profileData);
            }
          });
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    initAuth();

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
      logger.info('Starting sign out', {}, 'auth');
      
      // Clear state immediately for responsive UI
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Call Supabase signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('Sign out error:', error, 'auth');
      } else {
        logger.info('Sign out successful', {}, 'auth');
      }
      
      return { error: null };
      
    } catch (error) {
      logger.error('Sign out exception:', error, 'auth');
      return { error: null };
    }
  };

  const fetchProfile = async () => {
    if (!user?.id) return null;
    
    const profileData = await fetchUserProfile(user.id);
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
