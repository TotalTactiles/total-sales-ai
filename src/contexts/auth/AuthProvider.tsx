
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

    const initializeAuth = async () => {
      try {
        logger.info('🚀 Initializing auth state', {}, 'auth');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('❌ Error getting session:', error, 'auth');
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile if user exists
          if (session?.user) {
            logger.info('👤 Found user session, fetching profile', { userId: session.user.id }, 'auth');
            const profileData = await fetchUserProfile(session.user.id);
            if (mounted) {
              setProfile(profileData);
              logger.info('✅ Profile fetched successfully', { 
                userId: session.user.id, 
                role: profileData?.role 
              }, 'auth');
            }
          } else {
            logger.info('👋 No user session found', {}, 'auth');
            setProfile(null);
          }
          
          setLoading(false);
          logger.info('✅ Auth initialization complete', { 
            hasUser: !!session?.user, 
            hasProfile: !!session?.user 
          }, 'auth');
        }
      } catch (error) {
        logger.error('❌ Auth initialization error:', error, 'auth');
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener (non-async to prevent deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        logger.info('🔄 Auth state changed:', { event, hasSession: !!session }, 'auth');
        
        // Update session and user immediately
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle profile fetch asynchronously but separately
        if (session?.user) {
          setTimeout(async () => {
            if (!mounted) return;
            try {
              logger.info('👤 Fetching profile after auth change', { userId: session.user.id }, 'auth');
              const profileData = await fetchUserProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
                logger.info('✅ Profile updated after auth change', { 
                  userId: session.user.id, 
                  role: profileData?.role 
                }, 'auth');
              }
            } catch (error) {
              logger.error('❌ Error fetching profile after auth change:', error, 'auth');
              if (mounted) {
                setProfile(null);
              }
            }
          }, 0);
        } else {
          setProfile(null);
          logger.info('🚪 User signed out, cleared profile', {}, 'auth');
        }
      }
    );

    initializeAuth();

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
      
      // Call Supabase signout first
      const { error } = await supabase.auth.signOut();
      
      // Clear state regardless of error
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      if (error) {
        logger.error('Sign out error:', error, 'auth');
      } else {
        logger.info('Sign out successful', {}, 'auth');
      }
      
      return { error: null };
      
    } catch (error) {
      logger.error('Sign out exception:', error, 'auth');
      
      // Clear state even on exception
      setUser(null);
      setSession(null);
      setProfile(null);
      
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
