
-- Check existing users in auth.users table (corrected query)
SELECT id, email, created_at, email_confirmed_at, raw_user_meta_data FROM auth.users;

-- Check profiles table
SELECT * FROM public.profiles;

-- Check if our handle_new_user function is properly set up
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';
