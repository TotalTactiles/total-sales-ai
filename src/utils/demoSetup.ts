
import { supabase } from '@/integrations/supabase/client';
import { demoUsers, logDemoLogin } from '@/data/demo.mock.data';
import { logger } from '@/utils/logger';

export const ensureDemoUsersExist = async (): Promise<void> => {
  try {
    logger.info('🎭 Setting up demo users...');
    
    for (const demoUser of demoUsers) {
      try {
        // Check if demo user already exists by attempting to sign in
        const { data: existingAuth, error: signInError } = await supabase.auth.signInWithPassword({
          email: demoUser.email,
          password: demoUser.password,
        });
        
        // If sign in succeeds, user exists - sign them out immediately
        if (existingAuth.user && !signInError) {
          await supabase.auth.signOut();
          logger.info(`✅ Demo user already exists: ${demoUser.email}`);
          continue;
        }
        
        // If sign in fails with invalid credentials, user doesn't exist - create them
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          logger.info(`🎭 Creating demo user: ${demoUser.email}`);
          
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: demoUser.email,
            password: demoUser.password,
            options: {
              data: {
                full_name: demoUser.name,
                role: demoUser.role
              }
            }
          });
          
          if (authError) {
            logger.error(`❌ Failed to create demo user ${demoUser.email}:`, authError);
            continue;
          }
          
          logger.info(`✅ Demo user created: ${demoUser.email}`);
          logDemoLogin(demoUser.email, true);
        } else if (signInError) {
          logger.error(`❌ Error checking demo user ${demoUser.email}:`, signInError);
        }
      } catch (error) {
        logger.error(`❌ Error processing demo user ${demoUser.email}:`, error);
      }
    }
    
    logger.info('🎭 Demo user setup completed');
  } catch (error) {
    logger.error('❌ Failed to setup demo users:', error);
    throw error;
  }
};

export const isDemoEmail = (email: string): boolean => {
  return demoUsers.some(user => user.email === email);
};

export const getDemoUserRole = (email: string): string | null => {
  const demoUser = demoUsers.find(user => user.email === email);
  return demoUser?.role || null;
};
