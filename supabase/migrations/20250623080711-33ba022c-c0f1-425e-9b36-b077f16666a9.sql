
-- First, let's drop any existing problematic triggers and their functions
-- This will clean up any existing triggers that might be causing issues
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Now let's recreate the handle_new_user function with proper security definer
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

-- Recreate the trigger with the security definer function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
