
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile, Role } from './types';
import { logger } from '@/utils/logger';

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
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      logger.info('Fetching profile for user:', userId, 'auth');
      
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching profile:', error, 'auth');
        return null;
      }

      if (existingProfile) {
        logger.info('Profile found successfully:', { 
          profileId: existingProfile.id, 
          role: existingProfile.role,
          fullName: existingProfile.full_name 
        }, 'auth');
        return existingProfile;
      }
      
      logger.info('No existing profile found, will need to create one', {}, 'auth');
      return null;
    } catch (error) {
      logger.error('Exception while fetching profile:', error, 'auth');
      return null;
    }
  };

  const createProfile = async (user: User): Promise<Profile | null> => {
    try {
      logger.info('Creating profile for user:', { 
        userId: user.id, 
        email: user.email,
        metadata: user.user_metadata 
      }, 'auth');
      
      const userRole = user.user_metadata?.role as Role || 'sales_rep';
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'User';
      
      const profileData: Partial<Profile> = {
        id: user.id,
        full_name: fullName,
        role: userRole,
        company_id: user.id,
        email: user.email,
        phone_number: null,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        onboarding_step: null,
        has_completed_onboarding: false,
        user_metadata: user.user_metadata || {},
        assistant_name: 'AI Assistant',
        voice_style: 'professional',
        industry: null,
        onboarding_complete: false,
        launched_at: null,
        sales_personality: null,
        sales_style: null,
        strength_area: null,
        rep_motivation: null,
        primary_goal: null,
        motivation_trigger: null,
        weakness: null,
        mental_state_trigger: null,
        wishlist: null,
        management_style: null,
        team_size: null,
        preferred_team_personality: null,
        team_obstacle: null,
        business_goal: null,
        influence_style: null,
        ai_assistant: null
      };

      logger.info('Attempting to create profile with data:', profileData, 'auth');

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .maybeSingle();

      if (error) {
        logger.error('Error creating profile:', error, 'auth');
        throw error;
      }
      
      if (!newProfile) {
        logger.error('Profile creation returned null data', {}, 'auth');
        return profileData as Profile;
      }
      
      logger.info('Profile created successfully:', {
        profileId: newProfile.id,
        role: newProfile.role,
        fullName: newProfile.full_name
      }, 'auth');
      return newProfile;
    } catch (error) {
      logger.error('Exception while creating profile:', error, 'auth');
      const fallbackProfile: Profile = {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'User',
        role: 'sales_rep',
        company_id: user.id,
        email: user.email,
        phone_number: null,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        onboarding_step: null,
        has_completed_onboarding: false,
        user_metadata: user.user_metadata || {},
        assistant_name: 'AI Assistant',
        voice_style: 'professional',
        industry: null,
        onboarding_complete: false,
        launched_at: null,
        sales_personality: null,
        sales_style: null,
        strength_area: null,
        rep_motivation: null,
        primary_goal: null,
        motivation_trigger: null,
        weakness: null,
        mental_state_trigger: null,
        wishlist: null,
        management_style: null,
        team_size: null,
        preferred_team_personality: null,
        team_obstacle: null,
        business_goal: null,
        influence_style: null,
        ai_assistant: null
      };
      return fallbackProfile;
    }
  };

  const fetchOrCreateProfile = async (user: User) => {
    try {
      logger.info('Starting fetchOrCreateProfile for user:', user.id, 'auth');
      let userProfile = await fetchProfile(user.id);
      
      if (!userProfile) {
        logger.info('Profile not found, creating new profile for user:', user.id, 'auth');
        userProfile = await createProfile(user);
      }

      if (userProfile) {
        logger.info('Setting profile in state:', { 
          userId: user.id, 
          profileRole: userProfile.role,
          profileId: userProfile.id
        }, 'auth');
        setProfile(userProfile);
        
        // Update last login timestamp (non-critical operation)
        try {
          await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);
          logger.info('Updated last login timestamp', {}, 'auth');
        } catch (updateError) {
          logger.warn('Failed to update last login (non-critical):', updateError, 'auth');
        }
      }
    } catch (error) {
      logger.error('Critical error in fetchOrCreateProfile:', error, 'auth');
      // Set a fallback profile to prevent blocking access
      const fallbackProfile: Profile = {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'User',
        role: 'sales_rep',
        company_id: user.id,
        email: user.email,
        phone_number: null,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        onboarding_step: null,
        has_completed_onboarding: false,
        user_metadata: {},
        assistant_name: 'AI Assistant',
        voice_style: 'professional',
        industry: null,
        onboarding_complete: false,
        launched_at: null,
        sales_personality: null,
        sales_style: null,
        strength_area: null,
        rep_motivation: null,
        primary_goal: null,
        motivation_trigger: null,
        weakness: null,
        mental_state_trigger: null,
        wishlist: null,
        management_style: null,
        team_size: null,
        preferred_team_personality: null,
        team_obstacle: null,
        business_goal: null,
        influence_style: null,
        ai_assistant: null
      };
      logger.warn('Using fallback profile due to error:', fallbackProfile, 'auth');
      setProfile(fallbackProfile);
    }
  };

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
            setProfile(null);
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
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in:', { email: email.trim() }, 'auth');
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      logger.info('LOGIN RESULT:', { 
        hasData: !!data, 
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: error?.message,
        errorCode: error?.status 
      }, 'auth');

      if (error) {
        logger.error('Sign in failed:', { 
          error: error.message, 
          code: error.status,
          email: email.trim(),
          fullError: error
        }, 'auth');
        
        setLoading(false);
        return { error };
      }

      if (data.user && data.session) {
        logger.info('Sign in successful:', { 
          userId: data.user.id,
          email: data.user.email,
          hasSession: !!data.session
        }, 'auth');
        
        // The auth state change listener will handle profile fetching
        return { error: null };
      }

      logger.error('Sign in returned no user/session data', {}, 'auth');
      setLoading(false);
      return { error: new Error('Authentication failed - no user data returned') as AuthError };
    } catch (error) {
      logger.error('Sign in exception:', error, 'auth');
      setLoading(false);
      return { error: error as AuthError };
    } finally {
      // Always set loading to false after a reasonable delay
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      logger.info('Attempting sign up:', { email, userData }, 'auth');
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        logger.error('Sign up error:', error, 'auth');
        return { error };
      }
      
      logger.info('Sign up successful:', { userId: data.user?.id }, 'auth');
      return { error: null };
    } catch (error) {
      logger.error('Sign up exception:', error, 'auth');
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
      logger.info('Attempting sign out', {}, 'auth');
      const { error } = await supabase.auth.signOut();

      if (!error) {
        setUser(null);
        setProfile(null);
        setSession(null);
        // Clear client storage to ensure clean state on logout
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.clear();
            window.sessionStorage.clear();
          } catch (storageError) {
            logger.error('Error clearing storage:', storageError, 'auth');
          }
        }
        logger.info('Sign out successful', {}, 'auth');
      }
      
      return { error };
    } catch (error) {
      logger.error('Sign out error:', error, 'auth');
      return { error: error as AuthError };
    }
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
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
