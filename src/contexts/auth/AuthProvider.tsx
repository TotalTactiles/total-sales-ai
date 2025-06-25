
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile } from './types';
import { logger } from '@/utils/logger';
import { useProfileManager } from './useProfileManager';
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
        logger.info('Initializing auth state...', {}, 'auth');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting initial session:', error, 'auth');
        } else if (session) {
          logger.info('Initial session found:', { userId: session.user.id }, 'auth');
          if (mounted) {
            setSession(session);
            setUser(session.user);
            // Defer profile fetching to avoid blocking the loading state
            setTimeout(() => {
              if (mounted) {
                fetchOrCreateProfile(session.user);
              }
            }, 0);
          }
        } else {
          logger.info('No initial session found', {}, 'auth');
        }
        
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        logger.error('Error initializing auth:', error, 'auth');
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.info('Auth state changed:', { 
          event, 
          userId: session?.user?.id,
          hasSession: !!session,
          hasUser: !!session?.user
        }, 'auth');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Defer profile fetching to avoid blocking auth state changes
            setTimeout(() => {
              if (mounted) {
                fetchOrCreateProfile(session.user);
              }
            }, 0);
          } else {
            clearProfile();
          }
          
          // Ensure loading is false after auth state change
          if (initialized) {
            setLoading(false);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile, clearProfile, initialized]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    
    const result = await signIn(email, password);
    
    if (result.error) {
      setLoading(false);
    }
    
    // Always set loading to false after a reasonable delay
    setTimeout(() => setLoading(false), 1000);
    
    return result;
  };

  const handleSignOut = async () => {
    const result = await signOut();
    
    if (!result.error) {
      setUser(null);
      clearProfile();
      setSession(null);
    }
    
    return result;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    session,
    signIn: handleSignIn,
    signUp,
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
