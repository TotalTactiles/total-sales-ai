import { logger } from '@/utils/logger';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { initializeDemoUser } from './demoMode';
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { AuthContextType, Profile, Role } from './types';
import { toast } from 'sonner';
import { setLastSelectedRole, getLastSelectedRole, setLastSelectedCompanyId, getLastSelectedCompanyId } from './localStorage';
import { useNavigate } from 'react-router-dom';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          logger.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        logger.info('Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        logger.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          // Immediately clear all state on sign out
          logger.info('Clearing all auth state');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          
          // Clear all storage including demo mode
          localStorage.clear();
          sessionStorage.clear();
          
          return;
        }
        
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching profile:', error);
        return null;
      }

      logger.info('Fetched profile:', data);
      setProfile(data);
      
      // Update local storage with the actual role from database
      if (data?.role) {
        setLastSelectedRole(data.role);
        logger.info('Updated lastSelectedRole to:', data.role);
      }
      
      return data;
    } catch (error) {
      logger.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ profile?: Profile; error?: AuthError }> => {
    try {
      setLoading(true);

      // Clear any existing demo mode or cached roles before signing in
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');

      // If Supabase isn't configured, fall back to local demo mode
      if (!isSupabaseConfigured) {
        const role: Role = email.includes('manager') ? 'manager' : 'sales_rep';
        const { demoUser, demoProfile } = initializeDemoUser(role);
        localStorage.setItem('demoMode', 'true');
        localStorage.setItem('demoRole', role);
        setLastSelectedRole(role);
        setUser(demoUser);
        setProfile(demoProfile);
        setSession(null);
        toast.success('Signed in using local demo mode');
        return { profile: demoProfile };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      const session = data.session;
      const user = data.user;

      setSession(session);
      setUser(user);

      let fetchedProfile: Profile | null = null;
      if (user) {
        fetchedProfile = await fetchProfile(user.id);
        if (fetchedProfile) {
          setLastSelectedRole(fetchedProfile.role);
          logger.info('Sign in successful, role set to:', fetchedProfile.role);
        }
      }

      toast.success('Signed in successfully');
      return { profile: fetchedProfile || undefined };
    } catch (error) {
      logger.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: any
  ): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      // If Supabase isn't configured, fall back to local demo mode
      if (!isSupabaseConfigured) {
        const role: Role = metadata?.role ?? (email.includes('manager') ? 'manager' : 'sales_rep');
        const { demoUser, demoProfile } = initializeDemoUser(role);
        localStorage.setItem('demoMode', 'true');
        localStorage.setItem('demoRole', role);
        setLastSelectedRole(role);
        setUser(demoUser);
        setProfile(demoProfile);
        setSession(null);
        toast.success('Demo account created successfully');
        return {};
      }

      if (error) {
        toast.error(error.message);
        return { error };
      }

      const userId = data.user?.id;

      if (metadata?.role === 'manager' && userId) {
        // Fetch the newly created profile to get company_id (set by DB trigger)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', userId)
          .single();

        const companyId = profileData?.company_id || userId;

        if (!profileError) {
          const defaultSettings = {
            company_id: companyId,
            industry: '',
            sales_model: [],
            team_roles: [],
            tone: {
              humor: 50,
              formality: 50,
              pushiness: 30,
              detail: 60,
            },
            pain_points: [],
            agent_name: 'SalesOS',
            enabled_modules: {
              dialer: true,
              brain: true,
              leads: true,
              analytics: true,
              missions: false,
              tools: false,
              aiAgent: true,
            },
            original_goal: '',
            personalization_flags: {
              dashboardCustomized: false,
              welcomeMessageSent: false,
              guidedTourShown: false,
            },
          };

          const { error: companyError } = await supabase
            .from('company_settings')
            .insert(defaultSettings);

          if (companyError) {
            logger.error('Error creating company settings:', companyError);
            toast.error('Company setup failed: ' + companyError.message);
          }
        } else {
          logger.error('Error fetching profile after sign up:', profileError);
          toast.error('Company setup failed: ' + profileError.message);
        }
      }

      const session = data.session;
      const newUser = data.user;

      if (session && newUser) {
        setSession(session);
        setUser(newUser);
        const fetchedProfile = await fetchProfile(newUser.id);
        if (fetchedProfile) {
          setLastSelectedRole(fetchedProfile.role);

          const needsOnboarding =
            fetchedProfile.company_id &&
            !localStorage.getItem(`onboarding_complete_${fetchedProfile.company_id}`);

          if (needsOnboarding) {
            navigate('/onboarding');
          } else {
            navigate(getDashboardUrl(fetchedProfile));
          }
        }
      }

      toast.success('Check your email for verification link');
      return {};
    } catch (error) {
      logger.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithOAuth = async (
    provider: Provider
  ): Promise<{ profile?: Profile; error?: AuthError }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.url) {
        window.location.href = data.url;
      }

      return {};
    } catch (error) {
      logger.error('OAuth sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logger.info('SignOut: Starting logout process...');
      
      // Clear state immediately to prevent any redirects during logout
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      
      // Clear all storage immediately including demo mode
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase (this will trigger the SIGNED_OUT event)
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        logger.error('Supabase sign out error:', error);
      }
      
      logger.info('SignOut: Logout completed');
      
    } catch (error) {
      logger.error('Sign out error:', error);
      // Clear state even on error
      setUser(null);
      setProfile(null);
      setSession(null);
      setLoading(false);
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const isDemoMode = (): boolean => {
    return localStorage.getItem('demoMode') === 'true';
  };

  const initializeDemoMode = (role: Role): void => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
    setLastSelectedRole(role);
    setLoading(false);
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
    fetchProfile,
    isDemoMode,
    setLastSelectedRole,
    getLastSelectedRole,
    setLastSelectedCompanyId,
    getLastSelectedCompanyId,
    initializeDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
