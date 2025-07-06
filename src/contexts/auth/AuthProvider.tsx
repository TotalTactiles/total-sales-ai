
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AuthContextType, Profile, Role } from './types';
import { signIn as authSignIn, signUp as authSignUp, signUpWithOAuth as authSignUpWithOAuth, signOut as authSignOut } from './authService';
import { fetchProfile as profileFetch, createProfile } from './profileService';
import { isDemoMode, demoUsers, logDemoLogin } from '@/data/demo.mock.data';

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
    logger.info('🔐 Auth state changed:', { event, hasSession: !!session });
    
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      // Check if this is a demo user
      const demoUser = demoUsers.find(du => du.email === session.user.email);
      
      if (demoUser) {
        // Create demo profile
        const demoProfile: Profile = {
          id: session.user.id,
          full_name: demoUser.name,
          role: demoUser.role as Role,
          company_id: session.user.id,
          email: session.user.email,
          phone_number: null,
          email_connected: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          onboarding_step: null,
          has_completed_onboarding: true,
          assistant_name: 'AI Assistant',
          voice_style: 'professional',
          industry: null,
          onboarding_complete: true,
          sales_personality: null,
          sales_style: null,
          strength_area: null,
          rep_motivation: null,
          primary_goal: null,
          motivation_trigger: null,
          weakness: null,
          mental_state_trigger: null,
          management_style: null,
          team_size: null,
          preferred_team_personality: null,
          team_obstacle: null,
          business_goal: null,
          influence_style: null
        };
        
        setProfile(demoProfile);
        logDemoLogin(session.user.email!, true);
      } else {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('🔐 Attempting sign in for:', email);
      
      // Check if this is a demo user
      const demoUser = demoUsers.find(du => du.email === email && du.password === password);
      
      if (isDemoMode && demoUser) {
        // For demo users, use the actual auth system but log the attempt
        logDemoLogin(email, true);
      }
      
      const result = await authSignIn(email, password);
      
      if (result.error) {
        logger.error('❌ Sign in failed:', result.error);
        logDemoLogin(email, false);
      } else {
        logger.info('✅ Sign in successful');
      }
      
      return { error: result.error };
    } catch (error) {
      logger.error('❌ Sign in exception:', error);
      return { error };
    }
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
      logger.info('🔐 Starting sign out process');
      
      await authSignOut();
      
      // Clear all state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      logger.info('✅ Sign out completed successfully');
    } catch (error) {
      logger.error('❌ Error during sign out:', error);
      // Still clear local state even if server signout fails
      setUser(null);
      setProfile(null);
      setSession(null);
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
