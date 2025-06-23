
import { logger } from '@/utils/logger';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase credentials not found, using fallback configuration');
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
        'x-application-name': 'tsam-app'
      }
    }
  }
);

// Enhanced connection testing
const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      logger.error('Supabase connection error:', error);
    } else {
      logger.info('Supabase connected successfully');
      
      // Test a simple query to ensure database connectivity
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
        
      if (dbError) {
        logger.warn('Database query test failed:', dbError);
      } else {
        logger.info('Database connectivity confirmed');
      }
    }
  } catch (error) {
    logger.error('Failed to test Supabase connection:', error);
  }
};

// Test connection on initialization
testConnection();
