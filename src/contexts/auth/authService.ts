
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const signIn = async (email: string, password: string) => {
  try {
    logger.info('Attempting sign in:', { email: email.trim() }, 'auth');
    
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
      
      return { error };
    }

    if (data.user && data.session) {
      logger.info('Sign in successful:', { 
        userId: data.user.id,
        email: data.user.email,
        hasSession: !!data.session
      }, 'auth');
      
      return { error: null };
    }

    logger.error('Sign in returned no user/session data', {}, 'auth');
    return { error: new Error('Authentication failed - no user data returned') as AuthError };
  } catch (error) {
    logger.error('Sign in exception:', error, 'auth');
    return { error: error as AuthError };
  }
};

export const signUp = async (email: string, password: string, userData?: any) => {
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

export const signUpWithOAuth = async (provider: string) => {
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

export const signOut = async () => {
  try {
    logger.info('Attempting sign out', {}, 'auth');
    const { error } = await supabase.auth.signOut();

    if (!error) {
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
