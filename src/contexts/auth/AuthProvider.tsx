
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
        logger.info('🔐 Initializing auth state...', {}, 'auth');
        
        // Set up auth state change listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            logger.info('🔐 Auth state changed:', { 
              event, 
              userId: session?.user?.id,
              hasSession: !!session,
              hasUser: !!session?.user
            }, 'auth');
            
            if (mounted) {
              setSession(session);
              setUser(session?.user ?? null);
              
              if (session?.user) {
                console.log('🔐 Auth state change: User found, fetching profile');
                // Don't block auth state update with profile fetching
                setTimeout(() => {
                  if (mounted) {
                    fetchOrCreateProfile(session.user);
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
          logger.info('🔐 Initial session found:', { userId: session.user.id }, 'auth');
          if (mounted) {
            setSession(session);
            setUser(session.user);
            // Defer profile fetching to avoid blocking loading state
            setTimeout(() => {
              if (mounted) {
                fetchOrCreateProfile(session.user);
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
  }, [fetchOrCreateProfile, clearProfile, initialized]);

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
