
import { supabase } from '@/integrations/supabase/client';
import { demoUsers, logDemoLogin } from '@/data/demo.mock.data';

export const ensureDemoUsersExist = async () => {
  console.log('🎭 Checking if demo users exist in Supabase...');
  
  for (const demoUser of demoUsers) {
    try {
      // Try to sign in first to check if user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoUser.email,
        password: demoUser.password
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log(`🎭 Demo user ${demoUser.email} doesn't exist, creating...`);
        
        // User doesn't exist, create them
        const { data: newUser, error: createError } = await supabase.auth.signUp({
          email: demoUser.email,
          password: demoUser.password,
          options: {
            data: {
              full_name: demoUser.name,
              role: demoUser.role
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (createError) {
          console.error(`❌ Failed to create demo user ${demoUser.email}:`, createError);
          continue;
        }

        if (newUser.user) {
          console.log(`✅ Demo user created: ${demoUser.email}`);
          
          // Create profile for the user
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
      } else if (!signInError) {
        console.log(`🎭 Demo user already exists: ${demoUser.email}`);
        // Sign out after checking
        await supabase.auth.signOut();
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
