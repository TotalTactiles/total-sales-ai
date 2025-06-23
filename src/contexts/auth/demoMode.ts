
import { logger } from '@/utils/logger';
import { User } from '@supabase/supabase-js';
import { Role, Profile } from './types';

export const initializeDemoUser = (role: Role): {
  demoUser: User;
  demoProfile: Profile;
} => {
  logger.info("Initializing demo user with role:", role);
  
  // Use proper UUIDs for demo users
  const userIds = {
    developer: 'f47b3c1a-3f5d-4c8e-9b2a-1d6e4f8c9b7e',
    manager: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    sales_rep: 'b2c3d4e5-f6g7-8901-bcde-f23456789012'
  };
  
  const userProfiles = {
    developer: { name: 'Krish Developer', email: 'krishdev@tsam.com' },
    manager: { name: 'Sales Manager', email: 'manager@salesos.com' },
    sales_rep: { name: 'Sales Rep', email: 'rep@salesos.com' }
  };
  
  const userId = userIds[role] || userIds.sales_rep;
  const userProfile = userProfiles[role] || userProfiles.sales_rep;
  
  // Create a mock user for demo purposes with safe type casting
  const demoUser = {
    id: userId,
    email: userProfile.email,
    user_metadata: {
      full_name: userProfile.name,
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;

  const demoProfile: Profile = {
    id: userId,
    full_name: userProfile.name,
    role: role,
    company_id: userId,
    email_connected: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email: userProfile.email,
    ai_assistant_name: 'SalesOS AI'
  };

  logger.info("Setting demo user:", demoUser);
  logger.info("Setting demo profile:", demoProfile);
  
  return { demoUser, demoProfile };
};

export const isDemoMode = (): boolean => {
  return localStorage.getItem('demoMode') === 'true';
};

export const setDemoMode = (role: Role): void => {
  localStorage.setItem('demoMode', 'true');
  localStorage.setItem('demoRole', role);
};

export const clearDemoMode = (): void => {
  localStorage.removeItem('demoMode');
  localStorage.removeItem('demoRole');
};
