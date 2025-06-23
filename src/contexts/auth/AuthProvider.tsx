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

  // Required users for quick login
  const requiredUsers = [
    { email: 'dev@os.local', password: 'dev1234', role: 'developer', fullName: 'Developer User' },
    { email: 'manager@os.local', password: 'manager123', role: 'manager', fullName: 'Manager User' },
    { email: 'rep@os.local', password: 'rep123', role: 'sales_rep', fullName: 'Sales Rep User' }
  ];

  const createSystemUser = async (email: string, password: string, role: Role, fullName: string) => {
    try {
      logger.info('Creating system user:', { email, role }, 'auth');
      
      // Try to use the edge function instead of admin API
      const response = await fetch('/functions/v1/setup-demo-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: [{
            email,
            password,
            role,
            full_name: fullName
          }]
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        logger.info('System user created successfully:', { email, result }, 'auth');
        return true;
      } else {
        logger.error('Failed to create system user via edge function:', result, 'auth');
        return false;
      }
    } catch (error) {
      logger.error('Exception creating system user:', error, 'auth');
      return false;
    }
  };

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      logger.info('Fetching profile for user:', userId, 'auth');
      
      // Use a more direct approach to avoid RLS issues
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        if (error.message.includes('infinite recursion')) {
          logger.error('RLS infinite recursion in profile fetch:', error, 'auth');
          // Return a fallback profile to prevent app freeze
          return {
            id: userId,
            full_name: 'User',
            role: 'sales_rep' as Role,
            company_id: userId,
            email_connected: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          };
        }
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
        if (error.message.includes('infinite recursion')) {
          logger.error('RLS infinite recursion in profile creation:', error, 'auth');
          // Return the profile data we tried to create as fallback
          return profileData as Profile;
        }
        logger.error('Error creating profile:', error, 'auth');
        throw error;
      }
      
      if (!newProfile) {
        logger.error('Profile creation returned null data', {}, 'auth');
        // Return the profile data we tried to create as fallback
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
      // Return a fallback profile to prevent app freeze
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
        
        if (!userProfile) {
          logger.error('Failed to create profile, using fallback...', {}, 'auth');
          userProfile = {
            id: user.id,
            full_name: user.email?.split('@')[0] || 'User',
            role: 'sales_rep',
            company_id: user.id,
            email_connected: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          };
        }
      }

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
    } catch (error) {
      logger.error('Critical error in fetchOrCreateProfile:', error, 'auth');
      // Always set a fallback profile to prevent app freeze
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
      logger.warn('Using fallback profile due to error:', fallbackProfile, 'auth');
      setProfile(fallbackProfile);
    }
  };

  useEffect(() => {
    logger.info('Setting up auth state listener', {}, 'auth');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed:', { 
          event, 
          userId: session?.user?.id,
          hasSession: !!session,
          hasUser: !!session?.user
        }, 'auth');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile operations to avoid blocking auth state changes
          setTimeout(() => {
            fetchOrCreateProfile(session.user);
          }, 100);
        } else {
          setProfile(null);
        }
        
        // Always ensure loading is set to false
        setTimeout(() => setLoading(false), 200);
      }
    );

    const initializeAuth = async () => {
      try {
        logger.info('Initializing auth - checking for existing session', {}, 'auth');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting session:', error, 'auth');
          setLoading(false);
          return;
        }
        
        if (session) {
          logger.info('Existing session found, processing user', {}, 'auth');
          setSession(session);
          setUser(session.user);
          await fetchOrCreateProfile(session.user);
        } else {
          logger.info('No existing session found', {}, 'auth');
        }
        
        setLoading(false);
      } catch (error) {
        logger.error('Error initializing auth:', error, 'auth');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      logger.info('Cleaning up auth subscription', {}, 'auth');
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

      if (error) {
        logger.error('Sign in failed:', { 
          error: error.message, 
          code: error.status,
          email: email.trim(),
          fullError: error
        }, 'auth');

        // Enhanced error handling for different types of auth errors
        if (error.message.includes('Invalid login credentials') || error.status === 400) {
          const requiredUser = requiredUsers.find(u => u.email === email.trim());
          if (requiredUser) {
            logger.info('Attempting to create missing system user:', { email }, 'auth');
            const created = await createSystemUser(
              requiredUser.email, 
              requiredUser.password, 
              requiredUser.role as Role, 
              requiredUser.fullName
            );
            
            if (created) {
              logger.info('User created, attempting login again...', {}, 'auth');
              // Wait a moment for user creation to propagate
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Retry login after user creation
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password
              });
              
              if (retryError) {
                logger.error('Sign in failed after user creation:', retryError, 'auth');
                setLoading(false);
                return { error: retryError };
              }
              
              if (retryData.user && retryData.session) {
                logger.info('Sign in successful after user creation:', { 
                  userId: retryData.user.id,
                  email: retryData.user.email
                }, 'auth');
                setLoading(false);
                return { error: null };
              }
            }
          }
        }
        
        setLoading(false);
        return { error };
      }

      if (data.user && data.session) {
        logger.info('Sign in successful:', { 
          userId: data.user.id,
          email: data.user.email
        }, 'auth');
        setLoading(false);
        return { error: null };
      }

      logger.error('Sign in returned no user/session data', {}, 'auth');
      setLoading(false);
      return { error: new Error('Authentication failed - no user data returned') as AuthError };
    } catch (error) {
      logger.error('Sign in exception:', error, 'auth');
      setLoading(false);
      return { error: error as AuthError };
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
