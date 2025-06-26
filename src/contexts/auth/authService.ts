
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const signIn = async (email: string, password: string) => {
  try {
    logger.info('🔐 Attempting to sign in user:', { email }, 'auth');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('❌ Sign in failed:', error, 'auth');
      return { error };
    }

    logger.info('✅ Sign in successful:', { 
      userId: data.user?.id, 
      email: data.user?.email 
    }, 'auth');
    
    return { data, error: null };
  } catch (error) {
    logger.error('❌ Sign in exception:', error, 'auth');
    return { error };
  }
};

export const signUp = async (email: string, password: string, options?: any) => {
  try {
    logger.info('🔐 Attempting to sign up user:', { email }, 'auth');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options || {},
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      logger.error('❌ Sign up failed:', error, 'auth');
      return { error };
    }

    logger.info('✅ Sign up successful:', { 
      userId: data.user?.id, 
      email: data.user?.email,
      needsConfirmation: !data.session
    }, 'auth');
    
    return { data, error: null };
  } catch (error) {
    logger.error('❌ Sign up exception:', error, 'auth');
    return { error };
  }
};

export const signUpWithOAuth = async (provider: 'google' | 'github') => {
  try {
    logger.info('🔐 Attempting OAuth sign up:', { provider }, 'auth');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      logger.error('❌ OAuth sign up failed:', error, 'auth');
      return { error };
    }

    logger.info('✅ OAuth sign up initiated', { provider }, 'auth');
    return { data, error: null };
  } catch (error) {
    logger.error('❌ OAuth sign up exception:', error, 'auth');
    return { error };
  }
};

export const signOut = async () => {
  try {
    logger.info('🔐 Signing out user', {}, 'auth');
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error('❌ Sign out failed:', error, 'auth');
      return { error };
    }

    logger.info('✅ Sign out successful', {}, 'auth');
    return { error: null };
  } catch (error) {
    logger.error('❌ Sign out exception:', error, 'auth');
    return { error };
  }
};
