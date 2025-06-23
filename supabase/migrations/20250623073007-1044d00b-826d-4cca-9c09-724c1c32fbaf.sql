
-- First, create nova_error_log table for self-healing AI
CREATE TABLE IF NOT EXISTS nova_error_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  component text NOT NULL,
  error_message text NOT NULL,
  context jsonb,
  retry_count integer DEFAULT 0,
  fixed_by_ai boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone
);

-- Enable RLS on nova_error_log
ALTER TABLE nova_error_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow authenticated users to select ai_brain_logs" ON ai_brain_logs;
DROP POLICY IF EXISTS "Allow authenticated users to select profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to manage nova_error_log" ON nova_error_log;

-- Create RLS policies for ai_brain_logs
CREATE POLICY "Allow authenticated users to select ai_brain_logs"
ON ai_brain_logs FOR SELECT 
TO authenticated 
USING (true);

-- Create RLS policies for profiles
CREATE POLICY "Allow authenticated users to select profiles"
ON profiles FOR SELECT 
TO authenticated 
USING (true);

-- Create policy for nova_error_log
CREATE POLICY "Allow authenticated users to manage nova_error_log"
ON nova_error_log FOR ALL
TO authenticated 
USING (true)
WITH CHECK (true);
