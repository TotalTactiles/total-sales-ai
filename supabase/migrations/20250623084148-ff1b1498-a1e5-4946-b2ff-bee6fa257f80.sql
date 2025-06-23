
-- STEP 1: CREATE MISSING ENUM TYPE IF NEEDED
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('developer', 'admin', 'manager', 'sales_rep');
  END IF;
END$$;

-- STEP 2: RESET ALL POLICIES ON PROFILES TO AVOID RECURSION
-- Drop known policies first
DROP POLICY IF EXISTS "Allow authenticated users to select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read ai_brain_logs" ON public.ai_brain_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert ai_brain_logs" ON public.ai_brain_logs;

-- Drop any remaining policies with corrected syntax
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public' LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON public.profiles';
  END LOOP;
END$$;

-- Also clean up ai_brain_logs policies
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT policyname FROM pg_policies WHERE tablename = 'ai_brain_logs' AND schemaname = 'public' LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(rec.policyname) || ' ON public.ai_brain_logs';
  END LOOP;
END$$;

-- STEP 3: ENSURE RLS IS ENABLED
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_brain_logs ENABLE ROW LEVEL SECURITY;

-- STEP 4: CREATE CLEAN, NON-RECURSIVE POLICIES
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

-- Fix ai_brain_logs policies to be simple and non-recursive
CREATE POLICY "Allow authenticated users to read ai_brain_logs"
ON public.ai_brain_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert ai_brain_logs"
ON public.ai_brain_logs FOR INSERT
TO authenticated
WITH CHECK (true);
