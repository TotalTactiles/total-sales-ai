-- Extend ai_brain_logs with agent and error metadata
ALTER TABLE IF EXISTS public.ai_brain_logs
  ADD COLUMN IF NOT EXISTS agent_id uuid,
  ADD COLUMN IF NOT EXISTS ai_type text,
  ADD COLUMN IF NOT EXISTS error_type text;

CREATE INDEX IF NOT EXISTS ai_brain_logs_agent_id_idx ON public.ai_brain_logs(agent_id);
CREATE INDEX IF NOT EXISTS ai_brain_logs_error_type_idx ON public.ai_brain_logs(error_type);

