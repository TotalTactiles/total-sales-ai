
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface DemoUser {
  email: string;
  password: string;
  role: string;
  full_name: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'krishdev@tsam.com',
    password: 'badabing2024',
    role: 'developer',
    full_name: 'Krish Developer'
  },
  {
    email: 'manager@salesos.com',
    password: 'manager123',
    role: 'manager',
    full_name: 'Sales Manager'
  },
  {
    email: 'rep@salesos.com',
    password: 'sales123',
    role: 'sales_rep',
    full_name: 'Sales Representative'
  }
];

export const createDemoUser = async (userData: DemoUser) => {
  try {
    logger.info(`Creating/verifying user: ${userData.email}`);
    
    // First try to sign in to check if user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password
    });

    if (signInData.user && !signInError) {
      logger.info(`User ${userData.email} already exists and credentials work`);
      
      // Check if profile exists and is correct
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single();

      if (profileError || !profileData || profileData.role !== userData.role) {
        // Create or update profile
        const profilePayload = {
          id: signInData.user.id,
          full_name: userData.full_name,
          role: userData.role as any,
          company_id: signInData.user.id,
          email_connected: false,
          created_at: profileData?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(profilePayload);

        if (upsertError) {
          logger.error(`Profile upsert failed for ${userData.email}:`, upsertError);
        } else {
          logger.info(`Profile updated for ${userData.email}`);
        }
      }

      // Sign out after verification
      await supabase.auth.signOut();
      
      return { 
        success: true, 
        message: 'User verified and ready',
        email: userData.email 
      };
    }

    // User doesn't exist or wrong password, try to create
    logger.info(`Creating new user: ${userData.email}`);
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          role: userData.role,
          full_name: userData.full_name
        }
      }
    });

    if (signUpError) {
      logger.error(`Sign up failed for ${userData.email}:`, signUpError);
      return { 
        success: false, 
        error: signUpError,
        email: userData.email 
      };
    }

    if (signUpData.user) {
      // Ensure profile is created
      const profilePayload = {
        id: signUpData.user.id,
        full_name: userData.full_name,
        role: userData.role as any,
        company_id: signUpData.user.id,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload);

      if (profileError) {
        logger.error(`Profile creation failed for ${userData.email}:`, profileError);
      }

      // Sign out the newly created user
      await supabase.auth.signOut();
      
      logger.info(`User created successfully: ${userData.email}`);
      return { 
        success: true, 
        data: signUpData,
        email: userData.email 
      };
    }

    return { 
      success: false, 
      error: new Error('Unknown error occurred'),
      email: userData.email 
    };
    
  } catch (error) {
    logger.error(`Failed to create user ${userData.email}:`, error);
    return { 
      success: false, 
      error,
      email: userData.email 
    };
  }
};

export const createAllDemoUsers = async () => {
  logger.info('Starting comprehensive demo user creation...');
  const results = [];
  
  for (const user of DEMO_USERS) {
    logger.info(`Processing user: ${user.email}`);
    const result = await createDemoUser(user);
    results.push(result);
    
    // Small delay between creations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  logger.info('Demo user creation completed');
  return results;
};
