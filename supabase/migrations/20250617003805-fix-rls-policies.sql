
-- Fix RLS policies to prevent infinite recursion

-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create proper RLS policies for profiles table
CREATE POLICY "Enable read access for own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for other tables that need them
CREATE POLICY "Enable read access for own ai_brain_logs" 
  ON public.ai_brain_logs FOR SELECT 
  USING (company_id = auth.uid());

CREATE POLICY "Enable insert for own ai_brain_logs" 
  ON public.ai_brain_logs FOR INSERT 
  WITH CHECK (company_id = auth.uid());

-- Fix any other recursive issues by ensuring clean policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_brain_logs ENABLE ROW LEVEL SECURITY;
