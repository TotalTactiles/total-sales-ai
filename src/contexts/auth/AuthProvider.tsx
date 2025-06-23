
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, Profile, Role } from './types';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

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
      logger.info('Fetching profile for user:', userId);
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile && !error) {
        logger.info('Profile found successfully:', { 
          profileId: existingProfile.id, 
          role: existingProfile.role,
          fullName: existingProfile.full_name 
        });
        return existingProfile;
      }
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching profile:', error);
      } else {
        logger.info('No existing profile found, will need to create one');
      }
      
      return null;
    } catch (error) {
      logger.error('Exception while fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (user: User): Promise<Profile | null> => {
    try {
      logger.info('Creating profile for user:', { 
        userId: user.id, 
        email: user.email,
        metadata: user.user_metadata 
      });
      
      // Extract role from user metadata or default to sales_rep
      const userRole = user.user_metadata?.role as Role || 'sales_rep';
      const fullName = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split('@')[0] || 
                      'User';
      
      const profileData = {
        id: user.id,
        full_name: fullName,
        role: userRole,
        company_id: user.id, // Use user ID as company ID for simplicity
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      logger.info('Attempting to create profile with data:', profileData);

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating profile:', error);
        throw error;
      }
      
      if (!newProfile) {
        logger.error('Profile creation returned null data');
        throw new Error('Profile creation failed - no data returned');
      }
      
      logger.info('Profile created successfully:', {
        profileId: newProfile.id,
        role: newProfile.role,
        fullName: newProfile.full_name
      });
      return newProfile;
    } catch (error) {
      logger.error('Exception while creating profile:', error);
      return null;
    }
  };

  const fetchOrCreateProfile = async (user: User) => {
    try {
      logger.info('Starting fetchOrCreateProfile for user:', user.id);
      let userProfile = await fetchProfile(user.id);
      
      if (!userProfile) {
        logger.info('Profile not found, creating new profile for user:', user.id);
        userProfile = await createProfile(user);
        
        if (!userProfile) {
          logger.error('Failed to create profile, retrying once...');
          // Retry once
          await new Promise(resolve => setTimeout(resolve, 1000));
          userProfile = await createProfile(user);
        }
      }

      if (userProfile) {
        logger.info('Setting profile in state:', { 
          userId: user.id, 
          profileRole: userProfile.role,
          profileId: userProfile.id
        });
        setProfile(userProfile);
        
        // Update last login
        try {
          await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);
          logger.info('Updated last login timestamp');
        } catch (updateError) {
          logger.warn('Failed to update last login (non-critical):', updateError);
        }
      } else {
        logger.error('Critical error: Failed to create or fetch profile after retry');
        // Set a minimal fallback profile to prevent infinite loading
        const fallbackProfile: Profile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          role: 'sales_rep',
          company_id: user.id,
          email_connected: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        };
        logger.warn('Using fallback profile to prevent app freeze:', fallbackProfile);
        setProfile(fallbackProfile);
      }
    } catch (error) {
      logger.error('Critical error in fetchOrCreateProfile:', error);
      // Set fallback profile to prevent infinite loading
      const fallbackProfile: Profile = {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'User',
        role: 'sales_rep',
        company_id: user.id,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      logger.warn('Using fallback profile due to error:', fallbackProfile);
      setProfile(fallbackProfile);
    }
  };

  // Auth state management
  useEffect(() => {
    logger.info('Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed:', { 
          event, 
          userId: session?.user?.id,
          hasSession: !!session,
          hasUser: !!session?.user
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use a small delay to prevent race conditions
          setTimeout(() => {
            fetchOrCreateProfile(session.user);
          }, 100);
        } else {
          setProfile(null);
        }
        
        // Always set loading to false after handling auth state
        setTimeout(() => setLoading(false), 200);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth - checking for existing session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          logger.info('Existing session found, processing user');
          setSession(session);
          setUser(session.user);
          await fetchOrCreateProfile(session.user);
        } else {
          logger.info('No existing session found');
        }
        
        setLoading(false);
      } catch (error) {
        logger.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      logger.info('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in:', { email: email.trim() });
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        logger.error('Sign in failed:', { 
          error: error.message, 
          code: error.status,
          email: email.trim()
        });
        setLoading(false);
        return { error };
      }

      if (data.user && data.session) {
        logger.info('Sign in successful:', { 
          userId: data.user.id,
          email: data.user.email
        });
        // Don't set loading to false here - let the auth state change handler do it
        return { error: null };
      }

      logger.error('Sign in returned no user/session data');
      setLoading(false);
      return { error: new Error('Authentication failed - no user data returned') as AuthError };
    } catch (error) {
      logger.error('Sign in exception:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      logger.info('Attempting sign up:', { email, userData });
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
        logger.error('Sign up error:', error);
        return { error };
      }
      
      logger.info('Sign up successful:', { userId: data.user?.id });
      return { error: null };
    } catch (error) {
      logger.error('Sign up exception:', error);
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
      logger.info('Attempting sign out');
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setProfile(null);
        setSession(null);
        logger.info('Sign out successful');
      }
      
      return { error };
    } catch (error) {
      logger.error('Sign out error:', error);
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
