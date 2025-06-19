import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Profile, Role } from './types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; profile?: Profile }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  signUpWithOAuth: (provider: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isDemoMode: () => boolean;
  setDemoRole: (role: Role) => void;
  getDemoRole: () => Role | null;
  initializeDemoMode: (role: Role) => void;
  setLastSelectedRole: (role: Role) => void;
  setLastSelectedCompanyId: (companyId: string) => void;
}

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

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed', { event, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch or create profile
          setTimeout(async () => {
            try {
              await fetchOrCreateProfile(session.user);
            } catch (error) {
              logger.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
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

  const fetchOrCreateProfile = async (user: User) => {
    try {
      // First, try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile && !fetchError) {
        setProfile(existingProfile);
        logger.info('Profile loaded:', { userId: user.id, role: existingProfile.role });
        return;
      }

      // If no profile exists, create one
      logger.info('Creating new profile for user:', user.id);
      
      const profileData = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: (user.user_metadata?.role as Role) || 'sales_rep',
        company_id: user.id,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (createError) {
        logger.error('Failed to create profile:', createError);
        throw createError;
      }

      setProfile(newProfile);
      logger.info('Profile created successfully:', { userId: user.id, role: newProfile.role });

    } catch (error) {
      logger.error('Error in fetchOrCreateProfile:', error);
      // Set a minimal profile to prevent auth loops
      setProfile({
        id: user.id,
        full_name: user.email?.split('@')[0] || 'User',
        role: 'sales_rep',
        company_id: user.id,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

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
        // Profile will be fetched automatically by the auth state change listener
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signUpWithOAuth = async (provider: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any
      });

      if (error) {
        return { error };
      }

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
        localStorage.removeItem('demoRole');
        logger.info('Sign out successful');
      }
      
      return { error };
    } catch (error) {
      logger.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  };

  const isDemoMode = () => {
    return !!localStorage.getItem('demoRole');
  };

  const setDemoRole = (role: Role) => {
    localStorage.setItem('demoRole', role);
    setProfile({
      id: 'demo-user',
      full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role,
      company_id: 'demo-company',
      email_connected: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setUser({
      id: 'demo-user',
      email: `demo-${role}@example.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: { role },
      aud: 'authenticated'
    } as User);
  };

  const getDemoRole = (): Role | null => {
    const role = localStorage.getItem('demoRole');
    return role as Role | null;
  };

  const initializeDemoMode = (role: Role) => {
    setDemoRole(role);
    setLoading(false);
  };

  const setLastSelectedRole = (role: Role) => {
    localStorage.setItem('lastSelectedRole', role);
  };

  const setLastSelectedCompanyId = (companyId: string) => {
    localStorage.setItem('lastSelectedCompanyId', companyId);
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
    setLastSelectedCompanyId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
