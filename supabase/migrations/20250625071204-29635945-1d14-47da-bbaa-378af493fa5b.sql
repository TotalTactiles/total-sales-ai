
-- Update profiles table with all required fields for comprehensive onboarding
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS sales_personality TEXT,
ADD COLUMN IF NOT EXISTS primary_goal TEXT,
ADD COLUMN IF NOT EXISTS motivation_trigger TEXT,
ADD COLUMN IF NOT EXISTS weakness TEXT,
ADD COLUMN IF NOT EXISTS ai_assistant JSONB,
ADD COLUMN IF NOT EXISTS mental_state_trigger TEXT,
ADD COLUMN IF NOT EXISTS wishlist TEXT,
ADD COLUMN IF NOT EXISTS management_style TEXT,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS preferred_team_personality TEXT,
ADD COLUMN IF NOT EXISTS team_obstacle TEXT,
ADD COLUMN IF NOT EXISTS business_goal TEXT,
ADD COLUMN IF NOT EXISTS influence_style TEXT;

-- Ensure onboarding_complete exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

-- Create company_master_ai table for global AI brain
CREATE TABLE IF NOT EXISTS company_master_ai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  top_weaknesses TEXT[],
  most_clicked_features TEXT[],
  wishlist_tags TEXT[],
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for company_master_ai
ALTER TABLE company_master_ai ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's master AI" ON company_master_ai
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can update their company's master AI" ON company_master_ai
  FOR ALL USING (company_id = get_current_user_company_id());

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_company_master_ai_updated_at
  BEFORE UPDATE ON company_master_ai
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
