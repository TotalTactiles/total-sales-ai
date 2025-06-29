
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile } from './types';
import { logger } from '@/utils/logger';
import { useProfileManager } from './useProfileManager';
import { signIn, signUp, signUpWithOAuth, signOut } from './authService';
import { fetchUserProfileOptimized } from '@/utils/authOptimizer';
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
    fetchOrCreateProfile, 
    clearProfile, 
    fetchProfile 
  } = useProfileManager();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        logger.info('🔐 Initializing auth state...', {}, 'auth');
        
        // Set up auth state change listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            logger.info('🔐 Auth state changed:', { 
              event, 
              userId: session?.user?.id,
              hasSession: !!session,
              hasUser: !!session?.user,
              userEmail: session?.user?.email
            }, 'auth');
            
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              
              if (session?.user) {
                console.log('🔐 Auth state change: User found, fetching profile optimized');
                // Use optimized profile fetching
                setTimeout(async () => {
                  if (mounted) {
                    const optimizedProfile = await fetchUserProfileOptimized(session.user.id);
                    if (optimizedProfile) {
                      setProfile(optimizedProfile);
                    }
                  }
                }, 0);
              } else {
                console.log('🔐 Auth state change: No user, clearing profile');
                clearProfile();
              }
              
              // Ensure loading is false after auth state change
              if (initialized) {
                setLoading(false);
              }
            }
          }
        );

        // THEN get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('❌ Error getting initial session:', error, 'auth');
        } else if (session) {
          logger.info('🔐 Initial session found:', { 
            userId: session.user.id, 
            userEmail: session.user.email 
          }, 'auth');
          if (mounted) {
            setSession(session);
            setUser(session.user);
            // Use optimized profile fetching for initial load
            setTimeout(async () => {
              if (mounted) {
                const optimizedProfile = await fetchUserProfileOptimized(session.user.id);
                if (optimizedProfile) {
                  setProfile(optimizedProfile);
                }
              }
            }, 0);
          }
        } else {
          logger.info('🔐 No initial session found', {}, 'auth');
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
  }, [setProfile, clearProfile, initialized]);

  const handleSignIn = async (email: string, password: string) => {
    console.log('🔐 AuthProvider: handleSignIn called for:', email);
    setLoading(true);
    
    const result = await signIn(email, password);
    
    if (result.error) {
      console.error('🔐 AuthProvider: Sign in failed:', result.error);
      setLoading(false);
    } else {
      console.log('🔐 AuthProvider: Sign in successful, auth state will update via onAuthStateChange');
      // Don't set loading to false here - let onAuthStateChange handle it
    }
    
    return result;
  };

  const handleSignUp = async (email: string, password: string, options?: any) => {
    console.log('🔐 AuthProvider: handleSignUp called for:', email);
    setLoading(true);
    
    const result = await signUp(email, password, options);
    
    if (result.error) {
      console.error('🔐 AuthProvider: Sign up failed:', result.error);
      setLoading(false);
    } else {
      console.log('🔐 AuthProvider: Sign up successful');
      // For signup, we might not get immediate session due to email confirmation
      setLoading(false);
    }
    
    return result;
  };

  const handleSignOut = async () => {
    try {
      // Optimized logout - immediate state clearing
      setUser(null);
      setSession(null);
      clearProfile();
      
      // Supabase signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('❌ Sign out error:', error, 'auth');
        // Even if signout fails, force local state clearing
        return { error: null };
      }
      
      logger.info('✅ Sign out successful', {}, 'auth');
      return { error: null };
      
    } catch (error) {
      logger.error('❌ Sign out exception:', error, 'auth');
      // Force local state clearing even on exception
      setUser(null);
      setSession(null);
      clearProfile();
      return { error: null };
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
