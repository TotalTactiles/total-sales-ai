
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

  // Initialize auth state with proper session handling
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔁 Initializing auth state...');
        
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔄 Auth state changed:', event, 'Session:', !!session);
            
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              
              if (session?.user) {
                const profileData = await fetchUserProfile(session.user.id);
                if (mounted) {
                  setProfile(profileData);
                }
              } else {
                setProfile(null);
              }
              
              setLoading(false);
              
              // Handle successful sign in - redirect to appropriate dashboard
              if (event === 'SIGNED_IN' && session?.user) {
                console.log('✅ User signed in, redirecting to dashboard...');
                // Redirect to sales dashboard instead of safe-dashboard
                window.location.href = '/sales/dashboard';
              }
            }
          }
        );

        // Then get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session fetch error:', error);
        }

        console.log('📍 Current session check:', {
          hasSession: !!currentSession,
          hasUser: !!currentSession?.user,
          userId: currentSession?.user?.id
        });

        if (mounted && currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (currentSession.user) {
            const profileData = await fetchUserProfile(currentSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
        }
        
        if (mounted) {
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }

        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth loading timeout - forcing completion');
        setLoading(false);
      }
    }, 5000); // Increased timeout to 5 seconds

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
      
      // Redirect to auth page instead of safe-dashboard
      window.location.href = '/auth';
      
      return { error: null };
      
    } catch (error) {
      logger.error('❌ Sign out exception:', error, 'auth');
      
      // Ensure state is cleared even on exception
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Still redirect to auth page
      window.location.href = '/auth';
      
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
