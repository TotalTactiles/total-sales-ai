
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AuthContextType, Profile, Role } from './types';
import { initializeDemoUser, isDemoMode, setDemoMode, clearDemoMode } from './demoMode';
import { getLastSelectedRole, setLastSelectedRole, getLastSelectedCompanyId, setLastSelectedCompanyId } from './localStorage';

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile management functions
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile && !error) {
        return existingProfile;
      }
      return null;
    } catch (error) {
      logger.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (user: User): Promise<Profile | null> => {
    try {
      const profileData = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: (user.user_metadata?.role as Role) || 'sales_rep',
        company_id: user.id,
        email_connected: false,
        email: user.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return newProfile;
    } catch (error) {
      logger.error('Error creating profile:', error);
      return null;
    }
  };

  const fetchOrCreateProfile = async (user: User) => {
    try {
      let userProfile = await fetchProfile(user.id);
      
      if (!userProfile) {
        userProfile = await createProfile(user);
      }

      if (userProfile) {
        setProfile(userProfile);
        logger.info('Profile loaded:', { userId: user.id, role: userProfile.role });
      } else {
        // Fallback profile to prevent auth loops
        const fallbackProfile: Profile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          role: 'sales_rep',
          company_id: user.id,
          email_connected: false,
          email: user.email || '',
          ai_assistant_name: 'SalesOS AI',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(fallbackProfile);
      }
    } catch (error) {
      logger.error('Error in fetchOrCreateProfile:', error);
    }
  };

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed', { event, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchOrCreateProfile(session.user);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        fetchOrCreateProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Sign in error:', error);
        return { error };
      }

      if (data.user) {
        logger.info('Sign in successful:', { userId: data.user.id });
        return { error: null };
      }

      return { error: new Error('Unknown error occurred') as AuthError };
    } catch (error) {
      logger.error('Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl
        }
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signUpWithOAuth = async (provider: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setProfile(null);
        setSession(null);
        clearDemoMode();
        logger.info('Sign out successful');
      }
      
      return { error };
    } catch (error) {
      logger.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  };

  // Demo mode functions
  const initializeDemoMode = (role: Role) => {
    const { demoUser, demoProfile } = initializeDemoUser(role);
    setDemoMode(role);
    setUser(demoUser);
    setProfile(demoProfile);
    setLoading(false);
  };

  const setDemoRole = (role: Role) => {
    const { demoUser, demoProfile } = initializeDemoUser(role);
    setDemoMode(role);
    setUser(demoUser);
    setProfile(demoProfile);
  };

  const getDemoRole = (): Role | null => {
    return localStorage.getItem('demoRole') as Role | null;
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    session,
    signIn,
    signUp,
    signUpWithOAuth,
    signOut,
    isDemoMode,
    setDemoRole,
    getDemoRole,
    initializeDemoMode,
    setLastSelectedRole,
    setLastSelectedCompanyId,
    fetchProfile,
    getLastSelectedRole,
    getLastSelectedCompanyId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
