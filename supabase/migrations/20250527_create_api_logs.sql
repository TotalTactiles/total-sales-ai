-- Table to store API request logs
CREATE TABLE IF NOT EXISTS public.api_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status integer NOT NULL,
  response_time integer NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Index for quick filtering by user
CREATE INDEX IF NOT EXISTS api_logs_user_idx ON public.api_logs(user_id);
