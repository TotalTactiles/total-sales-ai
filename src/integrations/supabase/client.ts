
import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase credentials not found, using fallback configuration', {}, 'supabase');
}

export const supabase = createClient(
  supabaseUrl || 'https://yztozysvxyjqguybokqj.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6dG96eXN2eHlqcWd1eWJva3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NTY2ODMsImV4cCI6MjA2MzUzMjY4M30.7dhGIRRtmpn6UMCwyq2RMm4kGdopMN13Ky0OfbHE6nk',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      flowType: 'pkce',
      debug: process.env.NODE_ENV === 'development'
    },
    global: {
      headers: {
        'x-application-name': 'salesos-platform'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Enhanced connection testing with better error handling
const testConnection = async () => {
  try {
    logger.info('Testing Supabase connection...', {}, 'supabase');
    
    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      logger.error('Supabase auth error:', {
        message: authError.message,
        status: authError.status,
        code: authError.code
      }, 'supabase');
    } else {
      logger.info('Supabase auth connected successfully', {}, 'supabase');
    }
    
    // Test database connectivity with a simple query that won't trigger RLS
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (dbError) {
        if (dbError.message.includes('infinite recursion')) {
          logger.error('RLS infinite recursion detected in profiles table', {
            message: dbError.message,
            code: dbError.code,
            details: dbError.details
          }, 'supabase');
        } else {
          logger.warn('Database query test failed:', {
            message: dbError.message,
            code: dbError.code,
            details: dbError.details
          }, 'supabase');
        }
      } else {
        logger.info('Database connectivity confirmed', {}, 'supabase');
      }
    } catch (dbException) {
      logger.error('Database connection test exception:', dbException, 'supabase');
    }
    
  } catch (error) {
    logger.error('Failed to test Supabase connection:', error, 'supabase');
  }
};

// Test connection on initialization, but don't block the app
testConnection();
