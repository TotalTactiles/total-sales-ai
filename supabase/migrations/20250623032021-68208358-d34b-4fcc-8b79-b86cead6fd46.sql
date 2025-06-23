
-- Step 1: Add enum values in a transaction that can be committed
DO $$ 
BEGIN
    -- Add 'developer' to the enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'developer' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'developer';
    END IF;
    
    -- Add 'admin' to the enum if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
END $$;

-- Step 2: Update the handle_new_user function (this will be used after the enum values are committed)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, company_id, email_connected, created_at, updated_at)
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
    NEW.id, -- Set the company_id to the user's id by default
    false,
    now(),
    now()
  );
  
  -- Create default AI agent persona (check if exists first)
  IF NOT EXISTS (SELECT 1 FROM public.ai_agent_personas WHERE user_id = NEW.id) THEN
    INSERT INTO public.ai_agent_personas (user_id, name)
    VALUES (NEW.id, 'AI Assistant');
  END IF;
  
  -- Initialize user stats (check if exists first)
  IF NOT EXISTS (SELECT 1 FROM public.user_stats WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Step 3: Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
