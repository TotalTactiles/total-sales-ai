
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
  },
  {
    email: 'krishdev@tsam.com',
    password: 'badabing2024',
    role: 'developer',
    full_name: 'Krish Developer'
  }
];

export const createDemoUser = async (userData: DemoUser) => {
  try {
    logger.info(`Starting creation process for: ${userData.email}`);
    
    // First, try to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          role: userData.role,
          full_name: userData.full_name
        },
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        logger.info(`User ${userData.email} already exists, checking profile...`);
        
        // Try to sign in to verify the user exists and works
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        });
        
        if (signInError) {
          logger.error(`Sign in failed for ${userData.email}:`, signInError);
          return { 
            success: false, 
            error: signInError,
            email: userData.email 
          };
        }
        
        // Check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single();
        
        if (profileError || !profileData) {
          // Create profile manually if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: signInData.user.id,
              full_name: userData.full_name,
              role: userData.role as any,
              company_id: signInData.user.id
            });
          
          if (insertError) {
            logger.error(`Profile creation failed for ${userData.email}:`, insertError);
            return { 
              success: false, 
              error: insertError,
              email: userData.email 
            };
          }
        }
        
        // Sign out after verification
        await supabase.auth.signOut();
        
        return { 
          success: true, 
          message: 'User verified and ready for login',
          email: userData.email 
        };
      }
      
      logger.error(`Sign up failed for ${userData.email}:`, signUpError);
      return { 
        success: false, 
        error: signUpError,
        email: userData.email 
      };
    }

    if (signUpData.user) {
      logger.info(`User created successfully: ${userData.email}`);
      
      // Verify profile was created by trigger
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();
      
      if (profileError) {
        logger.warn(`Profile not found for ${userData.email}, creating manually...`);
        
        // Create profile manually
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            full_name: userData.full_name,
            role: userData.role as any,
            company_id: signUpData.user.id
          });
        
        if (insertError) {
          logger.error(`Manual profile creation failed for ${userData.email}:`, insertError);
          return { 
            success: false, 
            error: insertError,
            email: userData.email 
          };
        }
      }
      
      // Sign out the newly created user
      await supabase.auth.signOut();
      
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
  logger.info('Starting demo user creation process...');
  const results = [];
  
  for (const user of DEMO_USERS) {
    logger.info(`Processing user: ${user.email}`);
    const result = await createDemoUser(user);
    results.push(result);
    
    // Add a small delay between user creations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  logger.info('Demo user creation process completed');
  return results;
};
