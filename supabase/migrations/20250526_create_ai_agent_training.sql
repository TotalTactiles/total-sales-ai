-- Table to store AI agent voice settings, script templates and rep feedback
CREATE TABLE IF NOT EXISTS public.ai_agent_training (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  call_id uuid REFERENCES public.call_logs(id),
  snippet text,
  rating smallint,
  voice_settings jsonb,
  script_templates jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for quickly fetching a user's settings
CREATE UNIQUE INDEX IF NOT EXISTS ai_agent_training_user_idx ON public.ai_agent_training(user_id) WHERE call_id IS NULL;
