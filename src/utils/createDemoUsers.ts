
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
    
    // First check if user already exists in profiles
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingProfile) {
      logger.info(`User ${user.email} already exists with profile`);
      return {
        success: true,
        email: user.email,
        message: 'User already exists with complete profile'
      };
    }

    // Try to sign up the user with proper metadata
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

    if (authError) {
      // If user already exists in auth, try to create profile manually
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        logger.info(`User ${user.email} exists in auth, attempting to create profile`);
        
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        });

        if (signInError) {
          logger.error(`Failed to sign in existing user ${user.email}:`, signInError);
          return {
            success: false,
            email: user.email,
            error: signInError,
            message: 'User exists but could not sign in'
          };
        }

        if (signInData.user) {
          // Create the profile manually
          const profileData = {
            id: signInData.user.id,
            full_name: user.full_name,
            role: user.role,
            company_id: signInData.user.id,
            email_connected: false,
            email: user.email,
            ai_assistant_name: 'SalesOS AI',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' });

          if (profileError) {
            logger.error(`Failed to create profile for ${user.email}:`, profileError);
            await supabase.auth.signOut();
            return {
              success: false,
              email: user.email,
              error: profileError,
              message: 'Failed to create user profile'
            };
          }

          // Sign out after creating profile
          await supabase.auth.signOut();

          return {
            success: true,
            email: user.email,
            message: 'Profile created for existing user'
          };
        }
      }
      
      logger.error(`Auth error for ${user.email}:`, authError);
      return {
        success: false,
        email: user.email,
        error: authError,
        message: 'Failed to create user account'
      };
    }

    if (authData.user) {
      logger.info(`Demo user created successfully: ${user.email} with ID: ${authData.user.id}`);
      
      // Wait a moment for the trigger to run
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify the profile was created by the trigger
      const { data: newProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileCheckError || !newProfile) {
        logger.warn(`Profile not created by trigger for ${user.email}, creating manually`);
        
        // Create profile manually if trigger didn't work
        const profileData = {
          id: authData.user.id,
          full_name: user.full_name,
          role: user.role,
          company_id: authData.user.id,
          email_connected: false,
          email: user.email,
          ai_assistant_name: 'SalesOS AI',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: manualProfileError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

        if (manualProfileError) {
          logger.error(`Failed to manually create profile for ${user.email}:`, manualProfileError);
        }
      }
      
      // Sign out the newly created user
      await supabase.auth.signOut();

      return {
        success: true,
        email: user.email,
        message: 'User and profile created successfully'
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
    await new Promise(resolve => setTimeout(resolve, 2000));
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
