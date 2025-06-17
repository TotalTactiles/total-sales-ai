
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';
import { AuthContextType, Profile, Role } from './types';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Route user based on their role
  const routeByRole = (userProfile: Profile) => {
    const roleRoutes = {
      developer: '/developer',
      admin: '/developer',
      manager: '/manager',
      sales_rep: '/sales'
    };
    
    const targetRoute = roleRoutes[userProfile.role] || '/sales';
    
    // Don't redirect if already on correct route or auth page
    if (!location.pathname.startsWith(targetRoute) && !location.pathname.startsWith('/auth')) {
      logger.info(`Routing user with role ${userProfile.role} to ${targetRoute}`);
      navigate(targetRoute, { replace: true });
    }
  };

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      logger.info('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching profile:', error);
        
        // If profile doesn't exist, try to get user data from auth and create basic profile
        if (error.code === 'PGRST116') {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const basicProfile: Profile = {
              id: authUser.id,
              full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
              role: (authUser.user_metadata?.role as Role) || 'sales_rep',
              email: authUser.email || null,
              created_at: authUser.created_at,
              updated_at: new Date().toISOString(),
              company_id: authUser.id
            };
            
            logger.info('Created basic profile from auth user:', basicProfile);
            setProfile(basicProfile);
            return basicProfile;
          }
        }
        return null;
      }

      logger.info('Profile fetched successfully:', data);
      setProfile(data);
      return data;
    } catch (error) {
      logger.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth...');
        
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Session error:', error);
          setLoading(false);
          return;
        }

        if (currentSession?.user && mounted) {
          logger.info('Found existing session for user:', currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch profile
          const userProfile = await fetchProfile(currentSession.user.id);
          if (userProfile && mounted) {
            routeByRole(userProfile);
          }
        } else {
          logger.info('No existing session found');
        }
      } catch (error) {
        logger.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        logger.info('Auth state changed:', event);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          localStorage.clear();
          sessionStorage.clear();
          navigate('/auth', { replace: true });
          return;
        }

        if (newSession?.user) {
          logger.info('New session detected for user:', newSession.user.id);
          setSession(newSession);
          setUser(newSession.user);
          
          // Fetch profile for new session
          const userProfile = await fetchProfile(newSession.user.id);
          if (userProfile && mounted) {
            routeByRole(userProfile);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      logger.info('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Sign in error:', error);
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        logger.info('Sign in successful for user:', data.user.id);
        const userProfile = await fetchProfile(data.user.id);
        if (userProfile) {
          toast.success('Signed in successfully');
          routeByRole(userProfile);
          return { profile: userProfile };
        }
      }

      return { profile: profile };
    } catch (error) {
      logger.error('Sign in error:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      logger.info('Attempting to sign up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        logger.error('Sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Check your email for verification link');
      return {};
    } catch (error) {
      logger.error('Sign up error:', error);
      toast.error('An unexpected error occurred during sign up');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithOAuth = async (provider: Provider) => {
    try {
      setLoading(true);
      logger.info('Attempting OAuth sign up with:', provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        logger.error('OAuth sign up error:', error);
        toast.error(error.message);
        return { error };
      }

      return {};
    } catch (error) {
      logger.error('OAuth sign up error:', error);
      toast.error('An unexpected error occurred during OAuth sign up');
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      logger.info('Starting logout process...');
      
      // Clear state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        logger.error('Supabase sign out error:', error);
      }
      
      // Navigate to auth page
      navigate('/auth', { replace: true });
      toast.success('Logged out successfully');
      
    } catch (error) {
      logger.error('Sign out error:', error);
      // Ensure cleanup even on error
      setUser(null);
      setProfile(null);
      setSession(null);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/auth', { replace: true });
    }
  };

  // Demo mode functions
  const isDemoMode = (): boolean => {
    return localStorage.getItem('demoMode') === 'true';
  };

  const initializeDemoMode = (role: Role): void => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
    setLoading(false);
  };

  // Legacy storage functions
  const setLastSelectedRole = (role: Role) => {
    localStorage.setItem('lastSelectedRole', role);
  };

  const getLastSelectedRole = (): Role => {
    return (localStorage.getItem('lastSelectedRole') as Role) || 'sales_rep';
  };

  const setLastSelectedCompanyId = (companyId: string) => {
    localStorage.setItem('lastSelectedCompanyId', companyId);
  };

  const getLastSelectedCompanyId = (): string | null => {
    return localStorage.getItem('lastSelectedCompanyId');
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
