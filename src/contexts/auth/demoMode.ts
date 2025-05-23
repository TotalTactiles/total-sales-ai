
import { User } from '@supabase/supabase-js';
import { Role, Profile } from './types';

export const initializeDemoUser = (role: Role): {
  demoUser: User;
  demoProfile: Profile;
} => {
  console.log("Initializing demo user with role:", role);
  
  // Create a mock user for demo purposes with safe type casting
  const demoUser = {
    id: role === 'manager' ? 'demo-manager-id' : 'demo-sales-rep-id',
    email: role === 'manager' ? 'manager@salesos.com' : 'rep@salesos.com',
    user_metadata: {
      full_name: role === 'manager' ? 'John Manager' : 'Sam Sales',
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;

  const demoProfile = {
    id: demoUser.id,
    full_name: role === 'manager' ? 'John Manager' : 'Sam Sales',
    role: role,
  };

  console.log("Setting demo user:", demoUser);
  console.log("Setting demo profile:", demoProfile);
  
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
