
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
    logger.info(`Creating demo user: ${userData.email}`);
    
    const { data, error } = await supabase.auth.signUp({
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

    if (error) {
      if (error.message.includes('already registered')) {
        logger.info(`User ${userData.email} already exists`);
        return { success: true, message: 'User already exists' };
      }
      throw error;
    }

    logger.info(`Successfully created user: ${userData.email}`);
    return { success: true, data };
  } catch (error) {
    logger.error(`Failed to create user ${userData.email}:`, error);
    return { success: false, error };
  }
};

export const createAllDemoUsers = async () => {
  const results = [];
  
  for (const user of DEMO_USERS) {
    const result = await createDemoUser(user);
    results.push({ ...user, ...result });
  }
  
  return results;
};
