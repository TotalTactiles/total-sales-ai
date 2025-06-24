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

  // ✅ Add this step to create profile
  const user = data.user;
  if (user) {
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: user.id,
      full_name,
      role,
      company_id: user.id,
      email_confirmed: false,
    }]);

    if (profileError) {
      console.error('Error creating profile:', profileError.message);
      throw new Error(profileError.message);
    }
  }

  return data;
}
