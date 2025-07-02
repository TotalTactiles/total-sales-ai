
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile } from './types';
import { logger } from '@/utils/logger';
import { useProfileManager } from './useProfileManager';
import { signIn, signUp, signUpWithOAuth, signOut } from './authService';
import { isDemoMode, demoUsers } from '@/data/demo.mock.data';

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
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const { 
    profile, 
    setProfile, 
    fetchProfile,
    clearProfile
  } = useProfileManager();

  // Simplified profile fetching
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile not found, user may be new:', error);
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

    const initializeAuth = async () => {
      try {
        logger.info('🔐 Initializing auth state...', {}, 'auth');
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            logger.info('🔐 Auth state changed:', { 
              event, 
              userId: session?.user?.id,
              hasSession: !!session
            }, 'auth');
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Fetch profile for authenticated user
              const profileData = await fetchUserProfile(session.user.id);
              if (profileData && mounted) {
                setProfile(profileData);
              }
            } else {
              // Clear profile for unauthenticated user
              clearProfile();
            }
            
            // Mark as not loading after auth state is processed
            if (mounted) {
              setLoading(false);
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('❌ Error getting initial session:', error, 'auth');
        } else if (session && mounted) {
          logger.info('🔐 Initial session found:', { 
            userId: session.user.id 
          }, 'auth');
          
          setSession(session);
          setUser(session.user);
          
          // Fetch profile for initial session
          const profileData = await fetchUserProfile(session.user.id);
          if (profileData && mounted) {
            setProfile(profileData);
          }
        }
        
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        logger.error('❌ Error initializing auth:', error, 'auth');
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [setProfile, clearProfile]);

  const handleSignIn = async (email: string, password: string) => {
    logger.info('🔐 AuthProvider: handleSignIn called for:', { email }, 'auth');
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.error) {
        logger.error('🔐 AuthProvider: Sign in failed:', result.error, 'auth');
        setLoading(false);
        return result;
      }

      logger.info('🔐 AuthProvider: Sign in successful', {}, 'auth');
      // Don't set loading to false here - let the auth state change handle it
      return result;
    } catch (error) {
      logger.error('🔐 AuthProvider: Sign in exception:', error, 'auth');
      setLoading(false);
      return { error };
    }
  };

  const handleSignUp = async (email: string, password: string, options?: any) => {
    logger.info('🔐 AuthProvider: handleSignUp called for:', { email }, 'auth');
    setLoading(true);
    
    try {
      const result = await signUp(email, password, options);
      
      if (result.error) {
        logger.error('🔐 AuthProvider: Sign up failed:', result.error, 'auth');
        setLoading(false);
        return result;
      }

      logger.info('🔐 AuthProvider: Sign up successful', {}, 'auth');
      setLoading(false);
      return result;
    } catch (error) {
      logger.error('🔐 AuthProvider: Sign up exception:', error, 'auth');
      setLoading(false);
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      logger.info('🔐 AuthProvider: Starting sign out process', {}, 'auth');
      
      // Immediate state clearing for responsive UI
      setUser(null);
      setSession(null);
      clearProfile();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Supabase signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('❌ Sign out error:', error, 'auth');
      } else {
        logger.info('✅ Sign out successful', {}, 'auth');
      }
      
      return { error: null }; // Always return success for UI responsiveness
      
    } catch (error) {
      logger.error('❌ Sign out exception:', error, 'auth');
      return { error: null }; // Always return success for UI responsiveness
    }
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
