
-- Create the three core user accounts with proper metadata
-- Note: These will be created through the auth system with the trigger handling profile creation

-- First, let's ensure our handle_new_user function is properly updated to handle all the metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, company_id)
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
    NEW.id -- Set the company_id to the user's id by default
  );
  
  -- Create default AI agent persona
  INSERT INTO public.ai_agent_personas (user_id, name)
  VALUES (NEW.id, 'AI Assistant');
  
  -- Initialize user stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

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
