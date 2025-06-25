
-- Sales Rep OS Database Schema Updates

-- Add new columns to profiles table for rep personalization
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS sales_style TEXT,
ADD COLUMN IF NOT EXISTS strength_area TEXT,
ADD COLUMN IF NOT EXISTS rep_motivation TEXT,
ADD COLUMN IF NOT EXISTS ai_calibrated BOOLEAN DEFAULT FALSE;

-- Create rep_metrics table for tracking weekly KPIs
CREATE TABLE IF NOT EXISTS rep_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  calls_made INTEGER DEFAULT 0,
  demos_booked INTEGER DEFAULT 0,
  closes INTEGER DEFAULT 0,
  objections_logged JSONB DEFAULT '{}',
  avg_tone_score FLOAT DEFAULT 0,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(rep_id, week_start)
);

-- Create rep_learning_logs table for tracking education and feedback
CREATE TABLE IF NOT EXISTS rep_learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_type TEXT NOT NULL,
  lesson_title TEXT,
  quiz_result INTEGER,
  feedback TEXT,
  time_spent_minutes INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  company_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_nudges table for storing personalized AI suggestions
CREATE TABLE IF NOT EXISTS ai_nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rep_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  nudge_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  priority INTEGER DEFAULT 1,
  seen BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  company_id UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for rep_metrics
ALTER TABLE rep_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company rep metrics" ON rep_metrics
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can insert company rep metrics" ON rep_metrics
  FOR INSERT WITH CHECK (company_id = get_current_user_company_id());

CREATE POLICY "Users can update company rep metrics" ON rep_metrics
  FOR UPDATE USING (company_id = get_current_user_company_id());

-- Add RLS policies for rep_learning_logs
ALTER TABLE rep_learning_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company learning logs" ON rep_learning_logs
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can manage company learning logs" ON rep_learning_logs
  FOR ALL USING (company_id = get_current_user_company_id());

-- Add RLS policies for ai_nudges
ALTER TABLE ai_nudges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own nudges" ON ai_nudges
  FOR SELECT USING (rep_id = auth.uid() AND company_id = get_current_user_company_id());

CREATE POLICY "Users can update their own nudges" ON ai_nudges
  FOR UPDATE USING (rep_id = auth.uid() AND company_id = get_current_user_company_id());

-- Create triggers for updated_at columns
CREATE OR REPLACE TRIGGER update_rep_metrics_updated_at
  BEFORE UPDATE ON rep_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
