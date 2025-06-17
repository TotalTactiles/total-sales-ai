
-- Create the user_role enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('developer', 'admin', 'manager', 'sales_rep');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the handle_new_user function to properly handle role casting
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
