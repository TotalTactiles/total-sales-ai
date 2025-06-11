
-- Create table for relevance AI usage tracking
CREATE TABLE IF NOT EXISTS public.relevance_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  tier TEXT NOT NULL DEFAULT 'Basic' CHECK (tier IN ('Basic', 'Pro', 'Elite')),
  requests_used INTEGER NOT NULL DEFAULT 0,
  requests_limit INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for agent task logging
CREATE TABLE IF NOT EXISTS public.ai_agent_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  task_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'retrying')),
  input_payload JSONB,
  output_payload JSONB,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for agent status monitoring
CREATE TABLE IF NOT EXISTS public.ai_agent_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'maintenance')),
  last_health_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  response_time_ms INTEGER,
  error_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  metadata JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.relevance_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_status ENABLE ROW LEVEL SECURITY;

-- RLS policies for relevance_usage
CREATE POLICY "Users can view company relevance usage" ON public.relevance_usage
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can update company relevance usage" ON public.relevance_usage
  FOR ALL USING (company_id = get_current_user_company_id());

-- RLS policies for ai_agent_tasks
CREATE POLICY "Users can view company agent tasks" ON public.ai_agent_tasks
  FOR SELECT USING (company_id = get_current_user_company_id());

CREATE POLICY "Users can insert company agent tasks" ON public.ai_agent_tasks
  FOR INSERT WITH CHECK (company_id = get_current_user_company_id());

CREATE POLICY "Users can update company agent tasks" ON public.ai_agent_tasks
  FOR UPDATE USING (company_id = get_current_user_company_id());

-- RLS policies for ai_agent_status (read-only for users)
CREATE POLICY "Users can view agent status" ON public.ai_agent_status
  FOR SELECT USING (true);

-- Admins can manage agent status
CREATE POLICY "Admins can manage agent status" ON public.ai_agent_status
  FOR ALL USING (get_current_user_role() = 'admin');

-- Insert default agent statuses
INSERT INTO public.ai_agent_status (agent_name, status, metadata) VALUES
  ('salesAgent_v1', 'online', '{"description": "Primary sales assistance agent", "capabilities": ["lead_analysis", "follow_up_generation", "objection_handling"]}'),
  ('managerAgent_v1', 'online', '{"description": "Manager insights and workflow agent", "capabilities": ["team_analytics", "workflow_optimization", "performance_insights"]}'),
  ('automationAgent_v1', 'online', '{"description": "Workflow automation and triggers agent", "capabilities": ["email_sequences", "task_automation", "pipeline_management"]}')
ON CONFLICT (agent_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_relevance_usage_company_id ON public.relevance_usage(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tasks_company_id ON public.ai_agent_tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tasks_status ON public.ai_agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tasks_created_at ON public.ai_agent_tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_agent_status_agent_name ON public.ai_agent_status(agent_name);
