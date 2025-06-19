
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
      storage: window.localStorage
    }
  }
);

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    logger.error('Supabase connection error:', error);
  } else {
    logger.info('Supabase connected successfully');
  }
});
