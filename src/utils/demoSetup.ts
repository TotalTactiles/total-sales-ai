
import { supabase } from '@/integrations/supabase/client';
import { demoUsers } from '@/data/demo.mock.data';
import { logger } from '@/utils/logger';

// Cache to avoid repeated setup attempts
let setupAttempted = false;
let setupPromise: Promise<void> | null = null;

export const ensureDemoUsersExist = async (): Promise<void> => {
  // Return existing promise if setup is in progress
  if (setupPromise) {
    return setupPromise;
  }

  // Skip if already attempted
  if (setupAttempted) {
    return;
  }

  setupAttempted = true;
  setupPromise = performDemoSetup();
  
  try {
    await setupPromise;
  } finally {
    setupPromise = null;
  }
};

const performDemoSetup = async (): Promise<void> => {
  try {
    logger.info('🎭 Setting up demo users...', {}, 'demo');

    // Batch create all demo users
    const userCreationPromises = demoUsers.map(async (demoUser) => {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase.auth.admin.getUserById(demoUser.id);
        
        if (existingUser.user) {
          logger.info(`🎭 Demo user ${demoUser.email} already exists`, {}, 'demo');
          return;
        }

        // Create user with admin API for immediate availability
        const { data, error } = await supabase.auth.admin.createUser({
          email: demoUser.email,
          password: demoUser.password,
          email_confirm: true, // Skip email confirmation for demo
          user_metadata: {
            full_name: demoUser.name,
            role: demoUser.role
          }
        });

        if (error) {
          // If user already exists, that's okay
          if (error.message.includes('already registered')) {
            logger.info(`🎭 Demo user ${demoUser.email} already registered`, {}, 'demo');
            return;
          }
          throw error;
        }

        logger.info(`✅ Demo user created: ${demoUser.email}`, {}, 'demo');

        // Ensure profile is created immediately
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: demoUser.name,
            role: demoUser.role,
            company_id: data.user.id,
            email_connected: false,
            onboarding_complete: true, // Skip onboarding for demo users
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          }, {
            onConflict: 'id'
          });
        }

      } catch (error) {
        logger.error(`❌ Failed to create demo user ${demoUser.email}:`, error, 'demo');
      }
    });

    // Wait for all users to be created
    await Promise.all(userCreationPromises);
    logger.info('✅ Demo setup completed', {}, 'demo');

  } catch (error) {
    logger.error('❌ Demo setup failed:', error, 'demo');
    throw error;
  }
};
