
-- Create SalesAgent_Memory table
CREATE TABLE public.SalesAgent_Memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  stage TEXT,
  outcome TEXT,
  follow_up_sent BOOLEAN DEFAULT FALSE,
  last_contact TIMESTAMP WITH TIME ZONE,
  escalation_flag BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ManagerAgent_Memory table
CREATE TABLE public.ManagerAgent_Memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rep_id UUID NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  pipeline_health TEXT,
  task_performance JSONB,
  escalations INTEGER DEFAULT 0,
  feedback_log JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AutomationAgent_Memory table
CREATE TABLE public.AutomationAgent_Memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID NOT NULL DEFAULT gen_random_uuid(),
  trigger_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_type TEXT NOT NULL,
  input_data JSONB,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  resolution_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create DeveloperAgent_Memory table
CREATE TABLE public.DeveloperAgent_Memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL DEFAULT gen_random_uuid(),
  agent_affected TEXT NOT NULL,
  error_type TEXT,
  error_details TEXT,
  resolution_action TEXT,
  retry_count INTEGER DEFAULT 0,
  log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  escalation_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Agent_Trigger_Logs table
CREATE TABLE public.Agent_Trigger_Logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  input_payload JSONB,
  triggered_by TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  result_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for agent tables
ALTER TABLE public.SalesAgent_Memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ManagerAgent_Memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.AutomationAgent_Memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.DeveloperAgent_Memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Agent_Trigger_Logs ENABLE ROW LEVEL SECURITY;

-- Create policies for SalesAgent_Memory
CREATE POLICY "Company can manage SalesAgent_Memory" ON public.SalesAgent_Memory
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = SalesAgent_Memory.lead_id 
    AND l.company_id = get_current_user_company_id()
  ));

-- Create policies for ManagerAgent_Memory
CREATE POLICY "Company can manage ManagerAgent_Memory" ON public.ManagerAgent_Memory
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = ManagerAgent_Memory.rep_id 
    AND p.company_id = get_current_user_company_id()
  ));

-- Create policies for AutomationAgent_Memory
CREATE POLICY "Users can manage AutomationAgent_Memory" ON public.AutomationAgent_Memory
  FOR ALL USING (true);

-- Create policies for DeveloperAgent_Memory
CREATE POLICY "Users can manage DeveloperAgent_Memory" ON public.DeveloperAgent_Memory
  FOR ALL USING (true);

-- Create policies for Agent_Trigger_Logs
CREATE POLICY "Users can manage Agent_Trigger_Logs" ON public.Agent_Trigger_Logs
  FOR ALL USING (true);

-- Add updated_at triggers
CREATE TRIGGER update_SalesAgent_Memory_updated_at 
  BEFORE UPDATE ON public.SalesAgent_Memory 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ManagerAgent_Memory_updated_at 
  BEFORE UPDATE ON public.ManagerAgent_Memory 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_AutomationAgent_Memory_updated_at 
  BEFORE UPDATE ON public.AutomationAgent_Memory 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_DeveloperAgent_Memory_updated_at 
  BEFORE UPDATE ON public.DeveloperAgent_Memory 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
