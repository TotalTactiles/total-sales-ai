
-- Check and fix RLS policies that might be causing infinite recursion
-- First, let's see what policies exist on profiles
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop any problematic RLS policies that might cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users on their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Create simple, non-recursive RLS policies for profiles
CREATE POLICY "Allow authenticated users to select their own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to insert their own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Fix ai_brain_logs policies to avoid recursion
DROP POLICY IF EXISTS "Enable read access for own ai_brain_logs" ON public.ai_brain_logs;
DROP POLICY IF EXISTS "Enable insert for own ai_brain_logs" ON public.ai_brain_logs;
DROP POLICY IF EXISTS "Allow authenticated users to select ai_brain_logs" ON public.ai_brain_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert ai_brain_logs" ON public.ai_brain_logs;

-- Create simple policies for ai_brain_logs
CREATE POLICY "Allow authenticated users to read ai_brain_logs" 
ON public.ai_brain_logs FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert ai_brain_logs" 
ON public.ai_brain_logs FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Check if demo users exist in auth.users
SELECT email, created_at, email_confirmed_at, raw_user_meta_data 
FROM auth.users 
WHERE email IN ('dev@os.local', 'manager@os.local', 'rep@os.local');
