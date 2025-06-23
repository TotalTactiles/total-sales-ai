
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
      flowType: 'pkce'
    },
    global: {
      headers: {
        'x-application-name': 'salesos-platform'
      }
    }
  }
);

// Enhanced connection testing with detailed error logging
const testConnection = async () => {
  try {
    logger.info('Testing Supabase connection...', {}, 'supabase');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.error('Supabase connection error:', {
        message: error.message,
        status: error.status,
        code: error.code
      }, 'supabase');
    } else {
      logger.info('Supabase connected successfully', {}, 'supabase');
      
      // Test database connectivity
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (dbError) {
        logger.warn('Database query test failed:', {
          message: dbError.message,
          code: dbError.code,
          details: dbError.details
        }, 'supabase');
      } else {
        logger.info('Database connectivity confirmed', {}, 'supabase');
      }
    }
  } catch (error) {
    logger.error('Failed to test Supabase connection:', error, 'supabase');
  }
};

// Test connection on initialization
testConnection();
