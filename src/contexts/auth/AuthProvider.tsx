
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AuthContextType, Profile, Role } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  const createDefaultProfile = async (user: User): Promise<Profile | null> => {
    try {
      const defaultProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        role: (user.user_metadata?.role as Role) || 'sales_rep',
        company_id: user.id,
        email_connected: false
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        logger.error('Error creating profile:', error);
        return null;
      }

      logger.info('Profile created successfully for user:', user.id);
      return data;
    } catch (error) {
      logger.error('Unexpected error creating profile:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    logger.info('Auth state changed:', event);
    
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      // Fetch or create profile
      let userProfile = await fetchProfile(session.user.id);
      
      if (!userProfile) {
        userProfile = await createDefaultProfile(session.user);
      }
      
      setProfile(userProfile);
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Sign out error:', error);
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      logger.info('User signed out successfully');
    } catch (error) {
      logger.error('Error during sign out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signOut
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
