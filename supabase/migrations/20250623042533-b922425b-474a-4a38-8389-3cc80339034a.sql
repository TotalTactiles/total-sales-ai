
-- Fix the infinite recursion in profiles RLS policies by dropping problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;

-- Add missing processed column to ai_brain_logs table
ALTER TABLE public.ai_brain_logs ADD COLUMN IF NOT EXISTS processed boolean DEFAULT false;

-- Create simple RLS policies for profiles that avoid recursion
CREATE POLICY "Enable read access for authenticated users on their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Fix ai_brain_logs RLS policies to avoid violations
DROP POLICY IF EXISTS "Users can view ai brain logs" ON public.ai_brain_logs;
DROP POLICY IF EXISTS "Users can insert ai brain logs" ON public.ai_brain_logs;

CREATE POLICY "Enable insert for ai_brain_logs" ON public.ai_brain_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for ai_brain_logs" ON public.ai_brain_logs
    FOR SELECT USING (true);

-- Ensure the handle_new_user function doesn't cause conflicts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if profile already exists to avoid duplicates
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    INSERT INTO public.profiles (id, full_name, role, company_id, email_connected, created_at, updated_at, last_login)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
      CASE 
        WHEN NEW.raw_user_meta_data->>'role' = 'developer' THEN 'developer'::user_role
        WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
        WHEN NEW.raw_user_meta_data->>'role' = 'manager' THEN 'manager'::user_role
        WHEN NEW.raw_user_meta_data->>'role' = 'sales_rep' THEN 'sales_rep'::user_role
        ELSE 'sales_rep'::user_role
      END,
      NEW.id,
      false,
      now(),
      now(),
      now()
    );
  END IF;
  
  -- Create default AI agent persona if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM public.ai_agent_personas WHERE user_id = NEW.id) THEN
    INSERT INTO public.ai_agent_personas (user_id, name)
    VALUES (NEW.id, 'AI Assistant');
  END IF;
  
  -- Initialize user stats if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.user_stats WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add missing api_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.api_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text,
  method text,
  status integer,
  response_time integer,
  user_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on api_logs
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for api_logs
CREATE POLICY "Enable insert for api_logs" ON public.api_logs
    FOR INSERT WITH CHECK (true);

-- Fix any missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_company_id ON public.leads(company_id);
CREATE INDEX IF NOT EXISTS idx_industry_knowledge_company_id ON public.industry_knowledge(company_id);
CREATE INDEX IF NOT EXISTS idx_industry_knowledge_embedding ON public.industry_knowledge USING hnsw (embedding vector_cosine_ops);
