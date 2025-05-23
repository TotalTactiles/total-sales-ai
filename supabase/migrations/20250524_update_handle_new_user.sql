
-- Update the handle_new_user function to set company_id on signup
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
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_rep'),
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
