
import { supabase } from '@/integrations/supabase/client';
import { demoUsers, logDemoLogin } from '@/data/demo.mock.data';

export const ensureDemoUsersExist = async () => {
  console.log('🎭 Checking if demo users exist in Supabase...');
  
  for (const demoUser of demoUsers) {
    try {
      // List all users and find by email (since getUserByEmail doesn't exist)
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error(`❌ Failed to list users:`, listError);
        continue;
      }

      const existingUser = userList?.users?.find(u => u.email === demoUser.email);
      
      if (!existingUser) {
        console.log(`🎭 Creating demo user: ${demoUser.email}`);
        
        // Create the user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: demoUser.email,
          password: demoUser.password,
          email_confirm: true,
          user_metadata: {
            full_name: demoUser.name,
            role: demoUser.role
          }
        });

        if (createError) {
          console.error(`❌ Failed to create demo user ${demoUser.email}:`, createError);
          continue;
        }

        console.log(`✅ Demo user created: ${demoUser.email}`);
        
        // Create profile for the user
        if (newUser.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: newUser.user.id,
              full_name: demoUser.name,
              role: demoUser.role,
              company_id: newUser.user.id,
              email_connected: true,
              onboarding_complete: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            });

          if (profileError) {
            console.error(`❌ Failed to create profile for ${demoUser.email}:`, profileError);
          } else {
            console.log(`✅ Profile created for demo user: ${demoUser.email}`);
          }
        }
      } else {
        console.log(`🎭 Demo user already exists: ${demoUser.email}`);
      }
    } catch (error) {
      console.error(`❌ Error processing demo user ${demoUser.email}:`, error);
    }
  }
};

export const performDemoLogin = async (email: string, password: string) => {
  console.log('🎭 Performing demo login for:', email);
  
  try {
    const result = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (result.error) {
      console.error('❌ Demo login failed:', result.error);
      logDemoLogin(email, false);
      return { success: false, error: result.error };
    }

    console.log('✅ Demo login successful:', result.data);
    logDemoLogin(email, true);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Demo login exception:', error);
    logDemoLogin(email, false);
    return { success: false, error };
  }
};
