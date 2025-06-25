
-- Add missing columns to profiles table for comprehensive onboarding
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS assistant_name TEXT DEFAULT 'AI Assistant',
ADD COLUMN IF NOT EXISTS voice_style TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS launched_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to have default values
UPDATE profiles 
SET 
  assistant_name = COALESCE(assistant_name, 'AI Assistant'),
  voice_style = COALESCE(voice_style, 'professional'),
  onboarding_complete = COALESCE(onboarding_complete, FALSE)
WHERE assistant_name IS NULL OR voice_style IS NULL OR onboarding_complete IS NULL;
