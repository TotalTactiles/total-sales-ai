
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AuthContextType, Profile, Role } from './types';

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
        logger.info('Profile found:', existingProfile);
        return existingProfile;
      }
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching profile:', error);
      }
      
      return null;
    } catch (error) {
      logger.error('Error fetching profile:', error);
      return null;
    }
  };

  const createProfile = async (user: User): Promise<Profile | null> => {
    try {
      logger.info('Creating profile for user:', user.id);
      
      // Extract role from user metadata or default to sales_rep
      const userRole = user.user_metadata?.role as Role || 'sales_rep';
      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      
      const profileData = {
        id: user.id,
        full_name: fullName,
        role: userRole,
        company_id: user.id,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        logger.error('Error creating profile:', error);
        throw error;
      }
      
      logger.info('Profile created successfully:', newProfile);
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
        logger.info('Profile not found, creating new profile for user:', user.id);
        userProfile = await createProfile(user);
      }

      if (userProfile) {
        setProfile(userProfile);
        logger.info('Profile set:', { userId: user.id, role: userProfile.role });
        
        // Update last login
        try {
          await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);
        } catch (updateError) {
          logger.warn('Failed to update last login:', updateError);
        }
      } else {
        logger.error('Failed to create or fetch profile');
      }
    } catch (error) {
      logger.error('Error in fetchOrCreateProfile:', error);
    }
  };

  // Auth state management
  useEffect(() => {
    logger.info('Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed:', { event, userId: session?.user?.id });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent infinite loops
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
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (session) {
          logger.info('Existing session found');
          setSession(session);
          setUser(session.user);
          await fetchOrCreateProfile(session.user);
        } else {
          logger.info('No existing session');
        }
        
        setLoading(false);
      } catch (error) {
        logger.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  // Auth actions
  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting sign in:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        logger.error('Sign in error:', error);
        return { error };
      }

      if (data.user && data.session) {
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
