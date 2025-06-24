import { supabase } from './supabaseClient';

export async function signUpUser({
  email,
  password,
  full_name,
  role
}: {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'developer' | 'manager' | 'sales_rep';
}) {
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
}
