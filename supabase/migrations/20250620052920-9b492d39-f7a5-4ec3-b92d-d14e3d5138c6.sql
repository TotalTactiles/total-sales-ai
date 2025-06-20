
-- Create system_error_log table for tracking all system errors and fixes
CREATE TABLE public.system_error_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  component TEXT NOT NULL,
  route TEXT,
  error_type TEXT NOT NULL,
  stack_trace TEXT,
  retry_attempted BOOLEAN DEFAULT false,
  retry_result TEXT,
  fix_type TEXT,
  fixed_by_ai BOOLEAN DEFAULT false,
  escalated BOOLEAN DEFAULT false,
  developer_note TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  ai_fix_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create internal_ai_brain_status table for tracking AI Brain health
CREATE TABLE public.internal_ai_brain_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  system_health_score INTEGER NOT NULL DEFAULT 100,
  last_fix_description TEXT,
  pending_errors INTEGER DEFAULT 0,
  auto_fixes_today INTEGER DEFAULT 0,
  escalation_count INTEGER DEFAULT 0,
  ai_uptime_minutes INTEGER DEFAULT 0,
  last_check_in TIMESTAMP WITH TIME ZONE DEFAULT now(),
  critical_routes_monitored JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.system_error_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_ai_brain_status ENABLE ROW LEVEL SECURITY;

-- Allow developers to read all error logs
CREATE POLICY "Developers can view all system error logs" 
  ON public.system_error_log 
  FOR SELECT 
  USING (get_current_user_role() = 'developer');

-- Allow developers to update error logs
CREATE POLICY "Developers can update system error logs" 
  ON public.system_error_log 
  FOR UPDATE 
  USING (get_current_user_role() = 'developer');

-- Allow AI system to insert error logs
CREATE POLICY "System can insert error logs" 
  ON public.system_error_log 
  FOR INSERT 
  WITH CHECK (true);

-- Allow developers to read AI brain status
CREATE POLICY "Developers can view AI brain status" 
  ON public.internal_ai_brain_status 
  FOR SELECT 
  USING (get_current_user_role() = 'developer');

-- Allow system to update AI brain status
CREATE POLICY "System can update AI brain status" 
  ON public.internal_ai_brain_status 
  FOR ALL 
  USING (true);

-- Insert initial AI brain status record
INSERT INTO public.internal_ai_brain_status (
  system_health_score,
  last_fix_description,
  critical_routes_monitored
) VALUES (
  100,
  'AI Brain initialized successfully',
  '["auth", "dashboard", "leads", "crm", "dialer"]'::jsonb
);

-- Create trigger to update updated_at timestamps
CREATE TRIGGER update_system_error_log_updated_at
  BEFORE UPDATE ON public.system_error_log
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internal_ai_brain_status_updated_at
  BEFORE UPDATE ON public.internal_ai_brain_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
