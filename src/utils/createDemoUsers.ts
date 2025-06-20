
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface DemoUser {
  email: string;
  password: string;
  full_name: string;
  role: 'developer' | 'manager' | 'sales_rep';
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'krishdev@tsam.com',
    password: 'badabing2024',
    full_name: 'Krish Developer',
    role: 'developer'
  },
  {
    email: 'manager@salesos.com',
    password: 'manager123',
    full_name: 'Sales Manager',
    role: 'manager'
  },
  {
    email: 'rep@salesos.com',
    password: 'sales123',
    full_name: 'Sales Rep',
    role: 'sales_rep'
  }
];

export const createDemoUser = async (user: DemoUser) => {
  try {
    logger.info(`Creating demo user: ${user.email}`);
    
    // Try to sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          full_name: user.full_name,
          role: user.role
        }
      }
    });

    if (authError && !authError.message.includes('already registered')) {
      logger.error(`Auth error for ${user.email}:`, authError);
      return {
        success: false,
        email: user.email,
        error: authError,
        message: 'Failed to create user account'
      };
    }

    if (authData.user || authError?.message.includes('already registered')) {
      const userId = authData.user?.id;
      
      if (userId) {
        // Create profile directly if we have a user ID
        const profileData = {
          id: userId,
          full_name: user.full_name,
          role: user.role,
          company_id: userId,
          email_connected: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (profileError) {
          logger.error(`Failed to create profile for ${user.email}:`, profileError);
        }
      }

      // Sign out after creation
      await supabase.auth.signOut();

      return {
        success: true,
        email: user.email,
        message: authError?.message.includes('already registered') ? 'User already exists' : 'User created successfully'
      };
    }

    return {
      success: false,
      email: user.email,
      error: new Error('Unknown error - no user data returned'),
      message: 'Unknown error occurred'
    };

  } catch (error) {
    logger.error(`Error creating demo user ${user.email}:`, error);
    return {
      success: false,
      email: user.email,
      error: error,
      message: 'Unexpected error occurred'
    };
  }
};

export const createAllDemoUsers = async () => {
  logger.info('Creating all demo users...');
  
  const results = [];
  
  for (const user of DEMO_USERS) {
    const result = await createDemoUser(user);
    results.push(result);
    
    // Add delay between user creation to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  logger.info('Demo user creation completed:', results);
  return results;
};

export const testDemoUserLogin = async (email: string, password: string) => {
  try {
    logger.info(`Testing login for: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      logger.error(`Login test failed for ${email}:`, error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Sign out after test
      await supabase.auth.signOut();

      if (profileError || !profile) {
        logger.error(`Profile missing for ${email}:`, profileError);
        return { 
          success: false, 
          error: 'User exists but profile is missing',
          hasAuth: true,
          hasProfile: false
        };
      }

      logger.info(`Login test successful for ${email}`);
      return { 
        success: true, 
        hasAuth: true, 
        hasProfile: true,
        profile: profile
      };
    }

    return { success: false, error: 'No user data returned' };
  } catch (error) {
    logger.error(`Login test error for ${email}:`, error);
    return { success: false, error: 'Unexpected error during login test' };
  }
};
