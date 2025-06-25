
-- Drop old master AI brain tables if they exist
DROP TABLE IF EXISTS master_ai_brain CASCADE;
DROP TABLE IF EXISTS masteraibrain CASCADE;

-- Create new Master AI Brain table
CREATE TABLE master_ai_brain (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logs JSONB DEFAULT '[]',
  realtime_issues JSONB DEFAULT '[]',
  applied_fixes JSONB DEFAULT '[]',
  unresolved_bugs JSONB DEFAULT '[]',
  system_performance JSONB DEFAULT '{}',
  company_overview JSONB DEFAULT '{}',
  integrations_health JSONB DEFAULT '{}',
  company_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create TSAM logs table for ingestion tracking
CREATE TABLE tsam_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  user_id UUID,
  company_id UUID,
  metadata JSONB DEFAULT '{}',
  priority TEXT DEFAULT 'medium',
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature flags table
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  target_audience TEXT DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system updates table
CREATE TABLE system_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_type TEXT NOT NULL,
  description TEXT,
  changes JSONB DEFAULT '{}',
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deployed_by UUID
);

-- Enable RLS on all tables
ALTER TABLE master_ai_brain ENABLE ROW LEVEL SECURITY;
ALTER TABLE tsam_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for developer-only access
CREATE POLICY "Developers only - master_ai_brain" ON master_ai_brain
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY "Developers only - tsam_logs" ON tsam_logs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY "Developers only - feature_flags" ON feature_flags
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY "Developers only - system_updates" ON system_updates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'developer'
  ));

-- Insert initial feature flags
INSERT INTO feature_flags (flag_name, enabled, description, target_audience) VALUES
('ai_suggestions_v2', true, 'Enhanced AI suggestion engine', 'developers'),
('realtime_debugging', false, 'Real-time system debugging tools', 'developers'),
('advanced_analytics', true, 'Advanced user analytics tracking', 'all');

-- Insert initial system update
INSERT INTO system_updates (update_type, description, changes) VALUES
('initialization', 'TSAM Master AI Brain system initialized', '{"version": "1.0.0", "components": ["master_ai_brain", "tsam_logs", "feature_flags"]}');
