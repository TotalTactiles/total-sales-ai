
import { supabase } from '@/integrations/supabase/client';
import { demoUsers, logDemoLogin } from '@/data/demo.mock.data';
import { logger } from '@/utils/logger';

export const ensureDemoUsersExist = async (): Promise<void> => {
  try {
    logger.info('🎭 Setting up demo users...');
    
    for (const demoUser of demoUsers) {
      try {
        // Check if demo user already exists in auth.users
        const { data: existingAuth } = await supabase.auth.admin.getUserByEmail(demoUser.email);
        
        if (!existingAuth.user) {
          // Create demo user in auth system
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
        } else {
          logger.info(`✅ Demo user already exists: ${demoUser.email}`);
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
