
import { supabase } from '@/integrations/supabase/client';
import { demoUsers } from '@/data/demo.mock.data';

export const ensureDemoUsersExist = async () => {
  try {
    console.log('Setting up demo users...');
    
    // Check if demo users already exist in the database
    for (const demoUser of demoUsers) {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', demoUser.email)
        .single();
      
      if (!existingUser) {
        console.log(`Demo user ${demoUser.email} not found, will be created on first login`);
      } else {
        console.log(`Demo user ${demoUser.email} already exists`);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error checking demo users:', error);
    return { success: false, error };
  }
};
