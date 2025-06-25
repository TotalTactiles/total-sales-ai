
-- Manager OS Database Schema Updates

-- First, ensure all required columns exist in profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS assistant_name TEXT DEFAULT 'AI Assistant',
ADD COLUMN IF NOT EXISTS voice_style TEXT DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS launched_at TIMESTAMP WITH TIME ZONE;

-- Create leads table for Manager OS Lead Management
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  assigned_rep UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  contacted BOOLEAN DEFAULT FALSE,
  conversion_likelihood INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  tags TEXT[],
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  speed_to_lead INTEGER DEFAULT 0,
  is_sensitive BOOLEAN DEFAULT FALSE,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lead source analytics table
CREATE TABLE IF NOT EXISTS lead_source_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  company_id UUID NOT NULL,
  total_leads INTEGER DEFAULT 0,
  qualified_leads INTEGER DEFAULT 0,
  closed_deals INTEGER DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  conversion_rate FLOAT DEFAULT 0,
  avg_close_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company brains table for AI COO intelligence
CREATE TABLE IF NOT EXISTS company_brains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  ai_insights JSONB DEFAULT '{}',
  business_goals JSONB DEFAULT '{}',
  rep_behaviors JSONB DEFAULT '{}',
  source_performance JSONB DEFAULT '{}',
  ai_learnings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company leads" ON leads
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can insert company leads" ON leads
  FOR INSERT WITH CHECK (company_id = get_current_user_company_id());

CREATE POLICY "Users can update company leads" ON leads
  FOR UPDATE USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can delete company leads" ON leads
  FOR DELETE USING (company_id = get_current_user_company_id());

-- Add RLS policies for lead_source_stats table
ALTER TABLE lead_source_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company lead stats" ON lead_source_stats
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can manage company lead stats" ON lead_source_stats
  FOR ALL USING (company_id = get_current_user_company_id());

-- Add RLS policies for company_brains table
ALTER TABLE company_brains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company brain" ON company_brains
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can manage company brain" ON company_brains
  FOR ALL USING (company_id = get_current_user_company_id());

-- Create triggers for updated_at columns
CREATE OR REPLACE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_lead_source_stats_updated_at
  BEFORE UPDATE ON lead_source_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_company_brains_updated_at
  BEFORE UPDATE ON company_brains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
