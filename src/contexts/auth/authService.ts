
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('Sign in error:', error, 'auth');
      return { error };
    }

    logger.info('Sign in successful', {}, 'auth');
    return { data, error: null };
  } catch (error) {
    logger.error('Sign in exception:', error, 'auth');
    return { error };
  }
};

export const signUp = async (email: string, password: string, options?: any) => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        ...options
      }
    });

    if (error) {
      logger.error('Sign up error:', error, 'auth');
      return { error };
    }

    logger.info('Sign up successful', {}, 'auth');
    return { data, error: null };
  } catch (error) {
    logger.error('Sign up exception:', error, 'auth');
    return { error };
  }
};

export const signUpWithOAuth = async (provider: 'google' | 'github') => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      logger.error(`${provider} OAuth error:`, error, 'auth');
      return { error };
    }

    return { data, error: null };
  } catch (error) {
    logger.error(`${provider} OAuth exception:`, error, 'auth');
    return { error };
  }
};

export const signOut = async () => {
  try {
    logger.info('Starting sign out', {}, 'auth');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('Sign out error:', error, 'auth');
    } else {
      logger.info('Sign out successful', {}, 'auth');
    }
    
    // Clear all storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    return { error };
  } catch (error) {
    logger.error('Sign out exception:', error, 'auth');
    return { error: null }; // Don't block logout on exceptions
  }
};
