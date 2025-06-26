
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yztozysvxyjqguybokqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6dG96eXN2eHlqcWd1eWJva3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NTY2ODMsImV4cCI6MjA2MzUzMjY4M30.7dhGIRRtmpn6UMCwyq2RMm4kGdopMN13Ky0OfbHE6nk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
