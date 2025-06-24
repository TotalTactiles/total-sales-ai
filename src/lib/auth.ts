
import { supabase } from '@/integrations/supabase/client';

export const signUpUser = async ({
  email,
  password,
  full_name,
  role
}: {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'developer' | 'manager' | 'sales_rep';
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role
      }
    }
  });

  if (error) {
    console.error('Error signing up:', error.message);
    throw new Error(error.message);
  }

  return data;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};
