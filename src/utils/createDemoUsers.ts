
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
    
    // First check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingProfile) {
      logger.info(`User ${user.email} already exists`);
      return {
        success: true,
        email: user.email,
        message: 'User already exists and is ready for login'
      };
    }

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

    if (authError) {
      // If user already exists in auth but not in profiles, create profile
      if (authError.message.includes('already registered')) {
        logger.info(`User ${user.email} exists in auth, creating profile`);
        
        // Get the user ID from auth
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        });

        if (signInError) {
          throw signInError;
        }

        if (signInData.user) {
          // Create the profile
          const profileData = {
            id: signInData.user.id,
            full_name: user.full_name,
            role: user.role,
            company_id: signInData.user.id,
            email_connected: false,
            email: user.email,
            ai_assistant_name: 'SalesOS AI',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData);

          if (profileError) {
            throw profileError;
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
      
      throw authError;
    }

    logger.info(`Demo user created successfully: ${user.email}`);
    
    // Sign out the newly created user
    await supabase.auth.signOut();

    return {
      success: true,
      email: user.email,
      message: 'User created successfully'
    };

  } catch (error) {
    logger.error(`Error creating demo user ${user.email}:`, error);
    return {
      success: false,
      email: user.email,
      error: error
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
