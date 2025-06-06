import { logger } from '@/utils/logger';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  logger.warn('Supabase credentials not found, using demo mode');
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseKey || 'demo-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
